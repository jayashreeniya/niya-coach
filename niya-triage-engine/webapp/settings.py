"""Runtime configuration for the deployable app.

Everything is read from the environment so the same image runs locally and on
Render with no code change. Defaults are chosen so `uvicorn webapp.main:app`
works on a clean checkout with nothing configured: SQLite on disk, simulated
payment and messaging.

Nothing here reads NIYA's existing databases or services. This app is standalone
by design.
"""

from __future__ import annotations

import os
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
WEBAPP_ROOT = Path(__file__).resolve().parent

APP_NAME = "NIYA Triage"
ENVIRONMENT = os.environ.get("APP_ENV", "development").strip().lower()
IS_PRODUCTION = ENVIRONMENT == "production"


def _flag(name: str, default: bool = False) -> bool:
    raw = os.environ.get(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


# ---------------------------------------------------------------------------
# Database
#
# SQLite locally so the app runs with no setup. On Render, DATABASE_URL points
# at the `niyatriage` database on TiDB Cloud, which speaks the MySQL wire
# protocol and requires TLS:
#
#   mysql+pymysql://user:pass@gateway01.<region>.prod.aws.tidbcloud.com:4000/niyatriage?ssl_verify_cert=true
#
# It is a separate database from `niya_admin_db`. This app never reads NIYA's
# tables and never writes to them.
# ---------------------------------------------------------------------------

DATABASE_URL = os.environ.get(
    "DATABASE_URL", f"sqlite:///{PROJECT_ROOT / 'webapp_data' / 'niyatriage.db'}"
)

# Render and some providers hand out `mysql://`, which SQLAlchemy does not map
# to a driver on its own.
if DATABASE_URL.startswith("mysql://"):
    DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+pymysql://", 1)

SQL_ECHO = _flag("SQL_ECHO", False)


# ---------------------------------------------------------------------------
# Sessions and security
# ---------------------------------------------------------------------------

#: Signing key for the session cookie. A generated fallback keeps development
#: working, but it changes on every restart, so sessions do not survive a
#: reload. Production refuses to start without a real one - see validate().
SECRET_KEY = os.environ.get("APP_SECRET_KEY", "")

SESSION_COOKIE_NAME = "niya_triage_session"
SESSION_MAX_AGE_DAYS = int(os.environ.get("SESSION_MAX_AGE_DAYS", "14"))
#: Cookies are only sent over HTTPS in production. Local development is plain
#: HTTP, so this has to be conditional rather than hardcoded.
SESSION_COOKIE_SECURE = _flag("SESSION_COOKIE_SECURE", IS_PRODUCTION)

#: Rate limiting for sign-in, to make credential stuffing expensive.
LOGIN_MAX_ATTEMPTS = int(os.environ.get("LOGIN_MAX_ATTEMPTS", "8"))
LOGIN_LOCKOUT_MINUTES = int(os.environ.get("LOGIN_LOCKOUT_MINUTES", "15"))


# ---------------------------------------------------------------------------
# Payment
#
# Razorpay when keys are present, simulated otherwise. The simulated path is not
# a stub that skips verification - it runs the same hold -> verify -> confirm
# state machine, with a locally computed signature standing in for Razorpay's.
# ---------------------------------------------------------------------------

RAZORPAY_KEY_ID = os.environ.get("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET", "")
PAYMENTS_LIVE = bool(RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET)

#: Only a default now. Each counsellor carries their own price, set by an admin;
#: this is the figure used to seed the starter roster and to show a headline
#: price before anyone has been chosen.
SESSION_PRICE_MINOR = int(os.environ.get("SESSION_PRICE_MINOR", "150000"))
SESSION_CURRENCY = os.environ.get("SESSION_CURRENCY", "INR")


# ---------------------------------------------------------------------------
# First administrator
#
# Set both to have the first admin created on boot. Leaving them unset is fine -
# `python scripts/create_admin.py` does the same thing interactively, which
# avoids leaving a password sitting in the Render environment permanently.
# ---------------------------------------------------------------------------

ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "").strip().lower()
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")


