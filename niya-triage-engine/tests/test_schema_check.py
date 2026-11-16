"""The startup guard against a database that no longer matches the models.

There is no Alembic here, and `create_all` adds missing tables but never alters
existing ones. Two things can therefore drift, and only one of them is loud:

  - a missing column fails every request that touches it, immediately;
  - a column that is merely too short truncates on write in MySQL and reports
    nothing at all.

The second is what these tests are mostly about. `triage_cases.shortlist_ids`
was widened to text when the client stopped being shown a capped three
counsellors; on a database still holding varchar(255) the tail of a long list
would be cut off, and it would look exactly like the engine choosing to offer
fewer people.
"""

from __future__ import annotations

import pytest
from sqlalchemy import Column, Integer, MetaData, String, Table, Text, create_engine

from webapp import schema_check
from webapp.models import Base


@pytest.fixture
def engine():
    return create_engine("sqlite://")


def test_a_database_matching_the_models_reports_nothing(engine):
    Base.metadata.create_all(engine)
    assert schema_check.differences(engine) == {}
    assert schema_check.narrowed(engine) == {}
    assert schema_check.verify(engine, strict=True) == {}


def test_a_missing_table_is_reported(engine):
    assert "accounts" in schema_check.differences(engine)


def test_a_missing_column_is_reported(engine):
    """Build the real table, minus one column the model expects."""
    partial = MetaData()
    Table(
        "triage_cases",
        partial,
        Column("id", Integer, primary_key=True),
        Column("case_ref", String(40)),
    )
    partial.create_all(engine)

    missing = schema_check.differences(engine)
    assert "shortlist_ids" in missing["triage_cases"]


def _table_with_shortlist(column_type):
    metadata = MetaData()
    Table(
        "triage_cases",
        metadata,
        Column("id", Integer, primary_key=True),
        Column("shortlist_ids", column_type),
    )
    return metadata


def test_a_column_too_short_for_the_model_is_reported(engine):
    """The failure that reports nothing on its own."""
    _table_with_shortlist(String(255)).create_all(engine)

    problems = schema_check.narrowed(engine)
    assert "triage_cases" in problems
    detail = " ".join(problems["triage_cases"])
    assert "shortlist_ids" in detail
    assert "255" in detail


def test_a_wide_enough_column_is_not_reported(engine):
    _table_with_shortlist(Text).create_all(engine)
    assert "triage_cases" not in schema_check.narrowed(engine)


def test_a_wider_column_than_the_model_is_left_alone(engine):
    """Extra room is not a problem, and must not be flagged as one."""
    metadata = MetaData()
    Table(
        "triage_cases",
        metadata,
        Column("id", Integer, primary_key=True),
        Column("case_ref", String(200)),  # model wants 40
    )
    metadata.create_all(engine)

    problems = schema_check.narrowed(engine)
    assert "case_ref" not in " ".join(problems.get("triage_cases", []))


def test_a_short_column_warns_but_does_not_block_a_deploy(engine, caplog, monkeypatch):
    """Deliberately weaker than the missing-column rule.

    A missing column breaks every request touching it, now, for everyone. A
    short one holds less than it should, which only bites once the data grows
    past it. Refusing to boot over a column that currently fits would block a
    deploy for a problem that has not happened, so this warns at every start
    until someone applies the ALTER.

    The inspect behaviour is already covered by
    `test_a_column_too_short_for_the_model_is_reported`. This one is about
    `verify`'s policy, so the two helpers are stubbed: a partial fixture table
    would also look like a missing-column problem and that rule would fire
    first.
    """
    monkeypatch.setattr(schema_check, "differences", lambda _: {})
    monkeypatch.setattr(
        schema_check,
        "narrowed",
        lambda _: {
            "triage_cases": ["shortlist_ids holds 255 characters, model expects text"]
        },
    )

    reported = schema_check.verify(engine, strict=True)

    assert "triage_cases" in reported
    assert "shortlist_ids" in caplog.text


def test_production_still_refuses_to_start_on_a_missing_column(engine):
    """Render keeps the previous version serving, so refusing is the safe option."""
    partial = MetaData()
    Table(
        "triage_cases",
        partial,
        Column("id", Integer, primary_key=True),
        Column("case_ref", String(40)),
    )
    partial.create_all(engine)

    with pytest.raises(schema_check.SchemaMismatch) as raised:
        schema_check.verify(engine, strict=True)

    assert "shortlist_ids" in str(raised.value)


def test_development_only_warns_about_a_missing_column(engine, caplog):
    assert schema_check.verify(engine, strict=False)
    assert "out of date" in caplog.text
