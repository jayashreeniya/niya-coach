"""The counsellor roster, backed by the database.

The engine matches on `niya_triage.counsellors.Counsellor` objects and knows
nothing about money, logins or portals. This module is the only place that
translates between a `CounsellorProfile` row and that dataclass, which keeps the
matching code unaware of commercial data - a counsellor should never rank higher
because they cost more.

`data/counsellors.json` is now a seed rather than the source of truth. It is
loaded once into an empty database and never read again, because on Render the
container filesystem is rebuilt from the image on every deploy.
"""

from __future__ import annotations

import json
import re
from typing import List, Optional

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from niya_triage import config
from niya_triage.counsellors import Counsellor, CounsellorRepository

from . import settings
from .models import CounsellorProfile, join_values

#: Share of the client price that goes to the counsellor when seeding. Only ever
#: applied to the synthetic starter roster - once an admin onboards someone they
#: type both numbers, so no percentage is implied anywhere in the live flow.
SEED_COUNSELLOR_SHARE = 0.70


# ---------------------------------------------------------------------------
# Row -> engine object
# ---------------------------------------------------------------------------


def to_engine(profile: CounsellorProfile) -> Counsellor:
    """Build the matching engine's view of a counsellor.

    Deliberately drops every pricing field. The shortlist is ordered by fit, and
    feeding fees into it would let the ranking drift towards revenue.
    """
    return Counsellor(
        id=profile.ref,
        display_name=profile.display_name,
        credentials=profile.credentials,
        active=profile.active,
        capabilities=profile.capability_list,
        category_experience=profile.experience_map,
        years_experience=profile.years_experience,
        languages=profile.language_list or ["english"],
        country_context=profile.country_list,
        diaspora_background=profile.diaspora_background,
        client_types=profile.client_type_list or ["student", "professional"],
        timezone=profile.timezone,
        working_hours_local=(profile.working_hours_start, profile.working_hours_end),
        next_available_hours=profile.next_available_hours,
        slots_next_7_days=profile.slots_next_7_days,
        active_cases=profile.active_cases,
        max_cases=profile.max_cases,
        preferred_complexity=profile.preferred_complexity,
        max_complexity=profile.max_complexity,
        satisfaction=profile.satisfaction,
        completion_rate=profile.completion_rate,
        return_rate=profile.return_rate,
        referral_rate=profile.referral_rate,
        rematch_rate=profile.rematch_rate,
        sessions_delivered=profile.sessions_delivered,
        escalation_capability=profile.escalation_capability,
        clinically_qualified=profile.clinically_qualified,
        crisis_trained=profile.crisis_trained,
        notes=profile.notes,
    )


def repository(session: Session, include_inactive: bool = False) -> CounsellorRepository:
    """The roster in the shape `triage()` expects.

    Built per request rather than cached, so a counsellor deactivated in the
    admin portal stops being offered on the very next intake instead of after a
    restart.
    """
    return CounsellorRepository([to_engine(profile) for profile in profiles(session, include_inactive)])


def profiles(session: Session, include_inactive: bool = False) -> List[CounsellorProfile]:
    statement = select(CounsellorProfile).order_by(CounsellorProfile.display_name)
    if not include_inactive:
        statement = statement.where(CounsellorProfile.active.is_(True))
    return list(session.scalars(statement).all())


def profile_for(session: Session, ref: str) -> Optional[CounsellorProfile]:
    return session.scalar(select(CounsellorProfile).where(CounsellorProfile.ref == ref))


def profile_for_account(session: Session, account_id: int) -> Optional[CounsellorProfile]:
    return session.scalar(
        select(CounsellorProfile).where(CounsellorProfile.account_id == account_id)
    )


def price_map(session: Session) -> dict:
    """ref -> client price in minor units, for rendering a shortlist."""
    rows = session.execute(
        select(CounsellorProfile.ref, CounsellorProfile.client_price_minor, CounsellorProfile.currency)
    ).all()
    return {ref: (price, currency) for ref, price, currency in rows}


# ---------------------------------------------------------------------------
# References
# ---------------------------------------------------------------------------


