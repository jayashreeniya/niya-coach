"""End-to-end tests for the deployable app.

These are deliberately weighted towards the things that would be damaging rather
than merely annoying: one person reading another's session, a payment confirmed
without verification, two people holding the same slot, and joining a call
outside its window. Each of those is a defect that exists in the live NIYA
booking flow, so each gets a test here that would fail if it regressed.
"""

from __future__ import annotations

from datetime import timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select

from niya_triage.counsellors import default_repository

from webapp import db
from webapp.main import app
from webapp.models import Account, Booking, Notification, TriageCase, utcnow


@pytest.fixture(scope="module", autouse=True)
def _schema():
    db.init_db()
    yield


@pytest.fixture
def client():
    # follow_redirects=False so the POST-redirect-GET behaviour is observable.
    with TestClient(app, follow_redirects=False) as test_client:
        yield test_client


def _unique_email(prefix: str = "user") -> str:
    import uuid

    return f"{prefix}-{uuid.uuid4().hex[:8]}@example.com"


def register(client: TestClient, email: str | None = None, **overrides) -> str:
    """Create an account and leave the client signed in. Returns the email."""
    email = email or _unique_email()
    payload = {
        "full_name": "Test Person",
        "email": email,
        "password": "a-long-enough-passphrase",
        "phone": "+919876543210",
        "country": "united_kingdom",
        "timezone_name": "europe/london",
        "languages": ["english"],
    }
    payload.update(overrides)
    response = client.post("/signup", data=payload)
    assert response.status_code == 303, response.text
    return email


def make_case(client: TestClient, text: str = "I feel overwhelmed and cannot sleep") -> str:
    response = client.post("/intake", data={"text": text, "desired_timing": "flexible"})
    assert response.status_code == 303
    return response.headers["location"].rsplit("/", 1)[-1]


# ---------------------------------------------------------------------------
# Accounts
# ---------------------------------------------------------------------------


def test_signing_up_creates_an_account_and_signs_you_in(client):
    email = register(client)

    assert client.cookies.get("niya_triage_session")
    with db.session_scope() as session:
        account = session.scalar(select(Account).where(Account.email == email))
        assert account is not None
        assert account.password_hash != "a-long-enough-passphrase"
        assert account.password_hash.startswith("$2")


def test_the_same_email_cannot_register_twice_in_any_casing(client):
    email = register(client, email="Casing@Example.com")
    assert email  # stored lowercased

    fresh = TestClient(app, follow_redirects=False)
    response = fresh.post(
        "/signup",
        data={
            "email": "CASING@example.com",
            "password": "another-long-passphrase",
            "timezone_name": "utc",
        },
    )
    assert response.status_code == 400
    assert "already exists" in response.text


def test_a_weak_password_is_refused_with_a_reason(client):
    response = client.post(
        "/signup",
        data={"email": _unique_email(), "password": "short", "timezone_name": "utc"},
    )
    assert response.status_code == 400
    assert "at least 10 characters" in response.text


@pytest.mark.parametrize("value", ["", "Mars/Olympus", "europe/nowhere"])
def test_signup_refuses_a_timezone_it_does_not_know(client, value):
    """Defaulting an unknown timezone would show every appointment at the wrong
    hour, so it is rejected rather than quietly replaced with UTC."""
    response = client.post(
        "/signup",
        data={
            "email": _unique_email(),
            "password": "a-long-enough-passphrase",
            "timezone_name": value,
        },
    )
    assert response.status_code == 400
    assert "choose your timezone" in response.text


def test_changing_your_timezone_does_not_move_an_existing_booking(client):
    """The stored time is UTC; the timezone only changes how it is displayed."""
    booking_ref = _confirmed_booking(client)

    with db.session_scope() as session:
        before = session.scalar(
            select(Booking).where(Booking.booking_ref == booking_ref)
        ).start_utc

    response = client.post(
        "/account",
        data={"full_name": "Ananya", "country": "india", "timezone_name": "asia/calcutta"},
    )
    assert response.status_code == 200

    with db.session_scope() as session:
        booking = session.scalar(select(Booking).where(Booking.booking_ref == booking_ref))
        assert booking.start_utc == before
        # The display timezone recorded on the booking is the one it was made
        # in, so a later preference change does not rewrite history.
        assert booking.client_timezone == "europe/london"


