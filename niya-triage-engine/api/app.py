"""Intake classification API (FastAPI).

    uvicorn api.app:app --reload --port 8000

Interactive docs at http://localhost:8000/docs

The response envelope is a superset of the contract in the project brief: the
brief's exact fields are echoed under `triage`, with the shortlist, reasoning
and safety detail alongside so the review dashboard has something to show.
"""

from __future__ import annotations

import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi import FastAPI, HTTPException  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402
from pydantic import BaseModel, Field  # noqa: E402

from niya_triage import IntakeRequest, __version__, triage  # noqa: E402
from niya_triage.audit import default_log  # noqa: E402
from niya_triage.availability import (  # noqa: E402
    available_days,
    available_slots,
    minimum_notice_hours,
)
from niya_triage.booking import (  # noqa: E402
    BookingError,
    authorise_connection,
    connect_state,
    default_store as booking_store,
)
from niya_triage.contact import collect as collect_contact, mask_email, mask_phone  # noqa: E402
from niya_triage.counsellors import default_repository  # noqa: E402
from niya_triage.emergency import supported_countries  # noqa: E402
from niya_triage.notifications import (  # noqa: E402
    notify_booking_cancelled,
    notify_booking_confirmed,
)
from niya_triage.pipeline import integration_payload  # noqa: E402
from niya_triage.safety import describe_rules  # noqa: E402
from niya_triage.taxonomy import CATEGORIES, PATHWAYS  # noqa: E402
from niya_triage.types import to_plain  # noqa: E402

