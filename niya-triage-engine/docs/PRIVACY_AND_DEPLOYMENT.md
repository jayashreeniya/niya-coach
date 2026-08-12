# Privacy and deployment recommendations

This prototype processes some of the most sensitive personal data there is:
unstructured mental-health disclosures from identifiable individuals, many of
them in countries with strict data-protection regimes (UK/EU GDPR, Canada's
PIPEDA, Australia's Privacy Act). Nothing below is optional for production.

## Data classification

| Data | Sensitivity | Where it currently goes |
|---|---|---|
| Free-text intake | **Special category** (health data under GDPR Art. 9) | In memory; redacted copy to the audit log |
| Risk flags and safety rationale | **Special category** | Audit log |
| Country, timezone, languages | Personal | Audit log, unredacted |
| Counsellor shortlist and scores | Commercially sensitive | Audit log |
| Intake text hash | Pseudonymous | Audit log |

## What the prototype does today

**Redaction before storage.** `niya_triage/redact.py` strips emails, phone
numbers, URLs, ID numbers, UK/Canadian postcodes, institution names, employer
names and ~45 city names before anything is written to storage. The original
text is never persisted — only a SHA-256 fingerprint, so a specific case can be
located without retaining the disclosure.

**Redaction does not remove personal names.** It is regex-based, and "Priya" is
not distinguishable from an ordinary word by pattern alone. `"My name is Priya
Sharma"` survives redaction intact. This is stated plainly because an earlier
version of this document claimed names were stripped, and a privacy control
people rely on must not be described as stronger than it is. Two consequences:

* The intake page asks people not to type names, rather than implying it does not
  matter.
* A name-detection pass (NER) is required before this data is retained at scale.
  Until then, treat the redacted text as pseudonymous at best, not anonymous.

**Redaction is deliberately NOT applied to what the counsellor reads.** Stripping
"my mother" or a place name out of a disclosure would make the handover worse and
could make it unsafe. Redaction protects the *archive*, not the *conversation*.

**Tamper-evident audit.** Each log entry carries the hash of the previous entry.
`AuditLog.verify()` recomputes the chain and reports the first altered entry.
This matters because the point of a safety audit is to answer "has this record
been changed since it was written", which an ordinary log file cannot.

**The LLM is off by default.** No text leaves the process unless someone sets
`OPENAI_API_KEY`. The engine is fully functional without it.

## What is NOT production-ready

Stated bluntly, because a prototype that hides its gaps is dangerous.

Two things listed here have since been addressed in the deployable app
(`webapp/`), and are marked as such. Everything else still stands, and the
gaps below apply to the prototype API (`api/`) and the Streamlit dashboard
(`ui/`), which are **internal tools and must not be exposed publicly**.

| Gap | Risk | Fix |
|---|---|---|
| Audit log is a local JSONL file | No access control; anyone with disk access reads flagged cases | Move into the database with row-level access control and column encryption |
| No authentication on `api/` or `ui/` | `/review/queue` exposes every flagged case unauthenticated | **Done for `webapp/`** (accounts, server-side sessions, per-account scoping). Still open for the prototype tools — do not deploy them |
| CORS is `allow_origins=["*"]` on `api/` | Any site can call the API | Restrict to NIYA origins. `webapp/` sets no permissive CORS |
| No rate limiting | Abuse and cost exposure | Per-IP limits. `webapp/` throttles sign-in only; intake and booking are still unlimited |
| No retention policy | Special-category data kept forever | See below. Nothing deletes `triage_cases` today |
| Redaction misses names | Names persist in stored text | Add a NER pass; treat regex as defence-in-depth only |
| Crisis numbers are hardcoded in source | Could go stale silently | Move to a reviewed, dated, owned config with an expiry check |
| ~~Timezone handling ignores DST~~ | ~~Up to 1h scheduling error~~ | **Done.** `niya_triage/tz.py` uses `zoneinfo` resolved against the session instant, with `tzdata` pinned. Covered by `tests/test_timezones.py` |
| No data-subject-access mechanism | GDPR Art. 15/17 non-compliance | Build export and erasure keyed on the account |

## Retention

Recommended, subject to NIYA's legal advice:

- **Raw intake text: never persisted.** Held in memory for the request only.
- **Redacted text: 90 days**, then deleted. Long enough for quality review and
  dispute resolution.
- **Structured decisions** (category, urgency, flags, chosen counsellor):
  **24 months**, for calibration and audit.
- **Safety-flagged cases: 7 years**, or whatever local clinical-records law
  requires — this is the one category where over-retention is defensible and
  under-retention is not.
- **Aggregates: indefinite.**

Retention must be enforced by a scheduled job, not by policy documents.

## If the LLM is enabled

1. **Redact before sending.** Currently `llm.get_opinion()` sends the raw text.
   For production, route it through `redact.redact()` first and measure the
   accuracy cost — it will be non-zero and needs to be an informed trade.
2. **Zero-retention endpoint.** Use a provider tier contractually barred from
   training on the data, with a signed DPA.
3. **Data residency.** UK/EU users' data should not leave the region. This may
   mean a regional deployment or an in-region model.
4. **Consent.** Users must be told plainly, before typing, that an automated
   system reads what they write. Burying it in terms is not consent.
5. **The safety layer must keep working when the model is unavailable.** It does,
   by design, and there is a test for it.

## Hosting

What this actually deploys onto is in [DEPLOYMENT.md](DEPLOYMENT.md): Render
Docker services, and a `niyatriage` database on the existing TiDB Cloud cluster.
The privacy-relevant points:

- **Dashboard**: behind SSO, never public. The Streamlit dashboard has no
  authentication and is not deployed.
- **Database**: `niyatriage` is a separate database with a user granted rights to
  nothing else, so a fault here cannot reach `niya_admin_db`.
- **Data residency**: the TiDB cluster is in `ap-southeast-1`. UK and EU users'
  special-category data therefore leaves its region, which needs either a
  transfer mechanism (SCCs) or an in-region deployment. **This needs a legal
  answer before real users, not after.**
- **Secrets**: Render environment variables, `sync: false` so they are never in
  the repository.
- **Logs**: scrub free text at the logging layer — the most common leak is an
  exception handler printing the payload. `webapp/` logs no request bodies.

## Human oversight, which is the real control

The technical controls matter less than this: **a flagged case must reach a
named human within a defined time, and someone must be accountable when it does
not.**

Minimum viable operating model:

1. On-call rota with a defined response SLA for ACTIVE flags.
2. Alerting that does not depend on someone watching a dashboard.
3. A weekly review of all flagged cases, including false positives — those are
   the calibration signal.
4. A documented procedure for what the responder actually does, written by a
   clinician, not an engineer.
5. A kill switch that reverts to fully manual triage, tested before launch.

Without an on-call rota, the safety layer is theatre. It detects risk perfectly
and hands it to nobody.
