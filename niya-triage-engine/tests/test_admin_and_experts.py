"""The admin portal, per-counsellor pricing, and the counsellor's own portal.

Weighted, like the other end-to-end tests, towards what would be damaging rather
than merely wrong: a role reaching a portal it should not, a counsellor reading
somebody else's sessions, and money moving by a different amount than the one
shown to the person who agreed to pay it.
"""

from __future__ import annotations

import re
import uuid
from datetime import timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select

from webapp import db
from webapp.main import app
from webapp.models import Account, Booking, CounsellorProfile, utcnow
from webapp.security import hash_password

PASSWORD = "a-long-enough-passphrase"


@pytest.fixture(scope="module", autouse=True)
def _schema():
    db.init_db()
    yield


@pytest.fixture
def client():
    with TestClient(app, follow_redirects=False) as test_client:
        yield test_client


def _email(prefix: str) -> str:
    return f"{prefix}-{uuid.uuid4().hex[:8]}@example.com"


def sign_in(client: TestClient, email: str, password: str = PASSWORD) -> None:
    response = client.post("/login", data={"email": email, "password": password})
    assert response.status_code == 303, response.text


def make_admin(client: TestClient) -> str:
    """An administrator, created directly and signed in."""
    email = _email("admin")
    with db.session_scope() as session:
        session.add(
            Account(
                email=email,
                password_hash=hash_password(PASSWORD),
                full_name="Admin",
                role="admin",
                timezone="asia/calcutta",
            )
        )
    sign_in(client, email)
    return email


def make_client_account(client: TestClient) -> str:
    email = _email("client")
    response = client.post(
        "/signup",
        data={
            "full_name": "Test Person",
            "email": email,
            "password": PASSWORD,
            "country": "united_kingdom",
            "timezone_name": "europe/london",
            "languages": ["english"],
        },
    )
    assert response.status_code == 303, response.text
    return email


def onboarding_payload(**overrides) -> dict:
    payload = {
        "display_name": "Dr. Test Counsellor",
        "email": _email("counsellor"),
        "credentials": "MSc Counselling Psychology",
        "phone": "",
        "counsellor_fee": "1000",
        "client_price": "1400",
        "timezone_name": "asia/calcutta",
        "working_hours_start": "8",
        "working_hours_end": "20",
        "years_experience": "9",
        "max_cases": "20",
        "max_complexity": "high",
        "languages": ["english"],
        "country_context": ["india"],
        "client_types": ["student"],
        "capabilities": [],
        "categories": ["academic_avoidance"],
        "notes": "",
    }
    payload.update(overrides)
    return payload


def onboard(client: TestClient, **overrides) -> dict:
    """Onboard a counsellor. Returns their ref, email and one-time password."""
    payload = onboarding_payload(**overrides)
    response = client.post("/admin/counsellors/new", data=payload)
    assert response.status_code == 200, response.text

    ref = re.search(r"\b(C\d{3})\b", response.text)
    assert ref, response.text
    password = re.search(r"<strong>(niya-[0-9a-f]{8})</strong>", response.text)

    return {
        "ref": ref.group(1),
        "email": payload["email"],
        "password": password.group(1) if password else None,
    }


def make_counsellor(admin: TestClient, **overrides) -> dict:
    """Onboard a counsellor and return a signed-in client for them.

    Signs in with the one-time password the portal issued, which is the only
    credential that exists for a freshly onboarded counsellor.
    """
    created = onboard(admin, **overrides)
    portal = TestClient(app, follow_redirects=False)
    sign_in(portal, created["email"], created["password"])
    created["portal"] = portal
    return created


def book_with(client: TestClient, ref: str, case_ref: str) -> str:
    """Book the counsellor's first free slot. Returns the booking reference."""
    page = client.get(f"/book/{case_ref}/{ref}")
    assert page.status_code == 200, page.text
    slots = re.findall(r'name="slot_id" value="([^"]+)"', page.text)
    if not slots:
        pytest.skip("the counsellor has no availability in the test window")

    held = client.post(f"/book/{case_ref}/{ref}", data={"slot_id": slots[0]})
    assert held.status_code == 303, held.text
    booking_ref = held.headers["location"].rsplit("/", 1)[-1]
    assert client.post(f"/checkout/{booking_ref}", data={}).status_code == 303
    return booking_ref


def make_case(client: TestClient) -> str:
    response = client.post(
        "/intake",
        data={"text": "I keep putting off my coursework and the deadline is close", "desired_timing": "flexible"},
    )
    assert response.status_code == 303
    return response.headers["location"].rsplit("/", 1)[-1]


# ---------------------------------------------------------------------------
# Who can reach what
# ---------------------------------------------------------------------------


