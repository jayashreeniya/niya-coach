"""Timezone correctness.

These exist because the failure they guard against is invisible: a fixed-offset
table is right in winter and an hour wrong in summer, so it passes every test
written in January and quietly makes people miss sessions in July.
"""

from __future__ import annotations

from datetime import datetime, timezone

import pytest

from niya_triage import tz
from niya_triage.availability import to_zone

JANUARY = datetime(2026, 1, 15, 12, 0, tzinfo=timezone.utc)
JULY = datetime(2026, 7, 15, 12, 0, tzinfo=timezone.utc)


def test_the_zone_database_is_actually_available():
    """If this fails, everything below silently degrades to fixed offsets."""
    assert tz.describes_dst("europe/london")
    assert tz.describes_dst("america/new_york")


@pytest.mark.parametrize(
    "zone_name,winter,summer",
    [
        ("europe/london", "12:00", "13:00"),     # GMT then BST
        ("america/new_york", "07:00", "08:00"),  # EST then EDT
        ("australia/sydney", "23:00", "22:00"),  # southern hemisphere, reversed
        ("asia/calcutta", "17:30", "17:30"),     # India does not observe DST
    ],
)
def test_the_same_utc_instant_renders_with_daylight_saving_applied(
    zone_name, winter, summer
):
    assert to_zone(JANUARY, zone_name).strftime("%H:%M") == winter
    assert to_zone(JULY, zone_name).strftime("%H:%M") == summer


def test_the_gap_between_two_zones_changes_across_the_year():
    """London and Kolkata are 5.5 hours apart in winter and 4.5 in summer."""
    assert tz.hours_apart("europe/london", "asia/calcutta", at=JANUARY) == 5.5
    assert tz.hours_apart("europe/london", "asia/calcutta", at=JULY) == 4.5


def test_a_session_booked_across_a_dst_change_keeps_its_local_time():
    """A 09:00 London session stays 09:00 London either side of the change.

    Stored as UTC, the underlying instant differs by an hour - which is correct,
    and is exactly what a stored wall-clock time gets wrong.
    """
    before = datetime(2026, 3, 20, 9, 0, tzinfo=tz.resolve("europe/london"))
    after = datetime(2026, 4, 10, 9, 0, tzinfo=tz.resolve("europe/london"))

    assert before.astimezone(timezone.utc).hour == 9   # GMT
    assert after.astimezone(timezone.utc).hour == 8    # BST
    assert to_zone(before, "europe/london").strftime("%H:%M") == "09:00"
    assert to_zone(after, "europe/london").strftime("%H:%M") == "09:00"


def test_every_zone_offered_in_the_ui_resolves():
    """A zone in the dropdown that does not resolve would display wrong times."""
    unresolved = [zone for zone in tz.known_zones() if not tz.describes_dst(zone)]
    assert unresolved == []


def test_an_unknown_zone_falls_back_instead_of_raising():
    """A bad zone name must never be the reason a booking page fails."""
    assert tz.offset_hours("mars/olympus") == 0.0
    assert not tz.describes_dst("mars/olympus")
    assert to_zone(JULY, "mars/olympus").strftime("%H:%M") == "12:00"


def test_plain_offset_strings_still_work():
    assert tz.offset_hours("UTC+5:30") == 5.5
    assert tz.offset_hours("utc-8") == -8.0
