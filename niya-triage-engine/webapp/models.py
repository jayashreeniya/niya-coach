"""Database schema for the `niyatriage` database.

Standalone: this app owns every table here and reads none of NIYA's. It runs on
SQLite locally and MySQL (TiDB Cloud) in production, so the column types stay
within what both support - no JSON columns, no arrays, no Postgres-isms.

Two constraints carry real weight:

* `uq_counsellor_slot` on `(counsellor_id, start_utc)` makes double-booking
  impossible at the storage layer. The prototype prevented it with an in-process
  lock, which is correct for one process and useless across the replicas Render
  can run. A unique index is the only version that holds under concurrency.
* `bookings.account_id` is a foreign key, so "show me my appointments" is a
  scoped query rather than a filter someone can forget to apply. Forgetting it
  is exactly what showed one user another user's booking in the prototype.
"""

from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone
from typing import List, Optional

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    pass


# ---------------------------------------------------------------------------
# Identity
# ---------------------------------------------------------------------------


class Account(Base):
    """A signed-in person.

    Deliberately unlike NIYA's `accounts` table in three ways, each of which is
    a defect there:

    * Email is stored lowercased with a unique index. NIYA compares with
      `LOWER(email) = ?` against a column with no uniqueness guarantee, so two
      accounts differing only in case can exist.
    * There is no company access code. NIYA gates signup on `hr_code` or
      `employee_code` and derives the organisation by string-matching that code,
      with no foreign key. A student abroad seeking help should not need an
      employer's permission.
    * `email_verified` actually gates something. NIYA sets `activated: true`
      immediately on signup and its `EmailConfirmationsController` has no route.
    """

    __tablename__ = "accounts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    full_name: Mapped[str] = mapped_column(String(120), default="", nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(24), nullable=True)
    country: Mapped[str] = mapped_column(String(64), default="", nullable=False)
    timezone: Mapped[str] = mapped_column(String(64), default="UTC", nullable=False)
    preferred_languages: Mapped[str] = mapped_column(String(255), default="english", nullable=False)

    #: client | counsellor | admin. Drives which portal this account can reach;
    #: see `deps.require_admin` and `deps.require_counsellor`.
    role: Mapped[str] = mapped_column(String(20), default="client", nullable=False)
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    failed_login_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    locked_until: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    last_login_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, nullable=False)

    sessions: Mapped[List["UserSession"]] = relationship(
        back_populates="account", cascade="all, delete-orphan"
    )
    bookings: Mapped[List["Booking"]] = relationship(back_populates="account")
    counsellor_profile: Mapped[Optional["CounsellorProfile"]] = relationship(
        back_populates="account", uselist=False
    )

    @property
    def languages(self) -> List[str]:
        return [item.strip() for item in self.preferred_languages.split(",") if item.strip()]

    @property
    def is_admin(self) -> bool:
        return self.role == "admin"

    @property
    def is_counsellor(self) -> bool:
        return self.role == "counsellor"

    @property
    def is_locked(self) -> bool:
        if self.locked_until is None:
            return False
        locked_until = self.locked_until
        if locked_until.tzinfo is None:
            locked_until = locked_until.replace(tzinfo=timezone.utc)
        return locked_until > utcnow()


class UserSession(Base):
    """A server-side session, so sign-out actually ends the session.

    The cookie carries only an opaque token. Keeping the record here means a
    session can be revoked, which a self-contained signed cookie cannot offer -
    NIYA's JWTs are valid for a day regardless of logout, and its denylist check
    reads `params[:token]` while the token arrives in a header, so it rarely
    matches.
    """

    __tablename__ = "user_sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    token_hash: Mapped[str] = mapped_column(String(64), nullable=False, unique=True, index=True)
    account_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False, index=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    revoked_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    user_agent: Mapped[str] = mapped_column(String(255), default="", nullable=False)

    account: Mapped[Account] = relationship(back_populates="sessions")

    @property
    def is_valid(self) -> bool:
        if self.revoked_at is not None:
            return False
        expires = self.expires_at
        if expires.tzinfo is None:
            expires = expires.replace(tzinfo=timezone.utc)
        return expires > utcnow()


