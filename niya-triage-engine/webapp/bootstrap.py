"""What has to be true before the app can serve its first request.

Both steps are idempotent and safe to run on every boot, which matters because
Render restarts containers freely and may run more than one replica.
"""

from __future__ import annotations

import logging
from typing import Optional

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from . import roster, settings
from .models import Account
from .security import hash_password

logger = logging.getLogger("niya.triage.bootstrap")


def seed_roster(session: Session) -> int:
    """Load the starter roster into an empty database."""
    added = roster.seed_from_file(session)
    if added:
        logger.info("seeded %s counsellors into an empty roster", added)
    return added


def ensure_admin(session: Session) -> Optional[Account]:
    """Create the first administrator from the environment, if asked to.

    Only ever creates. If an account already exists with that address it is left
    exactly as it is - an env var must not be able to reset a password or
    silently promote an existing client account to admin.
    """
    if not settings.ADMIN_EMAIL or not settings.ADMIN_PASSWORD:
        return None

    existing = session.scalar(select(Account).where(Account.email == settings.ADMIN_EMAIL))
    if existing is not None:
        if existing.role != "admin":
            logger.warning(
                "ADMIN_EMAIL matches an existing %s account; leaving it unchanged",
                existing.role,
            )
        return existing

    account = Account(
        email=settings.ADMIN_EMAIL,
        password_hash=hash_password(settings.ADMIN_PASSWORD),
        full_name="Administrator",
        role="admin",
        email_verified=True,
        timezone="Asia/Kolkata",
    )
    session.add(account)
    try:
        session.commit()
    except IntegrityError:
        # Another replica won the race. Its row is just as good as ours.
        session.rollback()
        return session.scalar(select(Account).where(Account.email == settings.ADMIN_EMAIL))

    logger.info("created the first administrator account")
    return account


def run(session: Session) -> None:
    seed_roster(session)
    ensure_admin(session)
