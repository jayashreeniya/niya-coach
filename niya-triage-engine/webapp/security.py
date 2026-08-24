"""Passwords, sessions and the current user.

Session design: the cookie holds a random 32-byte token and nothing else. Only
its SHA-256 hash is stored, so a leaked database backup does not hand out live
sessions, and sign-out genuinely revokes because the server owns the record.

This is a departure from NIYA's approach, which issues a self-contained JWT
valid for a day. Those cannot be revoked - its denylist reads `params[:token]`
while the token arrives as a header, so logout almost never matches - and the
signing secret sits in `ENV['SECRET_KEY']` shared across every service.
"""

from __future__ import annotations

import hashlib
import re
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple

import bcrypt
from sqlalchemy import select
from sqlalchemy.orm import Session

from . import settings
from .models import Account, UserSession, utcnow

# bcrypt truncates silently at 72 bytes. Rejecting longer input is better than
# accepting a password whose tail is ignored.
MAX_PASSWORD_BYTES = 72
MIN_PASSWORD_LENGTH = 10


def hash_password(raw: str) -> str:
    return bcrypt.hashpw(raw.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(raw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(raw.encode("utf-8"), hashed.encode("utf-8"))
    except (ValueError, TypeError):
        return False


def password_problems(raw: str, email: str = "") -> list:
    """Why this password is not acceptable, in plain language.

    Length does more for resistance to guessing than character-class rules do,
    so the floor is ten characters and the rest is about obvious weakness. NIYA
    requires eight with upper, lower, digit and symbol, which reliably produces
    `Password1!` and little else.
    """
    problems = []
    if len(raw) < MIN_PASSWORD_LENGTH:
        problems.append(f"Use at least {MIN_PASSWORD_LENGTH} characters.")
    if len(raw.encode("utf-8")) > MAX_PASSWORD_BYTES:
        problems.append("That password is too long. Keep it under 72 characters.")
    if raw.lower() in _COMMON_PASSWORDS:
        problems.append("That password is one of the most commonly used. Pick another.")
    if email and raw.lower() == email.split("@")[0].lower():
        problems.append("Your password should not be your email address.")
    if raw and raw == raw[0] * len(raw):
        problems.append("That password is a single repeated character.")
    return problems


_COMMON_PASSWORDS = {
    "password", "password1", "password123", "12345678", "123456789", "1234567890",
    "qwertyuiop", "letmein123", "iloveyou1", "admin12345", "welcome123",
    "niya123456", "changeme123", "passw0rd123",
}


_EMAIL = re.compile(r"^[^@\s]+@[^@\s.]+(?:\.[^@\s.]+)+$")


def normalise_email(raw: str) -> str:
    return (raw or "").strip().lower()


def is_valid_email(raw: str) -> bool:
    return bool(_EMAIL.match(normalise_email(raw)))


# ---------------------------------------------------------------------------
# Sessions
# ---------------------------------------------------------------------------


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_session(
    session: Session, account: Account, user_agent: str = ""
) -> Tuple[str, UserSession]:
    """Returns the raw cookie value and the stored record.

    The raw token is never persisted and cannot be recovered from the database.
    """
    token = secrets.token_urlsafe(32)
    record = UserSession(
        token_hash=_hash_token(token),
        account_id=account.id,
        expires_at=utcnow() + timedelta(days=settings.SESSION_MAX_AGE_DAYS),
        user_agent=(user_agent or "")[:255],
    )
    session.add(record)
    session.commit()
    return token, record


def resolve_session(session: Session, token: Optional[str]) -> Optional[Account]:
    if not token:
        return None

    record = session.scalar(
        select(UserSession).where(UserSession.token_hash == _hash_token(token))
    )
    if record is None or not record.is_valid:
        return None

    account = session.get(Account, record.account_id)
    if account is None or not account.is_active:
        return None
    return account


def revoke_session(session: Session, token: Optional[str]) -> None:
    if not token:
        return
    record = session.scalar(
        select(UserSession).where(UserSession.token_hash == _hash_token(token))
    )
    if record is not None and record.revoked_at is None:
        record.revoked_at = utcnow()
        session.commit()


def revoke_all_sessions(session: Session, account: Account) -> int:
    """Used after a password change - a changed password must end other sessions."""
    records = session.scalars(
        select(UserSession).where(
            UserSession.account_id == account.id, UserSession.revoked_at.is_(None)
        )
    ).all()
    for record in records:
        record.revoked_at = utcnow()
    session.commit()
    return len(records)


# ---------------------------------------------------------------------------
# Sign-in throttling
# ---------------------------------------------------------------------------


def register_failed_login(session: Session, account: Account) -> None:
    account.failed_login_count += 1
    if account.failed_login_count >= settings.LOGIN_MAX_ATTEMPTS:
        account.locked_until = utcnow() + timedelta(minutes=settings.LOGIN_LOCKOUT_MINUTES)
        account.failed_login_count = 0
    session.commit()


def register_successful_login(session: Session, account: Account) -> None:
    account.failed_login_count = 0
    account.locked_until = None
    account.last_login_at = utcnow()
    session.commit()


def authenticate(
    session: Session, email: str, password: str
) -> Tuple[Optional[Account], Optional[str]]:
    """Returns (account, error). The error is deliberately vague.

    Distinguishing "no such account" from "wrong password" tells an attacker
    which addresses are registered, which for a mental-health service is a
    disclosure that matters more than usual.
    """
    account = session.scalar(select(Account).where(Account.email == normalise_email(email)))

    if account is None:
        # Spend roughly the same time as a real check, so response timing does
        # not reveal whether the address exists.
        bcrypt.checkpw(b"timing", bcrypt.hashpw(b"timing", bcrypt.gensalt()))
        return None, "That email address and password do not match."

    if account.is_locked:
        return None, (
            "Too many sign-in attempts. Try again in "
            f"{settings.LOGIN_LOCKOUT_MINUTES} minutes."
        )

    if not account.is_active:
        return None, "That account has been deactivated. Contact support."

    if not verify_password(password, account.password_hash):
        register_failed_login(session, account)
        return None, "That email address and password do not match."

    register_successful_login(session, account)
    return account, None
