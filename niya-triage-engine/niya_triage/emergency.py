"""Country-relevant emergency guidance shown when the safety layer fires.

IMPORTANT OPERATIONAL NOTE
--------------------------
These numbers are correct to the best of the author's knowledge at the time of
writing, but a crisis directory is a safety-critical artefact and must not be
trusted to a code comment. Before any real deployment this table must be:

  1. verified against each country's official health service,
  2. given a named owner and a scheduled re-verification date,
  3. covered by a test that fails if a country in the counsellor roster has no
     entry here (see tests/test_safety.py::test_every_served_country_has_resources).

The engine degrades safely: an unknown country returns the generic block, which
tells the user to contact local emergency services rather than guessing a number.
"""

from __future__ import annotations

from typing import Dict, List

from .types import EmergencyResource

# Countries where NIYA's diaspora users concentrate.
_DIRECTORY: Dict[str, List[EmergencyResource]] = {
    "india": [
        EmergencyResource("india", "Emergency services", "112"),
        EmergencyResource(
            "india", "Tele-MANAS (Govt. of India mental health)", "14416 or 1-800-891-4416",
            "24x7, multiple Indian languages",
        ),
        EmergencyResource("india", "KIRAN mental health helpline", "1800-599-0019", "24x7, 13 languages"),
        EmergencyResource("india", "AASRA", "+91 98204 66726", "24x7"),
    ],
    "canada": [
        EmergencyResource("canada", "Emergency services", "911"),
        EmergencyResource("canada", "Suicide Crisis Helpline", "988", "Call or text, 24x7"),
        EmergencyResource("canada", "Hope for Wellness Help Line", "1-855-242-3310"),
    ],
    "united states": [
        EmergencyResource("united states", "Emergency services", "911"),
        EmergencyResource("united states", "Suicide & Crisis Lifeline", "988", "Call or text, 24x7"),
        EmergencyResource("united states", "Crisis Text Line", "Text HOME to 741741"),
    ],
    "united kingdom": [
        EmergencyResource("united kingdom", "Emergency services", "999"),
        EmergencyResource("united kingdom", "NHS urgent mental health", "111, option 2"),
        EmergencyResource("united kingdom", "Samaritans", "116 123", "Free, 24x7"),
        EmergencyResource("united kingdom", "Shout crisis text line", "Text SHOUT to 85258"),
    ],
    "australia": [
        EmergencyResource("australia", "Emergency services", "000"),
        EmergencyResource("australia", "Lifeline", "13 11 14", "24x7"),
        EmergencyResource("australia", "Beyond Blue", "1300 22 4636"),
    ],
    "new zealand": [
        EmergencyResource("new zealand", "Emergency services", "111"),
        EmergencyResource("new zealand", "Need to talk?", "Call or text 1737", "24x7"),
    ],
    "ireland": [
        EmergencyResource("ireland", "Emergency services", "112 or 999"),
        EmergencyResource("ireland", "Samaritans", "116 123", "Free, 24x7"),
        EmergencyResource("ireland", "Pieta House", "1800 247 247", "Text HELP to 51444"),
    ],
    "germany": [
        EmergencyResource("germany", "Emergency services", "112"),
        EmergencyResource("germany", "Telefonseelsorge", "0800 111 0 111 or 0800 111 0 222", "Free, 24x7"),
    ],
    "netherlands": [
        EmergencyResource("netherlands", "Emergency services", "112"),
        EmergencyResource("netherlands", "113 Zelfmoordpreventie", "113 or 0800 0113", "24x7"),
    ],
    "singapore": [
        EmergencyResource("singapore", "Emergency services", "995"),
        EmergencyResource("singapore", "Samaritans of Singapore", "1767", "24x7"),
        EmergencyResource("singapore", "IMH Mental Health Helpline", "6389 2222"),
    ],
    "united arab emirates": [
        EmergencyResource("united arab emirates", "Emergency services", "999 (police) / 998 (ambulance)"),
        EmergencyResource("united arab emirates", "Estijaba mental health support", "800 1717"),
    ],
    "france": [
        EmergencyResource("france", "Emergency services", "112"),
        EmergencyResource("france", "Numero national de prevention du suicide", "3114", "24x7"),
    ],
}

# Common spellings and short codes users actually type.
_ALIASES: Dict[str, str] = {
    "in": "india",
    "bharat": "india",
    "ca": "canada",
    "us": "united states",
    "usa": "united states",
    "u.s.": "united states",
    "u.s.a.": "united states",
    "america": "united states",
    "united states of america": "united states",
    "uk": "united kingdom",
    "u.k.": "united kingdom",
    "england": "united kingdom",
    "scotland": "united kingdom",
    "wales": "united kingdom",
    "northern ireland": "united kingdom",
    "great britain": "united kingdom",
    "britain": "united kingdom",
    "gb": "united kingdom",
    "au": "australia",
    "aus": "australia",
    "nz": "new zealand",
    "ie": "ireland",
    "eire": "ireland",
    "de": "germany",
    "deutschland": "germany",
    "nl": "netherlands",
    "holland": "netherlands",
    "sg": "singapore",
    "ae": "united arab emirates",
    "uae": "united arab emirates",
    "dubai": "united arab emirates",
    "abu dhabi": "united arab emirates",
    "fr": "france",
}

_GENERIC: List[EmergencyResource] = [
    EmergencyResource(
        "unknown",
        "Local emergency services",
        "Dial your local emergency number",
        "112 works across the EU and on most mobile networks worldwide; 911 in North America.",
    ),
    EmergencyResource(
        "unknown",
        "Befrienders Worldwide directory",
        "https://befrienders.org",
        "Find a crisis helpline in your country.",
    ),
    EmergencyResource(
        "india",
        "Tele-MANAS (India, if your family is there)",
        "14416",
        "Included because many NIYA users have family in India.",
    ),
]


def canonical_country(country: str) -> str:
    key = (country or "").strip().lower()
    if not key:
        return "unknown"
    key = _ALIASES.get(key, key)
    return key if key in _DIRECTORY else "unknown"


def resources_for(country: str) -> List[EmergencyResource]:
    """Never returns an empty list."""
    key = canonical_country(country)
    if key == "unknown":
        return list(_GENERIC)
    return list(_DIRECTORY[key])


def supported_countries() -> List[str]:
    return sorted(_DIRECTORY.keys())
