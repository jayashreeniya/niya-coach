"""Twilio Programmable Video: room names and access tokens.

A Twilio access token is a JWT signed with an API key secret, so this is written
against the standard library rather than pulling in the Twilio SDK for one
signature. The shape is Twilio's, documented under Access Tokens:

    header   {"alg": "HS256", "typ": "JWT", "cty": "twilio-fpa;v=1"}
    payload  iss = API key SID, sub = account SID, grants = {identity, video}

Two deliberate differences from how NIYA's Rails app issues these:

Tokens expire at the end of the booking's joining window, not four hours later.
A token is a bearer credential for a room where two people discuss something
private, so it should stop working when the session does.

The room is fixed to the booking's own room, and the identity to the account
asking. A token minted for one session cannot be replayed into another.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import logging
from datetime import datetime, timezone
from typing import Optional

from . import settings

logger = logging.getLogger("niya.triage.video")

#: Twilio rejects identities over 121 characters, and treats two participants
#: with the same identity as the same person - the second connection evicts the
#: first. Identities are therefore per account, not per role.
MAX_IDENTITY = 121

#: A token that has already expired is useless, and one that outlives the window
#: defeats the point of having a window. A small floor keeps a token minted in
#: the last seconds of a session usable for long enough to connect.
MINIMUM_TTL_SECONDS = 60

#: Twilio rejects a TTL over 24 hours.
MAXIMUM_TTL_SECONDS = 24 * 60 * 60


def is_available() -> bool:
    """Whether video can be offered at all."""
    return settings.VIDEO_LIVE


def _as_utc(moment: datetime) -> datetime:
    """Treat a naive datetime as UTC, and convert an aware one to UTC.

    Times are stored naive-UTC in the database but arrive aware from some code
    paths. Mixing the two raises, and `.timestamp()` on a naive datetime is read
    as *local* time, which on a machine outside UTC silently stamps a token
    hours away from now.
    """
    if moment.tzinfo is None:
        return moment.replace(tzinfo=timezone.utc)
    return moment.astimezone(timezone.utc)


def _segment(payload: dict) -> str:
    raw = json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("ascii")


def room_name(booking) -> str:
    """The room for a booking.

    Derived from the booking reference rather than stored separately, so a room
    cannot drift from the session it belongs to.
    """
    return booking.room_id or f"niya-{booking.booking_ref}"


def identity_for(account) -> str:
    """A stable, human-readable name for a participant.

    The counsellor sees who they are talking to, so this carries the person's
    name. It also carries the account id, because two clients may share a name
    and Twilio treats identical identities as the same participant.
    """
    name = (getattr(account, "full_name", "") or "").strip()
    label = name or (getattr(account, "email", "") or "").split("@")[0] or "participant"
    identity = f"{label} ({account.id})"
    return identity[:MAX_IDENTITY]


def access_token(
    identity: str,
    room: str,
    expires_at: Optional[datetime] = None,
    now: Optional[datetime] = None,
) -> Optional[str]:
    """Mint a token for one identity in one room.

    Returns None when video is not configured, which is what keeps the session
    page an honest placeholder instead of a broken call surface.
    """
    if not is_available():
        return None

    issued = _as_utc(now) if now is not None else datetime.now(timezone.utc)
    if expires_at is None:
        ttl = MINIMUM_TTL_SECONDS * 30
    else:
        ttl = int((_as_utc(expires_at) - issued).total_seconds())
    ttl = max(MINIMUM_TTL_SECONDS, min(ttl, MAXIMUM_TTL_SECONDS))

    issued_at = int(issued.timestamp())
    payload = {
        "jti": f"{settings.TWILIO_API_KEY_SID}-{issued_at}",
        "iss": settings.TWILIO_API_KEY_SID,
        "sub": settings.TWILIO_ACCOUNT_SID,
        "iat": issued_at,
        "exp": issued_at + ttl,
        "grants": {
            "identity": identity[:MAX_IDENTITY],
            "video": {"room": room},
        },
    }

    signing_input = (
        _segment({"alg": "HS256", "typ": "JWT", "cty": "twilio-fpa;v=1"})
        + "."
        + _segment(payload)
    ).encode("ascii")

    signature = hmac.new(
        settings.TWILIO_API_KEY_SECRET.encode("utf-8"), signing_input, hashlib.sha256
    ).digest()

    return (
        signing_input.decode("ascii")
        + "."
        + base64.urlsafe_b64encode(signature).rstrip(b"=").decode("ascii")
    )


def token_for(account, booking, expires_at: Optional[datetime] = None) -> Optional[str]:
    """The token a given person needs for a given booking."""
    return access_token(
        identity=identity_for(account),
        room=room_name(booking),
        expires_at=expires_at,
    )


def describe_mode() -> dict:
    return {
        "video": "Twilio Programmable Video" if is_available()
        else "Not connected (no Twilio API key pair)"
    }
