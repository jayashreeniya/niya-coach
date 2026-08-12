"""The admin portal: onboarding counsellors and setting what they cost.

Kept in its own router so the client-facing routes and the internal ones are
separated in the source as well as by role. Every route here depends on
`require_admin`, which is what makes the separation real.

Money is entered and shown in major units (1,500.00) and stored in minor units
(150000), because storing currency as a float is how rounding errors end up in
someone's invoice.
"""

from __future__ import annotations

import json
import secrets
from typing import List, Optional

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from niya_triage.contact import normalise_phone
from niya_triage.emergency import supported_countries
from niya_triage.taxonomy import CATEGORIES, all_capabilities
from niya_triage.tz import known_zones

from . import db, roster, settings
from .deps import require_admin
from .models import Account, Booking, CounsellorProfile, Payment, join_values
from .security import hash_password, is_valid_email, normalise_email
from .templating import templates

router = APIRouter(prefix="/admin")

CLIENT_TYPES = ["student", "professional", "couple", "family", "parent"]
COMPLEXITIES = ["low", "moderate", "high", "critical"]
LANGUAGES = [
    "english", "hindi", "tamil", "telugu", "malayalam", "punjabi",
    "bengali", "marathi", "gujarati", "urdu", "kannada",
]
#: Experience assigned to a category an admin ticks. The engine wants a 0..1
#: proficiency per category; asking an admin to type 21 numbers during
#: onboarding would guarantee sloppy data, so a tick means "works in this area"
#: and the value is uniform until real outcome data replaces it.
TICKED_EXPERIENCE = 0.8


def _page(request: Request, name: str, account: Account, status_code: int = 200, **extra):
    return templates.TemplateResponse(
        request, name, {"account": account, **extra}, status_code=status_code
    )


def _form_options() -> dict:
    return {
        "zones": known_zones(),
        "countries": supported_countries(),
        "languages": LANGUAGES,
        "client_types": CLIENT_TYPES,
        "complexities": COMPLEXITIES,
        "capabilities": all_capabilities(),
        "categories": sorted(CATEGORIES.values(), key=lambda item: item.label),
        "currency": settings.SESSION_CURRENCY,
    }


def _to_minor(raw: str) -> Optional[int]:
    """'1500' or '1,500.50' -> 150000. None if it is not a usable amount."""
    cleaned = (raw or "").strip().replace(",", "").replace("₹", "")
    if not cleaned:
        return None
    try:
        value = round(float(cleaned) * 100)
    except ValueError:
        return None
    return int(value) if value >= 0 else None


def _to_hour(raw: str, fallback: float) -> float:
    try:
        return max(0.0, min(24.0, float(str(raw).strip())))
    except (TypeError, ValueError):
        return fallback


def _to_number(raw: str, fallback: float) -> float:
    try:
        return float(str(raw).strip())
    except (TypeError, ValueError):
        return fallback


# ---------------------------------------------------------------------------
# Dashboard
# ---------------------------------------------------------------------------


@router.get("", response_class=HTMLResponse)
def dashboard(
    request: Request,
    account: Account = Depends(require_admin),
    session: Session = Depends(db.get_session),
):
    profiles = roster.profiles(session, include_inactive=True)

    # Margin actually taken, from the snapshots on paid bookings, rather than
    # what the current prices imply. The two differ as soon as anyone reprices,
    # and only the first one is money.
    earned = session.execute(
        select(
            func.count(Payment.id),
            func.coalesce(func.sum(Payment.amount_minor), 0),
            func.coalesce(func.sum(Payment.platform_fee_minor), 0),
            func.coalesce(func.sum(Payment.counsellor_fee_minor), 0),
        ).where(Payment.status == "paid")
    ).one()

    return _page(
        request, "admin/dashboard.html", account,
        profiles=profiles,
        active_count=sum(1 for item in profiles if item.active),
        without_login=[item for item in profiles if item.account_id is None],
        paid_sessions=earned[0],
        gross_minor=int(earned[1]),
        margin_minor=int(earned[2]),
        payout_minor=int(earned[3]),
        currency=settings.SESSION_CURRENCY,
    )


