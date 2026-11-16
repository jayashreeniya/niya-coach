"""Booking and appointments screens for the Streamlit prototype.

Kept separate from `ui/app.py` because the booking journey is a different
product surface from triage: triage decides, booking transacts.

Two deliberate choices worth knowing about:

* **The timezone selector is prominent and defaulted from the intake.** NIYA's
  current web app has no timezone control at all, so a student abroad picks a
  time on an IST calendar without being told. Here the user's zone is chosen
  first and every time on the screen is rendered in it, with the counsellor's
  local time shown alongside so nobody is surprised.

* **There is a "pretend it is" control on the appointments screen.** Without it
  the connect window is undemonstrable - you would have to book a session and
  wait until five minutes before it started. It is clearly labelled as a
  prototype affordance.
"""

from __future__ import annotations

from datetime import date, datetime, timedelta, timezone
from typing import List, Optional

import streamlit as st

from niya_triage import config
from niya_triage.availability import available_days, available_slots, to_zone, utc_now
from niya_triage.booking import (
    HOLD_MINUTES,
    Booking,
    BookingError,
    BookingStatus,
    authorise_connection,
    connect_state,
    default_store,
    simulate_gateway_payment,
)
from niya_triage.contact import collect
from niya_triage.counsellors import default_repository
from niya_triage.notifications import (
    default_outbox,
    format_when,
    notify_booking_cancelled,
    notify_booking_confirmed,
)
from niya_triage.tz import known_zones

PURPLE = "#6c4ab6"


def _money(amount_minor: int, currency: str) -> str:
    return f"{amount_minor / 100:,.2f} {currency}"


def _zone_options(preferred: str) -> List[str]:
    zones = known_zones()
    if preferred and preferred.lower() not in [z.lower() for z in zones]:
        zones = [preferred] + zones
    return zones


def _zone_index(zones: List[str], preferred: str) -> int:
    lowered = [zone.lower() for zone in zones]
    try:
        return lowered.index((preferred or "utc").lower())
    except ValueError:
        return lowered.index("utc") if "utc" in lowered else 0


# ---------------------------------------------------------------------------
# Book a session
# ---------------------------------------------------------------------------


