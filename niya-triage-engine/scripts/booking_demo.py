r"""The full journey: triage -> pick a slot -> pay -> confirm -> connect.

    python scripts\booking_demo.py

Runs the whole thing against a temporary store, so it never touches your real
bookings file. Nothing is sent, no payment is taken, no NIYA system is contacted.

The point of this script is the timezone handling and the connect window, which
are the two things the production app gets wrong.
"""

from __future__ import annotations

import sys
import tempfile
from datetime import timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from niya_triage import IntakeRequest, triage  # noqa: E402
from niya_triage.availability import available_slots, to_zone, utc_now  # noqa: E402
from niya_triage.booking import (  # noqa: E402
    BookingStore,
    authorise_connection,
    connect_state,
    simulate_gateway_payment,
)
from niya_triage.contact import collect  # noqa: E402
from niya_triage.counsellors import default_repository  # noqa: E402
from niya_triage.notifications import Outbox, notify_booking_confirmed  # noqa: E402

BAR = "=" * 74


def head(text: str) -> None:
    print(f"\n{BAR}\n{text}\n{BAR}")


def main() -> int:
    workspace = Path(tempfile.mkdtemp(prefix="niya_booking_demo_"))
    store = BookingStore(workspace / "bookings.json")
    outbox = Outbox(workspace / "outbox.jsonl")
    repository = default_repository()

    # ---- 1. triage ----------------------------------------------------
    head("1. Triage decides who this person should see")
    request = IntakeRequest(
        text=(
            "I moved to Canada six months ago. I have stopped attending classes, "
            "I am scared to tell my parents, and I cannot sleep before exams."
        ),
        country="canada",
        timezone="America/Toronto",
        user_type="student",
        preferred_languages=["english", "hindi"],
    )
    result = triage(request, log=False)
    print(f"category : {result.primary_category}")
    print(f"urgency  : {result.urgency.value}")
    print("shortlist:")
    for match in result.shortlist:
        print(f"  - {match.display_name} ({match.score:.3f})")

    # Prefer a shortlisted counsellor in a different timezone, purely so this
    # demo actually exercises the cross-timezone rendering. Real booking uses
    # whoever the user picks.
    counsellor = repository.get(result.shortlist[0].counsellor_id)
    for match in result.shortlist:
        candidate = repository.get(match.counsellor_id)
        if candidate and candidate.timezone != request.timezone:
            counsellor = candidate
            break

    # ---- 2. slots ------------------------------------------------------
    head("2. The user picks a time - shown in THEIR timezone")
    print(f"user is in       : {request.timezone}")
    print(f"counsellor is in : {counsellor.timezone}  ({counsellor.display_name})")
    print(
        f"urgency '{result.urgency.value}' means the earliest bookable slot is "
        f"hours away, not the flat 24h the production app enforces.\n"
    )

    slots = available_slots(
        counsellor,
        taken_slot_ids=store.taken_slot_ids(counsellor.id),
        urgency=result.urgency.value,
        viewer_timezone=request.timezone,
    )
    if not slots:
        print("No slots available.")
        return 1

    print("First five open slots. Same instant, two wall clocks:")
    for slot in slots[:5]:
        client_time = slot.start_in(request.timezone)
        coach_time = slot.start_in(counsellor.timezone)
        print(
            f"  {client_time:%a %d %b %H:%M} ({request.timezone})"
            f"  =  {coach_time:%a %d %b %H:%M} ({counsellor.timezone})"
        )

    slot = slots[0]
    print(f"\nUser picks: {slot.start_in(request.timezone):%A %d %B, %H:%M} their time")

    # ---- 3. contact ----------------------------------------------------
    head("3. Contact details, so the confirmation can actually arrive")
    contact = collect(
        email="priya.sharma@example.com",
        phone="416 555 0142",
        full_name="Priya Sharma",
        country="canada",
    )
    print(f"valid    : {contact.is_valid}")
    print(f"stored as: {contact.masked()}")
    print(f"channels : {', '.join(contact.channels)}")

    # ---- 4. hold then pay ----------------------------------------------
    head("4. Hold the slot, THEN take payment")
    booking = store.hold(
        case_id=result.case_id,
        counsellor_id=counsellor.id,
        counsellor_name=counsellor.display_name,
        counsellor_timezone=counsellor.timezone,
        slot_id=slot.id,
        contact=contact,
        client_timezone=request.timezone,
        urgency=result.urgency.value,
        primary_category=result.primary_category,
    )
    print(f"booking  : {booking.id}")
    print(f"status   : {booking.status.value}  (slot is reserved, nothing paid yet)")
    print(f"expires  : hold lapses at {booking.hold_expires_at} if unpaid")

    print("\n-- a forged payment is rejected --")
    try:
        store.confirm_payment(booking.id, "pay_i_made_this_up", "not-a-real-signature")
        print("   PROBLEM: forged payment was accepted")
    except Exception as error:  # noqa: BLE001 - demonstrating the rejection
        print(f"   rejected: {error}")

    print("\n-- the real gateway response verifies --")
    gateway = simulate_gateway_payment(booking)
    booking = store.confirm_payment(
        booking.id, gateway["provider_reference"], gateway["signature"]
    )
    print(f"   status : {booking.status.value}")
    print(f"   payment: {booking.payment.status.value} ref {booking.payment.provider_reference}")

    print("\n-- confirming twice is harmless (user refreshes the page) --")
    again = store.confirm_payment(
        booking.id, gateway["provider_reference"], gateway["signature"]
    )
    print(f"   status : {again.status.value} (unchanged, no duplicate charge)")

    # ---- 5. notifications ----------------------------------------------
    head("5. Notifications queued (written to an outbox, never sent)")
    messages = notify_booking_confirmed(booking, outbox=outbox)
    for message in messages:
        when = message.send_at_utc[:16].replace("T", " ")
        print(f"  [{message.channel:5}] {message.kind:13} -> {message.to_masked:28} at {when}Z")

    print("\nConfirmation email body:")
    print("  " + "\n  ".join(messages[0].body.strip().splitlines()))

    # ---- 6. the connect window -----------------------------------------
    head("6. Connect now: opens 5 min before, closes 5 min after")
    start = booking.start
    checkpoints = [
        ("a day before", start - timedelta(days=1)),
        ("10 minutes before", start - timedelta(minutes=10)),
        ("5 minutes before", start - timedelta(minutes=5)),
        ("at the start", start),
        ("mid-session", start + timedelta(minutes=30)),
        ("5 min after the end", booking.end + timedelta(minutes=5)),
        ("6 min after the end", booking.end + timedelta(minutes=6)),
    ]
    for label, moment in checkpoints:
        state = connect_state(booking, now=moment)
        verdict = "CONNECT" if state["can_connect"] else f"blocked ({state['reason']})"
        print(f"  {label:22} {verdict}")

    print("\nToken issue is gated by the same check, not just the button:")
    denied = authorise_connection(booking, "client", now=start - timedelta(hours=2))
    print(f"  two hours before -> authorised={denied['authorised']} reason={denied['reason']}")
    allowed = authorise_connection(booking, "client", now=start + timedelta(minutes=1))
    print(f"  one minute in    -> authorised={allowed['authorised']} room={allowed['room_id']}")

    # ---- 7. reconnection ------------------------------------------------
    head("7. Dropping and rejoining mid-session is expected")
    during = start + timedelta(minutes=10)
    for party, action, offset in [
        ("client", "joined", 0),
        ("counsellor", "joined", 1),
        ("client", "left", 12),
        ("client", "joined", 13),
    ]:
        store.record_connection(booking.id, party, action, now=during + timedelta(minutes=offset))
    final = store.get(booking.id)
    for event in final.connection_events:
        print(f"  {event.at[11:16]}Z  {event.party:11} {event.action}")
    print("\n  The client dropped and rejoined; the session was not lost.")

    print(f"\nTemporary workspace: {workspace}")
    print("Nothing was sent. No payment was taken. No NIYA system was contacted.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
