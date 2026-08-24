"""Contact detail validation for booking notifications.

A booking is useless if the confirmation cannot reach the person, so at least
one reachable channel is required before a session is confirmed.

Dependency-free by design, which means the phone handling is structural only -
it checks shape and country code, not that the number exists. NIYA's Rails app
uses Phonelib for this and should continue to; `docs/BOOKING.md` records that as
the production substitution.

Note also that NIYA's `accounts` table has no `phone_verified` or `email_verified`
column, so a number can be stored without ever being confirmed reachable. This
module returns a `verified` flag that is always False for now, to keep the shape
of that decision visible rather than assumed.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Dict, List, Optional

# Deliberately permissive: the aim is to catch typos and empty strings, not to
# adjudicate RFC 5322. Over-strict email regexes reject valid addresses, and a
# person in distress does not need an argument with a form.
_EMAIL = re.compile(r"^[^@\s]+@[^@\s.]+(?:\.[^@\s.]+)+$")

#: Dialling codes for the countries NIYA serves, longest first so +1 does not
#: shadow +1-something and India's +91 is matched before +9.
_COUNTRY_CODES = (
    ("+971", "united arab emirates"),
    ("+353", "ireland"),
    ("+64", "new zealand"),
    ("+65", "singapore"),
    ("+61", "australia"),
    ("+91", "india"),
    ("+44", "united kingdom"),
    ("+49", "germany"),
    ("+33", "france"),
    ("+1", "united states/canada"),
)

_DEFAULT_DIALLING_CODE = {
    "india": "+91",
    "united kingdom": "+44",
    "canada": "+1",
    "united states": "+1",
    "usa": "+1",
    "australia": "+61",
    "new zealand": "+64",
    "ireland": "+353",
    "germany": "+49",
    "singapore": "+65",
    "united arab emirates": "+971",
    "uae": "+971",
}


@dataclass
class ContactDetails:
    email: Optional[str] = None
    phone: Optional[str] = None
    full_name: str = ""
    #: NIYA's schema has no verification columns; this stays False until a real
    #: OTP round-trip exists, rather than quietly implying the number is good.
    verified: bool = False
    errors: Dict[str, str] = field(default_factory=dict)

    @property
    def is_valid(self) -> bool:
        return not self.errors and bool(self.email or self.phone)

    @property
    def channels(self) -> List[str]:
        found = []
        if self.email:
            found.append("email")
        if self.phone:
            found.append("sms")
        return found

    def masked(self) -> Dict[str, Optional[str]]:
        """For display and logging - never write raw contact details to the audit log."""
        return {
            "email": mask_email(self.email),
            "phone": mask_phone(self.phone),
        }


def normalise_email(raw: Optional[str]) -> Optional[str]:
    if not raw:
        return None
    value = str(raw).strip().lower()
    return value or None


def normalise_phone(raw: Optional[str], country: str = "") -> Optional[str]:
    """Reduce to `+<digits>`, inferring the dialling code from country if absent."""
    if not raw:
        return None

    value = str(raw).strip()
    has_plus = value.startswith("+") or value.startswith("00")
    digits = re.sub(r"\D", "", value)
    if not digits:
        return None

    if value.startswith("00"):
        digits = digits[2:]

    if has_plus:
        return "+" + digits

    code = _DEFAULT_DIALLING_CODE.get((country or "").strip().lower())
    if code:
        # Strip a national trunk prefix before prepending the country code.
        if digits.startswith("0"):
            digits = digits.lstrip("0")
        return code + digits
    return "+" + digits


def dialling_country(phone: Optional[str]) -> Optional[str]:
    if not phone:
        return None
    for code, name in _COUNTRY_CODES:
        if phone.startswith(code):
            return name
    return None


def collect(
    email: Optional[str] = None,
    phone: Optional[str] = None,
    full_name: str = "",
    country: str = "",
    require: str = "any",
) -> ContactDetails:
    """Validate and normalise contact details.

    `require` is "any" (at least one channel), "email", "phone", or "both".
    """
    errors: Dict[str, str] = {}

    clean_email = normalise_email(email)
    if clean_email and not _EMAIL.match(clean_email):
        errors["email"] = "That does not look like an email address."
        clean_email = None

    clean_phone = normalise_phone(phone, country=country)
    if clean_phone:
        digits = clean_phone[1:]
        if len(digits) < 8 or len(digits) > 15:
            errors["phone"] = "A phone number needs between 8 and 15 digits."
            clean_phone = None
        elif dialling_country(clean_phone) is None:
            errors["phone"] = (
                "Unrecognised country dialling code. Include it, for example +91 or +44."
            )
            clean_phone = None

    if require in {"email", "both"} and not clean_email and "email" not in errors:
        errors["email"] = "An email address is required."
    if require in {"phone", "both"} and not clean_phone and "phone" not in errors:
        errors["phone"] = "A phone number is required."
    if require == "any" and not clean_email and not clean_phone and not errors:
        errors["contact"] = "Give an email address or a phone number so we can confirm."

    return ContactDetails(
        email=clean_email,
        phone=clean_phone,
        full_name=str(full_name or "").strip(),
        errors=errors,
    )


def mask_email(email: Optional[str]) -> Optional[str]:
    if not email or "@" not in email:
        return None
    local, _, domain = email.partition("@")
    head = local[0] if local else "?"
    return f"{head}{'*' * max(1, len(local) - 1)}@{domain}"


def mask_phone(phone: Optional[str]) -> Optional[str]:
    if not phone:
        return None
    tail = phone[-3:]
    return f"{phone[:3]}{'*' * max(1, len(phone) - 6)}{tail}"
