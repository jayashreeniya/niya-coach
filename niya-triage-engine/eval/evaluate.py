"""Evaluation harness and error analysis.

    python eval/evaluate.py                     # both datasets, writes a markdown report
    python eval/evaluate.py --dataset data/hard_cases.jsonl
    python eval/evaluate.py --no-llm            # force rules-only

Reports the metrics the brief asks for, and reports them SEPARATELY for the
hand-written hard set and the template-generated set, because mixing them would
produce a single flattering number that means nothing. See the header of
`scripts/build_data.py` for why.

Safety recall is the headline number. Precision on safety is reported too, but
the brief is explicit that recall dominates: a false positive costs a
coordinator two minutes, a false negative can cost a life.
"""

from __future__ import annotations

import argparse
import json
import statistics
import sys
import time
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any, Dict, List, Optional

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from niya_triage import IntakeRequest, triage  # noqa: E402
from niya_triage.config import DATASET_FILE, HARD_SET_FILE  # noqa: E402
from niya_triage.counsellors import CounsellorRepository  # noqa: E402
from niya_triage.types import Urgency  # noqa: E402


def load_jsonl(path: Path) -> List[Dict[str, Any]]:
    rows: List[Dict[str, Any]] = []
    if not path.exists():
        return rows
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if line:
                rows.append(json.loads(line))
    return rows


def run_dataset(
    rows: List[Dict[str, Any]],
    repository: CounsellorRepository,
    use_llm: bool,
) -> Dict[str, Any]:
    if not rows:
        return {}

    correct = 0
    top2_correct = 0
    urgency_exact = 0
    urgency_distance: List[int] = []
    latencies: List[float] = []
    review_flagged = 0
    shortlist_found = 0
    confusions: Counter = Counter()
    per_category_stats: Dict[str, Dict[str, int]] = defaultdict(
        lambda: {"support": 0, "tp": 0, "predicted": 0}
    )
    errors: List[Dict[str, Any]] = []

    safety_expected = 0
    safety_detected = 0
    safety_predicted = 0
    safety_false_positive = 0
    missed_safety: List[Dict[str, Any]] = []
    flag_recall: Dict[str, Dict[str, int]] = defaultdict(lambda: {"expected": 0, "found": 0})

    confidence_correct: List[float] = []
    confidence_wrong: List[float] = []

    for row in rows:
        request = IntakeRequest(
            text=row["text"],
            country=row.get("country", "unknown"),
            timezone=row.get("timezone", "UTC"),
            user_type=row.get("user_type", "unknown"),
            preferred_languages=row.get("preferred_languages", ["english"]),
            desired_timing=row.get("desired_timing", "flexible"),
            age=row.get("age"),
        )

        started = time.perf_counter()
        result = triage(request, repository=repository, use_llm=use_llm, log=False)
        latencies.append((time.perf_counter() - started) * 1000.0)

        expected = row["expected_primary"]
        predicted = result.primary_category

        per_category_stats[expected]["support"] += 1
        per_category_stats[predicted]["predicted"] += 1

        if predicted == expected:
            correct += 1
            per_category_stats[expected]["tp"] += 1
            confidence_correct.append(result.confidence_score)
        else:
            confusions[(expected, predicted)] += 1
            confidence_wrong.append(result.confidence_score)
            errors.append(
                {
                    "id": row.get("id"),
                    "text": row["text"][:180],
                    "expected": expected,
                    "predicted": predicted,
                    "secondaries": result.secondary_categories,
                    "confidence": round(result.confidence_score, 3),
                    "urgency": result.urgency.value,
                    "difficulty": row.get("difficulty", "n/a"),
                    "notes": row.get("notes", ""),
                    "recovered_in_secondary": expected in result.secondary_categories,
                }
            )

        if predicted == expected or expected in result.secondary_categories:
            top2_correct += 1

        expected_urgency = row.get("expected_urgency")
        if expected_urgency:
            actual = result.urgency
            want = Urgency(expected_urgency)
            if actual == want:
                urgency_exact += 1
            urgency_distance.append(abs(actual.rank - want.rank))

        if result.human_review_required:
            review_flagged += 1
        if result.shortlist:
            shortlist_found += 1

        expected_flags = row.get("expected_risk_flags") or []
        has_expected_risk = bool(expected_flags)
        has_predicted_risk = bool(result.risk_flags)

        if has_expected_risk:
            safety_expected += 1
            if has_predicted_risk:
                safety_detected += 1
            else:
                missed_safety.append(
                    {
                        "id": row.get("id"),
                        "text": row["text"][:200],
                        "expected_flags": expected_flags,
                        "predicted_category": predicted,
                        "urgency": result.urgency.value,
                        "human_review_required": result.human_review_required,
                        "notes": row.get("notes", ""),
                    }
                )
            for flag in expected_flags:
                flag_recall[flag]["expected"] += 1
                if flag in result.risk_flags:
                    flag_recall[flag]["found"] += 1

        if has_predicted_risk:
            safety_predicted += 1
            if not has_expected_risk:
                safety_false_positive += 1

    total = len(rows)
    sorted_latencies = sorted(latencies)

    def percentile(values: List[float], pct: float) -> float:
        if not values:
            return 0.0
        index = min(len(values) - 1, int(round((pct / 100.0) * (len(values) - 1))))
        return values[index]

    per_category_report = {}
    for category, stats in sorted(per_category_stats.items()):
        support = stats["support"]
        predicted_count = stats["predicted"]
        tp = stats["tp"]
        recall = tp / support if support else None
        precision = tp / predicted_count if predicted_count else None
        per_category_report[category] = {
            "support": support,
            "predicted": predicted_count,
            "recall": recall,
            "precision": precision,
        }

    return {
        "total": total,
        "accuracy": correct / total if total else 0.0,
        "accuracy_top2": top2_correct / total if total else 0.0,
        "urgency_exact": urgency_exact / len(urgency_distance) if urgency_distance else None,
        "urgency_mean_distance": statistics.mean(urgency_distance) if urgency_distance else None,
        "safety_expected": safety_expected,
        "safety_detected": safety_detected,
        "safety_recall": (safety_detected / safety_expected) if safety_expected else None,
        "safety_precision": (
            (safety_detected / safety_predicted) if safety_predicted else None
        ),
        "safety_false_positives": safety_false_positive,
        "safety_false_positive_rate": (
            safety_false_positive / (total - safety_expected)
            if (total - safety_expected)
            else None
        ),
        "flag_recall": {
            flag: {
                "expected": stats["expected"],
                "found": stats["found"],
                "recall": stats["found"] / stats["expected"] if stats["expected"] else None,
            }
            for flag, stats in sorted(flag_recall.items())
        },
        "missed_safety": missed_safety,
        "review_rate": review_flagged / total if total else 0.0,
        "shortlist_rate": shortlist_found / total if total else 0.0,
        "latency_mean_ms": statistics.mean(latencies) if latencies else 0.0,
        "latency_p50_ms": percentile(sorted_latencies, 50),
        "latency_p95_ms": percentile(sorted_latencies, 95),
        "latency_max_ms": max(latencies) if latencies else 0.0,
        "mean_confidence_correct": (
            statistics.mean(confidence_correct) if confidence_correct else None
        ),
        "mean_confidence_wrong": statistics.mean(confidence_wrong) if confidence_wrong else None,
        "per_category": per_category_report,
        "top_confusions": confusions.most_common(12),
        "errors": errors,
    }


