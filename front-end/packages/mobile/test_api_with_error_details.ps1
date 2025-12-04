# API Endpoint Testing Script - With Error Details
# Tests API endpoints and shows actual error messages

$baseUrl = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io"

function Test-Endpoint-WithDetails {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Body = $null,
        [hashtable]$Headers = @{}
    )
    
    $headers = $Headers.Clone()
    $headers["Content-Type"] = "application/json"
    
    Write-Host "`n=== Testing: $Name ===" -ForegroundColor Cyan
    Write-Host "URL: $Url" -ForegroundColor Gray
    
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
        Write-Host "Status: $($response.StatusCode) - OK" -ForegroundColor Green
        
        try {
            $jsonResponse = $response.Content | ConvertFrom-Json
            Write-Host "Response:" -ForegroundColor Yellow
            $jsonResponse | ConvertTo-Json -Depth 5 | Write-Host
        } catch {
            Write-Host "Response (non-JSON): $($response.Content)" -ForegroundColor Yellow
        }
        
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $errorMsg = $_.Exception.Message
        
        Write-Host "Status: $statusCode - ERROR" -ForegroundColor Red
        Write-Host "Error: $errorMsg" -ForegroundColor Red
        
        # Try to read error response body
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            $reader.Close()
            
            if ($responseBody) {
                Write-Host "Error Response:" -ForegroundColor Yellow
                try {
                    $errorJson = $responseBody | ConvertFrom-Json
                    $errorJson | ConvertTo-Json -Depth 5 | Write-Host
                } catch {
                    Write-Host $responseBody -ForegroundColor Yellow
                }
            }
        } catch {
            Write-Host "Could not read error response body" -ForegroundColor Gray
        }
    }
}

# Test 1: Health check (should work)
Test-Endpoint-WithDetails -Name "Health Check" `
    -Url "$baseUrl/healthcheck"

# Test 2: Get availability with valid format but possibly invalid ID
$today = Get-Date
$ddmmyyyy = $today.ToString("dd/MM/yyyy")
Test-Endpoint-WithDetails -Name "Get Availability - DD/MM/YYYY (service_provider_id=1)" `
    -Url "$baseUrl/bx_block_appointment_management/availabilities?service_provider_id=1&availability_date=$ddmmyyyy"

# Test 3: Get availability with YYYY-MM-DD format
$yyyymmdd = $today.ToString("yyyy-MM-dd")
Test-Endpoint-WithDetails -Name "Get Availability - YYYY-MM-DD (service_provider_id=1)" `
    -Url "$baseUrl/bx_block_appointment_management/availabilities?service_provider_id=1&availability_date=$yyyymmdd"

# Test 4: Get availability with invalid format
Test-Endpoint-WithDetails -Name "Get Availability - Invalid format (MM/DD/YYYY)" `
    -Url "$baseUrl/bx_block_appointment_management/availabilities?service_provider_id=1&availability_date=11/13/2025"

# Test 5: Get availability with missing parameters
Test-Endpoint-WithDetails -Name "Get Availability - Missing date" `
    -Url "$baseUrl/bx_block_appointment_management/availabilities?service_provider_id=1"

# Test 6: All slots (public endpoint)
Test-Endpoint-WithDetails -Name "All Slots (Public)" `
    -Url "$baseUrl/bx_block_calendar/booked_slots/all_slots"

# Test 7: Booked slot details (public endpoint)
Test-Endpoint-WithDetails -Name "Booked Slot Details (Public)" `
    -Url "$baseUrl/bx_block_calendar/booked_slots/booked_slot_details"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Testing Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: 400 errors for availability endpoints may be expected if:" -ForegroundColor Yellow
Write-Host "  - service_provider_id doesn't exist" -ForegroundColor Gray
Write-Host "  - No availability exists for that date" -ForegroundColor Gray
Write-Host "  - Date format parsing errors (check error messages above)" -ForegroundColor Gray
Write-Host "  - Changes haven't been deployed yet" -ForegroundColor Gray
Write-Host ""