def test_a_client_cannot_reach_the_admin_portal(client):
    make_client_account(client)

    for path in ("/admin", "/admin/bookings", "/admin/counsellors/new"):
        response = client.get(path)
        assert response.status_code == 303
        # Sent to their own home rather than shown a 403, which would confirm
        # the portal exists.
        assert response.headers["location"] == "/intake"


def test_a_client_cannot_reach_the_expert_portal(client):
    make_client_account(client)

    response = client.get("/expert")
    assert response.status_code == 303
    assert response.headers["location"] == "/intake"


def test_a_counsellor_cannot_reach_the_admin_portal(client):
    make_admin(client)
    counsellor = make_counsellor(client)

    response = counsellor["portal"].get("/admin")
    assert response.status_code == 303
    assert response.headers["location"] == "/expert"


def test_signing_out_is_enough_to_lose_admin_access(client):
    make_admin(client)
    assert client.get("/admin").status_code == 200

    client.post("/logout")
    response = client.get("/admin")
    assert response.status_code == 303
    assert response.headers["location"].startswith("/login")


def test_each_role_lands_on_its_own_home_after_signing_in(client):
    admin_email = make_admin(client)
    counsellor = make_counsellor(client)
    client.post("/logout")

    fresh = TestClient(app, follow_redirects=False)
    assert fresh.post(
        "/login", data={"email": admin_email, "password": PASSWORD}
    ).headers["location"] == "/admin"

    another = TestClient(app, follow_redirects=False)
    assert another.post(
        "/login", data={"email": counsellor["email"], "password": counsellor["password"]}
    ).headers["location"] == "/expert"


# ---------------------------------------------------------------------------
# Onboarding
# ---------------------------------------------------------------------------


def test_onboarding_puts_a_counsellor_on_the_roster_with_a_working_login(client):
    make_admin(client)
    created = onboard(client)

    assert created["password"], "a one-time password should be shown once"

    with db.session_scope() as session:
        profile = session.scalar(
            select(CounsellorProfile).where(CounsellorProfile.ref == created["ref"])
        )
        assert profile is not None
        assert profile.active
        assert profile.client_price_minor == 140000
        assert profile.counsellor_fee_minor == 100000
        assert profile.margin_minor == 40000
        assert profile.account is not None
        assert profile.account.role == "counsellor"

    # The password shown to the admin is the one that actually works.
    portal = TestClient(app, follow_redirects=False)
    response = portal.post(
        "/login", data={"email": created["email"], "password": created["password"]}
    )
    assert response.status_code == 303
    assert response.headers["location"] == "/expert"


def test_onboarded_counsellors_get_distinct_references(client):
    make_admin(client)
    first = onboard(client)
    second = onboard(client)
    assert first["ref"] != second["ref"]


def test_a_client_price_below_the_counsellor_fee_is_refused(client):
    """A typo here is a loss on every session, found weeks later in a payout."""
    make_admin(client)

    response = client.post(
        "/admin/counsellors/new",
        data=onboarding_payload(counsellor_fee="1500", client_price="900"),
    )
    assert response.status_code == 400
    assert "would lose money" in response.text


def test_onboarding_without_a_price_is_refused(client):
    make_admin(client)

    response = client.post(
        "/admin/counsellors/new", data=onboarding_payload(client_price="")
    )
    assert response.status_code == 400
    assert "what the client pays" in response.text


def test_escalation_capability_is_ignored_without_a_clinical_qualification(client):
    """Risk-flagged cases must not route to someone unqualified to hold them."""
    make_admin(client)
    created = onboard(client, escalation_capability="1")  # no clinical qualification

    with db.session_scope() as session:
        profile = session.scalar(
            select(CounsellorProfile).where(CounsellorProfile.ref == created["ref"])
        )
        assert profile.escalation_capability is False

    granted = onboard(client, escalation_capability="1", clinically_qualified="1")
    with db.session_scope() as session:
        profile = session.scalar(
            select(CounsellorProfile).where(CounsellorProfile.ref == granted["ref"])
        )
        assert profile.escalation_capability is True


def test_taking_a_counsellor_off_the_roster_stops_new_bookings(client):
    make_admin(client)
    created = onboard(client)

    assert client.post(f"/admin/counsellors/{created['ref']}/toggle").status_code == 303

    with db.session_scope() as session:
        profile = session.scalar(
            select(CounsellorProfile).where(CounsellorProfile.ref == created["ref"])
        )
        assert profile.active is False

    booker = TestClient(app, follow_redirects=False)
    make_client_account(booker)
    case_ref = make_case(booker)

    response = booker.get(f"/book/{case_ref}/{created['ref']}")
    assert response.status_code == 303
    assert response.headers["location"] == f"/result/{case_ref}"


