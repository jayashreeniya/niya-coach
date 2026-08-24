"""The counsellor's own portal: their sessions, and joining them.

Everything here is scoped to the signed-in counsellor's profile through
`booking_service.get_counsellor_booking`. That matters more on this side than on
the client side: a counsellor account is a plausible thing for an attacker to
obtain, and an unscoped lookup would turn one compromised login into access to
every session in the system.

The joining rule is the same code the client goes through, so neither party can
enter a room the other cannot.
"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session

from niya_triage.tz import known_zones

from . import booking_service, db, settings
from .deps import require_counsellor
from .models import Account, utcnow
from .security import hash_password, password_problems, verify_password
from .templating import templates

router = APIRouter(prefix="/expert")


def _page(request: Request, name: str, account: Account, status_code: int = 200, **extra):
    return templates.TemplateResponse(
        request,
        name,
        {"account": account, "profile": account.counsellor_profile, **extra},
        status_code=status_code,
    )


# ---------------------------------------------------------------------------
# Sessions
# ---------------------------------------------------------------------------


@router.get("", response_class=HTMLResponse)
def schedule(
    request: Request,
    account: Account = Depends(require_counsellor),
    session: Session = Depends(db.get_session),
):
    profile = account.counsellor_profile
    bookings = booking_service.list_counsellor_bookings(session, profile)

    return _page(
        request, "expert/schedule.html", account,
        bookings=[
            {"booking": booking, "connect": booking_service.connect_state(booking)}
            for booking in bookings
        ],
        # Their own payout, not what the client paid. The margin is NIYA's
        # business and showing it here would invite a conversation this screen
        # is not the place for.
        expected_minor=sum(
            booking.payment.counsellor_fee_minor
            for booking in bookings
            if booking.payment is not None and booking.payment.status == "paid"
        ),
        currency=profile.currency,
        now=utcnow(),
    )


@router.get("/session/{booking_ref}", response_class=HTMLResponse)
def join_session(
    request: Request,
    booking_ref: str,
    account: Account = Depends(require_counsellor),
    session: Session = Depends(db.get_session),
):
    profile = account.counsellor_profile
    booking = booking_service.get_counsellor_booking(session, profile, booking_ref)
    if booking is None:
        return RedirectResponse("/expert", status_code=303)

    grant = booking_service.authorise_connection(session, booking, party="counsellor")
    if not grant["authorised"]:
        return _page(
            request, "expert/session_closed.html", account,
            booking=booking, connect=grant, status_code=403,
        )

    return _page(request, "expert/session.html", account, booking=booking, connect=grant)


@router.post("/session/{booking_ref}/leave")
def leave_session(
    booking_ref: str,
    account: Account = Depends(require_counsellor),
    session: Session = Depends(db.get_session),
):
    profile = account.counsellor_profile
    booking = booking_service.get_counsellor_booking(session, profile, booking_ref)
    if booking is not None:
        booking_service.record_leave(session, booking, party="counsellor")
    return RedirectResponse("/expert", status_code=303)


# ---------------------------------------------------------------------------
# Availability
# ---------------------------------------------------------------------------


@router.get("/availability", response_class=HTMLResponse)
def availability_form(
    request: Request,
    saved: str = "",
    account: Account = Depends(require_counsellor),
):
    return _page(
        request, "expert/availability.html", account,
        zones=known_zones(), errors={}, saved=bool(saved),
    )


@router.post("/availability", response_class=HTMLResponse)
def update_availability(
    request: Request,
    account: Account = Depends(require_counsellor),
    session: Session = Depends(db.get_session),
    timezone_name: str = Form("Asia/Kolkata"),
    working_hours_start: str = Form("9"),
    working_hours_end: str = Form("18"),
    max_cases: str = Form("20"),
    accepting: str = Form(""),
):
    profile = account.counsellor_profile
    errors = {}

    if timezone_name not in known_zones():
        errors["timezone_name"] = "Choose your timezone from the list."

    try:
        start = float(working_hours_start)
        end = float(working_hours_end)
    except ValueError:
        start, end = -1.0, -1.0

    if not (0 <= start < end <= 24):
        errors["working_hours"] = "Your day has to start before it ends."
    elif end - start < 1:
        errors["working_hours"] = "Leave at least an hour, or nobody can book you."

    if errors:
        return _page(
            request, "expert/availability.html", account,
            zones=known_zones(), errors=errors, saved=False, status_code=400,
        )

    # Changing the timezone moves every future slot this counsellor offers.
    # Stored bookings are UTC and are unaffected, which is exactly why times are
    # stored that way - an existing appointment keeps its real moment.
    profile.timezone = timezone_name
    profile.working_hours_start = start
    profile.working_hours_end = end
    try:
        profile.max_cases = max(1, int(float(max_cases)))
    except ValueError:
        pass
    profile.active = bool(accepting)
    session.commit()

    return RedirectResponse("/expert/availability?saved=1", status_code=303)


# ---------------------------------------------------------------------------
# Password
# ---------------------------------------------------------------------------


@router.get("/password", response_class=HTMLResponse)
def password_form(
    request: Request,
    account: Account = Depends(require_counsellor),
):
    return _page(request, "expert/password.html", account, errors={}, saved=False)


@router.post("/password", response_class=HTMLResponse)
def change_password(
    request: Request,
    account: Account = Depends(require_counsellor),
    session: Session = Depends(db.get_session),
    current_password: str = Form(""),
    new_password: str = Form(""),
):
    """Counsellors start on an admin-issued password, so changing it matters."""
    errors = {}
    if not verify_password(current_password, account.password_hash):
        errors["current_password"] = "That is not your current password."

    problems = password_problems(new_password, account.email)
    if problems:
        errors["new_password"] = " ".join(problems)

    if errors:
        return _page(
            request, "expert/password.html", account,
            errors=errors, saved=False, status_code=400,
        )

    account.password_hash = hash_password(new_password)
    session.commit()
    return _page(request, "expert/password.html", account, errors={}, saved=True)
