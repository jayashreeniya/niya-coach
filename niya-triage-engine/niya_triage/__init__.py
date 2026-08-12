"""NIYA AI triage and counsellor-matching engine.

A prototype that turns a free-text description of a problem into a routed case:
urgency, category, support pathway, counsellor shortlist and next action, with
a rule-based safety layer that runs independently of any language model.

Quick start::

    from niya_triage import IntakeRequest, triage

    result = triage(IntakeRequest(
        text="I moved to Canada six months ago and stopped attending classes.",
        country="canada",
        timezone="America/Toronto",
        user_type="student",
        preferred_languages=["english", "hindi"],
    ))
    print(result.to_api_payload())

The engine runs on the Python standard library alone. FastAPI, Streamlit and
the OpenAI SDK are optional extras used by the API, the dashboard and the
second-opinion classifier respectively.
"""

from .availability import Slot, available_days, available_slots
from .booking import Booking, BookingError, BookingStatus, BookingStore, connect_state
from .config import ENGINE_VERSION
from .contact import ContactDetails, collect as collect_contact
from .counsellors import Counsellor, CounsellorRepository
from .pipeline import integration_payload, triage
from .safety import evaluate_safety
from .types import (
    Classification,
    CounsellorMatch,
    EmergencyResource,
    IntakeRequest,
    RiskFlag,
    RiskSeverity,
    SafetyAssessment,
    TriageResult,
    Urgency,
    UserType,
)

__version__ = ENGINE_VERSION

__all__ = [
    "Booking",
    "BookingError",
    "BookingStatus",
    "BookingStore",
    "Classification",
    "ContactDetails",
    "Counsellor",
    "CounsellorMatch",
    "CounsellorRepository",
    "EmergencyResource",
    "ENGINE_VERSION",
    "IntakeRequest",
    "Slot",
    "available_days",
    "available_slots",
    "collect_contact",
    "connect_state",
    "RiskFlag",
    "RiskSeverity",
    "SafetyAssessment",
    "TriageResult",
    "Urgency",
    "UserType",
    "evaluate_safety",
    "integration_payload",
    "triage",
    "__version__",
]
