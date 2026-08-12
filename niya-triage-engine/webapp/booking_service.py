"""Booking operations against the database.

The prototype's `niya_triage.booking` module did this against a JSON file with a
process-level lock. This is the same state machine backed by real storage, where
the double-booking guarantee comes from a unique index rather than a lock that
only holds within one process.

Slot generation and the joining-window arithmetic are reused from the engine
(`niya_triage.availability`), so the timezone handling has exactly one
implementation.
"""

from __future__ import annotations

import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from niya_triage.availability import (
    Slot,
    available_days,
    available_slots,
    minimum_notice_hours,
    parse_slot_id,
    to_zone,
    utc_now,
)
from niya_triage.counsellors import Counsellor

from . import notify, payments, roster, settings
from .models import (
    CONNECT_CLOSES_MINUTES_AFTER,
    CONNECT_OPENS_MINUTES_BEFORE,
    HOLD_MINUTES,
    Account,
    Booking,
    ConnectionEvent,
    CounsellorProfile,
    Payment,
    TriageCase,
    utcnow,
)

LIVE_STATUSES = ("held", "confirmed", "completed")


class BookingError(RuntimeError):
    pass


# ---------------------------------------------------------------------------
# Availability
# ---------------------------------------------------------------------------


def _taken_slot_ids(session: Session, counsellor_id: str) -> List[str]:
    rows = session.scalars(
        select(Booking.slot_id).where(
            Booking.counsellor_id == counsellor_id,
            Booking.status.in_(LIVE_STATUSES),
        )
    ).all()
    return list(rows)


def _expire_stale_holds(session: Session, now: Optional[datetime] = None) -> int:
    """Release slots whose hold lapsed unpaid.

    Runs on read rather than on a timer, so an abandoned checkout frees the slot
    for the next person without needing a background job.
    """
    reference = now or utcnow()
    stale = session.scalars(
        select(Booking).where(
            Booking.status == "held", Booking.hold_expires_at.isnot(None)
        )
    ).all()

    released = 0
    for booking in stale:
        expires = booking.hold_expires_at
        if expires.tzinfo is None:
            expires = expires.replace(tzinfo=timezone.utc)
        if expires < reference:
            booking.status = "expired"
            booking.release_slot()
            released += 1
    if released:
        session.commit()
    return released


def slots_for(
    session: Session,
    counsellor: Counsellor,
    client_timezone: str,
    urgency: str = "moderate",
    on_date=None,
) -> List[Slot]:
    _expire_stale_holds(session)
    return available_slots(
        counsellor,
        taken_slot_ids=_taken_slot_ids(session, counsellor.id),
        urgency=urgency,
        on_date_local=on_date,
        viewer_timezone=client_timezone,
    )


def days_for(
    session: Session, counsellor: Counsellor, client_timezone: str, urgency: str = "moderate"
) -> List:
    _expire_stale_holds(session)
    return available_days(
        counsellor,
        taken_slot_ids=_taken_slot_ids(session, counsellor.id),
        urgency=urgency,
        viewer_timezone=client_timezone,
    )


# ---------------------------------------------------------------------------
# Holding and paying
# ---------------------------------------------------------------------------