# ---------------------------------------------------------------------------
# Roster
# ---------------------------------------------------------------------------


def join_values(values: object) -> str:
    if not values:
        return ""
    return ",".join(str(item).strip().lower() for item in values if str(item).strip())


def split_values(raw: Optional[str]) -> List[str]:
    return [item.strip() for item in (raw or "").split(",") if item.strip()]


class CounsellorProfile(Base):
    """A counsellor NIYA has onboarded.

    The roster lives here rather than in `data/counsellors.json` because Render
    rebuilds the container filesystem from the image on every deploy. A roster
    written to disk would silently lose everyone onboarded since the last
    release, which is the one failure mode an onboarding portal must not have.
    The JSON file is now only a seed for an empty database.

    Pricing is two independent amounts rather than a rate plus a percentage.
    `counsellor_fee_minor` is what the counsellor is owed, `client_price_minor`
    is what the client pays, and the margin is the difference. Keeping both means
    a payout can be computed from the row itself, instead of being re-derived
    from a percentage that may have changed since the session was booked.
    """

    __tablename__ = "counsellors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    #: Stable public identifier, e.g. "C001". Used everywhere the engine and the
    #: URLs refer to a counsellor, so it must not change once bookings exist.
    ref: Mapped[str] = mapped_column(String(32), nullable=False, unique=True, index=True)
    #: The login this counsellor uses. Nullable because a profile may be created
    #: before its owner has an account, and SET NULL so deleting a login leaves
    #: the roster entry (and its bookings) intact.
    account_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("accounts.id", ondelete="SET NULL"), nullable=True, unique=True
    )

    display_name: Mapped[str] = mapped_column(String(120), nullable=False)
    credentials: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # --- money ----------------------------------------------------------
    counsellor_fee_minor: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    client_price_minor: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    currency: Mapped[str] = mapped_column(String(8), default="INR", nullable=False)

    # --- matching attributes --------------------------------------------
    capabilities: Mapped[str] = mapped_column(Text, default="", nullable=False)
    #: category id -> proficiency in [0, 1], as a JSON object. Stored as text so
    #: the schema works identically on SQLite and MySQL 5.7.
    category_experience: Mapped[str] = mapped_column(Text, default="{}", nullable=False)
    years_experience: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    languages: Mapped[str] = mapped_column(Text, default="english", nullable=False)
    country_context: Mapped[str] = mapped_column(Text, default="", nullable=False)
    diaspora_background: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    client_types: Mapped[str] = mapped_column(
        Text, default="student,professional", nullable=False
    )

    # --- scheduling, owned by the counsellor ----------------------------
    timezone: Mapped[str] = mapped_column(String(64), default="Asia/Kolkata", nullable=False)
    working_hours_start: Mapped[float] = mapped_column(Float, default=9.0, nullable=False)
    working_hours_end: Mapped[float] = mapped_column(Float, default=18.0, nullable=False)
    next_available_hours: Mapped[float] = mapped_column(Float, default=24.0, nullable=False)
    slots_next_7_days: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # --- load ------------------------------------------------------------
    active_cases: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    max_cases: Mapped[int] = mapped_column(Integer, default=20, nullable=False)
    preferred_complexity: Mapped[str] = mapped_column(
        String(16), default="moderate", nullable=False
    )
    max_complexity: Mapped[str] = mapped_column(String(16), default="high", nullable=False)

    # --- outcomes ---------------------------------------------------------
    satisfaction: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    completion_rate: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    return_rate: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    referral_rate: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    rematch_rate: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    sessions_delivered: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # --- safety -----------------------------------------------------------
    escalation_capability: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    clinically_qualified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    crisis_trained: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    notes: Mapped[str] = mapped_column(Text, default="", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, onupdate=utcnow, nullable=False
    )

    account: Mapped[Optional[Account]] = relationship(back_populates="counsellor_profile")

    @property
    def margin_minor(self) -> int:
        return self.client_price_minor - self.counsellor_fee_minor

    @property
    def margin_percent(self) -> float:
        """Margin as a percentage of what the counsellor is paid."""
        if self.counsellor_fee_minor <= 0:
            return 0.0
        return round(self.margin_minor / self.counsellor_fee_minor * 100, 1)

    @property
    def capability_list(self) -> List[str]:
        return split_values(self.capabilities)

    @property
    def language_list(self) -> List[str]:
        return split_values(self.languages)

    @property
    def country_list(self) -> List[str]:
        return split_values(self.country_context)

    @property
    def client_type_list(self) -> List[str]:
        return split_values(self.client_types)

    @property
    def experience_map(self) -> dict:
        try:
            loaded = json.loads(self.category_experience or "{}")
        except json.JSONDecodeError:
            return {}
        return {str(key): float(value) for key, value in loaded.items()}


