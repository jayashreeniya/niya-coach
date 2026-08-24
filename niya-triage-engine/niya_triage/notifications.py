"""Booking notifications: email and SMS, written to an outbox rather than sent.

Nothing leaves the machine. Every message is appended to `bookings/outbox.jsonl`
so the full journey can be demonstrated and reviewed without an SMTP server, a
Twilio account, or the risk of messaging a real person from a prototype.

Swapping in the real senders is a single function each, and the natural targets
already exist in NIYA: `AppointmentMailer` over SendGrid for email, and
`BxBlockSms::SendSms` over Twilio for SMS - currently used only for
password-reset OTPs.

Two gaps in production worth naming, both recorded in `docs/BOOKING.md`:

* There is no pre-session reminder. `AppointmentNotificationWorker` exists and
  sends a ten-minute warning, but the line that schedules it survives only in
  `booked_slots_controller.rb.backup-20251113-113204`; the live controller never
  enqueues it. So this module schedules reminders explicitly.
* Times in the existing confirmation email carry no timezone, because the system
  has no timezone data. Every message here states both parties' local times and
  names the zone.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Dict, List, Optional

from . import config
from .availability import to_zone, utc_now
from .booking import Booking
from .contact import mask_email, mask_phone

#: When to remind, as hours before the session starts.
REMINDER_OFFSETS_HOURS = (24.0, 1.0, 0.0833)  # 24h, 1h, and 5 minutes


@dataclass
class Message:
    channel: str            # "email" or "sms"
    to: str
    subject: str
    body: str
    kind: str               # "confirmation" | "reminder" | "cancellation" | "coach_notice"
    booking_id: str
    send_at_utc: str
    created_at_utc: str = ""
    #: Contact details are masked in anything persisted or displayed.
    to_masked: str = ""
    meta: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "channel": self.channel,
            "to_masked": self.to_masked,
            "subject": self.subject,
            "body": self.body,
            "kind": self.kind,
            "booking_id": self.booking_id,
            "send_at_utc": self.send_at_utc,
            "created_at_utc": self.created_at_utc,
            "meta": self.meta,
        }


# --------------------------------------------------------------------------
# Formatting
# --------------------------------------------------------------------------


def _zone_label(timezone_name: str) -> str:
    return (timezone_name or "UTC").replace("_", " ")


def format_when(booking: Booking, timezone_name: str) -> str:
    local = to_zone(booking.start, timezone_name)
    end = to_zone(booking.end, timezone_name)
    return (
        f"{local:%A %d %B %Y}, {local:%H:%M}-{end:%H:%M} "
        f"({_zone_label(timezone_name)})"
    )


def _money(booking: Booking) -> str:
    # Currency code rather than symbol: these messages get printed to Windows
    # consoles running cp1252, where a rupee sign raises UnicodeEncodeError.
    # The code is also less ambiguous than "$" across the countries NIYA serves.
    amount = booking.payment.amount_minor / 100
    return f"{amount:,.2f} {booking.payment.currency}"


def confirmation_email(booking: Booking) -> Optional[Message]:
    if not booking.contact_email:
        return None

    name = booking.client_name or "there"
    body = f"""Hello {name},

Your session with {booking.counsellor_name} is confirmed.

  When (your time):  {format_when(booking, booking.client_timezone)}
  Counsellor's time: {format_when(booking, booking.counsellor_timezone)}
  Reference:         {booking.id}
  Paid:              {_money(booking)}

Joining
  The "Connect now" button becomes active 5 minutes before the start time and
  stays active until 5 minutes after the end. If your connection drops you can
  rejoin as many times as you need during the session.

If you need to cancel, do it from your appointments page.

This is a prototype message. No real session has been booked and no payment has
been taken.
"""
    return Message(
        channel="email",
        to=booking.contact_email,
        to_masked=mask_email(booking.contact_email) or "",
        subject=f"Your session with {booking.counsellor_name} is confirmed",
        body=body,
        kind="confirmation",
        booking_id=booking.id,
        send_at_utc=utc_now().isoformat(),
    )


def confirmation_sms(booking: Booking) -> Optional[Message]:
    if not booking.contact_phone:
        return None

    local = to_zone(booking.start, booking.client_timezone)
    body = (
        f"NIYA: session with {booking.counsellor_name} confirmed for "
        f"{local:%a %d %b, %H:%M} ({_zone_label(booking.client_timezone)}). "
        f"Join from your appointments page 5 min before. Ref {booking.id}. "
        f"[prototype - not a real booking]"
    )
    return Message(
        channel="sms",
        to=booking.contact_phone,
        to_masked=mask_phone(booking.contact_phone) or "",
        subject="",
        body=body,
        kind="confirmation",
        booking_id=booking.id,
        send_at_utc=utc_now().isoformat(),
    )


def counsellor_notice(booking: Booking) -> Message:
    body = f"""A new session has been booked with you.

  When (your time): {format_when(booking, booking.counsellor_timezone)}
  Client's time:    {format_when(booking, booking.client_timezone)}
  Triage category:  {booking.primary_category or 'not recorded'}
  Triage urgency:   {booking.urgency}
  Reference:        {booking.id}

