# PowerShell script to get Azure Container App logs
# This will fetch logs and save them to a file

Write-Host "Fetching Azure Container App Logs..." -ForegroundColor Cyan
Write-Host ""

# Check if Azure CLI is installed
try {
    $azVersion = az version 2>&1
    Write-Host "✓ Azure CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "✗ Azure CLI is not installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Azure CLI from: https://learn.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
}

Write-Host ""

# Check if logged in
Write-Host "Checking Azure login status..." -ForegroundColor Cyan
$accountCheck = az account show 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Not logged in to Azure" -ForegroundColor Red
    Write-Host "Attempting to login..." -ForegroundColor Yellow
    az login
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Login failed" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✓ Logged in to Azure" -ForegroundColor Green
Write-Host ""

# Get Container App details
Write-Host "Fetching Container App information..." -ForegroundColor Cyan

# List all container apps to find the right one
Write-Host "Looking for niya-admin-app-india..." -ForegroundColor Yellow

$containerApps = az containerapp list --output json | ConvertFrom-Json

$niyaApp = $containerApps | Where-Object { $_.name -eq "niya-admin-app-india" }

if ($niyaApp) {
    Write-Host "✓ Found Container App: $($niyaApp.name)" -ForegroundColor Green
    Write-Host "  Resource Group: $($niyaApp.resourceGroup)" -ForegroundColor Gray
    Write-Host "  Location: $($niyaApp.location)" -ForegroundColor Gray
    Write-Host ""
    
    $resourceGroup = $niyaApp.resourceGroup
    $appName = $niyaApp.name
    
    # Get recent logs
    Write-Host "Fetching recent logs (last 50 lines)..." -ForegroundColor Cyan
    Write-Host ""
    
    $logFile = "azure_container_logs.txt"
    
    az containerapp logs show `
        --name $appName `
        --resource-group $resourceGroup `
        --tail 50 `
        --output table | Out-File -FilePath $logFile -Encoding UTF8
    
    Write-Host "✓ Logs saved to: $logFile" -ForegroundColor Green
    Write-Host ""
    
    # Also display on screen
    Write-Host "=== RECENT LOGS ===" -ForegroundColor Cyan
    Get-Content $logFile
    Write-Host ""
    Write-Host "=== END OF LOGS ===" -ForegroundColor Cyan
    Write-Host ""
    
    # Get logs with follow (real-time) - optional
    $follow = Read-Host "Do you want to follow logs in real-time? (y/n)"
    
    if ($follow -eq "y" -or $follow -eq "Y") {
        Write-Host ""
        Write-Host "Following logs... (Press Ctrl+C to stop)" -ForegroundColor Yellow
        Write-Host "Now run: python login_debug.py (in another terminal)" -ForegroundColor Yellow
        Write-Host ""
        
        az containerapp logs show `
            --name $appName `
            --resource-group $resourceGroup `
            --follow
    }
    
} else {
    Write-Host "✗ Container App 'niya-admin-app-india' not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Available Container Apps:" -ForegroundColor Yellow
    $containerApps | ForEach-Object {
        Write-Host "  - $($_.name) (Resource Group: $($_.resourceGroup))" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green






