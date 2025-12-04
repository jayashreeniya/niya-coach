# Mobile App API Endpoint Testing Script
# Run this before rebuilding the mobile app to verify backend is accessible

$baseUrl = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Backend API Endpoints" -ForegroundColor Cyan
Write-Host "Backend URL: $baseUrl" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$tests = @(
    @{
        Name = "Health Check"
        Url = "$baseUrl/healthcheck"
        Method = "GET"
        RequiresAuth = $false
    },
    @{
        Name = "Privacy Policy (Public)"
        Url = "$baseUrl/account_block/accounts/privacy_policy"
        Method = "GET"
        RequiresAuth = $false
    },
    @{
        Name = "Terms and Conditions (Public)"
        Url = "$baseUrl/account_block/accounts/term_and_condition"
        Method = "GET"
        RequiresAuth = $false
    }
)

$passed = 0
$failed = 0
$warnings = 0

foreach ($test in $tests) {
    Write-Host "Testing: $($test.Name)" -ForegroundColor Yellow
    Write-Host "  URL: $($test.Url)" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $test.Url -Method $test.Method -UseBasicParsing -ErrorAction Stop
        Write-Host "  Status: $($response.StatusCode) - OK" -ForegroundColor Green
        $passed++
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 401 -and $test.RequiresAuth) {
            Write-Host "  Status: $statusCode - Requires Authentication (Expected)" -ForegroundColor Yellow
            $warnings++
        } elseif ($statusCode -eq 404) {
            Write-Host "  Status: $statusCode - Not Found (Endpoint may not exist)" -ForegroundColor Red
            $failed++
        } else {
            Write-Host "  Status: $statusCode - ERROR: $($_.Exception.Message)" -ForegroundColor Red
            $failed++
        }
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Summary:" -ForegroundColor Cyan
Write-Host "  Passed: $passed" -ForegroundColor Green
Write-Host "  Warnings: $warnings" -ForegroundColor Yellow
Write-Host "  Failed: $failed" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($failed -eq 0) {
    Write-Host "✅ Backend is accessible! Safe to rebuild mobile app." -ForegroundColor Green
} else {
    Write-Host "❌ Some endpoints failed. Check backend logs before rebuilding." -ForegroundColor Red
    Write-Host "   Run: az containerapp logs show --name niya-admin-app-india --resource-group niya-rg --tail 100" -ForegroundColor Yellow
}




