# The three sign-ins: client, counsellor, admin

One account table, one session mechanism, one login form. What differs is the
`role` column on `accounts`, which decides where signing in takes you and which
routes will serve you at all.

| Role | Home | Can do |
| --- | --- | --- |
| `client` | `/intake` | Describe a problem, see matches and prices, book, pay, join their own session |
| `counsellor` | `/expert` | See their own confirmed sessions, join them, set their own hours, change their password |
| `admin` | `/admin` | Onboard counsellors, set both prices, take someone off the roster, see margin |

Enforcement is in `webapp/deps.py` (`require_account`, `require_counsellor`,
`require_admin`) and declared in each route's signature, so access control is a
property of the route rather than a check every handler has to remember.

Someone signed in without the right role is **redirected to their own home**
rather than shown a 403. A 403 confirms the page exists; a redirect does not.

## Where the roster lives, and why it moved

Counsellors used to live in `data/counsellors.json`, loaded once at process
start. That cannot work with an onboarding portal on Render, because the
container filesystem is rebuilt from the Docker image on every deploy and every
restart. A counsellor added through a web form and written to that file would
disappear at the next release, with no error and no obvious cause.

So the roster is now the `counsellors` table (`CounsellorProfile` in
`webapp/models.py`). The JSON file is a **seed**: `webapp/bootstrap.py` loads it
into an empty database on first boot and never touches it again. Seeding is
idempotent by reference, so it cannot overwrite a price an admin has set.

The matching engine still works on `niya_triage.counsellors.Counsellor` objects
and knows nothing about any of this. `webapp/roster.py` is the only translation
point, and `to_engine()` deliberately drops every pricing field — a counsellor
must never rank higher because they cost more. `webapp/views.py` builds the
repository per request, so deactivating someone takes effect on the next intake
rather than the next restart.

## Pricing

Two independent amounts per counsellor, both per 60 minute session, both in
minor units (150000 = 1,500.00):

- `counsellor_fee_minor` — what the counsellor is paid
- `client_price_minor` — what the client pays

NIYA's margin is the difference. There is no percentage anywhere in the live
flow: an admin types both numbers, which means the margin can differ per
counsellor without a rule to maintain. Onboarding refuses a client price below
the counsellor fee, because that is a loss on every booking and is almost always
a typo.

The client sees **one total price** and never the split. It appears on each
shortlist card, not once at checkout, so nobody picks a counsellor and discovers
the cost afterwards.

### The fee is snapshotted, not looked up

When a slot is held, `booking_service.hold_slot` copies the split onto the
booking's `Payment` row: `amount_minor`, `counsellor_fee_minor` and
`platform_fee_minor`. Nothing re-reads the profile afterwards.

This matters more than it looks. If the payout were derived from the profile at
reporting time, then repricing a counsellor would retroactively change what every
past session appears to have cost, and the payout report would stop matching what
was actually charged. The snapshot means an already-paid session keeps the price
it was sold at, permanently. `test_repricing_a_counsellor_does_not_change_an_existing_booking`
covers exactly this.

The admin dashboard totals come from those snapshots on paid payments, so
"collected", "owed to counsellors" and "margin" are what happened, not what
today's prices imply.

Currency is single (`SESSION_CURRENCY`, INR by default). No FX conversion exists
anywhere; a counsellor abroad is paid the equivalent in that currency.

## Onboarding a counsellor

`/admin/counsellors/new`. The form captures identity, the two prices, working
hours and timezone, and what they should be matched on.

Giving an email address creates their sign-in: an `Account` with
`role="counsellor"`, linked to the profile by `account_id`, with a generated
one-time password of the form `niya-xxxxxxxx`. That password is **shown to the
admin once** and is not stored in readable form or emailed anywhere. If it is
lost, the counsellor needs a new one rather than a copy of the old.

Leaving the email blank puts someone on the roster with no login. They can be
matched and booked, but cannot see their sessions or join a call, so the
dashboard flags this prominently. Adding a login to an existing profile
afterwards is **not built yet** — see Not done below.

### Two rules worth knowing