def hold_slot(
    session: Session,
    account: Account,
    counsellor: Counsellor,
    slot_id: str,
    case: Optional[TriageCase] = None,
    client_timezone: Optional[str] = None,
    now: Optional[datetime] = None,
) -> Booking:
    """Reserve a slot and create its pending payment.

    Held before charging, so nobody pays for a session that was taken while they
    were on the payment page.
    """
    reference = now or utcnow()
    _expire_stale_holds(session, now=reference)

    slot = parse_slot_id(slot_id)
    if slot is None:
        raise BookingError("That time slot is not recognised.")
    if slot.counsellor_id != counsellor.id:
        raise BookingError("That slot belongs to a different counsellor.")
    if slot.start_utc <= reference:
        raise BookingError("That slot is in the past.")

    earliest = reference + timedelta(
        hours=minimum_notice_hours(case.urgency if case else "moderate")
    )
    if slot.start_utc < earliest:
        raise BookingError("That slot is too soon to book. Please choose a later one.")

    booking = Booking(
        booking_ref=f"NT-{uuid.uuid4().hex[:10].upper()}",
        account_id=account.id,
        case_id=case.id if case else None,
        counsellor_id=counsellor.id,
        counsellor_name=counsellor.display_name,
        counsellor_timezone=counsellor.timezone,
        slot_id=slot.id,
        start_utc=slot.start_utc.replace(tzinfo=None),
        end_utc=slot.end_utc.replace(tzinfo=None),
        start_utc_active=slot.start_utc.replace(tzinfo=None),
        client_timezone=client_timezone or account.timezone,
        status="held",
        urgency=case.urgency if case else "moderate",
        primary_category=case.primary_category if case else "",
        room_id=f"niya-{secrets.token_hex(6)}",
        hold_expires_at=(reference + timedelta(minutes=HOLD_MINUTES)).replace(tzinfo=None),
    )
    session.add(booking)

    try:
        session.flush()
    except IntegrityError as error:
        session.rollback()
        # The unique index did its job: someone else took this slot between the
        # availability query and this insert.
        raise BookingError(
            "Someone just booked that time. Please choose another slot."
        ) from error

    price, fee, currency = pricing_for(session, counsellor.id)
    order = payments.create_order(
        amount_minor=price,
        currency=currency,
        receipt=booking.booking_ref,
    )
    session.add(
        Payment(
            booking_id=booking.id,
            amount_minor=order.amount_minor,
            # Copied now, never re-read. See the note on Payment in models.py:
            # repricing a counsellor must not change what an existing booking
            # is owed.
            counsellor_fee_minor=fee,
            platform_fee_minor=order.amount_minor - fee,
            currency=order.currency,
            status="pending",
            provider=order.provider,
            provider_order_id=order.order_id,
        )
    )
    session.commit()
    return booking


def pricing_for(session: Session, counsellor_ref: str) -> tuple:
    """(client price, counsellor fee, currency) for this counsellor.

    Falls back to the configured default only if the profile is missing or has
    never been priced, so a half-onboarded counsellor cannot produce a free
    session.
    """
    profile = roster.profile_for(session, counsellor_ref)
    if profile is None or profile.client_price_minor <= 0:
        default = settings.SESSION_PRICE_MINOR
        return default, default, settings.SESSION_CURRENCY
    return profile.client_price_minor, profile.counsellor_fee_minor, profile.currency


def confirm_payment(
    session: Session,
    booking: Booking,
    payment_reference: str,
    signature: str,
    now: Optional[datetime] = None,
) -> Booking:
    """Verify server-side, then confirm and queue the notifications."""
    if booking.status == "confirmed":
        return booking  # idempotent; refreshing the page must not double-charge

    if booking.status != "held":
        raise BookingError(f"This booking is {booking.status} and cannot be paid for.")

    payment = booking.payment
    if payment is None:
        raise BookingError("This booking has no payment record.")

    if not payments.verify_payment(payment.provider_order_id, payment_reference, signature):
        payment.status = "failed"
        session.commit()
        raise BookingError(
            "We could not verify that payment. Your slot is still held - please try again."
        )

    payment.status = "paid"
    payment.provider_reference = payment_reference
    payment.signature = signature
    payment.settled_at = (now or utcnow()).replace(tzinfo=None)

    booking.status = "confirmed"
    booking.hold_expires_at = None
    session.commit()

    notify.queue_booking_confirmed(session, booking, booking.account)
    notify.deliver_due(session)
    return booking


def cancel(
    session: Session, booking: Booking, reason: str = "cancelled by user"
) -> Booking:
    if booking.status in {"cancelled", "expired"}:
        return booking

    booking.status = "cancelled"
    booking.cancelled_reason = reason[:255]
    booking.release_slot()
    if booking.payment is not None and booking.payment.status == "paid":
        # Marks intent to refund. A real refund needs a Razorpay refunds call;
        # see docs/DEPLOYMENT_RENDER.md.
        booking.payment.status = "refund_due"
    session.commit()

    notify.queue_booking_cancelled(session, booking, booking.account)
    notify.deliver_due(session)
    return booking