@router.get("/bookings", response_class=HTMLResponse)
def bookings(
    request: Request,
    account: Account = Depends(require_admin),
    session: Session = Depends(db.get_session),
):
    rows = session.execute(
        select(Booking, Payment)
        .join(Payment, Payment.booking_id == Booking.id)
        .order_by(Booking.start_utc.desc())
        .limit(100)
    ).all()
    return _page(
        request, "admin/bookings.html", account,
        rows=[{"booking": booking, "payment": payment} for booking, payment in rows],
    )


# ---------------------------------------------------------------------------
# Onboarding
# ---------------------------------------------------------------------------


@router.get("/counsellors/new", response_class=HTMLResponse)
def new_counsellor_form(
    request: Request,
    account: Account = Depends(require_admin),
    session: Session = Depends(db.get_session),
):
    return _page(
        request, "admin/counsellor_form.html", account,
        profile=None, form={"ref": roster.next_ref(session)}, errors={},
        created=None, **_form_options(),
    )


@router.post("/counsellors/new", response_class=HTMLResponse)
def create_counsellor(
    request: Request,
    account: Account = Depends(require_admin),
    session: Session = Depends(db.get_session),
    display_name: str = Form(""),
    email: str = Form(""),
    credentials: str = Form(""),
    phone: str = Form(""),
    counsellor_fee: str = Form(""),
    client_price: str = Form(""),
    timezone_name: str = Form("Asia/Kolkata"),
    working_hours_start: str = Form("9"),
    working_hours_end: str = Form("18"),
    years_experience: str = Form("0"),
    max_cases: str = Form("20"),
    max_complexity: str = Form("high"),
    languages: List[str] = Form(default=[]),
    country_context: List[str] = Form(default=[]),
    client_types: List[str] = Form(default=[]),
    capabilities: List[str] = Form(default=[]),
    categories: List[str] = Form(default=[]),
    clinically_qualified: str = Form(""),
    crisis_trained: str = Form(""),
    escalation_capability: str = Form(""),
    notes: str = Form(""),
):
    form = {
        "display_name": display_name, "email": email, "credentials": credentials,
        "phone": phone, "counsellor_fee": counsellor_fee, "client_price": client_price,
        "timezone_name": timezone_name, "working_hours_start": working_hours_start,
        "working_hours_end": working_hours_end, "years_experience": years_experience,
        "max_cases": max_cases, "max_complexity": max_complexity,
        "languages": languages, "country_context": country_context,
        "client_types": client_types, "capabilities": capabilities,
        "categories": categories, "notes": notes,
        "clinically_qualified": bool(clinically_qualified),
        "crisis_trained": bool(crisis_trained),
        "escalation_capability": bool(escalation_capability),
    }

    fee_minor = _to_minor(counsellor_fee)
    price_minor = _to_minor(client_price)
    errors = _validate(session, form, fee_minor, price_minor, existing=None)

    if errors:
        return _page(
            request, "admin/counsellor_form.html", account,
            profile=None, form=form, errors=errors, created=None,
            status_code=400, **_form_options(),
        )

    clean_email = normalise_email(email)
    login: Optional[Account] = None
    temporary_password: Optional[str] = None
    if clean_email:
        # A readable one-time password, handed to the admin to pass on. Not
        # emailed, because sending credentials by email is worse, and not
        # reusable, because the counsellor is asked to change it on first use.
        temporary_password = f"niya-{secrets.token_hex(4)}"
        login = Account(
            email=clean_email,
            password_hash=hash_password(temporary_password),
            full_name=display_name.strip()[:120],
            phone=normalise_phone(phone) if phone.strip() else None,
            timezone=timezone_name,
            role="counsellor",
            email_verified=True,
        )
        session.add(login)
        session.flush()

    profile = CounsellorProfile(ref=roster.next_ref(session), account_id=login.id if login else None)
    _apply(profile, form, fee_minor, price_minor)
    session.add(profile)
    session.commit()

    return _page(
        request, "admin/counsellor_form.html", account,
        profile=profile, form=_form_from(profile), errors={},
        created={"ref": profile.ref, "email": clean_email, "password": temporary_password},
        **_form_options(),
    )


