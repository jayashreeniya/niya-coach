r"""Create or promote an administrator.

    python scripts\create_admin.py
    python scripts\create_admin.py --email ops@niya.app

Prompts for a password rather than taking one on the command line, so it does
not end up in shell history. Run it against production by exporting the same
DATABASE_URL the service uses:

    $env:DATABASE_URL = "mysql+pymysql://...@...:4000/niyatriage?ssl_verify_cert=true"
    python scripts\create_admin.py
"""

from __future__ import annotations

import argparse
import getpass
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import select  # noqa: E402

from webapp import db, settings  # noqa: E402
from webapp.models import Account  # noqa: E402
from webapp.security import (  # noqa: E402
    hash_password,
    is_valid_email,
    normalise_email,
    password_problems,
)


def main() -> int:
    parser = argparse.ArgumentParser(description="Create or promote a Niyasaathi admin.")
    parser.add_argument("--email", default="", help="Administrator email address.")
    args = parser.parse_args()

    print(f"Database: {settings.describe()['database_target']}")

    email = normalise_email(args.email or input("Email: "))
    if not is_valid_email(email):
        print("That does not look like an email address.")
        return 1

    db.init_db()

    with db.session_scope() as session:
        existing = session.scalar(select(Account).where(Account.email == email))

        if existing is not None:
            if existing.role == "admin":
                print(f"{email} is already an administrator.")
                return 0
            # Promoting deliberately requires typing the word, because turning a
            # counsellor account into an admin is not something to do by
            # accidentally reusing an address.
            answer = input(
                f"{email} exists as a '{existing.role}' account. "
                "Type 'promote' to make it an administrator: "
            )
            if answer.strip().lower() != "promote":
                print("Left unchanged.")
                return 1
            existing.role = "admin"
            print(f"{email} is now an administrator.")
            return 0

        password = getpass.getpass("Password: ")
        problems = password_problems(password, email)
        if problems:
            print(" ".join(problems))
            return 1
        if password != getpass.getpass("Confirm password: "):
            print("Those did not match.")
            return 1

        session.add(
            Account(
                email=email,
                password_hash=hash_password(password),
                full_name="Administrator",
                role="admin",
                email_verified=True,
                timezone="Asia/Kolkata",
            )
        )
        print(f"Created administrator {email}. Sign in at {settings.BASE_URL}/login")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
