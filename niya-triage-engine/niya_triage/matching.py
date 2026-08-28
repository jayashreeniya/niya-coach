"""Phase 3 (part 2) - the counsellor matching engine.

    MatchScore = 0.30*ProblemFit + 0.20*Availability + 0.15*LanguageFit
               + 0.15*CulturalFit + 0.10*TimezoneFit + 0.10*HistoricalOutcome

Weights live in ``config.MATCH_WEIGHTS`` and are the brief's stated assumptions.
They are assumptions, not findings, and `eval/calibrate.py` exists to move them
once real coordinator-acceptance data is available.

Two design choices worth defending:

**Hard gates run before scoring.** A weighted sum can always be out-argued by a
high score elsewhere, which is exactly what you do not want when the question is
"is this person qualified to hold a disclosure of abuse". Eligibility is
therefore boolean and separate: fail a gate and you are not ranked at all, no
matter how good the other five terms look.

**Outcome scores are shrunk toward the mean for low-volume counsellors.** A new
counsellor with two five-star ratings should not outrank a veteran at 4.6 across
three hundred sessions. Without this the outcome term mostly measures sample size.
"""

from __future__ import annotations

from typing import Dict, List, Optional, Sequence, Tuple

from . import config, tz
from .counsellors import COMPLEXITY_RANK, Counsellor, CounsellorRepository
from .taxonomy import CATEGORIES, get_category, pathway_for_category
from .types import (
    Classification,
    CounsellorMatch,
    IntakeRequest,
    MatchBreakdown,
    RejectedCounsellor,
    SafetyAssessment,
    Urgency,
)

#: Hours of the user's day we consider reasonable for a session.
USER_REASONABLE_HOURS = (8.0, 22.0)
#: Sessions needed before a counsellor's outcome record is taken at face value.
OUTCOME_CONFIDENCE_SESSIONS = 25.0
#: Capability tags that signal lived cultural proximity.
CULTURAL_CAPABILITIES = ("south_asian_diaspora", "first_generation_migrant", "identity_and_belonging")


# --------------------------------------------------------------------------
# Eligibility
# --------------------------------------------------------------------------


def required_complexity(classification: Classification, safety: Optional[SafetyAssessment]) -> str:
    if safety is not None and safety.block_automated_pathway:
        return "critical"
    category = CATEGORIES.get(classification.primary_category)
    if category is not None and category.clinical_boundary:
        return "high"
    if classification.urgency == Urgency.CRITICAL:
        return "critical"
    if classification.urgency == Urgency.HIGH:
        return "high"
    return "moderate"


def check_gates(
    counsellor: Counsellor,
    classification: Classification,
    request: IntakeRequest,
    safety: Optional[SafetyAssessment],
) -> Optional[str]:
    """Returns a rejection reason, or None if the counsellor is eligible."""
    if not counsellor.active:
        return "inactive profile"
    if not counsellor.has_capacity:
        return f"at capacity ({counsellor.active_cases}/{counsellor.max_cases} cases)"

    complexity = required_complexity(classification, safety)
    if not counsellor.handles_complexity(complexity):
        return (
            f"case complexity '{complexity}' exceeds this counsellor's ceiling "
            f"('{counsellor.max_complexity}')"
        )

    if safety is not None and safety.triggered and not counsellor.escalation_capability:
        return "risk flags present and counsellor is not escalation-capable"

    category = CATEGORIES.get(classification.primary_category)
    if category is not None and category.clinical_boundary and not counsellor.clinically_qualified:
        return "presentation may need a clinically qualified professional"

    if classification.primary_category == "immediate_safety_risk" and not counsellor.crisis_trained:
        return "safety risk case requires crisis-trained counsellor"

    if not counsellor.serves_client_type(request.user_type.value):
        return f"does not take {request.user_type.value} clients"

    return None


# --------------------------------------------------------------------------
# Component scores, each in [0, 1]
# --------------------------------------------------------------------------


def _clamp(value: float) -> float:
    return max(0.0, min(1.0, value))


def score_problem_fit(counsellor: Counsellor, classification: Classification) -> Tuple[float, List[str], List[str]]:
    primary_id = classification.primary_category
    category = CATEGORIES.get(primary_id)

    primary_experience = _clamp(counsellor.category_experience.get(primary_id, 0.0))

    required = list(category.required_capabilities) if category else []
    preferred = list(category.preferred_capabilities) if category else []
    held = {cap.strip().lower() for cap in counsellor.capabilities}

    met = [cap for cap in required if cap.lower() in held]
    missing = [cap for cap in required if cap.lower() not in held]
    preferred_met = [cap for cap in preferred if cap.lower() in held]

    required_fraction = (len(met) / len(required)) if required else 1.0
    preferred_fraction = (len(preferred_met) / len(preferred)) if preferred else 1.0

    secondary_scores = [
        _clamp(counsellor.category_experience.get(cid, 0.0))
        for cid in classification.secondary_categories
    ]
    secondary_experience = sum(secondary_scores) / len(secondary_scores) if secondary_scores else 0.0

    score = (
        0.45 * primary_experience
        + 0.30 * required_fraction
        + 0.15 * preferred_fraction
        + 0.10 * secondary_experience
    )
    return _clamp(score), met + preferred_met, missing


