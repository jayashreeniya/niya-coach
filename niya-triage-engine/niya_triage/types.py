"""Core value types for the NIYA triage and matching engine.

Standard library only. Every dataclass here is JSON-serialisable via `to_plain`,
which is what the API layer and the audit log both rely on.
"""

from __future__ import annotations

from dataclasses import dataclass, field, is_dataclass, asdict
from enum import Enum
from typing import Any, Dict, List, Optional


# --------------------------------------------------------------------------
# Enumerations
# --------------------------------------------------------------------------

_URGENCY_ORDER = {"low": 0, "moderate": 1, "high": 2, "critical": 3}


class Urgency(str, Enum):
    """How fast a human needs to be involved.

    CRITICAL is reserved for cases where the safety layer fired; it is not a
    label the classifier is allowed to assign on its own.
    """

    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    CRITICAL = "critical"

    @property
    def rank(self) -> int:
        return _URGENCY_ORDER[self.value]

    @classmethod
    def highest(cls, *values: "Urgency | str") -> "Urgency":
        best = cls.LOW
        for value in values:
            if value is None:
                continue
            candidate = cls(value)
            if candidate.rank > best.rank:
                best = candidate
        return best


class UserType(str, Enum):
    STUDENT = "student"
    PROFESSIONAL = "professional"
    COUPLE = "couple"
    UNKNOWN = "unknown"


class RiskFlag(str, Enum):
    """The six escalation classes the brief forbids the system to handle alone,
    plus safeguarding for under-18 disclosures."""

    SELF_HARM_SUICIDE = "self_harm_suicide"
    ABUSE_OR_DANGER = "abuse_or_immediate_danger"
    PSYCHOSIS_DISORIENTATION = "psychosis_or_severe_disorientation"
    MEDICAL_EMERGENCY = "medical_emergency"
    SUBSTANCE_EMERGENCY = "substance_related_emergency"
    HARM_TO_OTHERS = "threat_to_others"
    MINOR_SAFEGUARDING = "minor_safeguarding"


class RiskSeverity(str, Enum):
    """Severity within a risk flag.

    ACTIVE   -> stated in the present tense about themselves; emergency routing.
    ELEVATED -> clearly present but without stated intent or immediacy.
    CONTEXT  -> historical, hypothetical, negated, or about a third party.

    CONTEXT never clears a flag. It downgrades routing while still forcing
    human review, because recall matters more than precision here.
    """

    ACTIVE = "active"
    ELEVATED = "elevated"
    CONTEXT = "contextual"


class ReviewReason(str, Enum):
    SAFETY_FLAG = "safety_flag"
    LOW_CONFIDENCE = "low_confidence"
    CLOSE_CALL = "ambiguous_between_categories"
    CLINICAL_BOUNDARY = "possible_clinical_need"
    NO_ELIGIBLE_COUNSELLOR = "no_eligible_counsellor"
    HIGH_URGENCY = "high_urgency"
    SHORT_INTAKE = "insufficient_detail"


class ClassificationMethod(str, Enum):
    RULES = "rules_only"
    LLM = "llm_only"
    HYBRID = "rules_plus_llm"


# --------------------------------------------------------------------------
# Intake
# --------------------------------------------------------------------------


@dataclass
class IntakeRequest:
    """What the user gives us. Only `text` is genuinely required."""

    text: str
    country: str = "unknown"
    timezone: str = "UTC"
    user_type: UserType = UserType.UNKNOWN
    preferred_languages: List[str] = field(default_factory=lambda: ["english"])
    desired_timing: str = "flexible"
    structured_answers: Dict[str, Any] = field(default_factory=dict)
    age: Optional[int] = None
    locale_hint: Optional[str] = None

    def __post_init__(self) -> None:
        self.user_type = UserType(self.user_type)
        self.preferred_languages = [
            str(lang).strip().lower() for lang in self.preferred_languages if str(lang).strip()
        ] or ["english"]
        self.country = (self.country or "unknown").strip().lower()


# --------------------------------------------------------------------------
# Safety
# --------------------------------------------------------------------------


@dataclass
class RiskFlagHit:
    flag: RiskFlag
    severity: RiskSeverity
    rule_ids: List[str] = field(default_factory=list)
    matched_spans: List[str] = field(default_factory=list)
    softened_by: List[str] = field(default_factory=list)


@dataclass
class EmergencyResource:
    country: str
    label: str
    contact: str
    note: str = ""