def test_signed_out_visitors_are_redirected_to_sign_in(client):
    for path in ("/intake", "/appointments", "/account"):
        response = client.get(path)
        assert response.status_code == 303
        assert response.headers["location"].startswith("/login")


def test_signing_out_revokes_the_session_rather_than_just_dropping_the_cookie(client):
    register(client)
    token = client.cookies.get("niya_triage_session")

    assert client.get("/appointments").status_code == 200
    client.post("/logout")

    # Replay the old cookie: a revoked server-side session must not be accepted,
    # which is the property a self-contained JWT cannot offer.
    replay = TestClient(app, follow_redirects=False)
    replay.cookies.set("niya_triage_session", token)
    assert replay.get("/appointments").status_code == 303


def test_wrong_passwords_are_rejected_without_revealing_whether_the_account_exists(client):
    email = register(client)
    client.post("/logout")

    unknown = client.post(
        "/login", data={"email": _unique_email(), "password": "whatever-long-enough"}
    )
    wrong = client.post("/login", data={"email": email, "password": "wrong-passphrase"})

    assert unknown.status_code == wrong.status_code == 401
    # Identical wording, so response text does not disclose registration status.
    assert "do not match" in unknown.text and "do not match" in wrong.text


def test_repeated_failures_lock_the_account_for_a_while(client):
    email = register(client)
    client.post("/logout")

    for _ in range(8):
        client.post("/login", data={"email": email, "password": "definitely-wrong-x"})

    response = client.post("/login", data={"email": email, "password": "a-long-enough-passphrase"})
    assert response.status_code == 401
    assert "Too many sign-in attempts" in response.text


# ---------------------------------------------------------------------------
# Triage and scoping
# ---------------------------------------------------------------------------


def test_intake_stores_a_redacted_case_not_the_original_words(client):
    register(client)
    case_ref = make_case(
        client,
        "Reach me on 07700900123 or someone@example.com. I cannot cope with any of it.",
    )

    with db.session_scope() as session:
        case = session.scalar(select(TriageCase).where(TriageCase.case_ref == case_ref))
        assert case is not None
        assert "07700900123" not in case.redacted_text
        assert "someone@example.com" not in case.redacted_text
        assert "[PHONE]" in case.redacted_text
        assert "[EMAIL]" in case.redacted_text


def test_one_account_cannot_read_another_accounts_case(client):
    register(client)
    case_ref = make_case(client)

    intruder = TestClient(app, follow_redirects=False)
    register(intruder)

    response = intruder.get(f"/result/{case_ref}")
    assert response.status_code == 404  # not 403 - existence itself is not disclosed


def test_a_flagged_case_is_sent_to_a_helpline_rather_than_a_calendar(client):
    register(client)
    case_ref = make_case(client, "I have been thinking about killing myself tonight")

    result = client.get(f"/result/{case_ref}")
    assert result.status_code == 200
    assert "reach out to someone now" in result.text

    with db.session_scope() as session:
        case = session.scalar(select(TriageCase).where(TriageCase.case_ref == case_ref))
        assert case.safety_blocked

    # Neither a direct link to the calendar nor a posted booking may go through.
    counsellor_id = default_repository().all()[0].id

    booking_page = client.get(f"/book/{case_ref}/{counsellor_id}")
    assert booking_page.status_code == 303
    assert booking_page.headers["location"] == f"/result/{case_ref}"

    posted = client.post(
        f"/book/{case_ref}/{counsellor_id}", data={"slot_id": "anything"}
    )
    assert posted.status_code == 303
    assert posted.headers["location"] == f"/result/{case_ref}"

    with db.session_scope() as session:
        case = session.scalar(select(TriageCase).where(TriageCase.case_ref == case_ref))
        assert not session.scalars(
            select(Booking).where(Booking.case_id == case.id)
        ).all()


