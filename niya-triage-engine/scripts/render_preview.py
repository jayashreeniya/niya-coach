r"""Render the app's pages to static HTML for layout review.

    python scripts/render_preview.py

Writes to `webapp/preview/`, which is gitignored. Uses the real templates and
the real stylesheet with representative data, so what you measure here is what
the running app produces - but it needs no account, no database and no server,
which makes it easy to check the layout at a phone width.

This is a development tool. It renders templates directly and is not wired into
the application, so it cannot expose a real page to anyone.
"""

from __future__ import annotations

import re
import shutil
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from niya_triage.availability import available_slots  # noqa: E402
from niya_triage.counsellors import default_repository  # noqa: E402
from niya_triage.taxonomy import PATHWAYS  # noqa: E402

from webapp import settings  # noqa: E402
from webapp.templating import templates  # noqa: E402

OUTPUT = settings.WEBAPP_ROOT / "preview"

CLIENT_ZONE = "europe/london"
NOW = datetime.now(timezone.utc)


def _account():
    return SimpleNamespace(
        id=1, full_name="Ananya", email="ananya@example.com",
        phone="+919876543210", country="united kingdom",
        timezone=CLIENT_ZONE, languages=["english", "hindi"],
    )


def _case(counsellors):
    return SimpleNamespace(
        case_ref="case_preview_0001",
        primary_category="academic_avoidance",
        urgency="high",
        confidence=72,
        pathway="structured_support",
        safety_blocked=False,
        human_review_required=True,
        shortlist_ids=",".join(item.id for item in counsellors),
    )


def _payment():
    return SimpleNamespace(
        amount_minor=settings.SESSION_PRICE_MINOR,
        currency=settings.SESSION_CURRENCY,
        status="paid",
    )


def _booking(counsellor, start, status="confirmed"):
    return SimpleNamespace(
        booking_ref="NT-PREVIEW01",
        counsellor_name=counsellor.display_name,
        counsellor_timezone=counsellor.timezone,
        client_timezone=CLIENT_ZONE,
        start=start,
        end=start + timedelta(hours=1),
        status=status,
        room_id="niya-preview",
        payment=_payment(),
        hold_expires_at=NOW + timedelta(minutes=15),
        notifications=[
            SimpleNamespace(
                kind="confirmation", channel="email", status="sent",
                recipient_masked="a*******@example.com", send_at=NOW,
            ),
            SimpleNamespace(
                kind="reminder", channel="sms", status="queued",
                recipient_masked="+91*******210", send_at=start - timedelta(hours=1),
            ),
        ],
    )


def _connect(seconds_until_open: int, can_connect: bool, reason=None):
    return {
        "can_connect": can_connect,
        "reason": reason,
        "opens_at_local": NOW + timedelta(seconds=seconds_until_open),
        "closes_at_local": NOW + timedelta(hours=1, minutes=5),
        "seconds_until_open": seconds_until_open,
        "seconds_until_close": 3900,
    }


def render(name: str, context: dict) -> Path:
    template = templates.env.get_template(name)
    # `url_for` is normally supplied by Starlette. Nothing in these templates
    # uses it, but Jinja resolves globals lazily so a stub keeps it safe.
    html = template.render(request=None, **context)
    # Rewrite absolute asset paths so the files work when opened from disk.
    html = re.sub(r'(href|src)="/static/', r'\1="../static/', html)

    destination = OUTPUT / name
    destination.write_text(html, encoding="utf-8")
    return destination


def main() -> int:
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir(parents=True)

    repository = default_repository()
    shortlist = repository.all()[:3]
    counsellor = shortlist[0]
    account = _account()
    case = _case(shortlist)

    slots = available_slots(counsellor, urgency="high", viewer_timezone=CLIENT_ZONE)
    days = sorted({slot.start_utc.date() for slot in slots})[:10]
    today_slots = [slot for slot in slots if slot.start_utc.date() == days[0]][:12] if days else []

    pages = {
        "landing.html": {"account": None},
        "signup.html": {
            "account": None, "countries": ["india", "united kingdom"],
            "zones": ["asia/calcutta", "europe/london"],
            "languages": ["english", "hindi", "tamil"], "form": {}, "errors": {},
        },
        "login.html": {"account": None, "next": "/intake", "error": None, "email": ""},
        "intake.html": {"account": account, "countries": ["india"]},
        "result.html": {
            "account": account, "case": case, "shortlist": shortlist,
            "pathway": PATHWAYS.get(case.pathway), "emergency": [],
        },
        "book.html": {
            "account": account, "case": case, "counsellor": counsellor,
            "days": days, "chosen_day": days[0] if days else None,
            "slots": today_slots, "error": None,
        },
        "checkout.html": {
            "account": account,
            "booking": _booking(counsellor, NOW + timedelta(days=1), status="held"),
            "error": None,
        },
        "appointments.html": {
            "account": account, "just": "NT-PREVIEW01",
            "bookings": [
                {
                    "booking": _booking(counsellor, NOW + timedelta(hours=3)),
                    "connect": _connect(10500, False, "too_early"),
                },
                {
                    "booking": _booking(counsellor, NOW + timedelta(minutes=3)),
                    "connect": _connect(0, True),
                },
            ],
            "now": NOW,
        },
        "session.html": {
            "account": account,
            "booking": _booking(counsellor, NOW + timedelta(minutes=3)),
            "connect": _connect(0, True),
        },
        "account.html": {
            "account": account, "zones": ["asia/calcutta", "europe/london"],
            "countries": ["india", "united kingdom"], "saved": True,
        },
    }

    for name, context in pages.items():
        print(render(name, context))

    print(f"\n{len(pages)} pages written to {OUTPUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
