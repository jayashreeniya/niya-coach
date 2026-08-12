"""Page routes.

Ordinary HTML forms throughout, with POST-redirect-GET so a refresh never
resubmits a payment or a booking. Nothing requires JavaScript.

Every protected route declares `account: Account = Depends(require_account)`, so
being signed in is enforced by the route signature rather than by a check each
handler has to remember. Anything that reaches a specific booking goes through
`booking_service.get_owned_booking`, which scopes by account id.
"""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from niya_triage import IntakeRequest, triage
from niya_triage.contact import normalise_phone
from niya_triage.emergency import resources_for, supported_countries
from niya_triage.redact import redact_for_audit
from niya_triage.taxonomy import PATHWAYS
from niya_triage.tz import known_zones

from . import booking_service, db, payments, roster, settings
from .deps import current_account, home_for, require_account
from .models import Account, TriageCase, utcnow
from .security import (
    authenticate,
    create_session,
    hash_password,
    is_valid_email,
    normalise_email,
    password_problems,
    revoke_session,
)
from .templating import templates

router = APIRouter()

LANGUAGES = [
    "english", "hindi", "tamil", "telugu", "malayalam", "punjabi",
    "bengali", "marathi", "gujarati", "urdu", "kannada",
]


def _page(
    request: Request,
    name: str,
    account: Optional[Account] = None,
    status_code: int = 200,
    **extra,
):
    return templates.TemplateResponse(
        request, name, {"account": account, **extra}, status_code=status_code
    )


def _set_session_cookie(response, token: str) -> None:
    response.set_cookie(
        settings.SESSION_COOKIE_NAME,
        token,
        max_age=settings.SESSION_MAX_AGE_DAYS * 24 * 3600,
        httponly=True,   # unreadable from JavaScript, unlike a token in localStorage
        secure=settings.SESSION_COOKIE_SECURE,
        samesite="lax",  # survives the return trip from a payment gateway
        path="/",
    )


def _load_case(session: Session, account: Account, case_ref: str) -> Optional[TriageCase]:
    """Scoped by account, so a guessed reference is not enough to read a case."""
    return session.scalar(
        select(TriageCase).where(
            TriageCase.case_ref == case_ref, TriageCase.account_id == account.id
        )
    )


# ---------------------------------------------------------------------------
# Public
# ---------------------------------------------------------------------------


@router.get("/", response_class=HTMLResponse)
def landing(request: Request, account: Optional[Account] = Depends(current_account)):
    if account:
        return RedirectResponse(home_for(account), status_code=303)
    return _page(request, "landing.html")


# ---------------------------------------------------------------------------
# Sign up and sign in
# ---------------------------------------------------------------------------


@router.get("/signup", response_class=HTMLResponse)
def signup_form(request: Request):
    return _page(
        request, "signup.html",
        countries=supported_countries(), zones=known_zones(),
        languages=LANGUAGES, form={}, errors={},
    )


@router.post("/signup", response_class=HTMLResponse)
def signup(
    request: Request,
    session: Session = Depends(db.get_session),
    full_name: str = Form(""),
    email: str = Form(...),
    password: str = Form(...),
    phone: str = Form(""),
    country: str = Form(""),
    timezone_name: str = Form("UTC"),
    languages: List[str] = Form(default=[]),
):
    form = {
        "full_name": full_name, "email": email, "phone": phone,
        "country": country, "timezone_name": timezone_name, "languages": languages,
    }
    errors = {}

    clean_email = normalise_email(email)
    if not is_valid_email(clean_email):
        errors["email"] = "That does not look like an email address."
    elif session.scalar(select(Account).where(Account.email == clean_email)):
        errors["email"] = "An account with that email already exists. Sign in instead."

    problems = password_problems(password, clean_email)
    if problems:
        errors["password"] = " ".join(problems)

    clean_phone = normalise_phone(phone, country=country) if phone.strip() else None
    if phone.strip() and not clean_phone:
        errors["phone"] = "We could not read that number. Include your country code."

    # Validated rather than defaulted. Falling back to UTC for an unrecognised
    # value would show someone every appointment at the wrong hour.
    if timezone_name not in known_zones():
        errors["timezone"] = "Please choose your timezone from the list."

    if errors:
        return _page(
            request, "signup.html",
            countries=supported_countries(), zones=known_zones(),
            languages=LANGUAGES, form=form, errors=errors, status_code=400,
        )

    account = Account(
        email=clean_email,
        password_hash=hash_password(password),
        full_name=full_name.strip()[:120],
        phone=clean_phone,
        country=country.strip().lower(),
        timezone=timezone_name,
        preferred_languages=",".join(languages) or "english",
        role="client",
    )
    session.add(account)
    session.commit()

    token, _ = create_session(session, account, request.headers.get("user-agent", ""))
    response = RedirectResponse("/intake", status_code=303)
    _set_session_cookie(response, token)
    return response


