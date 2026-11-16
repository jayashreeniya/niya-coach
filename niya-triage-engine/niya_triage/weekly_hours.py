"""Weekly working hours, one window (or none) per weekday.

This is the Calendly-shaped schedule: each day of the week is either off, or
open between a start and an end in the counsellor's local time. It replaces the
old single pair of hours that applied to every weekday and silently skipped
weekends.

Stored as JSON so the schema stays portable across SQLite and TiDB:

    {"mon": [[9.0, 17.0]], "tue": [[9.0, 12.0], [14.0, 18.0]], "wed": [], ...}

An empty list means unavailable that day. Multiple [start, end] pairs on one
day cover a lunch break the way Calendly does. Hours are floats on a 24-hour
clock (9.5 is 09:30).
"""

from __future__ import annotations

import json
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple

DAY_KEYS = ("mon", "tue", "wed", "thu", "fri", "sat", "sun")
DAY_LABELS = {
    "mon": "Monday",
    "tue": "Tuesday",
    "wed": "Wednesday",
    "thu": "Thursday",
    "fri": "Friday",
    "sat": "Saturday",
    "sun": "Sunday",
}
# Python's date.weekday(): Monday=0 … Sunday=6
WEEKDAY_TO_KEY = {index: key for index, key in enumerate(DAY_KEYS)}

Interval = Tuple[float, float]
WeeklyHours = Dict[str, List[Interval]]


def default_weekdays(start: float = 9.0, end: float = 18.0) -> WeeklyHours:
    """Mon–Fri open, weekends off — what the old single-window model meant."""
    week: WeeklyHours = {key: [] for key in DAY_KEYS}
    for key in ("mon", "tue", "wed", "thu", "fri"):
        week[key] = [(float(start), float(end))]
    return week


def empty_week() -> WeeklyHours:
    return {key: [] for key in DAY_KEYS}


def intervals_for_weekday(weekly: WeeklyHours, weekday: int) -> List[Interval]:
    key = WEEKDAY_TO_KEY.get(weekday)
    if key is None:
        return []
    return list(weekly.get(key) or [])


def envelope(weekly: WeeklyHours) -> Interval:
    """Earliest start and latest end across the week.

    Kept so matching code that still reads a single `working_hours_local` pair
    has a sensible value after the schedule moved to per-day hours.
    """
    starts: List[float] = []
    ends: List[float] = []
    for intervals in weekly.values():
        for start, end in intervals:
            starts.append(start)
            ends.append(end)
    if not starts:
        return (9.0, 18.0)
    return (min(starts), max(ends))


def has_any_hours(weekly: WeeklyHours) -> bool:
    return any(weekly.get(key) for key in DAY_KEYS)


def validate_interval(start: float, end: float) -> Optional[str]:
    if not (0 <= start < end <= 24):
        return "Each day has to start before it ends, between 0 and 24."
    if end - start < 1:
        return "Leave at least an hour on a day you are available, or nobody can book you."
    return None


def validate_weekly(weekly: WeeklyHours) -> Optional[str]:
    if not has_any_hours(weekly):
        return "Mark at least one day as available, or nobody can book you."
    for key in DAY_KEYS:
        for start, end in weekly.get(key) or []:
            problem = validate_interval(start, end)
            if problem:
                return f"{DAY_LABELS[key]}: {problem}"
            # Overlapping windows on the same day are confusing and waste slots.
        intervals = sorted(weekly.get(key) or [])
        for index in range(1, len(intervals)):
            prev_end = intervals[index - 1][1]
            next_start = intervals[index][0]
            if next_start < prev_end:
                return f"{DAY_LABELS[key]}: those time windows overlap."
    return None


def dumps(weekly: WeeklyHours) -> str:
    payload = {
        key: [[float(start), float(end)] for start, end in (weekly.get(key) or [])]
        for key in DAY_KEYS
    }
    return json.dumps(payload, separators=(",", ":"))


