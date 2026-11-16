"""Phase 2 - the intake classifier (deterministic half).

This is a weighted-evidence lexicon scorer, not a model. It exists for three
reasons:

1. It works with no API key, no network and no cost, so the whole system is
   testable and reproducible in CI.
2. It is fully explainable. Every point of score traces to a phrase a
   counsellor can read and argue with, which is what makes the human-review
   dashboard useful rather than decorative.
3. It gives the LLM something to disagree *with*. Agreement between two
   independent methods is a far better confidence signal than one model's
   self-reported probability.

``pipeline.py`` optionally reconciles this with ``llm.py``.

Overlap handling matters here: in "I cannot sleep", both "cannot sleep" (3.0)
and "sleep" (1.5) are registered signals for the same category. Longer phrases
are matched first and their character spans consumed, so the shorter phrase
cannot double-count.
"""

from __future__ import annotations

import math
from typing import Dict, List, Optional, Sequence, Tuple

from . import textutil
from .taxonomy import (
    CATEGORIES,
    SELECTABLE_CATEGORY_IDS,
    THEME_LEXICON,
    Category,
)
from .types import (
    CategoryScore,
    Classification,
    ClassificationMethod,
    IntakeRequest,
    SafetyAssessment,
    Urgency,
    UserType,
)

#: Below this much evidence the engine does not trust its own answer.
MIN_EVIDENCE = 2.5
#: A secondary category must reach this fraction of the winner's score.
SECONDARY_RATIO = 0.40
MAX_SECONDARY = 3
#: Confidence under this routes to human review.
LOW_CONFIDENCE_THRESHOLD = 0.55
#: Winner and runner-up this close counts as an ambiguous call.
CLOSE_CALL_MARGIN = 0.12
#: Structured answers are evidence, but weaker than what the user wrote freely.
STRUCTURED_WEIGHT = 0.5
#: A winner resting on one phrase is capped below LOW_CONFIDENCE_THRESHOLD, so a
#: single-word match always reaches a human instead of being asserted.
SINGLE_SIGNAL_CONFIDENCE_CAP = 0.50
#: Repeated mentions add something, but with diminishing returns.
REPEAT_BONUS = 0.25
MAX_REPEAT_MULTIPLIER = 1.75
#: Distinct well-evidenced categories needed before urgency steps up on its own.
COMPOUNDING_DOMAIN_THRESHOLD = 3
#: Categories excluded from the compounding count - they are consequences of
#: other problems rather than independent life domains.
COMPOUNDING_EXEMPT = {"acute_distress"}

_URGENCY_STEP_UP = {
    Urgency.LOW.value: Urgency.MODERATE.value,
    Urgency.MODERATE.value: Urgency.HIGH.value,
    Urgency.HIGH.value: Urgency.HIGH.value,
    Urgency.CRITICAL.value: Urgency.CRITICAL.value,
}


def _score_signals(
    normalised: str,
    signals: Sequence[Tuple[str, float]],
    multiplier: float = 1.0,
) -> Tuple[float, List[str]]:
    """Weighted evidence with longest-match-wins overlap suppression."""
    if not normalised:
        return 0.0, []

    ordered = sorted(signals, key=lambda item: len(item[0]), reverse=True)
    consumed: List[Tuple[int, int]] = []
    total = 0.0
    matched: List[str] = []

    for phrase, weight in ordered:
        spans = textutil.find_phrase_spans(normalised, phrase)
        if not spans:
            continue
        fresh = 0
        for start, end in spans:
            overlaps = any(start < c_end and end > c_start for c_start, c_end in consumed)
            if overlaps:
                continue
            consumed.append((start, end))
            fresh += 1
        if fresh == 0:
            continue
        repeat_multiplier = min(1.0 + REPEAT_BONUS * (fresh - 1), MAX_REPEAT_MULTIPLIER)
        total += weight * repeat_multiplier * multiplier
        matched.append(phrase if fresh == 1 else f"{phrase} (x{fresh})")

    return total, matched


def _structured_text(request: IntakeRequest) -> str:
    parts: List[str] = []
    for key, value in (request.structured_answers or {}).items():
        if isinstance(value, (list, tuple, set)):
            parts.extend(str(item) for item in value)
        elif value is not None:
            parts.append(str(value))
    return textutil.normalise(" . ".join(parts))


