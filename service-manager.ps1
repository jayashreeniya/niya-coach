# Service Manager for NIYA Coach
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('start', 'stop', 'status')]
    [string]$Action
)

$ErrorActionPreference = "Stop"
$serviceName = "NIYACoach"
$projectPath = "C:\Users\Hp\niya-coach\niya-coach"

function Write-Status {
    param($Message, $Type = "Info")
    $color = switch ($Type) {
        "Info" { "Cyan" }
        "Success" { "Green" }
        "Error" { "Red" }
        "Warning" { "Yellow" }
    }
    Write-Host "`n[$Type] $Message" -ForegroundColor $color
}

function Start-NIYAService {
    try {
        # Check if service is already running
        $existingJob = Get-Job -Name $serviceName -ErrorAction SilentlyContinue
        if ($existingJob) {
            Write-Status "Service is already running (Job ID: $($existingJob.Id))" "Warning"
            return
        }

        # Start React development server
        $startScript = {
            param($Path)
            Set-Location -Path $Path
            npm start
        }
        
        Start-Job -Name $serviceName -ScriptBlock $startScript -ArgumentList $projectPath
        Write-Status "Service started successfully" "Success"
        Write-Status "Access the application at http://localhost:3000" "Info"
        
        # Start Firebase emulator if needed
        if (Test-Path (Join-Path $projectPath "firebase.json")) {
            Start-Job -Name "$serviceName-firebase" -ScriptBlock {
                param($Path)
                Set-Location -Path $Path
                firebase emulators:start
            } -ArgumentList $projectPath
            Write-Status "Firebase emulator started" "Success"
        }
    } catch {
        Write-Status "Failed to start service: $_" "Error"
        exit 1
    }
}

function Stop-NIYAService {
    try {
        $jobs = Get-Job -Name "$serviceName*" -ErrorAction SilentlyContinue
        if ($jobs) {
            $jobs | Stop-Job
            $jobs | Remove-Job
            Write-Status "Service stopped successfully" "Success"
        } else {
            Write-Status "No running services found" "Warning"
        }
    } catch {
        Write-Status "Failed to stop service: $_" "Error"
        exit 1
    }
}

function Get-NIYAStatus {
    try {
        $jobs = Get-Job -Name "$serviceName*" -ErrorAction SilentlyContinue
        if ($jobs) {
            Write-Status "Service Status:" "Info"
            $jobs | ForEach-Object {
                Write-Host "- $($_.Name): Running (Job ID: $($_.Id))"
                Write-Host "  State: $($_.State)"
                if ($_.State -eq "Failed") {
                    Receive-Job -Job $_ | Write-Host
                }
            }
        } else {
            Write-Status "No running services found" "Warning"
        }
    } catch {
        Write-Status "Failed to get service status: $_" "Error"
        exit 1
    }
}

# Main execution
switch ($Action) {
    'start' { Start-NIYAService }
    'stop' { Stop-NIYAService }
    'status' { Get-NIYAStatus }
} 