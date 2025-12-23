# NIYa Web App - Testing Guide

**Date:** December 5, 2025  
**Status:** ✅ App Running on http://localhost:3000

---

## 🎯 Testing Checklist

### 1. ✅ Login Flow

**Test with Admin Account:**
1. Open http://localhost:3000
2. You should see the login page
3. Enter credentials:
   - **Email:** `jayashreev@niya.app`
   - **Password:** `V#niya6!`
4. Click "Login"
5. **Expected:** Should successfully log in and redirect to wellbeing page
6. **Check:** Browser console should show API response with token

**Test with Employee Account:**
1. Use the newly created test account:
   - **Email:** `testuser8796@niya.test`
   - **Password:** `Test@1234`
2. Click "Login"
3. **Expected:** Should successfully log in

---

### 2. ✅ Registration Flow

**Test New User Registration:**
1. Click "Sign Up" or "Register" button
2. Fill in the form:
   - **Full Name:** Test User [Your Name]
   - **Email:** testwebuser[random]@niya.test (use unique email)
   - **Phone Number:** +91 98765 43210 (use unique number)
   - **Password:** Test@1234
   - **Confirm Password:** Test@1234
   - **Access Code:** `a4Bln0g`
3. Click "Register" or "Sign Up"
4. **Expected:** 
   - Should successfully register
   - Should receive token
   - Should redirect to wellbeing assessment
5. **Check:** Browser console for API response

---

### 3. ⚠️ Forgot Password Flow

**Test Password Reset:**
1. Click "Forgot Password"
2. Enter email address
3. Click "Send OTP"
4. **Expected:** Should receive OTP (check if SMS/email is configured)
5. Enter OTP
6. Enter new password
7. **Expected:** Password should be reset

**Note:** The final endpoint `POST /bx_block_forgot_password/forgot_password` may not exist in backend. If this fails with 404, it's a known issue documented in `WEB_APP_API_INTEGRATION_COMPLETED.md`.

---

### 4. ⚠️ Wellbeing Assessment Flow

**Test Personality Test:**
1. After login, you should see personality test questions
2. Answer the questions
3. Click "Next" or "Submit"
4. **Expected:** Answers should be saved to backend
5. **Check:** Browser console for API calls to:
   - `POST /bx_block_assessmenttest/select_answers`
   - `POST /bx_block_assessmenttest/choose_answers`

**If you get 422 errors:**
- These endpoints may need CSRF protection disabled
- See "Troubleshooting" section below

---

### 5. ⚠️ Appointment Booking Flow

**Test Coach Selection:**
1. After completing wellbeing assessment
2. You should see coach selection
3. **Expected:** List of available coaches

**Test Availability View:**
1. Select a coach
2. Choose a date
3. **Expected:** Should show available time slots
4. **Check:** API call to `GET /bx_block_calendar/booked_slots/view_coach_availability`

**Test Booking:**
1. Select a time slot
2. Click "Book"
3. **Expected:** Appointment should be booked
4. **Check:** API call to `POST /bx_block_calendar/booked_slots`

**Test Cancellation:**
1. View your bookings
2. Click "Cancel" on a booking
3. **Expected:** Booking should be cancelled
4. **Check:** API call to `POST /bx_block_calendar/booked_slots/cancel_booking`

---

## 🔍 How to Check Results

### Browser Console (F12 / Developer Tools)

**Network Tab:**
1. Press F12 to open Developer Tools
2. Go to "Network" tab
3. Perform any action (login, register, etc.)
4. Look for the API calls:
   - **Status 200 or 201:** ✅ Success
   - **Status 422:** ⚠️ CSRF error - need to fix backend controller
   - **Status 401:** ⚠️ Authentication error
   - **Status 404:** ⚠️ Endpoint not found
   - **Status 500:** ⚠️ Server error - check Azure logs

**Console Tab:**
1. Go to "Console" tab
2. Look for:
   - Successful responses (green)
   - Errors (red)
   - API response data

---

## 🐛 Troubleshooting

### If Login Fails with 422:
**Already Fixed!** ✅ The backend has CSRF protection disabled for login endpoint.

If you still see 422, check:
1. Is the correct URL being used?
   ```
   https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io
   ```
2. Is the request format correct (JSON API format)?

---

### If Registration Fails with 422:
**Already Fixed!** ✅ The backend has CSRF protection disabled for accounts endpoint.

If you still see 422 with validation errors:
- **"Mobile Number was already taken"** → Use a unique phone number
- **"Email has already been taken"** → Use a unique email
- **"Access code is invalid"** → Use correct code: `a4Bln0g`

---

