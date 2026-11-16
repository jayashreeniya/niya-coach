"""Smallest possible proof that the engine works.

    python scripts/demo.py

No dependencies, no API key, no arguments. Runs three cases through the full
pipeline and prints what came back:

  1. the worked example from the project brief   -> routed normally
  2. an idiom that looks alarming but is not     -> must NOT flag
  3. a genuine risk disclosure                   -> must flag and stop

Exists because the equivalent `python -c "..."` one-liner is painful to quote
correctly in PowerShell, and this is the first thing anyone runs.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from niya_triage import IntakeRequest, triage  # noqa: E402

CASES = [
    (
        "1. The brief's worked example",
        IntakeRequest(
            text=(
                "I moved to Canada six months ago. I have stopped attending classes, "
                "I am scared to tell my parents, and I cannot sleep before exams."
            ),
            country="canada",
            timezone="America/Toronto",
            user_type="student",
            preferred_languages=["english", "hindi"],
        ),
        "expect: academic_avoidance, high urgency, no risk flags",
    ),
    (
        "2. Figurative language (must not flag)",
        IntakeRequest(
            text="This deadline is killing me and I am dead tired. My laptop battery died too.",
            country="united kingdom",
            timezone="Europe/London",
            user_type="student",
        ),
        "expect: risk_flags empty, NOT grief, moderate urgency, low confidence",
    ),
    (
        "3. Genuine risk disclosure (must flag and stop)",
        IntakeRequest(
            text="Everyone would be better off without me. I have not told anyone.",
            country="canada",
            timezone="America/Toronto",
            user_type="student",
        ),
        "expect: immediate_safety_risk, critical, emergency numbers shown, no auto-booking",
    ),
]


def main() -> int:
    for title, request, expectation in CASES:
        print("=" * 72)
        print(title)
        print(f"  {expectation}")
        print("=" * 72)
        print(f"Input: {request.text}\n")

        result = triage(request, log=False)

        print(json.dumps(result.to_api_payload(), indent=2))
        print(f"\nUrgency        : {result.urgency.value}")
        print(f"Themes         : {', '.join(result.themes) or '(none)'}")
        print(f"Next action    : {result.suggested_next_action}")

        if result.shortlist:
            print("Shortlist      :")
            for match in result.shortlist:
                print(f"  - {match.display_name} ({match.score:.3f})")
        else:
            print("Shortlist      : (none - routed to a coordinator)")

        if result.emergency_guidance:
            print("Emergency info :")
            for resource in result.emergency_guidance:
                print(f"  - {resource.label}: {resource.contact}")

        print(f"Processed in   : {result.processing_ms:.1f} ms")
        print()

    print("If all three behaved as described above, the engine is working.")
    print("Next: `python -m pytest -v` for the full suite.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