def render_booking_tab() -> None:
    st.subheader("Book a session")

    result = st.session_state.get("last_result")
    if result is None:
        st.info("Run an intake on the first tab, then come back here to book.")
        return

    if result.safety and result.safety.block_automated_pathway:
        st.error(
            "This case was flagged by the safety layer, so automatic booking is "
            "switched off. A trained member of the team owns this case and will "
            "make contact directly."
        )
        return

    if not result.shortlist:
        st.warning(
            "No counsellor met the eligibility gates for this case, so there is "
            "nothing to book. A coordinator will arrange this personally."
        )
        return

    store = default_store()
    repository = default_repository()

    # ---- step 1: who -----------------------------------------------------
    st.markdown("##### 1. Choose who you would like to see")
    options = {
        f"{match.display_name}  -  match {match.score:.0%}": match.counsellor_id
        for match in result.shortlist
    }
    chosen_label = st.radio(
        "Recommended for you",
        list(options.keys()),
        label_visibility="collapsed",
    )
    counsellor = repository.get(options[chosen_label])
    if counsellor is None:
        st.error("That counsellor is no longer in the roster.")
        return

    match = next(m for m in result.shortlist if m.counsellor_id == counsellor.id)
    with st.expander("Why this person?", expanded=False):
        for reason in match.rationale:
            st.markdown(f"- {reason}")

    # ---- step 2: when ----------------------------------------------------
    st.markdown("##### 2. Pick a time")

    zones = _zone_options(result_timezone := st.session_state.get("intake_timezone", "UTC"))
    client_zone = st.selectbox(
        "Your timezone",
        zones,
        index=_zone_index(zones, result_timezone),
        help=(
            "Every time below is shown in this zone. The counsellor's local time is "
            "shown too, so you can both see the same moment."
        ),
    )

    st.caption(
        f"{counsellor.display_name} works in **{counsellor.timezone}**. "
        f"Urgency **{result.urgency.value}** means the earliest session can be "
        f"{_notice_phrase(result.urgency.value)}."
    )

    taken = store.taken_slot_ids(counsellor.id)
    days = available_days(
        counsellor,
        taken_slot_ids=taken,
        urgency=result.urgency.value,
        viewer_timezone=client_zone,
    )
    if not days:
        st.warning("This counsellor has no free slots in the next two weeks.")
        return

    day_labels = {day.strftime("%A %d %B"): day for day in days}
    chosen_day_label = st.selectbox(
        "Day",
        list(day_labels.keys()),
        help="Only days with at least one free slot are listed.",
    )
    chosen_day: date = day_labels[chosen_day_label]

    slots = available_slots(
        counsellor,
        taken_slot_ids=taken,
        urgency=result.urgency.value,
        on_date_local=chosen_day,
        viewer_timezone=client_zone,
    )
    if not slots:
        st.warning("No slots left on that day.")
        return

    slot_labels = {}
    for slot in slots:
        yours = slot.start_in(client_zone)
        theirs = slot.start_in(counsellor.timezone)
        slot_labels[f"{yours:%H:%M}  (their time {theirs:%H:%M})"] = slot

    chosen_slot_label = st.radio(
        "Time",
        list(slot_labels.keys()),
        horizontal=True,
        label_visibility="collapsed",
    )
    slot = slot_labels[chosen_slot_label]

    st.success(
        f"**{slot.start_in(client_zone):%A %d %B, %H:%M}** your time in {client_zone} "
        f"= **{slot.start_in(counsellor.timezone):%H:%M}** for {counsellor.display_name} "
        f"in {counsellor.timezone}."
    )

    # ---- steps 3 and 4: contact, then reserve -----------------------------
    # These live in a form so all three fields commit together on submit.
    # Validating them live and disabling the button instead would mean the button
    # stays greyed out until Streamlit happens to rerun, which reads as broken.
    held_id = st.session_state.get("held_booking_id")
    held = store.get(held_id) if held_id else None
    if held is not None and held.status != BookingStatus.HELD:
        held = None
        st.session_state.pop("held_booking_id", None)

    if held is None:
        st.markdown("##### 3. Where should we send the confirmation?")
        st.caption(
            "We need at least one of these so the confirmation and the reminders can "
            "reach you. Details are stored masked and are never written to the audit log."
        )

        with st.form("contact_and_reserve"):
            col1, col2, col3 = st.columns(3)
            with col1:
                full_name = st.text_input(
                    "Your name", value=st.session_state.get("client_name", "")
                )
            with col2:
                email = st.text_input("Email", value=st.session_state.get("client_email", ""))
            with col3:
                phone = st.text_input(
                    "Mobile number",
                    value=st.session_state.get("client_phone", ""),
                    help="Include your country code, or we will infer it from your country.",
                )

            st.markdown("##### 4. Confirm and pay")
            st.markdown(
                f"**{_money(config.SESSION_PRICE_MINOR, config.SESSION_CURRENCY)}** "
                f"for a 60 minute session. Nothing is charged until the next step."
            )
            reserve = st.form_submit_button(
                "Reserve this slot", type="primary", use_container_width=True
            )

        if reserve:
            contact = collect(
                email=email,
                phone=phone,
                full_name=full_name,
                country=st.session_state.get("intake_country", ""),
            )
            if not contact.is_valid:
                for message in contact.errors.values():
                    st.error(message)
            else:
                try:
                    booking = store.hold(
                        case_id=result.case_id,
                        counsellor_id=counsellor.id,
                        counsellor_name=counsellor.display_name,
                        counsellor_timezone=counsellor.timezone,
                        slot_id=slot.id,
                        contact=contact,
                        client_timezone=client_zone,
                        urgency=result.urgency.value,
                        primary_category=result.primary_category,
                    )
                except BookingError as error:
                    st.error(str(error))
                else:
                    st.session_state["held_booking_id"] = booking.id
                    st.session_state["client_name"] = full_name
                    st.session_state["client_email"] = email
                    st.session_state["client_phone"] = phone
                    st.rerun()
    else:
        st.markdown("##### 4. Confirm and pay")
        st.info(
            f"Slot reserved for you until "
            f"**{to_zone(datetime.fromisoformat(held.hold_expires_at), client_zone):%H:%M}** "
            f"({HOLD_MINUTES} minutes). The slot is held first, so nobody can take it "
            f"while you pay."
        )
        st.caption(
            "In production this is where Razorpay's checkout would open. The button "
            "below stands in for a successful charge; the signature it returns is "
            "then verified server-side before the booking is confirmed."
        )

        pay_col, cancel_col = st.columns([3, 1])
        with pay_col:
            if st.button(
                f"Pay {_money(held.payment.amount_minor, held.payment.currency)} (simulated)",
                type="primary",
                use_container_width=True,
            ):
                gateway = simulate_gateway_payment(held)
                try:
                    confirmed = store.confirm_payment(
                        held.id, gateway["provider_reference"], gateway["signature"]
                    )
                except BookingError as error:
                    st.error(str(error))
                else:
                    notify_booking_confirmed(confirmed, outbox=default_outbox())
                    st.session_state.pop("held_booking_id", None)
                    st.session_state["just_booked"] = confirmed.id
                    st.session_state.setdefault("my_booking_ids", []).append(confirmed.id)
                    st.rerun()
        with cancel_col:
            if st.button("Release", use_container_width=True):
                store.cancel(held.id, reason="hold released by user")
                st.session_state.pop("held_booking_id", None)
                st.rerun()

    just_booked = st.session_state.pop("just_booked", None)
    if just_booked:
        booking = store.get(just_booked)
        if booking:
            sent_to = [
                label
                for label, value in (("email", booking.contact_email), ("SMS", booking.contact_phone))
                if value
            ]
            st.balloons()
            st.success(
                f"Booked. Reference **{booking.id}**. Confirmation sent by "
                f"{' and '.join(sent_to) or 'your chosen channel'}. "
                f"See the **My appointments** tab to join."
            )