@router.get("/login", response_class=HTMLResponse)
def login_form(request: Request, next: str = ""):
    return _page(request, "login.html", next=next, error=None, email="")


@router.post("/login", response_class=HTMLResponse)
def login(
    request: Request,
    session: Session = Depends(db.get_session),
    email: str = Form(...),
    password: str = Form(...),
    next: str = Form(""),
):
    account, error = authenticate(session, email, password)
    if account is None:
        return _page(
            request, "login.html", next=next, error=error, email=email, status_code=401
        )

    token, _ = create_session(session, account, request.headers.get("user-agent", ""))
    # Relative paths only, so a crafted ?next= cannot bounce someone off-site.
    # With no `next`, each role lands on its own home rather than everyone being
    # sent to the client intake form.
    destination = home_for(account)
    if next.startswith("/") and not next.startswith("//"):
        destination = next
    response = RedirectResponse(destination, status_code=303)
    _set_session_cookie(response, token)
    return response


@router.post("/logout")
def logout(request: Request, session: Session = Depends(db.get_session)):
    revoke_session(session, request.cookies.get(settings.SESSION_COOKIE_NAME))
    response = RedirectResponse("/", status_code=303)
    response.delete_cookie(settings.SESSION_COOKIE_NAME, path="/")
    return response


# ---------------------------------------------------------------------------
# Triage
# ---------------------------------------------------------------------------


@router.get("/intake", response_class=HTMLResponse)
def intake_form(request: Request, account: Account = Depends(require_account)):
    return _page(request, "intake.html", account, countries=supported_countries())


@router.post("/intake", response_class=HTMLResponse)
def submit_intake(
    request: Request,
    account: Account = Depends(require_account),
    session: Session = Depends(db.get_session),
    text: str = Form(...),
    desired_timing: str = Form("flexible"),
):
    if not text.strip():
        return RedirectResponse("/intake", status_code=303)

    result = triage(
        IntakeRequest(
            text=text,
            country=account.country or "unknown",
            timezone=account.timezone,
            user_type="student",
            preferred_languages=account.languages or ["english"],
            desired_timing=desired_timing,
        ),
        # Read fresh from the database, so a counsellor onboarded or deactivated
        # in the admin portal takes effect on the next intake, not the next
        # restart.
        repository=roster.repository(session),
        log=True,
    )

    case = TriageCase(
        case_ref=result.case_id,
        account_id=account.id,
        primary_category=result.primary_category,
        secondary_categories=",".join(result.secondary_categories),
        urgency=result.urgency.value,
        confidence=int(round(result.confidence_score * 100)),
        pathway=result.recommended_pathway,
        risk_flags=",".join(result.risk_flags),
        safety_blocked=bool(result.safety and result.safety.block_automated_pathway),
        human_review_required=result.human_review_required,
        # The raw text is never stored. `redact_for_audit` strips phone numbers,
        # emails and street-level locations but does NOT detect personal names,
        # so the stored text can still contain a name someone typed. The UI copy
        # says exactly that rather than promising more than this delivers.
        redacted_text=redact_for_audit(text)[:4000],
        shortlist_ids=",".join(match.counsellor_id for match in result.shortlist),
    )
    session.add(case)
    session.commit()

    return RedirectResponse(f"/result/{case.case_ref}", status_code=303)


