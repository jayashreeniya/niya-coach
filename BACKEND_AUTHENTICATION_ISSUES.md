# Backend Authentication Issues - Summary

**Date:** December 4, 2025  
**Backend URL:** https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io

---

## Current Status

### ✅ What's Working:
1. **Backend is deployed and accessible** on Azure Container Apps
2. **Database connection is working** (backend responds to requests)
3. **Admin Portal login works** at `/admin` with credentials:
   - Email: `nidhil@niya.app`
   - Password: `Niya@7k2TuY`
4. **Public/health endpoints work** (tested earlier)

### ❌ What's NOT Working:
1. **API Login** (`/bx_block_login/logins`) - Returns 422 Unprocessable Entity
2. **API Registration** (`/account_block/accounts`) - Returns 422 Unprocessable Entity  
3. **Admin Accounts Page** (`/admin/accounts`) - Returns HTTP 500 Internal Server Error
4. **Cannot create/manage users** through admin portal

---

## Issues Identified

### Issue 1: Generic 422 Errors Without Details

**Problem:** Both login and registration endpoints return:
```json
{
  "status": 422,
  "error": "Unprocessable Entity"
}
```

**Without any specific error details** like:
- Which field is invalid
- What validation failed
- What the actual problem is

**Expected behavior:** Backend should return specific error messages like:
```json
{
  "errors": [{
    "account": "Email not found or not activated"
  }]
}
```

**Possible causes:**
1. Exception being caught and returning generic error
2. Parameter parsing failing at Rails level
3. JSON API deserialization issue
4. Database schema mismatch

### Issue 2: Admin Accounts Page Crash (500 Error)

**Problem:** Cannot access `/admin/accounts` to manage users

**Impact:** 
- Cannot create new test users
- Cannot verify if accounts are activated
- Cannot troubleshoot user account issues

**Possible causes:**
1. Azure storage blob configuration issue (though we fixed this)
2. Database query failing on accounts table
3. Missing ransack gem configuration
4. ActiveAdmin association issue

### Issue 3: Account Activation Status Unknown

**Problem:** The `nidhil@niya.app` account:
- ✅ Works for Admin Portal (`/admin`) login
- ❌ Does NOT work for API (`/bx_block_login/logins`) login

**Theory:** Admin accounts and regular user accounts may be:
- Stored differently in the database
- Have different activation requirements
- Use different authentication paths

**Cannot verify without database access**

---

## What We Tested

### Login Test (Failed - 422)
```json
POST /bx_block_login/logins
{
  "data": {
    "type": "email_account",
    "attributes": {
      "email": "nidhil@niya.app",
      "password": "Niya@7k2TuY"
    }
  }
}
```

### Registration Test (Failed - 422)
```json
POST /account_block/accounts
{
  "data": {
    "type": "email_account",
    "attributes": {
      "email": "testwebuser@niya.test",
      "password": "Test@1234",
      "password_confirmation": "Test@1234",
      "full_name": "Test Web User",
      "full_phone_number": "919876543210",
      "access_code": "TESTUSER001"
    }
  }
}
```

Both requests match the format used by the working web app exactly.

---

## Root Cause Analysis

### Most Likely Causes:

1. **Database Schema Issue**
   - Missing required columns in `accounts` table
   - Missing indexes or constraints
   - Data type mismatches

2. **Backend Configuration Issue**
   - JSON API parameter parsing not working correctly
   - Strong parameters configuration issue
   - CORS or request format problem

3. **Error Handling Masking Real Errors**
   - Application catching exceptions and returning generic 422
   - Logging not accessible to see real error messages

---

## What's Needed to Fix This

### Option A: Access Azure Application Logs
**Required:** Azure portal access

**Steps:**
1. Log into Azure Portal
2. Navigate to Container Apps → niya-admin-app-india
3. Go to "Monitoring" → "Log stream" or "Container logs"
4. Trigger the error (try login/registration)
5. View actual error messages

**This will show the REAL error**, not the generic 422.

### Option B: Access Database Directly
**Required:** Azure portal access or MySQL client

**Steps:**
1. Connect to Azure MySQL database
2. Check the `accounts` table structure:
```sql
DESCRIBE accounts;
```
3. Check if the account exists:
```sql
SELECT id, email, activated, deactivation, role_id 
FROM accounts 
WHERE email = 'nidhil@niya.app';
```
4. Check what accounts can login:
```sql
SELECT id, email, activated, role_id 
FROM accounts 
WHERE activated = true;
```

### Option C: Deploy with Debug Logging
**Required:** Code deployment access

**Steps:**
1. Add detailed logging to login/registration controllers
2. Update error handling to return specific error messages
3. Redeploy backend
4. Test again

---

## Recommended Next Steps

### Immediate:
1. **Get Azure logs access** to see real error messages
   - This is the fastest way to diagnose the issue

2. **Query the database** to check account status
   - Verify `nidhil@niya.app` exists and is activated

3. **Check backend deployment logs** from most recent deploy
   - May show initialization errors

### Short-term:
1. Fix the `/admin/accounts` page 500 error
   - Allows creating test users through admin portal

2. Create a working test user account
   - Either through database directly or fixed admin portal

3. Test all API endpoints with working credentials

### Long-term:
1. Improve error messages in backend
   - Return specific validation errors
   - Add request logging

2. Add health check endpoint for database connectivity

3. Document all required fields and their validation rules

---

## Files Created for Testing

- `login_debug.py` - Detailed login testing script
- `test_registration.py` - Registration testing script  
- `NIYA_WEB_API_ENDPOINTS.md` - Complete API documentation
- `BACKEND_AUTHENTICATION_ISSUES.md` - This document

---

## Summary

The backend **infrastructure is working** (deployed, accessible, database connected), but there's a **logical or configuration issue** preventing API authentication from working.

**The blocker is:** We cannot see the actual error messages. The backend is returning generic 422 errors instead of specific validation failures.

**To unblock:** Need Azure portal access to view application logs OR database access to verify/fix account data.














