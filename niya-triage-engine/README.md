# NIYA — AI triage and counsellor-matching engine

Turns a user's free-text description of what is happening into a routed case:
**urgency**, **problem category**, **support pathway**, **best-fit counsellor
shortlist** and **suggested next action** — with a rule-based safety layer that
runs independently of any language model.

It then takes that result through to a session someone can actually attend: sign
in, choose a counsellor, pick a time **in your own timezone**, pay, get a
confirmation by email and SMS, and join through a button that opens five minutes
before the session and closes five minutes after it.

It is not an AI therapist. It gives no advice and makes no diagnosis. It solves
the operational bottleneck underneath NIYA's product: *getting the right person
to the right human, quickly and consistently.*

**It is standalone.** It has its own accounts and its own `niyatriage` database,
and it reads nothing from NIYA's existing app. Nothing outside this folder has
been modified except one addition to `render.yaml` to deploy it.

---

## Two things live in here

| | What it is | Run it |
|---|---|---|
| **`webapp/`** | The deployable product. Accounts, triage, booking, payment, joining. Server-rendered, mobile-first. | `.\run.ps1 app` |
| `niya_triage/` | The engine. Standard library only, no dependencies. | `.\run.ps1 demo` |

`api/` and `ui/` are internal tools — a REST API and a Streamlit review
dashboard. Neither has authentication and **neither should be deployed.**

---

## Status: what is real and what is not

Read this before quoting anything from this repository.

| Thing | Status |
|---|---|
| Taxonomy, safety layer, classifier, matching engine | Implemented and working |
| Accounts, sign-in, per-account data scoping | Implemented, tested |
| Booking: slots, timezones, holds, notifications, joining window | Implemented and working |
| Timezones and daylight saving | Implemented via `zoneinfo`, resolved against the session instant |
| Mapping onto NIYA's real focus-area IDs and expertise labels | Implemented, derived from the production schema |
| Counsellor roster | Lives in the `counsellors` table; `data/counsellors.json` seeds an empty database. **Entirely synthetic — every person in it is fictional.** |
| Per-counsellor fees, with NIYA's margin | Implemented. Admin sets both amounts; the split is snapshotted onto each payment |
| Admin portal: onboarding, pricing, margin | Implemented, tested |
| Counsellor-facing portal: their sessions, connect now, their own hours | Implemented, tested |
| Payment | Razorpay integration written; **simulated until keys are set.** No money moves. |
| Email and SMS | SendGrid and Twilio integrations written; **queued, not sent, until keys are set.** |
| Video call | Twilio Programmable Video. Implemented, tested; **placeholder until the API key pair is set.** See `docs/VIDEO.md`. |
| Session recording | **Not implemented**, deliberately. Consent and retention need answering first. |
| Email verification | **Not implemented.** Anyone can sign up with an address they do not own. |
| Password reset | **Not implemented.** Counsellors can change a password they know; losing it needs an admin. |
| Refunds | **Recorded, not issued.** Cancelling marks `refund_due`; moving money is manual. |
| Database migrations | **Not implemented.** Schema drift is detected at startup, not fixed; the next change after real data needs Alembic. |
| Safety recall on the hard set | Measured: **100%** (target 95%+) |
| Category accuracy on the hard set | Measured: **68.2%** — **below the 80% target** |
| Category accuracy on the plain set | Measured: **100%** (was 62.5% before the signal fix) |
| Business-impact figures | Modelled, not observed |

280 tests pass. See `docs/EVALUATION.md` for the accuracy detail. Category
accuracy on the hard set misses its target and is reported as it stands rather
than rounded up.

The two category figures are worth reading together. The hard set is adversarial
by design — euphemism, misdirection, figurative language — so 68.2% is the score
against deliberately difficult input. The plain set exists because that number
was hiding a plainer failure: real users were typing "need workplace coaching"
and "sleeping issues" and getting routed to generic adjustment support at 12%
confidence, since signals match whole words and the lexicon knew "at work" but
not "workplace". A hard set full of subtlety will never catch a system that
cannot classify a simple sentence, so ordinary phrasing is now measured
separately.

Worth knowing before you trust the suite: the first evaluation run scored 62.5%
unsafe-case recall *while every unit test passed*, because the safety rules had
been written around the phrasings in the tests rather than the phrasings people
type. That gap is now closed and pinned by tests, but it is the reason
`eval/evaluate.py` matters more here than `pytest` does.