def _notice_phrase(urgency: str) -> str:
    from niya_triage.availability import minimum_notice_hours

    hours = minimum_notice_hours(urgency)
    if hours < 1:
        return f"in {int(hours * 60)} minutes"
    if hours == 1:
        return "in an hour"
    return f"in {int(hours)} hours"


# ---------------------------------------------------------------------------
# My appointments
# ---------------------------------------------------------------------------


def render_appointments_tab() -> None:
    st.subheader("My appointments")

    store = default_store()
    live = {BookingStatus.CONFIRMED, BookingStatus.COMPLETED, BookingStatus.HELD}
    everything = [booking for booking in store.all() if booking.status in live]

    # Scope to what this browser session booked. The store is shared across
    # everyone using the prototype, and an appointments screen that lists every
    # booking in the system is a privacy defect, not just a confusing one. There
    # is no auth here to scope by, so the session's own booking ids stand in for
    # the authenticated user a real deployment would have.
    mine_ids = set(st.session_state.get("my_booking_ids", []))
    mine = [booking for booking in everything if booking.id in mine_ids]
    others = [booking for booking in everything if booking.id not in mine_ids]

    show_all = False
    if others:
        show_all = st.checkbox(
            f"Also show {len(others)} booking(s) made outside this session",
            value=not mine,
            help=(
                "Prototype only. Seeded demo data and bookings from other browser "
                "sessions live in the same file. A real deployment would scope this "
                "to the signed-in user."
            ),
        )

    bookings = mine + (others if show_all else [])
    bookings.sort(key=lambda item: item.start)

    if not bookings:
        st.info("Nothing booked yet. Use the **Book a session** tab.")
        return

    now = _clock_control()

    for booking in bookings:
        _render_booking_card(booking, store, now, owned=booking.id in mine_ids)


def _clock_control() -> datetime:
    """A time-travel control, so the connect window can actually be demonstrated.

    Without this you would have to book a session and then wait until five
    minutes before it started to see the button turn on.
    """
    with st.expander("Prototype control: pretend it is a different time", expanded=False):
        st.caption(
            "Only in this prototype. It moves the clock the app checks against, so "
            "you can watch the Connect now button open and close without waiting."
        )
        offset = st.slider(
            "Shift the clock by (hours)",
            min_value=-2.0,
            max_value=72.0,
            value=0.0,
            step=0.25,
            format="%.2f h",
        )
    now = utc_now() + timedelta(hours=offset)
    if abs(offset) > 0.001:
        st.warning(f"Pretending it is **{now:%A %d %B %H:%M} UTC**.")
    return now


