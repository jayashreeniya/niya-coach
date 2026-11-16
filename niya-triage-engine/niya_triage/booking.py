"""Booking, payment and the connect window.

Everything here is self-contained: a JSON file store, a simulated payment
provider, and a simulated notification outbox. No NIYA system is contacted and
no real money moves.

Three places where this deliberately does **not** copy production behaviour,
because production has a defect there. Each is documented in `docs/BOOKING.md`.

1. **Order of operations.** Production redirects to a Razorpay Payment Button
   and creates the booking afterwards, on `/payment-success`, trusting a URL
   parameter. Anyone who reaches that page with booking details in local storage
   gets a free session. Here the slot is *held* first, payment is verified
   server-side against the held amount, and only then is the booking confirmed.

2. **Payment records are persisted.** Production runs
   `booked_slot.update(payment_status: 'paid', payment_id: payment_id)` against
   columns that do not exist in `schema.rb`, so it silently does nothing and no
   booking can ever be reconciled against a Razorpay transaction. Here the
   payment reference is part of the stored record.

3. **The connect window is enforced where it matters.** Production checks the
   window in React, while the backend hands a Twilio token to any authenticated
   caller with a slot id at any time. Here `authorise_connection` is the only way
   to get a token and it applies the window itself.
"""

from __future__ import annotations

import hashlib
import hmac
import json
import os
import threading
import uuid
from dataclasses import asdict, dataclass, field
from datetime import datetime, timedelta, timezone
from enum import Enum
from pathlib import Path
from typing import Any, Dict, List, Optional

from . import config
from .availability import SESSION_MINUTES, Slot, parse_slot_id, to_zone, utc_now
from .contact import ContactDetails

#: The window either side of the session in which the call may be joined.
CONNECT_OPENS_MINUTES_BEFORE = 5
CONNECT_CLOSES_MINUTES_AFTER = 5

#: How long an unpaid hold survives before the slot is released.
HOLD_MINUTES = 15


class BookingStatus(str, Enum):
    HELD = "held"                  # slot reserved, payment not yet settled
    CONFIRMED = "confirmed"        # paid and booked
    CANCELLED = "cancelled"
    EXPIRED = "expired"            # hold lapsed unpaid
    COMPLETED = "completed"


class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"


class ConnectDenied(str, Enum):
    TOO_EARLY = "too_early"
    TOO_LATE = "too_late"
    NOT_CONFIRMED = "not_confirmed"
    CANCELLED = "cancelled"


@dataclass
class Payment:
    amount_minor: int = 0
    currency: str = "INR"
    status: PaymentStatus = PaymentStatus.PENDING
    provider: str = "simulated"
    provider_reference: Optional[str] = None
    signature: Optional[str] = None
    settled_at: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        payload = asdict(self)
        payload["status"] = self.status.value
        return payload

    @classmethod
    def from_dict(cls, payload: Dict[str, Any]) -> "Payment":
        data = dict(payload or {})
        data["status"] = PaymentStatus(data.get("status", "pending"))
        return cls(**{k: v for k, v in data.items() if k in cls.__annotations__})


@dataclass
class ConnectionEvent:
    party: str            # "client" or "counsellor"
    action: str           # "joined" or "left"
    at: str