The client's contact details are held in the booking record and are not repeated
here.
"""
    return Message(
        channel="email",
        to=f"{booking.counsellor_id}@counsellors.niya.invalid",
        to_masked=f"{booking.counsellor_id}@counsellors.niya.invalid",
        subject=f"New session booked - {booking.urgency} urgency",
        body=body,
        kind="coach_notice",
        booking_id=booking.id,
        send_at_utc=utc_now().isoformat(),
        meta={"counsellor_id": booking.counsellor_id},
    )


def reminders(booking: Booking, now: Optional[datetime] = None) -> List[Message]:
    """Scheduled reminders on every channel the client gave us.

    `now` is injectable for the same reason it is on `BookingStore`: a caller
    that generates slots against a fixed clock has to be able to schedule
    against that same clock, or every reminder is silently dropped as being in
    the past.
    """
    reference = now or utc_now()
    messages: List[Message] = []
    for hours in REMINDER_OFFSETS_HOURS:
        send_at = booking.start - timedelta(hours=hours)
        if send_at <= reference:
            continue  # session is too close for this reminder to be meaningful

        local = to_zone(booking.start, booking.client_timezone)
        if hours >= 1:
            lead = f"{int(hours)} hour{'s' if hours >= 2 else ''}"
        else:
            lead = "5 minutes"

        if booking.contact_email:
            messages.append(
                Message(
                    channel="email",
                    to=booking.contact_email,
                    to_masked=mask_email(booking.contact_email) or "",
                    subject=f"Your session with {booking.counsellor_name} is in {lead}",
                    body=(
                        f"A reminder that your session starts in {lead}, at "
                        f"{local:%H:%M} ({_zone_label(booking.client_timezone)}).\n\n"
                        f"The Connect now button opens 5 minutes before the start.\n\n"
                        f"Reference {booking.id}.\n"
                    ),
                    kind="reminder",
                    booking_id=booking.id,
                    send_at_utc=send_at.isoformat(),
                    meta={"hours_before": hours},
                )
            )
        if booking.contact_phone:
            messages.append(
                Message(
                    channel="sms",
                    to=booking.contact_phone,
                    to_masked=mask_phone(booking.contact_phone) or "",
                    subject="",
                    body=(
                        f"NIYA: your session with {booking.counsellor_name} starts in "
                        f"{lead} ({local:%H:%M} {_zone_label(booking.client_timezone)}). "
                        f"Ref {booking.id}."
                    ),
                    kind="reminder",
                    booking_id=booking.id,
                    send_at_utc=send_at.isoformat(),
                    meta={"hours_before": hours},
                )
            )
    return messages


def cancellation(booking: Booking) -> List[Message]:
    messages: List[Message] = []
    when = format_when(booking, booking.client_timezone)
    if booking.contact_email:
        messages.append(
            Message(
                channel="email",
                to=booking.contact_email,
                to_masked=mask_email(booking.contact_email) or "",
                subject="Your session has been cancelled",
                body=(
                    f"Your session with {booking.counsellor_name} on {when} has been "
                    f"cancelled.\n\nAny payment taken will be refunded. "
                    f"Reference {booking.id}.\n"
                ),
                kind="cancellation",
                booking_id=booking.id,
                send_at_utc=utc_now().isoformat(),
            )
        )
    if booking.contact_phone:
        messages.append(
            Message(
                channel="sms",
                to=booking.contact_phone,
                to_masked=mask_phone(booking.contact_phone) or "",
                subject="",
                body=(
                    f"NIYA: your session with {booking.counsellor_name} on {when} is "
                    f"cancelled. Ref {booking.id}."
                ),
                kind="cancellation",
                booking_id=booking.id,
                send_at_utc=utc_now().isoformat(),
            )
        )
    return messages


# --------------------------------------------------------------------------
# Outbox
# --------------------------------------------------------------------------


class Outbox:
    """Append-only record of what would have been sent."""

    def __init__(self, path: Optional[Path] = None) -> None:
        self.path = Path(path) if path else config.OUTBOX_FILE

    def send(self, messages: List[Optional[Message]]) -> List[Message]:
        queued = [message for message in messages if message is not None]
        if not queued:
            return []
        self.path.parent.mkdir(parents=True, exist_ok=True)
        now = utc_now().isoformat()
        with self.path.open("a", encoding="utf-8") as handle:
            for message in queued:
                message.created_at_utc = now
                handle.write(json.dumps(message.to_dict()) + "\n")
        return queued

    def all(self, booking_id: Optional[str] = None) -> List[Dict[str, Any]]:
        if not self.path.exists():
            return []
        rows: List[Dict[str, Any]] = []
        with self.path.open("r", encoding="utf-8") as handle:
            for line in handle:
                line = line.strip()
                if not line:
                    continue
                try:
                    row = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if booking_id is None or row.get("booking_id") == booking_id:
                    rows.append(row)
        return rows

    def due(self, now: Optional[datetime] = None) -> List[Dict[str, Any]]:
        """Messages whose send time has arrived - what a scheduler would pick up."""
        reference = now or utc_now()
        due_rows = []
        for row in self.all():
            try:
                send_at = datetime.fromisoformat(row["send_at_utc"])
            except (KeyError, ValueError):
                continue
            if send_at <= reference:
                due_rows.append(row)
        return due_rows


_DEFAULT_OUTBOX: Optional[Outbox] = None


def default_outbox() -> Outbox:
    global _DEFAULT_OUTBOX
    if _DEFAULT_OUTBOX is None:
        _DEFAULT_OUTBOX = Outbox()
    return _DEFAULT_OUTBOX


def reset_default_outbox() -> None:
    global _DEFAULT_OUTBOX
    _DEFAULT_OUTBOX = None


def notify_booking_confirmed(
    booking: Booking, outbox: Optional[Outbox] = None, now: Optional[datetime] = None
) -> List[Message]:
    """Everything that fires when a booking is confirmed."""
    target = outbox or default_outbox()
    return target.send(
        [
            confirmation_email(booking),
            confirmation_sms(booking),
            counsellor_notice(booking),
            *reminders(booking, now=now),
        ]
    )


def notify_booking_cancelled(booking: Booking, outbox: Optional[Outbox] = None) -> List[Message]:
    target = outbox or default_outbox()
    return target.send(list(cancellation(booking)))
