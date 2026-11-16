r"""Check a running instance actually works, across all three roles.

    python scripts\smoke.py                       # against http://localhost:8080
    python scripts\smoke.py https://your-url      # against a deployment

Hits the real HTTP surface rather than the test client, so it catches the things
tests cannot: a missing static file, a template that only fails under the real
renderer, a reverse proxy rewriting a redirect. Read-mostly, but it does create
one client account and one triage case, so point it at staging rather than at a
production database you care about.
"""

from __future__ import annotations

import http.cookiejar
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
import uuid

BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080").rstrip("/")

# A deployment sets its own administrator, so take the credentials from the
# environment and fall back to the local development pair.
ADMIN_EMAIL = os.environ.get("SMOKE_ADMIN_EMAIL", "admin@niya.app")
ADMIN_PASSWORD = os.environ.get("SMOKE_ADMIN_PASSWORD", "a-long-enough-passphrase")

passed = 0
failed = 0


def check(label: str, ok: bool, detail: str = "") -> bool:
    global passed, failed
    if ok:
        passed += 1
        print(f"  ok    {label}")
    else:
        failed += 1
        print(f"  FAIL  {label}{'  -> ' + detail if detail else ''}")
    return ok


def opener():
    return urllib.request.build_opener(
        urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()),
        # Redirects are the thing being checked in several places, so they are
        # not followed automatically.
        type("NoRedirect", (urllib.request.HTTPRedirectHandler,), {
            "redirect_request": lambda *args, **kwargs: None
        })(),
    )


def get(op, path: str):
    try:
        response = op.open(BASE + path)
        return response.status, response.read().decode("utf-8", "replace"), response.headers
    except urllib.error.HTTPError as error:
        return error.code, error.read().decode("utf-8", "replace"), error.headers


def post(op, path: str, data: dict):
    payload = urllib.parse.urlencode(data, doseq=True).encode()
    try:
        response = op.open(BASE + path, payload)
        return response.status, response.read().decode("utf-8", "replace"), response.headers
    except urllib.error.HTTPError as error:
        return error.code, error.read().decode("utf-8", "replace"), error.headers


def main() -> int:
    print(f"Smoke test against {BASE}\n")

    print("Service")
    anon = opener()
    status, body, _ = get(anon, "/healthz")
    if not check("health endpoint responds", status == 200, f"status {status}"):
        print("\nThe service is not answering. Is it running?")
        return 1

    health = json.loads(body)
    check("database reachable", health.get("database") == "ok", str(health.get("database")))
    print(f"        environment={health.get('environment')} "
          f"payments={health.get('payments')} email={health.get('email')}")

    status, _, _ = get(anon, "/static/app.css")
    check("stylesheet is served", status == 200, f"status {status}")

    status, _, headers = get(anon, "/")
    check("landing page renders", status == 200, f"status {status}")
    check("security headers present", headers.get("x-frame-options") == "DENY")

    print("\nClient")
    client = opener()
    email = f"smoke-{uuid.uuid4().hex[:8]}@example.com"
    status, body, _ = post(client, "/signup", {
        "full_name": "Smoke Test", "email": email, "password": "a-long-enough-passphrase",
        "country": "united_kingdom", "timezone_name": "europe/london", "languages": ["english"],
    })
    if not check("can create an account", status == 303, f"status {status}"):
        print(body[:400])
        return 1

    status, body, headers = post(client, "/intake", {
        "text": "I keep putting off my coursework and the deadline is close",
        "desired_timing": "flexible",
    })
    check("intake produces a result", status == 303, f"status {status}")
    case_ref = headers.get("location", "").rsplit("/", 1)[-1]

    status, body, _ = get(client, f"/result/{case_ref}")
    check("result page renders", status == 200, f"status {status}")
    has_prices = 'class="price"' in body
    check("counsellor shortlist shows a price per counsellor", has_prices)
    refs = re.findall(rf"/book/{case_ref}/(\w+)", body)
    check("shortlist offers someone to book", bool(refs), "empty shortlist")

    if refs:
        status, body, _ = get(client, f"/book/{case_ref}/{refs[0]}")
        check("booking page renders", status == 200, f"status {status}")
        check("booking page shows that counsellor's price", " INR" in body)

    print("\nAdmin")
    admin = opener()
    status, _, headers = post(
        admin, "/login", {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
    )
    if check("admin can sign in", status == 303, f"status {status}"):
        check("admin lands on /admin", headers.get("location") == "/admin",
              str(headers.get("location")))

        status, body, _ = get(admin, "/admin")
        check("roster page renders", status == 200, f"status {status}")
        check("roster shows margin", "NIYA margin" in body)

        status, _, _ = get(admin, "/admin/counsellors/new")
        check("onboarding form renders", status == 200, f"status {status}")

        status, _, _ = get(admin, "/admin/bookings")
        check("sessions page renders", status == 200, f"status {status}")
    else:
        print(f"        Could not sign in as {ADMIN_EMAIL}. Locally, create one with")
        print("        .\\run.ps1 admin. Against a deployment, set SMOKE_ADMIN_EMAIL")
        print("        and SMOKE_ADMIN_PASSWORD to that deployment's administrator.")

    print("\nRole separation")
    status, _, headers = get(client, "/admin")
    check("a client is turned away from /admin",
          status == 303 and headers.get("location") == "/intake",
          f"status {status} -> {headers.get('location')}")
    status, _, headers = get(client, "/expert")
    check("a client is turned away from /expert",
          status == 303 and headers.get("location") == "/intake",
          f"status {status} -> {headers.get('location')}")

    print(f"\n{passed} passed, {failed} failed")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
