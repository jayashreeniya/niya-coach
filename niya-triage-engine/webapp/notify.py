"""Email and SMS delivery, plus the message templates.

Every message is written to the `notifications` table first and sent second, so
there is always a record of what was meant to go out, whether or not the
provider accepted it. Delivery failures mark the row `failed` with the reason
rather than raising, because a booking must not be lost because SendGrid had a
bad minute.

SendGrid and Twilio are reached over their REST APIs with `urllib`; both calls
are a single POST, so the SDKs would add dependencies without adding anything.
When credentials are absent the message stays `queued` and is visible in the UI
- the same behaviour the prototype had, now durable.
"""

from __future__ import annotations

import base64
import json
import logging
import smtplib
import ssl
import urllib.error
import urllib.parse
import urllib.request
from email.message import EmailMessage
from email.utils import formataddr
from datetime import datetime, timedelta, timezone
from typing import List, Optional

from sqlalchemy.orm import Session

from . import settings
from .models import Booking, Notification, utcnow

logger = logging.getLogger("niya.triage.notify")

REQUEST_TIMEOUT_SECONDS = 15

#: How hard to try before giving up on a message, and how long to wait between
#: attempts. A reminder that arrives twenty minutes late is still useful; one
#: dropped because SendGrid returned a 503 once is not.
MAX_SEND_ATTEMPTS = 4
RETRY_BACKOFF_MINUTES = (2, 10, 30)

#: Lead times before the session. NIYA has a worker for this that the live
#: controller never enqueues, so in practice no reminder has been sent since
#: that refactor.
REMINDER_LEAD_TIMES = (
    (timedelta(hours=24), "24 hours"),
    (timedelta(hours=1), "1 hour"),
    (timedelta(minutes=5), "5 minutes"),
)


# ---------------------------------------------------------------------------
# Masking
# ---------------------------------------------------------------------------


def mask_email(value: Optional[str]) -> str:
    if not value or "@" not in value:
        return ""
    local, _, domain = value.partition("@")
    return f"{local[:1]}{'*' * max(1, len(local) - 1)}@{domain}"


def mask_phone(value: Optional[str]) -> str:
    if not value:
        return ""
    return f"{value[:3]}{'*' * max(1, len(value) - 6)}{value[-3:]}"


# ---------------------------------------------------------------------------
# Formatting
# ---------------------------------------------------------------------------


def _offset(timezone_name: str):
    from niya_triage.tz import offset_hours

    return timezone(timedelta(hours=offset_hours(timezone_name)))


def local_time(moment: datetime, timezone_name: str) -> datetime:
    if moment.tzinfo is None:
        moment = moment.replace(tzinfo=timezone.utc)
    return moment.astimezone(_offset(timezone_name))


def format_when(booking: Booking, timezone_name: str) -> str:
    start = local_time(booking.start, timezone_name)
    end = local_time(booking.end, timezone_name)
    return f"{start:%A %d %B %Y}, {start:%H:%M}-{end:%H:%M} ({timezone_name})"


def _money(booking: Booking) -> str:
    if booking.payment is None:
        return ""
    return f"{booking.payment.amount_minor / 100:,.2f} {booking.payment.currency}"


# ---------------------------------------------------------------------------
# Queueing
# ---------------------------------------------------------------------------


def _queue(
    session: Session,
    booking: Booking,
    channel: str,
    kind: str,
    recipient: str,
    subject: str,
    body: str,
    send_at: datetime,
) -> Optional[Notification]:
    if not recipient:
        return None

    masked = mask_email(recipient) if channel == "email" else mask_phone(recipient)
    notification = Notification(
        booking_id=booking.id,
        channel=channel,
        kind=kind,
        recipient=recipient,
        recipient_masked=masked,
        subject=subject,
        body=body,
        send_at=send_at,
        status="queued",
    )
    session.add(notification)
    return notification