# ---------------------------------------------------------------------------
# Ownership
# ---------------------------------------------------------------------------


def get_owned_booking(
    session: Session, account: Account, booking_ref: str
) -> Optional[Booking]:
    """Fetch a booking **only** if it belongs to this account.

    Every route that touches a booking goes through here. Looking one up by
    reference alone is how an app ends up letting people read, join or cancel
    other people's sessions.
    """
    return session.scalar(
        select(Booking).where(
            Booking.booking_ref == booking_ref, Booking.account_id == account.id
        )
    )


def list_bookings(session: Session, account: Account) -> List[Booking]:
    _expire_stale_holds(session)
    return list(
        session.scalars(
            select(Booking)
            .where(Booking.account_id == account.id, Booking.status.in_(LIVE_STATUSES))
            .order_by(Booking.start_utc)
        ).all()
    )


def get_counsellor_booking(
    session: Session, profile: CounsellorProfile, booking_ref: str
) -> Optional[Booking]:
    """The counsellor-side equivalent of `get_owned_booking`.

    Scoped by counsellor reference for the same reason: without it, a signed-in
    counsellor could join any session in the system by editing the URL.
    """
    return session.scalar(
        select(Booking).where(
            Booking.booking_ref == booking_ref,
            Booking.counsellor_id == profile.ref,
        )
    )


def list_counsellor_bookings(
    session: Session, profile: CounsellorProfile
) -> List[Booking]:
    """Confirmed sessions only.

    A slot someone is holding but has not paid for is not yet an appointment,
    and showing it would have counsellors planning around sessions that quietly
    expire fifteen minutes later.
    """
    _expire_stale_holds(session)
    return list(
        session.scalars(
            select(Booking)
            .where(
                Booking.counsellor_id == profile.ref,
                Booking.status.in_(("confirmed", "completed")),
            )
            .order_by(Booking.start_utc)
        ).all()
    )


# ---------------------------------------------------------------------------
# The joining window
# ---------------------------------------------------------------------------


def connect_state(booking: Booking, now: Optional[datetime] = None) -> Dict[str, object]:
    reference = now or utcnow()

    if booking.status == "cancelled":
        reason = "cancelled"
    elif booking.status not in {"confirmed", "completed"}:
        reason = "not_confirmed"
    elif reference < booking.connect_opens_at:
        reason = "too_early"
    elif reference > booking.connect_closes_at:
        reason = "too_late"
    else:
        reason = None

    return {
        "can_connect": reason is None,
        "reason": reason,
        "opens_at": booking.connect_opens_at,
        "closes_at": booking.connect_closes_at,
        "opens_at_local": to_zone(booking.connect_opens_at, booking.client_timezone),
        "closes_at_local": to_zone(booking.connect_closes_at, booking.client_timezone),
        "seconds_until_open": max(0, int((booking.connect_opens_at - reference).total_seconds())),
        "seconds_until_close": max(0, int((booking.connect_closes_at - reference).total_seconds())),
    }


def authorise_connection(
    session: Session, booking: Booking, party: str = "client", now: Optional[datetime] = None
) -> Dict[str, object]:
    """Mint a room token, but only inside the window.

    Checked here rather than in the page, because a check that lives only in the
    frontend is decoration. NIYA's video endpoint issues a Twilio token to any
    authenticated caller with a booking id at any hour.
    """
    state = connect_state(booking, now=now)
    if not state["can_connect"]:
        return {"authorised": False, **state}

    session.add(
        ConnectionEvent(
            booking_id=booking.id,
            party=party,
            action="joined",
            at=(now or utcnow()).replace(tzinfo=None),
        )
    )
    session.commit()

    return {
        "authorised": True,
        "room_id": booking.room_id,
        "token": secrets.token_urlsafe(24),
        **state,
    }


def record_leave(
    session: Session, booking: Booking, party: str = "client", now: Optional[datetime] = None
) -> None:
    session.add(
        ConnectionEvent(
            booking_id=booking.id,
            party=party,
            action="left",
            at=(now or utcnow()).replace(tzinfo=None),
        )
    )
    session.commit()