---

## Quick start

Commands are given for **Windows PowerShell**, since that is what the NIYA team
runs. macOS/Linux equivalents are identical except where noted.

Everything runs through one script:

```powershell
cd d:\Niya.life\niyasourcecode\niya-triage-engine

.\run.ps1 setup     # one-off, ~10 min: creates .venv
.\run.ps1 app       # THE APP -> http://localhost:8080
```

Then open http://localhost:8080, create an account, describe a problem, and book
a session. It runs on SQLite with simulated payment and messaging, so there is
nothing to configure. Sessions are bookable from two hours ahead at high urgency,
so you can reach the joining window without waiting a day.

There are three sign-ins, each landing somewhere different:

| Sign in as | Lands on | Can do |
|---|---|---|
| a client | `/intake` | Describe a problem, see matches with prices, book, pay, join |
| a counsellor | `/expert` | Their own sessions, connect now, set their own hours |
| an admin | `/admin` | Onboard counsellors, set fees, see the margin |

Clients sign themselves up. Counsellors are created by an admin, who is handed a
one-time password to pass on. To make the first admin:

```powershell
.\run.ps1 admin     # prompts for a password, so it stays out of shell history
```

[`docs/ADMIN_AND_EXPERTS.md`](docs/ADMIN_AND_EXPERTS.md) covers the roles, the
pricing model and what is deliberately not built.

The rest:

```powershell
.\run.ps1 preview   # render every page to webapp\preview\ for layout review
.\run.ps1 demo      # three canned cases          (no install needed)
.\run.ps1 try       # type your own messages      (no install needed)
.\run.ps1 test      # the test suite              (no install needed)
.\run.ps1 eval      # accuracy and safety recall  (no install needed)

.\run.ps1 ui        # coordinator dashboard -> http://localhost:8501
.\run.ps1 api       # REST API docs        -> http://localhost:8000/docs
```

**Only `app`, `ui` and `api` need `setup`.** Everything else runs on a bare
Python 3.9+ because the engine core is standard library only.

> **Install into the venv, never globally.** Streamlit requires a newer
> `protobuf` than the `google-cloud-*` packages used elsewhere in this
> repository tolerate. `pip install -r requirements.txt` outside a virtual
> environment will break them. `.\run.ps1 setup` handles this correctly.

If PowerShell blocks the script, either run
`powershell -ExecutionPolicy Bypass -File .\run.ps1 demo` or unblock it once
with `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

The rest of this section explains what each command does.

The core engine has no dependencies — nothing to install for this step:

```powershell
python scripts\demo.py
```

That runs three cases through the full pipeline: the brief's worked example, an
idiom that looks alarming but must not flag, and a genuine risk disclosure that
must flag and stop. The first case prints:

```json
{
  "primary_category": "academic_avoidance",
  "secondary_categories": ["family_parent_pressure", "sleep_routine_breakdown"],
  "urgency": "high",
  "confidence_score": 0.72,
  "recommended_pathway": "study_recovery",
  "human_review_required": true,
  "risk_flags": [],
  "preferred_counsellor_attributes": [
    "international_student_experience",
    "academic_systems_knowledge",
    "family_dynamics",
    "english_hindi"
  ]
}
```

Next, try your own wording. This is the most useful tool in the repo for judging
whether the engine is any good, because it shows *which phrase* drove every
decision rather than just the label:

```powershell
python scripts\try.py "I stopped going to lectures and I cannot tell my dad"
python scripts\try.py --user student --country india
```

With no message it goes interactive, one case per line. Options are `--country`,
`--user` (student/professional/unknown), `--lang english,hindi`, `--age`,
`--timing`, and `--quiet`. It prints the matched signals, the runners-up and
their scores, any safety rules that fired and how they were softened, the
shortlist with its six score components, and which counsellors were excluded by
a hard gate and why. Nothing is written to the audit log.

Then the test suite. This is the important one — it verifies the safety layer:

```powershell
python -m pytest -v
```

`python -m pytest` rather than plain `pytest` so it works regardless of whether
the Scripts directory is on PATH. Run it **from `niya-triage-engine\`**;
`tests\conftest.py` puts the project root on `sys.path`, which only resolves
correctly from there.

Then the full thing:

```powershell
pip install -r requirements.txt

