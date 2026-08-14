"""The deployable NIYA Triage web app.

    uvicorn webapp.main:app --port 8080

Server-rendered HTML rather than a single-page app. For this product that is the
right call: the pages are forms and lists, the audience is often on a phone on a
patchy connection abroad, and server rendering means the first paint is the
content rather than a loading spinner behind a 400KB bundle. It also keeps the
whole thing in one deployable container with the triage engine in-process.

Standalone by design - no NIYA database, service or account system is touched.
"""

from __future__ import annotations

import logging

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles

from niya_triage import __version__ as engine_version

from . import bootstrap, db, notify, payments, schema_check, settings, video
from .deps import RedirectException
from .templating import templates

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("niya.triage.web")

settings.validate()

app = FastAPI(
    title=settings.APP_NAME,
    version=engine_version,
    docs_url="/api/docs" if not settings.IS_PRODUCTION else None,
    redoc_url=None,
)

app.mount(
    "/static",
    StaticFiles(directory=str(settings.WEBAPP_ROOT / "static")),
    name="static",
)


@app.on_event("startup")
def on_startup() -> None:
    db.init_db()
    # Creating tables is not the same as updating them. Checked before anything
    # reads the new columns, so a stale schema fails here rather than as a 500
    # on whichever page happens to touch it first.
    schema_check.verify(db.engine, strict=settings.IS_PRODUCTION)
    with db.session_scope() as session:
        bootstrap.run(session)
    # Configured is not the same as working. Checked once here so bad video
    # credentials surface in the deploy log and on /healthz, rather than when
    # somebody tries to join a session.
    video.verify_credentials()
    logger.info("started: %s", settings.describe())


# ---------------------------------------------------------------------------
# Cross-cutting handlers
# ---------------------------------------------------------------------------


@app.exception_handler(RedirectException)
async def _redirect_handler(request: Request, exc: RedirectException) -> RedirectResponse:
    return RedirectResponse(exc.location, status_code=303)


#: The Twilio Video SDK is served from our own origin, so `script-src` stays
#: 'self'. Only the signalling channel needs a third-party origin: WebRTC
#: negotiates over a WebSocket to Twilio before any media flows. The media
#: itself is peer-to-peer SRTP and is not governed by CSP.
#:
#: `media-src blob:` is needed because the SDK attaches tracks through blob URLs
#: in some browsers.
VIDEO_CSP = {
    "connect-src": " https://*.twilio.com wss://*.twilio.com",
    "media-src": " blob:",
}


def _csp() -> str:
    """The policy, widened only where video genuinely requires it.

    Kept conditional so an instance without video credentials runs the same
    strict policy as before: a capability nobody can use should not cost
    anybody a weaker header.
    """
    connect = "'self'"
    media = "'self'"
    if settings.VIDEO_LIVE:
        connect += VIDEO_CSP["connect-src"]
        media += VIDEO_CSP["media-src"]

    return (
        "default-src 'self'; img-src 'self' data:; style-src 'self'; "
        "script-src 'self'; form-action 'self'; frame-ancestors 'none'; "
        f"base-uri 'self'; connect-src {connect}; media-src {media}"
    )


@app.middleware("http")
async def security_headers(request: Request, call_next):
    """Baseline headers.

    The CSP is deliberately strict: no inline script and no third-party script
    origins. The Twilio SDK is vendored rather than loaded from a CDN precisely
    so that stays true.
    """
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault("Content-Security-Policy", _csp())
    #: The call needs the camera and microphone on this origin, and nothing else
    #: needs them at all.
    response.headers.setdefault(
        "Permissions-Policy", "camera=(self), microphone=(self), geolocation=()"
    )
    if settings.IS_PRODUCTION:
        response.headers.setdefault(
            "Strict-Transport-Security", "max-age=31536000; includeSubDomains"
        )
    return response


@app.exception_handler(404)
async def not_found(request: Request, exc) -> HTMLResponse:
    if request.url.path.startswith("/api/"):
        return JSONResponse({"detail": "Not found"}, status_code=404)
    return templates.TemplateResponse(
        request,
        "error.html",
        {
            "account": None,
            "code": 404,
            "title": "Page not found",
            "message": "That page does not exist.",
        },
        status_code=404,
    )


@app.exception_handler(500)
async def server_error(request: Request, exc) -> HTMLResponse:
    logger.exception("unhandled error at %s", request.url.path)
    return templates.TemplateResponse(
        request,
        "error.html",
        {
            "account": None,
            "code": 500,
            "title": "Something went wrong",
            "message": (
                "Something failed on our side. Nothing you were doing has been lost. "
                "Please try again in a moment."
            ),
        },
        status_code=500,
    )


# ---------------------------------------------------------------------------
# Operational endpoints
# ---------------------------------------------------------------------------


@app.get("/healthz", include_in_schema=False)
def healthz() -> JSONResponse:
    """Render polls this. Reports unhealthy if the database is unreachable."""
    database_ok = db.healthcheck()
    payload = {
        **settings.describe(),
        # Overrides the settings view, which can only report whether the
        # variables are set, with whether Twilio accepted them.
        "video": video.status(),
        "status": "ok" if database_ok else "degraded",
        "database": "ok" if database_ok else "unreachable",
        "engine_version": engine_version,
    }
    return JSONResponse(payload, status_code=200 if database_ok else 503)


@app.get("/api/config", include_in_schema=False)
def config_summary() -> dict:
    """What is live and what is simulated, for a quick post-deploy check."""
    return {
        "environment": settings.ENVIRONMENT,
        "payments": payments.describe_mode(),
        "messaging": notify.describe_mode(),
        "session_price": f"{settings.SESSION_PRICE_MINOR / 100:,.2f} {settings.SESSION_CURRENCY}",
    }


from . import admin_views, expert_views, views  # noqa: E402

app.include_router(views.router)
app.include_router(admin_views.router)
app.include_router(expert_views.router)
