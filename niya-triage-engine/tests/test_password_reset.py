"""Forgot-password / reset-password for every role.

Clients, coaches and admins share one login, so they share one reset flow.
The interesting properties are safety rather than convenience: the response
must not reveal whether an address is registered, a used or expired token
must not work again, and changing the password must end every other session.
"""

from __future__ import annotations

from datetime import timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select

from webapp import db, notify, settings
from webapp.main import app
from webapp.models import Account, PasswordResetToken, UserSession, utcnow
from webapp.security import (
    hash_password,
    issue_password_reset,
    resolve_password_reset,
    verify_password,
)


@pytest.fixture(scope="module", autouse=True)
def _schema():
    db.init_db()
    yield


@pytest.fixture
def client():
    return TestClient(app, follow_redirects=False)


def _email(prefix: str = "reset") -> str:
    import uuid

    return f"{prefix}-{uuid.uuid4().hex[:10]}@example.com"


def make_account(role: str = "client", email: str | None = None, password: str = "old-password-here") -> dict:
    email = email or _email(role)
    with db.session_scope() as session:
        account = Account(
            email=email,
            password_hash=hash_password(password),
            full_name="Reset Tester",
            role=role,
            timezone="UTC",
        )
        session.add(account)
        session.commit()
        return {"id": account.id, "email": email, "password": password, "role": role}


def test_the_login_page_offers_forgot_password(client):
    page = client.get("/login")
    assert page.status_code == 200
    assert "/forgot-password" in page.text


def test_forgot_password_looks_the_same_for_known_and_unknown_addresses(client, monkeypatch):
    """An attacker must not learn which emails have accounts from this form."""
    known = make_account()
    sent = []
    monkeypatch.setattr(settings, "EMAIL_LIVE", False)
    monkeypatch.setattr(
        notify, "send_password_reset",
        lambda to, url, minutes: sent.append((to, url, minutes)) or True,
    )

    unknown = client.post("/forgot-password", data={"email": _email("nobody")})
    known_resp = client.post("/forgot-password", data={"email": known["email"]})

    assert unknown.status_code == 200
    assert known_resp.status_code == 200
    assert "If that address has an account" in unknown.text
    assert "If that address has an account" in known_resp.text
    assert sent and sent[0][0] == known["email"]
    assert "token=" in sent[0][1]


@pytest.mark.parametrize("role", ["client", "counsellor", "admin"])
def test_each_role_can_reset_their_password(client, monkeypatch, role):
    account = make_account(role=role)
    captured = {}

    def capture(to, url, minutes):
        captured["to"] = to
        captured["url"] = url
        return True

    monkeypatch.setattr(notify, "send_password_reset", capture)
    monkeypatch.setattr(settings, "EMAIL_LIVE", True)

    assert client.post("/forgot-password", data={"email": account["email"]}).status_code == 200
    token = captured["url"].split("token=", 1)[1]

    form = client.get(f"/reset-password?token={token}")
    assert form.status_code == 200
    assert "Choose a new password" in form.text

    new_password = "brand-new-password-99"
    saved = client.post(
        "/reset-password",
        data={
            "token": token,
            "password": new_password,
            "password_confirm": new_password,
        },
    )
    assert saved.status_code == 303
    assert saved.headers["location"] == "/login?reset=1"

    login = client.post(
        "/login", data={"email": account["email"], "password": new_password}
    )
    assert login.status_code == 303

    with db.session_scope() as session:
        row = session.scalar(select(Account).where(Account.email == account["email"]))
        assert verify_password(new_password, row.password_hash)
        assert not verify_password(account["password"], row.password_hash)


def test_a_used_token_cannot_be_used_again(client, monkeypatch):
    account = make_account()
    captured = {}
    monkeypatch.setattr(
        notify, "send_password_reset",
        lambda to, url, minutes: captured.update(url=url) or True,
    )

    client.post("/forgot-password", data={"email": account["email"]})
    token = captured["url"].split("token=", 1)[1]

    first = client.post(
        "/reset-password",
        data={
            "token": token,
            "password": "first-new-password",
            "password_confirm": "first-new-password",
        },
    )
    assert first.status_code == 303

    second = client.post(
        "/reset-password",
        data={
            "token": token,
            "password": "second-new-password",
            "password_confirm": "second-new-password",
        },
    )
    assert second.status_code == 400
    assert "not valid any more" in second.text


def test_an_expired_token_is_rejected(client):
    account = make_account()
    with db.session_scope() as session:
        row = session.get(Account, account["id"])
        token, record = issue_password_reset(session, row)
        record.expires_at = utcnow() - timedelta(minutes=1)
        session.commit()

    page = client.get(f"/reset-password?token={token}")
    assert page.status_code == 200
    assert "not valid any more" in page.text


def test_resetting_the_password_ends_other_sessions(client, monkeypatch):
    account = make_account()
    signed_in = TestClient(app, follow_redirects=False)
    assert signed_in.post(
        "/login",
        data={"email": account["email"], "password": account["password"]},
    ).status_code == 303

    captured = {}
    monkeypatch.setattr(
        notify, "send_password_reset",
        lambda to, url, minutes: captured.update(url=url) or True,
    )
    client.post("/forgot-password", data={"email": account["email"]})
    token = captured["url"].split("token=", 1)[1]
    assert client.post(
        "/reset-password",
        data={
            "token": token,
            "password": "after-the-reset-99",
            "password_confirm": "after-the-reset-99",
        },
    ).status_code == 303

    with db.session_scope() as session:
        live = session.scalars(
            select(UserSession).where(
                UserSession.account_id == account["id"],
                UserSession.revoked_at.is_(None),
            )
        ).all()
        assert live == []

    blocked = signed_in.get("/appointments")
    assert blocked.status_code == 303
    assert "/login" in blocked.headers["location"]


def test_mismatched_confirmation_is_refused(client, monkeypatch):
    account = make_account()
    captured = {}
    monkeypatch.setattr(
        notify, "send_password_reset",
        lambda to, url, minutes: captured.update(url=url) or True,
    )
    client.post("/forgot-password", data={"email": account["email"]})
    token = captured["url"].split("token=", 1)[1]

    response = client.post(
        "/reset-password",
        data={
            "token": token,
            "password": "good-enough-password",
            "password_confirm": "different-password",
        },
    )
    assert response.status_code == 400
    assert "do not match" in response.text


def test_a_newer_request_invalidates_the_older_link():
    account = make_account()
    with db.session_scope() as session:
        row = session.get(Account, account["id"])
        old_token, _ = issue_password_reset(session, row)
        new_token, _ = issue_password_reset(session, row)

    with db.session_scope() as session:
        assert resolve_password_reset(session, old_token) is None
        assert resolve_password_reset(session, new_token) is not None
