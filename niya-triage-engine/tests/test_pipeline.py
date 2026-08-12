"""End-to-end pipeline and audit-log tests."""

from __future__ import annotations

import pytest

from niya_triage import IntakeRequest, triage
from niya_triage.audit import AuditLog
from niya_triage.counsellors import CounsellorRepository
from niya_triage.pipeline import integration_payload
from niya_triage.types import ReviewReason, Urgency

CANONICAL = (
    "I moved to Canada six months ago. I have stopped attending classes, "
    "I am scared to tell my parents, and I cannot sleep before exams."
)


def _request(text: str, **kwargs) -> IntakeRequest:
    defaults = dict(
        country="canada", timezone="America/Toronto", user_type="student",
        preferred_languages=["english", "hindi"],
    )
    defaults.update(kwargs)
    return IntakeRequest(text=text, **defaults)


def test_api_payload_matches_the_brief_contract(repository: CounsellorRepository) -> None:
    result = triage(_request(CANONICAL), repository=repository, use_llm=False, log=False)
    payload = result.to_api_payload()

    assert set(payload) == {
        "primary_category",
        "secondary_categories",
        "urgency",
        "confidence_score",
        "recommended_pathway",
        "human_review_required",
        "risk_flags",
        "preferred_counsellor_attributes",
    }
    assert payload["primary_category"] == "academic_avoidance"
    assert payload["recommended_pathway"] == "study_recovery"
    assert payload["urgency"] == "high"
    assert payload["risk_flags"] == []
    assert payload["human_review_required"] is True
    assert 0.0 <= payload["confidence_score"] <= 1.0


def test_canonical_case_produces_a_shortlist(repository: CounsellorRepository) -> None:
    result = triage(_request(CANONICAL), repository=repository, use_llm=False, log=False)
    assert result.shortlist
    assert result.pathway_plan is not None
    assert result.pathway_plan.first_session_within_hours == 24
    assert result.suggested_next_action


def test_safety_case_blocks_booking_and_shows_guidance(
    repository: CounsellorRepository,
) -> None:
    result = triage(
        _request("I have been thinking about ending my life."),
        repository=repository,
        use_llm=False,
        log=False,
    )
    assert result.urgency == Urgency.CRITICAL
    assert result.recommended_pathway == "crisis_escalation"
    assert result.human_review_required
    assert ReviewReason.SAFETY_FLAG in result.review_reasons
    assert result.emergency_guidance, "a critical case must carry country guidance"
    assert "988" in " ".join(item.contact for item in result.emergency_guidance)
    assert "do not auto-book" in result.suggested_next_action.lower()


def test_short_intake_is_flagged_for_review(repository: CounsellorRepository) -> None:
    result = triage(_request("help"), repository=repository, use_llm=False, log=False)
    assert result.human_review_required
    assert ReviewReason.SHORT_INTAKE in result.review_reasons


@pytest.mark.parametrize(
    "text",
    ["", "   ", "?????", "a", "\n\t", "12345", "ok thanks"],
)
def test_degenerate_input_does_not_crash(text: str, repository: CounsellorRepository) -> None:
    result = triage(_request(text), repository=repository, use_llm=False, log=False)
    assert result.case_id
    assert result.human_review_required


def test_processing_is_far_inside_the_two_minute_target(
    repository: CounsellorRepository,
) -> None:
    result = triage(_request(CANONICAL), repository=repository, use_llm=False, log=False)
    assert result.processing_ms < 2000, "rules-only triage should be milliseconds, not seconds"


def test_integration_payload_maps_to_real_niya_ids(
    repository: CounsellorRepository,
) -> None:
    result = triage(_request(CANONICAL), repository=repository, use_llm=False, log=False)
    payload = integration_payload(result)

    # 69 = Fear of Failure, 70 = Imposter Syndrome in assesment_test_type_answers.
    assert 69 in payload["focus_area_ids"]
    assert payload["coach_expertise_labels"]
    assert payload["mapping_is_approximate"] is True, (
        "academic_avoidance has no exact NIYA focus area and must say so"
    )


# --------------------------------------------------------------------------
# Audit log
# --------------------------------------------------------------------------


def test_audit_log_chain_verifies(tmp_path, repository: CounsellorRepository) -> None:
    log = AuditLog(tmp_path / "decisions.jsonl")
    for text in [CANONICAL, "I cannot sleep at all.", "My manager shouts at me."]:
        result = triage(_request(text), repository=repository, use_llm=False, log=False)
        log.log_triage(result, text, "canada")

    ok, message = log.verify()
    assert ok, message
    assert len(log.read_all()) == 3


def test_audit_log_detects_tampering(tmp_path, repository: CounsellorRepository) -> None:
    path = tmp_path / "decisions.jsonl"
    log = AuditLog(path)
    result = triage(_request(CANONICAL), repository=repository, use_llm=False, log=False)
    log.log_triage(result, CANONICAL, "canada")
    log.log_triage(result, "second entry", "canada")

    contents = path.read_text(encoding="utf-8").replace("academic_avoidance", "adjustment_loneliness")
    path.write_text(contents, encoding="utf-8")

    ok, message = log.verify()
    assert not ok
    assert "modified" in message.lower() or "broken" in message.lower()


def test_audit_log_redacts_contact_details(tmp_path, repository: CounsellorRepository) -> None:
    text = "Please call me on +44 7700 900123 or email me at student@example.ac.uk. I cannot sleep."
    log = AuditLog(tmp_path / "decisions.jsonl")
    result = triage(_request(text), repository=repository, use_llm=False, log=False)
    log.log_triage(result, text, "united kingdom")

    stored = log.read_all()[0]["payload"]["redacted_text"]
    assert "900123" not in stored
    assert "student@example.ac.uk" not in stored
    assert "[EMAIL]" in stored
