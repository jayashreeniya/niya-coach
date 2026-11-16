"""Generate the synthetic scenario dataset (Phase 2 deliverable: test dataset).

    python scripts/build_data.py            # writes data/test_cases.jsonl
    python scripts/build_data.py --count 40 # 40 scenarios per category

READ THIS BEFORE QUOTING ANY ACCURACY NUMBER FROM THIS FILE
-----------------------------------------------------------
These scenarios are built from templates written by the same author as the
classifier's lexicon. They therefore share vocabulary with it, and the
classifier will score far better here than it deserves. That is a textbook
circularity problem and the number is close to meaningless on its own.

The dataset is still worth having, for three things it *can* honestly measure:

  * regression detection - if a change breaks a category, this catches it,
  * throughput and latency at volume,
  * class-balance and coverage of the counsellor roster.

Real accuracy is measured on `data/hard_cases.jsonl`, which is hand-written to
be confusable and adversarial, and which the evaluation harness reports
separately. The brief's requirement for counsellor-reviewed scenarios is not
satisfied by either file: both need review by NIYA counsellors before any
metric here is presented as a finding.

Output is deterministic for a given --seed.
"""

from __future__ import annotations

import argparse
import json
import random
import sys
from pathlib import Path
from typing import Dict, List, Tuple

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from niya_triage.config import DATASET_FILE  # noqa: E402

COUNTRIES: List[Tuple[str, str]] = [
    ("canada", "America/Toronto"),
    ("canada", "America/Vancouver"),
    ("united kingdom", "Europe/London"),
    ("united states", "America/New_York"),
    ("united states", "America/Chicago"),
    ("australia", "Australia/Sydney"),
    ("australia", "Australia/Melbourne"),
    ("germany", "Europe/Berlin"),
    ("ireland", "Europe/Dublin"),
    ("singapore", "Asia/Singapore"),
    ("united arab emirates", "Asia/Dubai"),
    ("new zealand", "Pacific/Auckland"),
    ("netherlands", "Europe/Amsterdam"),
]

LANGUAGES = [
    ["english"],
    ["english", "hindi"],
    ["english", "tamil"],
    ["english", "telugu"],
    ["english", "malayalam"],
    ["english", "punjabi"],
    ["english", "bengali"],
    ["english", "marathi"],
    ["english", "gujarati"],
    ["english", "urdu"],
]

TIMINGS = ["flexible", "this week", "asap", "immediate", "evenings only", "weekends"]

FILLERS: Dict[str, List[str]] = {
    "duration": ["two weeks", "a month", "three months", "six months", "nearly a year"],
    "period": ["a few weeks", "the last month", "this whole semester", "since I arrived"],
    "feeling": ["ashamed", "exhausted", "numb", "anxious", "guilty", "stuck", "embarrassed"],
    "relative": ["my parents", "my mother", "my father", "my family"],
    "subject": ["my coursework", "my dissertation", "my assignments", "my lab work", "my thesis"],
    "workthing": ["my deliverables", "my sprint tickets", "my client work", "my reports"],
}


def _t(*variants: str) -> List[str]:
    return list(variants)


