"""End-to-end orchestration: intake text in, routed case out.

Order of operations is deliberate and should not be rearranged casually:

    1. Safety rules run FIRST, on the raw text, with no model involvement.
    2. The rule classifier runs, and is told the safety verdict so it cannot
       assign a gentler category than the evidence allows.
    3. The LLM, if configured, is consulted as a SECOND opinion only.
    4. Reconciliation decides who wins - and the LLM is only allowed to make
       the outcome more cautious, never less.
    5. Matching runs, unless safety has blocked automated routing entirely.
    6. Everything is written to the tamper-evident audit log.

The reconciliation rule in step 4 is the interesting one. When the two methods
disagree, the winner depends on how much lexical evidence the rule layer
actually found: strong evidence keeps the rule answer, weak evidence defers to
the model, and either way the case goes to a human. Disagreement between two
independent methods is treated as information, not noise.
"""

from __future__ import annotations

import time
import uuid
from typing import List, Optional

from . import classifier, config, llm as llm_module, matching
from .audit import AuditLog, default_log
from .counsellors import CounsellorRepository, default_repository
from .safety import evaluate_safety
from .taxonomy import CATEGORIES, get_category, get_pathway, niya_expertise_labels, niya_focus_area_ids
from .textutil import normalise, word_count
from .types import (
    Classification,
    ClassificationMethod,
    IntakeRequest,
    PathwayPlan,
    ReviewReason,
    TriageResult,
    Urgency,
)

#: Intakes shorter than this are too thin to route confidently.
MIN_INTAKE_WORDS = 8
#: Rule evidence above this beats a disagreeing model.
RULE_TRUST_THRESHOLD = 5.0


def _new_case_id() -> str:
    return "case_" + uuid.uuid4().hex[:12]


def _reconcile(
    rule_result: Classification,
    opinion: Optional["llm_module.LLMOpinion"],
) -> Classification:
    """Merge the model's opinion into the rule result. Caution only ever increases."""
    if opinion is None:
        return rule_result

    rule_result.method = ClassificationMethod.HYBRID
    evidence = classifier.top_evidence(rule_result)
    agreed = opinion.primary_category == rule_result.primary_category
    rule_result.llm_agreed = agreed

    if agreed:
        rule_result.confidence_score = min(0.97, rule_result.confidence_score + 0.10)
        rule_result.rationale.append(
            f"Language model independently agreed on '{opinion.primary_category}'."
        )
    else:
        if evidence < classifier.MIN_EVIDENCE:
            rule_result.rationale.append(
                f"Rule evidence was weak ({evidence:.1f}); deferring to the model's "
                f"'{opinion.primary_category}' over '{rule_result.primary_category}'."
            )
            if rule_result.primary_category not in rule_result.secondary_categories:
                rule_result.secondary_categories.insert(0, rule_result.primary_category)
            rule_result.primary_category = opinion.primary_category
        elif evidence >= RULE_TRUST_THRESHOLD:
            rule_result.rationale.append(
                f"Model suggested '{opinion.primary_category}' but rule evidence was "
                f"strong ({evidence:.1f}); keeping '{rule_result.primary_category}'."
            )
            if opinion.primary_category not in rule_result.secondary_categories:
                rule_result.secondary_categories.insert(0, opinion.primary_category)
        else:
            rule_result.rationale.append(
                f"Rules and model disagree ('{rule_result.primary_category}' vs "
                f"'{opinion.primary_category}') with only moderate evidence; sending to review."
            )
            if opinion.primary_category not in rule_result.secondary_categories:
                rule_result.secondary_categories.insert(0, opinion.primary_category)

        rule_result.confidence_score = max(0.10, rule_result.confidence_score - 0.20)

    # The model may raise urgency, never lower it.
    if opinion.urgency is not None and opinion.urgency.rank > rule_result.urgency.rank:
        rule_result.urgency = opinion.urgency
        rule_result.rationale.append(f"Model raised urgency to {opinion.urgency.value}.")

    for theme in opinion.themes:
        if theme not in rule_result.themes:
            rule_result.themes.append(theme)

    rule_result.secondary_categories = [
        cid for cid in rule_result.secondary_categories if cid != rule_result.primary_category
    ][:3]

    return rule_result


def _build_pathway_plan(category_id: str, blocked: bool) -> PathwayPlan:
    category = CATEGORIES.get(category_id)
    pathway = get_pathway("crisis_escalation") if blocked else get_pathway(
        category.pathway_id if category else "adjustment_support"
    )
    return PathwayPlan(
        pathway_id=pathway.id,
        label=pathway.label,
        description=pathway.description,
        first_session_within_hours=pathway.first_session_within_hours,
        session_plan=pathway.session_plan,
        modality=pathway.modality,
        next_action=pathway.next_action,
    )


