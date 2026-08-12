"""Slot availability, in UTC.

The single design decision here is that **every slot is stored and compared as a
timezone-aware UTC datetime**, and converted to a wall-clock time only at the
moment it is displayed.

That is deliberately different from NIYA's current production model, which
stores `availabilities.timeslots` as IST wall-clock strings like `"09:00 AM"`
with no timezone column anywhere in the schema, and hardcodes
`TIME_ZONE='Asia/Kolkata'` in the booking controller. For a domestic product
that is merely fragile. For NIYA Abroad it is a defect: a student in Toronto
picks "9:00" and is silently booked into 09:00 India time, which is 23:30 the
previous evening for them.

Storing UTC and rendering per-viewer means the counsellor sees their morning and
the student sees their evening, and they are the same moment.

Slots are generated deterministically from each counsellor's `working_hours_local`
and `timezone`, so the same roster always produces the same calendar without
needing an availability table. A seeded hash marks some slots already taken, so
the prototype looks like a real diary rather than a wall of free time.
"""

from __future__ import annotations

import hashlib
from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
from typing import Dict, List, Optional, Sequence

from . import config, tz
from .counsellors import Counsellor

#: Sessions are 60 minutes, matching the existing web app's fixed duration.
SESSION_MINUTES = 60
#: Slots start on the hour and half hour.
SLOT_STEP_MINUTES = 30
#: How far ahead the calendar runs.
BOOKING_HORIZON_DAYS = 14
#: A slot must be at least this far away to be bookable. The production app uses
#: 24 hours; that is far too slow for a high-urgency triage result, so urgency
#: shortens it (see `minimum_notice_hours`).
DEFAULT_NOTICE_HOURS = 12.0

_URGENCY_NOTICE_HOURS = {
    "critical": 0.5,
    "high": 2.0,
    "moderate": 12.0,
    "low": 24.0,
}


def minimum_notice_hours(urgency: str) -> float:
    """How soon a session may be booked, given the triage urgency.

    NIYA's production rule is a flat 24 hours for everyone. That is the wrong
    shape for triage output: telling someone at high urgency that the earliest
    appointment is tomorrow is the bottleneck this engine exists to remove.
    """
    return _URGENCY_NOTICE_HOURS.get((urgency or "").lower(), DEFAULT_NOTICE_HOURS)


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def fixed_offset(timezone_name: Optional[str]):
    """A tzinfo for a named zone.

    Named `fixed_offset` historically; it now returns a DST-aware `ZoneInfo`
    where the zone database has the zone, and only falls back to a fixed offset
    otherwise. Kept under the old name because callers outside this module use
    it.
    """
    return tz.resolve(timezone_name)


def to_zone(moment: datetime, timezone_name: Optional[str]) -> datetime:
    """Render a UTC instant as wall-clock time in the given zone.

    Because the conversion happens against the instant, a session in July shows
    British Summer Time and one in January shows GMT - both correct, which a
    single stored offset cannot manage.
    """
    if moment.tzinfo is None:
        moment = moment.replace(tzinfo=timezone.utc)
    return moment.astimezone(tz.resolve(timezone_name))


@dataclass(frozen=True)
class Slot:
    """One bookable hour, identified by its UTC start."""

    counsellor_id: str
    start_utc: datetime
    end_utc: datetime

    @property
    def id(self) -> str:
        stamp = self.start_utc.strftime("%Y%m%dT%H%M")
        return f"{self.counsellor_id}:{stamp}"

    def start_in(self, timezone_name: Optional[str]) -> datetime:
        return to_zone(self.start_utc, timezone_name)

    def end_in(self, timezone_name: Optional[str]) -> datetime:
        return to_zone(self.end_utc, timezone_name)

    def label(self, timezone_name: Optional[str]) -> str:
        start = self.start_in(timezone_name)
        end = self.end_in(timezone_name)
        return f"{start:%H:%M}-{end:%H:%M}"

    def to_dict(self, viewer_timezone: Optional[str] = None) -> Dict[str, object]:
        payload: Dict[str, object] = {
            "slot_id": self.id,
            "counsellor_id": self.counsellor_id,
            "start_utc": self.start_utc.isoformat(),
            "end_utc": self.end_utc.isoformat(),
        }
        if viewer_timezone:
            payload["viewer_timezone"] = viewer_timezone
            payload["start_local"] = self.start_in(viewer_timezone).isoformat()
            payload["end_local"] = self.end_in(viewer_timezone).isoformat()
            payload["label_local"] = self.label(viewer_timezone)
        return payload


