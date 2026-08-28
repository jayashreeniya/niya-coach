# Deploying the triage app

The app is a single Docker container: FastAPI serving server-rendered HTML, with
the triage engine running in-process. It deploys the same way the rest of NIYA
does — a Render web service built from a Dockerfile — and it is **standalone**.
It has its own accounts, its own database, and it reads nothing from
`niya-backend` or `niya_admin_db`.

## What this runs on

I originally wrote this section for Azure, because `back-end/DEPLOYMENT.md` and
the Bicep templates in the repository describe an Azure Container Apps setup.
Those are stale. The live configuration is:

| Thing | Where it actually is |
| --- | --- |
| Services | Render, Docker web services, defined in `render.yaml` at the repo root |
| Backend URL | `https://niya-backend-oiut.onrender.com`, hardcoded in the frontends |
| Database | TiDB Cloud, MySQL wire-compatible, `gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000` |
| Azure | Used only for Speech and Translator APIs in `niya-practice`, not for hosting |

So this deploys as a third service in the existing `render.yaml`, with a new
`niyatriage` database on the TiDB cluster you already pay for.

## Adding the database

`niyatriage` is a **separate database on the same cluster**, not new
infrastructure and not a schema inside `niya_admin_db`. Separate means a mistake
in this app cannot write to a table the Rails app depends on.

```sql
CREATE DATABASE niyatriage CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'niyatriage'@'%' IDENTIFIED BY '<a strong password>';
-- Deliberately scoped to one database. No access to niya_admin_db.
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX, ALTER, REFERENCES
  ON niyatriage.* TO 'niyatriage'@'%';
FLUSH PRIVILEGES;
```

TiDB Cloud requires TLS, so the connection string needs the SSL parameters:

```
mysql+pymysql://niyatriage:<password>@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/niyatriage?ssl_verify_cert=true&ssl_verify_identity=true
```

`cryptography` is in `requirements.txt` because PyMySQL needs it for that
handshake.

## Deploying

`render.yaml` already contains the two services. Two more have been added:

* **`niya-triage`** — the web service. Health check at `/healthz`, which returns
  503 if the database is unreachable, so a bad deploy fails rather than serving
  errors.
* **`niya-triage-reminders`** — a cron job on the same image, running
  `scripts/send_due_notifications.py` every five minutes.

The reminder sender is a cron job rather than a thread inside the web service on
purpose: a web service scaled to two replicas would run the scheduler twice and
send every reminder twice.

Set these in the Render dashboard (they are `sync: false`, so they are not in
version control):

