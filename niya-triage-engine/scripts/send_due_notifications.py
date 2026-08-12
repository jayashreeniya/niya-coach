r"""Send every notification whose time has come.

Run on a schedule. On Render this is a Cron Job rather than a thread inside the
web service, because a web service scaled to two replicas would run the same
scheduler twice and send every reminder twice.

    python scripts/send_due_notifications.py

Safe to run as often as you like: each row flips from `queued` to `sent` or
`failed`, so nothing is delivered twice.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from webapp import db, notify, settings  # noqa: E402


def main() -> int:
    if not db.healthcheck():
        print("database unreachable", file=sys.stderr)
        return 1

    with db.session_scope() as session:
        summary = notify.deliver_due(session, limit=200)

    summary["mode"] = notify.describe_mode()
    print(json.dumps(summary))

    if summary["skipped_not_configured"]:
        print(
            "note: messages were left queued because no provider is configured. "
            "Set SENDGRID_API_KEY and the Twilio variables to send them.",
            file=sys.stderr,
        )
    # Transient failures stay queued and are retried on a later run, so a
    # non-zero exit here would make the cron job look broken for something that
    # is already handling itself. Only a message that exhausted its attempts is
    # counted as failed, and that is worth looking at.
    if summary["failed"]:
        print(
            f"warning: {summary['failed']} message(s) gave up after "
            "repeated failures and need attention.",
            file=sys.stderr,
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
