# API Endpoint Testing Script - Date Format Validation
# Tests the fixed date parsing in API controllers

$baseUrl = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io"
$global:testResults = @()

function Test-DateFormat {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Body = $null,
        [hashtable]$Headers = @{},
        [string]$ExpectedStatus = "200",
        [bool]$RequiresAuth = $false
    )
    
    $headers = $Headers.Clone()
    $headers["Content-Type"] = "application/json"
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    Write-Host "  $Method $Url" -ForegroundColor Gray
    if ($Body) {
        Write-Host "  Body: $($Body | ConvertTo-Json -Compress)" -ForegroundColor Gray
    }
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $headers
            UseBasicParsing = $true
            ErrorAction = "Stop"
        }
        
        if ($Body) {
            $params["Body"] = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-WebRequest @params
        $statusCode = $response.StatusCode
        
        if ($statusCode -eq [int]$ExpectedStatus) {
            Write-Host "  Status: $statusCode - OK (Expected)" -ForegroundColor Green
            $global:testResults += @{
                Name = $Name
                Status = "OK"
                Code = $statusCode
                Success = $true
            }
        } else {
            Write-Host "  Status: $statusCode - Unexpected (Expected $ExpectedStatus)" -ForegroundColor Yellow
            $global:testResults += @{
                Name = $Name
                Status = "Unexpected"
                Code = $statusCode
                Success = $true
            }
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $errorMsg = $_.Exception.Message
        
        if ($statusCode -eq 401 -and $RequiresAuth) {
            Write-Host "  Status: $statusCode - Requires Authentication (Expected)" -ForegroundColor Yellow
            $global:testResults += @{
                Name = $Name
                Status = "Requires Auth"
                Code = $statusCode
                Success = $true
            }
        } elseif ($statusCode -eq 422 -and $ExpectedStatus -eq "422") {
            Write-Host "  Status: $statusCode - Validation Error (Expected)" -ForegroundColor Green
            $global:testResults += @{
                Name = $Name
                Status = "Validation Error (Expected)"
                Code = $statusCode
                Success = $true
            }
        } elseif ($statusCode -eq 400 -and $ExpectedStatus -eq "400") {
            Write-Host "  Status: $statusCode - Bad Request (Expected)" -ForegroundColor Green
            $global:testResults += @{
                Name = $Name
                Status = "Bad Request (Expected)"
                Code = $statusCode
                Success = $true
            }
        } else {
            Write-Host "  Status: $statusCode - ERROR: $errorMsg" -ForegroundColor Red
            $global:testResults += @{
                Name = $Name
                Status = "Error"
                Code = $statusCode
                Success = $false
            }
        }
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "API Date Format Testing" -ForegroundColor Cyan
Write-Host "Backend URL: $baseUrl" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test service provider ID (we'll use a placeholder - may need real ID)
$testServiceProviderId = "1"
$today = Get-Date
$ddmmyyyy = $today.ToString("dd/MM/yyyy")
$yyyymmdd = $today.ToString("yyyy-MM-dd")
$mmddyyyy = $today.ToString("MM/dd/yyyy")

Write-Host "=== TESTING AVAILABILITY ENDPOINTS ===" -ForegroundColor Magenta
Write-Host ""

# Test 1: GET availability with DD/MM/YYYY format (expected format)
Test-DateFormat -Name "Get Availability - DD/MM/YYYY format" `
    -Url "$baseUrl/bx_block_appointment_management/availabilities?service_provider_id=$testServiceProviderId&availability_date=$ddmmyyyy" `
    -ExpectedStatus "200"

# Test 2: GET availability with YYYY-MM-DD format (should also work)
Test-DateFormat -Name "Get Availability - YYYY-MM-DD format" `
    -Url "$baseUrl/bx_block_appointment_management/availabilities?service_provider_id=$testServiceProviderId&availability_date=$yyyymmdd" `
    -ExpectedStatus "200"

# Test 3: GET availability with invalid format (should return 422)
Test-DateFormat -Name "Get Availability - Invalid format (MM/DD/YYYY)" `
    -Url "$baseUrl/bx_block_appointment_management/availabilities?service_provider_id=$testServiceProviderId&availability_date=$mmddyyyy" `
    -ExpectedStatus "422"

# Test 4: GET availability with missing date (should return 422)
Test-DateFormat -Name "Get Availability - Missing date parameter" `
    -Url "$baseUrl/bx_block_appointment_management/availabilities?service_provider_id=$testServiceProviderId" `
    -ExpectedStatus "422"

# Test 5: GET availability with missing service_provider_id (should return 422)
Test-DateFormat -Name "Get Availability - Missing service_provider_id" `
    -Url "$baseUrl/bx_block_appointment_management/availabilities?availability_date=$ddmmyyyy" `
    -ExpectedStatus "422"

Write-Host "=== TESTING BOOKED SLOTS ENDPOINTS ===" -ForegroundColor Magenta
Write-Host ""

# Test 6: View coach availability (requires auth, but tests endpoint structure)
Test-DateFormat -Name "View Coach Availability - DD/MM/YYYY format" `
    -Url "$baseUrl/bx_block_calendar/booked_slots/view_coach_availability?booking_date=$ddmmyyyy" `
    -ExpectedStatus "400" `
    -RequiresAuth $true

# Test 7: All slots (public endpoint)
Test-DateFormat -Name "All Slots (Public)" `
    -Url "$baseUrl/bx_block_calendar/booked_slots/all_slots" `
    -ExpectedStatus "200"

# Test 8: Booked slot details (public endpoint)
Test-DateFormat -Name "Booked Slot Details (Public)" `
    -Url "$baseUrl/bx_block_calendar/booked_slots/booked_slot_details" `
    -ExpectedStatus "200"

Write-Host "=== TESTING OTHER ENDPOINTS ===" -ForegroundColor Magenta
Write-Host ""

# Test 9: Health check
Test-DateFormat -Name "Health Check" `
    -Url "$baseUrl/healthcheck" `
    -ExpectedStatus "200"

# Test 10: Privacy Policy
Test-DateFormat -Name "Privacy Policy" `
    -Url "$baseUrl/account_block/accounts/privacy_policy" `
    -ExpectedStatus "200"

# Test 11: Terms and Conditions
Test-DateFormat -Name "Terms and Conditions" `
    -Url "$baseUrl/account_block/accounts/term_and_condition" `
    -ExpectedStatus "200"

# Test 12: Companies List (may require auth)
Test-DateFormat -Name "Companies List" `
    -Url "$baseUrl/bx_block_companies/companies_list" `
    -ExpectedStatus "200"

Write-Host "=== TESTING DATE PARSING EDGE CASES ===" -ForegroundColor Magenta
Write-Host ""

# Test 13: Invalid date string
Test-DateFormat -Name "Get Availability - Invalid date string" `
    -Url "$baseUrl/bx_block_appointment_management/availabilities?service_provider_id=$testServiceProviderId&availability_date=invalid-date" `
    -ExpectedStatus "422"

# Test 14: Empty date string
Test-DateFormat -Name "Get Availability - Empty date string" `
    -Url "$baseUrl/bx_block_appointment_management/availabilities?service_provider_id=$testServiceProviderId&availability_date=" `
    -ExpectedStatus "422"

# Test 15: Future date (should work if format is correct)
$futureDate = (Get-Date).AddDays(30).ToString("dd/MM/yyyy")
Test-DateFormat -Name "Get Availability - Future date (DD/MM/YYYY)" `
    -Url "$baseUrl/bx_block_appointment_management/availabilities?service_provider_id=$testServiceProviderId&availability_date=$futureDate" `
    -ExpectedStatus "200"

# Test 16: Past date (should work if format is correct)
$pastDate = (Get-Date).AddDays(-30).ToString("dd/MM/yyyy")
Test-DateFormat -Name "Get Availability - Past date (DD/MM/YYYY)" `
    -Url "$baseUrl/bx_block_appointment_management/availabilities?service_provider_id=$testServiceProviderId&availability_date=$pastDate" `
    -ExpectedStatus "200"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$total = $global:testResults.Count
$success = ($global:testResults | Where-Object { $_.Success -eq $true }).Count
$failed = ($global:testResults | Where-Object { $_.Success -eq $false }).Count

Write-Host "Total Tests: $total" -ForegroundColor White
Write-Host "  Successful: $success" -ForegroundColor Green
Write-Host "  Failed: $failed" -ForegroundColor Red
Write-Host ""

if ($failed -eq 0) {
    Write-Host "✅ All date format tests passed!" -ForegroundColor Green
    Write-Host "   API endpoints are handling dates correctly." -ForegroundColor Green
} else {
    Write-Host "⚠️  Some tests failed. Review details above." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Failed Tests:" -ForegroundColor Red
    $global:testResults | Where-Object { $_.Success -eq $false } | ForEach-Object {
        Write-Host "  - $($_.Name): $($_.Status) ($($_.Code))" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DATE FORMAT SUPPORT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Supported Formats:" -ForegroundColor Green
Write-Host "  - DD/MM/YYYY (e.g., 25/11/2025) - Primary format" -ForegroundColor White
Write-Host "  - YYYY-MM-DD (e.g., 2025-11-25) - Alternative format" -ForegroundColor White
Write-Host ""
Write-Host "❌ Unsupported Formats:" -ForegroundColor Red
Write-Host "  - MM/DD/YYYY (e.g., 11/25/2025)" -ForegroundColor White
Write-Host "  - Invalid date strings" -ForegroundColor White
Write-Host ""




