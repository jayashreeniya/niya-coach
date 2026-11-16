"""Twilio Video: token minting, scoping and expiry.

The token is the whole access control story for a call. Once minted it is a
bearer credential for a room where two people discuss something private, so
these tests are mostly about what a token does *not* let you do.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
from datetime import datetime, timedelta, timezone

import pytest

from webapp import settings, video


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


ACCOUNT_SID = "AC" + "0" * 32
API_KEY_SID = "SK" + "1" * 32
API_KEY_SECRET = "a-test-signing-secret"


@pytest.fixture
def configured(monkeypatch):
    """Video credentials present, as they would be on a live deployment."""
    monkeypatch.setattr(settings, "TWILIO_ACCOUNT_SID", ACCOUNT_SID)
    monkeypatch.setattr(settings, "TWILIO_API_KEY_SID", API_KEY_SID)
    monkeypatch.setattr(settings, "TWILIO_API_KEY_SECRET", API_KEY_SECRET)
    monkeypatch.setattr(settings, "VIDEO_LIVE", True)


class FakeAccount:
    def __init__(self, id_=1, full_name="Priya Sharma", email="priya@example.com"):
        self.id = id_
        self.full_name = full_name
        self.email = email


class FakeBooking:
    def __init__(self, booking_ref="NT-ABC123", room_id="niya-room-1"):
        self.booking_ref = booking_ref
        self.room_id = room_id


def decode(token: str) -> dict:
    segment = token.split(".")[1]
    segment += "=" * ((4 - len(segment) % 4) % 4)
    return json.loads(base64.urlsafe_b64decode(segment))


def header_of(token: str) -> dict:
    segment = token.split(".")[0]
    segment += "=" * ((4 - len(segment) % 4) % 4)
    return json.loads(base64.urlsafe_b64decode(segment))


# ---------------------------------------------------------------------------
# Availability
# ---------------------------------------------------------------------------


def test_video_is_not_offered_without_credentials(monkeypatch):
    monkeypatch.setattr(settings, "VIDEO_LIVE", False)
    assert video.is_available() is False
    assert video.access_token("someone", "a-room") is None


def test_no_token_means_the_page_falls_back_rather_than_breaking(monkeypatch):
    """The absence of a token is what the template branches on."""
    monkeypatch.setattr(settings, "VIDEO_LIVE", False)
    assert video.token_for(FakeAccount(), FakeBooking()) is None


# ---------------------------------------------------------------------------
# Token shape
# ---------------------------------------------------------------------------


def test_the_token_is_signed_with_the_api_key_secret(configured):
    token = video.access_token("someone", "a-room")
    signing_input, _, signature = token.rpartition(".")

    expected = hmac.new(
        API_KEY_SECRET.encode(), signing_input.encode("ascii"), hashlib.sha256
    ).digest()
    expected_b64 = base64.urlsafe_b64encode(expected).rstrip(b"=").decode()

    assert signature == expected_b64


def test_a_token_signed_with_the_wrong_secret_does_not_match(configured):
    token = video.access_token("someone", "a-room")
    signing_input, _, signature = token.rpartition(".")

    wrong = hmac.new(
        b"not-the-secret", signing_input.encode("ascii"), hashlib.sha256
    ).digest()

    assert signature != base64.urlsafe_b64encode(wrong).rstrip(b"=").decode()


def test_the_header_carries_twilios_content_type(configured):
    """Twilio rejects an access token without cty: twilio-fpa;v=1."""
    assert header_of(video.access_token("someone", "a-room"))["cty"] == "twilio-fpa;v=1"


def test_the_issuer_is_the_api_key_and_the_subject_is_the_account(configured):
    payload = decode(video.access_token("someone", "a-room"))
    assert payload["iss"] == API_KEY_SID
    assert payload["sub"] == ACCOUNT_SID


# ---------------------------------------------------------------------------
# Scoping
# ---------------------------------------------------------------------------


def test_the_token_is_scoped_to_one_room(configured):
    payload = decode(video.access_token("someone", "room-a"))
    assert payload["grants"]["video"]["room"] == "room-a"


def test_a_token_for_one_booking_does_not_name_another(configured):
    first = decode(video.token_for(FakeAccount(), FakeBooking(room_id="room-a")))
    second = decode(video.token_for(FakeAccount(), FakeBooking(room_id="room-b")))

    assert first["grants"]["video"]["room"] == "room-a"
    assert second["grants"]["video"]["room"] == "room-b"
    assert first["grants"]["video"]["room"] != second["grants"]["video"]["room"]


def test_the_room_falls_back_to_the_booking_reference(configured):
    """A booking without a stored room still gets a stable, unique room."""
    booking = FakeBooking(booking_ref="NT-XYZ789", room_id="")
    assert video.room_name(booking) == "niya-NT-XYZ789"


def test_two_people_in_the_same_session_share_a_room(configured):
    booking = FakeBooking(room_id="the-room")
    client = decode(video.token_for(FakeAccount(1, "Priya"), booking))
    counsellor = decode(video.token_for(FakeAccount(2, "Meera"), booking))

    assert client["grants"]["video"]["room"] == counsellor["grants"]["video"]["room"]


def test_two_people_have_different_identities(configured):
    """Twilio evicts the first participant when a second shares an identity."""
    booking = FakeBooking()
    client = decode(video.token_for(FakeAccount(1, "Priya Sharma"), booking))
    counsellor = decode(video.token_for(FakeAccount(2, "Meera Krishnan"), booking))

    assert client["grants"]["identity"] != counsellor["grants"]["identity"]


def test_two_people_with_the_same_name_still_differ(configured):
    booking = FakeBooking()
    one = decode(video.token_for(FakeAccount(1, "Priya Sharma"), booking))
    two = decode(video.token_for(FakeAccount(2, "Priya Sharma"), booking))

    assert one["grants"]["identity"] != two["grants"]["identity"]


def test_a_long_identity_is_truncated_to_twilios_limit(configured):
    account = FakeAccount(1, "A" * 400)
    identity = decode(video.token_for(account, FakeBooking()))["grants"]["identity"]
    assert len(identity) <= video.MAX_IDENTITY


def test_an_account_without_a_name_still_gets_an_identity(configured):
    account = FakeAccount(7, full_name="", email="quiet@example.com")
    identity = decode(video.token_for(account, FakeBooking()))["grants"]["identity"]
    assert identity.strip()
    assert "7" in identity


# ---------------------------------------------------------------------------
# Expiry
# ---------------------------------------------------------------------------


def test_the_token_expires_when_the_joining_window_closes(configured):
    now = datetime(2026, 5, 1, 12, 0, 0, tzinfo=timezone.utc)
    closes = now + timedelta(minutes=40)

    payload = decode(video.access_token("someone", "a-room", expires_at=closes, now=now))

    assert payload["exp"] == int(closes.timestamp())


def test_a_naive_time_is_read_as_utc_not_as_local_time(configured):
    """Stored times are naive UTC. Reading one as local would be hours out."""
    aware = datetime(2026, 5, 1, 12, 0, 0, tzinfo=timezone.utc)
    naive = datetime(2026, 5, 1, 12, 0, 0)

    from_aware = decode(video.access_token("x", "r", expires_at=aware, now=aware))
    from_naive = decode(video.access_token("x", "r", expires_at=naive, now=naive))

    assert from_aware["iat"] == from_naive["iat"]


def test_a_mix_of_naive_and_aware_times_does_not_raise(configured):
    """The booking's window is aware; utcnow() is naive. Both must work."""
    naive_now = datetime(2026, 5, 1, 12, 0, 0)
    aware_close = datetime(2026, 5, 1, 13, 0, 0, tzinfo=timezone.utc)

    payload = decode(
        video.access_token("x", "r", expires_at=aware_close, now=naive_now)
    )
    assert payload["exp"] - payload["iat"] == 60 * 60