@router.get("/result/{case_ref}", response_class=HTMLResponse)
def result_page(
    request: Request,
    case_ref: str,
    account: Account = Depends(require_account),
    session: Session = Depends(db.get_session),
):
    case = _load_case(session, account, case_ref)
    if case is None:
        return _page(
            request, "error.html", account, code=404, title="Not found",
            message="We could not find that result.", status_code=404,
        )

    repository = roster.repository(session)
    prices = roster.price_map(session)

    shortlist = []
    for counsellor_id in case.shortlist_ids.split(","):
        counsellor = repository.get(counsellor_id) if counsellor_id else None
        if counsellor is None:
            # Shortlisted earlier, deactivated since. Dropping it is better than
            # offering a counsellor whose calendar will refuse the booking.
            continue
        price, currency = prices.get(
            counsellor_id, (settings.SESSION_PRICE_MINOR, settings.SESSION_CURRENCY)
        )
        shortlist.append(
            {"counsellor": counsellor, "price_minor": price, "currency": currency}
        )

    return _page(
        request, "result.html", account,
        case=case,
        shortlist=shortlist,
        pathway=PATHWAYS.get(case.pathway),
        emergency=resources_for(account.country or "unknown") if case.safety_blocked else [],
    )


# ---------------------------------------------------------------------------
# Booking
# ---------------------------------------------------------------------------


@router.get("/book/{case_ref}/{counsellor_id}", response_class=HTMLResponse)
def choose_slot(
    request: Request,
    case_ref: str,
    counsellor_id: str,
    on: Optional[str] = None,
    account: Account = Depends(require_account),
    session: Session = Depends(db.get_session),
):
    case = _load_case(session, account, case_ref)
    if case is None:
        return RedirectResponse("/intake", status_code=303)
    # Checked before the counsellor lookup, so a flagged case is turned away
    # whatever is in the rest of the URL.
    if case.safety_blocked:
        return RedirectResponse(f"/result/{case_ref}", status_code=303)

    profile = roster.profile_for(session, counsellor_id)
    if profile is None or not profile.active:
        return RedirectResponse(f"/result/{case_ref}", status_code=303)
    counsellor = roster.to_engine(profile)

    days = booking_service.days_for(session, counsellor, account.timezone, case.urgency)
    if not days:
        return _page(
            request, "book.html", account, case=case, counsellor=counsellor,
            profile=profile, days=[], chosen_day=None, slots=[], error=None,
        )

    chosen_day = days[0]
    if on:
        try:
            candidate = datetime.strptime(on, "%Y-%m-%d").date()
            if candidate in days:
                chosen_day = candidate
        except ValueError:
            pass

    slots = booking_service.slots_for(
        session, counsellor, account.timezone, case.urgency, on_date=chosen_day
    )
    return _page(
        request, "book.html", account, case=case, counsellor=counsellor,
        profile=profile, days=days, chosen_day=chosen_day, slots=slots, error=None,
    )


@router.post("/book/{case_ref}/{counsellor_id}")
def hold(
    request: Request,
    case_ref: str,
    counsellor_id: str,
    account: Account = Depends(require_account),
    session: Session = Depends(db.get_session),
    slot_id: str = Form(...),
):
    case = _load_case(session, account, case_ref)
    if case is None:
        return RedirectResponse("/intake", status_code=303)
    # The same guard as the GET. Without it, posting this form directly would
    # book a session for a case that was routed to a crisis line.
    if case.safety_blocked:
        return RedirectResponse(f"/result/{case_ref}", status_code=303)

    profile = roster.profile_for(session, counsellor_id)
    if profile is None or not profile.active:
        return RedirectResponse(f"/result/{case_ref}", status_code=303)
    counsellor = roster.to_engine(profile)

    try:
        booking = booking_service.hold_slot(
            session, account, counsellor, slot_id, case=case
        )
    except booking_service.BookingError as error:
        days = booking_service.days_for(session, counsellor, account.timezone, case.urgency)
        slots = booking_service.slots_for(
            session, counsellor, account.timezone, case.urgency,
            on_date=days[0] if days else None,
        )
        return _page(
            request, "book.html", account, case=case, counsellor=counsellor,
            profile=profile, days=days, chosen_day=days[0] if days else None,
            slots=slots, error=str(error), status_code=409,
        )

    return RedirectResponse(f"/checkout/{booking.booking_ref}", status_code=303)


@router.get("/checkout/{booking_ref}", response_class=HTMLResponse)
def checkout(
    request: Request,
    booking_ref: str,
    account: Account = Depends(require_account),
    session: Session = Depends(db.get_session),
):
    booking = booking_service.get_owned_booking(session, account, booking_ref)
    if booking is None:
        return RedirectResponse("/appointments", status_code=303)
    if booking.status == "confirmed":
        return RedirectResponse(f"/appointments?just={booking.booking_ref}", status_code=303)
    if booking.status != "held":
        return RedirectResponse("/appointments", status_code=303)

    return _page(request, "checkout.html", account, booking=booking, error=None)


