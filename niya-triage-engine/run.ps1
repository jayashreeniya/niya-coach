# One entry point for everything. Run from niya-triage-engine\.
#
#   .\run.ps1 setup     create .venv and install dependencies (once, ~10 min)
#   .\run.ps1 app       THE DEPLOYABLE APP       -> http://localhost:8080
#   .\run.ps1 admin     create an administrator login for the admin portal
#   .\run.ps1 reset     delete the local database and rebuild it from scratch
#   .\run.ps1 preview   render every page to webapp\preview\ for layout review
#   .\run.ps1 ui        internal review dashboard -> http://localhost:8501
#   .\run.ps1 api       the REST API + docs      -> http://localhost:8000/docs
#   .\run.ps1 demo      three canned cases, no install needed
#   .\run.ps1 booking   the full journey: triage -> slot -> pay -> connect
#   .\run.ps1 seed      put a bookable session in the diary for the UI
#   .\run.ps1 try       type your own intake messages
#   .\run.ps1 test      the test suite
#   .\run.ps1 eval      the evaluation harness -> eval\report.md
#
# Everything installs into .\.venv and nothing is installed globally. This
# matters: streamlit pulls in a newer protobuf, which breaks the google-cloud
# packages used elsewhere in this repository if installed system-wide.

param([Parameter(Position = 0)][string]$Command = "help")

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$VenvPython = Join-Path $PSScriptRoot ".venv\Scripts\python.exe"

function Require-Venv {
    if (-not (Test-Path $VenvPython)) {
        Write-Host "No .venv found. Run '.\run.ps1 setup' first." -ForegroundColor Yellow
        exit 1
    }
}

# The core engine is standard-library only, so demo/try/test/eval deliberately
# fall back to system python when no venv exists.
function Get-Python {
    if (Test-Path $VenvPython) { return $VenvPython }
    return "python"
}

switch ($Command.ToLower()) {
    "setup" {
        Write-Host "Creating .venv and installing dependencies (this takes several minutes)..." -ForegroundColor Cyan
        python -m venv .venv
        & $VenvPython -m pip install --upgrade pip
        & $VenvPython -m pip install -r requirements.txt
        Write-Host "`nDone. Next: .\run.ps1 ui" -ForegroundColor Green
    }
    "app" {
        Require-Venv
        # SQLite and simulated payment/messaging unless the environment says
        # otherwise, so this runs on a clean checkout with nothing configured.
        if (-not $env:APP_SECRET_KEY) {
            $env:APP_SECRET_KEY = "local-development-secret-key-long-enough-for-dev"
        }
        Write-Host "NIYA Triage -> http://localhost:8080   (Ctrl-C to stop)" -ForegroundColor Cyan
        Write-Host "Payments and messages are simulated unless provider keys are set." -ForegroundColor DarkGray
        & $VenvPython -m uvicorn webapp.main:app --reload --port 8080
    }
    "admin" {
        Require-Venv
        if (-not $env:APP_SECRET_KEY) {
            $env:APP_SECRET_KEY = "local-development-secret-key-long-enough-for-dev"
        }
        & $VenvPython scripts\create_admin.py @args
    }
    "reset" {
        # `create_all` adds missing tables but never alters existing ones, so a
        # local database from before a schema change has to be rebuilt rather
        # than migrated. Only ever touches the local SQLite file.
        Require-Venv
        $local = Join-Path $PSScriptRoot "webapp_data\niyatriage.db"
        if ($env:DATABASE_URL -and -not $env:DATABASE_URL.StartsWith("sqlite")) {
            Write-Host "DATABASE_URL points at a real database. Refusing to reset it." -ForegroundColor Red
            exit 1
        }
        if (Test-Path $local) {
            Remove-Item $local -Force
            Write-Host "Deleted $local. It will be rebuilt and reseeded on next start." -ForegroundColor Green
        } else {
            Write-Host "No local database to delete." -ForegroundColor DarkGray
        }
    }
    "preview" {
        Require-Venv
        & $VenvPython scripts\render_preview.py
        Write-Host "`nServe them with:  python -m http.server 8098 --directory webapp" -ForegroundColor DarkGray
        Write-Host "Then open:        http://localhost:8098/preview/book.html" -ForegroundColor DarkGray
    }
    "ui" {
        Require-Venv
        Write-Host "Internal review dashboard -> http://localhost:8501   (Ctrl-C to stop)" -ForegroundColor Cyan
        Write-Host "This is a coordinator tool, not the user-facing app. Use 'app' for that." -ForegroundColor DarkGray
        & $VenvPython -m streamlit run ui/app.py --server.port 8501
    }
    "api" {
        Require-Venv
        Write-Host "API docs -> http://localhost:8000/docs   (Ctrl-C to stop)" -ForegroundColor Cyan
        & $VenvPython -m uvicorn api.app:app --reload --port 8000
    }
    "demo" { & (Get-Python) scripts\demo.py }
    "booking" { & (Get-Python) scripts\booking_demo.py }
    "seed" {
        # Defaults to a session 45 minutes out, so the joining window is
        # reachable with the clock control on the appointments screen.
        $rest = $args
        if (-not $rest) { $rest = @("--clear", "--minutes", "45") }
        & (Get-Python) scripts\seed_booking.py @rest
    }
    "try" {
        $rest = $args
        & (Get-Python) scripts\try.py @rest
    }
    "test" { & (Get-Python) -m pytest -v }
    "eval" { & (Get-Python) eval\evaluate.py }
    default {
        Write-Host @"
NIYA triage engine

  .\run.ps1 setup     create .venv and install dependencies (once, ~10 min)

The deployable app - accounts, triage, booking, payment, joining:

  .\run.ps1 app       -> http://localhost:8080
  .\run.ps1 admin     create an administrator login for the admin portal
  .\run.ps1 reset     delete the local database and rebuild it from scratch
  .\run.ps1 preview   render every page to webapp\preview\ for layout review

  Three sign-ins, three portals:
    client      /intake      describe a problem, get matched, book and pay
    counsellor  /expert      their own sessions, connect now, their hours
    admin       /admin       onboard counsellors, set fees, see the margin

Internal tools, not for deployment:

  .\run.ps1 ui        coordinator review dashboard -> http://localhost:8501
  .\run.ps1 api       the REST API + docs          -> http://localhost:8000/docs

No install needed - the engine core is standard library:

  .\run.ps1 demo      three canned cases
  .\run.ps1 booking   the full journey: triage -> slot -> pay -> connect
  .\run.ps1 seed      put a bookable session in the diary for the UI
  .\run.ps1 try       type your own intake messages
  .\run.ps1 test      the test suite
  .\run.ps1 eval      the evaluation harness -> eval\report.md
"@
    }
}
