"""Database engine and session handling.

Schema creation is done with `Base.metadata.create_all` rather than migrations.
That is the right trade-off while the schema is still moving, but it does not
alter existing tables, so the first schema change after real data exists needs
Alembic. That is recorded in docs/DEPLOYMENT_RENDER.md rather than left to be
discovered.
"""

from __future__ import annotations

from contextlib import contextmanager
from typing import Iterator

from sqlalchemy import create_engine, event, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from . import settings
from .models import Base


def _engine_options() -> dict:
    if settings.DATABASE_URL.startswith("sqlite"):
        # SQLite defaults to one-thread-per-connection, which breaks under the
        # threadpool FastAPI runs sync handlers on.
        return {"connect_args": {"check_same_thread": False}}

    # TiDB Cloud closes idle connections, and Render keeps containers alive
    # through quiet periods. Without pre-ping the first request after a lull
    # fails with a stale connection.
    return {
        "pool_pre_ping": True,
        "pool_recycle": 280,
        "pool_size": int(settings_pool_size()),
        "max_overflow": 5,
    }


def settings_pool_size() -> int:
    import os

    return int(os.environ.get("DB_POOL_SIZE", "5"))


def _build_engine() -> Engine:
    if settings.DATABASE_URL.startswith("sqlite"):
        path = settings.PROJECT_ROOT / "webapp_data"
        path.mkdir(parents=True, exist_ok=True)

    return create_engine(
        settings.DATABASE_URL,
        echo=settings.SQL_ECHO,
        future=True,
        **_engine_options(),
    )


engine = _build_engine()
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False, future=True)


@event.listens_for(Engine, "connect")
def _enable_sqlite_foreign_keys(dbapi_connection, connection_record) -> None:
    """SQLite ignores foreign keys unless asked not to.

    Without this the ON DELETE CASCADE rules are silently inert locally while
    working in MySQL, which is the worst kind of environment difference.
    """
    if settings.DATABASE_URL.startswith("sqlite"):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


def init_db() -> None:
    Base.metadata.create_all(bind=engine)


def healthcheck() -> bool:
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return True
    except Exception:
        return False


def get_session() -> Iterator[Session]:
    """FastAPI dependency."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@contextmanager
def session_scope() -> Iterator[Session]:
    """For scripts and background work."""
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
