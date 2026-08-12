"""Matching engine tests, focused on the hard gates.

The weighted score is a preference; the gates are a guarantee. These tests
mostly check the guarantees, because those are the ones with consequences.
"""

from __future__ import annotations

from niya_triage import IntakeRequest
from niya_triage.classifier import classify
from niya_triage.config import MATCH_WEIGHTS, validate_weights
from niya_triage.counsellors import CounsellorRepository
from niya_triage.matching import (
    build_shortlist,
    required_complexity,
    score_historical_outcome,
)
from niya_triage.safety import evaluate_safety
from niya_triage.types import Classification, Urgency


def test_weights_sum_to_one() -> None:
    validate_weights()
    assert abs(sum(MATCH_WEIGHTS.values()) - 1.0) < 1e-9


def test_inactive_counsellor_is_never_shortlisted(repository: CounsellorRepository) -> None:
    """C019 is inactive but highly available - a naive scorer would rank her first."""
    request = IntakeRequest(
        text="I have been feeling very low and cannot cope.",
        country="canada",
        timezone="America/Vancouver",
        user_type="student",
    )
    classification = classify(request)
    shortlist, rejected = build_shortlist(classification, request, repository)
    assert "C019" not in {match.counsellor_id for match in shortlist}
    assert any(item.counsellor_id == "C019" for item in rejected)


def test_counsellor_at_capacity_is_excluded(repository: CounsellorRepository) -> None:
    request = IntakeRequest(
        text="I have stopped attending classes and I am behind on my coursework.",
        country="canada",
        timezone="America/Toronto",
        user_type="student",
    )
    classification = classify(request)
    shortlist, rejected = build_shortlist(classification, request, repository)
    assert "C018" not in {match.counsellor_id for match in shortlist}
    reason = next(item.reason for item in rejected if item.counsellor_id == "C018")
    assert "capacity" in reason.lower()


def test_risk_case_only_reaches_escalation_capable_counsellors(
    repository: CounsellorRepository,
) -> None:
    request = IntakeRequest(
        text="I have been thinking about ending my life and I cannot go on.",
        country="canada",
        timezone="America/Toronto",
        user_type="student",
    )
    safety = evaluate_safety(request.text, country=request.country)
    classification = classify(request, safety=safety)
    shortlist, _ = build_shortlist(classification, request, repository, safety=safety)

    for match in shortlist:
        counsellor = repository.get(match.counsellor_id)
        assert counsellor is not None
        assert counsellor.escalation_capability, f"{counsellor.id} is not escalation-capable"
        assert counsellor.crisis_trained, f"{counsellor.id} is not crisis-trained"


def test_clinical_case_requires_clinical_qualification(
    repository: CounsellorRepository,
) -> None:
    request = IntakeRequest(
        text=(
            "I was diagnosed with bipolar disorder years ago and I stopped taking my "
            "medication when I moved."
        ),
        country="germany",
        timezone="Europe/Berlin",
        user_type="professional",
    )
    classification = classify(request)
    assert classification.primary_category == "clinical_escalation"

    shortlist, _ = build_shortlist(classification, request, repository)
    for match in shortlist:
        counsellor = repository.get(match.counsellor_id)
        assert counsellor is not None and counsellor.clinically_qualified


def test_required_complexity_escalates_with_safety() -> None:
    safety = evaluate_safety("I want to kill myself")
    classification = Classification(primary_category="acute_distress", urgency=Urgency.HIGH)
    assert required_complexity(classification, safety) == "critical"


def test_outcome_score_is_shrunk_for_low_volume(repository: CounsellorRepository) -> None:
    """C011 has near-perfect ratings over 11 sessions; C017 is strong over 289.

    Without shrinkage the newcomer would win the outcome term outright, which
    would mean the term is measuring sample size rather than quality.
    """
    newcomer = repository.get("C011")
    veteran = repository.get("C017")
    assert newcomer is not None and veteran is not None
    assert newcomer.satisfaction > veteran.satisfaction
    assert score_historical_outcome(newcomer) < score_historical_outcome(veteran)


def test_language_preference_changes_a_counsellors_score(
    repository: CounsellorRepository,
) -> None:
    """C017 speaks Tamil but not Urdu, so the same case should score her differently.

    Asserted on the score rather than on shortlist ordering: problem fit carries
    twice the weight of language, so a strong specialist can legitimately stay
    top of the list in both. The requirement is that language *moves* the score,
    not that it dominates it.
    """
    base_text = "I cannot sleep and my routine has completely broken down."

    def score_for(languages):
        request = IntakeRequest(
            text=base_text,
            country="united kingdom",
            timezone="Europe/London",
            user_type="student",
            preferred_languages=languages,
        )
        shortlist, _ = build_shortlist(classify(request), request, repository, limit=25)
        return {match.counsellor_id: match for match in shortlist}

    tamil = score_for(["tamil", "english"])
    urdu = score_for(["urdu", "english"])

    assert "C017" in tamil and "C017" in urdu
    assert tamil["C017"].breakdown.language_fit == 1.0
    assert urdu["C017"].breakdown.language_fit < 1.0
    assert tamil["C017"].score > urdu["C017"].score


def test_shortlist_is_deterministic(repository: CounsellorRepository) -> None:
    request = IntakeRequest(
        text="I have stopped attending classes and I am scared to tell my parents.",
        country="canada",
        timezone="America/Toronto",
        user_type="student",
    )
    classification = classify(request)
    first, _ = build_shortlist(classification, request, repository)
    second, _ = build_shortlist(classification, request, repository)
    assert [m.counsellor_id for m in first] == [m.counsellor_id for m in second]


def test_breakdown_components_are_bounded(repository: CounsellorRepository) -> None:
    request = IntakeRequest(
        text="My manager micromanages me and takes credit for my work.",
        country="united states",
        timezone="America/New_York",
        user_type="professional",
    )
    shortlist, _ = build_shortlist(classify(request), request, repository)
    for match in shortlist:
        for value in vars(match.breakdown).values():
            assert 0.0 <= value <= 1.0
        assert 0.0 <= match.score <= 1.0
