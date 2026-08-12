"""Engine-wide configuration.

Everything tunable lives here so that calibration is a config change rather
than a code change. The match weights in particular are the brief's stated
assumptions and are expected to move once real acceptance data exists.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Dict

ENGINE_VERSION = "0.1.0"

PACKAGE_ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = PACKAGE_ROOT.parent
DATA_DIR = PROJECT_ROOT / "data"
COUNSELLOR_FILE = DATA_DIR / "counsellors.json"
DATASET_FILE = DATA_DIR / "test_cases.jsonl"
HARD_SET_FILE = DATA_DIR / "hard_cases.jsonl"

AUDIT_DIR = Path(os.environ.get("NIYA_AUDIT_DIR", str(PROJECT_ROOT / "audit")))
AUDIT_LOG = AUDIT_DIR / "decisions.jsonl"

# ---------------------------------------------------------------------------
# Booking - all local to this prototype. No NIYA system is contacted.
# ---------------------------------------------------------------------------

BOOKING_DIR = Path(os.environ.get("NIYA_BOOKING_DIR", str(PROJECT_ROOT / "bookings")))
BOOKING_FILE = BOOKING_DIR / "bookings.json"
#: Simulated email and SMS land here instead of being sent.
OUTBOX_FILE = BOOKING_DIR / "outbox.jsonl"

#: Minor units (paise) so there is never a float in a money calculation.
#: Production reads no price at all - the amount lives only in the Razorpay
#: dashboard button config, which is why no booking can be reconciled to a
#: charge. See docs/BOOKING.md.
SESSION_PRICE_MINOR = int(os.environ.get("NIYA_SESSION_PRICE_MINOR", "150000"))
SESSION_CURRENCY = os.environ.get("NIYA_SESSION_CURRENCY", "INR")

# MatchScore weights from the brief. Deliberately kept as a single dict so the
# evaluation harness can sweep them.
MATCH_WEIGHTS: Dict[str, float] = {
    "problem_fit": 0.30,
    "availability": 0.20,
    "language_fit": 0.15,
    "cultural_fit": 0.15,
    "timezone_fit": 0.10,
    "historical_outcome": 0.10,
}

#: How many counsellors to return in a shortlist.
SHORTLIST_SIZE = 3

#: A counsellor scoring below this is not worth a coordinator's attention.
MIN_VIABLE_MATCH_SCORE = 0.35

# ---------------------------------------------------------------------------
# LLM settings - entirely optional. The engine is fully functional without.
# ---------------------------------------------------------------------------

LLM_ENABLED = os.environ.get("NIYA_LLM_ENABLED", "auto").strip().lower()
LLM_MODEL = os.environ.get("NIYA_LLM_MODEL", "gpt-4o-mini")
LLM_TIMEOUT_SECONDS = float(os.environ.get("NIYA_LLM_TIMEOUT", "12"))
LLM_API_KEY_ENV = "OPENAI_API_KEY"


def llm_should_run() -> bool:
    """`auto` means "use it if a key is present"."""
    if LLM_ENABLED in {"0", "false", "off", "no"}:
        return False
    if LLM_ENABLED in {"1", "true", "on", "yes"}:
        return True
    return bool(os.environ.get(LLM_API_KEY_ENV))


def validate_weights() -> None:
    total = sum(MATCH_WEIGHTS.values())
    if abs(total - 1.0) > 1e-6:
        raise ValueError(f"MATCH_WEIGHTS must sum to 1.0, got {total}")