### If Wellbeing/Assessment Endpoints Fail with 422:

**Cause:** CSRF protection not yet disabled for these endpoints

**Solution:** Add `skip_before_action :verify_authenticity_token` to the controller

**Example:**
```ruby
# In back-end/app/controllers/bx_block_assessmenttest/answers_controller.rb
module BxBlockAssessmenttest
  class AnswersController < ApplicationController
    skip_before_action :verify_authenticity_token  # Add this line
    
    def create
      # ... existing code
    end
  end
end
```

**Steps to Fix:**
1. Open the backend controller file
2. Add the skip line at the top of the controller class
3. Commit and push to GitHub
4. Rebuild Docker image
5. Deploy to Azure
6. Wait 90 seconds and test again

---

### If Appointment Booking Fails with 422:
**Already Fixed!** ✅ The `BxBlockCalendar::BookedSlotsController` has CSRF skip applied.

If still failing, check Azure logs:
```bash
az containerapp logs show --name niya-admin-app-india --resource-group niya-rg --tail 50
```

---

### If You See CORS Errors:
**Should not happen** - CORS is configured in backend.

If you do see CORS errors:
1. Check backend `config/initializers/cors.rb`
2. Ensure frontend is allowed
3. Restart backend if needed

---

### If You Get Network Errors:
1. **Check backend is running:**
   ```bash
   curl https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/admin
   ```
2. **Check your internet connection**
3. **Check if Azure container is running:**
   ```bash
   az containerapp show --name niya-admin-app-india --resource-group niya-rg --query "properties.runningStatus"
   ```

---

## 📊 Expected API Responses

### Successful Login:
```json
{
  "meta": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "refresh_token": "eyJhbGciOiJIUzUxMiJ9...",
    "id": 1,
    "role": "admin"
  }
}
```

### Successful Registration:
```json
{
  "data": {
    "id": "17",
    "type": "email_account",
    "attributes": {
      "full_name": "Test User",
      "email": "test@niya.test",
      "activated": true,
      "role": "employee"
    }
  },
  "meta": {
    "token": "eyJhbGciOiJIUzUxMiJ9..."
  }
}
```

---

## ✅ Test Accounts

### Admin Account:
- **Email:** `jayashreev@niya.app`
- **Password:** `V#niya6!`
- **Role:** admin
- **Status:** ✅ Verified working

### Employee Account:
- **Email:** `testuser8796@niya.test`
- **Password:** `Test@1234`
- **Role:** employee
- **Status:** ✅ Verified working

### Access Code for New Registration:
- **Code:** `a4Bln0g`

---

## 📝 Testing Notes Template

Use this template to record your test results:

```
## Test Session: [Date/Time]
Tester: [Your Name]

### Login Test:
- [ ] Admin login works
- [ ] Employee login works
- [ ] Token received
- [ ] Redirected correctly
Issues: [None / Describe any issues]

### Registration Test:
- [ ] Form loads
- [ ] Can enter all fields
- [ ] Validation works
- [ ] Successfully registered
- [ ] Token received
Issues: [None / Describe any issues]

### Wellbeing Test:
- [ ] Questions load
- [ ] Can answer questions
- [ ] Submit works
- [ ] Progress saves
Issues: [None / Describe any issues]

### Appointment Booking Test:
- [ ] Coaches list loads
- [ ] Can select date
- [ ] Availability shows
- [ ] Can book appointment
- [ ] Can cancel appointment
Issues: [None / Describe any issues]

### Overall Status:
- Working: [List features]
- Not Working: [List issues]
- Needs Backend Fix: [List endpoints]
```

---

## 🚀 Next Steps After Testing

### If All Tests Pass:
1. ✅ Document any issues found
2. ✅ Create production build: `npm run build`
3. ✅ Deploy to production hosting
4. ✅ Test in production environment

### If Some Tests Fail:
1. ⚠️ Document which endpoints are failing
2. ⚠️ Check if it's a backend CSRF issue (422 errors)
3. ⚠️ Fix backend controllers if needed
4. ⚠️ Redeploy backend
5. ⚠️ Test again

---

## 📞 Quick Reference

### Web App URL:
```
http://localhost:3000
```

### Backend API URL:
```
https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io
```

### Check Backend Logs:
```bash
az containerapp logs show --name niya-admin-app-india --resource-group niya-rg --tail 50
```

### Test Backend Login (Python):
```bash
python login_debug.py
```

### Test Backend Registration (Python):
```bash
python test_registration_new.py
```

---

**Status:** ✅ Ready for Testing

Open http://localhost:3000 in your browser and start testing!

---

**End of Testing Guide**