# ---------------------------------------------------------------------------
# Email and SMS
#
# SendGrid and Twilio are what NIYA already runs, so those are the two adapters.
# Without credentials both fall back to the outbox, which records the message
# instead of sending it.
# ---------------------------------------------------------------------------

SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY", "")
EMAIL_FROM = os.environ.get("EMAIL_FROM", "hello@niya.app")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "NIYA")
EMAIL_LIVE = bool(SENDGRID_API_KEY)

TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "")
TWILIO_FROM_NUMBER = os.environ.get("TWILIO_FROM_NUMBER", "")
SMS_LIVE = bool(TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and TWILIO_FROM_NUMBER)


# ---------------------------------------------------------------------------
# Video
#
# Twilio Programmable Video, which is what NIYA's web app already uses. The API
# key pair is separate from the auth token: an API key can be revoked on its own
# without disturbing anything else on the account, which the auth token cannot.
#
# In NIYA's Rails app these are read from CHAT_API_KEY and CHAT_API_SECRET,
# named after an earlier use. They are named for what they are here.
#
# Without them the session page stays a placeholder rather than failing, so the
# rest of the booking journey can be run and tested without video credentials.
# ---------------------------------------------------------------------------

TWILIO_API_KEY_SID = os.environ.get("TWILIO_API_KEY_SID", "")
TWILIO_API_KEY_SECRET = os.environ.get("TWILIO_API_KEY_SECRET", "")
VIDEO_LIVE = bool(TWILIO_ACCOUNT_SID and TWILIO_API_KEY_SID and TWILIO_API_KEY_SECRET)

#: Rooms are created when the first participant connects. Left off, Twilio uses
#: the account default, which for a two-person counselling call should be `go`
#: or `peer-to-peer` rather than `group`.
TWILIO_ROOM_TYPE = os.environ.get("TWILIO_ROOM_TYPE", "go")


# ---------------------------------------------------------------------------
# Deployment
# ---------------------------------------------------------------------------

#: Render supplies PORT. Binding to anything else means the service never
#: becomes healthy.
PORT = int(os.environ.get("PORT", "8080"))
BASE_URL = os.environ.get("BASE_URL", f"http://localhost:{PORT}")

#: Render terminates TLS at the edge and forwards X-Forwarded-Proto. Without
#: honouring it the app thinks every request is HTTP and refuses to set secure
#: cookies.
TRUST_PROXY_HEADERS = _flag("TRUST_PROXY_HEADERS", IS_PRODUCTION)


class ConfigurationError(RuntimeError):
    pass


def validate() -> None:
    """Fail fast on a misconfigured production boot.

    Starting up with a missing signing key is worse than not starting: every
    user gets logged out on each restart and nobody notices until someone asks
    why they keep having to sign in.
    """
    if not IS_PRODUCTION:
        return

    problems = []
    if not SECRET_KEY or len(SECRET_KEY) < 32:
        problems.append(
            "APP_SECRET_KEY must be set to at least 32 characters in production."
        )
    if DATABASE_URL.startswith("sqlite"):
        problems.append(
            "DATABASE_URL still points at SQLite. Set it to the niyatriage MySQL database."
        )
    if "localhost" in BASE_URL or "127.0.0.1" in BASE_URL:
        problems.append(
            "BASE_URL still points at localhost. It is used to build the links in "
            "confirmation emails and texts, so booting with it would send people "
            "addresses they cannot open."
        )
    if problems:
        raise ConfigurationError(" ".join(problems))


def describe() -> dict:
    """What is live and what is simulated. Rendered on the health endpoint."""
    return {
        "environment": ENVIRONMENT,
        # Host and database name only - never the URL, which carries the password.
        "database_target": DATABASE_URL.split("@")[-1] if "@" in DATABASE_URL else "sqlite (local)",
        "payments": "razorpay" if PAYMENTS_LIVE else "simulated",
        "email": "sendgrid" if EMAIL_LIVE else "outbox only",
        "sms": "twilio" if SMS_LIVE else "outbox only",
        "video": "twilio" if VIDEO_LIVE else "not connected",
    }
