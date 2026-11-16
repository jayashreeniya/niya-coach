# Matches how the rest of NIYA deploys on Render: a Docker web service that
# binds to $PORT.
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Requirements first, so a code change does not reinstall the dependency layer.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY niya_triage/ ./niya_triage/
COPY webapp/ ./webapp/
COPY data/ ./data/
# The reminder cron job runs from this same image.
COPY scripts/send_due_notifications.py ./scripts/

# Run as a non-root user. Render does not require it, but a container that never
# needs root should not have it.
RUN useradd --create-home --shell /bin/bash app && chown -R app:app /app
USER app

EXPOSE 8080

# Render supplies PORT; 8080 is the fallback for `docker run` locally.
# One worker per container: scale with replicas rather than in-process workers,
# so memory per container stays predictable on Render's smaller instances.
CMD ["sh", "-c", "uvicorn webapp.main:app --host 0.0.0.0 --port ${PORT:-8080} --workers 1 --proxy-headers --forwarded-allow-ips='*'"]