# ---------------------------------------------------------------------------
# Booking
# ---------------------------------------------------------------------------


def _first_bookable(client: TestClient, case_ref: str):
    """Walk the shortlist for a counsellor with a free slot. Returns (id, slot)."""
    import re

    result = client.get(f"/result/{case_ref}").text
    for counsellor_id in re.findall(rf"/book/{case_ref}/(\w+)", result):
        page = client.get(f"/book/{case_ref}/{counsellor_id}").text
        slots = re.findall(r'name="slot_id" value="([^"]+)"', page)
        if slots:
            return counsellor_id, slots[0]
    pytest.skip("no counsellor in the shortlist has availability")


def test_the_full_journey_ends_in_a_confirmed_paid_booking(client):
    register(client)
    case_ref = make_case(client)
    counsellor_id, slot_id = _first_bookable(client, case_ref)

    held = client.post(f"/book/{case_ref}/{counsellor_id}", data={"slot_id": slot_id})
    assert held.status_code == 303
    booking_ref = held.headers["location"].rsplit("/", 1)[-1]

    with db.session_scope() as session:
        booking = session.scalar(select(Booking).where(Booking.booking_ref == booking_ref))
        assert booking.status == "held"
        # Held before charging, so nobody pays for a slot taken meanwhile.
        assert booking.payment.status == "pending"

    paid = client.post(f"/checkout/{booking_ref}", data={})
    assert paid.status_code == 303

    with db.session_scope() as session:
        booking = session.scalar(select(Booking).where(Booking.booking_ref == booking_ref))
        assert booking.status == "confirmed"
        assert booking.payment.status == "paid"
        assert booking.payment.provider_reference  # the charge is reconcilable
        assert booking.payment.settled_at is not None


def test_a_forged_payment_signature_is_refused(client):
    register(client)
    case_ref = make_case(client)
    counsellor_id, slot_id = _first_bookable(client, case_ref)
    held = client.post(f"/book/{case_ref}/{counsellor_id}", data={"slot_id": slot_id})
    booking_ref = held.headers["location"].rsplit("/", 1)[-1]

    response = client.post(
        f"/checkout/{booking_ref}",
        data={"payment_reference": "pay_i_made_this_up", "signature": "not-a-real-signature"},
    )

    assert response.status_code == 402
    assert "could not verify" in response.text

    with db.session_scope() as session:
        booking = session.scalar(select(Booking).where(Booking.booking_ref == booking_ref))
        assert booking.status == "held"       # slot kept, so they can retry
        assert booking.payment.status == "failed"


def test_paying_twice_does_not_charge_twice(client):
    register(client)
    case_ref = make_case(client)
    counsellor_id, slot_id = _first_bookable(client, case_ref)
    held = client.post(f"/book/{case_ref}/{counsellor_id}", data={"slot_id": slot_id})
    booking_ref = held.headers["location"].rsplit("/", 1)[-1]

    client.post(f"/checkout/{booking_ref}", data={})
    with db.session_scope() as session:
        booking = session.scalar(select(Booking).where(Booking.booking_ref == booking_ref))
        first_reference = booking.payment.provider_reference

    # A refresh of the checkout POST must be a no-op.
    client.post(f"/checkout/{booking_ref}", data={})
    with db.session_scope() as session:
        booking = session.scalar(select(Booking).where(Booking.booking_ref == booking_ref))
        assert booking.payment.provider_reference == first_reference


def test_two_people_cannot_hold_the_same_slot(client):
    register(client)
    case_ref = make_case(client)
    counsellor_id, slot_id = _first_bookable(client, case_ref)
    assert client.post(f"/book/{case_ref}/{counsellor_id}", data={"slot_id": slot_id}).status_code == 303

    rival = TestClient(app, follow_redirects=False)
    register(rival)
    rival_case = make_case(rival)

    # Aimed at the exact slot the first person holds, bypassing the picker.
    response = rival.post(f"/book/{rival_case}/{counsellor_id}", data={"slot_id": slot_id})
    assert response.status_code == 409
    assert "just booked that time" in response.text