@dataclass
class Booking:
    id: str
    case_id: str
    counsellor_id: str
    counsellor_name: str
    slot_id: str
    start_utc: str
    end_utc: str
    client_timezone: str
    counsellor_timezone: str
    status: BookingStatus = BookingStatus.HELD
    payment: Payment = field(default_factory=Payment)
    # Contact details are stored so notifications can be sent, and masked
    # whenever they are displayed or logged.
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    client_name: str = ""
    urgency: str = "moderate"
    primary_category: str = ""
    room_id: Optional[str] = None
    connection_events: List[ConnectionEvent] = field(default_factory=list)
    created_at: str = ""
    hold_expires_at: Optional[str] = None
    cancelled_reason: Optional[str] = None

    # ---- derived -------------------------------------------------------

    @property
    def start(self) -> datetime:
        return datetime.fromisoformat(self.start_utc)

    @property
    def end(self) -> datetime:
        return datetime.fromisoformat(self.end_utc)

    @property
    def connect_opens_at(self) -> datetime:
        return self.start - timedelta(minutes=CONNECT_OPENS_MINUTES_BEFORE)

    @property
    def connect_closes_at(self) -> datetime:
        return self.end + timedelta(minutes=CONNECT_CLOSES_MINUTES_AFTER)

    def start_local(self, timezone_name: Optional[str] = None) -> datetime:
        return to_zone(self.start, timezone_name or self.client_timezone)

    def end_local(self, timezone_name: Optional[str] = None) -> datetime:
        return to_zone(self.end, timezone_name or self.client_timezone)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "case_id": self.case_id,
            "counsellor_id": self.counsellor_id,
            "counsellor_name": self.counsellor_name,
            "slot_id": self.slot_id,
            "start_utc": self.start_utc,
            "end_utc": self.end_utc,
            "client_timezone": self.client_timezone,
            "counsellor_timezone": self.counsellor_timezone,
            "status": self.status.value,
            "payment": self.payment.to_dict(),
            "contact_email": self.contact_email,
            "contact_phone": self.contact_phone,
            "client_name": self.client_name,
            "urgency": self.urgency,
            "primary_category": self.primary_category,
            "room_id": self.room_id,
            "connection_events": [asdict(event) for event in self.connection_events],
            "created_at": self.created_at,
            "hold_expires_at": self.hold_expires_at,
            "cancelled_reason": self.cancelled_reason,
        }

    @classmethod
    def from_dict(cls, payload: Dict[str, Any]) -> "Booking":
        data = dict(payload)
        data["status"] = BookingStatus(data.get("status", "held"))
        data["payment"] = Payment.from_dict(data.get("payment") or {})
        data["connection_events"] = [
            ConnectionEvent(**event) for event in data.get("connection_events") or []
        ]
        known = set(cls.__annotations__)
        return cls(**{key: value for key, value in data.items() if key in known})


# --------------------------------------------------------------------------
# Connect window
# --------------------------------------------------------------------------


def connect_state(
    booking: Booking, now: Optional[datetime] = None
) -> Dict[str, Any]:
    """Whether the call may be joined right now, and why not if not.

    The window runs from five minutes before the start to five minutes after the
    end. Within it the parties may disconnect and rejoin freely - dropped calls
    and bad hotel wifi are normal, and a one-shot join button turns a network
    blip into a missed session.
    """
    reference = now or utc_now()

    if booking.status == BookingStatus.CANCELLED:
        reason: Optional[ConnectDenied] = ConnectDenied.CANCELLED
    elif booking.status not in {BookingStatus.CONFIRMED, BookingStatus.COMPLETED}:
        reason = ConnectDenied.NOT_CONFIRMED
    elif reference < booking.connect_opens_at:
        reason = ConnectDenied.TOO_EARLY
    elif reference > booking.connect_closes_at:
        reason = ConnectDenied.TOO_LATE
    else:
        reason = None

    seconds_until = (booking.connect_opens_at - reference).total_seconds()
    return {
        "can_connect": reason is None,
        "reason": reason.value if reason else None,
        "opens_at_utc": booking.connect_opens_at.isoformat(),
        "closes_at_utc": booking.connect_closes_at.isoformat(),
        "seconds_until_open": max(0, int(seconds_until)),
        "seconds_until_close": max(
            0, int((booking.connect_closes_at - reference).total_seconds())
        ),
    }


def _room_secret() -> bytes:
    return os.environ.get("NIYA_ROOM_SECRET", "niya-prototype-room-secret").encode()


def authorise_connection(
    booking: Booking, party: str, now: Optional[datetime] = None
) -> Dict[str, Any]:
    """The only route to a room token, and it applies the window itself.

    Production's `GET /bx_block_calendar/booked_slots/video_call` issues a Twilio
    token to any authenticated caller with a booking id, whenever they ask; the
    five-minute rule lives only in React and is trivially bypassed. Checking here
    means a modified client gains nothing.
    """
    state = connect_state(booking, now=now)
    if not state["can_connect"]:
        return {"authorised": False, **state}

    payload = f"{booking.id}|{booking.room_id}|{party}"
    token = hmac.new(_room_secret(), payload.encode(), hashlib.sha256).hexdigest()[:32]
    return {
        "authorised": True,
        "room_id": booking.room_id,
        "token": token,
        "party": party,
        **state,
    }


# --------------------------------------------------------------------------
# Payment (simulated)
# --------------------------------------------------------------------------