TEMPLATES: Dict[str, List[str]] = {
    "academic_avoidance": _t(
        "I have stopped attending classes for {duration} and I cannot make myself go back. I feel {feeling} every time I think about it.",
        "I am behind on {subject} and I have missed the deadline twice. My attendance is now a problem with the university.",
        "I skipped lectures for {period} and now I am too far behind to catch up. I keep avoiding my professor.",
        "My grades have collapsed this semester. I am failing two modules and I have not told anyone.",
        "I cannot study anymore. I sit down with {subject} and nothing happens, and then the day is gone.",
        "I have been put on academic probation. My attendance is under fifty percent and I feel {feeling}.",
        "I have not submitted anything for {duration}. Every email from my supervisor makes it worse.",
        "Exams are coming and I have done no revision at all. I have been avoiding my coursework for {period}.",
    ),
    "adjustment_loneliness": _t(
        "I moved here {duration} ago and I still have no friends. I spend every weekend alone in my room.",
        "I am homesick all the time. There is nobody to talk to here and I miss home constantly.",
        "The culture shock has been hard. I do not fit in with anyone here and I eat alone most days.",
        "It is difficult to make friends when everyone here already has their own group. I feel {feeling} and isolated.",
        "I have been lonely since I arrived. I go to work, come back, and speak to nobody.",
        "I thought I would have settled by now but I feel more alone than when I landed {duration} ago.",
        "Nobody knows me here. I miss my family and I have not made any friends in {duration}.",
    ),
    "work_performance_pressure": _t(
        "I have been put on a performance improvement plan at work and I have thirty days to fix it.",
        "The workload is impossible. I am working late every night and I still cannot keep up at work.",
        "I feel like an imposter in my job. I am terrified my manager will realise I am underperforming.",
        "My performance review was bad and I have been {feeling} about my job ever since.",
        "I am burnt out. I have been overworked for {duration} and I am making mistakes with {workthing}.",
        "My probation at work ends soon and I do not think I will pass it.",
        "There is a risk I will be laid off and I cannot afford to lose my job right now.",
    ),
    "manager_conflict": _t(
        "My manager micromanages everything I do and corrects me in front of the team.",
        "My boss took credit for my work in front of leadership and I did not know what to say.",
        "I have been excluded from meetings since I raised something with HR about my team lead.",
        "The workplace has become toxic. My colleague undermines me constantly and my manager does nothing.",
        "My manager shouts at me when things go wrong and I have started dreading every conversation.",
        "I was passed over for a promotion and my boss will not give me a straight answer about why.",
        "My co-worker has been hostile since I joined and my manager keeps telling me to let it go.",
    ),
    "visa_immigration_anxiety": _t(
        "My visa expires in a few months and my application has not moved. I cannot think about anything else.",
        "My work permit application was refused and I have to decide whether to appeal.",
        "My permanent residency has been pending for over a year and my life is completely on hold.",
        "My sponsorship depends on staying in this job and I feel trapped because of my immigration status.",
        "I am worried I will be deported if my extension is not approved in time.",
        "My study permit is expiring and the university paperwork is late. I am panicking about my status.",
        "Immigration keeps asking for more documents and every letter makes me feel {feeling}.",
    ),
    "relationship_conflict": _t(
        "My partner and I fight constantly since I moved here for work.",
        "We broke up last month after four years and I have not told anyone at home.",
        "My girlfriend and I are long distance and it is falling apart. We argue every call.",
        "My husband and I cannot agree on whether to stay in this country and it is destroying us.",
        "My boyfriend cheated on me and I do not know whether to end the relationship.",
        "My wife and I are talking about divorce and I feel {feeling} about all of it.",
        "There is pressure from both families about our marriage and our relationship is suffering.",
    ),
    "family_parent_pressure": _t(
        "{relative} took a loan for my education and I am scared to tell them how badly things are going.",
        "I cannot tell my parents that I want to change my career. They sacrificed everything for this.",
        "Every call home is about when I am getting married. The family pressure is constant.",
        "{relative} expect me to come back after graduating and I do not want to. I feel {feeling}.",
        "I have been lying to my family for {duration} because I cannot bear to disappoint them.",
        "My parents keep comparing me to my cousins and I feel like I have let them down.",
        "There is so much family pressure about what people back home will say.",
    ),
    "sleep_routine_breakdown": _t(
        "I cannot sleep. I lie awake all night and then sleep through the whole morning.",
        "My routine has completely broken down. I am not eating properly and I stay in bed all day.",
        "I have insomnia most nights and I am exhausted all the time.",
        "My body clock is reversed. I am awake until five and I miss everything in the morning.",
        "I have not had a proper routine for {duration}. I skip meals and I sleep at random hours.",
        "I am sleeping all day and awake all night and it has wrecked everything else.",
        "I cannot get out of bed in the mornings anymore. I have no energy for {period}.",
    ),
    "grief_life_transition": _t(
        "My grandmother passed away and I could not go home for the funeral.",
        "I lost my father {duration} ago and I have not really grieved properly.",
        "{relative} was diagnosed with cancer and I am thousands of miles away.",
        "There was a death in my family and I could not go home. I have been {feeling} since.",
        "My mother is terminally ill back home and I do not know whether to go.",
        "I missed the last rites because of my visa situation and I cannot forgive myself.",
        "I am grieving and there is nobody here who knew the person I lost.",
    ),
    "financial_precarity": _t(
        "I cannot afford my rent this month and I have no savings left.",
        "My education loan repayment starts soon and I do not have a job offer.",
        "The tuition fees went up and my parents cannot send more money.",
        "I am in debt and I have been skipping meals to make the money stretch.",
        "I can only work twenty hours a week on my visa and it does not cover my bills.",
        "I send money home every month and there is never anything left for me.",
        "Everything here is so expensive and I am constantly worried about money.",
    ),
    "discrimination_identity": _t(
        "People at work keep saying they cannot understand my accent and talk over me.",
        "I was told to go back to my country by someone on the street and I have felt unsafe since.",
        "I get treated differently because I am Indian and everyone pretends not to notice.",
        "The microaggressions are constant. Nobody even tries to pronounce my name properly.",
        "I have started anglicising my name to get callbacks and I feel {feeling} about it.",
        "I am the only brown person on my team and I am always the one left out of things.",
        "There is casual racism in my department and raising it would make me the problem.",
    ),
    "acute_distress": _t(
        "I had a panic attack today and I cannot cope anymore. I need to talk to someone.",
        "I am falling apart. I have been crying every day and I cannot function.",
        "Everything is too much right now. I am at my breaking point and I need help now.",
        "I have panic attacks most days now and I cannot take it anymore.",
        "I feel completely overwhelmed and I cannot cope with any of it.",
        "I am desperate and I do not know what to do. I need to talk to someone today.",
    ),
    "clinical_escalation": _t(
        "I was diagnosed with depression years ago and I stopped taking my medication when I moved.",
        "I have PTSD from something that happened before I came here and the flashbacks are back.",
        "I have been drinking every day to cope and I know that is not good.",
        "My OCD has got much worse since I moved and it is affecting everything.",
        "I have an eating disorder that I thought I had beaten and I have relapsed.",
        "I need to find a psychiatrist here because I have run out of my medication.",
        "I have been self medicating to get through the day for {duration}.",
    ),
}