app = FastAPI(
    title="NIYA triage and matching engine",
    version=__version__,
    description=(
        "Turns a free-text description of a problem into an urgency level, a problem "
        "category, a support pathway, a counsellor shortlist and a next action - with a "
        "rule-based safety layer that runs independently of any language model."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # prototype only; restrict before any real deployment
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TriageIn(BaseModel):
    text: str = Field(..., min_length=1, description="The user's own description of the problem")
    country: str = "unknown"
    timezone: str = "UTC"
    user_type: str = "unknown"
    preferred_languages: List[str] = Field(default_factory=lambda: ["english"])
    desired_timing: str = "flexible"
    structured_answers: Dict[str, Any] = Field(default_factory=dict)
    age: Optional[int] = None
    use_llm: Optional[bool] = None


class ReviewIn(BaseModel):
    case_id: str
    reviewer: str
    action: str = Field(..., description="accepted | overridden | escalated | rejected")
    original_category: str
    final_category: str
    chosen_counsellor: Optional[str] = None
    note: str = ""


@app.get("/health")
def health() -> Dict[str, Any]:
    repository = default_repository()
    return {
        "status": "ok",
        "engine_version": __version__,
        "counsellors_loaded": len(repository),
        "categories": len(CATEGORIES),
        "safety_rules": len(describe_rules()),
    }


@app.post("/triage")
def run_triage(payload: TriageIn) -> Dict[str, Any]:
    try:
        request = IntakeRequest(
            text=payload.text,
            country=payload.country,
            timezone=payload.timezone,
            user_type=payload.user_type,
            preferred_languages=payload.preferred_languages,
            desired_timing=payload.desired_timing,
            structured_answers=payload.structured_answers,
            age=payload.age,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    result = triage(request, use_llm=payload.use_llm)

    return {
        "case_id": result.case_id,
        # The exact contract from the project brief.
        "triage": result.to_api_payload(),
        "urgency": result.urgency.value,
        "themes": result.themes,
        "review_reasons": [reason.value for reason in result.review_reasons],
        "suggested_next_action": result.suggested_next_action,
        "pathway_plan": to_plain(result.pathway_plan),
        "shortlist": to_plain(result.shortlist),
        "rejected_counsellors": to_plain(result.rejected),
        "safety": to_plain(result.safety),
        "emergency_guidance": to_plain(result.emergency_guidance),
        "classification_detail": {
            "method": result.classification.method.value if result.classification else None,
            "llm_agreed": result.classification.llm_agreed if result.classification else None,
            "rationale": result.classification.rationale if result.classification else [],
            "ranked_scores": to_plain(
                [
                    score
                    for score in (result.classification.ranked_scores if result.classification else [])
                    if score.score > 0
                ]
            ),
        },
        "niya_integration": integration_payload(result),
        "processing_ms": round(result.processing_ms, 2),
        "engine_version": result.engine_version,
    }


@app.get("/taxonomy")
def get_taxonomy() -> Dict[str, Any]:
    return {
        "categories": [
            {
                "id": category.id,
                "label": category.label,
                "description": category.description,
                "pathway": category.pathway_id,
                "base_urgency": category.base_urgency.value,
                "required_capabilities": category.required_capabilities,
                "preferred_capabilities": category.preferred_capabilities,
                "inclusion_signal_count": len(category.inclusion),
                "exclusion_signal_count": len(category.exclusion),
                "niya_focus_area_ids": category.niya_focus_area_ids,
                "niya_expertise": category.niya_expertise,
                "mapping_is_approximate": category.mapping_is_approximate,
                "clinical_boundary": category.clinical_boundary,
            }
            for category in CATEGORIES.values()
        ],
        "pathways": [to_plain(pathway) for pathway in PATHWAYS.values()],
    }


@app.get("/counsellors")
def list_counsellors() -> Dict[str, Any]:
    repository = default_repository()
    return {
        "count": len(repository),
        "counsellors": [counsellor.to_dict() for counsellor in repository.all()],
    }


@app.get("/safety/rules")
def safety_rules() -> Dict[str, Any]:
    return {
        "rules": describe_rules(),
        "countries_with_emergency_resources": supported_countries(),
        "policy": (
            "Rules run before and independently of any model. Negation, third-party "
            "attribution and historical framing downgrade a flag but never clear it. "
            "Only a fixed list of literal idioms is fully suppressed."
        ),
    }


@app.get("/review/queue")
def review_queue(limit: int = 50) -> Dict[str, Any]:
    log = default_log()
    reviewed = {
        record["payload"].get("case_id")
        for record in log.iter_records()
        if record.get("event_type") == "human_review"
    }
    pending = [
        record["payload"]
        for record in log.iter_records()
        if record.get("event_type") == "triage_decision"
        and record["payload"].get("human_review_required")
        and record["payload"].get("case_id") not in reviewed
    ]
    pending.reverse()
    return {"pending": len(pending), "cases": pending[:limit]}


@app.post("/review")
def submit_review(payload: ReviewIn) -> Dict[str, Any]:
    record = default_log().log_review(
        case_id=payload.case_id,
        reviewer=payload.reviewer,
        action=payload.action,
        original_category=payload.original_category,
        final_category=payload.final_category,
        chosen_counsellor=payload.chosen_counsellor,
        note=payload.note,
    )
    return {"recorded": True, "seq": record["seq"], "hash": record["hash"]}


@app.get("/audit/verify")
def verify_audit() -> Dict[str, Any]:
    ok, message = default_log().verify()
    return {"intact": ok, "message": message}


# ---------------------------------------------------------------------------
# Booking
#
# Mirrors the shape of NIYA's existing endpoints so the mapping is obvious, but
# fixes three things production gets wrong. The differences are called out on
# each endpoint and set out in full in docs/BOOKING.md.
# ---------------------------------------------------------------------------


class HoldIn(BaseModel):
    case_id: str
    counsellor_id: str
    slot_id: str
    client_timezone: str = "UTC"
    urgency: str = "moderate"
    primary_category: str = ""
    email: Optional[str] = None
    phone: Optional[str] = None
    full_name: str = ""
    country: str = ""


class PayIn(BaseModel):
    booking_id: str
    provider_reference: str
    signature: str


class ConnectIn(BaseModel):
    booking_id: str
    party: str = "client"


@app.get("/booking/slots")
def booking_slots(
    counsellor_id: str,
    client_timezone: str = "UTC",
    urgency: str = "moderate",
    on_date: Optional[str] = None,
) -> Dict[str, Any]:
    """Free slots for a counsellor, rendered in the caller's timezone.

    Production's equivalent (`view_coach_availability`) returns IST wall-clock
    strings with no timezone attached, and has no endpoint at all for "which
    days have availability" - the date picker offers every future date and the
    user discovers emptiness by clicking.
    """
    counsellor = default_repository().get(counsellor_id)
    if counsellor is None:
        raise HTTPException(status_code=404, detail=f"No counsellor {counsellor_id}")

    store = booking_store()
    taken = store.taken_slot_ids(counsellor_id)

    target_date = None
    if on_date:
        try:
            target_date = datetime.strptime(on_date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="on_date must be YYYY-MM-DD")

    slots = available_slots(
        counsellor,
        taken_slot_ids=taken,
        urgency=urgency,
        on_date_local=target_date,
        viewer_timezone=client_timezone,
    )
    days = available_days(
        counsellor,
        taken_slot_ids=taken,
        urgency=urgency,
        viewer_timezone=client_timezone,
    )
    return {
        "counsellor_id": counsellor_id,
        "counsellor_timezone": counsellor.timezone,
        "client_timezone": client_timezone,
        "minimum_notice_hours": minimum_notice_hours(urgency),
        "available_days": [day.isoformat() for day in days],
        "slots": [slot.to_dict(viewer_timezone=client_timezone) for slot in slots],
    }


@app.post("/booking/hold")
def booking_hold(payload: HoldIn) -> Dict[str, Any]:
    """Reserve a slot *before* payment.

    Production creates the booking after payment, on the success page, so a user
    can pay for a slot that was taken while they were on the gateway.
    """
    counsellor = default_repository().get(payload.counsellor_id)
    if counsellor is None:
        raise HTTPException(status_code=404, detail=f"No counsellor {payload.counsellor_id}")

    contact = collect_contact(
        email=payload.email,
        phone=payload.phone,
        full_name=payload.full_name,
        country=payload.country,
    )
    if not contact.is_valid:
        raise HTTPException(status_code=422, detail=contact.errors)

    try:
        booking = booking_store().hold(
            case_id=payload.case_id,
            counsellor_id=counsellor.id,
            counsellor_name=counsellor.display_name,
            counsellor_timezone=counsellor.timezone,
            slot_id=payload.slot_id,
            contact=contact,
            client_timezone=payload.client_timezone,
            urgency=payload.urgency,
            primary_category=payload.primary_category,
        )
    except BookingError as error:
        raise HTTPException(status_code=409, detail=str(error))

    return {
        "booking": _booking_payload(booking),
        "payment_due": {
            "amount_minor": booking.payment.amount_minor,
            "currency": booking.payment.currency,
        },
        "note": (
            "Slot is held, not booked. Complete /booking/pay before the hold expires."
        ),
    }


@app.post("/booking/pay")
def booking_pay(payload: PayIn) -> Dict[str, Any]:
    """Verify the payment server-side, then confirm and notify.

    Production's `confirm_payment` verifies nothing - it trusts a URL parameter
    and writes the payment id to a column that does not exist.
    """
    try:
        booking = booking_store().confirm_payment(
            payload.booking_id, payload.provider_reference, payload.signature
        )
    except BookingError as error:
        raise HTTPException(status_code=402, detail=str(error))

    messages = notify_booking_confirmed(booking)
    return {
        "booking": _booking_payload(booking),
        "notifications_queued": [
            {"channel": message.channel, "kind": message.kind, "to": message.to_masked}
            for message in messages
        ],
    }


@app.get("/booking/{booking_id}")
def booking_detail(booking_id: str) -> Dict[str, Any]:
    booking = booking_store().get(booking_id)
    if booking is None:
        raise HTTPException(status_code=404, detail=f"No booking {booking_id}")
    return {"booking": _booking_payload(booking)}


@app.post("/booking/connect")
def booking_connect(payload: ConnectIn) -> Dict[str, Any]:
    """Issue a room token, but only inside the joining window.

    This is the endpoint that differs most from production. There,
    `GET /bx_block_calendar/booked_slots/video_call` returns a Twilio token to
    any authenticated caller holding a booking id, at any time of day; the
    five-minute rule exists only in React and is bypassed by calling the API
    directly. Here the window is enforced at the point the token is minted.
    """
    store = booking_store()
    booking = store.get(payload.booking_id)
    if booking is None:
        raise HTTPException(status_code=404, detail=f"No booking {payload.booking_id}")

    grant = authorise_connection(booking, payload.party)
    if not grant["authorised"]:
        raise HTTPException(status_code=403, detail=grant)

    store.record_connection(booking.id, payload.party, "joined")
    return grant


@app.post("/booking/{booking_id}/cancel")
def booking_cancel(booking_id: str, reason: str = "cancelled by user") -> Dict[str, Any]:
    try:
        booking = booking_store().cancel(booking_id, reason=reason)
    except BookingError as error:
        raise HTTPException(status_code=404, detail=str(error))
    messages = notify_booking_cancelled(booking)
    return {
        "booking": _booking_payload(booking),
        "notifications_queued": len(messages),
    }


def _booking_payload(booking) -> Dict[str, Any]:
    """Booking as JSON, with contact details masked and the window spelled out."""
    payload = booking.to_dict()
    payload.pop("contact_email", None)
    payload.pop("contact_phone", None)
    payload["contact"] = {
        "email": mask_email(booking.contact_email),
        "phone": mask_phone(booking.contact_phone),
    }
    payload["start_local"] = booking.start_local().isoformat()
    payload["end_local"] = booking.end_local().isoformat()
    payload["connect"] = connect_state(booking)
    return payload
