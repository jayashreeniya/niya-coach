"""Optional LLM enhancer.

The engine never depends on this module succeeding. If there is no API key, no
network, no `openai` package, or the model returns something malformed, every
function here returns ``None`` and the rule classifier's answer stands.

Two hard constraints on what the model is allowed to do:

* It may only choose from the fixed taxonomy. Free-text categories are rejected.
* It may *raise* concern but never lower it. ``risk_suspected`` can add a human
  review; nothing the model says can clear a flag the rule layer raised. The
  brief is explicit that safety must not rest on a model's confidence.
"""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

from . import config
from .taxonomy import CATEGORIES, SELECTABLE_CATEGORY_IDS
from .types import IntakeRequest, Urgency

logger = logging.getLogger(__name__)

_VALID_URGENCY = {item.value for item in Urgency}


@dataclass
class LLMOpinion:
    primary_category: str
    secondary_categories: List[str] = field(default_factory=list)
    urgency: Optional[Urgency] = None
    confidence: float = 0.0
    themes: List[str] = field(default_factory=list)
    risk_suspected: bool = False
    risk_note: str = ""
    rationale: str = ""
    raw: Dict[str, Any] = field(default_factory=dict)


def _taxonomy_block() -> str:
    lines = []
    for cid in SELECTABLE_CATEGORY_IDS:
        category = CATEGORIES[cid]
        lines.append(f"- {cid}: {category.description}")
    return "\n".join(lines)


SYSTEM_PROMPT = """You are a triage assistant for NIYA, a service providing culturally matched counselling to Indians studying or working abroad.

Your job is to read a person's description of their situation and label it. You are NOT a therapist. You do NOT give advice, reassurance, coping strategies, diagnoses, or any clinical opinion. You only produce structured labels that help a human coordinator route the case.

Choose exactly one primary_category from this list:
{taxonomy}

urgency must be one of: low, moderate, high.
- low: distressing but stable; can wait a week
- moderate: affecting daily functioning; should be seen within a few days
- high: functioning is breaking down or a hard deadline is imminent; within 24-48 hours

Never output "critical". Emergency classification is handled by a separate rule layer, not by you.

Set risk_suspected to true if you notice ANY hint of self-harm, suicide, abuse, violence, psychosis, medical emergency, substance emergency, or threat to another person - even a faint one, even if it is indirect, hedged, or mentioned about someone else. Over-flagging is expected and acceptable. Under-flagging is not.

Respond with a single JSON object and nothing else:
{{
  "primary_category": "<category id>",
  "secondary_categories": ["<category id>", ...],
  "urgency": "low|moderate|high",
  "confidence": 0.0-1.0,
  "themes": ["short phrase", ...],
  "risk_suspected": true|false,
  "risk_note": "<empty string if none>",
  "rationale": "<one sentence, referring only to what the person wrote>"
}}"""


def build_user_prompt(request: IntakeRequest) -> str:
    parts = [
        f"Country: {request.country}",
        f"Timezone: {request.timezone}",
        f"User type: {request.user_type.value}",
        f"Preferred languages: {', '.join(request.preferred_languages)}",
        f"Desired timing: {request.desired_timing}",
    ]
    if request.structured_answers:
        parts.append(f"Structured answers: {json.dumps(request.structured_answers)}")
    parts.append("")
    parts.append("What the person wrote:")
    parts.append('"""')
    parts.append(request.text.strip())
    parts.append('"""')
    return "\n".join(parts)


def is_available() -> bool:
    if not config.llm_should_run():
        return False
    try:
        import openai  # noqa: F401
    except Exception:
        return False
    return True


def _coerce(payload: Dict[str, Any]) -> Optional[LLMOpinion]:
    primary = str(payload.get("primary_category", "")).strip()
    if primary not in CATEGORIES or primary not in SELECTABLE_CATEGORY_IDS:
        logger.warning("LLM returned unknown category %r; discarding opinion", primary)
        return None

    secondaries = [
        str(item).strip()
        for item in payload.get("secondary_categories", []) or []
        if str(item).strip() in SELECTABLE_CATEGORY_IDS and str(item).strip() != primary
    ]

    urgency: Optional[Urgency] = None
    raw_urgency = str(payload.get("urgency", "")).strip().lower()
    if raw_urgency in _VALID_URGENCY and raw_urgency != Urgency.CRITICAL.value:
        urgency = Urgency(raw_urgency)

    try:
        confidence = float(payload.get("confidence", 0.0))
    except (TypeError, ValueError):
        confidence = 0.0
    confidence = max(0.0, min(1.0, confidence))

    themes = [str(item).strip() for item in payload.get("themes", []) or [] if str(item).strip()]

    return LLMOpinion(
        primary_category=primary,
        secondary_categories=secondaries[:3],
        urgency=urgency,
        confidence=confidence,
        themes=themes[:6],
        risk_suspected=bool(payload.get("risk_suspected", False)),
        risk_note=str(payload.get("risk_note", "") or ""),
        rationale=str(payload.get("rationale", "") or ""),
        raw=payload,
    )


def get_opinion(request: IntakeRequest) -> Optional[LLMOpinion]:
    """Ask the model for a second opinion. Returns None on any problem."""
    if not is_available():
        return None

    try:
        from openai import OpenAI

        client = OpenAI(timeout=config.LLM_TIMEOUT_SECONDS)
        response = client.chat.completions.create(
            model=config.LLM_MODEL,
            temperature=0,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT.format(taxonomy=_taxonomy_block())},
                {"role": "user", "content": build_user_prompt(request)},
            ],
        )
        content = response.choices[0].message.content or ""
        payload = json.loads(content)
        if not isinstance(payload, dict):
            return None
        return _coerce(payload)
    except Exception as exc:  # deliberately broad: the engine must survive anything here
        logger.warning("LLM opinion unavailable (%s: %s)", type(exc).__name__, exc)
        return None