def _pct(value: Optional[float]) -> str:
    return "n/a" if value is None else f"{value * 100:.1f}%"


def render_report(sections: Dict[str, Dict[str, Any]], use_llm: bool) -> str:
    lines: List[str] = []
    lines.append("# NIYA triage engine - evaluation report")
    lines.append("")
    # `use_llm` only says the LLM was *requested*. Whether it actually ran is a
    # different question - with no API key, get_opinion returns None and every
    # number below comes from the rules alone. Reporting the request rather than
    # the reality made the first run claim "rules + LLM" for a rules-only pass.
    from niya_triage import llm as _llm

    if use_llm and _llm.is_available():
        mode = "rules + LLM"
    elif use_llm:
        mode = "rules only (LLM requested but unavailable - no API key or client)"
    else:
        mode = "rules only"
    lines.append(f"Classifier mode: **{mode}**")
    lines.append("")
    lines.append(
        "The two datasets are reported separately and must not be averaged together. "
        "The template set shares vocabulary with the classifier's lexicon and so "
        "overstates accuracy; the hand-written set is the honest measure."
    )
    lines.append("")

    lines.append("## Headline")
    lines.append("")
    lines.append("| Metric | Target | " + " | ".join(sections.keys()) + " |")
    lines.append("| --- | --- | " + " | ".join("---" for _ in sections) + " |")

    def row(label: str, target: str, key: str, formatter=_pct) -> str:
        cells = [formatter(section.get(key)) for section in sections.values()]
        return f"| {label} | {target} | " + " | ".join(cells) + " |"

    lines.append(row("Primary-category accuracy", "80%+", "accuracy"))
    lines.append(row("Accuracy incl. secondary", "-", "accuracy_top2"))
    lines.append(row("Unsafe case recall", "95%+", "safety_recall"))
    lines.append(row("Safety precision", "no target", "safety_precision"))
    lines.append(row("Safety false-positive rate", "tolerated", "safety_false_positive_rate"))
    lines.append(row("Urgency exact match", "-", "urgency_exact"))
    lines.append(row("Human-review rate", "-", "review_rate"))
    lines.append(row("Shortlist produced", "-", "shortlist_rate"))
    lines.append(
        "| Intake-to-match p95 | under 2 min | "
        + " | ".join(f"{section.get('latency_p95_ms', 0):.1f} ms" for section in sections.values())
        + " |"
    )
    lines.append("")

    for name, section in sections.items():
        if not section:
            continue
        lines.append(f"## {name}")
        lines.append("")
        lines.append(f"- Scenarios: {section['total']}")
        lines.append(
            f"- Latency: mean {section['latency_mean_ms']:.1f} ms, "
            f"p50 {section['latency_p50_ms']:.1f} ms, "
            f"p95 {section['latency_p95_ms']:.1f} ms, "
            f"max {section['latency_max_ms']:.1f} ms"
        )
        if section.get("mean_confidence_correct") is not None:
            lines.append(
                f"- Mean confidence when correct: {section['mean_confidence_correct']:.2f}; "
                f"when wrong: "
                + (
                    f"{section['mean_confidence_wrong']:.2f}"
                    if section.get("mean_confidence_wrong") is not None
                    else "n/a"
                )
                + " (the gap between these is what makes the confidence score useful for routing to review)"
            )
        lines.append("")

        lines.append("### Safety")
        lines.append("")
        lines.append(
            f"- Cases with an expected risk flag: {section['safety_expected']}; "
            f"detected: {section['safety_detected']}"
        )
        lines.append(f"- Recall: **{_pct(section['safety_recall'])}** (target 95%+)")
        lines.append(
            f"- False positives on non-risk cases: {section['safety_false_positives']} "
            f"({_pct(section['safety_false_positive_rate'])})"
        )
        if section["flag_recall"]:
            lines.append("")
            lines.append("| Risk flag | Expected | Found | Recall |")
            lines.append("| --- | ---: | ---: | ---: |")
            for flag, stats in section["flag_recall"].items():
                lines.append(
                    f"| {flag} | {stats['expected']} | {stats['found']} | {_pct(stats['recall'])} |"
                )
        if section["missed_safety"]:
            lines.append("")
            lines.append("**MISSED SAFETY CASES - every one of these is a defect:**")
            lines.append("")
            for miss in section["missed_safety"]:
                lines.append(
                    f"- `{miss['id']}` expected {miss['expected_flags']}, got "
                    f"`{miss['predicted_category']}` at {miss['urgency']} urgency "
                    f"(review={miss['human_review_required']}) - {miss['text'][:120]}"
                )
        else:
            lines.append("")
            lines.append("No missed safety cases in this set.")
        lines.append("")

        lines.append("### Per-category")
        lines.append("")
        lines.append("| Category | Support | Predicted | Recall | Precision |")
        lines.append("| --- | ---: | ---: | ---: | ---: |")
        for category, stats in section["per_category"].items():
            lines.append(
                f"| {category} | {stats['support']} | {stats['predicted']} | "
                f"{_pct(stats['recall'])} | {_pct(stats['precision'])} |"
            )
        lines.append("")

        if section["top_confusions"]:
            lines.append("### Most common confusions")
            lines.append("")
            lines.append("| Expected | Predicted | Count |")
            lines.append("| --- | --- | ---: |")
            for (expected, predicted), count in section["top_confusions"]:
                lines.append(f"| {expected} | {predicted} | {count} |")
            lines.append("")

        if section["errors"]:
            lines.append("### Error analysis")
            lines.append("")
            recovered = sum(1 for err in section["errors"] if err["recovered_in_secondary"])
            lines.append(
                f"{len(section['errors'])} misclassifications, of which {recovered} had the "
                f"correct label in the secondary categories - meaning a coordinator would "
                f"still have seen the right option on screen."
            )
            lines.append("")
            for err in section["errors"][:30]:
                lines.append(
                    f"- `{err['id']}` ({err['difficulty']}): expected **{err['expected']}**, "
                    f"got **{err['predicted']}** at confidence {err['confidence']}"
                    + (" [recovered in secondary]" if err["recovered_in_secondary"] else "")
                )
                lines.append(f"  - text: {err['text']}")
                if err["notes"]:
                    lines.append(f"  - why it is hard: {err['notes']}")
            lines.append("")

    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dataset", type=Path, default=None, help="evaluate a single file")
    parser.add_argument("--no-llm", action="store_true", help="force rules-only")
    parser.add_argument("--out", type=Path, default=Path("eval/report.md"))
    parser.add_argument("--json-out", type=Path, default=Path("eval/results.json"))
    args = parser.parse_args()

    use_llm = not args.no_llm
    repository = CounsellorRepository.from_file()

    sections: Dict[str, Dict[str, Any]] = {}
    if args.dataset:
        sections[args.dataset.name] = run_dataset(load_jsonl(args.dataset), repository, use_llm)
    else:
        hard_rows = load_jsonl(HARD_SET_FILE)
        if hard_rows:
            sections["Hand-written hard set"] = run_dataset(hard_rows, repository, use_llm)
        template_rows = load_jsonl(DATASET_FILE)
        if template_rows:
            sections["Template set"] = run_dataset(template_rows, repository, use_llm)
        else:
            print(
                f"No template dataset at {DATASET_FILE}. "
                "Run `python scripts/build_data.py` to create it."
            )

    if not sections:
        print("Nothing to evaluate.")
        return 1

    report = render_report(sections, use_llm)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(report, encoding="utf-8")
    args.json_out.write_text(json.dumps(sections, indent=2, default=str), encoding="utf-8")

    print(report)
    print(f"\nWritten to {args.out} and {args.json_out}")

    hard = sections.get("Hand-written hard set")
    if hard and hard.get("safety_recall") is not None and hard["safety_recall"] < 0.95:
        print("\nFAIL: unsafe-case recall is below the 95% target on the hard set.")
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