def score_availability(counsellor: Counsellor, sla_hours: int) -> float:
    sla = float(sla_hours) if sla_hours and sla_hours > 0 else 24.0
    ratio = max(0.0, counsellor.next_available_hours) / sla
    # 1.0 when immediately free, 0.5 at exactly the SLA, decaying after.
    slot_score = 1.0 / (1.0 + ratio * ratio)
    return _clamp(0.75 * slot_score + 0.25 * counsellor.capacity_headroom)


def score_language_fit(counsellor: Counsellor, request: IntakeRequest) -> Tuple[float, str]:
    preferences = [lang for lang in request.preferred_languages if lang]
    if not preferences:
        return 1.0, "no language preference stated"

    if counsellor.speaks(preferences[0]):
        return 1.0, f"speaks {preferences[0]}"

    others = [lang for lang in preferences[1:] if counsellor.speaks(lang)]
    if others:
        return 0.75, f"speaks {others[0]} (second preference)"

    if counsellor.speaks("english"):
        return 0.35, "shares only English, not the stated preference"

    return 0.0, "no shared language"


def score_cultural_fit(counsellor: Counsellor, request: IntakeRequest) -> Tuple[float, List[str]]:
    reasons: List[str] = []
    score = 0.0

    if counsellor.knows_country(request.country):
        score += 0.40
        reasons.append(f"knows the {request.country.title()} context")

    if counsellor.diaspora_background:
        score += 0.25
        reasons.append("shares a diaspora background")

    if counsellor.serves_client_type(request.user_type.value):
        score += 0.15

    held = {cap.strip().lower() for cap in counsellor.capabilities}
    cultural_hits = [cap for cap in CULTURAL_CAPABILITIES if cap in held]
    if cultural_hits:
        score += 0.20 * (len(cultural_hits) / len(CULTURAL_CAPABILITIES))
        reasons.append(", ".join(cultural_hits).replace("_", " "))

    return _clamp(score), reasons


def _interval_overlap(a_start: float, a_end: float, b_start: float, b_end: float) -> float:
    return max(0.0, min(a_end, b_end) - max(a_start, b_start))


def score_timezone_fit(counsellor: Counsellor, request: IntakeRequest) -> Tuple[float, float]:
    user_offset = tz.offset_hours(request.timezone)
    counsellor_offset = tz.offset_hours(counsellor.timezone)
    shift = user_offset - counsellor_offset

    start_local, end_local = counsellor.working_hours_local
    span = max(0.5, float(end_local) - float(start_local))

    shifted_start = float(start_local) + shift
    shifted_end = float(end_local) + shift

    # Try the day before, the same day and the day after to handle wraparound.
    overlap = max(
        _interval_overlap(
            shifted_start + offset * 24.0,
            shifted_end + offset * 24.0,
            USER_REASONABLE_HOURS[0],
            USER_REASONABLE_HOURS[1],
        )
        for offset in (-1, 0, 1)
    )
    overlap_fraction = _clamp(overlap / span)

    distance = tz.hours_apart(request.timezone, counsellor.timezone)
    proximity = _clamp(1.0 - (distance / 12.0))

    return _clamp(0.65 * overlap_fraction + 0.35 * proximity), overlap


def score_historical_outcome(counsellor: Counsellor) -> float:
    satisfaction = _clamp((counsellor.satisfaction - 1.0) / 4.0) if counsellor.satisfaction else 0.5
    raw = (
        0.40 * satisfaction
        + 0.25 * _clamp(counsellor.completion_rate)
        + 0.20 * _clamp(counsellor.return_rate)
        + 0.15 * _clamp(1.0 - counsellor.rematch_rate)
    )
    # Shrink toward the mean until there is enough volume to believe the record.
    weight = _clamp(counsellor.sessions_delivered / OUTCOME_CONFIDENCE_SESSIONS)
    return _clamp(weight * raw + (1.0 - weight) * 0.5)


# --------------------------------------------------------------------------
# Shortlist
# --------------------------------------------------------------------------