def _render_booking_card(
    booking: Booking, store, now: datetime, owned: bool = True
) -> None:
    state = connect_state(booking, now=now)

    with st.container(border=True):
        head, action = st.columns([3, 1])

        with head:
            st.markdown(f"### {booking.counsellor_name}")
            if not owned:
                st.caption(
                    "Not booked in this session - seeded demo data or another "
                    "browser session."
                )
            st.markdown(
                f"**{format_when(booking, booking.client_timezone)}**  \n"
                f"<span style='color:#6b7280'>Counsellor's local time: "
                f"{format_when(booking, booking.counsellor_timezone)}</span>",
                unsafe_allow_html=True,
            )
            badge = {
                BookingStatus.CONFIRMED: ("Confirmed", "#11A528"),
                BookingStatus.HELD: ("Awaiting payment", "#C28818"),
                BookingStatus.COMPLETED: ("Completed", "#6b7280"),
            }.get(booking.status, (booking.status.value.title(), "#6b7280"))
            st.markdown(
                f"<span style='color:{badge[1]};font-weight:600'>{badge[0]}</span> "
                f"&nbsp;·&nbsp; ref `{booking.id}` "
                f"&nbsp;·&nbsp; {booking.payment.status.value} "
                f"{_money(booking.payment.amount_minor, booking.payment.currency)}",
                unsafe_allow_html=True,
            )

        with action:
            in_call = st.session_state.get(f"in_call_{booking.id}", False)

            if state["can_connect"] and not in_call:
                if st.button("Connect now", key=f"join_{booking.id}", type="primary",
                             use_container_width=True):
                    grant = authorise_connection(booking, "client", now=now)
                    if grant["authorised"]:
                        store.record_connection(booking.id, "client", "joined", now=now)
                        st.session_state[f"in_call_{booking.id}"] = True
                        st.rerun()
                    else:
                        st.error("The session is not open right now.")
            elif in_call:
                if st.button("Leave call", key=f"leave_{booking.id}", use_container_width=True):
                    store.record_connection(booking.id, "client", "left", now=now)
                    st.session_state[f"in_call_{booking.id}"] = False
                    st.rerun()
            else:
                st.button(
                    "Connect now",
                    key=f"join_disabled_{booking.id}",
                    disabled=True,
                    use_container_width=True,
                )

        # ---- window explanation -----------------------------------------
        if in_call:
            st.success(
                "You are in the session. If your connection drops you can rejoin from "
                "here as many times as you need until the window closes."
            )
        elif state["can_connect"]:
            minutes_left = state["seconds_until_close"] // 60
            st.info(f"The session is open now. It closes in {minutes_left} minutes.")
        elif state["reason"] == "too_early":
            opens_local = to_zone(
                datetime.fromisoformat(state["opens_at_utc"]), booking.client_timezone
            )
            wait = state["seconds_until_open"]
            if wait > 3600:
                lead = f"{wait // 3600}h {(wait % 3600) // 60}m"
            else:
                lead = f"{wait // 60}m {wait % 60}s"
            st.caption(
                f"Connect now opens at **{opens_local:%H:%M}** "
                f"({booking.client_timezone}) - five minutes before the start. "
                f"That is in {lead}."
            )
        elif state["reason"] == "too_late":
            st.caption("This session has ended. The joining window closed five minutes after it.")
        elif state["reason"] == "not_confirmed":
            st.caption("Payment has not been completed, so this session cannot be joined yet.")
        elif state["reason"] == "cancelled":
            st.caption("This booking was cancelled.")

        # ---- history and cancel -----------------------------------------
        with st.expander("Session detail"):
            if booking.connection_events:
                st.markdown("**Connection history**")
                for event in booking.connection_events:
                    stamp = to_zone(
                        datetime.fromisoformat(event.at), booking.client_timezone
                    )
                    st.markdown(f"- {stamp:%H:%M:%S} — {event.party} {event.action}")
            else:
                st.caption("Nobody has joined yet.")

            st.markdown(
                f"**Joining window:** "
                f"{to_zone(datetime.fromisoformat(state['opens_at_utc']), booking.client_timezone):%H:%M}"
                f" – "
                f"{to_zone(datetime.fromisoformat(state['closes_at_utc']), booking.client_timezone):%H:%M}"
                f" ({booking.client_timezone})"
            )
            if booking.payment.provider_reference:
                st.markdown(f"**Payment reference:** `{booking.payment.provider_reference}`")

            messages = default_outbox().all(booking.id)
            if messages:
                st.markdown(f"**Notifications queued:** {len(messages)}")
                for row in messages:
                    when = row["send_at_utc"][:16].replace("T", " ")
                    st.markdown(
                        f"- `{row['channel']}` {row['kind']} → {row['to_masked']} at {when}Z"
                    )

            if booking.status in {BookingStatus.CONFIRMED, BookingStatus.HELD}:
                if st.button("Cancel this session", key=f"cancel_{booking.id}"):
                    cancelled = store.cancel(booking.id)
                    notify_booking_cancelled(cancelled, outbox=default_outbox())
                    st.rerun()