def triage(
    request: IntakeRequest,
    repository: Optional[CounsellorRepository] = None,
    use_llm: Optional[bool] = None,
    log: bool = True,
    audit_log: Optional[AuditLog] = None,
    case_id: Optional[str] = None,
) -> TriageResult:
    """Run the full triage. Safe to call with arbitrary user input."""
    started = time.perf_counter()
    case_id = case_id or _new_case_id()

    # 1. Safety first, always, rules only.
    safety = evaluate_safety(request.text, country=request.country, age=request.age)

    # 2. Rule classification.
    classification = classifier.classify(request, safety=safety)

    # 3 & 4. Optional second opinion.
    should_use_llm = llm_module.is_available() if use_llm is None else use_llm
    opinion = llm_module.get_opinion(request) if should_use_llm else None
    if opinion is not None:
        classification = _reconcile(classification, opinion)

    review_reasons: List[ReviewReason] = []
    if safety.triggered:
        review_reasons.append(ReviewReason.SAFETY_FLAG)
    if classification.urgency.rank >= Urgency.HIGH.rank:
        review_reasons.append(ReviewReason.HIGH_URGENCY)
    if classification.confidence_score < classifier.LOW_CONFIDENCE_THRESHOLD:
        review_reasons.append(ReviewReason.LOW_CONFIDENCE)
    if classifier.classification_margin(classification) < classifier.CLOSE_CALL_MARGIN:
        review_reasons.append(ReviewReason.CLOSE_CALL)
    if word_count(normalise(request.text)) < MIN_INTAKE_WORDS:
        review_reasons.append(ReviewReason.SHORT_INTAKE)

    clinical_ids = {classification.primary_category, *classification.secondary_categories}
    if any(
        CATEGORIES.get(cid) is not None and CATEGORIES[cid].clinical_boundary for cid in clinical_ids
    ):
        review_reasons.append(ReviewReason.CLINICAL_BOUNDARY)

    # A model that smells risk the rules missed forces a human look.
    if opinion is not None and opinion.risk_suspected and not safety.triggered:
        review_reasons.append(ReviewReason.SAFETY_FLAG)
        classification.rationale.append(
            "Model reported a possible risk indicator the rule layer did not match: "
            f"{opinion.risk_note or 'no detail given'}. Escalated for human review."
        )
        if classification.urgency.rank < Urgency.HIGH.rank:
            classification.urgency = Urgency.HIGH

    # 5. Matching, unless safety has taken over.
    repo = repository or default_repository()
    shortlist, rejected = matching.build_shortlist(
        classification, request, repo, safety=safety
    )
    if not shortlist or shortlist[0].score < config.MIN_VIABLE_MATCH_SCORE:
        review_reasons.append(ReviewReason.NO_ELIGIBLE_COUNSELLOR)

    plan = _build_pathway_plan(classification.primary_category, safety.block_automated_pathway)

    if safety.block_automated_pathway:
        next_action = (
            "STOP. Do not auto-book. Alert the on-call safety reviewer now. Show the user "
            "the country emergency information below. A trained human owns this case from "
            "this point; the system has made no clinical judgement and offered no advice."
        )
    elif shortlist:
        best = shortlist[0]
        next_action = (
            f"Offer {best.display_name} with a first session within "
            f"{plan.first_session_within_hours}h ({plan.session_plan}). "
            f"Confirm the match with a coordinator before booking."
            if ReviewReason.SAFETY_FLAG in review_reasons or classification.confidence_score < classifier.LOW_CONFIDENCE_THRESHOLD
            else f"Offer {best.display_name} with a first session within "
            f"{plan.first_session_within_hours}h, then {plan.session_plan}."
        )
    else:
        next_action = (
            "No counsellor currently clears the eligibility gates for this case. "
            "Route to a coordinator to widen availability or arrange an external referral."
        )

    # De-duplicate while preserving order.
    seen = set()
    ordered_reasons: List[ReviewReason] = []
    for reason in review_reasons:
        if reason not in seen:
            seen.add(reason)
            ordered_reasons.append(reason)

    result = TriageResult(
        case_id=case_id,
        primary_category=classification.primary_category,
        secondary_categories=classification.secondary_categories,
        urgency=classification.urgency,
        confidence_score=classification.confidence_score,
        recommended_pathway=plan.pathway_id,
        human_review_required=bool(ordered_reasons),
        review_reasons=ordered_reasons,
        risk_flags=safety.flag_values,
        preferred_counsellor_attributes=classifier.preferred_counsellor_attributes(
            classification, request
        ),
        themes=classification.themes,
        pathway_plan=plan,
        suggested_next_action=next_action,
        shortlist=shortlist,
        rejected=rejected,
        safety=safety,
        classification=classification,
        emergency_guidance=safety.emergency_resources,
        processing_ms=(time.perf_counter() - started) * 1000.0,
        engine_version=config.ENGINE_VERSION,
    )

    if log:
        try:
            (audit_log or default_log()).log_triage(result, request.text, request.country)
        except Exception:  # auditing must never break the user-facing path
            pass

    return result


def integration_payload(result: TriageResult) -> dict:
    """Translate a result into the vocabulary NIYA's existing Rails matcher speaks.

    This is what an integration would POST. It is produced here so the mapping is
    testable, but nothing in this repository sends it anywhere.
    """
    categories = [result.primary_category, *result.secondary_categories]
    return {
        "focus_area_ids": niya_focus_area_ids(categories),
        "coach_expertise_labels": niya_expertise_labels(categories),
        "urgency": result.urgency.value,
        "requires_escalation_capable_coach": bool(result.risk_flags),
        "human_review_required": result.human_review_required,
        "mapping_is_approximate": any(
            CATEGORIES[cid].mapping_is_approximate for cid in categories if cid in CATEGORIES
        ),
    }
