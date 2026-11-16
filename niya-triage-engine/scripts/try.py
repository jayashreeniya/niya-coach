"""Throw your own text at the engine and see why it decided what it decided.

    python scripts\try.py "I stopped going to lectures and I cannot tell my dad"
    python scripts\try.py                       # interactive, one case per line

Options (all optional, order does not matter):

    --country india          affects which emergency numbers appear
    --user student           student | professional | unknown
    --lang english,hindi     preferred languages, comma separated
    --age 16                 declared age; under 18 forces safeguarding
    --timing immediate       immediate | flexible
    --quiet                  just the decision, no reasoning

The reasoning is the point. Anyone can read a label; what matters when you are
judging whether to trust this is *which phrase* produced it, so this prints the
matched signals, the runners-up, the safety rules that fired, and why each
counsellor was ranked or excluded.

No dependencies. Nothing is written to the audit log.
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from niya_triage import IntakeRequest, triage  # noqa: E402
from niya_triage.taxonomy import CATEGORIES  # noqa: E402

BAR = "-" * 72


def _c(text: str, code: str) -> str:
    """Colour, but only when attached to a real terminal."""
    if not sys.stdout.isatty():
        return text
    return f"\033[{code}m{text}\033[0m"


URGENCY_COLOUR = {"low": "32", "moderate": "33", "high": "35", "critical": "1;31"}


def show(request: IntakeRequest, quiet: bool = False) -> None:
    result = triage(request, log=False)

    urgency = result.urgency.value
    print()
    print(BAR)
    print(f"{_c(urgency.upper(), URGENCY_COLOUR.get(urgency, '0'))}  {result.primary_category}")
    print(BAR)

    category = CATEGORIES.get(result.primary_category)
    if category is not None:
        print(f"  {category.label}")
    if result.secondary_categories:
        print(f"  also: {', '.join(result.secondary_categories)}")

    print(f"\n  confidence   {result.confidence_score:.2f}")
    print(f"  pathway      {result.recommended_pathway}")
    print(f"  themes       {', '.join(result.themes) or '(none)'}")

    if result.risk_flags:
        print(f"  {_c('RISK FLAGS', '1;31')}   {', '.join(result.risk_flags)}")

    review = "YES" if result.human_review_required else "no"
    reasons = ", ".join(reason.value for reason in result.review_reasons)
    print(f"  human review {review}{f' ({reasons})' if reasons else ''}")

    print(f"\n  next action:\n    {result.suggested_next_action}")

    if result.emergency_guidance:
        print(f"\n  {_c('emergency information shown to the user:', '1;31')}")
        for resource in result.emergency_guidance:
            print(f"    {resource.label}: {resource.contact}")

    if quiet:
        print()
        return

    # ---- why -------------------------------------------------------------
    safety = result.safety
    if safety is not None and safety.triggered:
        print("\n  why the safety layer fired:")
        for hit in safety.flags:
            print(f"    {hit.flag.value} [{hit.severity.value}] via {', '.join(hit.rule_ids)}")
            print(f"      matched: {', '.join(hit.matched_spans)}")
            for note in hit.softened_by:
                print(f"      softened: {note}")

    classification = result.classification
    if classification is not None:
        if classification.rationale:
            print("\n  why this category and urgency:")
            for line in classification.rationale:
                print(f"    - {line}")

        contenders = [item for item in classification.ranked_scores if item.score > 0][:4]
        if contenders:
            print("\n  category scores:")
            for item in contenders:
                signals = ", ".join(item.matched_signals[:5]) or "-"
                print(f"    {item.score:5.1f}  {item.category_id:<28} {signals}")
                if item.penalties:
                    print(f"           penalised by: {', '.join(item.penalties)}")

    if result.shortlist:
        print("\n  shortlist:")
        for match in result.shortlist:
            slot = (
                f"{match.earliest_slot_hours:.0f}h"
                if match.earliest_slot_hours is not None
                else "?"
            )
            print(f"    {match.score:.3f}  {match.display_name}  (first slot {slot})")
            breakdown = match.breakdown
            print(
                f"           fit {breakdown.problem_fit:.2f} "
                f"avail {breakdown.availability:.2f} "
                f"lang {breakdown.language_fit:.2f} "
                f"culture {breakdown.cultural_fit:.2f} "
                f"tz {breakdown.timezone_fit:.2f} "
                f"outcome {breakdown.historical_outcome:.2f}"
            )
            if match.capabilities_missing:
                print(f"           missing: {', '.join(match.capabilities_missing)}")
    else:
        print("\n  shortlist: (none - routed to a coordinator)")

    if result.rejected:
        print(f"\n  excluded {len(result.rejected)} counsellor(s) by hard gate:")
        shown = {}
        for entry in result.rejected:
            shown.setdefault(entry.reason, []).append(entry.display_name)
        for reason, names in shown.items():
            listed = ", ".join(names[:3])
            more = f" (+{len(names) - 3} more)" if len(names) > 3 else ""
            print(f"    {reason}: {listed}{more}")

    print(f"\n  {result.processing_ms:.1f} ms")
    print()


def parse_args(argv: list) -> tuple:
    opts = {
        "country": "india",
        "user": "unknown",
        "lang": "english",
        "age": None,
        "timing": "flexible",
        "quiet": False,
    }
    words = []
    index = 0
    while index < len(argv):
        token = argv[index]
        if token == "--quiet":
            opts["quiet"] = True
        elif token.startswith("--") and index + 1 < len(argv):
            key = token[2:]
            if key in opts:
                opts[key] = argv[index + 1]
                index += 1
            else:
                print(f"unknown option {token}", file=sys.stderr)
                raise SystemExit(2)
        else:
            words.append(token)
        index += 1
    return " ".join(words), opts


def build(text: str, opts: dict) -> IntakeRequest:
    age = opts["age"]
    return IntakeRequest(
        text=text,
        country=str(opts["country"]).lower(),
        user_type=str(opts["user"]).lower(),
        preferred_languages=[part.strip() for part in str(opts["lang"]).split(",")],
        desired_timing=str(opts["timing"]),
        age=int(age) if age not in (None, "") else None,
    )


def main(argv: list) -> int:
    text, opts = parse_args(argv)

    if text:
        show(build(text, opts), quiet=opts["quiet"])
        return 0

    print("Type an intake message and press Enter. Blank line or Ctrl-C to quit.")
    print(
        f"Context: country={opts['country']}, user={opts['user']}, "
        f"languages={opts['lang']}"
        + (f", age={opts['age']}" if opts["age"] else "")
    )
    while True:
        try:
            line = input("\n> ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            return 0
        if not line:
            return 0
        show(build(line, opts), quiet=opts["quiet"])


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