SAFETY_INSERTS: List[Tuple[str, List[str]]] = [
    ("Honestly I have been thinking about ending my life.", ["self_harm_suicide"]),
    ("Some days I do not want to wake up at all.", ["self_harm_suicide"]),
    ("I have started hurting myself again when it gets bad.", ["self_harm_suicide"]),
    ("Everyone would be better off without me.", ["self_harm_suicide"]),
    ("There is no point in living like this.", ["self_harm_suicide"]),
    ("My partner hits me when he has been drinking.", ["abuse_or_immediate_danger"]),
    ("He took my passport and will not let me leave the house.", ["abuse_or_immediate_danger"]),
    ("I am not safe at home and I have nowhere else to go.", ["abuse_or_immediate_danger"]),
    ("I have been hearing voices telling me what to do.", ["psychosis_or_severe_disorientation"]),
    ("I think they are poisoning my food.", ["psychosis_or_severe_disorientation"]),
    ("I get chest pain and I nearly passed out yesterday.", ["medical_emergency"]),
    ("I have not eaten in days and I fainted this morning.", ["medical_emergency"]),
    ("I cannot stop drinking and I blacked out again last night.", ["substance_related_emergency"]),
    ("I took too many pills last night.", ["self_harm_suicide"]),
    ("I am scared I might hurt someone if this continues.", ["threat_to_others"]),
]

