# Evaluation methodology and business-impact model

## Measured results

These are real numbers from `python eval/evaluate.py` against the 66-scenario
hand-written hard set, rules only, no LLM configured. Regenerate with that
command; it writes `eval/report.md` and `eval/results.json`.

| Metric | Target | Measured |
| --- | --- | --- |
| Primary-category accuracy | 80%+ | **68.2%** — misses target |
| Accuracy including secondary | — | 74.2% |
| Unsafe case recall | 95%+ | **100%** |
| Safety precision | no target | 94.1% |
| Safety false-positive rate | tolerated | 2.0% (1 case) |
| Urgency exact match | — | 71.2% |
| Human-review rate | — | 95.5% |
| Intake-to-match p95 | under 2 min | 6 ms |

**Category accuracy misses the 80% target and should not be rounded up.** The
gaps are concentrated in categories that need world knowledge rather than
vocabulary: a layoff that is really a visa emergency because of a 60-day clock,
remittance obligations that are financial rather than familial, accent-based
exclusion described without the word discrimination. These are the cases the
optional LLM layer exists to catch, and it was not running for this measurement.

### What the first run caught

The first execution of this harness scored **62.5% unsafe-case recall**, far
below the 95% target, while the unit tests were passing. The rules had been
written around the phrasings in the tests; the hard set uses the phrasings people
actually type. Six safety cases were missed — "cutting again" rather than
"cutting myself", "took a handful of my flatmates pills" rather than "took too
many pills", "putting something in my food" rather than "poisoning my food",
"not allowed to leave the house" rather than "won't let me leave", "I am
sixteen" rather than "I am 16 years old", and a passive-ideation statement where
only the question form was covered.

Widening those patterns took recall to 100% with no change in the false-positive
rate. The lesson is in `tests/test_safety.py::test_colloquial_phrasings_are_flagged`,
which now pins every one of them, alongside `test_widened_patterns_do_not_overreach`
to keep the broader verbs from firing on "cutting classes" or "cutting costs".

