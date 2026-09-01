"""Sending email over SMTP, which for NIYA means Microsoft 365.

The SendGrid account this app was first pointed at has had a sending allowance
of zero since September 2025, so SMTP is the route that actually delivers.
"""

from __future__ import annotations

import smtplib

import pytest

from webapp import notify, settings


@pytest.fixture
def smtp_configured(monkeypatch):
    monkeypatch.setattr(settings, "SMTP_HOST", "smtp.office365.com")
    monkeypatch.setattr(settings, "SMTP_PORT", 587)
    monkeypatch.setattr(settings, "SMTP_USERNAME", "hello@niya.app")
    monkeypatch.setattr(settings, "SMTP_PASSWORD", "a-password")
    monkeypatch.setattr(settings, "SMTP_LIVE", True)
    monkeypatch.setattr(settings, "EMAIL_LIVE", True)
    monkeypatch.setattr(settings, "EMAIL_FROM", "hello@niya.app")
    monkeypatch.setattr(settings, "EMAIL_FROM_NAME", "Niyasaathi")
    monkeypatch.setattr(notify, "_email_verified", None)
    yield


class FakeSMTP:
    """Records what a real server would have been asked to do."""

    instances = []

    def __init__(self, host, port, timeout=None):
        self.host = host
        self.port = port
        self.started_tls = False
        self.login_args = None
        self.messages = []
        self.quit_called = False
        FakeSMTP.instances.append(self)

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.quit_called = True
        return False

    def starttls(self, context=None):
        self.started_tls = True

    def login(self, username, password):
        self.login_args = (username, password)

    def send_message(self, message):
        self.messages.append(message)


@pytest.fixture(autouse=True)
def reset_instances():
    FakeSMTP.instances = []
    yield


# ---------------------------------------------------------------------------
# Choosing a provider
# ---------------------------------------------------------------------------


def test_smtp_is_preferred_when_both_are_configured(monkeypatch):
    """Configuring SMTP is a decision not to use SendGrid."""
    monkeypatch.setattr(settings, "SMTP_LIVE", True)
    monkeypatch.setattr(settings, "SENDGRID_API_KEY", "SG.something")

    assert settings.email_provider() == "smtp"


def test_sendgrid_is_used_when_it_is_the_only_one(monkeypatch):
    monkeypatch.setattr(settings, "SMTP_LIVE", False)
    monkeypatch.setattr(settings, "SENDGRID_API_KEY", "SG.something")

    assert settings.email_provider() == "sendgrid"


def test_neither_configured_means_outbox(monkeypatch):
    monkeypatch.setattr(settings, "SMTP_LIVE", False)
    monkeypatch.setattr(settings, "SENDGRID_API_KEY", "")

    assert settings.email_provider() == "outbox"


# ---------------------------------------------------------------------------
# Sending
# ---------------------------------------------------------------------------


def test_a_message_goes_out_over_starttls(smtp_configured, monkeypatch):
    monkeypatch.setattr(smtplib, "SMTP", FakeSMTP)

    notify._send_email("someone@example.com", "Your session", "The body.")

    server = FakeSMTP.instances[0]
    assert (server.host, server.port) == ("smtp.office365.com", 587)
    assert server.started_tls, "credentials must never cross in the clear"
    assert server.login_args == ("hello@niya.app", "a-password")


def test_the_message_is_addressed_and_named_properly(smtp_configured, monkeypatch):
    monkeypatch.setattr(smtplib, "SMTP", FakeSMTP)

    notify._send_email("someone@example.com", "Your session", "The body.")

    message = FakeSMTP.instances[0].messages[0]
    assert message["To"] == "someone@example.com"
    assert message["Subject"] == "Your session"
    assert message["From"] == "Niyasaathi <hello@niya.app>"
    assert "The body." in message.get_content()


def test_sendgrid_is_not_called_when_smtp_is_configured(smtp_configured, monkeypatch):
    monkeypatch.setattr(smtplib, "SMTP", FakeSMTP)

    def fail(*args, **kwargs):
        raise AssertionError("the SendGrid path must not be taken")

    monkeypatch.setattr(notify, "_send_email_sendgrid", fail)

    notify._send_email("someone@example.com", "Subject", "Body")

    assert FakeSMTP.instances[0].messages


# ---------------------------------------------------------------------------
# Verification at startup
# ---------------------------------------------------------------------------


def test_working_credentials_are_verified(smtp_configured, monkeypatch):
    monkeypatch.setattr(smtplib, "SMTP", FakeSMTP)

    ok, _ = notify.verify_email_credentials()

    assert ok is True
    assert notify.email_status() == "smtp (verified)"
    assert FakeSMTP.instances[0].login_args is not None


def test_a_rejected_password_is_reported(smtp_configured, monkeypatch):
    class Rejecting(FakeSMTP):
        def login(self, username, password):
            raise smtplib.SMTPAuthenticationError(535, b"auth failed")

    monkeypatch.setattr(smtplib, "SMTP", Rejecting)

    ok, detail = notify.verify_email_credentials()

    assert ok is False
    assert "535" in detail
    assert "SMTP authentication" in detail
    assert notify.email_status().startswith("smtp BROKEN")


def test_an_unreachable_server_does_not_raise(smtp_configured, monkeypatch):
    def explode(*args, **kwargs):
        raise OSError("connection refused")

    monkeypatch.setattr(smtplib, "SMTP", explode)

    ok, detail = notify.verify_email_credentials()

    assert ok is False
    assert "could not reach smtp.office365.com" in detail


def test_the_health_reading_names_the_route(smtp_configured, monkeypatch):
    """Which provider carried the mail matters when diagnosing a failure."""
    monkeypatch.setattr(smtplib, "SMTP", FakeSMTP)
    notify.verify_email_credentials()

    assert "smtp" in notify.email_status()
    assert "sendgrid" not in notify.email_status()