USER_TYPE_BY_CATEGORY: Dict[str, List[str]] = {
    "academic_avoidance": ["student"],
    "adjustment_loneliness": ["student", "professional"],
    "work_performance_pressure": ["professional"],
    "manager_conflict": ["professional"],
    "visa_immigration_anxiety": ["student", "professional"],
    "relationship_conflict": ["couple", "professional", "student"],
    "family_parent_pressure": ["student", "professional"],
    "sleep_routine_breakdown": ["student", "professional"],
    "grief_life_transition": ["student", "professional"],
    "financial_precarity": ["student", "professional"],
    "discrimination_identity": ["student", "professional"],
    "acute_distress": ["student", "professional", "unknown"],
    "clinical_escalation": ["student", "professional"],
}


def _fill(template: str, rng: random.Random) -> str:
    text = template
    for key, options in FILLERS.items():
        token = "{" + key + "}"
        while token in text:
            text = text.replace(token, rng.choice(options), 1)
    return text


def generate(per_category: int, safety_count: int, seed: int) -> List[dict]:
    rng = random.Random(seed)
    rows: List[dict] = []
    counter = 0

    for category_id, templates in TEMPLATES.items():
        for _ in range(per_category):
            counter += 1
            country, timezone = rng.choice(COUNTRIES)
            text = _fill(rng.choice(templates), rng)
            rows.append(
                {
                    "id": f"S{counter:04d}",
                    "text": text,
                    "country": country,
                    "timezone": timezone,
                    "user_type": rng.choice(USER_TYPE_BY_CATEGORY.get(category_id, ["unknown"])),
                    "preferred_languages": rng.choice(LANGUAGES),
                    "desired_timing": rng.choice(TIMINGS),
                    "expected_primary": category_id,
                    "expected_risk_flags": [],
                    "source": "template",
                }
            )

    # Safety scenarios are built by attaching a risk disclosure to an ordinary
    # presenting problem, which is how they usually arrive in reality: the risk
    # is rarely the thing the person leads with.
    safety_categories = list(TEMPLATES.keys())
    for _ in range(safety_count):
        counter += 1
        category_id = rng.choice(safety_categories)
        country, timezone = rng.choice(COUNTRIES)
        insert, flags = rng.choice(SAFETY_INSERTS)
        base = _fill(rng.choice(TEMPLATES[category_id]), rng)
        text = f"{base} {insert}"
        rows.append(
            {
                "id": f"S{counter:04d}",
                "text": text,
                "country": country,
                "timezone": timezone,
                "user_type": rng.choice(USER_TYPE_BY_CATEGORY.get(category_id, ["unknown"])),
                "preferred_languages": rng.choice(LANGUAGES),
                "desired_timing": "immediate",
                "expected_primary": "immediate_safety_risk",
                "expected_risk_flags": flags,
                "underlying_category": category_id,
                "source": "template_safety",
            }
        )

    rng.shuffle(rows)
    return rows


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--count", type=int, default=30, help="scenarios per category")
    parser.add_argument("--safety", type=int, default=60, help="safety scenarios to add")
    parser.add_argument("--seed", type=int, default=20260810)
    parser.add_argument("--out", type=Path, default=DATASET_FILE)
    args = parser.parse_args()

    rows = generate(args.count, args.safety, args.seed)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    with args.out.open("w", encoding="utf-8") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")

    safety_rows = sum(1 for row in rows if row["expected_primary"] == "immediate_safety_risk")
    print(f"Wrote {len(rows)} scenarios to {args.out}")
    print(f"  {len(TEMPLATES)} categories x {args.count} = {len(rows) - safety_rows} standard")
    print(f"  {safety_rows} safety scenarios")
    print("\nReminder: accuracy on this file is inflated by shared vocabulary with")
    print("the classifier. Quote data/hard_cases.jsonl instead.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