def _score_category(
    category: Category,
    normalised: str,
    structured: str,
    request: IntakeRequest,
) -> CategoryScore:
    score, matched = _score_signals(normalised, category.inclusion)

    if structured:
        extra_score, extra_matched = _score_signals(
            structured, category.inclusion, multiplier=STRUCTURED_WEIGHT
        )
        score += extra_score
        matched.extend(f"[structured] {item}" for item in extra_matched)

    penalties: List[str] = []
    if score > 0:
        penalty_total, penalty_matched = _score_signals(normalised, category.exclusion)
        if penalty_total:
            score -= penalty_total
            penalties.extend(penalty_matched)

    priors: List[str] = []
    prior = category.user_type_priors.get(request.user_type)
    if prior and score > 0:
        score += prior
        priors.append(f"user_type={request.user_type.value} ({prior:+.1f})")

    return CategoryScore(
        category_id=category.id,
        score=max(0.0, score),
        matched_signals=matched,
        penalties=penalties,
        priors_applied=priors,
    )


def _detect_themes(normalised: str) -> List[str]:
    found: List[str] = []
    for theme, phrases in THEME_LEXICON.items():
        if textutil.contains_any_phrase(normalised, phrases):
            found.append(theme)
    return found


def _resolve_urgency(
    category: Category,
    normalised: str,
    request: IntakeRequest,
    safety: Optional[SafetyAssessment],
    compounding_domains: int = 0,
) -> Tuple[Urgency, List[str]]:
    urgency = category.base_urgency
    notes: List[str] = [f"base urgency for {category.id} is {urgency.value}"]

    for phrase, escalated in category.urgency_escalators:
        if textutil.contains_phrase(normalised, phrase):
            if escalated.rank > urgency.rank:
                urgency = escalated
                notes.append(f"raised to {escalated.value} by '{phrase}'")

    # Distress spread across several life domains at once is itself an acuity
    # signal: someone whose studies, sleep and family relationships are all
    # failing simultaneously is in more trouble than the individual scores
    # suggest. This is what makes the brief's worked example "high" rather than
    # "moderate" - no single phrase in it is alarming on its own.
    if compounding_domains >= COMPOUNDING_DOMAIN_THRESHOLD and urgency.rank < Urgency.HIGH.rank:
        urgency = Urgency(_URGENCY_STEP_UP[urgency.value])
        notes.append(
            f"raised to {urgency.value}: {compounding_domains} life domains affected at once"
        )

    timing = (request.desired_timing or "").strip().lower()
    if timing in {"immediate", "today", "asap", "as soon as possible"} and urgency.rank < Urgency.HIGH.rank:
        urgency = Urgency.HIGH
        notes.append(f"raised to high because requested timing is '{timing}'")

    if safety is not None and safety.urgency_floor.rank > urgency.rank:
        urgency = safety.urgency_floor
        notes.append(f"raised to {urgency.value} by the safety layer")

    return urgency, notes


def _confidence(ranked: List[CategoryScore]) -> Tuple[float, float]:
    """Returns (confidence, margin).

    Confidence blends two independent things: how much evidence was found at
    all, and how clearly the winner beat the runner-up. A long message matching
    one category weakly should not score the same as a short unambiguous one.
    """
    if not ranked or ranked[0].score <= 0:
        return 0.15, 0.0

    top = ranked[0].score
    second = ranked[1].score if len(ranked) > 1 else 0.0
    margin = (top - second) / top if top > 0 else 0.0

    evidence_factor = min(1.0, math.log1p(top) / math.log1p(9.0))
    confidence = 0.30 + (0.35 * margin) + (0.35 * evidence_factor)

    if top < MIN_EVIDENCE:
        confidence = min(confidence, 0.40)

    # When nothing else scores, margin is 1.0 by construction and contributes
    # its full weight - so a lone matched phrase could reach 0.86 confidence.
    # Being uncontested is not the same as being well evidenced. One phrase is
    # one phrase, and a human should read it.
    if len(ranked[0].matched_signals) <= 1:
        confidence = min(confidence, SINGLE_SIGNAL_CONFIDENCE_CAP)

    return max(0.05, min(0.97, confidence)), margin


