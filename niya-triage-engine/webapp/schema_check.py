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

from sqlalchemy import String, Text, inspect
from sqlalchemy.engine import Engine

from .models import Base

logger = logging.getLogger("niya.triage.schema")


class SchemaMismatch(RuntimeError):
    pass


def _text_capacity(type_) -> int:
    """Roughly how many characters a column will hold. -1 means effectively any.

    Only used to compare a live column against the model, so precision beyond
    "smaller than declared" does not matter.
    """
    if isinstance(type_, Text):
        return -1
    if isinstance(type_, String):
        return type_.length or -1
    return 0


def narrowed(engine: Engine) -> Dict[str, List[str]]:
    """Text columns the database holds less in than the model expects.

    A missing column fails loudly. A column that is merely too short does not:
    MySQL truncates on write outside strict mode, so the row saves and the data
    is simply shorter than it should be. That is the worse failure of the two,
    because nothing anywhere reports it.

    This matters for `triage_cases.shortlist_ids`, which was widened from
    varchar(255) to text when the client-facing list stopped being capped at
    three counsellors. On a database still holding the old column, a long
    shortlist would lose its tail and the client would silently be offered
    fewer people than the engine chose.
    """
    inspector = inspect(engine)
    present_tables = set(inspector.get_table_names())
    problems: Dict[str, List[str]] = {}

    for name, table in Base.metadata.tables.items():
        if name not in present_tables:
            continue

        live = {column["name"]: column["type"] for column in inspector.get_columns(name)}
        for column in table.columns:
            if column.name not in live:
                continue

            wanted = _text_capacity(column.type)
            actual = _text_capacity(live[column.name])
            if wanted == 0 or actual == 0:
                continue
            if actual != -1 and (wanted == -1 or wanted > actual):
                expected = "text" if wanted == -1 else f"{wanted} characters"
                problems.setdefault(name, []).append(
                    f"{column.name} holds {actual} characters, model expects {expected}"
                )

    return problems


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
    too_narrow = narrowed(engine)

    # A short column is warned about but never fatal, even in production, and
    # the difference from a missing column is deliberate. A missing column
    # breaks every request that touches it, immediately and for everyone. A
    # short one holds less than it should, which only bites once the data grows
    # past it; refusing to start over a column that currently fits would block
    # a deploy for a problem that has not happened yet. So it is logged at
    # every boot until someone applies the ALTER in docs/DEPLOYMENT.md.
    if too_narrow:
        logger.warning(
            "database columns are narrower than the models expect: %s. Long "
            "values will be truncated or rejected once the data outgrows them. "
            "See the schema changes section of docs/DEPLOYMENT.md.",
            "; ".join(
                f"{table}.{detail}"
                for table, details in sorted(too_narrow.items())
                for detail in details
            ),
        )

    if not missing:
        return dict(too_narrow)

    summary = describe(missing)
    if strict:
        raise SchemaMismatch(
            f"The database does not match the models: {summary}. "
            "Apply the schema change before deploying this version - see "
            "the schema changes section of docs/DEPLOYMENT.md."
        )

    logger.warning(
        "database schema is out of date: %s. Pages touching those columns will "
        "fail. Delete webapp_data/niyatriage.db to rebuild it locally.",
        summary,
    )

    combined = dict(missing)
    for table, details in too_narrow.items():
        combined.setdefault(table, []).extend(details)
    return combined