def _payment_signature(booking_id: str, reference: str, amount_minor: int) -> str:
    """Stands in for Razorpay's HMAC signature check.

    The real fix in production is `Razorpay::Utility.verify_payment_signature`.
    The shape is what matters: the server recomputes a signature over the amount
    it expects, so a client cannot claim payment it did not make.
    """
    payload = f"{booking_id}|{reference}|{amount_minor}"
    return hmac.new(_room_secret(), payload.encode(), hashlib.sha256).hexdigest()


def simulate_gateway_payment(booking: Booking) -> Dict[str, str]:
    """What a payment provider would hand back after a successful charge."""
    reference = f"pay_sim_{uuid.uuid4().hex[:14]}"
    return {
        "provider_reference": reference,
        "signature": _payment_signature(
            booking.id, reference, booking.payment.amount_minor
        ),
    }


# --------------------------------------------------------------------------
# Store
# --------------------------------------------------------------------------


class BookingError(RuntimeError):
    pass


class BookingStore:
    """JSON-file booking store. Swap for a real table by replacing _load/_save."""

    def __init__(self, path: Optional[Path] = None) -> None:
        self.path = Path(path) if path else config.BOOKING_FILE
        self._lock = threading.Lock()

    # ---- persistence ----------------------------------------------------

    def _load(self) -> List[Booking]:
        if not self.path.exists():
            return []
        try:
            with self.path.open("r", encoding="utf-8") as handle:
                raw = json.load(handle)
        except (json.JSONDecodeError, OSError):
            return []
        return [Booking.from_dict(item) for item in raw.get("bookings", [])]

    def _save(self, bookings: List[Booking]) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        payload = {"bookings": [booking.to_dict() for booking in bookings]}
        with self.path.open("w", encoding="utf-8") as handle:
            json.dump(payload, handle, indent=2)

    # ---- queries --------------------------------------------------------

    # Every read takes an optional `now`. Expiry of unpaid holds happens on read,
    # so a store that could only ever consult the wall clock would be impossible
    # to test deterministically - which is exactly what the first version was.

    def all(self, now: Optional[datetime] = None) -> List[Booking]:
        return self._expire_stale(self._load(), now=now)

    def get(self, booking_id: str, now: Optional[datetime] = None) -> Optional[Booking]:
        for booking in self.all(now=now):
            if booking.id == booking_id:
                return booking
        return None

    def for_case(self, case_id: str, now: Optional[datetime] = None) -> List[Booking]:
        return [booking for booking in self.all(now=now) if booking.case_id == case_id]

    def taken_slot_ids(
        self, counsellor_id: Optional[str] = None, now: Optional[datetime] = None
    ) -> List[str]:
        """Slots that are held or confirmed, and so cannot be booked again."""
        blocking = {BookingStatus.HELD, BookingStatus.CONFIRMED, BookingStatus.COMPLETED}
        return [
            booking.slot_id
            for booking in self.all(now=now)
            if booking.status in blocking
            and (counsellor_id is None or booking.counsellor_id == counsellor_id)
        ]

    def _expire_stale(
        self, bookings: List[Booking], now: Optional[datetime] = None
    ) -> List[Booking]:
        """Release holds that were never paid for."""
        reference = now or utc_now()
        changed = False
        for booking in bookings:
            if booking.status != BookingStatus.HELD or not booking.hold_expires_at:
                continue
            if datetime.fromisoformat(booking.hold_expires_at) < reference:
                booking.status = BookingStatus.EXPIRED
                changed = True
        if changed:
            self._save(bookings)
        return bookings

    # ---- commands -------------------------------------------------------

    def hold(
        self,
        case_id: str,
        counsellor_id: str,
        counsellor_name: str,
        counsellor_timezone: str,
        slot_id: str,
        contact: ContactDetails,
        client_timezone: str = "UTC",
        urgency: str = "moderate",
        primary_category: str = "",
        amount_minor: int = config.SESSION_PRICE_MINOR,
        currency: str = config.SESSION_CURRENCY,
        now: Optional[datetime] = None,
    ) -> Booking:
        """Reserve a slot pending payment.

        Raises if the slot is already taken. Holding before charging means a user
        never pays for a session someone else just booked - the failure mode of
        production's pay-then-create ordering.
        """
        if not contact.is_valid:
            raise BookingError(
                "Valid contact details are required: " + "; ".join(contact.errors.values())
            )

        slot = parse_slot_id(slot_id)
        if slot is None:
            raise BookingError(f"Unrecognised slot id: {slot_id}")
        if slot.counsellor_id != counsellor_id:
            raise BookingError("Slot does not belong to that counsellor.")

        reference = now or utc_now()
        if slot.start_utc <= reference:
            raise BookingError("That slot is in the past.")

        with self._lock:
            bookings = self._expire_stale(self._load(), now=reference)
            if slot_id in {
                item.slot_id
                for item in bookings
                if item.status
                in {BookingStatus.HELD, BookingStatus.CONFIRMED, BookingStatus.COMPLETED}
            }:
                raise BookingError("That slot has just been taken. Please pick another.")

            booking = Booking(
                id=f"bk_{uuid.uuid4().hex[:12]}",
                case_id=case_id,
                counsellor_id=counsellor_id,
                counsellor_name=counsellor_name,
                slot_id=slot_id,
                start_utc=slot.start_utc.isoformat(),
                end_utc=slot.end_utc.isoformat(),
                client_timezone=client_timezone,
                counsellor_timezone=counsellor_timezone,
                status=BookingStatus.HELD,
                payment=Payment(amount_minor=amount_minor, currency=currency),
                contact_email=contact.email,
                contact_phone=contact.phone,
                client_name=contact.full_name,
                urgency=urgency,
                primary_category=primary_category,
                room_id=f"niya-{uuid.uuid4().hex[:10]}",
                created_at=reference.isoformat(),
                hold_expires_at=(reference + timedelta(minutes=HOLD_MINUTES)).isoformat(),
            )
            bookings.append(booking)
            self._save(bookings)
            return booking

    def confirm_payment(
        self,
        booking_id: str,
        provider_reference: str,
        signature: str,
        now: Optional[datetime] = None,
    ) -> Booking:
        """Verify the payment server-side, then confirm.

        The signature is recomputed here over the amount the server itself set.
        A client that invents a reference, or replays one against a different
        amount, fails the check. This is the step production omits entirely.
        """
        with self._lock:
            bookings = self._load()
            booking = next((item for item in bookings if item.id == booking_id), None)
            if booking is None:
                raise BookingError(f"No such booking: {booking_id}")

            if booking.status == BookingStatus.CONFIRMED:
                return booking  # idempotent: refreshing the success page is harmless

            if booking.status != BookingStatus.HELD:
                raise BookingError(
                    f"Booking is {booking.status.value} and cannot be paid for."
                )

            expected = _payment_signature(
                booking.id, provider_reference, booking.payment.amount_minor
            )
            if not hmac.compare_digest(expected, signature or ""):
                booking.payment.status = PaymentStatus.FAILED
                self._save(bookings)
                raise BookingError("Payment verification failed. The slot is still held.")

            reference = now or utc_now()
            booking.payment.status = PaymentStatus.PAID
            booking.payment.provider_reference = provider_reference
            booking.payment.signature = signature
            booking.payment.settled_at = reference.isoformat()
            booking.status = BookingStatus.CONFIRMED
            booking.hold_expires_at = None
            self._save(bookings)
            return booking

    def cancel(
        self, booking_id: str, reason: str = "cancelled by user"
    ) -> Booking:
        with self._lock:
            bookings = self._load()
            booking = next((item for item in bookings if item.id == booking_id), None)
            if booking is None:
                raise BookingError(f"No such booking: {booking_id}")
            booking.status = BookingStatus.CANCELLED
            booking.cancelled_reason = reason
            if booking.payment.status == PaymentStatus.PAID:
                booking.payment.status = PaymentStatus.REFUNDED
            self._save(bookings)
            return booking

    def record_connection(
        self, booking_id: str, party: str, action: str, now: Optional[datetime] = None
    ) -> Booking:
        """Log a join or leave. Reconnection is expected, not exceptional."""
        with self._lock:
            bookings = self._load()
            booking = next((item for item in bookings if item.id == booking_id), None)
            if booking is None:
                raise BookingError(f"No such booking: {booking_id}")
            booking.connection_events.append(
                ConnectionEvent(
                    party=party,
                    action=action,
                    at=(now or utc_now()).isoformat(),
                )
            )
            self._save(bookings)
            return booking


_DEFAULT_STORE: Optional[BookingStore] = None


def default_store() -> BookingStore:
    global _DEFAULT_STORE
    if _DEFAULT_STORE is None:
        _DEFAULT_STORE = BookingStore()
    return _DEFAULT_STORE


def reset_default_store() -> None:
    global _DEFAULT_STORE
    _DEFAULT_STORE = None
