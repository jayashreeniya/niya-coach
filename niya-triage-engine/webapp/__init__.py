"""The deployable NIYA Triage application.

Standalone: its own accounts, its own `niyatriage` database, its own deployment.
It imports the triage engine from `niya_triage` but shares no storage, no
authentication and no runtime with NIYA's existing Rails app.
"""

__all__ = ["settings", "db", "models", "security", "booking_service", "notify", "payments"]