# ---------------------------------------------------------------------------
# Triage
# ---------------------------------------------------------------------------


class TriageCase(Base):
    """The outcome of one intake, owned by the account that submitted it.

    The raw text is **not** stored - only the redacted form, and only so a
    coordinator reviewing a flagged case has context. Redaction removes phone
    numbers, emails and locations; it does not detect personal names, which is
    why the intake page asks people not to type them.
    """

    __tablename__ = "triage_cases"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    case_ref: Mapped[str] = mapped_column(String(40), nullable=False, unique=True, index=True)
    account_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False, index=True
    )

    primary_category: Mapped[str] = mapped_column(String(64), default="", nullable=False)
    secondary_categories: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    urgency: Mapped[str] = mapped_column(String(16), default="moderate", nullable=False)
    confidence: Mapped[int] = mapped_column(Integer, default=0, nullable=False)  # percent
    pathway: Mapped[str] = mapped_column(String(64), default="", nullable=False)
    risk_flags: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    safety_blocked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    human_review_required: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    redacted_text: Mapped[str] = mapped_column(Text, default="", nullable=False)
    #: Every eligible counsellor, in rank order, as comma-separated refs. Text
    #: rather than String(255) because the client is shown the whole roster that
    #: fits the case: at five characters per ref, a varchar(255) would have run
    #: out at about forty counsellors and quietly dropped the tail of the list,
    #: which looks like the engine deciding rather than the storage failing.
    shortlist_ids: Mapped[str] = mapped_column(Text, default="", nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, nullable=False)

    bookings: Mapped[List["Booking"]] = relationship(back_populates="case")


# ---------------------------------------------------------------------------
# Booking
# ---------------------------------------------------------------------------


