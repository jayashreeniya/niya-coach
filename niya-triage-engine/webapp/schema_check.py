"""Does the live database actually match what the code expects?

`Base.metadata.create_all` creates missing tables but never alters existing
ones. So adding a column to a model and deploying leaves the old table in place,
and the mismatch surfaces later as a 500 halfway through a page, with a message
like "no such column: payments.platform_fee_minor" buried in the logs.

Checking at startup turns that into one clear failure at boot, naming exactly
what is missing. Until this app adopts Alembic, this is the thing standing
between a schema change and a confusing outage.
"""

from __future__ import annotations

import logging
from typing import Dict, List

from sqlalchemy import inspect
from sqlalchemy.engine import Engine

from .models import Base

logger = logging.getLogger("niya.triage.schema")


class SchemaMismatch(RuntimeError):
    pass


def differences(engine: Engine) -> Dict[str, List[str]]:
    """Tables and columns the models declare but the database does not have.

    Only reports things that are missing. Extra columns in the database are
    left alone: they are usually the remains of a rolled-back change and
    dropping them automatically would destroy data.
    """
    inspector = inspect(engine)
    present_tables = set(inspector.get_table_names())
    missing: Dict[str, List[str]] = {}

    for name, table in Base.metadata.tables.items():
        if name not in present_tables:
            missing[name] = ["<entire table>"]
            continue

        present_columns = {column["name"] for column in inspector.get_columns(name)}
        absent = [
            column.name for column in table.columns if column.name not in present_columns
        ]
        if absent:
            missing[name] = absent

    return missing


def describe(missing: Dict[str, List[str]]) -> str:
    parts = [
        f"{table} is missing {', '.join(columns)}" for table, columns in sorted(missing.items())
    ]
    return "; ".join(parts)


def verify(engine: Engine, strict: bool = False) -> Dict[str, List[str]]:
    """Log any mismatch, and refuse to start if asked to be strict.

    Strict in production, where serving broken pages is worse than not starting:
    a failed deploy is visible immediately and Render keeps the previous version
    running. In development it only warns, so a stale local SQLite file is an
    annoyance rather than a wall.
    """
    missing = differences(engine)
    if not missing:
        return {}

    summary = describe(missing)
    if strict:
        raise SchemaMismatch(
            f"The database does not match the models: {summary}. "
            "Apply the schema change before deploying this version - see "
            "docs/DEPLOYMENT_RENDER.md."
        )

    logger.warning(
        "database schema is out of date: %s. Pages touching those columns will "
        "fail. Delete webapp_data/niyatriage.db to rebuild it locally.",
        summary,
    )
    return missing