def test_cancelling_frees_the_slot_for_someone_else(client):
    register(client)
    case_ref = make_case(client)
    counsellor_id, slot_id = _first_bookable(client, case_ref)
    held = client.post(f"/book/{case_ref}/{counsellor_id}", data={"slot_id": slot_id})
    booking_ref = held.headers["location"].rsplit("/", 1)[-1]
    client.post(f"/checkout/{booking_ref}", data={})
    client.post(f"/appointments/{booking_ref}/cancel")

    rival = TestClient(app, follow_redirects=False)
    register(rival)
    rival_case = make_case(rival)
    response = rival.post(f"/book/{rival_case}/{counsellor_id}", data={"slot_id": slot_id})
    assert response.status_code == 303  # the released slot is bookable again


def test_you_only_see_your_own_appointments(client):
    register(client)
    case_ref = make_case(client)
    counsellor_id, slot_id = _first_bookable(client, case_ref)
    held = client.post(f"/book/{case_ref}/{counsellor_id}", data={"slot_id": slot_id})
    booking_ref = held.headers["location"].rsplit("/", 1)[-1]
    client.post(f"/checkout/{booking_ref}", data={})

    assert booking_ref in client.get("/appointments").text

    onlooker = TestClient(app, follow_redirects=False)
    register(onlooker)
    page = onlooker.get("/appointments")
    assert booking_ref not in page.text
    assert "no sessions booked" in page.text


def test_one_account_cannot_cancel_another_accounts_booking(client):
    register(client)
    case_ref = make_case(client)
    counsellor_id, slot_id = _first_bookable(client, case_ref)
    held = client.post(f"/book/{case_ref}/{counsellor_id}", data={"slot_id": slot_id})
    booking_ref = held.headers["location"].rsplit("/", 1)[-1]
    client.post(f"/checkout/{booking_ref}", data={})

    intruder = TestClient(app, follow_redirects=False)
    register(intruder)
    intruder.post(f"/appointments/{booking_ref}/cancel")

    with db.session_scope() as session:
        booking = session.scalar(select(Booking).where(Booking.booking_ref == booking_ref))
        assert booking.status == "confirmed"  # untouched


# ---------------------------------------------------------------------------
# The joining window
# ---------------------------------------------------------------------------


def _confirmed_booking(client: TestClient) -> str:
    register(client)
    case_ref = make_case(client)
    counsellor_id, slot_id = _first_bookable(client, case_ref)
    held = client.post(f"/book/{case_ref}/{counsellor_id}", data={"slot_id": slot_id})
    booking_ref = held.headers["location"].rsplit("/", 1)[-1]
    client.post(f"/checkout/{booking_ref}", data={})
    return booking_ref


def _move_session(booking_ref: str, starts_in: timedelta) -> None:
    """Shift a booking's time so the joining window can be exercised."""
    with db.session_scope() as session:
        booking = session.scalar(select(Booking).where(Booking.booking_ref == booking_ref))
        start = utcnow() + starts_in
        booking.start_utc = start.replace(tzinfo=None)
        booking.end_utc = (start + timedelta(hours=1)).replace(tzinfo=None)
        booking.start_utc_active = booking.start_utc


def test_the_call_cannot_be_joined_before_the_window_opens(client):
    booking_ref = _confirmed_booking(client)
    _move_session(booking_ref, timedelta(hours=3))

    response = client.get(f"/session/{booking_ref}")
    assert response.status_code == 403
    assert "Not open yet" in response.text


def test_the_call_opens_five_minutes_before_the_start(client):
    booking_ref = _confirmed_booking(client)
    _move_session(booking_ref, timedelta(minutes=4))

    response = client.get(f"/session/{booking_ref}")
    assert response.status_code == 200
    assert "You are in" in response.text


def test_the_call_stays_open_until_five_minutes_after_the_end(client):
    booking_ref = _confirmed_booking(client)
    # Started 61 minutes ago: 1 minute past the end, still inside the window.
    _move_session(booking_ref, timedelta(minutes=-61))

    assert client.get(f"/session/{booking_ref}").status_code == 200


