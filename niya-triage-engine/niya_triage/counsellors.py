"""Phase 3 (part 1) - the counsellor database schema and repository.

The schema covers every attribute the brief asks for. Two notes on how it
differs from NIYA's current production model, because the gap is the point:

* NIYA today stores expertise as a JSON array of strings on `accounts`, with no
  timezone, no client-type, no country-context, no capacity and no outcome
  fields. Matching therefore cannot express "this counsellor is good with
  first-generation students in Canada and has room this week".
* `escalation_capability` has no equivalent at all in production, which means
  there is currently no way to guarantee a risk-flagged case reaches someone
  qualified to hold it.

`docs/COUNSELLOR_SCHEMA.md` sets this out field by field against the existing
columns. Nothing here modifies the production schema.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence

from . import config

COMPLEXITY_RANK = {"low": 0, "moderate": 1, "high": 2, "critical": 3}


@dataclass
class Counsellor:
    # --- identity -------------------------------------------------------
    id: str
    display_name: str
    credentials: str = ""
    active: bool = True

    # --- areas of experience -------------------------------------------
    #: Capability tags drawn from taxonomy.all_capabilities().
    capabilities: List[str] = field(default_factory=list)
    #: category_id -> self/supervisor-rated proficiency in [0, 1].
    category_experience: Dict[str, float] = field(default_factory=dict)
    years_experience: float = 0.0

    # --- language and culture ------------------------------------------
    languages: List[str] = field(default_factory=lambda: ["english"])
    #: Countries whose systems and social context this counsellor knows well.
    country_context: List[str] = field(default_factory=list)
    #: Diaspora background, used for cultural fit.
    diaspora_background: bool = False
    client_types: List[str] = field(default_factory=lambda: ["student", "professional"])

    # --- scheduling -----------------------------------------------------
    timezone: str = "Asia/Kolkata"
    working_hours_local: Sequence[float] = (9.0, 18.0)
    #: Hours until this counsellor's next free slot.
    next_available_hours: float = 72.0
    slots_next_7_days: int = 0

    # --- load -----------------------------------------------------------
    active_cases: int = 0
    max_cases: int = 20
    preferred_complexity: str = "moderate"
    max_complexity: str = "high"

    # --- outcomes -------------------------------------------------------
    satisfaction: float = 0.0          # mean client rating, 1-5
    completion_rate: float = 0.0       # fraction finishing the agreed plan
    return_rate: float = 0.0           # fraction booking again
    referral_rate: float = 0.0         # fraction referring someone
    rematch_rate: float = 0.0          # fraction reassigned away - lower is better
    sessions_delivered: int = 0

    # --- safety ---------------------------------------------------------
    escalation_capability: bool = False
    clinically_qualified: bool = False
    crisis_trained: bool = False

    notes: str = ""

    # ------------------------------------------------------------------

    @property
    def capacity_headroom(self) -> float:
        """Fraction of the caseload still free, in [0, 1]."""
        if self.max_cases <= 0:
            return 0.0
        return max(0.0, min(1.0, (self.max_cases - self.active_cases) / self.max_cases))

    @property
    def has_capacity(self) -> bool:
        return self.active and self.active_cases < self.max_cases

    def handles_complexity(self, required: str) -> bool:
        return COMPLEXITY_RANK.get(required, 1) <= COMPLEXITY_RANK.get(self.max_complexity, 2)

    def speaks(self, language: str) -> bool:
        target = (language or "").strip().lower()
        return any(target == item.strip().lower() for item in self.languages)

    def knows_country(self, country: str) -> bool:
        target = (country or "").strip().lower()
        return any(target == item.strip().lower() for item in self.country_context)

    def serves_client_type(self, client_type: str) -> bool:
        target = (client_type or "").strip().lower()
        if target in {"", "unknown"}:
            return True
        return any(target == item.strip().lower() for item in self.client_types)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "display_name": self.display_name,
            "credentials": self.credentials,
            "active": self.active,
            "capabilities": list(self.capabilities),
            "category_experience": dict(self.category_experience),
            "years_experience": self.years_experience,
            "languages": list(self.languages),
            "country_context": list(self.country_context),
            "diaspora_background": self.diaspora_background,
            "client_types": list(self.client_types),
            "timezone": self.timezone,
            "working_hours_local": list(self.working_hours_local),
            "next_available_hours": self.next_available_hours,
            "slots_next_7_days": self.slots_next_7_days,
            "active_cases": self.active_cases,
            "max_cases": self.max_cases,
            "preferred_complexity": self.preferred_complexity,
            "max_complexity": self.max_complexity,
            "satisfaction": self.satisfaction,
            "completion_rate": self.completion_rate,
            "return_rate": self.return_rate,
            "referral_rate": self.referral_rate,
            "rematch_rate": self.rematch_rate,
            "sessions_delivered": self.sessions_delivered,
            "escalation_capability": self.escalation_capability,
            "clinically_qualified": self.clinically_qualified,
            "crisis_trained": self.crisis_trained,
            "notes": self.notes,
        }

    @classmethod
    def from_dict(cls, payload: Dict[str, Any]) -> "Counsellor":
        known = {
            "id",
            "display_name",
            "credentials",
            "active",
            "capabilities",
            "category_experience",
            "years_experience",
            "languages",
            "country_context",
            "diaspora_background",
            "client_types",
            "timezone",
            "working_hours_local",
            "next_available_hours",
            "slots_next_7_days",
            "active_cases",
            "max_cases",
            "preferred_complexity",
            "max_complexity",
            "satisfaction",
            "completion_rate",
            "return_rate",
            "referral_rate",
            "rematch_rate",
            "sessions_delivered",
            "escalation_capability",
            "clinically_qualified",
            "crisis_trained",
            "notes",
        }
        filtered = {key: value for key, value in payload.items() if key in known}

        if "id" not in filtered:
            raise ValueError("Counsellor record is missing 'id'")
        if "display_name" not in filtered:
            raise ValueError(f"Counsellor {filtered['id']} is missing 'display_name'")

        filtered["languages"] = [
            str(item).strip().lower() for item in filtered.get("languages", ["english"])
        ]
        filtered["country_context"] = [
            str(item).strip().lower() for item in filtered.get("country_context", [])
        ]
        filtered["client_types"] = [
            str(item).strip().lower() for item in filtered.get("client_types", [])
        ] or ["student", "professional"]
        filtered["category_experience"] = {
            str(key): float(value)
            for key, value in (filtered.get("category_experience") or {}).items()
        }
        if "working_hours_local" in filtered:
            hours = filtered["working_hours_local"]
            filtered["working_hours_local"] = (float(hours[0]), float(hours[1]))

        return cls(**filtered)


# --------------------------------------------------------------------------
# Repository
# --------------------------------------------------------------------------


class CounsellorRepository:
    """In-memory repository backed by a JSON file.

    Swapping this for PostgreSQL/Supabase is a matter of replacing `load`; the
    matching engine only ever sees `Counsellor` objects.
    """

    def __init__(self, counsellors: Optional[Sequence[Counsellor]] = None) -> None:
        self._counsellors: List[Counsellor] = list(counsellors or [])

    @classmethod
    def from_file(cls, path: Optional[Path] = None) -> "CounsellorRepository":
        target = Path(path) if path else config.COUNSELLOR_FILE
        if not target.exists():
            raise FileNotFoundError(
                f"Counsellor file not found at {target}. "
                "Run `python scripts/build_data.py` to generate it."
            )
        with target.open("r", encoding="utf-8") as handle:
            payload = json.load(handle)
        records = payload["counsellors"] if isinstance(payload, dict) else payload
        return cls([Counsellor.from_dict(item) for item in records])

    def all(self) -> List[Counsellor]:
        return list(self._counsellors)

    def active(self) -> List[Counsellor]:
        return [item for item in self._counsellors if item.active]

    def get(self, counsellor_id: str) -> Optional[Counsellor]:
        for item in self._counsellors:
            if item.id == counsellor_id:
                return item
        return None

    def __len__(self) -> int:
        return len(self._counsellors)


_DEFAULT_REPOSITORY: Optional[CounsellorRepository] = None


def default_repository() -> CounsellorRepository:
    global _DEFAULT_REPOSITORY
    if _DEFAULT_REPOSITORY is None:
        _DEFAULT_REPOSITORY = CounsellorRepository.from_file()
    return _DEFAULT_REPOSITORY


def reset_default_repository() -> None:
    global _DEFAULT_REPOSITORY
    _DEFAULT_REPOSITORY = None