@router.post("/checkout/{booking_ref}")
def pay(
    request: Request,
    booking_ref: str,
    account: Account = Depends(require_account),
    session: Session = Depends(db.get_session),
    payment_reference: str = Form(""),
    signature: str = Form(""),
):
    """Complete payment.

    With Razorpay configured the gateway supplies the reference and signature.
    Without it the server generates a valid pair here, which is only possible
    because `simulate_successful_payment` refuses to run when keys are present.
    Either way `confirm_payment` verifies before confirming.
    """
    booking = booking_service.get_owned_booking(session, account, booking_ref)
    if booking is None:
        return RedirectResponse("/appointments", status_code=303)

    if not settings.PAYMENTS_LIVE and not payment_reference:
        simulated = payments.simulate_successful_payment(booking.payment.provider_order_id)
        payment_reference = simulated["payment_reference"]
        signature = simulated["signature"]

    try:
        booking_service.confirm_payment(session, booking, payment_reference, signature)
    except booking_service.BookingError as error:
        return _page(
            request, "checkout.html", account,
            booking=booking, error=str(error), status_code=402,
        )

    return RedirectResponse(f"/appointments?just={booking.booking_ref}", status_code=303)


# ---------------------------------------------------------------------------
# Appointments and joining
# ---------------------------------------------------------------------------


@router.get("/appointments", response_class=HTMLResponse)
def appointments(
    request: Request,
    just: str = "",
    account: Account = Depends(require_account),
    session: Session = Depends(db.get_session),
):
    bookings = booking_service.list_bookings(session, account)
    return _page(
        request, "appointments.html", account,
        bookings=[
            {"booking": booking, "connect": booking_service.connect_state(booking)}
            for booking in bookings
        ],
        just=just,
        now=utcnow(),
    )


@router.post("/appointments/{booking_ref}/cancel")
def cancel_booking(
    booking_ref: str,
    account: Account = Depends(require_account),
    session: Session = Depends(db.get_session),
):
    booking = booking_service.get_owned_booking(session, account, booking_ref)
    if booking is not None:
        booking_service.cancel(session, booking)
    return RedirectResponse("/appointments", status_code=303)


@router.get("/session/{booking_ref}", response_class=HTMLResponse)
def join_session(
    request: Request,
    booking_ref: str,
    account: Account = Depends(require_account),
    session: Session = Depends(db.get_session),
):
    """The call page. Entry is decided here, on the server."""
    booking = booking_service.get_owned_booking(session, account, booking_ref)
    if booking is None:
        return RedirectResponse("/appointments", status_code=303)

    grant = booking_service.authorise_connection(session, booking, party="client")
    if not grant["authorised"]:
        return _page(
            request, "session_closed.html", account,
            booking=booking, connect=grant, status_code=403,
        )

    return _page(request, "session.html", account, booking=booking, connect=grant)


@router.post("/session/{booking_ref}/leave")
def leave_session(
    booking_ref: str,
    account: Account = Depends(require_account),
    session: Session = Depends(db.get_session),
):
    booking = booking_service.get_owned_booking(session, account, booking_ref)
    if booking is not None:
        booking_service.record_leave(session, booking, party="client")
    return RedirectResponse("/appointments", status_code=303)


# ---------------------------------------------------------------------------
# Account
# ---------------------------------------------------------------------------


@router.get("/account", response_class=HTMLResponse)
def account_page(request: Request, account: Account = Depends(require_account)):
    return _page(
        request, "account.html", account,
        zones=known_zones(), countries=supported_countries(), saved=False,
    )


@router.post("/account", response_class=HTMLResponse)
def update_account(
    request: Request,
    account: Account = Depends(require_account),
    session: Session = Depends(db.get_session),
    full_name: str = Form(""),
    phone: str = Form(""),
    country: str = Form(""),
    timezone_name: str = Form("UTC"),
):
    account.full_name = full_name.strip()[:120]
    account.phone = normalise_phone(phone, country=country) if phone.strip() else None
    account.country = country.strip().lower()
    if timezone_name in known_zones():
        account.timezone = timezone_name
    session.commit()

    return _page(
        request, "account.html", account,
        zones=known_zones(), countries=supported_countries(), saved=True,
    )