def queue_booking_confirmed(session: Session, booking: Booking, account) -> List[Notification]:
    """Confirmation on every channel we have, plus the reminders."""
    queued: List[Notification] = []
    now = utcnow()
    yours = format_when(booking, booking.client_timezone)
    theirs = format_when(booking, booking.counsellor_timezone)

    email_body = f"""Hello {account.full_name or 'there'},

Your session with {booking.counsellor_name} is confirmed.

  When (your time):  {yours}
  Counsellor's time: {theirs}
  Reference:         {booking.booking_ref}
  Paid:              {_money(booking)}

Joining
  Sign in and open My appointments. The "Connect now" button becomes active
  5 minutes before the start time and stays active until 5 minutes after the
  end. If your connection drops you can rejoin as many times as you need.

  {settings.BASE_URL}/appointments

If you need to cancel, you can do it from that page.
"""

    queued.append(
        _queue(
            session, booking, "email", "confirmation", account.email,
            f"Your session with {booking.counsellor_name} is confirmed",
            email_body, now,
        )
    )

    start_local = local_time(booking.start, booking.client_timezone)
    queued.append(
        _queue(
            session, booking, "sms", "confirmation", account.phone or "",
            "",
            (
                f"{settings.APP_NAME}: session with {booking.counsellor_name} confirmed for "
                f"{start_local:%a %d %b, %H:%M} ({booking.client_timezone}). "
                f"Join from {settings.BASE_URL}/appointments 5 min before. "
                f"Ref {booking.booking_ref}"
            ),
            now,
        )
    )

    for lead, label in REMINDER_LEAD_TIMES:
        send_at = booking.start - lead
        if send_at <= now:
            continue
        queued.append(
            _queue(
                session, booking, "email", "reminder", account.email,
                f"Your session with {booking.counsellor_name} is in {label}",
                (
                    f"A reminder that your session starts in {label}, at "
                    f"{start_local:%H:%M} ({booking.client_timezone}).\n\n"
                    f"Connect now opens 5 minutes before:\n"
                    f"{settings.BASE_URL}/appointments\n\n"
                    f"Reference {booking.booking_ref}.\n"
                ),
                send_at,
            )
        )
        queued.append(
            _queue(
                session, booking, "sms", "reminder", account.phone or "",
                "",
                (
                    f"{settings.APP_NAME}: your session with {booking.counsellor_name} starts in "
                    f"{label} ({start_local:%H:%M} {booking.client_timezone}). "
                    f"Ref {booking.booking_ref}"
                ),
                send_at,
            )
        )

    session.commit()
    return [item for item in queued if item is not None]


def queue_booking_cancelled(session: Session, booking: Booking, account) -> List[Notification]:
    now = utcnow()
    when = format_when(booking, booking.client_timezone)

    # Pending reminders for a cancelled session must not go out.
    for notification in booking.notifications:
        if notification.kind == "reminder" and notification.status == "queued":
            notification.status = "cancelled"

    queued = [
        _queue(
            session, booking, "email", "cancellation", account.email,
            "Your session has been cancelled",
            (
                f"Your session with {booking.counsellor_name} on {when} has been "
                f"cancelled.\n\nAny payment taken will be refunded.\n"
                f"Reference {booking.booking_ref}.\n"
            ),
            now,
        ),
        _queue(
            session, booking, "sms", "cancellation", account.phone or "",
            "",
            (
                f"{settings.APP_NAME}: your session with {booking.counsellor_name} on {when} is "
                f"cancelled. Ref {booking.booking_ref}"
            ),
            now,
        ),
    ]
    session.commit()
    return [item for item in queued if item is not None]


# ---------------------------------------------------------------------------
# Delivery
# ---------------------------------------------------------------------------


def _send_email(to: str, subject: str, body: str) -> None:
    if settings.email_provider() == "smtp":
        return _send_email_smtp(to, subject, body)
    return _send_email_sendgrid(to, subject, body)


