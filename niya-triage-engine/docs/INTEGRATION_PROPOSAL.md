# Integration proposal — how this *would* connect to NIYA

> **STATUS: PROPOSAL ONLY. NOTHING IN THIS DOCUMENT HAS BEEN IMPLEMENTED.**
>
> No file outside `niya-triage-engine/` has been created, modified or deleted.
> No migration has been written or run. No database has been connected to. The
> Rails app, its MySQL schema and the React app are exactly as they were.
>
> This document describes what integration *would* require, so the decision can
> be made with the cost visible. Every code block below is illustrative.

## What the prototype currently knows about NIYA

Read-only knowledge, baked in as constants:

- `assesment_test_type_answers` IDs 26–96 and their labels
- The six `coach_specializations.expertise` strings
- That `coach_specializations.focus_areas` stores an integer array
- That `booked_slots_controller#check_coach_expertise` intersects those arrays

`niya_triage/taxonomy.py` uses these to translate triage output into the
vocabulary the existing matcher speaks. It is a one-way lookup table, not a
foreign key. `pipeline.integration_payload()` produces the result:

```json
{
  "focus_area_ids": [69, 70, 62, 51, 45, 44, 64, 77, 80],
  "coach_expertise_labels": ["Self Confidence", "workplace coaching", "Relationship Counselling"],
  "urgency": "high",
  "requires_escalation_capable_coach": false,
  "human_review_required": true,
  "mapping_is_approximate": true
}
```

`mapping_is_approximate: true` is the engine admitting the translation is lossy —
`academic_avoidance` has no real NIYA focus area. An integration must not
silently discard that flag.

## The central design choice

**Do not modify `booked_slots_controller`.** It is production booking code with
two parallel legacy paths (`bx_block_calendar` and `bx_block_sharecalendar`) and
no test coverage visible in the repo. Changing its matching logic to accommodate
triage risks breaking booking for everyone to improve routing for some.

The proposal is instead **additive**: a new controller, new tables, and the
existing path left untouched until the new one has proven itself in shadow mode.

## Proposed changes, by phase

### Phase 0 — Shadow mode (no user impact)

**Goal:** find out whether the engine is any good on real enquiries, risking nothing.

Files that *would* be created:

| File | Purpose |
|---|---|
| `back-end/db/migrate/*_create_triage_decisions.rb` | Store engine output alongside what the coordinator actually did |
| `back-end/db/migrate/*_create_risk_flag_events.rb` | **Safety audit — needed regardless of anything else** |
| `back-end/app/services/triage_client.rb` | HTTP client for the Python service, fail-open |
| `back-end/app/jobs/triage_shadow_job.rb` | Async call on enquiry; result written, never shown |

Sketch of the audit table, which is the part worth doing first:

```ruby
create_table :risk_flag_events do |t|
  t.references :account, foreign_key: { to_table: :accounts }
  t.string   :case_id,        null: false
  t.string   :flags,          null: false   # JSON array
  t.string   :severity,       null: false   # active | elevated | contextual
  t.string   :rule_ids                      # which rules fired
  t.string   :engine_version
  t.datetime :detected_at,    null: false
  t.datetime :acknowledged_at
  t.references :acknowledged_by, foreign_key: { to_table: :accounts }
  t.text     :action_taken
  t.timestamps
end
add_index :risk_flag_events, [:acknowledged_at, :severity]
```

**This table has standalone value.** NIYA's backend currently has no crisis
logging of any kind — searches for `suicide`, `self-harm`, `crisis`,
`escalation` and `helpline` across `back-end/**/*.rb` return zero matches, while
"Domestic Violence", "Abusive Relationship" and "Addiction" are all selectable
triage topics. Even if the triage engine is never adopted, being able to answer
"was this disclosure seen by a human, and when" is worth having.

**Exit criteria:** ≥200 shadow cases; category agreement with coordinator
decisions measured; zero missed safety cases in manual review of every flagged
and unflagged risk case.

### Phase 1 — Coordinator-facing (still no user impact)

Add the shortlist to the internal view only. Coordinators can accept or
override; every override is logged and becomes calibration data for the weights.

| File | Change |
|---|---|
| `back-end/config/routes.rb` | Add a namespaced `bx_block_triage` block. **Additive only** |
| `back-end/app/controllers/bx_block_triage/triage_controller.rb` | New. `POST /bx_block_triage/classify`, `GET /review_queue`, `POST /review` |
| `back-end/app/admin/triage_decisions.rb` | New ActiveAdmin resource beside the existing 31 |