def test_a_token_does_not_outlive_the_session_it_belongs_to(configured):
    """The Rails app issues four-hour tokens; a session lasts about an hour."""
    now = datetime(2026, 5, 1, 12, 0, 0, tzinfo=timezone.utc)
    closes = now + timedelta(minutes=65)

    payload = decode(video.access_token("someone", "a-room", expires_at=closes, now=now))

    assert payload["exp"] - payload["iat"] < 4 * 60 * 60
    assert payload["exp"] - payload["iat"] == 65 * 60


def test_a_window_that_has_already_closed_still_mints_a_usable_token(configured):
    """Minted at the very end of a window, a token needs a moment to connect.

    Twilio rejects an already-expired token outright, which would show a
    confusing error instead of letting the last few seconds work.
    """
    now = datetime(2026, 5, 1, 12, 0, 0, tzinfo=timezone.utc)
    payload = decode(
        video.access_token("someone", "a-room", expires_at=now, now=now)
    )
    assert payload["exp"] > payload["iat"]


# ---------------------------------------------------------------------------
# Credential verification
#
# Present is not the same as working. A deployment with a rotated key reported
# healthy right up until somebody tried to join.
# ---------------------------------------------------------------------------


def test_unconfigured_video_reports_not_connected(monkeypatch):
    monkeypatch.setattr(settings, "VIDEO_LIVE", False)
    monkeypatch.setattr(video, "_verified", None)
    assert video.status() == "not connected"