def loads(raw: Any, fallback_start: float = 9.0, fallback_end: float = 18.0) -> WeeklyHours:
    """Parse stored JSON, or synthesise Mon–Fri from the old start/end pair.

    An empty or missing value must not mean "available never" - that would
    silently take every existing counsellor offline the moment the column
    appears. Falling back to the previous weekday window preserves bookings.
    """
    if raw is None or (isinstance(raw, str) and not raw.strip()):
        return default_weekdays(fallback_start, fallback_end)

    if isinstance(raw, dict):
        data = raw
    else:
        try:
            data = json.loads(raw)
        except (TypeError, ValueError, json.JSONDecodeError):
            return default_weekdays(fallback_start, fallback_end)

    if not isinstance(data, dict):
        return default_weekdays(fallback_start, fallback_end)

    week = empty_week()
    for key in DAY_KEYS:
        value = data.get(key, data.get(key[:3]))  # tolerate "monday"
        week[key] = _parse_intervals(value)

    if not has_any_hours(week):
        # Explicit all-empty JSON is rare and usually means a bad save; prefer
        # the legacy window over locking the counsellor out of the calendar.
        return default_weekdays(fallback_start, fallback_end)
    return week


def _parse_intervals(value: Any) -> List[Interval]:
    if not value:
        return []
    if isinstance(value, (list, tuple)) and value and isinstance(value[0], (int, float)):
        # Bare [start, end] for one window.
        if len(value) >= 2:
            return [(float(value[0]), float(value[1]))]
        return []

    intervals: List[Interval] = []
    for item in value:
        if isinstance(item, dict):
            try:
                start = float(item["start"])
                end = float(item["end"])
            except (KeyError, TypeError, ValueError):
                continue
        elif isinstance(item, (list, tuple)) and len(item) >= 2:
            try:
                start = float(item[0])
                end = float(item[1])
            except (TypeError, ValueError):
                continue
        else:
            continue
        if 0 <= start < end <= 24:
            intervals.append((start, end))
    return intervals


def from_form(form: Dict[str, Any], max_windows: int = 2) -> WeeklyHours:
    """Build a week from HTML form fields.

    Expected names per day key `d`:
      - `{d}_on` present → day is available
      - `{d}_start_0`, `{d}_end_0` (and optionally `_1`) → windows
    """
    week = empty_week()
    for key in DAY_KEYS:
        if not form.get(f"{key}_on"):
            continue
        intervals: List[Interval] = []
        for index in range(max_windows):
            start_raw = form.get(f"{key}_start_{index}", "")
            end_raw = form.get(f"{key}_end_{index}", "")
            if start_raw in ("", None) and end_raw in ("", None):
                continue
            try:
                start = float(start_raw)
                end = float(end_raw)
            except (TypeError, ValueError):
                continue
            intervals.append((start, end))
        week[key] = intervals
    return week


def form_values(weekly: WeeklyHours, max_windows: int = 2) -> Dict[str, Any]:
    """Flat dict suitable for re-rendering the schedule form."""
    values: Dict[str, Any] = {}
    for key in DAY_KEYS:
        intervals = list(weekly.get(key) or [])
        values[f"{key}_on"] = bool(intervals)
        for index in range(max_windows):
            if index < len(intervals):
                start, end = intervals[index]
                values[f"{key}_start_{index}"] = f"{start:g}"
                values[f"{key}_end_{index}"] = f"{end:g}"
            else:
                values[f"{key}_start_{index}"] = ""
                values[f"{key}_end_{index}"] = ""
    return values


def days_for_template(weekly: WeeklyHours, max_windows: int = 2) -> List[Dict[str, Any]]:
    """Rows for the Jinja schedule table."""
    values = form_values(weekly, max_windows=max_windows)
    rows = []
    for key in DAY_KEYS:
        windows = []
        for index in range(max_windows):
            windows.append(
                {
                    "index": index,
                    "start": values[f"{key}_start_{index}"],
                    "end": values[f"{key}_end_{index}"],
                }
            )
        rows.append(
            {
                "key": key,
                "label": DAY_LABELS[key],
                "on": values[f"{key}_on"],
                "windows": windows,
            }
        )
    return rows