def parse_slot_id(slot_id: str) -> Optional[Slot]:
    """Rebuild a Slot from its id, without consulting the roster."""
    try:
        counsellor_id, stamp = slot_id.split(":", 1)
        start = datetime.strptime(stamp, "%Y%m%dT%H%M").replace(tzinfo=timezone.utc)
    except (ValueError, AttributeError):
        return None
    return Slot(
        counsellor_id=counsellor_id,
        start_utc=start,
        end_utc=start + timedelta(minutes=SESSION_MINUTES),
    )


# --------------------------------------------------------------------------
# Generation
# --------------------------------------------------------------------------


def _pseudo_booked(counsellor_id: str, start_utc: datetime) -> bool:
    """Deterministically mark roughly a third of slots as already taken.

    Seeded off the counsellor and the slot time so the calendar is stable across
    runs and across processes - a demo that reshuffles every refresh is not
    demonstrating anything.
    """
    seed = f"{counsellor_id}|{start_utc.isoformat()}|{config.ENGINE_VERSION}"
    digest = hashlib.sha256(seed.encode("utf-8")).digest()
    return digest[0] % 3 == 0


def generate_slots(
    counsellor: Counsellor,
    days: int = BOOKING_HORIZON_DAYS,
    now: Optional[datetime] = None,
    include_taken: bool = False,
) -> List[Slot]:
    """Every slot inside this counsellor's working hours for the next `days`.

    Working hours are local to the counsellor, so a 9-18 day in Asia/Kolkata and
    a 9-18 day in America/Toronto produce completely different UTC instants.
    That is the whole point.
    """
    reference = now or utc_now()
    counsellor_tz = fixed_offset(counsellor.timezone)
    local_now = reference.astimezone(counsellor_tz)

    start_hour, end_hour = counsellor.working_hours_local
    slots: List[Slot] = []

    for day_offset in range(days + 1):
        local_day = (local_now + timedelta(days=day_offset)).date()
        # Counsellors do not work weekends in this prototype.
        if local_day.weekday() >= 5:
            continue

        minutes = int(start_hour * 60)
        closing = int(end_hour * 60)
        while minutes + SESSION_MINUTES <= closing:
            local_start = datetime(
                local_day.year,
                local_day.month,
                local_day.day,
                minutes // 60,
                minutes % 60,
                tzinfo=counsellor_tz,
            )
            start_utc = local_start.astimezone(timezone.utc)
            minutes += SLOT_STEP_MINUTES

            if start_utc <= reference:
                continue
            if not include_taken and _pseudo_booked(counsellor.id, start_utc):
                continue

            slots.append(
                Slot(
                    counsellor_id=counsellor.id,
                    start_utc=start_utc,
                    end_utc=start_utc + timedelta(minutes=SESSION_MINUTES),
                )
            )

    return slots


def available_slots(
    counsellor: Counsellor,
    taken_slot_ids: Sequence[str] = (),
    urgency: str = "moderate",
    on_date_local: Optional[date] = None,
    viewer_timezone: Optional[str] = None,
    now: Optional[datetime] = None,
) -> List[Slot]:
    """Bookable slots, honouring notice period, real bookings and the viewer's day.

    `on_date_local` is a calendar date **in the viewer's timezone**, not the
    counsellor's. Someone in Toronto asking for "Tuesday" means their Tuesday.
    """
    reference = now or utc_now()
    earliest = reference + timedelta(hours=minimum_notice_hours(urgency))
    taken = set(taken_slot_ids)

    results = []
    for slot in generate_slots(counsellor, now=reference):
        if slot.start_utc < earliest:
            continue
        if slot.id in taken:
            continue
        if on_date_local is not None:
            if slot.start_in(viewer_timezone or "UTC").date() != on_date_local:
                continue
        results.append(slot)
    return results


def available_days(
    counsellor: Counsellor,
    taken_slot_ids: Sequence[str] = (),
    urgency: str = "moderate",
    viewer_timezone: Optional[str] = None,
    now: Optional[datetime] = None,
) -> List[date]:
    """Distinct dates with at least one free slot, in the viewer's timezone.

    NIYA's production app has no endpoint for this at all - the date picker
    offers every future date and the user discovers emptiness by clicking. This
    exists so the calendar can grey out days that cannot be booked.
    """
    days = {
        slot.start_in(viewer_timezone or "UTC").date()
        for slot in available_slots(
            counsellor,
            taken_slot_ids=taken_slot_ids,
            urgency=urgency,
            viewer_timezone=viewer_timezone,
            now=now,
        )
    }
    return sorted(days)


def earliest_slot(
    counsellor: Counsellor,
    taken_slot_ids: Sequence[str] = (),
    urgency: str = "moderate",
    now: Optional[datetime] = None,
) -> Optional[Slot]:
    slots = available_slots(
        counsellor, taken_slot_ids=taken_slot_ids, urgency=urgency, now=now
    )
    return slots[0] if slots else None