python scripts\build_data.py
python eval\evaluate.py

uvicorn api.app:app --reload
streamlit run ui\app.py
```

- `build_data.py` generates the synthetic scenario set into `data\test_cases.jsonl`
- `evaluate.py` writes metrics and error analysis to `eval\report.md`
- the API serves interactive docs at http://localhost:8000/docs
- the Streamlit app is the intake screen plus the review dashboard

### PowerShell gotchas

- **Do not chain with `&&`.** Windows PowerShell 5.1 (the default) rejects it
  with *"the token '&&' is not a valid statement separator"*. Run each command on
  its own line, or use `;` if you want them on one line. PowerShell 7 (`pwsh`)
  supports `&&`, but do not assume it is installed.
- **Backslashes in paths** are fine in PowerShell. Forward slashes also work, so
  `python scripts/demo.py` is equally valid.
- If `python` opens the Microsoft Store, the App Execution Alias is intercepting
  it. Use `py scripts\demo.py` instead, or disable the alias in
  *Settings → Apps → App execution aliases*.

On macOS/Linux the same commands work with forward slashes, and `&&` chaining is
fine.

The language model is optional. Set `OPENAI_API_KEY` to enable a second opinion;
without it the engine runs rules-only and reports that it did.

---

## How it decides

```
intake text
    |
    v
[1] SAFETY RULES  <- regex only, no model, cannot be skipped
    |                 negation/third-party/history downgrade but never clear
    |                 ACTIVE flag -> stop, hand to a human, show local helplines
    v
[2] LEXICON CLASSIFIER  <- weighted phrase evidence over 13 categories
    |                      longest-match-wins, explainable to a counsellor
    v
[3] LLM SECOND OPINION  <- optional; may raise urgency or risk, never lower
    |
    v
[4] RECONCILE  <- disagreement is information: strong rule evidence wins,
    |              weak rule evidence defers, either way a human looks
    v
[5] HARD GATES  <- capacity, complexity ceiling, clinical qualification,
    |               crisis training. Boolean. Not out-scorable.
    v
[6] WEIGHTED MATCH  <- 0.30 problem + 0.20 availability + 0.15 language
    |                  + 0.15 cultural + 0.10 timezone + 0.10 outcomes
    |                  orders the eligible; does not shorten them
    v
ranked counsellors + pathway + next action + tamper-evident audit entry
```

The gates decide who may be offered. The score decides only what order they
appear in. Everyone who passes the gates is shown, because a client choosing on
fee, language or availability is making a judgement the score cannot make for
them — and because a capped list made newly onboarded counsellors unbookable:
with no delivered sessions they ranked below anyone established, so they were
never shown, so they never delivered a session.

### Five decisions worth arguing about

**1. The safety layer is regex, not a model.** The brief asks for rules
*in addition to* the model. This goes further: safety runs first, on raw text,
and its verdict is not something the model can soften. A model that is right 97%
of the time is an excellent classifier and an unacceptable last line of defence.

**2. Softening downgrades, it never clears.** "My roommate is suicidal" and
"I'm not suicidal, to be clear" both still reach a human — at lower severity, but
they reach one. People disclose their own risk in the third person, and denials
are often prompted by the thing being denied. The only thing fully suppressed is
a short list of literal idioms (`this deadline is killing me`), and that list is
applied to the classifier as well as to safety — otherwise a dead laptop battery
gets scored as bereavement.

**3. Eligibility is boolean, ranking is weighted.** A weighted sum can always be
out-argued by a high score elsewhere, which is the last thing you want when the
question is "is this person qualified to hold a disclosure of abuse". So gates
run first and separately.

**4. Outcome scores are shrunk toward the mean for low-volume counsellors.**
Otherwise a newcomer with two five-star ratings outranks a veteran at 4.6 across
300 sessions, and the "historical outcome" term is really measuring sample size.
`C011` in the fixture data exists to test exactly this.

**5. Distress across multiple domains raises urgency on its own.** Nothing in
the brief's worked example is individually alarming — missed classes, unspoken
fear, poor sleep. It is *high* urgency because all three are happening at once.
The engine encodes that as a compounding rule rather than needing a scary phrase.

---

## What I would want challenged

- **The taxonomy has 14 categories, not the 12 in the brief.** I added
  `financial_precarity` and `discrimination_identity` because they came up
  constantly when writing realistic diaspora scenarios and both route to
  genuinely different counsellors. That is my judgement and it may be wrong;
  they are cheap to remove.
- **Lexicon scoring keys on topic words regardless of sentiment.** "My manager is
  great, my problem is my girlfriend" can still score `manager_conflict`. Case
  `H064` tests this and is expected to be hard. An embedding-based scorer would
  handle it better; I chose explainability first, on the grounds that a
  coordinator who cannot see why will not trust the tool.
- **Non-English and code-switched intake is barely supported.** `H063` documents
  it. Hinglish gets partial credit only because the English fragments carry
  enough signal. For a service explicitly built for Indians abroad this is the
  most serious functional gap in the prototype.
- **The weights are assumptions.** They are the brief's numbers, unvalidated.
  Do not present them as tuned.

---

## Layout

```
niya_triage/          the engine (standard library only)
  taxonomy.py         14 categories, 14 pathways, NIYA ID mappings
  safety.py           rule layer: 17 rules, severity ladder, softeners
  emergency.py        crisis directory for 12 countries + generic fallback
  classifier.py       weighted lexicon scorer
  llm.py              optional second opinion, fails closed
  matching.py         hard gates + weighted MatchScore
  counsellors.py      schema + repository
  pipeline.py         orchestration
  audit.py            hash-chained, tamper-evident decision log
  redact.py           PII scrubbing for stored/exported text
  availability.py     UTC slot generation, per-viewer rendering
  booking.py          holds, verified payment, joining window
  contact.py          email/phone validation and masking
  notifications.py    email + SMS templates, written to an outbox
  tz.py               zoneinfo resolution, DST-correct

