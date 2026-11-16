r"""Put a confirmed booking into the store so the appointments screen has something to show.

    python scripts\seed_booking.py            # session starts in ~1 hour
    python scripts\seed_booking.py --minutes 3  # starts in 3 minutes
    python scripts\seed_booking.py --clear    # wipe all bookings and notifications

Useful for demonstrating the joining window without sitting through a real wait,
and for checking the appointments screen renders before anyone books anything.
"""

from __future__ import annotations

import argparse
import sys
from datetime import timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from niya_triage import config  # noqa: E402
from niya_triage.availability import SESSION_MINUTES, Slot, utc_now  # noqa: E402
from niya_triage.booking import (  # noqa: E402
    default_store,
    reset_default_store,
    simulate_gateway_payment,
)
from niya_triage.contact import collect  # noqa: E402
from niya_triage.counsellors import default_repository  # noqa: E402
from niya_triage.notifications import default_outbox, notify_booking_confirmed  # noqa: E402


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--minutes", type=int, default=60, help="Minutes from now until the session starts"
    )
    parser.add_argument("--clear", action="store_true", help="Delete all bookings first")
    parser.add_argument("--counsellor", default=None, help="Counsellor id, e.g. C017")
    parser.add_argument("--timezone", default="America/Toronto", help="The client's timezone")
    args = parser.parse_args()

    if args.clear:
        for path in (config.BOOKING_FILE, config.OUTBOX_FILE):
            if path.exists():
                path.unlink()
                print(f"removed {path}")
        reset_default_store()
        if not args.minutes:
            return 0

    repository = default_repository()
    counsellor = (
        repository.get(args.counsellor)
        if args.counsellor
        else next(
            (c for c in repository.active() if c.timezone != args.timezone),
            repository.active()[0],
        )
    )
    if counsellor is None:
        print(f"No counsellor {args.counsellor}")
        return 1

    # Build the slot directly rather than taking one from the calendar, so the
    # start time lands exactly where the demo wants it.
    start = (utc_now() + timedelta(minutes=args.minutes)).replace(second=0, microsecond=0)
    slot = Slot(
        counsellor_id=counsellor.id,
        start_utc=start,
        end_utc=start + timedelta(minutes=SESSION_MINUTES),
    )

    store = default_store()
    booking = store.hold(
        case_id="case_seeded_demo",
        counsellor_id=counsellor.id,
        counsellor_name=counsellor.display_name,
        counsellor_timezone=counsellor.timezone,
        slot_id=slot.id,
        contact=collect(
            email="priya@example.com",
            phone="416 555 0142",
            full_name="Priya Sharma",
            country="canada",
        ),
        client_timezone=args.timezone,
        urgency="high",
        primary_category="academic_avoidance",
    )
    gateway = simulate_gateway_payment(booking)
    booking = store.confirm_payment(
        booking.id, gateway["provider_reference"], gateway["signature"]
    )
    notify_booking_confirmed(booking, outbox=default_outbox())

    print(f"booking     : {booking.id}  ({booking.status.value})")
    print(f"counsellor  : {booking.counsellor_name} in {booking.counsellor_timezone}")
    print(f"starts      : {booking.start_local():%A %d %B %H:%M} ({args.timezone})")
    print(f"connect from: {booking.connect_opens_at:%H:%M} UTC")
    print(f"connect to  : {booking.connect_closes_at:%H:%M} UTC")
    print("\nOpen the 'My appointments' tab to see it.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