def _send_email_smtp(to: str, subject: str, body: str) -> None:
    """Send through a plain SMTP server, which for NIYA is Microsoft 365.

    Built on the standard library rather than a client package: this is one
    STARTTLS connection and one message, and a dependency to maintain would
    earn its keep only if there were more to it than that.
    """
    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = formataddr((settings.EMAIL_FROM_NAME, settings.EMAIL_FROM))
    message["To"] = to
    message.set_content(body)

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT,
                      timeout=REQUEST_TIMEOUT_SECONDS) as server:
        server.starttls(context=ssl.create_default_context())
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.send_message(message)


def _send_email_sendgrid(to: str, subject: str, body: str) -> None:
    request = urllib.request.Request(
        "https://api.sendgrid.com/v3/mail/send",
        data=json.dumps(
            {
                "personalizations": [{"to": [{"email": to}]}],
                "from": {"email": settings.EMAIL_FROM, "name": settings.EMAIL_FROM_NAME},
                "subject": subject,
                "content": [{"type": "text/plain", "value": body}],
            }
        ).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {settings.SENDGRID_API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
        if response.status >= 300:
            raise RuntimeError(f"SendGrid returned {response.status}")


def _send_sms(to: str, body: str) -> None:
    credentials = f"{settings.TWILIO_ACCOUNT_SID}:{settings.TWILIO_AUTH_TOKEN}".encode()
    request = urllib.request.Request(
        f"https://api.twilio.com/2010-04-01/Accounts/{settings.TWILIO_ACCOUNT_SID}/Messages.json",
        data=urllib.parse.urlencode(
            {"To": to, "From": settings.TWILIO_FROM_NUMBER, "Body": body}
        ).encode("utf-8"),
        headers={
            "Authorization": "Basic " + base64.b64encode(credentials).decode(),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
        if response.status >= 300:
            raise RuntimeError(f"Twilio returned {response.status}")


def deliver_due(session: Session, limit: int = 50, now: Optional[datetime] = None) -> dict:
    """Send everything whose time has come.

    Called after booking so confirmations go immediately, and from
    `scripts/send_due_notifications.py` on a schedule for the reminders. On
    Render that is a Cron Job; there is no in-process scheduler because a web
    service with more than one replica would send every reminder twice.
    """
    reference = now or utcnow()
    pending = (
        session.query(Notification)
        .filter(Notification.status == "queued", Notification.send_at <= reference)
        .order_by(Notification.send_at)
        .limit(limit)
        .all()
    )

    sent = failed = skipped = retried = 0
    for notification in pending:
        live = settings.EMAIL_LIVE if notification.channel == "email" else settings.SMS_LIVE
        if not live:
            skipped += 1
            continue

        notification.attempts += 1
        try:
            if notification.channel == "email":
                _send_email(notification.recipient, notification.subject, notification.body)
                # Which route carried it, not which one we assumed. These rows
                # are the evidence that somebody was told.
                notification.provider = settings.email_provider()
            else:
                _send_sms(notification.recipient, notification.body)
                notification.provider = "twilio"
        except Exception as error:  # noqa: BLE001 - a failed send must not break the caller
            notification.error = str(error)[:255]
            if notification.attempts >= MAX_SEND_ATTEMPTS:
                notification.status = "failed"
                failed += 1
            else:
                # Stay queued and try again later, with the delay growing each
                # time, so a brief provider outage does not lose the message.
                retry_in = RETRY_BACKOFF_MINUTES[
                    min(notification.attempts - 1, len(RETRY_BACKOFF_MINUTES) - 1)
                ]
                notification.send_at = (
                    reference + timedelta(minutes=retry_in)
                ).replace(tzinfo=None)
                retried += 1
        else:
            notification.status = "sent"
            notification.sent_at = utcnow()
            sent += 1

    session.commit()
    return {
        "sent": sent,
        "retrying": retried,
        "failed": failed,
        "skipped_not_configured": skipped,
    }


def describe_mode() -> dict:
    provider = settings.email_provider()
    return {
        "email": {
            "smtp": f"SMTP via {settings.SMTP_HOST}",
            "sendgrid": "SendGrid",
        }.get(provider, "Queued only (no email credentials)"),
        "sms": "Twilio" if settings.SMS_LIVE else "Queued only (no Twilio credentials)",
    }


# ---------------------------------------------------------------------------
# Credential verification
#
# A key that is present is not a key that works. Confirmations are queued and
# sent in the background, so a rejected key produces no error anyone sees: the
# booking succeeds, the page says a confirmation is on its way, and nothing
# arrives. Checked once at startup instead.
# ---------------------------------------------------------------------------

#: None until checked. True or False once a verification has been attempted.
_email_verified: Optional[bool] = None
_email_detail: str = "not checked"


def verify_email_credentials(timeout: int = 10) -> tuple:
    """Ask SendGrid whether the key works and may actually send mail.

    Returns (ok, detail). Never raises: a network problem at boot should not
    stop the app serving everything that does not need email.
    """
    global _email_verified, _email_detail

    if not settings.EMAIL_LIVE:
        _email_verified, _email_detail = False, "no email credentials set"
        return _email_verified, _email_detail

    if settings.email_provider() == "smtp":
        return _verify_smtp(timeout)

    # The scopes endpoint both authenticates the key and reveals its
    # permissions, so a restricted key created without Mail Send is caught
    # here rather than silently failing on the first confirmation.
    request = urllib.request.Request("https://api.sendgrid.com/v3/scopes")
    request.add_header("Authorization", f"Bearer {settings.SENDGRID_API_KEY}")

    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            payload = json.loads(response.read().decode())
            scopes = payload.get("scopes", [])
            if "mail.send" in scopes:
                ok, detail = True, "authenticated, may send mail"
            else:
                ok = False
                detail = (
                    "key authenticates but lacks the mail.send permission - "
                    "recreate it as Restricted Access with Mail Send enabled"
                )
    except urllib.error.HTTPError as error:
        ok = False
        detail = (
            "rejected by SendGrid (HTTP 401) - check SENDGRID_API_KEY"
            if error.code == 401
            else f"HTTP {error.code}"
        )
    except Exception as error:  # noqa: BLE001
        ok = False
        detail = f"could not reach SendGrid: {type(error).__name__}"

    _email_verified, _email_detail = ok, detail
    if ok:
        logger.info("sendgrid credentials verified")
    else:
        logger.error("sendgrid credentials unusable: %s", detail)
    return ok, detail


def _verify_smtp(timeout: int) -> tuple:
    """Log in to the SMTP server and immediately disconnect.

    Authentication is the part that silently breaks: a rotated mailbox
    password, or a tenant that has turned off basic SMTP authentication, both
    present as mail simply never arriving.
    """
    global _email_verified, _email_detail

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT,
                          timeout=timeout) as server:
            server.starttls(context=ssl.create_default_context())
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        ok, detail = True, f"authenticated to {settings.SMTP_HOST}"
    except smtplib.SMTPAuthenticationError as error:
        ok = False
        detail = (
            f"{settings.SMTP_HOST} rejected the login ({error.smtp_code}) - "
            "check SMTP_USERNAME and SMTP_PASSWORD, and that the tenant still "
            "permits SMTP authentication"
        )
    except Exception as error:  # noqa: BLE001
        ok = False
        detail = f"could not reach {settings.SMTP_HOST}: {type(error).__name__}"

    _email_verified, _email_detail = ok, detail
    if ok:
        logger.info("smtp credentials verified against %s", settings.SMTP_HOST)
    else:
        logger.error("smtp credentials unusable: %s", detail)
    return ok, detail


def email_status() -> str:
    """What to report on the health endpoint.

    Says nothing about whether EMAIL_FROM is an address the provider will
    accept. SendGrid enforces sender verification, and Microsoft 365 rejects
    sending as a mailbox you lack permission for, but both only at send time.
    """
    provider = settings.email_provider()
    if provider == "outbox":
        return "outbox only"
    if _email_verified is None:
        return f"{provider} (unverified)"
    if _email_verified:
        return f"{provider} (verified)"
    return f"{provider} BROKEN: {_email_detail}"
