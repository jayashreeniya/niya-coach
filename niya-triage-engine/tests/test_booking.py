"""Booking, payment, timezone and connect-window tests.

The window tests and the payment-verification tests are the ones that matter.
Both cover behaviour that is currently wrong in NIYA production, so a regression
here would mean the prototype has stopped demonstrating the fix.
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pytest

from niya_triage.availability import (
    SESSION_MINUTES,
    available_days,
    available_slots,
    generate_slots,
    minimum_notice_hours,
    parse_slot_id,
    to_zone,
)
from niya_triage.booking import (
    BookingError,
    BookingStatus,
    BookingStore,
    PaymentStatus,
    authorise_connection,
    connect_state,
    simulate_gateway_payment,
)
from niya_triage.contact import collect, mask_email, mask_phone
from niya_triage.counsellors import Counsellor
from niya_triage.notifications import Outbox, notify_booking_confirmed

NOW = datetime(2026, 8, 11, 6, 0, tzinfo=timezone.utc)


@pytest.fixture
def india_counsellor() -> Counsellor:
    return Counsellor(
        id="C900",
        display_name="Test Counsellor",
        timezone="Asia/Kolkata",
        working_hours_local=(9.0, 18.0),
    )


@pytest.fixture
def store(tmp_path) -> BookingStore:
    return BookingStore(tmp_path / "bookings.json")


@pytest.fixture
def outbox(tmp_path) -> Outbox:
    return Outbox(tmp_path / "outbox.jsonl")


@pytest.fixture
def contact():
    return collect(email="test@example.com", phone="+919876543210", full_name="Test User")


def _confirmed(store, india_counsellor, contact, urgency="moderate"):
    slot = available_slots(india_counsellor, urgency=urgency, now=NOW)[0]
    booking = store.hold(
        case_id="case_test",
        counsellor_id=india_counsellor.id,
        counsellor_name=india_counsellor.display_name,
        counsellor_timezone=india_counsellor.timezone,
        slot_id=slot.id,
        contact=contact,
        client_timezone="America/Toronto",
        urgency=urgency,
        now=NOW,
    )
    gateway = simulate_gateway_payment(booking)
    return store.confirm_payment(booking.id, gateway["provider_reference"], gateway["signature"])


# --------------------------------------------------------------------------
# Timezone
# --------------------------------------------------------------------------


def test_slots_are_generated_in_the_counsellors_local_working_hours(india_counsellor):
    """9-18 in Kolkata must not become 9-18 UTC."""
    slots = generate_slots(india_counsellor, days=3, now=NOW, include_taken=True)
    assert slots

    for slot in slots[:20]:
        local_hour = to_zone(slot.start_utc, "Asia/Kolkata").hour
        assert 9 <= local_hour < 18, "slot fell outside the counsellor's working day"


def test_the_same_slot_reads_differently_in_two_timezones(india_counsellor):
    """The defect this whole module exists to prevent.

    Production stores IST wall-clock strings with no timezone column, so a
    Toronto student picking "09:00" is silently booked into 09:00 India time.
    """
    slot = generate_slots(india_counsellor, days=2, now=NOW, include_taken=True)[0]

    kolkata = slot.start_in("Asia/Kolkata")
    toronto = slot.start_in("America/Toronto")

    assert kolkata.hour != toronto.hour
    # Same instant, different wall clocks.
    assert kolkata.utcoffset() != toronto.utcoffset()
    assert slot.start_utc == kolkata.astimezone(timezone.utc) == toronto.astimezone(timezone.utc)


def test_slot_ids_round_trip(india_counsellor):
    slot = generate_slots(india_counsellor, days=2, now=NOW, include_taken=True)[0]
    restored = parse_slot_id(slot.id)
    assert restored is not None
    assert restored.start_utc == slot.start_utc
    assert restored.counsellor_id == slot.counsellor_id


def test_available_days_are_in_the_viewers_timezone(india_counsellor):
    days = available_days(india_counsellor, viewer_timezone="America/Toronto", now=NOW)
    assert days
    assert all(hasattr(day, "year") for day in days)


# --------------------------------------------------------------------------
# Notice period
# --------------------------------------------------------------------------


def test_urgency_shortens_the_notice_period():
    """Production enforces a flat 24h for everyone, which is wrong for triage."""
    assert minimum_notice_hours("critical") < minimum_notice_hours("high")
    assert minimum_notice_hours("high") < minimum_notice_hours("moderate")
    assert minimum_notice_hours("moderate") < minimum_notice_hours("low")


def test_high_urgency_reaches_slots_that_low_urgency_cannot(india_counsellor):
    urgent = available_slots(india_counsellor, urgency="critical", now=NOW)
    relaxed = available_slots(india_counsellor, urgency="low", now=NOW)
    assert urgent[0].start_utc < relaxed[0].start_utc


# --------------------------------------------------------------------------
# Holding and payment
# --------------------------------------------------------------------------


def test_hold_reserves_the_slot_before_any_payment(store, india_counsellor, contact):
    slot = available_slots(india_counsellor, now=NOW)[0]
    booking = store.hold(
        case_id="c1",
        counsellor_id=india_counsellor.id,
        counsellor_name=india_counsellor.display_name,
        counsellor_timezone=india_counsellor.timezone,
        slot_id=slot.id,
        contact=contact,
        now=NOW,
    )
    assert booking.status == BookingStatus.HELD
    assert booking.payment.status == PaymentStatus.PENDING
    assert slot.id in store.taken_slot_ids(india_counsellor.id, now=NOW)


def test_the_same_slot_cannot_be_held_twice(store, india_counsellor, contact):
    slot = available_slots(india_counsellor, now=NOW)[0]
    kwargs = dict(
        counsellor_id=india_counsellor.id,
        counsellor_name=india_counsellor.display_name,
        counsellor_timezone=india_counsellor.timezone,
        slot_id=slot.id,
        contact=contact,
        now=NOW,
    )
    store.hold(case_id="c1", **kwargs)
    with pytest.raises(BookingError, match="just been taken"):
        store.hold(case_id="c2", **kwargs)


def test_a_forged_payment_is_rejected(store, india_counsellor, contact):
    """Production takes payment success from a URL parameter and verifies nothing."""
    slot = available_slots(india_counsellor, now=NOW)[0]
    booking = store.hold(
        case_id="c1",
        counsellor_id=india_counsellor.id,
        counsellor_name=india_counsellor.display_name,
        counsellor_timezone=india_counsellor.timezone,
        slot_id=slot.id,
        contact=contact,
        now=NOW,
    )
    with pytest.raises(BookingError, match="verification failed"):
        store.confirm_payment(booking.id, "pay_invented", "bogus-signature")

    # The slot stays held rather than being silently released.
    assert store.get(booking.id, now=NOW).status == BookingStatus.HELD


def test_payment_reference_is_persisted(store, india_counsellor, contact):
    """Production writes payment_id to a column that does not exist, so it is lost."""
    booking = _confirmed(store, india_counsellor, contact)
    assert booking.payment.status == PaymentStatus.PAID
    assert booking.payment.provider_reference
    assert store.get(booking.id).payment.provider_reference == booking.payment.provider_reference


def test_confirming_twice_is_idempotent(store, india_counsellor, contact):
    """The user refreshing the success page must not double-charge or error."""
    booking = _confirmed(store, india_counsellor, contact)
    gateway = simulate_gateway_payment(booking)
    again = store.confirm_payment(booking.id, gateway["provider_reference"], gateway["signature"])
    assert again.status == BookingStatus.CONFIRMED
    assert again.payment.provider_reference == booking.payment.provider_reference


def test_contact_details_are_required(store, india_counsellor):
    slot = available_slots(india_counsellor, now=NOW)[0]
    with pytest.raises(BookingError, match="contact details"):
        store.hold(
            case_id="c1",
            counsellor_id=india_counsellor.id,
            counsellor_name=india_counsellor.display_name,
            counsellor_timezone=india_counsellor.timezone,
            slot_id=slot.id,
            contact=collect(email="not-an-email", phone=""),
            now=NOW,
        )


def test_cancelling_a_paid_booking_marks_a_refund(store, india_counsellor, contact):
    booking = _confirmed(store, india_counsellor, contact)
    cancelled = store.cancel(booking.id)
    assert cancelled.status == BookingStatus.CANCELLED
    assert cancelled.payment.status == PaymentStatus.REFUNDED
    assert booking.slot_id not in store.taken_slot_ids(india_counsellor.id, now=NOW)


# --------------------------------------------------------------------------
# Connect window - the behaviour the brief asked for
# --------------------------------------------------------------------------


def test_connect_opens_five_minutes_before_and_closes_five_after(
    store, india_counsellor, contact
):
    booking = _confirmed(store, india_counsellor, contact)
    start, end = booking.start, booking.end

    assert not connect_state(booking, now=start - timedelta(minutes=6))["can_connect"]
    assert connect_state(booking, now=start - timedelta(minutes=5))["can_connect"]
    assert connect_state(booking, now=start)["can_connect"]
    assert connect_state(booking, now=start + timedelta(minutes=30))["can_connect"]
    assert connect_state(booking, now=end + timedelta(minutes=5))["can_connect"]
    assert not connect_state(booking, now=end + timedelta(minutes=6))["can_connect"]


def test_connect_denial_reasons_are_specific(store, india_counsellor, contact):
    booking = _confirmed(store, india_counsellor, contact)
    early = connect_state(booking, now=booking.start - timedelta(hours=3))
    late = connect_state(booking, now=booking.end + timedelta(hours=3))
    assert early["reason"] == "too_early"
    assert late["reason"] == "too_late"
    assert early["seconds_until_open"] > 0


def test_an_unpaid_booking_cannot_connect(store, india_counsellor, contact):
    slot = available_slots(india_counsellor, now=NOW)[0]
    booking = store.hold(
        case_id="c1",
        counsellor_id=india_counsellor.id,
        counsellor_name=india_counsellor.display_name,
        counsellor_timezone=india_counsellor.timezone,
        slot_id=slot.id,
        contact=contact,
        now=NOW,
    )
    state = connect_state(booking, now=booking.start)
    assert not state["can_connect"]
    assert state["reason"] == "not_confirmed"


def test_a_cancelled_booking_cannot_connect(store, india_counsellor, contact):
    booking = store.cancel(_confirmed(store, india_counsellor, contact).id)
    assert connect_state(booking, now=booking.start)["reason"] == "cancelled"


def test_the_token_endpoint_enforces_the_window_not_just_the_button(
    store, india_counsellor, contact
):
    """Production hands out a Twilio token to any caller at any time.

    The React check is cosmetic there. Here the authorisation call applies the
    window itself, so a modified client gains nothing.
    """
    booking = _confirmed(store, india_counsellor, contact)

    too_early = authorise_connection(booking, "client", now=booking.start - timedelta(hours=2))
    assert not too_early["authorised"]
    assert "token" not in too_early

    inside = authorise_connection(booking, "client", now=booking.start)
    assert inside["authorised"]
    assert inside["token"]
    assert inside["room_id"] == booking.room_id


def test_parties_may_disconnect_and_rejoin(store, india_counsellor, contact):
    """A dropped connection must not end the session."""
    booking = _confirmed(store, india_counsellor, contact)
    during = booking.start + timedelta(minutes=10)

    store.record_connection(booking.id, "client", "joined", now=during)
    store.record_connection(booking.id, "client", "left", now=during + timedelta(minutes=2))
    store.record_connection(booking.id, "client", "joined", now=during + timedelta(minutes=3))

    reloaded = store.get(booking.id, now=during)
    assert [event.action for event in reloaded.connection_events] == ["joined", "left", "joined"]
    # Still connectable after a drop.
    assert connect_state(reloaded, now=during + timedelta(minutes=4))["can_connect"]


# --------------------------------------------------------------------------
# Contact validation
# --------------------------------------------------------------------------


@pytest.mark.parametrize(
    "raw,country,expected",
    [
        ("+91 98765 43210", "", "+919876543210"),
        ("9876543210", "india", "+919876543210"),
        ("07700 900123", "united kingdom", "+447700900123"),
        ("(416) 555-0142", "canada", "+14165550142"),
        ("0091 9876543210", "", "+919876543210"),
    ],
)
def test_phone_numbers_normalise_to_e164(raw, country, expected):
    assert collect(phone=raw, country=country).phone == expected


@pytest.mark.parametrize("bad", ["", "abc", "12", "+1 234"])
def test_bad_phone_numbers_are_rejected_or_empty(bad):
    result = collect(phone=bad, require="phone")
    assert not result.is_valid


def test_at_least_one_channel_is_required():
    assert not collect().is_valid
    assert collect(email="a@b.co").is_valid
    assert collect(phone="+919876543210").is_valid


def test_contact_details_are_masked_for_display():
    assert mask_email("priya.sharma@example.com").endswith("@example.com")
    assert "priya" not in mask_email("priya.sharma@example.com")
    assert mask_phone("+919876543210").endswith("210")
    assert "9876543" not in mask_phone("+919876543210")


# --------------------------------------------------------------------------
# Notifications
# --------------------------------------------------------------------------


def test_confirmation_goes_to_every_channel_given(store, india_counsellor, contact, outbox):
    booking = _confirmed(store, india_counsellor, contact)
    messages = notify_booking_confirmed(booking, outbox=outbox)

    kinds = {(message.channel, message.kind) for message in messages}
    assert ("email", "confirmation") in kinds
    assert ("sms", "confirmation") in kinds
    assert ("email", "coach_notice") in kinds


def test_reminders_are_scheduled_ahead_of_the_session(store, india_counsellor, contact, outbox):
    """Production has a reminder worker but never enqueues it."""
    booking = _confirmed(store, india_counsellor, contact, urgency="low")
    # Scheduled against the same clock the slot was generated from. Using the
    # real one instead makes this test pass today and fail tomorrow.
    notify_booking_confirmed(booking, outbox=outbox, now=NOW)

    reminders = [row for row in outbox.all(booking.id) if row["kind"] == "reminder"]
    assert reminders, "no reminders scheduled"
    for row in reminders:
        assert datetime.fromisoformat(row["send_at_utc"]) < booking.start


def test_the_outbox_never_stores_raw_contact_details(
    store, india_counsellor, contact, outbox
):
    booking = _confirmed(store, india_counsellor, contact)
    notify_booking_confirmed(booking, outbox=outbox)

    raw = outbox.path.read_text(encoding="utf-8")
    assert "test@example.com" not in raw
    assert "+919876543210" not in raw


def test_confirmation_states_both_timezones(store, india_counsellor, contact, outbox):
    """The existing confirmation email states a time with no timezone at all."""
    booking = _confirmed(store, india_counsellor, contact)
    messages = notify_booking_confirmed(booking, outbox=outbox)
    body = next(m for m in messages if m.kind == "confirmation" and m.channel == "email").body

    assert "America/Toronto" in body
    assert "Asia/Kolkata" in body


def test_session_length_is_consistent(store, india_counsellor, contact):
    booking = _confirmed(store, india_counsellor, contact)
    assert (booking.end - booking.start) == timedelta(minutes=SESSION_MINUTES)


def test_bookings_are_separable_by_case(store, india_counsellor, contact):
    """The appointments screen must never show one person another's sessions.

    The store is shared, so anything rendering appointments has to scope by
    owner. An early version of the UI listed every booking in the file, which
    showed leftover demo data next to a real booking as though the user had
    booked twice.
    """
    slots = available_slots(india_counsellor, urgency="moderate", now=NOW)
    for index, case in enumerate(["case_alice", "case_bob"]):
        booking = store.hold(
            case_id=case,
            counsellor_id=india_counsellor.id,
            counsellor_name=india_counsellor.display_name,
            counsellor_timezone=india_counsellor.timezone,
            slot_id=slots[index].id,
            contact=contact,
            now=NOW,
        )
        gateway = simulate_gateway_payment(booking)
        store.confirm_payment(booking.id, gateway["provider_reference"], gateway["signature"])

    assert len(store.all(now=NOW)) == 2
    assert len(store.for_case("case_alice", now=NOW)) == 1
    assert len(store.for_case("case_bob", now=NOW)) == 1
    assert store.for_case("case_alice", now=NOW)[0].case_id == "case_alice"
