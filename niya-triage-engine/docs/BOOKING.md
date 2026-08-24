# Booking, payment and joining

How the prototype takes a triage result through to a session someone can join,
and where it deliberately differs from the live NIYA app.

Nothing in this prototype touches NIYA's Rails backend, its database, or any
payment or messaging provider. Bookings live in `bookings/bookings.json` and
notifications are appended to `bookings/outbox.jsonl` instead of being sent.

---

## 1. The journey

```
triage result
  -> choose a counsellor from the shortlist
  -> choose a timezone, a day, a time
  -> give an email address and/or a mobile number
  -> hold the slot                    (nothing charged yet)
  -> pay                              (verified server-side)
  -> confirmed; notifications queued
  -> Connect now opens 5 min before, closes 5 min after
```

Implemented across `niya_triage/availability.py`, `booking.py`, `contact.py` and
`notifications.py`, surfaced in `ui/booking_view.py` and `api/app.py`.

---

## 2. What the live app does today

Established by reading `back-end`, `Niya-Web-main` and `front-end`. Sources are
cited so each claim can be checked.

| Concern | Live behaviour | Where |
|---|---|---|
| Availability | Per-coach, per-day rows with a JSON `timeslots` array of 12-hour wall-clock strings | `availabilities` table, `db/schema.rb` |
| Slot length | 14-minute slots stepped every 15 minutes; UI books 60 min as `:00`–`:59` | `time_slots_calculator.rb` |
| Coach matching | Focus-area overlap, `activated`, unbooked, not-past | `booked_slots_controller.rb#view_coach_availability` |
| Payment | Razorpay hosted Payment Button, redirect out and back | `Bookappointment.js` |
| Booking creation | After payment, on the success page | `PaymentSuccess.js` |
| Confirmation | Two emails via SendGrid | `AppointmentMailer`, `#confirm_payment` |
| Video | Twilio Video, room per booking | `twilio_video_service.rb` |
| Join window | Start until end + 5 min, checked in React only | `MyAppointments.js` |

---

## 3. Five defects found, and what this prototype does instead

These are ranked by how much damage they can do. Each was found by reading the
live code, not inferred.

### 3.1 There is no timezone data anywhere — *highest impact for NIYA Abroad*

No table in `schema.rb` has a timezone column. The booking controller hardcodes
`TIME_ZONE='Asia/Kolkata'`, and every stored time is an IST wall-clock string
such as `"09:00 AM"`. Neither the web nor the mobile UI offers a timezone
selector.

A student in Toronto picking "9:00" is booked into 09:00 India time, which is
23:30 the previous evening for them. Nothing in the interface tells them.

For a product serving Indian students *abroad*, this is not a rough edge; it is
the core scheduling assumption being wrong for the entire target market.

**Here:** every slot is a timezone-aware UTC instant. Wall-clock time is produced
only at render, per viewer. The booking screen leads with a timezone selector
defaulted from the intake, every slot is labelled with both parties' local
times, and the confirmation states both. See `availability.py`.

Pinned by `test_the_same_slot_reads_differently_in_two_timezones`.

### 3.2 Payment is not verified, and can be skipped entirely

There is no Razorpay gem, no order creation, no signature check and no webhook.
Payment success is inferred from a URL parameter on `/payment-success`, which
then creates the booking. Anyone who navigates to that route with booking
details in local storage gets a session without paying. The mobile app posts
straight to `booked_slots` with no payment step at all.

**Here:** the server computes an expected signature over the amount it set, and
`confirm_payment` refuses anything that does not match. Verification failure
leaves the slot held rather than silently released.

Pinned by `test_a_forged_payment_is_rejected`.

### 3.3 Payment references are written to columns that do not exist

```ruby
booked_slot.update(payment_status: 'paid', payment_id: payment_id) if booked_slot.respond_to?(:payment_status)
```

`bx_block_appointment_management_booked_slots` has neither column, so the guard
is false and the update is a no-op that fails silently. No booking can be
reconciled against a Razorpay transaction, which means disputes, refunds and
revenue reporting have nothing to join on.

**Here:** the provider reference, amount, currency, signature and settlement
time are all part of the stored booking.

Pinned by `test_payment_reference_is_persisted`.

### 3.4 Booking is created after payment, so users can pay for a taken slot

Production redirects to the gateway holding nothing. If someone else books that
slot while the user is on the Razorpay page, the user pays and *then* discovers
the slot is gone — and because of 3.3 there is no payment record to refund
against.

**Here:** hold first, then charge. The hold expires after 15 minutes if unpaid,
so abandoned checkouts release the slot. Confirming twice is idempotent, so
refreshing the success page cannot double-charge.

