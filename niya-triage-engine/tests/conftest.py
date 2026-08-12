"""Shared test fixtures and environment.

The database URL has to be set before `webapp.settings` is imported, because it
reads the environment at import time. pytest loads conftest first, which is why
this lives at module level rather than inside a fixture.
"""

from __future__ import annotations

import os
import tempfile
from pathlib import Path

import pytest

_TEST_DB = Path(tempfile.gettempdir()) / "niyatriage_test.db"
if _TEST_DB.exists():
    _TEST_DB.unlink()

os.environ["DATABASE_URL"] = f"sqlite:///{_TEST_DB}"
os.environ["APP_ENV"] = "test"
os.environ["APP_SECRET_KEY"] = "test-secret-key-that-is-long-enough-to-pass-checks"
# No provider credentials, so payments are simulated and messages stay queued.
os.environ.pop("RAZORPAY_KEY_ID", None)
os.environ.pop("SENDGRID_API_KEY", None)
os.environ.pop("TWILIO_ACCOUNT_SID", None)


@pytest.fixture(scope="session")
def repository():
    """The synthetic counsellor roster, loaded once for the whole run.

    Read-only in every test that uses it, so sharing one instance is safe and
    saves re-reading the JSON for each of the matching and pipeline tests.
    """
    from niya_triage.counsellors import default_repository

    return default_repository()