@dataclass
class SafetyAssessment:
    triggered: bool = False
    flags: List[RiskFlagHit] = field(default_factory=list)
    urgency_floor: Urgency = Urgency.LOW
    requires_human_review: bool = False
    block_automated_pathway: bool = False
    emergency_resources: List[EmergencyResource] = field(default_factory=list)
    rationale: List[str] = field(default_factory=list)

    @property
    def flag_values(self) -> List[str]:
        return [hit.flag.value for hit in self.flags]


# --------------------------------------------------------------------------
# Classification
# --------------------------------------------------------------------------


@dataclass
class CategoryScore:
    category_id: str
    score: float
    matched_signals: List[str] = field(default_factory=list)
    penalties: List[str] = field(default_factory=list)
    priors_applied: List[str] = field(default_factory=list)


@dataclass
class Classification:
    primary_category: str
    secondary_categories: List[str] = field(default_factory=list)
    urgency: Urgency = Urgency.MODERATE
    confidence_score: float = 0.0
    method: ClassificationMethod = ClassificationMethod.RULES
    ranked_scores: List[CategoryScore] = field(default_factory=list)
    themes: List[str] = field(default_factory=list)
    rationale: List[str] = field(default_factory=list)
    llm_agreed: Optional[bool] = None


# --------------------------------------------------------------------------
# Matching
# --------------------------------------------------------------------------


@dataclass
class MatchBreakdown:
    problem_fit: float = 0.0
    availability: float = 0.0
    language_fit: float = 0.0
    cultural_fit: float = 0.0
    timezone_fit: float = 0.0
    historical_outcome: float = 0.0

    def weighted_total(self, weights: Dict[str, float]) -> float:
        return (
            weights["problem_fit"] * self.problem_fit
            + weights["availability"] * self.availability
            + weights["language_fit"] * self.language_fit
            + weights["cultural_fit"] * self.cultural_fit
            + weights["timezone_fit"] * self.timezone_fit
            + weights["historical_outcome"] * self.historical_outcome
        )


@dataclass
class CounsellorMatch:
    counsellor_id: str
    display_name: str
    score: float
    breakdown: MatchBreakdown
    rationale: List[str] = field(default_factory=list)
    earliest_slot_hours: Optional[float] = None
    capabilities_met: List[str] = field(default_factory=list)
    capabilities_missing: List[str] = field(default_factory=list)


@dataclass
class RejectedCounsellor:
    counsellor_id: str
    display_name: str
    reason: str


# --------------------------------------------------------------------------
# Final result
# --------------------------------------------------------------------------


@dataclass
class PathwayPlan:
    pathway_id: str
    label: str
    description: str
    first_session_within_hours: int
    session_plan: str
    modality: str
    next_action: str


@dataclass
class TriageResult:
    case_id: str
    primary_category: str
    secondary_categories: List[str]
    urgency: Urgency
    confidence_score: float
    recommended_pathway: str
    human_review_required: bool
    review_reasons: List[ReviewReason]
    risk_flags: List[str]
    preferred_counsellor_attributes: List[str]
    themes: List[str]
    pathway_plan: Optional[PathwayPlan] = None
    suggested_next_action: str = ""
    shortlist: List[CounsellorMatch] = field(default_factory=list)
    rejected: List[RejectedCounsellor] = field(default_factory=list)
    safety: Optional[SafetyAssessment] = None
    classification: Optional[Classification] = None
    emergency_guidance: List[EmergencyResource] = field(default_factory=list)
    processing_ms: float = 0.0
    engine_version: str = ""

    def to_api_payload(self) -> Dict[str, Any]:
        """The contract described in the project brief (Phase 2 output block)."""
        return {
            "primary_category": self.primary_category,
            "secondary_categories": list(self.secondary_categories),
            "urgency": self.urgency.value,
            "confidence_score": round(self.confidence_score, 2),
            "recommended_pathway": self.recommended_pathway,
            "human_review_required": self.human_review_required,
            "risk_flags": list(self.risk_flags),
            "preferred_counsellor_attributes": list(self.preferred_counsellor_attributes),
        }


# --------------------------------------------------------------------------
# Serialisation
# --------------------------------------------------------------------------


def to_plain(value: Any) -> Any:
    """Recursively convert dataclasses/enums into JSON-safe primitives."""
    if isinstance(value, Enum):
        return value.value
    if is_dataclass(value) and not isinstance(value, type):
        return {key: to_plain(val) for key, val in asdict(value).items()}
    if isinstance(value, dict):
        return {str(key): to_plain(val) for key, val in value.items()}
    if isinstance(value, (list, tuple, set)):
        return [to_plain(item) for item in value]
    if isinstance(value, float):
        return round(value, 4)
    return value