def test_credentials_that_twilio_rejects_are_reported_as_broken(configured, monkeypatch):
    import urllib.error

    def reject(*args, **kwargs):
        raise urllib.error.HTTPError("url", 401, "Authenticate", {}, None)

    monkeypatch.setattr("urllib.request.urlopen", reject)

    ok, detail = video.verify_credentials()

    assert ok is False
    assert "401" in detail
    assert "BROKEN" in video.status()


def test_working_credentials_are_reported_plainly(configured, monkeypatch):
    class Response:
        status = 200

        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

    monkeypatch.setattr("urllib.request.urlopen", lambda *a, **k: Response())

    ok, _ = video.verify_credentials()

    assert ok is True
    # Not the bare "twilio" the old presence-only check reported, so that the
    # health endpoint distinguishes accepted credentials from present ones.
    assert video.status() == "twilio (verified)"


def test_the_check_asks_the_video_api_not_the_account_resource(configured, monkeypatch):
    """API keys cannot read the account resource.

    Checking there returns 401 for a valid key, which would report working
    credentials as broken. Ask the service the app actually uses.
    """
    seen = {}

    class Response:
        status = 200

        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

    def capture(request, *args, **kwargs):
        seen["url"] = request.full_url
        return Response()

    monkeypatch.setattr("urllib.request.urlopen", capture)

    video.verify_credentials()

    assert "video.twilio.com" in seen["url"]
    assert "api.twilio.com" not in seen["url"]


def test_a_network_failure_does_not_raise(configured, monkeypatch):
    """A hiccup at boot must not stop the app serving everything else."""
    def explode(*args, **kwargs):
        raise OSError("no route to host")

    monkeypatch.setattr("urllib.request.urlopen", explode)

    ok, detail = video.verify_credentials()

    assert ok is False
    assert "could not reach Twilio" in detail


def test_expiry_is_capped_at_twilios_maximum(configured):
    now = datetime(2026, 5, 1, 12, 0, 0, tzinfo=timezone.utc)
    absurd = now + timedelta(days=30)

    payload = decode(video.access_token("someone", "a-room", expires_at=absurd, now=now))

    assert payload["exp"] - payload["iat"] <= video.MAXIMUM_TTL_SECONDS