def score_counsellor(
    counsellor: Counsellor,
    classification: Classification,
    request: IntakeRequest,
    sla_hours: int,
    weights: Optional[Dict[str, float]] = None,
) -> CounsellorMatch:
    weights = weights or config.MATCH_WEIGHTS

    problem_fit, capabilities_met, capabilities_missing = score_problem_fit(counsellor, classification)
    availability = score_availability(counsellor, sla_hours)
    language_fit, language_reason = score_language_fit(counsellor, request)
    cultural_fit, cultural_reasons = score_cultural_fit(counsellor, request)
    timezone_fit, overlap_hours = score_timezone_fit(counsellor, request)
    historical = score_historical_outcome(counsellor)

    breakdown = MatchBreakdown(
        problem_fit=problem_fit,
        availability=availability,
        language_fit=language_fit,
        cultural_fit=cultural_fit,
        timezone_fit=timezone_fit,
        historical_outcome=historical,
    )
    total = breakdown.weighted_total(weights)

    rationale: List[str] = []
    category = CATEGORIES.get(classification.primary_category)
    experience = counsellor.category_experience.get(classification.primary_category, 0.0)
    if experience >= 0.7 and category is not None:
        rationale.append(f"Strong track record in {category.label.lower()}")
    elif experience >= 0.4 and category is not None:
        rationale.append(f"Some experience with {category.label.lower()}")
    else:
        rationale.append("Limited direct experience with this presentation")

    if counsellor.next_available_hours <= sla_hours:
        rationale.append(
            f"Free in {counsellor.next_available_hours:.0f}h, inside the {sla_hours}h target"
        )
    else:
        rationale.append(
            f"Next free in {counsellor.next_available_hours:.0f}h, past the {sla_hours}h target"
        )

    rationale.append(language_reason)
    if cultural_reasons:
        rationale.append("; ".join(cultural_reasons))
    if overlap_hours >= 1.0:
        rationale.append(f"{overlap_hours:.0f}h of workable overlap with the user's day")
    else:
        rationale.append("Almost no overlap with the user's waking hours")
    if counsellor.sessions_delivered < OUTCOME_CONFIDENCE_SESSIONS:
        rationale.append(
            f"Outcome record still thin ({counsellor.sessions_delivered} sessions), score moderated"
        )
    if capabilities_missing:
        rationale.append("Missing: " + ", ".join(cap.replace("_", " ") for cap in capabilities_missing))

    return CounsellorMatch(
        counsellor_id=counsellor.id,
        display_name=counsellor.display_name,
        score=total,
        breakdown=breakdown,
        rationale=rationale,
        earliest_slot_hours=counsellor.next_available_hours,
        capabilities_met=capabilities_met,
        capabilities_missing=capabilities_missing,
    )


def build_shortlist(
    classification: Classification,
    request: IntakeRequest,
    repository: CounsellorRepository,
    safety: Optional[SafetyAssessment] = None,
    weights: Optional[Dict[str, float]] = None,
    limit: Optional[int] = None,
) -> Tuple[List[CounsellorMatch], List[RejectedCounsellor]]:
    """Rank every counsellor who is eligible for this case.

    Everyone who passes the gates is returned, in order of fit. `limit` exists
    for callers that genuinely want the top few, such as the audit log and the
    evaluation harness; the client-facing flow passes nothing and gets the lot.

    Truncating by default was a mistake worth recording. A cap of three meant a
    newly onboarded counsellor was invisible: with no delivered sessions they
    scored below anyone with a track record, so they could not be booked, so
    they never acquired a track record. The first real counsellor onboarded
    through the admin portal ranked fourth of twenty-one and never appeared.
    Ranking answers "who fits best", which is useful. Truncating answers "who
    is allowed to be chosen", which is not the engine's decision to make.
    """
    try:
        pathway = pathway_for_category(classification.primary_category)
        sla_hours = pathway.first_session_within_hours or 24
    except KeyError:
        sla_hours = 24

    matches: List[CounsellorMatch] = []
    rejected: List[RejectedCounsellor] = []

    for counsellor in repository.all():
        reason = check_gates(counsellor, classification, request, safety)
        if reason is not None:
            rejected.append(
                RejectedCounsellor(
                    counsellor_id=counsellor.id,
                    display_name=counsellor.display_name,
                    reason=reason,
                )
            )
            continue
        matches.append(score_counsellor(counsellor, classification, request, sla_hours, weights))

    matches.sort(key=lambda item: (-item.score, item.counsellor_id))

    # MIN_VIABLE_MATCH_SCORE no longer removes anyone. A weak score means "this
    # is further down the list", not "you may not see this person", and a client
    # reading the profiles can weigh a modest fit against a fee or a language in
    # a way the score cannot. The threshold still decides whether the case is
    # flagged for human review, which is what it is actually good for.
    return (matches[:limit] if limit else matches), rejected
