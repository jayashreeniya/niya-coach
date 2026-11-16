# Phase 1 — the triage taxonomy

14 categories: the 12 from the project brief, plus two the diaspora context kept
forcing into view. Each has inclusion signals, exclusion signals, urgency rules,
a recommended pathway and required counsellor capabilities. All of it lives in
`niya_triage/taxonomy.py` as data, not code, so a counsellor can review it
without reading Python.

## The categories

| ID | Pathway | Base urgency | Required capability |
|---|---|---|---|
| `academic_avoidance` | study_recovery | moderate | international_student_experience |
| `adjustment_loneliness` | adjustment_support | low | south_asian_diaspora |
| `work_performance_pressure` | workplace_performance | moderate | workplace_coaching |
| `manager_conflict` | workplace_relational | moderate | workplace_coaching, leadership_conflict |
| `visa_immigration_anxiety` | practical_stress_navigation | moderate | immigration_stress |
| `relationship_conflict` | relationship_support | low | couples_therapy |
| `family_parent_pressure` | family_systems | moderate | family_dynamics, south_asian_diaspora |
| `sleep_routine_breakdown` | sleep_restoration | moderate | sleep_behavioural |
| `grief_life_transition` | grief_transition | **high** | grief_and_loss |
| `financial_precarity` † | financial_counselling | moderate | financial_wellbeing |
| `discrimination_identity` † | identity_belonging | moderate | identity_and_belonging |
| `acute_distress` | stabilisation | **high** | crisis_intervention |
| `clinical_escalation` | clinical_referral | **high** | clinical_supervision |
| `immediate_safety_risk` ‡ | crisis_escalation | **critical** | crisis_intervention + clinical_supervision |

† Added beyond the brief. ‡ Assignable only by the safety layer, never by the classifier.

## Why two extra categories

**`financial_precarity`.** Money stress showed up in a large share of realistic
diaspora scenarios and it is not a variant of anything else: a student who cannot
make rent because their visa caps them at 20 working hours needs different help
from one avoiding their supervisor. NIYA already has a Financial Wellbeing
assessment category and focus areas (Budgeting, Debt repayment), so the concept
exists in the product — it just had nowhere to go in triage.

**`discrimination_identity`.** Racism, accent-based exclusion and name-based
hiring discrimination are defining diaspora experiences, and routing them to
generic counselling reliably fails. The specific failure mode is assigning
someone who needs the experience explained to them, which turns a support session
into unpaid education. This category exists to make "do not assign that person"
expressible.

Both are cheap to remove if NIYA disagrees — delete the `_register(...)` block.

## Why `immediate_safety_risk` is not lexically selectable

It is excluded from `SELECTABLE_CATEGORY_IDS`. The classifier cannot reach it by
matching words. Only `safety.py` can assign it, by returning an ACTIVE risk flag.

This prevents a specific failure: a user writing at length about feeling unsafe in
a housing dispute scoring highly on "safety" vocabulary and being routed to crisis,
while a quiet "everyone would be better off without me" scores low on every
category and is routed to family counselling. Category vocabulary and risk
detection are different problems and are kept structurally separate.

## Signal weighting

| Weight | Meaning | Example |
|---|---|---|
| 3.0 | near-defining | `stopped attending`, `took my passport` |
| 2.0–2.5 | strong | `academic probation`, `micromanaging` |
| 1.0–1.5 | supporting | `semester`, `at work` |
| 0.5–0.8 | ambient | `university`, `college` |

**Longest match wins.** In "I cannot sleep", both `cannot sleep` (3.0) and
`sleep` (1.5) are registered signals for the same category. Phrases are matched
longest-first and their character spans consumed, so the total is 3.0, not 4.5.
Without this, verbose intakes inflate every category they touch.

**Exclusion signals** subtract. `academic_avoidance` is penalised by `my manager`
and `performance review`; `work_performance_pressure` is penalised by `lectures`
and `semester`. This is what separates the two most confusable categories.

**Repeats have diminishing returns** — the second mention of a phrase adds 25%,
capped at 1.75×. Saying "lonely" six times is evidence, but not six times the
evidence.

## Urgency

Four levels: `low`, `moderate`, `high`, `critical`. `critical` is reserved for the
safety layer and the LLM is explicitly forbidden from emitting it.

Urgency is raised by, in order:

1. **Category base** — grief and acute distress start high; loneliness starts low.
2. **Escalator phrases** — `academic probation`, `expires in`, `disown me`,
   `threatened to fire me`.
3. **Compounding domains** — 3+ well-evidenced categories at once steps urgency up
   one level. This is what makes the brief's worked example `high`: no individual
   phrase in it is alarming.
