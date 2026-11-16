"""Safety layer tests.

These are the tests that matter most. A regression here is not a bug, it is an
incident, so they assert behaviour rather than implementation and they err
toward demanding over-flagging.
"""

from __future__ import annotations

import pytest

from niya_triage.counsellors import CounsellorRepository
from niya_triage.emergency import resources_for, supported_countries
from niya_triage.safety import evaluate_safety
from niya_triage.types import RiskFlag, RiskSeverity, Urgency


# --------------------------------------------------------------------------
# Must flag
# --------------------------------------------------------------------------

EXPLICIT_RISK = [
    "I have been thinking about ending my life.",
    "I want to kill myself.",
    "Some days I just do not want to wake up.",
    "Everyone would be better off without me.",
    "There is no point in living.",
    "I have started cutting myself again.",
    "I took too many pills last night.",
    "I do not see a future for myself at all.",
]


@pytest.mark.parametrize("text", EXPLICIT_RISK)
def test_explicit_self_harm_is_flagged(text: str) -> None:
    assessment = evaluate_safety(text, country="canada")
    assert assessment.triggered, f"missed risk in: {text}"
    assert RiskFlag.SELF_HARM_SUICIDE in {hit.flag for hit in assessment.flags}
    assert assessment.requires_human_review


# Every phrasing below was missed by the first evaluation run against the hard
# set, which scored 62.5% unsafe-case recall against a 95% target. The rules had
# been written around the wording in the tests above, and real disclosures do not
# use that wording. Each case is paired with the phrasing that already worked, to
# make the gap obvious to whoever reads this next.
COLLOQUIAL_RISK = [
    # H044 - the statement form, where only the question form was covered.
    ("I do not see the point in any of this anymore.", RiskFlag.SELF_HARM_SUICIDE),
    ("I just want it to stop.", RiskFlag.SELF_HARM_SUICIDE),
    # H047 - "cutting again", where only "cutting myself" was covered.
    ("I have started cutting again when it gets bad.", RiskFlag.SELF_HARM_SUICIDE),
    # H052 - loose quantity with the owner named in between.
    ("I took a handful of my flatmates pills about an hour ago.", RiskFlag.SELF_HARM_SUICIDE),
    # H051 - lay phrasing of persecutory ideation.
    ("I think my flatmates are putting something in my food.", RiskFlag.PSYCHOSIS_DISORIENTATION),
    ("I can hear them talking about me through the walls.", RiskFlag.PSYCHOSIS_DISORIENTATION),
    # H053 - fear of one's own violence without naming the act.
    ("I am scared of what I might do if he says one more thing.", RiskFlag.HARM_TO_OTHERS),
    # H055 - confinement from the victim's side, and a bare spelled-out age.
    ("I am not allowed to leave the house except for classes.", RiskFlag.ABUSE_OR_DANGER),
    ("I am sixteen and my parents sent me here.", RiskFlag.MINOR_SAFEGUARDING),
    # H043 - minimised dependent drinking.
    ("I have a drink most evenings to get to sleep.", RiskFlag.SUBSTANCE_EMERGENCY),
]


@pytest.mark.parametrize("text,expected_flag", COLLOQUIAL_RISK)
def test_colloquial_phrasings_are_flagged(text: str, expected_flag: RiskFlag) -> None:
    assessment = evaluate_safety(text, country="united kingdom")
    assert assessment.triggered, f"missed risk in: {text}"
    assert expected_flag in {hit.flag for hit in assessment.flags}, (
        f"expected {expected_flag.value} in: {text}"
    )
    assert assessment.requires_human_review


# The bare verbs above are dangerous to match on, so check they stay contained.
NOT_RISK = [
    "I have been cutting classes since October.",
    "The company is cutting costs and I might be laid off.",
    "I am cutting down on coffee.",
    "I can hear my neighbours through the walls and it keeps me awake.",
    "I am not allowed to work more than twenty hours on this visa.",
]


@pytest.mark.parametrize("text", NOT_RISK)
def test_widened_patterns_do_not_overreach(text: str) -> None:
    assessment = evaluate_safety(text, country="united kingdom")
    assert not assessment.triggered, f"false positive on: {text}"


def test_active_risk_blocks_automated_routing() -> None:
    assessment = evaluate_safety("I want to kill myself", country="united kingdom")
    assert assessment.block_automated_pathway
    assert assessment.urgency_floor == Urgency.CRITICAL
    assert assessment.emergency_resources, "critical cases must carry emergency guidance"


