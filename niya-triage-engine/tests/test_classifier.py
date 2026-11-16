"""Classifier tests.

These assert invariants and the worked example from the brief. They deliberately
do NOT assert a headline accuracy figure - that belongs in the evaluation
harness, where it can be reported against the hard set with its caveats intact.
"""

from __future__ import annotations

import pytest

from niya_triage import IntakeRequest
from niya_triage.classifier import (
    classification_margin,
    classify,
    preferred_counsellor_attributes,
)
from niya_triage.safety import evaluate_safety
from niya_triage.taxonomy import CATEGORIES, SELECTABLE_CATEGORY_IDS
from niya_triage.types import Urgency, UserType

CANONICAL = (
    "I moved to Canada six months ago. I have stopped attending classes, "
    "I am scared to tell my parents, and I cannot sleep before exams."
)


def test_canonical_example_from_the_brief() -> None:
    request = IntakeRequest(
        text=CANONICAL,
        country="canada",
        timezone="America/Toronto",
        user_type="student",
        preferred_languages=["english", "hindi"],
    )
    result = classify(request, safety=evaluate_safety(CANONICAL, country="canada"))

    assert result.primary_category == "academic_avoidance"
    assert "family_parent_pressure" in result.secondary_categories
    assert "sleep_routine_breakdown" in result.secondary_categories
    # High but not an emergency - exactly what the brief specifies.
    assert result.urgency == Urgency.HIGH
    assert result.urgency != Urgency.CRITICAL


def test_canonical_example_themes() -> None:
    result = classify(IntakeRequest(text=CANONICAL, user_type="student"))
    for theme in ("avoidance", "sleep disruption", "parent pressure"):
        assert theme in result.themes, f"missing theme: {theme}"


def test_figurative_death_language_does_not_reach_the_grief_category() -> None:
    """Regression: the classifier used to score 'died' from a dead laptop battery.

    The safety layer masked these idioms from the start, but the classifier
    scored the raw text, so this message was returned as grief and bereavement
    at high urgency with 0.86 confidence, and a bereavement specialist was
    recommended. Both layers now mask the same phrases.
    """
    text = "This deadline is killing me and I am dead tired. My laptop battery died too."
    result = classify(IntakeRequest(text=text, user_type="student"))

    assert result.primary_category != "grief_life_transition"
    assert "grief_life_transition" not in result.secondary_categories
    grief = next(
        item for item in result.ranked_scores if item.category_id == "grief_life_transition"
    )
    assert grief.score == 0.0
    # It is an ordinary academic complaint, and not an urgent one.
    assert result.urgency == Urgency.MODERATE


def test_a_single_matched_phrase_is_never_confident() -> None:
    """Regression: an uncontested winner got margin 1.0 and so scored ~0.86.

    Being the only category that scored is not evidence of being right. One
    phrase must stay under the review threshold.
    """
    result = classify(IntakeRequest(text="I have a deadline.", user_type="student"))
    top = result.ranked_scores[0]

    assert len(top.matched_signals) == 1
    assert result.confidence_score <= 0.50


def test_overlapping_phrases_are_not_double_counted() -> None:
    """'cannot sleep' (3.0) must suppress the shorter 'sleep' (1.5)."""
    result = classify(IntakeRequest(text="I cannot sleep."))
    sleep_score = next(
        score for score in result.ranked_scores if score.category_id == "sleep_routine_breakdown"
    )
    assert sleep_score.score == pytest.approx(3.0, abs=0.01)


def test_safety_category_is_not_lexically_selectable() -> None:
    assert "immediate_safety_risk" not in SELECTABLE_CATEGORY_IDS
    result = classify(IntakeRequest(text="I feel unsafe and at risk and in danger."))
    assert result.primary_category != "immediate_safety_risk"


def test_active_safety_overrides_category() -> None:
    text = "I have stopped attending classes and I want to kill myself."
    safety = evaluate_safety(text, country="canada")
    result = classify(IntakeRequest(text=text, user_type="student"), safety=safety)
    assert result.primary_category == "immediate_safety_risk"
    assert result.urgency == Urgency.CRITICAL


def test_empty_input_is_low_confidence_not_a_crash() -> None:
    result = classify(IntakeRequest(text=""))
    assert result.confidence_score < 0.3
    assert result.primary_category in CATEGORIES


def test_user_type_prior_separates_study_from_work() -> None:
    text = "I am completely behind and I cannot keep up. I have missed the deadline twice."
    student = classify(IntakeRequest(text=text, user_type=UserType.STUDENT))
    professional = classify(IntakeRequest(text=text, user_type=UserType.PROFESSIONAL))
    assert student.primary_category != professional.primary_category or (
        student.confidence_score != professional.confidence_score
    )


def test_compounding_domains_raise_urgency() -> None:
    """Several domains failing at once is an acuity signal in itself."""
    single = classify(
        IntakeRequest(text="I have been feeling lonely since I moved here.", user_type="student")
    )
    compound = classify(IntakeRequest(text=CANONICAL, user_type="student"))
    assert compound.urgency.rank > single.urgency.rank


def test_close_call_is_detectable() -> None:
    result = classify(IntakeRequest(text=CANONICAL, user_type="student"))
    assert 0.0 <= classification_margin(result) <= 1.0


def test_preferred_attributes_include_language_tag() -> None:
    request = IntakeRequest(
        text=CANONICAL, user_type="student", preferred_languages=["english", "hindi"]
    )
    attributes = preferred_counsellor_attributes(classify(request), request)
    assert "english_hindi" in attributes
    assert "international_student_experience" in attributes


def test_classification_is_deterministic() -> None:
    request = IntakeRequest(text=CANONICAL, user_type="student")
    first = classify(request)
    second = classify(request)
    assert first.primary_category == second.primary_category
    assert first.confidence_score == pytest.approx(second.confidence_score)


@pytest.mark.parametrize(
    "text,expected",
    [
        ("My manager micromanages me and took credit for my work.", "manager_conflict"),
        ("My visa expires next month and my application was refused.", "visa_immigration_anxiety"),
        ("My grandmother passed away and I could not go home for the funeral.", "grief_life_transition"),
        ("I cannot afford my rent and I am in debt.", "financial_precarity"),
        ("People keep telling me to go back to my country because of my accent.", "discrimination_identity"),
    ],
)
def test_unambiguous_cases_land_correctly(text: str, expected: str) -> None:
    assert classify(IntakeRequest(text=text)).primary_category == expected
