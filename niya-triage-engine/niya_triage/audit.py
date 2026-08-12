"""Append-only decision log.

The brief requires that safety decisions are logged for audit. A plain log file
satisfies the letter of that but not the spirit: the point of a safety audit is
to answer "what did the system decide, when, and has that record been altered
since". So each entry carries the hash of the previous entry, making the file
tamper-evident - you cannot quietly rewrite a past decision without breaking
the chain from that point onward, which `verify()` will report.

Text is redacted before it is written. The log stores a hash of the original so
a specific case can still be located, without retaining the disclosure itself.
"""

from __future__ import annotations

import hashlib
import json
import os
import threading
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterator, List, Optional, Tuple

from . import config
from .redact import redact_for_audit
from .types import TriageResult, to_plain

_GENESIS = "0" * 64
_LOCK = threading.Lock()


def _canonical(payload: Dict[str, Any]) -> str:
    return json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def _hash_record(payload: Dict[str, Any]) -> str:
    return hashlib.sha256(_canonical(payload).encode("utf-8")).hexdigest()


def text_fingerprint(text: str) -> str:
    """Stable identifier for an intake without storing its content."""
    return hashlib.sha256((text or "").strip().lower().encode("utf-8")).hexdigest()[:16]


class AuditLog:
    def __init__(self, path: Optional[Path] = None) -> None:
        self.path = Path(path) if path else config.AUDIT_LOG
        self.path.parent.mkdir(parents=True, exist_ok=True)

    # -- writing --------------------------------------------------------

    def _last_hash(self) -> Tuple[str, int]:
        if not self.path.exists():
            return _GENESIS, 0
        last_hash, count = _GENESIS, 0
        with self.path.open("r", encoding="utf-8") as handle:
            for line in handle:
                line = line.strip()
                if not line:
                    continue
                try:
                    record = json.loads(line)
                except json.JSONDecodeError:
                    continue
                last_hash = record.get("hash", last_hash)
                count += 1
        return last_hash, count

    def append(self, event_type: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        with _LOCK:
            prev_hash, count = self._last_hash()
            record = {
                "seq": count + 1,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "event_type": event_type,
                "engine_version": config.ENGINE_VERSION,
                "payload": to_plain(payload),
                "prev_hash": prev_hash,
            }
            record["hash"] = _hash_record(record)
            with self.path.open("a", encoding="utf-8") as handle:
                handle.write(json.dumps(record, ensure_ascii=False) + "\n")
            return record

    # -- convenience ----------------------------------------------------

    def log_triage(self, result: TriageResult, raw_text: str, country: str) -> Dict[str, Any]:
        return self.append(
            "triage_decision",
            {
                "case_id": result.case_id,
                "text_fingerprint": text_fingerprint(raw_text),
                "redacted_text": redact_for_audit(raw_text),
                "country": country,
                "primary_category": result.primary_category,
                "secondary_categories": result.secondary_categories,
                "urgency": result.urgency,
                "confidence_score": result.confidence_score,
                "recommended_pathway": result.recommended_pathway,
                "human_review_required": result.human_review_required,
                "review_reasons": result.review_reasons,
                "risk_flags": result.risk_flags,
                "safety_rule_ids": sorted(
                    {
                        rule_id
                        for hit in (result.safety.flags if result.safety else [])
                        for rule_id in hit.rule_ids
                    }
                ),
                "shortlist": [
                    {"counsellor_id": match.counsellor_id, "score": round(match.score, 4)}
                    for match in result.shortlist
                ],
                "processing_ms": result.processing_ms,
            },
        )

    def log_review(
        self,
        case_id: str,
        reviewer: str,
        action: str,
        original_category: str,
        final_category: str,
        chosen_counsellor: Optional[str] = None,
        note: str = "",
    ) -> Dict[str, Any]:
        return self.append(
            "human_review",
            {
                "case_id": case_id,
                "reviewer": reviewer,
                "action": action,
                "original_category": original_category,
                "final_category": final_category,
                "category_overridden": original_category != final_category,
                "chosen_counsellor": chosen_counsellor,
                "note": redact_for_audit(note),
            },
        )

    # -- reading --------------------------------------------------------

    def read_all(self) -> List[Dict[str, Any]]:
        return list(self.iter_records())

    def iter_records(self) -> Iterator[Dict[str, Any]]:
        if not self.path.exists():
            return
        with self.path.open("r", encoding="utf-8") as handle:
            for line in handle:
                line = line.strip()
                if not line:
                    continue
                try:
                    yield json.loads(line)
                except json.JSONDecodeError:
                    continue

    def verify(self) -> Tuple[bool, str]:
        """Recompute the chain. Returns (ok, human-readable message)."""
        prev_hash = _GENESIS
        count = 0
        for record in self.iter_records():
            count += 1
            stored_hash = record.get("hash")
            if record.get("prev_hash") != prev_hash:
                return False, f"Chain broken at entry {count}: prev_hash does not match."
            recomputed = _hash_record({k: v for k, v in record.items() if k != "hash"})
            if recomputed != stored_hash:
                return False, f"Entry {count} has been modified since it was written."
            prev_hash = stored_hash or _GENESIS
        return True, f"Verified {count} entries; chain intact."


_DEFAULT_LOG: Optional[AuditLog] = None


def default_log() -> AuditLog:
    global _DEFAULT_LOG
    if _DEFAULT_LOG is None:
        _DEFAULT_LOG = AuditLog()
    return _DEFAULT_LOG