| Variable | Needed | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Yes | The connection string above |
| `APP_SECRET_KEY` | Yes | `generateValue: true` handles it. Changing it signs everyone out |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | No | Absent means payments are simulated |
| `SMTP_HOST` / `SMTP_USERNAME` / `SMTP_PASSWORD` | For email | Microsoft 365 is `smtp.office365.com`. `SMTP_PORT` defaults to 587 |
| `SENDGRID_API_KEY` | No | Alternative to SMTP. SMTP wins if both are set |
| `EMAIL_FROM` | With either | A mailbox you may send as. See below |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_FROM_NUMBER` | No | Absent means SMS queues instead of sending |
| `TWILIO_API_KEY_SID` / `TWILIO_API_KEY_SECRET` | No | Absent means the session page stays a placeholder. See `VIDEO.md` |

## Checking credentials actually work

`/healthz` reports what each provider said, not merely whether variables were
set. The two are easily confused, and a key that is present but rejected fails
silently: video fails when someone tries to join, and email fails in a
background job where nobody sees the error.

| Reading | Meaning |
| --- | --- |
| `outbox only` / `not connected` | Nothing configured. Queued or placeholder. |
| `sendgrid (verified)` / `twilio (verified)` | The provider accepted the credentials at startup. |
| `sendgrid BROKEN: …` / `twilio BROKEN: …` | Configured and rejected. Fix before anyone relies on it. |

Failures are also logged as errors in the deploy log. The checks never stop the
app booting: a transient network problem should not take down everything that
has nothing to do with email or video.

One thing they cannot establish is whether `EMAIL_FROM` is an address the
provider will let you send as. Microsoft 365 refuses a `From` the authenticated
mailbox has no permission for, and SendGrid refuses one it has not verified.
Both only at send time, so neither can be checked at startup.

## Which email route to use

**Microsoft 365 SMTP.** It is what the Rails app sends through, so its
deliverability is already proven, and it costs nothing beyond the mailbox you
have.

```
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USERNAME=hello@niya.app
SMTP_PASSWORD=<the mailbox password>
EMAIL_FROM=hello@niya.app
```

Two things to know about it. The password is a full mailbox credential rather
than a scoped key, so whatever holds it can read that mailbox as well as send
from it; a dedicated `noreply@` mailbox limits the damage if it leaks.
Microsoft has also been progressively retiring basic authentication for SMTP
submission in Exchange Online, so confirm your tenant still permits it before
depending on this.

SendGrid remains supported and needs no code change to use, but NIYA's account
has had a sending allowance of zero since September 2025 — `total 0`, not a
daily limit that had been used up — which is why the Rails app moved to
Microsoft 365 in the first place. Reviving it means a paid plan or a support
ticket.

The app refuses to start in production without `APP_SECRET_KEY` or with
`DATABASE_URL` still pointing at SQLite. Failing to boot is better than running:
without a stable signing key every restart silently signs all users out, and
nobody reports that as a bug — they just stop coming back.

Point a subdomain (`triage.niya.app`) at the service and set `BASE_URL` to
match, because it goes into the links in confirmation emails.

## Verifying a deploy

```bash
curl https://triage.niya.app/healthz
```

```json
{
  "environment": "production",
  "database_target": "gateway01...:4000/niyatriage",
  "payments": "simulated",
  "email": "outbox only",
  "sms": "outbox only",
  "status": "ok",
  "database": "ok"
}
```

`payments`, `email` and `sms` tell you what is actually live. If you have added
Razorpay keys and it still says `simulated`, the variable did not reach the
container.

## Schema changes

There is no Alembic here. `create_all` adds missing tables and columns on
startup but never alters an existing column, so a change to a column's *type*
has to be applied by hand before the version that expects it is deployed.

`webapp/schema_check.py` runs at startup and compares the live database against
the models. In production it refuses to boot on a mismatch, which is deliberate:
Render keeps the previous version serving when a deploy fails to start, so a
refusal is a non-event, whereas booting against a wrong schema is either a 500
on every affected page or — worse — a silent truncation nobody notices.

It reports two kinds of drift, and treats them differently on purpose:

| Reported as | Meaning | In production | Why |
|---|---|---|---|
| `missing <column>` | The model has it, the database does not | Refuses to start | Breaks every request touching it, now |
| `holds N characters, model expects text` | The column is too short | Warns at every boot | Only bites once the data outgrows it |

The second is a warning rather than a refusal so that a pending column widening
does not block an unrelated deploy. It still needs applying: when the value
finally exceeds the column, MySQL either truncates it or rejects the write, and
neither is something you want to discover from a client seeing half a list.

Applied so far, in order:

```sql
-- August 2026: the client is shown every eligible counsellor rather than a
-- capped three, so this column has to hold the whole ranked list. At five
-- characters per reference, varchar(255) ran out at about forty counsellors
-- and would have dropped the tail of the list without an error.
ALTER TABLE triage_cases MODIFY shortlist_ids TEXT NOT NULL;
```

Run it against `niyatriage` before deploying, and re-check `/healthz` after. It
is safe to apply early: the previous version writes short values that fit a text
column perfectly well, so there is no window where one or the other is broken.

## Running it locally

No database or credentials needed — it defaults to SQLite and simulated
providers.

```powershell
cd niya-triage-engine
.\.venv\Scripts\Activate.ps1
$env:APP_SECRET_KEY = "local-development-secret-key-long-enough"
python -m uvicorn webapp.main:app --reload --port 8080
```

To review the layout without signing in, `python scripts/render_preview.py`
renders every page to `webapp/preview/` using the real templates and stylesheet.

## What is not done

Being straight about this, because the gap between "demonstrated" and
"production" is where projects get into trouble.

**The video call is not built.** Everything around it works: the joining window
is enforced server-side, the room id and a token are issued, join and leave are
recorded. There is no video provider behind it. NIYA already uses VideoSDK in
the Rails app and Twilio elsewhere; wiring one in means replacing the token stub
in `booking_service.authorise_connection` and putting the client SDK on
`session.html`. Until that is done the session page says so rather than
pretending.

**Refunds are recorded, not issued.** Cancelling a paid booking sets the payment
to `refund_due`. Actually moving the money needs a Razorpay refunds call. Until
that exists, someone has to process those manually, and nothing in the app tells
them to — a report of `refund_due` payments is the smallest useful next step.

**Schema changes need Alembic.** Startup uses `create_all`, which creates
missing tables but never alters existing ones. That is fine now and will
silently do nothing the first time a column changes after real data exists.
Add Alembic before the first schema change in production.

**Email addresses are not verified.** `email_verified` exists and defaults to
false; nothing sends a confirmation link yet. Someone can sign up with an
address they do not own and will simply never receive their reminders.

**No counsellor-side interface.** Counsellors come from `data/counsellors.json`,
which is synthetic. There is no way for a counsellor to sign in, see their
diary, or join a call. The whole app is currently the client's half of the
journey.

**Free plan limits.** The web service is on Render's free plan to match the
others, which sleeps after inactivity — the first request after a quiet period
takes tens of seconds. That is a poor first impression for someone who has just
worked up to asking for help, and worth a paid instance before real users see
it. The cron job is on `starter` because free plans cannot run cron.
