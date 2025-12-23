# Niya Web App - API Endpoints Documentation

This document maps all API endpoints used by `NIYa-web-main` to the backend implementation.

## Current Status

**Backend Base URL (Old - Builder.ai):** 
- `https://niya-178517-ruby.b178517.prod.eastus.az.svc.builder.ai`

**Backend Base URL (New - Your Deployment):**
- `https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io`

---

## API Endpoints by Category

### 1. Authentication & Account Management

| Endpoint | Method | Purpose | Component | Status |
|----------|--------|---------|-----------|--------|
| `/bx_block_login/logins` | POST | User login | Login.js | ⚠️ 422 - Account issue |
| `/account_block/accounts` | POST | User registration | Login.js | 🔍 Needs testing |
| `/bx_block_forgot_password/otps` | POST | Send OTP for password reset | Login.js | 🔍 Needs testing |
| `/bx_block_forgot_password/otp_confirmations` | POST | Verify OTP | Login.js | 🔍 Needs testing |
| `/bx_block_forgot_password/forgot_password` | POST | Reset password | Login.js | 🔍 Needs testing |

**Payload Examples:**

**Login:**
```json
POST /bx_block_login/logins
{
  "data": {
    "type": "email_account",
    "attributes": {
      "email": "user@example.com",
      "password": "password123"
    }
  }
}
```

**Registration:**
```json
POST /account_block/accounts
{
  "data": {
    "type": "email_account",
    "attributes": {
      "email": "user@example.com",
      "password": "password123",
      "full_name": "Full Name",
      "full_phone_number": "919999999999"
    }
  }
}
```

---

### 2. Assessment/Wellbeing Test

| Endpoint | Method | Purpose | Component | Status |
|----------|--------|---------|-----------|--------|
| `/bx_block_assessmenttest/personality_test_questions` | GET | Get assessment questions | Wellbeing.js | 🔍 Needs testing |
| `/bx_block_assessmenttest/select_answers` | POST | Submit single-select answers | Wellbeing.js | 🔍 Needs testing |
| `/bx_block_assessmenttest/choose_answers` | POST | Submit multi-select answers | Wellbeing.js | 🔍 Needs testing |
| `/profile_details` | GET | Get user profile details | Wellbeing.js | 🔍 Needs testing |
| `/bx_block_assessmenttest/focus_areas` | GET | Get focus areas/results | Bookappointment.js | 🔍 Needs testing |

**Requires:** Authentication token in headers

---

### 3. Appointment Booking

| Endpoint | Method | Purpose | Component | Status |
|----------|--------|---------|-----------|--------|
| `/bx_block_calendar/booked_slots/view_coach_availability` | GET | Get available time slots | Bookappointment.js | 🔍 Needs testing |
| `/bx_block_calendar/booked_slots` | POST | Book an appointment | Bookappointment.js | 🔍 Needs testing |
| `/bx_block_calendar/booked_slots/cancel_booking` | POST | Cancel a booking | Bookappointment.js | 🔍 Needs testing |

**Requires:** Authentication token in headers

**Query Parameters:**
- `booking_date`: Date in format for availability check

---

## Backend Route Mapping

Based on `back-end/config/routes.rb`, here are the actual routes:

### Authentication (✅ Routes exist)
```ruby
# Login
post 'bx_block_login/logins' => 'bx_block_login/logins#create'

# Registration
post 'account_block/accounts' => 'account_block/accounts#create'

# Forgot Password
post 'bx_block_forgot_password/otps' => 'bx_block_forgot_password/otps#create'
post 'bx_block_forgot_password/otp_confirmations' => 'bx_block_forgot_password/otp_confirmations#create'
```

### Assessment (✅ Routes exist)
```ruby
# Assessment questions and answers
resources :bx_block_assessmenttest/personality_test_questions
resources :bx_block_assessmenttest/select_answers
resources :bx_block_assessmenttest/choose_answers
resources :bx_block_assessmenttest/focus_areas
```

### Appointments (✅ Routes exist)
```ruby
# Booking management
resources :bx_block_calendar/booked_slots do
  collection do
    get :view_coach_availability
    post :cancel_booking
  end
end
```

---

## Known Issues

### 1. Authentication Problem
- **Issue:** Login endpoint returns 422 Unprocessable Entity
- **Cause:** Account `nidhil@niya.app` may not be activated for API access (works for admin portal but not API)
- **Solution Needed:** 
  - Create a regular user account (currently blocked - admin /accounts page gives 500 error)
  - OR investigate database to activate the account for API use
  - OR find existing working credentials

### 2. Admin Portal Issue
- **Issue:** `/admin/accounts` page returns HTTP 500 error
- **Impact:** Cannot create or manage user accounts through admin interface
- **Workaround:** Would need direct database access or Azure logs to diagnose

---

## Next Steps

### Immediate Actions:
1. ✅ Test registration endpoint (may work even if login doesn't)
2. ✅ Test public/unauthenticated endpoints
3. ✅ Debug why admin accounts page is failing
4. ✅ Test if we can self-register through the API

### Testing Priority:
1. **Registration** - Try creating a new account via API
2. **Login** - Test with newly created account
3. **Assessment** - Test wellbeing questionnaire flow
4. **Booking** - Test appointment booking flow

---

## API Testing Scripts

See `login_debug.py` for authentication testing script.

---

## Configuration Changes Needed

To switch `NIYa-web-main` from old backend to new backend, replace:
```
https://niya-178517-ruby.b178517.prod.eastus.az.svc.builder.ai
```

With:
```
https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io
```

In files:
- `NIYa-web-main/src/components/login/Login.js`
- `NIYa-web-main/src/components/login/Wellbeing.js`
- `NIYa-web-main/src/components/login/Bookappointment.js`

Or better: Create an environment variable for the base URL.