One disagreement with the hard-set labels is left standing rather than tuned
away: `H044` ("I do not see the point in any of this anymore... I just want it
to stop") is labelled critical, and the engine calls it high. It is caught,
flagged and routed to a human either way; whether passive ideation without a
stated method warrants emergency routing is a clinical calibration decision for
NIYA, not one to settle by editing a regex until the number goes green.

## Why two datasets, reported separately

`scripts/build_data.py` generates ~450 scenarios from templates. Those templates
were written by the same person who wrote the classifier's lexicon. They share
vocabulary with it. The classifier will therefore score very well on them, and
that score is close to meaningless — it is measuring whether a phrase-matcher
can match phrases it was given.

This is the single most common way an internship evaluation lies to itself:
generate synthetic data with an LLM, evaluate an LLM classifier on it, report
94%, and discover in production that real users write nothing like the templates.

So the harness reports two sections and never averages them:

| Dataset | Size | What it honestly measures |
|---|---|---|
| `data/hard_cases.jsonl` | 66 hand-written | **Real accuracy.** Deliberately confusable, adversarial, with distractors |
| `data/test_cases.jsonl` | ~450 generated | Regression detection, latency at volume, class balance |

The hard set includes 11 adversarial cases built specifically to break this
engine — idiom traps (`H056`), a negated denial (`H058`), a third-party
disclosure (`H057`), a gym-classes false-positive trap for academic avoidance
(`H065`), and a case with deliberately positive mentions of a manager and
classes (`H064`). Several are expected to fail. That is the point: an evaluation
set you pass completely was too easy.

**Neither set has been reviewed by a NIYA counsellor.** The brief asks for
counsellor-reviewed scenarios and that has not happened. Until it does, the
labels represent one non-clinician's judgement, and the accuracy figure measures
agreement with *that*, not with clinical truth.

## Metrics

### Against the brief's targets

| Metric | Target | How it is computed |
|---|---|---|
| Primary-category classification | 80%+ | Exact match on `expected_primary`, hard set |
| Unsafe case recall | 95%+ | Cases with `expected_risk_flags` where the engine emitted ≥1 flag |
| Intake-to-match time | under 2 min | p95 wall-clock through the full pipeline |
| Human acceptance of match | 75%+ | **Not measurable yet** — needs coordinator decisions in the audit log |
| Enquiry-to-booking improvement | 15%+ | **Not measurable yet** — needs a live A/B |
| Manual coordination time reduction | 50%+ | **Not measurable yet** — needs a time-and-motion baseline |
| Rematch rate | below 15% | **Not measurable yet** — needs post-session outcome data |

Four of the seven business metrics cannot be measured from a prototype at all.
They need instrumentation in the live product. Saying so is more useful than
inventing proxies for them.

### Also reported

- **Accuracy including secondary categories** — if the right label was on screen
  as a secondary, the coordinator still saw it. This is the more operationally
  honest number for a human-in-the-loop system than strict top-1.
- **Per-category precision and recall** — a category that never wins is dead
  weight; one that wins everything is a sink.
- **Confusion pairs** — which categories bleed into each other.
- **Confidence separation** — mean confidence when correct vs when wrong. If
  these are close, the confidence score is not doing its job and the
  low-confidence review trigger is worthless.
- **Safety precision and false-positive rate** — reported but *not* optimised.

### Why safety precision is reported but not targeted

The brief is explicit: for safety cases, recall matters more than precision.
The asymmetry is stark — a false positive costs a coordinator about two minutes
of reading; a false negative can cost a life.

The design consequence: `H058` ("to be clear I am not suicidal") is *expected* to
produce a flag. Counted naively that is a false positive. It is the correct
behaviour, and any tuning pass that "fixes" it by clearing negated risk language
has made the system worse. Flag-level recall is broken out per risk type so a
systematic blind spot in one flag cannot hide behind a good average.

## Error analysis

`eval/evaluate.py` emits, for every misclassification: the text, expected vs
predicted, confidence, whether the correct label appeared in the secondaries, and
the hand-written note explaining why the case is hard.

Known weaknesses already identified, before running anything:

1. **Sentiment blindness.** Lexicon scoring keys on topic words regardless of
   polarity. `H064` mentions a manager and classes positively and may still score
   those categories. Fixing this properly means embeddings or an LLM-first design.
2. **Category vs consequence.** `H033` (skipping meals to save money) is
   financial with a routine symptom; the engine may invert it.
3. **Gym classes.** `H065` contains "stopped attending", "classes" and
   "university" but is about a gym. Expected to fail; a genuine limitation of
   phrase matching without dependency parsing.
4. **Very short intake.** `H062` is one word. The engine cannot classify it and
   is designed to say so rather than guess — verify it routes to review with low
   confidence rather than confidently picking a default.

## Business-impact model

Assumption-driven and clearly labelled. Every input below is a guess until NIYA
supplies real figures.

**Assumptions** (replace with actuals):

| Input | Assumed |
|---|---|
| Enquiries per month | 400 |
| Current enquiry-to-booking conversion | 35% |
| Coordinator time per manual match | 12 min |
| Coordinator loaded cost | ₹600/hour |
| Average first-session revenue | ₹1,500 |
| Current rematch rate | 20% |

**Modelled effects:**

*Coordination time.* 400 enquiries × 12 min = 80 hours/month. If triage handles
the 60% of cases that need no review, and the remaining 40% take 5 minutes to
confirm rather than 12: 400 × 0.4 × 5 min = 13.3 hours. A 83% reduction, well
past the 50% target — but this assumes the review rate lands near 40%. If the
engine flags 80% for review, the saving roughly halves.

*Conversion.* The mechanism is speed and confidence: every counsellor who fits
the case, ordered by how well they fit and explained, within seconds — rather
than an unordered card grid. The order is the product; the list is not cut down
to a chosen few, because a client weighing a fee or a language against a modest
difference in fit is making a reasonable decision the score cannot see. The
brief targets +15%; 35% → 40% on 400 enquiries is 20 extra bookings/month ≈
₹30,000.
This is the least defensible number here — conversion depends on price, brand and
timing far more than on match quality.

*Rematch.* Every rematch is a wasted session and a damaged relationship. 20% →
12% on ~140 bookings is ~11 fewer wasted sessions/month.

**The honest summary:** the operational saving is the credible one, because it
follows arithmetically from automating a manual step. The conversion uplift is
a hypothesis that requires an A/B test. Presenting both with equal confidence
would be misleading.

## What must happen before any of this is trustworthy

1. Run the harness. Get real numbers.
2. Have 2–3 NIYA counsellors independently label 100 hard cases; measure
   inter-rater agreement *between them* first. If counsellors agree with each
   other only 70% of the time, an 80% target against a single labeller is
   meaningless.
3. Re-label the hard set by consensus and re-measure.
4. Shadow-run against real enquiries with no user-visible effect, comparing
   engine output to what coordinators actually did.
5. Only then consider surfacing it to users.
