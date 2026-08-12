"""Request dependencies: who is signed in, and what happens when nobody is.

Kept separate from `main` so the route module and the app module do not import
each other.
"""

from __future__ import annotations

from typing import Optional

from fastapi import Depends, Request
from sqlalchemy.orm import Session

from . import db, settings
from .models import Account
from .security import resolve_session


class RedirectException(Exception):
    """Raised to send the browser somewhere else from deep inside a handler.

    An unauthenticated person hitting a page should land on the sign-in form,
    not on a JSON 401 they cannot read.
    """

    def __init__(self, location: str) -> None:
        self.location = location
        super().__init__(location)


def current_account(
    request: Request, session: Session = Depends(db.get_session)
) -> Optional[Account]:
    """The signed-in account, or None. Never raises."""
    return resolve_session(session, request.cookies.get(settings.SESSION_COOKIE_NAME))


def require_account(
    request: Request, session: Session = Depends(db.get_session)
) -> Account:
    """The signed-in account, or a redirect to sign in.

    Declared as a dependency on every protected route, so access control is a
    property of the route rather than a check each handler has to remember. The
    `next` parameter brings the person back where they were headed.
    """
    account = resolve_session(session, request.cookies.get(settings.SESSION_COOKIE_NAME))
    if account is None:
        raise RedirectException(f"/login?next={request.url.path}")
    return account


def require_admin(
    request: Request, session: Session = Depends(db.get_session)
) -> Account:
    """An administrator, or nothing.

    Someone signed in without the role is sent to their own home rather than
    shown a 403, because confirming that /admin exists and is merely forbidden
    is more than a client account needs to know.
    """
    account = require_account(request, session)
    if not account.is_admin:
        raise RedirectException(home_for(account))
    return account


def require_counsellor(
    request: Request, session: Session = Depends(db.get_session)
) -> Account:
    """A counsellor with a roster profile attached.

    The profile check is not decoration: every expert route works from the
    profile, and an account with the role but no profile would otherwise reach
    those pages and fail deeper in, with a less useful error.
    """
    account = require_account(request, session)
    if not account.is_counsellor or account.counsellor_profile is None:
        raise RedirectException(home_for(account))
    return account


def home_for(account: Optional[Account]) -> str:
    """Where this account belongs after signing in.

    One definition, used by the sign-in redirect, the landing page and the role
    guards, so the three cannot disagree and bounce someone between them.
    """
    if account is None:
        return "/"
    if account.is_admin:
        return "/admin"
    if account.is_counsellor:
        return "/expert"
    return "/intake"