Pinned by `test_the_same_slot_cannot_be_held_twice` and
`test_confirming_twice_is_idempotent`.

### 3.5 The join window is enforced only in the browser

`isWithinWindow` in `MyAppointments.js` gates the button, but
`GET /bx_block_calendar/booked_slots/video_call` issues a Twilio token to any
authenticated caller holding a booking id, at any time. Calling the API directly
bypasses the rule completely — someone can open a room hours early, or long
after the session ended.

**Here:** `authorise_connection` applies the window at the point the token is
minted, so a modified client gains nothing.

Pinned by `test_the_token_endpoint_enforces_the_window_not_just_the_button`.

### Also worth fixing, lower severity

- **Reminders are written but never scheduled.** `AppointmentNotificationWorker`
  sends a ten-minute warning, but the line enqueuing it exists only in
  `booked_slots_controller.rb.backup-20251113-113204`. The live controller never
  calls it, so no reminder has been sent since that refactor.
- **The 24-hour minimum notice is wrong for triage.** `check_time_validation`
  requires every booking to be a day out. Telling a high-urgency case the
  earliest slot is tomorrow defeats the purpose of triage. Here the notice period
  scales with urgency: 30 minutes at critical, 2 hours at high, 12 at moderate,
  24 at low.
- **Web and mobile send different `start_time` formats.** Web sends `"9:00"`,
  mobile sends `"06:00 AM"`, and `CheckCoachAvailabilitySerializer` matches
  `timeslots[].from` by exact string, so the two clients can see different slots
  for the same coach and day.

---

## 4. The joining window

Requirement: open five minutes before the start, stay open until five minutes
after the end, and allow disconnecting and rejoining throughout.

```
        start-5min                    end                end+5min
            |                          |                     |
   closed   |========== open ==========|===== open ==========|   closed
            ^                                                ^
      button activates                                 button deactivates
```

Reconnection is treated as normal rather than exceptional. Sessions happen on
student wifi and mobile data; a one-shot join button turns a thirty-second
network blip into a missed appointment. Every join and leave is recorded on the
booking, which also gives the coordinator evidence of who actually attended —
the thing production currently infers from `video_call_details` presence flags.

`connect_state` returns a specific reason when joining is refused
(`too_early`, `too_late`, `not_confirmed`, `cancelled`) so the screen can explain
itself rather than showing a dead button.

---

## 5. Notifications

Email and SMS, both written to `bookings/outbox.jsonl` rather than sent.

| Kind | Channels | When |
|---|---|---|
| Confirmation | email, SMS | On payment |
| Counsellor notice | email | On payment |
| Reminder | email, SMS | 24h, 1h and 5 min before |
| Cancellation | email, SMS | On cancel |

At least one contact channel is required before a slot can be held; a booking
nobody can be told about is not a booking. Contact details are stored on the
record so messages can be addressed, and masked everywhere they are displayed,
logged or returned by the API. `test_the_outbox_never_stores_raw_contact_details`
enforces that.

Times in every message are stated in both parties' zones, with the zone named.

**Production substitutions**, when this moves out of prototype:

| Prototype | Production |
|---|---|
| `Outbox.send` (email) | `AppointmentMailer` over SendGrid |
| `Outbox.send` (SMS) | `BxBlockSms::SendSms` over Twilio |
| `reminders()` scheduling | Sidekiq `perform_at`, as the disabled worker already does |
| `contact.normalise_phone` | Phonelib, already a dependency |
| `simulate_gateway_payment` | Razorpay checkout + `verify_payment_signature` + webhook |
| `authorise_connection` token | Twilio access token, minted behind the same check |
| `bookings.json` | A `bookings` table with a unique constraint on `(counsellor_id, slot_start_utc)` |

The unique constraint matters. The prototype prevents double-booking with a
process-level lock, which is correct for one process and not for several; a
database constraint is what makes it true under concurrency.

---

## 6. Known limitations

- **Fixed UTC offsets, no daylight saving.** `tz.py` uses standard-time offsets,
  so a booking made across a DST boundary can be an hour out. Real deployment
  needs `zoneinfo` plus `tzdata`, resolved against the actual session datetime.
  This is the most likely source of a wrong-hour bug and should be fixed first.
- **Availability is generated, not stored.** Slots are derived deterministically
  from `working_hours_local`, so counsellors cannot block out individual times,
  take leave, or vary their week. Production already has `coach_leaves` and
  `coach_par_avails` for this.
- **No counsellor-side screen.** The counsellor's own view of the joining window
  is not built; only the client's.
- **Payment is simulated.** No money moves, and no refund path exists beyond
  marking the record refunded.
- **The clock control on the appointments screen is a prototype affordance** and
  must not survive into anything real.