4. **Requested timing** — `immediate` or `asap` floors it at high.
5. **Safety floor** — ACTIVE ⇒ critical, ELEVATED ⇒ high, CONTEXT ⇒ moderate.

Each step is recorded in `classification.rationale` so a coordinator can see
which rule moved it.

## Mapping onto NIYA's existing vocabulary — and three gaps

Every category maps to `assesment_test_type_answers.id` values, because those
integers are what `coach_specializations.focus_areas` stores and what
`booked_slots_controller#check_coach_expertise` intersects against. This is the
integration seam: triage output can become the exact ID list the current Rails
matcher already consumes.

| Category | NIYA focus-area IDs | Exact? |
|---|---|---|
| `adjustment_loneliness` | 27 Loneliness, 95 Build Connections, 53 Social Anxiety, 64 Cultural Identity | yes |
| `work_performance_pressure` | 31 Work Life Balance, 69 Fear of Failure, 70 Imposter Syndrome, 26 Just Started working | yes |
| `manager_conflict` | 30 Managing Up, 32 Conflict management, 33 Team Dynamics, 34 Better Communication | yes |
| `relationship_conflict` | 28 Relationship Issues, 29 Breakup, 38 Marital Conflict, 47 Divorce | yes |
| `sleep_routine_breakdown` | 77 Sleep Concerns, 80 Rest/Recharge, 51 Stress | yes |
| `grief_life_transition` | 72 Grief, 48 Widowhood, 71 Trauma | yes |
| `clinical_escalation` | 54, 55, 58, 60, 71, 75 | yes |
| `family_parent_pressure` | 45 Caring for Elderly parents, 44 Parenting, 64, 62 | partial |
| **`academic_avoidance`** | 69, 70, 62, 51 | **no** |
| **`visa_immigration_anxiety`** | 52 Anxiety, 51 Stress | **no** |
| **`discrimination_identity`** | 64 Cultural Identity, 65 Comparison Fatigue, 61 Self Esteem | **no** |
| **`financial_precarity`** | 88 Budgeting, 89 Spending habits, 90 Debt repayment | **no coach expertise** |

Categories with no exact mapping are marked `mapping_is_approximate=True` and
that flag is surfaced in the API response, so an integration never silently
pretends the translation was clean.

### The three gaps, stated plainly

**1. There is no academic focus area.** NIYA's triage offers "I'm a student" as a
work context, but the Q3 topics that follow are all personal-life or
professional-life items. A student saying "I've stopped going to lectures" has
nothing accurate to select, and no coach expertise maps to it. Given that
students are a core NIYA segment, this is the most commercially significant gap.

**2. There is no immigration focus area.** Visa anxiety currently collapses into
generic Anxiety (52), which routes to "Anxiety Depression" coaches who may know
nothing about immigration systems. For a service built for people living abroad
on conditional status, this is a substantial mismatch.

**3. There is no financial-stress coach expertise.** `coach_specializations` has
six labels — Anxiety Depression, Self Confidence, Emotional Fitness, Relationship
Counselling, Mental health, workplace coaching — and none covers money. The
Financial Wellbeing *assessment* category exists with focus areas, but no coach
can be matched to them. `financial_precarity` currently falls back to
`workplace coaching`, which is wrong and is flagged as approximate.

Closing these needs three new `assesment_test_type_answers` rows, one new
`coach_specializations` row, and coach re-tagging. That is a data change, not a
schema change — but it is NIYA's change to make, and this prototype does not
make it. See [`INTEGRATION_PROPOSAL.md`](INTEGRATION_PROPOSAL.md).

## Cross-cutting themes

Themes are extracted independently of the winning category, because the brief's
example lists four for one case. 12 themes: avoidance, sleep disruption, parent
pressure, academic risk, financial strain, isolation, shame, status insecurity,
somatic symptoms, functional decline, hopelessness, discrimination.

They are what the intake screen shows the user, because "avoidance, sleep
disruption, parent pressure" is recognisable to the person who wrote the message
in a way that `academic_avoidance` is not.

## Review status

**This taxonomy has not been reviewed by a NIYA counsellor.** The brief requires
that; it has not happened. The specific things to put in front of a clinician
first:

1. Is `acute_distress` vs `clinical_escalation` drawn in the right place?
2. Is a 24-hour first session the right SLA for grief, or too fast?
3. Should `discrimination_identity` require a counsellor of shared background as
   a *gate* rather than a preference?
4. Are the escalator phrases the ones a counsellor would actually escalate on?