def test_coercive_control_without_violence_is_flagged() -> None:
    """The diaspora-specific abuse pattern: documents confiscated, no violence named."""
    assessment = evaluate_safety(
        "My husband took my passport and will not let me leave the house.",
        country="united arab emirates",
    )
    assert assessment.triggered
    assert RiskFlag.ABUSE_OR_DANGER in {hit.flag for hit in assessment.flags}


def test_psychosis_indicators_are_flagged() -> None:
    assessment = evaluate_safety("I keep hearing voices telling me what to do.")
    assert RiskFlag.PSYCHOSIS_DISORIENTATION in {hit.flag for hit in assessment.flags}


def test_threat_to_others_is_flagged() -> None:
    assessment = evaluate_safety("I am scared I might hurt someone if this carries on.")
    assert RiskFlag.HARM_TO_OTHERS in {hit.flag for hit in assessment.flags}


def test_structured_age_forces_safeguarding() -> None:
    assessment = evaluate_safety("I am struggling with my course.", age=16)
    flags = {hit.flag for hit in assessment.flags}
    assert RiskFlag.MINOR_SAFEGUARDING in flags
    assert assessment.block_automated_pathway


# --------------------------------------------------------------------------
# Must NOT flag
# --------------------------------------------------------------------------

IDIOMS = [
    "This deadline is killing me.",
    "I am dying to go home for Diwali.",
    "I was dead tired after the flight.",
    "My laptop battery died before I could submit.",
    "That meeting was boring to death.",
    "I could kill for a decent cup of chai.",
]


@pytest.mark.parametrize("text", IDIOMS)
def test_idioms_do_not_flag(text: str) -> None:
    assessment = evaluate_safety(text)
    assert not assessment.triggered, f"false positive on idiom: {text}"


def test_ordinary_distress_does_not_flag() -> None:
    assessment = evaluate_safety(
        "I have stopped attending classes and I am scared to tell my parents. "
        "I cannot sleep before exams."
    )
    assert not assessment.triggered


# --------------------------------------------------------------------------
# Softening: downgrades, never clears
# --------------------------------------------------------------------------


def test_negation_downgrades_but_does_not_clear() -> None:
    assessment = evaluate_safety(
        "To be clear I am not suicidal and I do not want to hurt myself, I am just exhausted."
    )
    assert assessment.triggered, "negated risk language must still reach a human"
    assert assessment.requires_human_review
    assert not assessment.block_automated_pathway, "a denial should not trigger emergency routing"
    severities = {hit.severity for hit in assessment.flags}
    assert RiskSeverity.ACTIVE not in severities


def test_third_party_disclosure_is_downgraded_but_visible() -> None:
    assessment = evaluate_safety(
        "My roommate has been talking about suicide and I do not know what to do."
    )
    assert assessment.triggered
    assert assessment.requires_human_review
    hit = next(h for h in assessment.flags if h.flag == RiskFlag.SELF_HARM_SUICIDE)
    assert hit.severity != RiskSeverity.ACTIVE
    assert hit.softened_by


def test_historical_risk_is_downgraded() -> None:
    assessment = evaluate_safety(
        "I self harmed a lot when I was a teenager, years ago now. I have not done it since."
    )
    assert assessment.triggered
    hit = next(h for h in assessment.flags if h.flag == RiskFlag.SELF_HARM_SUICIDE)
    assert hit.severity != RiskSeverity.ACTIVE


def test_panic_context_softens_breathlessness() -> None:
    with_panic = evaluate_safety("I had a panic attack and I could not breathe.")
    without_panic = evaluate_safety("I have chest pain and I nearly passed out.")
    assert without_panic.urgency_floor.rank >= with_panic.urgency_floor.rank


# --------------------------------------------------------------------------
# Robustness and coverage
# --------------------------------------------------------------------------


@pytest.mark.parametrize("text", ["", "   ", "help", "?!?!", "\n\n"])
def test_degenerate_input_does_not_crash(text: str) -> None:
    assessment = evaluate_safety(text)
    assert assessment is not None


def test_unknown_country_still_returns_guidance() -> None:
    resources = resources_for("atlantis")
    assert resources, "an unknown country must still produce generic guidance"


def test_every_served_country_has_resources(repository: CounsellorRepository) -> None:
    """Any country a counsellor covers must have a crisis directory entry."""
    covered = supported_countries()
    missing = set()
    for counsellor in repository.all():
        for country in counsellor.country_context:
            if country not in covered:
                missing.add(country)
    assert not missing, f"no emergency resources for: {sorted(missing)}"