# ---------------------------------------------------------------------------
# Editing
# ---------------------------------------------------------------------------


@router.get("/counsellors/{ref}", response_class=HTMLResponse)
def edit_counsellor_form(
    request: Request,
    ref: str,
    account: Account = Depends(require_admin),
    session: Session = Depends(db.get_session),
):
    profile = roster.profile_for(session, ref)
    if profile is None:
        return RedirectResponse("/admin", status_code=303)
    return _page(
        request, "admin/counsellor_form.html", account,
        profile=profile, form=_form_from(profile), errors={}, created=None,
        **_form_options(),
    )


@router.post("/counsellors/{ref}", response_class=HTMLResponse)
def update_counsellor(
    request: Request,
    ref: str,
    account: Account = Depends(require_admin),
    session: Session = Depends(db.get_session),
    display_name: str = Form(""),
    credentials: str = Form(""),
    counsellor_fee: str = Form(""),
    client_price: str = Form(""),
    timezone_name: str = Form("Asia/Kolkata"),
    working_hours_start: str = Form("9"),
    working_hours_end: str = Form("18"),
    years_experience: str = Form("0"),
    max_cases: str = Form("20"),
    max_complexity: str = Form("high"),
    languages: List[str] = Form(default=[]),
    country_context: List[str] = Form(default=[]),
    client_types: List[str] = Form(default=[]),
    capabilities: List[str] = Form(default=[]),
    categories: List[str] = Form(default=[]),
    clinically_qualified: str = Form(""),
    crisis_trained: str = Form(""),
    escalation_capability: str = Form(""),
    notes: str = Form(""),
):
    profile = roster.profile_for(session, ref)
    if profile is None:
        return RedirectResponse("/admin", status_code=303)

    form = {
        "display_name": display_name, "credentials": credentials,
        "counsellor_fee": counsellor_fee, "client_price": client_price,
        "timezone_name": timezone_name, "working_hours_start": working_hours_start,
        "working_hours_end": working_hours_end, "years_experience": years_experience,
        "max_cases": max_cases, "max_complexity": max_complexity,
        "languages": languages, "country_context": country_context,
        "client_types": client_types, "capabilities": capabilities,
        "categories": categories, "notes": notes,
        "clinically_qualified": bool(clinically_qualified),
        "crisis_trained": bool(crisis_trained),
        "escalation_capability": bool(escalation_capability),
    }

    fee_minor = _to_minor(counsellor_fee)
    price_minor = _to_minor(client_price)
    errors = _validate(session, form, fee_minor, price_minor, existing=profile)

    if errors:
        return _page(
            request, "admin/counsellor_form.html", account,
            profile=profile, form=form, errors=errors, created=None,
            status_code=400, **_form_options(),
        )

    _apply(profile, form, fee_minor, price_minor)
    session.commit()
    return RedirectResponse(f"/admin/counsellors/{profile.ref}?saved=1", status_code=303)


@router.post("/counsellors/{ref}/toggle")
def toggle_counsellor(
    ref: str,
    account: Account = Depends(require_admin),
    session: Session = Depends(db.get_session),
):
    """Take a counsellor off the roster, or put them back.

    Deactivating removes them from matching immediately but leaves their
    existing bookings alone. Cancelling those is a decision for a person, not a
    side effect of a checkbox.
    """
    profile = roster.profile_for(session, ref)
    if profile is not None:
        profile.active = not profile.active
        session.commit()
    return RedirectResponse("/admin", status_code=303)


# ---------------------------------------------------------------------------
# Shared form handling
# ---------------------------------------------------------------------------