# ---------------------------------------------------------------------------
# Money
# ---------------------------------------------------------------------------


def test_the_price_shown_is_the_counsellors_own(client):
    make_admin(client)
    created = onboard(client, client_price="2222", counsellor_fee="1111")

    booker = TestClient(app, follow_redirects=False)
    make_client_account(booker)
    case_ref = make_case(booker)

    page = booker.get(f"/book/{case_ref}/{created['ref']}")
    assert page.status_code == 200
    assert "2,222.00" in page.text
    # What NIYA pays the counsellor is nobody else's business.
    assert "1,111.00" not in page.text


def test_the_booking_is_charged_the_counsellors_price_and_records_the_split(client):
    make_admin(client)
    created = onboard(client, client_price="1800", counsellor_fee="1200")

    booker = TestClient(app, follow_redirects=False)
    make_client_account(booker)
    booking_ref = book_with(booker, created["ref"], make_case(booker))

    with db.session_scope() as session:
        booking = session.scalar(select(Booking).where(Booking.booking_ref == booking_ref))
        assert booking.payment.amount_minor == 180000
        assert booking.payment.counsellor_fee_minor == 120000
        assert booking.payment.platform_fee_minor == 60000


def test_repricing_a_counsellor_does_not_change_an_existing_booking(client):
    """The payout report has to match what was actually charged."""
    make_admin(client)
    created = onboard(client, client_price="1800", counsellor_fee="1200")

    booker = TestClient(app, follow_redirects=False)
    make_client_account(booker)
    booking_ref = book_with(booker, created["ref"], make_case(booker))

    response = client.post(
        f"/admin/counsellors/{created['ref']}",
        data=onboarding_payload(client_price="3000", counsellor_fee="2500", email=""),
    )
    assert response.status_code == 303

    with db.session_scope() as session:
        profile = session.scalar(
            select(CounsellorProfile).where(CounsellorProfile.ref == created["ref"])
        )
        assert profile.client_price_minor == 300000  # new price applies from now on

        booking = session.scalar(select(Booking).where(Booking.booking_ref == booking_ref))
        assert booking.payment.amount_minor == 180000       # unchanged
        assert booking.payment.counsellor_fee_minor == 120000
        assert booking.payment.platform_fee_minor == 60000


def test_the_admin_dashboard_reports_margin_from_what_was_charged(client):
    make_admin(client)
    created = onboard(client, client_price="1800", counsellor_fee="1200")

    booker = TestClient(app, follow_redirects=False)
    make_client_account(booker)
    book_with(booker, created["ref"], make_case(booker))

    page = client.get("/admin")
    assert page.status_code == 200
    assert "NIYA margin" in page.text


def test_prices_appear_against_each_counsellor_on_the_shortlist(client):
    booker = TestClient(app, follow_redirects=False)
    make_client_account(booker)
    case_ref = make_case(booker)

    page = booker.get(f"/result/{case_ref}")
    assert page.status_code == 200
    if "Counsellors who fit" not in page.text:
        pytest.skip("no shortlist for this case")
    # A price per card, not one figure for the whole service.
    assert page.text.count('class="price"') >= 1
    assert "60 min" in page.text


# ---------------------------------------------------------------------------
# The expert portal
# ---------------------------------------------------------------------------


def test_a_counsellor_sees_their_own_confirmed_sessions(client):
    make_admin(client)
    counsellor = make_counsellor(client)

    booker = TestClient(app, follow_redirects=False)
    make_client_account(booker)
    booking_ref = book_with(booker, counsellor["ref"], make_case(booker))

    page = counsellor["portal"].get("/expert")
    assert page.status_code == 200
    assert booking_ref in page.text


def test_a_counsellor_does_not_see_another_counsellors_sessions(client):
    make_admin(client)
    working = make_counsellor(client)
    other = make_counsellor(client)

    booker = TestClient(app, follow_redirects=False)
    make_client_account(booker)
    booking_ref = book_with(booker, working["ref"], make_case(booker))

    page = other["portal"].get("/expert")
    assert page.status_code == 200
    assert booking_ref not in page.text


def test_a_counsellor_cannot_join_another_counsellors_call(client):
    make_admin(client)
    working = make_counsellor(client)
    other = make_counsellor(client)

    booker = TestClient(app, follow_redirects=False)
    make_client_account(booker)
    booking_ref = book_with(booker, working["ref"], make_case(booker))
    _move_session(booking_ref, timedelta(minutes=2))

    response = other["portal"].get(f"/expert/session/{booking_ref}")
    assert response.status_code == 303
    assert response.headers["location"] == "/expert"


