"""PII redaction for anything that leaves the live request path.

Scope, stated precisely because getting this wrong in either direction is bad:

* Redaction is applied to the **audit log**, to **exported datasets**, and to
  any payload sent to a third-party model provider if that is ever enabled.
* Redaction is NOT applied to the text the assigned counsellor reads. Stripping
  "my mother" or a place name from a disclosure would make the handover worse
  and could make it unsafe.

The redactor is deliberately over-eager. In an anonymised training or audit
corpus, a false redaction costs a little context; a missed phone number is a
data-protection incident.

This is pattern-based and therefore imperfect: it will not catch every name
written in running prose. It is a defence-in-depth layer, not a substitute for
access control and retention limits (see docs/PRIVACY.md).
"""

from __future__ import annotations

import re
from typing import Dict, List, Tuple

_PATTERNS: List[Tuple[str, str, str]] = [
    (
        "EMAIL",
        r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}",
        "[EMAIL]",
    ),
    (
        "URL",
        r"\b(?:https?://|www\.)[^\s<>\"]+",
        "[URL]",
    ),
    (
        "PHONE",
        r"(?<![\w])(?:\+?\d{1,3}[\s.\-]?)?(?:\(\d{2,4}\)[\s.\-]?)?\d{3,5}[\s.\-]?\d{3,4}(?:[\s.\-]?\d{2,4})?(?![\w])",
        "[PHONE]",
    ),
    (
        "ID_NUMBER",
        r"(?<![\w])[A-Z]{1,3}\d{6,}(?![\w])",
        "[ID]",
    ),
    (
        "POSTCODE_UK",
        r"(?<![\w])[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}(?![\w])",
        "[POSTCODE]",
    ),
    (
        "POSTCODE_CA",
        r"(?<![\w])[A-Z]\d[A-Z]\s?\d[A-Z]\d(?![\w])",
        "[POSTCODE]",
    ),
    (
        "UNIVERSITY",
        r"\b(?:University\s+of\s+[A-Z][A-Za-z\-]+(?:\s+[A-Z][A-Za-z\-]+)?"
        r"|[A-Z][A-Za-z\-]+(?:\s+[A-Z][A-Za-z\-]+)?\s+(?:University|College|Institute|Polytechnic))\b",
        "[INSTITUTION]",
    ),
    (
        "EMPLOYER",
        r"\b(?:work(?:ing)?\s+(?:at|for)|employed\s+(?:at|by)|my\s+company\s+is)\s+"
        r"([A-Z][A-Za-z0-9&.\-]*(?:\s+[A-Z][A-Za-z0-9&.\-]*){0,2})",
        "[EMPLOYER]",
    ),
    (
        "SELF_NAME",
        r"\b(?:my\s+name\s+is|i\s+am\s+called|this\s+is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)",
        "[NAME]",
    ),
    (
        "TITLED_NAME",
        r"\b(?:Mr|Mrs|Ms|Miss|Dr|Prof|Professor)\.?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?",
        "[NAME]",
    ),
]

# Study and work destinations frequently named by NIYA users.
_LOCATIONS = (
    "toronto", "vancouver", "montreal", "calgary", "ottawa", "waterloo", "brampton",
    "london", "manchester", "birmingham", "leeds", "glasgow", "edinburgh", "coventry",
    "new york", "boston", "chicago", "san francisco", "seattle", "austin", "houston",
    "sydney", "melbourne", "brisbane", "perth", "adelaide", "auckland", "wellington",
    "dublin", "berlin", "munich", "amsterdam", "rotterdam", "paris", "singapore",
    "dubai", "abu dhabi", "doha",
    "mumbai", "delhi", "bangalore", "bengaluru", "hyderabad", "chennai", "kolkata",
    "pune", "ahmedabad", "jaipur", "kochi", "kerala", "punjab", "gujarat",
)

_LOCATION_PATTERN = re.compile(
    r"\b(" + "|".join(re.escape(name) for name in _LOCATIONS) + r")\b",
    re.IGNORECASE,
)


def redact(text: str, redact_locations: bool = True) -> Tuple[str, Dict[str, int]]:
    """Return (redacted_text, counts_by_type)."""
    if not text:
        return "", {}

    counts: Dict[str, int] = {}
    result = text

    for label, pattern, replacement in _PATTERNS:
        compiled = re.compile(pattern)
        found = compiled.findall(result)
        if found:
            counts[label] = counts.get(label, 0) + len(found)
            if label in {"EMPLOYER", "SELF_NAME"}:
                # These patterns capture a trailing group; keep the lead-in words.
                def _sub(match: "re.Match[str]", token: str = replacement) -> str:
                    whole = match.group(0)
                    captured = match.group(1)
                    return whole.replace(captured, token)

                result = compiled.sub(_sub, result)
            else:
                result = compiled.sub(replacement, result)

    if redact_locations:
        found_locations = _LOCATION_PATTERN.findall(result)
        if found_locations:
            counts["LOCATION"] = counts.get("LOCATION", 0) + len(found_locations)
            result = _LOCATION_PATTERN.sub("[LOCATION]", result)

    return result, counts


def redact_for_audit(text: str) -> str:
    """Country context is preserved deliberately: emergency routing depends on it."""
    redacted, _ = redact(text, redact_locations=True)
    return redacted


def redaction_report(text: str) -> Dict[str, int]:
    _, counts = redact(text)
    return counts
