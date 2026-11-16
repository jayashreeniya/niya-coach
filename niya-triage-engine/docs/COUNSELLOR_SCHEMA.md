# Phase 3 — counsellor database schema

The schema implemented in `niya_triage/counsellors.py`, set against what NIYA
stores today. The gap is the argument for the whole project: the current model
cannot express most of what matching needs.

## Current state

Coaches are rows in `accounts` with `role_id = 4`. There is no `coaches` table.

```
accounts.expertise      text, JSON array of strings   e.g. ["Anxiety Depression","workplace coaching"]
accounts.city           string                        e.g. "Chennai"
accounts.education      string                        free text
accounts.rating         float                         denormalised mean of coach_ratings
accounts.activated      boolean
user_languages.language string, one row per language
coach_specializations   expertise (string) -> focus_areas (array of ints)
availabilities          per-coach-per-day, timeslots JSON, DD/MM/YYYY strings
coach_ratings           coach_rating decimal, feedback text
```

Matching today intersects the user's Q3 answer IDs with the coach's specialisation
focus-area IDs, filters by availability on the chosen date, and returns an
unordered list. There is no ranking.

## Proposed schema

| Field | Type | In NIYA today? | Why it is needed |
|---|---|---|---|
| `id`, `display_name`, `credentials`, `active` | — | ✅ `accounts` | — |
| `capabilities` | string[] | ❌ | `expertise` holds 6 coarse labels. Matching needs finer tags like `international_student_experience`, `academic_systems_knowledge`, `immigration_stress` |
| `category_experience` | map<category, 0–1> | ❌ | Binary "has this expertise" cannot distinguish a counsellor who does this daily from one who did it twice |
| `years_experience` | float | ❌ (only `created_at`) | Complexity gating |
| `languages` | string[] | ✅ `user_languages` | — |
| `country_context` | string[] | ❌ | **The core of cultural fit.** Knowing the Canadian student-visa system is not the same as speaking Hindi |
| `diaspora_background` | bool | ❌ | Whether the counsellor has lived the migration, not just studied it |
| `client_types` | string[] | ❌ | Not every counsellor takes couples, or students |
| `timezone` | IANA string | ❌ **hardcoded `Asia/Kolkata`** | Cannot schedule across regions without it |
| `working_hours_local` | (float, float) | partial | `availabilities` has slots but no notion of a working window |
| `next_available_hours` | float | derivable | Needed as a scalar to score against a pathway SLA |
| `active_cases` / `max_cases` | int | ❌ | **No capacity concept exists.** Cannot balance load or prevent overload |
| `preferred_complexity` / `max_complexity` | enum | ❌ | Stops a coaching-only practitioner receiving a clinical case |
| `satisfaction` | float 1–5 | ✅ `accounts.rating` | — |
| `completion_rate`, `return_rate`, `referral_rate`, `rematch_rate` | float | ❌ | The brief's success metrics are unmeasurable without these |
| `sessions_delivered` | int | derivable | Needed to shrink outcome scores for low-volume counsellors |
| `escalation_capability` | bool | ❌ | **No equivalent at all** |
| `clinically_qualified` | bool | ❌ | No way to distinguish a coach from a clinician |
| `crisis_trained` | bool | ❌ | No way to guarantee a risk case reaches someone qualified |

## The three that matter most

**`escalation_capability` / `clinically_qualified` / `crisis_trained`.** Today
there is no field anywhere in NIYA's schema that distinguishes a life coach from
a clinical psychologist. The booking flow will happily assign anyone. Since the
backend also has no crisis detection — searches for `suicide`, `self-harm`,
`crisis`, `escalation`, `helpline` across `back-end/**/*.rb` return zero matches
— a user disclosing suicidal ideation in a booking note currently reaches
whoever happens to be free. These three booleans are the minimum needed to make
that impossible, and they are why `matching.check_gates()` is boolean rather than
weighted.

**`timezone`.** `TIME_ZONE='Asia/Kolkata'` is hardcoded and there is no per-coach
column. For a product whose users are in Toronto, London and Melbourne, every
scheduling decision is currently made in the wrong reference frame.

**`current_capacity`.** Without it, "counsellor utilisation" — one of the brief's
stated business benefits — cannot be measured, let alone optimised.

## Outcome fields and the shrinkage problem

`accounts.rating` is a plain mean. A counsellor with two five-star ratings shows
5.0 and outranks one at 4.6 over 300 sessions.

`matching.score_historical_outcome()` shrinks toward 0.5 until
`sessions_delivered` reaches 25:

```
weight  = min(1, sessions_delivered / 25)
outcome = weight * raw + (1 - weight) * 0.5
```

`C011` in the fixture roster (4.9 satisfaction, 11 sessions) exists to test this
and is asserted in `tests/test_matching.py::test_outcome_score_is_shrunk_for_low_volume`.

## Migration path

Nothing here requires replacing the existing schema. The additive route:

1. Add a `coach_profiles` table keyed on `account_id` carrying the new fields.
   Leave `accounts.expertise` untouched so the current matcher keeps working.
2. Backfill `timezone`, `country_context`, `client_types` from what coaches
   already know — a form, not a migration.
3. Derive `sessions_delivered`, `completion_rate`, `return_rate` and
   `rematch_rate` from `booked_slots` and `cancel_booked_appointments`, which
   already hold the raw events.
4. Set the three safety booleans **manually, per coach, with a named approver.**
   These must never be self-declared or inferred.

Step 4 is the one with a hard dependency on a human decision, and it should
happen before any risk-flagged case is routed automatically.

**None of this is implemented here.** See [`INTEGRATION_PROPOSAL.md`](INTEGRATION_PROPOSAL.md).