Exit criteria: coordinator acceptance ≥75% (the brief's target) across ≥100 cases.

### Phase 2 — Taxonomy data changes

Close the three gaps in `TAXONOMY.md`. **Data changes, not schema changes:**

```sql
-- Illustrative only. Not run.
INSERT INTO assesment_test_type_answers (assesment_test_type_id, title, answers)
VALUES
  (<personal_life_type_id>, 'Academic Functioning', 'Academic avoidance / attendance'),
  (<personal_life_type_id>, 'Immigration Stress',   'Visa and status anxiety'),
  (<personal_life_type_id>, 'Discrimination',       'Racism and belonging');

INSERT INTO coach_specializations (expertise, focus_areas)
VALUES ('Financial Wellbeing', '[88, 89, 90, 91, 92]');
```

Then re-tag coaches and update `taxonomy.py` to point at the new IDs, dropping
`mapping_is_approximate`. Requires a NIYA decision on who owns coach re-tagging.

### Phase 3 — User-facing

| File | Change |
|---|---|
| `Niya-Web-main/src/components/login/Wellbeing.js` | Replace the 3-step personality quiz with a free-text box. **This is the biggest UX change and needs its own A/B test** |
| `Niya-Web-main/src/components/login/Bookappointment.js` | Render a ranked shortlist with reasons instead of an unordered card grid |
| New `SafetyInterstitial.jsx` | Country emergency guidance when a flag fires |

The booking screen change is where the commercial value lands: today the user
browses whatever the API returns, with no ordering and no explanation. Three
explained matches is a materially different experience.

### Phase 4 — Live safety routing

Only after Phases 0–3 and, critically, after the operating model in
`PRIVACY_AND_DEPLOYMENT.md` exists: on-call rota, response SLA, alerting that
does not depend on watching a dashboard, and a clinician-written responder
procedure.

**Do not ship automated safety routing without an on-call rota.** A system that
detects risk perfectly and hands it to nobody is worse than no system, because it
creates the appearance of a safety net.

## Deployment topology

```
React (book-appointment.niya.app)
        |
        v
Rails API (niya-backend-oiut.onrender.com)   <-- unchanged public contract
        |
        | internal HTTP, private network, mTLS or shared secret
        v
Python triage service (FastAPI)              <-- this repository
        |
        +-- own Postgres for audit
        +-- optional LLM provider
```

Rails stays the system of record. The Python service is stateless per request
apart from its audit log, so it scales horizontally and can be taken offline
without breaking booking — provided `TriageClient` fails open.

**Failure mode, explicitly:** if the triage service is down, enquiries must fall
through to today's manual flow. Triage is an enhancement to routing, never a
dependency of booking.

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Safety routing ships without an on-call rota | **Critical** | Phase 4 gate; refuse to enable otherwise |
| Free-text intake reduces conversion vs the quiz | High | A/B test at Phase 3; the quiz may feel lighter to complete |
| `mapping_is_approximate` ignored by the integration | High | Reject payloads carrying it until Phase 2 lands |
| Triage service latency hurts booking | Medium | Async in Phase 0–1; fail open; 2s timeout |
| Two matching systems disagree | Medium | Shadow mode makes disagreement visible before it is user-facing |
| Coach re-tagging never happens | Medium | Phase 2 is blocked on a named owner, not on engineering |

## Estimated effort

| Phase | Backend | Frontend | Total |
|---|---|---|---|
| 0 — Shadow | 3–4 d | — | ~1 week |
| 1 — Coordinator | 3–4 d | 2 d | ~1 week |
| 2 — Taxonomy data | 1 d + re-tagging | — | 2–3 days + NIYA time |
| 3 — User-facing | 2 d | 5–6 d | ~1.5 weeks |
| 4 — Safety live | 2 d | 1 d | ~1 week + operating model |

Roughly 5–6 engineering weeks, and Phase 4's real dependency is organisational,
not technical.

## The one thing worth doing regardless

If NIYA takes nothing else from this: **add the `risk_flag_events` table and a
rule-based scan of enquiry text.** That is a few days of work, requires no AI, no
new service and no UX change, and it closes the gap where a user can currently
disclose suicidal ideation in a booking note and have it reach nobody.
