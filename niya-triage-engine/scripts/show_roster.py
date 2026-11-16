r"""Print the counsellor roster as it exists in the database.

    python scripts\show_roster.py

A read-only check that answers "where does the roster actually live now?"
without opening a database client. Reads whatever DATABASE_URL points at, so it
works against the local SQLite file and against `niyatriage` on TiDB.
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import inspect  # noqa: E402

from webapp import db, roster, settings  # noqa: E402


def main() -> int:
    print(f"Database: {settings.describe()['database_target']}")

    tables = sorted(inspect(db.engine).get_table_names())
    print(f"Tables:   {', '.join(tables) or '(none)'}")
    print()

    with db.session_scope() as session:
        profiles = roster.profiles(session, include_inactive=True)

        if not profiles:
            print("The counsellors table is empty.")
            print("It is seeded from data/counsellors.json the first time the app starts.")
            return 0

        print(f"{len(profiles)} counsellors in the database:")
        print()
        header = (
            f"{'ref':<6} {'name':<24} {'client pays':>12} {'they get':>10} "
            f"{'margin':>9} {'login':<28} {'on roster':<9}"
        )
        print(header)
        print("-" * len(header))

        total_price = total_fee = 0
        for profile in profiles:
            login = profile.account.email if profile.account else "(none)"
            total_price += profile.client_price_minor
            total_fee += profile.counsellor_fee_minor
            print(
                f"{profile.ref:<6} {profile.display_name[:24]:<24} "
                f"{profile.client_price_minor / 100:>12,.2f} "
                f"{profile.counsellor_fee_minor / 100:>10,.2f} "
                f"{profile.margin_minor / 100:>9,.2f} "
                f"{login[:28]:<28} {'yes' if profile.active else 'no':<9}"
            )

        print()
        print(
            f"If every one were booked once: {total_price / 100:,.2f} collected, "
            f"{total_fee / 100:,.2f} paid out, "
            f"{(total_price - total_fee) / 100:,.2f} margin "
            f"({settings.SESSION_CURRENCY})"
        )
        print("Prices differ per counsellor, which is the point - an admin sets each one.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