def next_ref(session: Session) -> str:
    """The next free C-number.

    Derived from the highest existing one rather than from the row count, so
    deleting a profile cannot hand its reference to somebody new and quietly
    attach them to the old counsellor's bookings.
    """
    highest = 0
    for (ref,) in session.execute(select(CounsellorProfile.ref)).all():
        match = re.fullmatch(r"C(\d+)", str(ref).strip().upper())
        if match:
            highest = max(highest, int(match.group(1)))
    return f"C{highest + 1:03d}"


# ---------------------------------------------------------------------------
# Seeding
# ---------------------------------------------------------------------------


def _seed_price(years_experience: float) -> int:
    """A plausible starting price, varied so the roster is not uniform.

    Only ever used for the synthetic starter data. Rounded to whole currency
    units, because a session priced at 1,437.50 looks like a bug.
    """
    base = settings.SESSION_PRICE_MINOR
    multiplier = min(1.6, max(0.7, 0.8 + (years_experience or 0) / 40))
    return int(round(base * multiplier / 10000.0)) * 10000


def seed_from_file(session: Session, path=None) -> int:
    """Load the JSON roster into an empty database.

    Idempotent by reference: counsellors that already exist are left alone, so
    running this against a live database cannot overwrite a price an admin set.
    Returns the number of counsellors inserted.
    """
    target = path or config.COUNSELLOR_FILE
    if not target.exists():
        return 0

    with open(target, "r", encoding="utf-8") as handle:
        payload = json.load(handle)
    records = payload["counsellors"] if isinstance(payload, dict) else payload

    existing = {
        ref for (ref,) in session.execute(select(CounsellorProfile.ref)).all()
    }

    added = 0
    for record in records:
        ref = str(record.get("id", "")).strip()
        if not ref or ref in existing:
            continue

        hours = record.get("working_hours_local") or [9.0, 18.0]
        years = float(record.get("years_experience", 0) or 0)
        price = _seed_price(years)

        session.add(
            CounsellorProfile(
                ref=ref,
                display_name=record.get("display_name", ref),
                credentials=record.get("credentials", ""),
                active=bool(record.get("active", True)),
                counsellor_fee_minor=int(round(price * SEED_COUNSELLOR_SHARE / 10000.0)) * 10000,
                client_price_minor=price,
                currency=settings.SESSION_CURRENCY,
                capabilities=join_values(record.get("capabilities")),
                category_experience=json.dumps(record.get("category_experience") or {}),
                years_experience=years,
                languages=join_values(record.get("languages")) or "english",
                country_context=join_values(record.get("country_context")),
                diaspora_background=bool(record.get("diaspora_background", False)),
                client_types=join_values(record.get("client_types")) or "student,professional",
                timezone=record.get("timezone", "Asia/Kolkata"),
                working_hours_start=float(hours[0]),
                working_hours_end=float(hours[1]),
                next_available_hours=float(record.get("next_available_hours", 24.0)),
                slots_next_7_days=int(record.get("slots_next_7_days", 0)),
                active_cases=int(record.get("active_cases", 0)),
                max_cases=int(record.get("max_cases", 20)),
                preferred_complexity=record.get("preferred_complexity", "moderate"),
                max_complexity=record.get("max_complexity", "high"),
                satisfaction=float(record.get("satisfaction", 0.0)),
                completion_rate=float(record.get("completion_rate", 0.0)),
                return_rate=float(record.get("return_rate", 0.0)),
                referral_rate=float(record.get("referral_rate", 0.0)),
                rematch_rate=float(record.get("rematch_rate", 0.0)),
                sessions_delivered=int(record.get("sessions_delivered", 0)),
                escalation_capability=bool(record.get("escalation_capability", False)),
                clinically_qualified=bool(record.get("clinically_qualified", False)),
                crisis_trained=bool(record.get("crisis_trained", False)),
                notes=record.get("notes", ""),
            )
        )
        added += 1

    if added:
        session.commit()
    return added


def count(session: Session) -> int:
    return int(session.scalar(select(func.count(CounsellorProfile.id))) or 0)
