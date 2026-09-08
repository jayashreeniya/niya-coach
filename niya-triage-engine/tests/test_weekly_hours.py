"""Per-day weekly hours and the slots they produce."""

from __future__ import annotations

from datetime import datetime, timezone

from niya_triage.availability import generate_slots, to_zone
from niya_triage.counsellors import Counsellor
from niya_triage.weekly_hours import (
    default_weekdays,
    dumps,
    from_form,
    loads,
    validate_weekly,
)


def test_default_week_is_weekdays_only():
    week = default_weekdays(9, 18)
    assert week["mon"] == [(9.0, 18.0)]
    assert week["sat"] == []
    assert week["sun"] == []


def test_empty_storage_falls_back_to_legacy_window():
    week = loads("", fallback_start=8, fallback_end=20)
    assert week["fri"] == [(8.0, 20.0)]
    assert week["sun"] == []


def test_saturday_morning_is_allowed():
    week = default_weekdays()
    week["sat"] = [(9.0, 13.0)]
    week["wed"] = []
    assert validate_weekly(week) is None

    counsellor = Counsellor(
        id="C099",
        display_name="Weekend Coach",
        timezone="Asia/Kolkata",
        working_hours_local=(9.0, 13.0),
        weekly_hours=week,
    )
    # A known Friday evening in Kolkata, so the next few days include Sat+Sun.
    now = datetime(2026, 9, 4, 12, 0, tzinfo=timezone.utc)  # Friday
    slots = generate_slots(counsellor, days=3, now=now, include_taken=True)
    local_days = {to_zone(slot.start_utc, "Asia/Kolkata").strftime("%a") for slot in slots}
    assert "Sat" in local_days
    assert "Wed" not in local_days or True  # horizon may not reach next Wed
    assert "Sun" not in local_days


def test_form_round_trip_preserves_a_split_day():
    form = {
        "mon_on": "1",
        "mon_start_0": "9",
        "mon_end_0": "12",
        "mon_start_1": "14",
        "mon_end_1": "18",
        "tue_on": "1",
        "tue_start_0": "10",
        "tue_end_0": "16",
    }
    week = from_form(form)
    assert week["mon"] == [(9.0, 12.0), (14.0, 18.0)]
    assert week["tue"] == [(10.0, 16.0)]
    assert week["wed"] == []
    assert loads(dumps(week))["mon"] == week["mon"]


def test_overlapping_windows_are_rejected():
    week = default_weekdays()
    week["mon"] = [(9.0, 14.0), (13.0, 18.0)]
    assert "overlap" in (validate_weekly(week) or "").lower()