def test_the_call_closes_after_the_window(client):
    booking_ref = _confirmed_booking(client)
    _move_session(booking_ref, timedelta(minutes=-70))

    response = client.get(f"/session/{booking_ref}")
    assert response.status_code == 403
    assert "has ended" in response.text


def test_you_can_leave_and_rejoin_within_the_window(client):
    booking_ref = _confirmed_booking(client)
    _move_session(booking_ref, timedelta(minutes=2))

    assert client.get(f"/session/{booking_ref}").status_code == 200
    assert client.post(f"/session/{booking_ref}/leave").status_code == 303
    assert client.get(f"/session/{booking_ref}").status_code == 200


def test_one_account_cannot_join_another_accounts_call(client):
    booking_ref = _confirmed_booking(client)
    _move_session(booking_ref, timedelta(minutes=2))

    intruder = TestClient(app, follow_redirects=False)
    register(intruder)
    response = intruder.get(f"/session/{booking_ref}")

    # Redirected away, never shown the room.
    assert response.status_code == 303
    assert response.headers["location"] == "/appointments"


def test_the_session_page_says_so_plainly_when_video_is_not_configured(client):
    """No credentials should mean an honest placeholder, not a broken call."""
    booking_ref = _confirmed_booking(client)
    _move_session(booking_ref, timedelta(minutes=2))

    body = client.get(f"/session/{booking_ref}").text
    assert "Video is not connected yet" in body
    assert "twilio-video" not in body


def test_the_call_surface_appears_once_video_is_configured(client, monkeypatch):
    from webapp import video

    booking_ref = _confirmed_booking(client)
    _move_session(booking_ref, timedelta(minutes=2))

    monkeypatch.setattr(video.settings, "VIDEO_LIVE", True)
    monkeypatch.setattr(video.settings, "TWILIO_ACCOUNT_SID", "AC" + "0" * 32)
    monkeypatch.setattr(video.settings, "TWILIO_API_KEY_SID", "SK" + "1" * 32)
    monkeypatch.setattr(video.settings, "TWILIO_API_KEY_SECRET", "secret")

    body = client.get(f"/session/{booking_ref}").text
    assert "Video is not connected yet" not in body
    assert "data-video-token" in body
    assert "/static/vendor/twilio-video" in body


def test_the_sdk_is_served_from_our_own_origin(client, monkeypatch):
    """Vendored rather than a CDN, so script-src can stay 'self'."""
    from webapp import video

    booking_ref = _confirmed_booking(client)
    _move_session(booking_ref, timedelta(minutes=2))

    monkeypatch.setattr(video.settings, "VIDEO_LIVE", True)
    monkeypatch.setattr(video.settings, "TWILIO_ACCOUNT_SID", "AC" + "0" * 32)
    monkeypatch.setattr(video.settings, "TWILIO_API_KEY_SID", "SK" + "1" * 32)
    monkeypatch.setattr(video.settings, "TWILIO_API_KEY_SECRET", "secret")

    body = client.get(f"/session/{booking_ref}").text
    assert "sdk.twilio.com" not in body
    assert client.get("/static/vendor/twilio-video-2.29.0.min.js").status_code == 200


def test_a_closed_session_hands_out_no_token(client):
    """Outside the window there is nothing to join, so nothing to mint."""
    booking_ref = _confirmed_booking(client)
    _move_session(booking_ref, timedelta(hours=3))

    response = client.get(f"/session/{booking_ref}")
    assert response.status_code == 403
    assert "data-video-token" not in response.text


def test_the_policy_stays_strict_when_video_is_off(client):
    policy = client.get("/").headers["content-security-policy"]
    assert "script-src 'self'" in policy
    assert "twilio.com" not in policy


def test_the_policy_admits_twilio_only_when_video_is_on(client, monkeypatch):
    from webapp import main

    monkeypatch.setattr(main.settings, "VIDEO_LIVE", True)
    policy = client.get("/").headers["content-security-policy"]

    assert "wss://*.twilio.com" in policy
    # Widened for signalling only; third-party script origins stay barred.
    assert "script-src 'self';" in policy