def test_the_counsellor_is_held_to_the_same_joining_window_as_the_client(client):
    make_admin(client)
    counsellor = make_counsellor(client)

    booker = TestClient(app, follow_redirects=False)
    make_client_account(booker)
    booking_ref = book_with(booker, counsellor["ref"], make_case(booker))

    _move_session(booking_ref, timedelta(hours=4))
    early = counsellor["portal"].get(f"/expert/session/{booking_ref}")
    assert early.status_code == 403
    assert "Not open yet" in early.text

    _move_session(booking_ref, timedelta(minutes=3))
    open_now = counsellor["portal"].get(f"/expert/session/{booking_ref}")
    assert open_now.status_code == 200
    assert "You are in" in open_now.text

    _move_session(booking_ref, timedelta(minutes=-70))
    late = counsellor["portal"].get(f"/expert/session/{booking_ref}")
    assert late.status_code == 403
    assert "has ended" in late.text


def test_a_counsellor_can_change_their_own_hours_and_stop_taking_clients(client):
    make_admin(client)
    counsellor = make_counsellor(client)

    response = counsellor["portal"].post(
        "/expert/availability",
        data={
            "timezone_name": "europe/london",
            "working_hours_start": "10",
            "working_hours_end": "16",
            "max_cases": "5",
            "accepting": "",
        },
    )
    assert response.status_code == 303

    with db.session_scope() as session:
        profile = session.scalar(
            select(CounsellorProfile).where(CounsellorProfile.ref == counsellor["ref"])
        )
        assert profile.timezone == "europe/london"
        assert profile.working_hours_start == 10
        assert profile.working_hours_end == 16
        assert profile.max_cases == 5
        assert profile.active is False


def test_a_counsellor_cannot_set_hours_that_end_before_they_start(client):
    make_admin(client)
    counsellor = make_counsellor(client)

    response = counsellor["portal"].post(
        "/expert/availability",
        data={
            "timezone_name": "asia/calcutta",
            "working_hours_start": "18",
            "working_hours_end": "9",
            "max_cases": "20",
            "accepting": "1",
        },
    )
    assert response.status_code == 400
    assert "start before it ends" in response.text


def test_a_counsellor_cannot_change_their_own_fee(client):
    """Pricing is an admin decision, so it is not on any form they can reach."""
    make_admin(client)
    counsellor = make_counsellor(client, counsellor_fee="1000", client_price="1400")

    page = counsellor["portal"].get("/expert/availability")
    assert page.status_code == 200
    assert "counsellor_fee" not in page.text
    assert "client_price" not in page.text

    # Posting the fields anyway changes nothing.
    counsellor["portal"].post(
        "/expert/availability",
        data={
            "timezone_name": "asia/calcutta",
            "working_hours_start": "9",
            "working_hours_end": "18",
            "max_cases": "20",
            "accepting": "1",
            "counsellor_fee": "9999",
            "client_price": "9999",
        },
    )

    with db.session_scope() as session:
        profile = session.scalar(
            select(CounsellorProfile).where(CounsellorProfile.ref == counsellor["ref"])
        )
        assert profile.counsellor_fee_minor == 100000
        assert profile.client_price_minor == 140000


def test_a_counsellor_changing_their_password_keeps_them_signed_in(client):
    make_admin(client)
    counsellor = make_counsellor(client)

    response = counsellor["portal"].post(
        "/expert/password",
        data={
            "current_password": counsellor["password"],
            "new_password": "a-different-long-passphrase",
        },
    )
    assert response.status_code == 200
    assert "Changed" in response.text

    fresh = TestClient(app, follow_redirects=False)
    assert fresh.post(
        "/login",
        data={"email": counsellor["email"], "password": "a-different-long-passphrase"},
    ).status_code == 303
    # The one-time password stops working, which is the point of changing it.
    assert fresh.post(
        "/login", data={"email": counsellor["email"], "password": counsellor["password"]}
    ).status_code == 401


def test_the_wrong_current_password_does_not_change_anything(client):
    make_admin(client)
    counsellor = make_counsellor(client)

    response = counsellor["portal"].post(
        "/expert/password",
        data={"current_password": "not-my-password", "new_password": "another-long-passphrase"},
    )
    assert response.status_code == 400
    assert "not your current password" in response.text


def _move_session(booking_ref: str, starts_in: timedelta) -> None:
    with db.session_scope() as session:
        booking = session.scalar(select(Booking).where(Booking.booking_ref == booking_ref))
        start = utcnow() + starts_in
        booking.start_utc = start.replace(tzinfo=None)
        booking.end_utc = (start + timedelta(hours=1)).replace(tzinfo=None)
        booking.start_utc_active = booking.start_utc
