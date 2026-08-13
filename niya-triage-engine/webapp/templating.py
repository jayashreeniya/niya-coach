"""Jinja environment and the filters the templates need."""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi.templating import Jinja2Templates

from . import settings

templates = Jinja2Templates(directory=str(settings.WEBAPP_ROOT / "templates"))


def money(amount_minor: int, currency: str = "INR") -> str:
    return f"{amount_minor / 100:,.2f} {currency}"


def zone(moment: datetime, timezone_name: str) -> datetime:
    from niya_triage.availability import to_zone

    return to_zone(moment, timezone_name)


def clock(moment: datetime) -> str:
    return f"{moment:%H:%M}"


def day_label(moment: datetime) -> str:
    return f"{moment:%A %d %B}"


def duration(seconds: int) -> str:
    """Human lead time, e.g. '2h 15m'. Used for the countdown to joining."""
    seconds = max(0, int(seconds))
    if seconds < 60:
        return f"{seconds}s"
    minutes, remainder = divmod(seconds, 60)
    if minutes < 60:
        return f"{minutes}m {remainder}s"
    hours, minutes = divmod(minutes, 60)
    if hours < 24:
        return f"{hours}h {minutes}m"
    days, hours = divmod(hours, 24)
    return f"{days}d {hours}h"


def utc_iso(moment: datetime) -> str:
    if moment.tzinfo is None:
        moment = moment.replace(tzinfo=timezone.utc)
    return moment.isoformat()


def utc_stamp(moment: datetime) -> int:
    """Seconds since the epoch, for arithmetic in the browser.

    Stored times are naive UTC, and a browser reading one as local time would be
    wrong by its own offset - hours out for most of NIYA's users.
    """
    if moment.tzinfo is None:
        moment = moment.replace(tzinfo=timezone.utc)
    return int(moment.timestamp())


def strengths(counsellor, limit: int = 3) -> str:
    """The categories this counsellor is strongest in, as readable text.

    `category_experience` is a category -> 0..1 score map, which is the right
    shape for matching and the wrong one to show a person choosing who to talk
    to. This picks the top few and makes them a sentence.
    """
    ranked = sorted(
        counsellor.category_experience.items(), key=lambda item: item[1], reverse=True
    )
    labels = [name.replace("_", " ") for name, score in ranked[:limit] if score >= 0.5]
    return ", ".join(labels).capitalize() if labels else "General support"


def titles(values) -> str:
    return ", ".join(str(value).replace("_", " ").title() for value in values)


def zone_label(value: str) -> str:
    """'america/new_york' -> 'America / New York'.

    Jinja's `title` filter does not capitalise after a slash, so zone names came
    out as 'America/chicago'.
    """
    parts = [part.replace("_", " ").title() for part in str(value).split("/")]
    return " / ".join(parts)


def country_label(value: str) -> str:
    return str(value).replace("_", " ").title()


#: Hours that are reasonable for the person booking, in their own timezone.
SOCIABLE_HOURS = range(7, 22)


def unsociable(moment: datetime, timezone_name: str) -> bool:
    """Is this slot in the middle of the night for the person booking?

    Availability is generated from the counsellor's working hours, so a
    counsellor in India offers a perfectly normal 10:00 that lands at 04:30 for
    a student in London. Those slots are still bookable - someone may genuinely
    want an early call - but they are marked, because booking one by accident
    means missing the session.
    """
    return zone(moment, timezone_name).hour not in SOCIABLE_HOURS


templates.env.filters["money"] = money
templates.env.filters["zone"] = zone
templates.env.filters["clock"] = clock
templates.env.filters["day_label"] = day_label
templates.env.filters["duration"] = duration
templates.env.filters["utc_iso"] = utc_iso
templates.env.filters["utc_stamp"] = utc_stamp
templates.env.filters["strengths"] = strengths
templates.env.filters["titles"] = titles
templates.env.filters["zone_label"] = zone_label
templates.env.filters["country_label"] = country_label
templates.env.filters["unsociable"] = unsociable
# Also a test, so `rejectattr('start_utc', 'unsociable', zone)` works.
templates.env.tests["unsociable"] = unsociable

templates.env.globals["app_name"] = settings.APP_NAME
templates.env.globals["is_production"] = settings.IS_PRODUCTION
templates.env.globals["payments_live"] = settings.PAYMENTS_LIVE
templates.env.globals["session_price"] = money(
    settings.SESSION_PRICE_MINOR, settings.SESSION_CURRENCY
)
