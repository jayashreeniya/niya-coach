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
| `SENDGRID_API_KEY` | No | Absent means email queues instead of sending |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_FROM_NUMBER` | No | Absent means SMS queues instead of sending |

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
