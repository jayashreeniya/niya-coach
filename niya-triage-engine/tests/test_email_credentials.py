"""The email credential check.

Confirmations are queued and delivered in the background, so a rejected
SendGrid key fails where nobody is looking: the booking succeeds, the page
promises a confirmation, and nothing ever arrives. These cover the check that
surfaces it at startup instead.
"""

from __future__ import annotations

import json
import urllib.error

import pytest

from webapp import notify, settings


@pytest.fixture
def configured(monkeypatch):
    monkeypatch.setattr(settings, "SENDGRID_API_KEY", "SG.test-key")
    monkeypatch.setattr(settings, "EMAIL_LIVE", True)
    monkeypatch.setattr(notify, "_email_verified", None)
    monkeypatch.setattr(notify, "_email_detail", "not checked")
    yield


def respond_with(scopes):
    class Response:
        status = 200

        def read(self):
            return json.dumps({"scopes": scopes}).encode()

        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

    return lambda *args, **kwargs: Response()


def test_without_a_key_email_reports_outbox_only(monkeypatch):
    monkeypatch.setattr(settings, "EMAIL_LIVE", False)
    monkeypatch.setattr(notify, "_email_verified", None)

    assert notify.email_status() == "outbox only"


def test_a_key_that_may_send_mail_is_verified(configured, monkeypatch):
    monkeypatch.setattr(
        "urllib.request.urlopen", respond_with(["mail.send", "alerts.read"])
    )

    ok, _ = notify.verify_email_credentials()

    assert ok is True
    assert notify.email_status() == "sendgrid (verified)"


def test_a_rejected_key_is_reported_as_broken(configured, monkeypatch):
    def reject(*args, **kwargs):
        raise urllib.error.HTTPError("url", 401, "Unauthorized", {}, None)

    monkeypatch.setattr("urllib.request.urlopen", reject)

    ok, detail = notify.verify_email_credentials()

    assert ok is False
    assert "401" in detail
    assert "BROKEN" in notify.email_status()


def test_a_key_without_mail_send_permission_is_caught(configured, monkeypatch):
    """Restricted keys are easy to create without the one scope that matters.

    Such a key authenticates perfectly and then cannot send anything.
    """
    monkeypatch.setattr(
        "urllib.request.urlopen", respond_with(["alerts.read", "stats.read"])
    )

    ok, detail = notify.verify_email_credentials()

    assert ok is False
    assert "mail.send" in detail
    assert "BROKEN" in notify.email_status()


def test_a_network_failure_does_not_raise(configured, monkeypatch):
    """A hiccup at boot must not stop the app serving everything else."""

    def explode(*args, **kwargs):
        raise OSError("no route to host")

    monkeypatch.setattr("urllib.request.urlopen", explode)

    ok, detail = notify.verify_email_credentials()

    assert ok is False
    assert "could not reach SendGrid" in detail


def test_the_check_asks_sendgrid_not_some_other_host(configured, monkeypatch):
    seen = {}

    class Response:
        status = 200

        def read(self):
            return json.dumps({"scopes": ["mail.send"]}).encode()

        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

    def capture(request, *args, **kwargs):
        seen["url"] = request.full_url
        seen["auth"] = request.get_header("Authorization")
        return Response()

    monkeypatch.setattr("urllib.request.urlopen", capture)

    notify.verify_email_credentials()

    assert "api.sendgrid.com" in seen["url"]
    assert seen["auth"] == "Bearer SG.test-key"