def classify(
    request: IntakeRequest,
    safety: Optional[SafetyAssessment] = None,
) -> Classification:
    """Rule-based classification. Deterministic for a given input."""
    # Figurative language is masked here as well as in the safety layer. The two
    # layers were originally independent, which meant safety correctly ignored
    # "my laptop battery died" while the classifier scored it 3.0 on the grief
    # category's "died" signal and recommended a bereavement specialist.
    normalised, figurative = textutil.mask_figurative(
        textutil.normalise(request.text or "")
    )
    structured = _structured_text(request)

    scored = [
        _score_category(CATEGORIES[cid], normalised, structured, request)
        for cid in SELECTABLE_CATEGORY_IDS
    ]
    ranked = sorted(scored, key=lambda item: (-item.score, item.category_id))
    positive = [item for item in ranked if item.score > 0]

    themes = _detect_themes(normalised)

    # Safety outranks the lexicon entirely.
    if safety is not None and safety.block_automated_pathway:
        return Classification(
            primary_category="immediate_safety_risk",
            secondary_categories=[item.category_id for item in positive[:2]],
            urgency=Urgency.CRITICAL,
            confidence_score=0.99,
            method=ClassificationMethod.RULES,
            ranked_scores=ranked,
            themes=themes + ["safety risk"],
            rationale=[
                "Safety layer returned an active risk flag; category assignment is "
                "overridden and no pathway is recommended automatically."
            ],
        )

    if not positive:
        return Classification(
            primary_category="adjustment_loneliness",
            secondary_categories=[],
            urgency=Urgency.MODERATE if safety is None else safety.urgency_floor,
            confidence_score=0.12,
            method=ClassificationMethod.RULES,
            ranked_scores=ranked,
            themes=themes,
            rationale=[
                "No category signal matched. Defaulted to general adjustment support "
                "and flagged for human review; the engine is explicitly not confident."
            ],
        )

    primary = positive[0]
    category = CATEGORIES[primary.category_id]
    confidence, margin = _confidence(positive)

    threshold = primary.score * SECONDARY_RATIO
    secondaries = [
        item.category_id
        for item in positive[1 : MAX_SECONDARY + 1]
        if item.score >= threshold
    ]

    compounding_domains = len(
        [
            item
            for item in positive
            if item.score >= MIN_EVIDENCE and item.category_id not in COMPOUNDING_EXEMPT
        ]
    )
    urgency, urgency_notes = _resolve_urgency(
        category, normalised, request, safety, compounding_domains
    )

    rationale = list(urgency_notes)
    rationale.append(
        f"matched on: {', '.join(primary.matched_signals[:8]) or 'no explicit phrase'}"
    )
    if primary.penalties:
        rationale.append(f"penalised by competing context: {', '.join(primary.penalties)}")
    if margin < CLOSE_CALL_MARGIN and len(positive) > 1:
        rationale.append(
            f"close call: {positive[1].category_id} scored {positive[1].score:.1f} "
            f"against {primary.score:.1f}"
        )
    if figurative:
        rationale.append(
            "ignored figurative language: " + ", ".join(sorted(set(figurative)))
        )

    return Classification(
        primary_category=primary.category_id,
        secondary_categories=secondaries,
        urgency=urgency,
        confidence_score=confidence,
        method=ClassificationMethod.RULES,
        ranked_scores=ranked,
        themes=themes,
        rationale=rationale,
    )


def classification_margin(classification: Classification) -> float:
    positive = [item for item in classification.ranked_scores if item.score > 0]
    if len(positive) < 2 or positive[0].score <= 0:
        return 1.0
    return (positive[0].score - positive[1].score) / positive[0].score


def top_evidence(classification: Classification) -> float:
    positive = [item for item in classification.ranked_scores if item.score > 0]
    return positive[0].score if positive else 0.0


def preferred_counsellor_attributes(
    classification: Classification,
    request: IntakeRequest,
) -> List[str]:
    """The `preferred_counsellor_attributes` field from the brief's output block.

    Capability tags from the primary and secondary categories, plus a language
    tag in the brief's own style ("english_hindi").
    """
    attributes: List[str] = []

    def add(value: str) -> None:
        if value and value not in attributes:
            attributes.append(value)

    primary = CATEGORIES.get(classification.primary_category)
    if primary is not None:
        for cap in primary.required_capabilities:
            add(cap)
        for cap in primary.preferred_capabilities[:2]:
            add(cap)

    for cid in classification.secondary_categories:
        secondary = CATEGORIES.get(cid)
        if secondary is None:
            continue
        for cap in secondary.required_capabilities[:1]:
            add(cap)

    languages = [lang for lang in request.preferred_languages if lang]
    if languages:
        add("_".join(languages[:2]))

    return attributes
