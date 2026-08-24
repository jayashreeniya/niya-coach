r"""Sanity-check render.yaml before pushing a deploy.

    python scripts/check_render_config.py

Catches the mistakes that only show up as a failed build ten minutes later: a
service that cannot reach the database, a missing signing key, a Dockerfile path
that does not exist.
"""

from __future__ import annotations

import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
RENDER_YAML = REPO_ROOT / "render.yaml"

REQUIRED = {
    "niya-triage": {"DATABASE_URL", "APP_SECRET_KEY", "APP_ENV", "BASE_URL"},
    "niya-triage-reminders": {"DATABASE_URL", "APP_ENV"},
}


def main() -> int:
    try:
        import yaml
    except ImportError:
        print("PyYAML is not installed. pip install pyyaml to run this check.")
        return 0

    config = yaml.safe_load(RENDER_YAML.read_text(encoding="utf-8"))
    services = {service["name"]: service for service in config["services"]}

    problems = []
    print("Services in render.yaml:")
    for name, service in services.items():
        print("  %-24s %-7s %s" % (name, service["type"], service.get("dockerfilePath", "-")))

        docker_path = service.get("dockerfilePath")
        if docker_path and not (REPO_ROOT / docker_path.lstrip("./")).exists():
            problems.append("%s: dockerfilePath %s does not exist" % (name, docker_path))

    print()
    for name, required_keys in REQUIRED.items():
        service = services.get(name)
        if service is None:
            problems.append("%s is missing from render.yaml" % name)
            continue

        present = {entry["key"] for entry in service.get("envVars", [])}
        missing = required_keys - present
        if missing:
            problems.append("%s is missing env vars: %s" % (name, ", ".join(sorted(missing))))
        else:
            print("%-24s all required env vars present" % name)

    web = services.get("niya-triage")
    if web and not web.get("healthCheckPath"):
        problems.append("niya-triage has no healthCheckPath; a broken deploy would go live")

    print()
    if problems:
        for problem in problems:
            print("PROBLEM: %s" % problem)
        return 1

    print("render.yaml looks consistent.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