webapp/               THE DEPLOYABLE APP
  main.py             FastAPI setup, security headers, health check
  views.py            every page route
  models.py           accounts, sessions, cases, bookings, payments, messages
  security.py         bcrypt passwords, revocable server-side sessions
  booking_service.py  holds, verified payment, joining window, ownership checks
  payments.py         Razorpay, or simulated when no keys are set
  notify.py           SendGrid + Twilio, or queued when no keys are set
  templates/          server-rendered HTML
  static/app.css      one mobile-first stylesheet, no framework

api/app.py            FastAPI intake + booking API   (internal, no auth)
ui/app.py             Streamlit review dashboard     (internal, no auth)
data/                 synthetic counsellors, hand-written hard cases
scripts/demo.py       three-case smoke test, no dependencies - run this first
scripts/render_preview.py  render every page for layout review
scripts/send_due_notifications.py  the reminder cron job
eval/evaluate.py      metrics + error analysis
tests/                pytest suite, safety-first
docs/                 taxonomy, schema, evaluation, privacy, deployment
Dockerfile            the deployed image, for Render
```

## Documentation

- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — deploying to Render, the `niyatriage` database, and **what is not done yet**
- [`docs/ADMIN_AND_EXPERTS.md`](docs/ADMIN_AND_EXPERTS.md) — the three roles, per-counsellor pricing, onboarding, and why the fee is snapshotted
- [`docs/TAXONOMY.md`](docs/TAXONOMY.md) — categories, signals, urgency rules, and the gaps in NIYA's current vocabulary
- [`docs/COUNSELLOR_SCHEMA.md`](docs/COUNSELLOR_SCHEMA.md) — proposed schema against the existing `accounts` columns
- [`docs/BOOKING.md`](docs/BOOKING.md) — the booking journey, and **five defects found in the live NIYA booking flow** while building it
- [`docs/EVALUATION.md`](docs/EVALUATION.md) — methodology, why the two datasets are reported separately, business-impact model
- [`docs/PRIVACY_AND_DEPLOYMENT.md`](docs/PRIVACY_AND_DEPLOYMENT.md) — data handling, retention, hosting, what must change before production
- [`docs/INTEGRATION_PROPOSAL.md`](docs/INTEGRATION_PROPOSAL.md) — **proposal only**; how a Rails hookup would work, implementing nothing

---

## Safety notice

This prototype makes routing suggestions. It does not assess clinical risk, and
its risk flags are a prompt for a human to look, never a conclusion.

The crisis numbers in `niya_triage/emergency.py` are correct to the best of the
author's knowledge but **must be verified against official sources and given a
named owner before this is shown to a single real user.**