def test_the_camera_is_only_available_to_our_own_pages(client):
    policy = client.get("/").headers["permissions-policy"]
    assert "camera=(self)" in policy
    assert "geolocation=()" in policy


def test_an_unpaid_booking_cannot_be_joined(client):
    register(client)
    case_ref = make_case(client)
    counsellor_id, slot_id = _first_bookable(client, case_ref)
    held = client.post(f"/book/{case_ref}/{counsellor_id}", data={"slot_id": slot_id})
    booking_ref = held.headers["location"].rsplit("/", 1)[-1]
    _move_session(booking_ref, timedelta(minutes=2))

    response = client.get(f"/session/{booking_ref}")
    assert response.status_code == 403
    assert "not been paid for" in response.text


# ---------------------------------------------------------------------------
# Notifications
# ---------------------------------------------------------------------------


def test_confirming_queues_a_confirmation_and_the_reminders(client):
    booking_ref = _confirmed_booking(client)

    with db.session_scope() as session:
        booking = session.scalar(select(Booking).where(Booking.booking_ref == booking_ref))
        notes = session.scalars(
            select(Notification).where(Notification.booking_id == booking.id)
        ).all()

        kinds = {note.kind for note in notes}
        assert "confirmation" in kinds
        assert "reminder" in kinds

        channels = {note.channel for note in notes}
        assert channels == {"email", "sms"}  # a phone number was given

        # Recipients are masked for display, so the appointments page does not
        # print a full phone number to anyone looking over a shoulder.
        for note in notes:
            assert note.recipient_masked
            assert note.recipient_masked != note.recipient


def test_cancelling_stops_the_reminders_going_out(client):
    booking_ref = _confirmed_booking(client)
    client.post(f"/appointments/{booking_ref}/cancel")

    with db.session_scope() as session:
        booking = session.scalar(select(Booking).where(Booking.booking_ref == booking_ref))
        reminders = session.scalars(
            select(Notification).where(
                Notification.booking_id == booking.id, Notification.kind == "reminder"
            )
        ).all()
        assert reminders  # they existed
        assert all(note.status == "cancelled" for note in reminders)

        cancellations = session.scalars(
            select(Notification).where(
                Notification.booking_id == booking.id, Notification.kind == "cancellation"
            )
        ).all()
        assert cancellations


# ---------------------------------------------------------------------------
# Operational
# ---------------------------------------------------------------------------


def test_the_health_endpoint_reports_the_database_and_the_live_integrations(client):
    response = client.get("/healthz")
    assert response.status_code == 200
    payload = response.json()
    assert payload["database"] == "ok"
    assert payload["payments"] == "simulated"
    # The connection string carries a password and must never be echoed.
    assert "://" not in payload["database_target"]


def test_the_public_name_is_niyasaathi(client):
    page = client.get("/")
    assert page.status_code == 200
    assert "Niyasaathi" in page.text
    assert "NIYA Triage" not in page.text
    assert "Niya" in page.text and "saathi" in page.text


def test_pages_carry_the_baseline_security_headers(client):
    response = client.get("/")
    assert response.headers["x-frame-options"] == "DENY"
    assert response.headers["x-content-type-options"] == "nosniff"
    assert "default-src 'self'" in response.headers["content-security-policy"]


def test_the_session_cookie_is_not_readable_from_javascript(client):
    register(client)
    header = next(
        value for key, value in client.headers.items() if key.lower() == "cookie"
    ) if False else None  # cookie jar does not expose flags; assert on the response instead

    fresh = TestClient(app, follow_redirects=False)
    response = fresh.post(
        "/signup",
        data={
            "email": _unique_email(),
            "password": "a-long-enough-passphrase",
            "timezone_name": "utc",
        },
    )
    set_cookie = response.headers["set-cookie"]
    assert "HttpOnly" in set_cookie
    assert "SameSite=lax" in set_cookie
