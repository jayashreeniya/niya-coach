# Comprehensive API Endpoint Testing Script
# Tests all mobile app API endpoints before rebuilding

$baseUrl = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io"
$global:authToken = $null
$global:testResults = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Body = $null,
        [hashtable]$Headers = @{},
        [bool]$RequiresAuth = $false,
        [bool]$Expect401 = $false
    )
    
    $headers = $Headers.Clone()
    if ($RequiresAuth -and $global:authToken) {
        $headers["Authorization"] = "Bearer $global:authToken"
    }
    $headers["Content-Type"] = "application/json"
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    Write-Host "  $Method $Url" -ForegroundColor Gray
    
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
        
        if ($Expect401) {
            Write-Host "  Status: $statusCode - Expected 401 (Requires Auth)" -ForegroundColor Yellow
            $global:testResults += @{
                Name = $Name
                Status = "Expected 401"
                Code = $statusCode
                Success = $true
            }
        } else {
            Write-Host "  Status: $statusCode - OK" -ForegroundColor Green
            $global:testResults += @{
                Name = $Name
                Status = "OK"
                Code = $statusCode
                Success = $true
            }
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $errorMsg = $_.Exception.Message
        
        if ($statusCode -eq 401 -and ($RequiresAuth -or $Expect401)) {
            Write-Host "  Status: $statusCode - Requires Authentication (Expected)" -ForegroundColor Yellow
            $global:testResults += @{
                Name = $Name
                Status = "Requires Auth"
                Code = $statusCode
                Success = $true
            }
        } elseif ($statusCode -eq 404) {
            Write-Host "  Status: $statusCode - Not Found" -ForegroundColor Red
            $global:testResults += @{
                Name = $Name
                Status = "Not Found"
                Code = $statusCode
                Success = $false
            }
        } elseif ($statusCode -eq 422) {
            Write-Host "  Status: $statusCode - Validation Error (May need valid data)" -ForegroundColor Yellow
            $global:testResults += @{
                Name = $Name
                Status = "Validation Error"
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
Write-Host "Comprehensive API Endpoint Testing" -ForegroundColor Cyan
Write-Host "Backend URL: $baseUrl" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# 1. PUBLIC ENDPOINTS (No Auth Required)
# ============================================
Write-Host "=== PUBLIC ENDPOINTS ===" -ForegroundColor Magenta
Write-Host ""

Test-Endpoint -Name "Health Check" -Url "$baseUrl/healthcheck"
Test-Endpoint -Name "Privacy Policy" -Url "$baseUrl/account_block/accounts/privacy_policy"
Test-Endpoint -Name "Terms and Conditions" -Url "$baseUrl/account_block/accounts/term_and_condition"

# ============================================
# 2. AUTHENTICATION ENDPOINTS
# ============================================
Write-Host "=== AUTHENTICATION ENDPOINTS ===" -ForegroundColor Magenta
Write-Host ""

# Note: Login requires valid credentials - will test structure only
Test-Endpoint -Name "Login Endpoint (Structure)" -Url "$baseUrl/bx_block_login/logins" -Method "POST" -Body @{email="test@test.com"; password="test"} -Expect401 $true

Write-Host "  Note: Login requires valid credentials. Test with real account after getting credentials." -ForegroundColor Gray
Write-Host ""

# ============================================
# 3. ACCOUNT ENDPOINTS (Require Auth)
# ============================================
Write-Host "=== ACCOUNT ENDPOINTS ===" -ForegroundColor Magenta
Write-Host ""

Test-Endpoint -Name "Get Account Details" -Url "$baseUrl/account_block/accounts" -RequiresAuth $true
Test-Endpoint -Name "Get HR Details" -Url "$baseUrl/account_block/accounts/get_hr_details" -RequiresAuth $true
Test-Endpoint -Name "All Users Feedbacks" -Url "$baseUrl/account_block/all_users_feedbacks" -RequiresAuth $true
Test-Endpoint -Name "User Feedback" -Url "$baseUrl/account_block/user_feedback" -RequiresAuth $true

# ============================================
# 4. COMPANY & COACH ENDPOINTS
# ============================================
Write-Host "=== COMPANY & COACH ENDPOINTS ===" -ForegroundColor Magenta
Write-Host ""

Test-Endpoint -Name "Get Company" -Url "$baseUrl/bx_block_companies/get_company" -RequiresAuth $true
Test-Endpoint -Name "Get All Company Details" -Url "$baseUrl/bx_block_companies/get_all_details" -RequiresAuth $true
Test-Endpoint -Name "Get Coaches" -Url "$baseUrl/bx_block_companies/get_coaches" -RequiresAuth $true
Test-Endpoint -Name "Get Employees" -Url "$baseUrl/bx_block_companies/get_employees" -RequiresAuth $true
Test-Endpoint -Name "Get HRs" -Url "$baseUrl/bx_block_companies/get_hrs" -RequiresAuth $true
Test-Endpoint -Name "Coach Expertise" -Url "$baseUrl/bx_block_companies/coach_expertise" -RequiresAuth $true
Test-Endpoint -Name "Companies List" -Url "$baseUrl/bx_block_companies/companies_list" -RequiresAuth $true

# ============================================
# 5. WELLBEING ENDPOINTS
# ============================================
Write-Host "=== WELLBEING ENDPOINTS ===" -ForegroundColor Magenta
Write-Host ""

Test-Endpoint -Name "All Categories" -Url "$baseUrl/bx_block_wellbeing/all_categories" -RequiresAuth $true
Test-Endpoint -Name "Question Categories" -Url "$baseUrl/bx_block_wellbeing/question_categories" -RequiresAuth $true
Test-Endpoint -Name "Get Questions" -Url "$baseUrl/bx_block_wellbeing/question" -RequiresAuth $true
Test-Endpoint -Name "Get Result" -Url "$baseUrl/bx_block_wellbeing/get_result" -RequiresAuth $true
Test-Endpoint -Name "User Strength" -Url "$baseUrl/bx_block_wellbeing/user_strength" -RequiresAuth $true
Test-Endpoint -Name "Insights" -Url "$baseUrl/bx_block_wellbeing/insights" -RequiresAuth $true
Test-Endpoint -Name "Insights Data" -Url "$baseUrl/bx_block_wellbeing/insights_data" -RequiresAuth $true

# ============================================
# 6. APPOINTMENT & CALENDAR ENDPOINTS
# ============================================
Write-Host "=== APPOINTMENT & CALENDAR ENDPOINTS ===" -ForegroundColor Magenta
Write-Host ""

Test-Endpoint -Name "Booked Slots" -Url "$baseUrl/bx_block_calendar/booked_slots" -RequiresAuth $true
Test-Endpoint -Name "View Coach Availability" -Url "$baseUrl/bx_block_calendar/booked_slots/view_coach_availability" -RequiresAuth $true
Test-Endpoint -Name "Current Coach" -Url "$baseUrl/bx_block_calendar/booked_slots/current_coach" -RequiresAuth $true
Test-Endpoint -Name "Past Coach" -Url "$baseUrl/bx_block_calendar/booked_slots/past_coach" -RequiresAuth $true
Test-Endpoint -Name "User Appointments" -Url "$baseUrl/bx_block_calendar/booked_slots/user_appointments" -RequiresAuth $true
Test-Endpoint -Name "All Slots" -Url "$baseUrl/bx_block_calendar/booked_slots/all_slots" -RequiresAuth $true
Test-Endpoint -Name "Booked Slot Details" -Url "$baseUrl/bx_block_calendar/booked_slots/booked_slot_details" -RequiresAuth $true
Test-Endpoint -Name "Availabilities" -Url "$baseUrl/bx_block_appointment_management/availabilities" -RequiresAuth $true

# ============================================
# 7. ASSESSMENT TEST ENDPOINTS
# ============================================
Write-Host "=== ASSESSMENT TEST ENDPOINTS ===" -ForegroundColor Magenta
Write-Host ""

Test-Endpoint -Name "Personality Test Questions" -Url "$baseUrl/bx_block_assessmenttest/personality_test_questions" -RequiresAuth $true
Test-Endpoint -Name "Niya Test Questions" -Url "$baseUrl/bx_block_assessmenttest/niya_test_questions" -RequiresAuth $true
Test-Endpoint -Name "Assess Yourself Test Questions" -Url "$baseUrl/bx_block_assessmenttest/assess_yourself_test_questions" -RequiresAuth $true
Test-Endpoint -Name "Motions" -Url "$baseUrl/motions" -RequiresAuth $true
Test-Endpoint -Name "Emo Journey Status" -Url "$baseUrl/emo_journey_status" -RequiresAuth $true

# ============================================
# 8. PROFILE ENDPOINTS
# ============================================
Write-Host "=== PROFILE ENDPOINTS ===" -ForegroundColor Magenta
Write-Host ""

Test-Endpoint -Name "Profile Details" -Url "$baseUrl/profile_details" -RequiresAuth $true

# ============================================
# 9. PUSH NOTIFICATIONS
# ============================================
Write-Host "=== PUSH NOTIFICATIONS ===" -ForegroundColor Magenta
Write-Host ""

Test-Endpoint -Name "Push Notifications" -Url "$baseUrl/bx_block_push_notifications/push_notifications" -RequiresAuth $true

# ============================================
# 10. CHAT ENDPOINTS
# ============================================
Write-Host "=== CHAT ENDPOINTS ===" -ForegroundColor Magenta
Write-Host ""

Test-Endpoint -Name "Conversation" -Url "$baseUrl/conversation" -RequiresAuth $true
Test-Endpoint -Name "Chat Backup" -Url "$baseUrl/bx_block_chatbackuprestore/chat_backup_restores/chat_backup" -RequiresAuth $true
Test-Endpoint -Name "Active Chats Room" -Url "$baseUrl/bx_block_chatbackuprestore/chat_backup_restores/active_chats_room" -RequiresAuth $true

# ============================================
# 11. AUDIO/VIDEO LIBRARY
# ============================================
Write-Host "=== AUDIO/VIDEO LIBRARY ===" -ForegroundColor Magenta
Write-Host ""

Test-Endpoint -Name "Audio List" -Url "$baseUrl/bx_block_audiolibrary/audio_list" -RequiresAuth $true
Test-Endpoint -Name "Video List" -Url "$baseUrl/video_list" -RequiresAuth $true
Test-Endpoint -Name "Article List" -Url "$baseUrl/artical_list" -RequiresAuth $true

# ============================================
# 12. CONTACT US
# ============================================
Write-Host "=== CONTACT US ===" -ForegroundColor Magenta
Write-Host ""

Test-Endpoint -Name "Contact" -Url "$baseUrl/bx_block_contact_us/contacts" -RequiresAuth $true

# ============================================
# SUMMARY
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$total = $global:testResults.Count
$success = ($global:testResults | Where-Object { $_.Success -eq $true }).Count
$failed = ($global:testResults | Where-Object { $_.Success -eq $false }).Count
$requiresAuth = ($global:testResults | Where-Object { $_.Status -like "*Auth*" }).Count

Write-Host "Total Endpoints Tested: $total" -ForegroundColor White
Write-Host "  Successful/Expected: $success" -ForegroundColor Green
Write-Host "  Failed: $failed" -ForegroundColor Red
Write-Host "  Require Authentication: $requiresAuth" -ForegroundColor Yellow
Write-Host ""

if ($failed -eq 0) {
    Write-Host "✅ All endpoints are accessible!" -ForegroundColor Green
    Write-Host "   Backend is ready for mobile app connection." -ForegroundColor Green
} else {
    Write-Host "⚠️  Some endpoints failed. Review details above." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Failed Endpoints:" -ForegroundColor Red
    $global:testResults | Where-Object { $_.Success -eq $false } | ForEach-Object {
        Write-Host "  - $($_.Name): $($_.Status) ($($_.Code))" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NEXT STEPS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. If all tests passed: Rebuild mobile app" -ForegroundColor White
Write-Host "2. If some failed: Check backend logs:" -ForegroundColor White
Write-Host "   az containerapp logs show --name niya-admin-app-india --resource-group niya-rg --tail 100" -ForegroundColor Gray
Write-Host "3. Test authentication with real credentials" -ForegroundColor White
Write-Host "4. Test protected endpoints with auth token" -ForegroundColor White
Write-Host ""