Ticking an **area** sets that category's experience to 0.8. The engine wants a
0..1 proficiency per category, and asking an admin to type twenty numbers during
onboarding would guarantee careless data, so a tick means "works in this area"
until real outcome data replaces it. Under-ticking is safer than over-ticking:
a tick is permission for the engine to route those cases to them.

**Escalation capability requires a clinical qualification.** Ticking "can hold a
risk-flagged case" without "clinically qualified" is ignored, whatever the form
says. A risk-flagged case reaching someone unequipped to hold it is the most
damaging thing this system could do, so the constraint is enforced in
`admin_views._apply` rather than trusted to whoever is filling in the form.

Taking a counsellor off the roster removes them from matching immediately and
leaves their existing bookings alone. Cancelling those is a decision for a
person, not a side effect of a checkbox.

## The expert portal

`/expert` lists their confirmed sessions, in their own timezone, with the
client's time shown underneath — the mirror image of what the client sees, from
the same stored UTC value. Held-but-unpaid slots are excluded: a slot someone
may abandon in fifteen minutes is not an appointment, and showing it would have
counsellors planning around sessions that quietly expire.

Every lookup goes through `booking_service.get_counsellor_booking`, which scopes
by counsellor reference. That matters more on this side than the client side: a
counsellor login is a plausible thing for an attacker to obtain, and an unscoped
lookup would turn one compromised account into access to every session in the
system.

**Counsellors are held to the same joining window as clients** — five minutes
before, five minutes after, enforced server-side by the same `connect_state`
code. Letting the professional in early is the obvious exception to make, and
would mean the two sides no longer agree on when a session exists.

Counsellors control their timezone, working hours, maximum active clients, and
whether they are accepting new clients. They cannot see or change their fee;
pricing is an admin decision and appears on no form they can reach.

Changing a timezone moves the slots they offer from then on. It does not move
anything already booked, because bookings are stored in UTC — which is the whole
reason they are stored that way.

## Creating the first administrator

Either set `ADMIN_EMAIL` and `ADMIN_PASSWORD` and restart, which creates the
account on boot and never modifies an existing one, or:

```powershell
.\run.ps1 admin
```

The script prompts for the password rather than taking it as an argument, so it
stays out of shell history, and it makes promoting an existing account require
typing the word `promote`. Prefer the script in production: a password in a
Render environment variable stays there indefinitely.

## Schema changes after this point

`Base.metadata.create_all` creates missing tables but **never alters existing
ones**. Adding the `counsellors` table and the two new `payments` columns is
therefore invisible to a database created before them, and shows up as
`no such column: payments.platform_fee_minor` in the middle of a page.

`webapp/schema_check.py` now compares the models against the live database at
startup: a warning in development, and a refusal to start in production, naming
exactly what is missing. A failed deploy is visible immediately and Render keeps
the previous version serving; broken pages are not.

Locally, rebuild rather than migrate:

```powershell
.\run.ps1 reset
```

It refuses to run when `DATABASE_URL` points at anything other than SQLite.

For production the honest position is unchanged: the next schema change after
real data exists needs Alembic. The startup check makes forgetting loud rather
than making the migration unnecessary.

## Not done

- **Adding a login to an existing roster entry.** Onboarding creates one if an
  email is given; there is no route to attach one later. The edit form says so
  rather than offering a field that does nothing.
- **Password reset for counsellors.** They can change a password they know
  (`/expert/password`). Someone who loses the one-time password needs an admin to
  issue a new account.
- **Counsellors setting per-day hours or holidays.** One start and end time
  applies to every weekday. A counsellor who works Saturday mornings only cannot
  express that.
- **Refunds.** Cancelling a paid booking sets `payment.status = "refund_due"`,
  which records the intent. Moving the money needs a Razorpay refunds call.
- **Admin editing an existing counsellor's email address.** Deliberate: the
  address is the login, and changing it silently is an account takeover in the
  wrong hands.
- **An audit trail on admin actions.** Repricing and deactivation are not
  logged to the hash-chained audit log the triage decisions use. Worth adding
  before more than one person has admin access.