class Booking(Base):
    __tablename__ = "bookings"
    __table_args__ = (
        # The constraint that makes double-booking impossible rather than
        # unlikely. Cancelled and expired rows would otherwise block the slot
        # forever, so they are released by clearing start_utc_active - see
        # `release_slot` below.
        UniqueConstraint(
            "counsellor_id", "start_utc_active", name="uq_counsellor_slot"
        ),
        Index("ix_bookings_account_start", "account_id", "start_utc"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    booking_ref: Mapped[str] = mapped_column(String(40), nullable=False, unique=True, index=True)

    account_id: Mapped[int] = mapped_column(
        ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False, index=True
    )
    case_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("triage_cases.id", ondelete="SET NULL"), nullable=True
    )

    counsellor_id: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    counsellor_name: Mapped[str] = mapped_column(String(120), nullable=False)
    counsellor_timezone: Mapped[str] = mapped_column(String(64), default="UTC", nullable=False)

    slot_id: Mapped[str] = mapped_column(String(64), nullable=False)
    start_utc: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_utc: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    #: Mirrors start_utc while the booking holds the slot, NULL once released.
    #: MySQL and SQLite both treat NULLs as distinct in a unique index, so this
    #: gives "one live booking per counsellor per slot" without blocking reuse
    #: after a cancellation.
    start_utc_active: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    client_timezone: Mapped[str] = mapped_column(String(64), default="UTC", nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="held", nullable=False, index=True)
    urgency: Mapped[str] = mapped_column(String(16), default="moderate", nullable=False)
    primary_category: Mapped[str] = mapped_column(String(64), default="", nullable=False)

    room_id: Mapped[str] = mapped_column(String(64), default="", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, nullable=False)
    hold_expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    cancelled_reason: Mapped[str] = mapped_column(String(255), default="", nullable=False)

    account: Mapped[Account] = relationship(back_populates="bookings")
    case: Mapped[Optional[TriageCase]] = relationship(back_populates="bookings")
    payment: Mapped[Optional["Payment"]] = relationship(
        back_populates="booking", uselist=False, cascade="all, delete-orphan"
    )
    notifications: Mapped[List["Notification"]] = relationship(
        back_populates="booking", cascade="all, delete-orphan"
    )
    connection_events: Mapped[List["ConnectionEvent"]] = relationship(
        back_populates="booking", cascade="all, delete-orphan"
    )

    def release_slot(self) -> None:
        """Free the slot for rebooking without deleting the audit trail."""
        self.start_utc_active = None

    def _aware(self, value: datetime) -> datetime:
        return value if value.tzinfo else value.replace(tzinfo=timezone.utc)

    @property
    def start(self) -> datetime:
        return self._aware(self.start_utc)

    @property
    def end(self) -> datetime:
        return self._aware(self.end_utc)

    @property
    def connect_opens_at(self) -> datetime:
        return self.start - timedelta(minutes=CONNECT_OPENS_MINUTES_BEFORE)

    @property
    def connect_closes_at(self) -> datetime:
        return self.end + timedelta(minutes=CONNECT_CLOSES_MINUTES_AFTER)


#: Kept here rather than imported from the prototype so the schema and the
#: joining rule move together.
CONNECT_OPENS_MINUTES_BEFORE = 5
CONNECT_CLOSES_MINUTES_AFTER = 5
HOLD_MINUTES = 15


class Payment(Base):
    """One payment per booking, always persisted.

    NIYA's booking table has no payment columns at all; its controller writes
    `payment_status` and `payment_id` behind a `respond_to?` guard that is always
    false, so nothing is recorded and no charge can be reconciled to a session.
    """

    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    booking_id: Mapped[int] = mapped_column(
        ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False, unique=True
    )

    #: What the client is charged.
    amount_minor: Mapped[int] = mapped_column(Integer, nullable=False)
    #: The split of that amount, copied from the counsellor's profile when the
    #: slot is held. Snapshotted rather than read live: repricing a counsellor
    #: must not change what an already-booked session is owed, or the payout
    #: report stops matching what was actually charged.
    counsellor_fee_minor: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    platform_fee_minor: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    currency: Mapped[str] = mapped_column(String(8), default="INR", nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False)
    provider: Mapped[str] = mapped_column(String(32), default="simulated", nullable=False)
    provider_order_id: Mapped[str] = mapped_column(String(80), default="", nullable=False)
    provider_reference: Mapped[str] = mapped_column(String(80), default="", nullable=False, index=True)
    signature: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    settled_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, nullable=False)

    booking: Mapped[Booking] = relationship(back_populates="payment")


class Notification(Base):
    """A queued or sent message.

    Rows are kept whether or not sending succeeded, because "we told them" is
    exactly the thing you need evidence of when someone says nobody warned them
    about a session.
    """

    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    booking_id: Mapped[int] = mapped_column(
        ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False, index=True
    )

    channel: Mapped[str] = mapped_column(String(16), nullable=False)     # email | sms
    kind: Mapped[str] = mapped_column(String(24), nullable=False)        # confirmation | reminder | ...
    recipient: Mapped[str] = mapped_column(String(255), nullable=False)
    recipient_masked: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    subject: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    body: Mapped[str] = mapped_column(Text, default="", nullable=False)

    send_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)
    sent_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(String(16), default="queued", nullable=False, index=True)
    provider: Mapped[str] = mapped_column(String(32), default="outbox", nullable=False)
    error: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    #: A provider having a bad minute should not silently cost someone their
    #: appointment reminder, so sends are retried with backoff before the row is
    #: given up on. See MAX_SEND_ATTEMPTS.
    attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    booking: Mapped[Booking] = relationship(back_populates="notifications")


class ConnectionEvent(Base):
    __tablename__ = "connection_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    booking_id: Mapped[int] = mapped_column(
        ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False, index=True
    )
    party: Mapped[str] = mapped_column(String(16), nullable=False)   # client | counsellor
    action: Mapped[str] = mapped_column(String(16), nullable=False)  # joined | left
    at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, nullable=False)

    booking: Mapped[Booking] = relationship(back_populates="connection_events")
