"""Timezone resolution.

Uses `zoneinfo`, so offsets are resolved **against the actual instant** and
daylight saving is handled. This started out as a fixed-offset table, which was
defensible while timezone was only 10% of a match score - but the same code now
decides what time a booking is displayed at, and a one-hour error there means
someone misses the session they waited a week for.

The table below survives as a fallback for when the IANA database is missing.
`tzdata` is in requirements.txt so that should not happen; the fallback exists
because silently being an hour out is worse than being approximately right and
saying so.

Zone names are matched case-insensitively, since the app stores them lowercased.
"""

from __future__ import annotations

import re
from datetime import datetime, timedelta, timezone
from typing import Optional

try:
    from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

    _ZONEINFO_AVAILABLE = True
except ImportError:  # pragma: no cover - Python < 3.9
    _ZONEINFO_AVAILABLE = False

    class ZoneInfoNotFoundError(Exception):
        pass

# Standard-time offsets for the regions NIYA's users and coaches occupy. Used
# only when zoneinfo cannot resolve a name, and to enumerate the zones offered
# in the UI.
_ZONE_OFFSETS = {
    "utc": 0.0,
    "gmt": 0.0,
    "asia/kolkata": 5.5,
    "asia/calcutta": 5.5,
    "ist": 5.5,
    "asia/dubai": 4.0,
    "asia/singapore": 8.0,
    "asia/hong_kong": 8.0,
    "asia/tokyo": 9.0,
    "europe/london": 0.0,
    "europe/dublin": 0.0,
    "europe/lisbon": 0.0,
    "europe/berlin": 1.0,
    "europe/amsterdam": 1.0,
    "europe/paris": 1.0,
    "europe/madrid": 1.0,
    "europe/rome": 1.0,
    "europe/stockholm": 1.0,
    "europe/warsaw": 1.0,
    "america/st_johns": -3.5,
    "america/halifax": -4.0,
    "america/toronto": -5.0,
    "america/montreal": -5.0,
    "america/new_york": -5.0,
    "america/chicago": -6.0,
    "america/winnipeg": -6.0,
    "america/edmonton": -7.0,
    "america/denver": -7.0,
    "america/vancouver": -8.0,
    "america/los_angeles": -8.0,
    "australia/perth": 8.0,
    "australia/adelaide": 9.5,
    "australia/brisbane": 10.0,
    "australia/sydney": 10.0,
    "australia/melbourne": 10.0,
    "pacific/auckland": 12.0,
}

_OFFSET_PATTERN = re.compile(r"^(?:utc|gmt)?\s*([+-])\s*(\d{1,2})(?::?(\d{2}))?$")

#: Names IANA does not spell the way this project's keys do.
_CANONICAL = {
    "ist": "Asia/Kolkata",
    "gmt": "UTC",
    "utc": "UTC",
    "asia/calcutta": "Asia/Kolkata",
}

_zone_cache: dict = {}


def _normalise(name: str) -> str:
    return str(name).strip().lower().replace(" ", "").replace("-", "_")


def _iana_name(key: str) -> str:
    """'america/new_york' -> 'America/New_York'.

    ZoneInfo is case-sensitive, and on Windows a lowercase name sends its
    importlib-based lookup down a path that raises RecursionError rather than a
    clean miss. Producing the canonical spelling avoids the question.
    """
    return "/".join(
        "_".join(word.capitalize() for word in part.split("_"))
        for part in key.split("/")
    )


def resolve(timezone_name: Optional[str]):
    """A tzinfo for a zone name, DST-aware where possible.

    Returns a `ZoneInfo` when the IANA database has the zone, otherwise a fixed
    offset from the table - correct in winter, an hour out in summer for zones
    that observe daylight saving. `describes_dst` reports which one you got.
    """
    if not timezone_name:
        return timezone.utc

    key = _normalise(timezone_name)
    if key in _zone_cache:
        return _zone_cache[key]

    resolved = None
    if _ZONEINFO_AVAILABLE:
        for candidate in (_CANONICAL.get(key), _iana_name(key)):
            if not candidate:
                continue
            try:
                resolved = ZoneInfo(candidate)
                break
            except Exception:  # noqa: BLE001
                # Any failure here means "use the fallback". A timezone lookup
                # must never be the reason a booking page 500s.
                continue

    if resolved is None:
        resolved = timezone(timedelta(hours=_table_offset(timezone_name)))

    _zone_cache[key] = resolved
    return resolved


def describes_dst(timezone_name: Optional[str]) -> bool:
    """True when this zone resolved to a real IANA zone rather than a fallback."""
    return _ZONEINFO_AVAILABLE and not isinstance(resolve(timezone_name), timezone)


def _table_offset(timezone_name: Optional[str], default: float = 0.0) -> float:
    """Offset from the static table or a 'UTC+5:30' style string. No DST."""
    if not timezone_name:
        return default

    key = _normalise(timezone_name)
    if key in _ZONE_OFFSETS:
        return _ZONE_OFFSETS[key]

    match = _OFFSET_PATTERN.match(str(timezone_name).strip().lower().replace(" ", ""))
    if match:
        sign = 1.0 if match.group(1) == "+" else -1.0
        hours = float(match.group(2))
        minutes = float(match.group(3) or 0) / 60.0
        return sign * (hours + minutes)

    return default


def offset_hours(
    timezone_name: Optional[str], default: float = 0.0, at: Optional[datetime] = None
) -> float:
    """Hours from UTC for a zone, at a given instant.

    `at` matters: Europe/London is 0 in January and +1 in July. Callers that omit
    it get the offset as of now, which is right for "how far apart are these two
    people today" and wrong for a session six months out - those callers pass the
    session time.
    """
    if not timezone_name:
        return default

    zone = resolve(timezone_name)
    moment = at or datetime.now(timezone.utc)
    if moment.tzinfo is None:
        moment = moment.replace(tzinfo=timezone.utc)

    utc_offset = moment.astimezone(zone).utcoffset()
    if utc_offset is not None:
        return utc_offset.total_seconds() / 3600.0

    return _table_offset(timezone_name, default)


def hours_apart(
    zone_a: Optional[str], zone_b: Optional[str], at: Optional[datetime] = None
) -> float:
    """Absolute difference in hours, wrapped so 23h apart reads as 1h apart."""
    delta = abs(offset_hours(zone_a, at=at) - offset_hours(zone_b, at=at))
    return min(delta, 24.0 - delta)


def known_zones() -> list:
    return sorted(_ZONE_OFFSETS.keys())