def _validate(
    session: Session,
    form: dict,
    fee_minor: Optional[int],
    price_minor: Optional[int],
    existing: Optional[CounsellorProfile],
) -> dict:
    errors = {}

    if not form["display_name"].strip():
        errors["display_name"] = "A name is required."

    email = normalise_email(form.get("email", ""))
    if email:
        if not is_valid_email(email):
            errors["email"] = "That does not look like an email address."
        elif session.scalar(select(Account).where(Account.email == email)):
            errors["email"] = "An account with that email already exists."

    if fee_minor is None or fee_minor <= 0:
        errors["counsellor_fee"] = "Enter what this counsellor is paid per session."
    if price_minor is None or price_minor <= 0:
        errors["client_price"] = "Enter what the client pays per session."

    # A price below the fee is a loss on every booking. Almost always a typo,
    # and expensive to discover from a payout report a month later.
    if fee_minor and price_minor and price_minor < fee_minor:
        errors["client_price"] = (
            "The client price is below what the counsellor is paid, "
            "so NIYA would lose money on every session."
        )

    if form["timezone_name"] not in known_zones():
        errors["timezone_name"] = "Choose a timezone from the list."

    start = _to_hour(form["working_hours_start"], -1)
    end = _to_hour(form["working_hours_end"], -1)
    if start < 0 or end < 0 or end <= start:
        errors["working_hours"] = "Working hours must start before they end."

    if not form["languages"]:
        errors["languages"] = "Pick at least one language."

    return errors


def _apply(
    profile: CounsellorProfile, form: dict, fee_minor: int, price_minor: int
) -> None:
    profile.display_name = form["display_name"].strip()[:120]
    profile.credentials = form["credentials"].strip()[:255]
    profile.counsellor_fee_minor = fee_minor
    profile.client_price_minor = price_minor
    profile.currency = settings.SESSION_CURRENCY

    profile.capabilities = join_values(form["capabilities"])
    profile.category_experience = json.dumps(
        {category: TICKED_EXPERIENCE for category in form["categories"] if category in CATEGORIES}
    )
    profile.years_experience = max(0.0, _to_number(form["years_experience"], 0.0))
    profile.languages = join_values(form["languages"]) or "english"
    profile.country_context = join_values(form["country_context"])
    profile.client_types = join_values(form["client_types"]) or "student,professional"

    profile.timezone = form["timezone_name"]
    profile.working_hours_start = _to_hour(form["working_hours_start"], 9.0)
    profile.working_hours_end = _to_hour(form["working_hours_end"], 18.0)
    profile.max_cases = int(max(1, _to_number(form["max_cases"], 20)))
    profile.max_complexity = (
        form["max_complexity"] if form["max_complexity"] in COMPLEXITIES else "high"
    )

    profile.clinically_qualified = form["clinically_qualified"]
    profile.crisis_trained = form["crisis_trained"]
    # Holding a risk-flagged case needs a qualified person, so this cannot be
    # granted on its own. Saying otherwise here would route a crisis to someone
    # who is not equipped for it.
    profile.escalation_capability = form["escalation_capability"] and form["clinically_qualified"]
    profile.notes = form["notes"].strip()


def _form_from(profile: CounsellorProfile) -> dict:
    return {
        "ref": profile.ref,
        "display_name": profile.display_name,
        "email": profile.account.email if profile.account else "",
        "credentials": profile.credentials,
        "counsellor_fee": f"{profile.counsellor_fee_minor / 100:.2f}",
        "client_price": f"{profile.client_price_minor / 100:.2f}",
        "timezone_name": profile.timezone,
        "working_hours_start": f"{profile.working_hours_start:g}",
        "working_hours_end": f"{profile.working_hours_end:g}",
        "years_experience": f"{profile.years_experience:g}",
        "max_cases": str(profile.max_cases),
        "max_complexity": profile.max_complexity,
        "languages": profile.language_list,
        "country_context": profile.country_list,
        "client_types": profile.client_type_list,
        "capabilities": profile.capability_list,
        "categories": list(profile.experience_map.keys()),
        "notes": profile.notes,
        "clinically_qualified": profile.clinically_qualified,
        "crisis_trained": profile.crisis_trained,
        "escalation_capability": profile.escalation_capability,
    }
