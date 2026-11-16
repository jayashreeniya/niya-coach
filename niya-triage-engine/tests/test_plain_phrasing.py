"""Ordinary wording must reach the right category.

Every text here was submitted by a real user, or is a minimal variation on one.
All of them scored zero against every category and were routed to generic
adjustment support at 12% confidence, because signals match whole words and the
lexicon knew "at work" but not "workplace", "sleep" but not "sleeping".

The hard set never caught this. It is full of euphemism and misdirection and
contains nothing as plain as "need workplace coaching", so it read 68% while
the engine could not classify a simple sentence.
"""

from __future__ import annotations

import pytest

from niya_triage.classifier import classify
from niya_triage.types import IntakeRequest


def category_for(text: str, **kwargs) -> str:
    return classify(IntakeRequest(text=text, **kwargs)).primary_category


def confidence_for(text: str, **kwargs) -> float:
    return classify(IntakeRequest(text=text, **kwargs)).confidence_score


# ---------------------------------------------------------------------------
# The exact texts that failed in production
# ---------------------------------------------------------------------------


def test_a_bare_request_for_workplace_coaching_is_understood():
    assert category_for("need workplace coaching") == "work_performance_pressure"


def test_trouble_at_the_workplace_is_not_read_as_loneliness():
    text = (
        "i have been in Canada for last six months. but recently i am facing "
        "some issues at workplace where i am interning"
    )
    assert category_for(text) == "work_performance_pressure"


def test_sleeping_issues_reach_the_sleep_category():
    text = "I am having some sleeping issues. I feel tired and sad all the time"
    assert category_for(text) == "sleep_routine_breakdown"


# ---------------------------------------------------------------------------
# The word-boundary trap itself
# ---------------------------------------------------------------------------


@pytest.mark.parametrize(
    "text",
    [
        "problems at workplace",
        "stress at my workplace",
        "i need help with work stress",
        "struggling at work",
        "issues at work",
    ],
)
def test_workplace_wording_lands_somewhere_work_related(text):
    assert category_for(text) in {"work_performance_pressure", "manager_conflict"}


@pytest.mark.parametrize(
    "text",
    [
        "sleeping issues",
        "sleep issues",
        "trouble sleeping",
        "difficulty sleeping",
        "i am barely sleeping",
        "poor sleep for weeks",
    ],
)
def test_sleep_wording_lands_on_sleep(text):
    assert category_for(text) == "sleep_routine_breakdown"


def test_these_are_not_merely_defaulting():
    """The failure mode was a confident-looking default, not a near miss.

    A category can be right by accident when everything scores zero, since the
    fallback has to pick something. Confidence above the floor proves an actual
    signal matched.
    """
    assert confidence_for("need workplace coaching") > 0.12
    assert confidence_for("i am having sleeping issues") > 0.12


# ---------------------------------------------------------------------------
# Not at the cost of precision
# ---------------------------------------------------------------------------


def test_a_gym_class_is_still_not_academic_avoidance():
    """The widened vocabulary must not start swallowing the false-positive traps."""
    text = (
        "I stopped attending my gym classes and my running club since the "
        "winter. I am fine at university, just sluggish and a bit low."
    )
    assert category_for(text) != "academic_avoidance"


def test_a_manager_still_beats_generic_work_wording():
    """Specific evidence must outrank the weak signals just added."""
    text = "my manager keeps criticising me in front of the team at work"
    assert category_for(text) == "manager_conflict"


def test_nonsense_still_defaults_and_is_not_forced_into_a_category():
    """Honest uncertainty is the correct answer to a word we do not know."""
    result = classify(IntakeRequest(text="need workkplace coaching"))
    assert result.confidence_score <= 0.12
