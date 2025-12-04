# Mobile App API Endpoint Testing Guide

**Last Updated:** November 12, 2025  
**Backend URL:** `https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io`

---

## Quick Test - Backend Accessibility

### 1. Health Check
```bash
curl https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/healthcheck
```

**Expected:** `200 OK` response with "Ok"

---

## Key API Endpoints to Test

### Authentication Endpoints

#### 1. User Login
```bash
curl -X POST https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_login/logins \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected:** JSON response with authentication token

#### 2. User Logout
```bash
curl -X DELETE https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_login/logins/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Account Endpoints

#### 3. Get Account Details
```bash
curl https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/account_block/accounts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 4. Privacy Policy
```bash
curl https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/account_block/accounts/privacy_policy
```

#### 5. Terms and Conditions
```bash
curl https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/account_block/accounts/term_and_condition
```

---

### Coach & Company Endpoints

#### 6. Get Company Details
```bash
curl https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_companies/get_company \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 7. Get Coaches
```bash
curl https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_companies/get_coaches \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 8. Coach Expertise
```bash
curl https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_companies/coach_expertise \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Wellbeing Endpoints

#### 9. Get All Categories
```bash
curl https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_wellbeing/all_categories \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 10. Get Questions
```bash
curl https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_wellbeing/question \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Appointment Management

#### 11. Get Appointments (if endpoint exists)
```bash
curl https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_appointment_management/appointments \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Testing Script

Save this as `test_apis.sh` (or `test_apis.ps1` for Windows):

```bash
#!/bin/bash

BASE_URL="https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io"

echo "Testing Backend API Endpoints..."
echo "=================================="
echo ""

# Health Check
echo "1. Health Check:"
curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/healthcheck"
echo " - $BASE_URL/healthcheck"
echo ""

# Privacy Policy (public endpoint)
echo "2. Privacy Policy (public):"
curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/account_block/accounts/privacy_policy"
echo " - $BASE_URL/account_block/accounts/privacy_policy"
echo ""

# Terms and Conditions (public endpoint)
echo "3. Terms and Conditions (public):"
curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/account_block/accounts/term_and_condition"
echo " - $BASE_URL/account_block/accounts/term_and_condition"
echo ""

echo "=================================="
echo "Note: Authentication endpoints require valid credentials"
echo "Other endpoints require authentication tokens"
```

---

## PowerShell Test Script (Windows)

Save this as `test_apis.ps1`:

```powershell
$baseUrl = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io"

Write-Host "Testing Backend API Endpoints..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Health Check
Write-Host "1. Health Check:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/healthcheck" -Method Get -UseBasicParsing
    Write-Host "   Status: $($response.StatusCode) - OK" -ForegroundColor Green
} catch {
    Write-Host "   Status: ERROR - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host "   URL: $baseUrl/healthcheck"
Write-Host ""

# Privacy Policy
Write-Host "2. Privacy Policy (public):" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/account_block/accounts/privacy_policy" -Method Get -UseBasicParsing
    Write-Host "   Status: $($response.StatusCode) - OK" -ForegroundColor Green
} catch {
    Write-Host "   Status: ERROR - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host "   URL: $baseUrl/account_block/accounts/privacy_policy"
Write-Host ""

# Terms and Conditions
Write-Host "3. Terms and Conditions (public):" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/account_block/accounts/term_and_condition" -Method Get -UseBasicParsing
    Write-Host "   Status: $($response.StatusCode) - OK" -ForegroundColor Green
} catch {
    Write-Host "   Status: ERROR - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host "   URL: $baseUrl/account_block/accounts/term_and_condition"
Write-Host ""

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Note: Authentication endpoints require valid credentials" -ForegroundColor Yellow
Write-Host "Other endpoints require authentication tokens" -ForegroundColor Yellow
```

---

## What to Check

### ✅ Success Indicators:
- **200 OK** - Endpoint is working
- **401 Unauthorized** - Endpoint exists but needs authentication (this is expected for protected endpoints)
- **404 Not Found** - Endpoint doesn't exist (may need to check routes)

### ❌ Error Indicators:
- **500 Internal Server Error** - Backend has an issue
- **502 Bad Gateway** - Backend is not accessible
- **503 Service Unavailable** - Backend is down
- **Connection timeout** - Network/firewall issue

---

## Next Steps After API Testing

1. ✅ **If APIs work:** Proceed to rebuild mobile app
2. ❌ **If APIs fail:** Fix backend issues first, then rebuild app
3. ⚠️ **If some APIs fail:** Document which ones, then decide if mobile app can work without them

---

## Testing Authentication Flow

To fully test authentication, you'll need:
1. A valid user account in the database
2. Test the login endpoint with real credentials
3. Get the authentication token
4. Use that token to test protected endpoints

---

## Common Issues

### Issue: CORS errors
**Solution:** Already configured - CORS allows all origins (`origins '*'`)

### Issue: 404 on endpoints
**Solution:** Check if the route exists in `back-end/config/routes.rb`

### Issue: 500 errors
**Solution:** Check backend logs:
```bash
az containerapp logs show --name niya-admin-app-india --resource-group niya-rg --tail 100
```




