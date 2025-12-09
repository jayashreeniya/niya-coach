# API Controllers - CSRF Protection Status

**Date:** December 5, 2025  
**Purpose:** Track which API controllers have CSRF protection disabled for web/mobile app access

---

## ✅ Controllers with CSRF Skip Applied

All controllers below have `skip_before_action :verify_authenticity_token` added.

### Authentication & Account Management (5 controllers)

| Controller | Endpoints | Status | Commit |
|------------|-----------|--------|--------|
| `BxBlockLogin::LoginsController` | POST `/bx_block_login/logins` | ✅ Fixed | 5f39566 |
| `AccountBlock::AccountsController` | POST `/account_block/accounts` | ✅ Fixed | 5f39566 |
| `BxBlockForgotPassword::OtpsController` | POST `/bx_block_forgot_password/otps` | ✅ Fixed | 5f39566 |
| `BxBlockForgotPassword::OtpConfirmationsController` | POST `/bx_block_forgot_password/otp_confirmations` | ✅ Fixed | 5f39566 |

### Assessment/Wellbeing (5 controllers)

| Controller | Endpoints | Status | Commit |
|------------|-----------|--------|--------|
| `BxBlockAssessmenttest::AssesmentTestQuestionsController` | GET `/bx_block_assessmenttest/personality_test_questions` | ✅ Fixed | Pending |
| `BxBlockAssessmenttest::SelectAnswersController` | POST `/bx_block_assessmenttest/select_answers` | ✅ Fixed | Pending |
| `BxBlockAssessmenttest::ChooseAnswersController` | POST `/bx_block_assessmenttest/choose_answers` | ✅ Fixed | Pending |
| `BxBlockAssessmenttest::FocusAreasController` | GET `/bx_block_assessmenttest/focus_areas` | ✅ Fixed | Pending |

### Calendar/Booking (1 controller)

| Controller | Endpoints | Status | Commit |
|------------|-----------|--------|--------|
| `BxBlockCalendar::BookedSlotsController` | POST `/bx_block_calendar/booked_slots`<br>GET `/bx_block_calendar/booked_slots/view_coach_availability`<br>POST `/bx_block_calendar/booked_slots/cancel_booking` | ✅ Fixed | 5f39566 |

### Profile (1 controller)

| Controller | Endpoints | Status | Commit |
|------------|-----------|--------|--------|
| `BxBlockProfile::ProfilesController` | GET `/profile_details`<br>PUT `/update_profile`<br>POST `/profile_name_update` | ✅ Fixed | Pending |

---

## 📊 Summary

**Total API Controllers Fixed:** 10

### By Category:
- **Authentication:** 4 controllers ✅
- **Assessment/Wellbeing:** 4 controllers ✅  
- **Calendar/Booking:** 1 controller ✅
- **Profile:** 1 controller ✅

---

## 🔒 Admin Portal - CSRF Protection KEPT

The following controllers **DO NOT** have CSRF skip and **SHOULD NOT** have it added:

- `Admin::*` - All ActiveAdmin controllers
- Any controller that renders HTML forms for admin use

**Why:** Admin portal uses traditional form submissions and needs CSRF protection for security.

---

## 🧪 Testing Status

### Already Tested & Working:
- ✅ Login API (200 OK)
- ✅ Registration API (201 Created)
- ✅ Questions loading (201 Created)

### Needs Testing After Deployment:
- ⏳ Submit assessment answers
- ⏳ Get focus areas
- ⏳ Get profile details
- ⏳ View coach availability
- ⏳ Book appointment
- ⏳ Cancel booking

---

## 🚀 Deployment Instructions

1. **Commit changes:**
```bash
cd back-end
git add app/controllers/
git commit -m "Fix: Add CSRF skip to all API controllers used by web app"
git push origin master
```

2. **Build new image:**
```bash
az acr build \
  --registry niyaacr1758276383 \
  --image niya-admin:api-complete-v2 \
  --file Dockerfile \
  .
```

3. **Deploy:**
```bash
az containerapp update \
  --name niya-admin-app-india \
  --resource-group niya-rg \
  --image niyaacr1758276383.azurecr.io/niya-admin:api-complete-v2
```

4. **Wait and test:**
```bash
# Wait 90 seconds
timeout /t 90 /nobreak

# Test login
python login_debug.py

# Test in web app
# Open http://localhost:3000 and test full flow
```

---

## 📝 Code Pattern Used

All API controllers follow this pattern:

```ruby
module BxBlock[ModuleName]
  class [Controller]Controller < ApplicationController
    include BuilderJsonWebToken::JsonWebTokenValidation
    skip_before_action :verify_authenticity_token  # <-- Added this line
    before_action :validate_json_web_token
    
    def create
      # ... controller logic
    end
  end
end
```

**Key points:**
- `skip_before_action` must come BEFORE other before_actions
- Only applies to controllers that handle JSON API requests
- Admin controllers keep CSRF protection

---

## ✅ Verification Checklist

After deployment, verify each endpoint:

### Authentication:
- [ ] Login works (200 OK with token)
- [ ] Registration works (201 Created with user)
- [ ] Forgot password flow works

### Wellbeing Assessment:
- [ ] Questions load (201 Created with questions array)
- [ ] Can submit select answer (201 Created)
- [ ] Can submit choose answer (201 Created)
- [ ] Can get focus areas (200 OK)
- [ ] Can get profile details (200 OK)

### Appointment Booking:
- [ ] Can view coach availability (200 OK)
- [ ] Can book appointment (201 Created)
- [ ] Can cancel booking (200 OK)

### Admin Portal:
- [ ] Admin login still works
- [ ] Can create accounts (if fixed)
- [ ] All admin functions work

---

## 🔧 Troubleshooting

### If you still get 422 errors after deployment:

1. **Check the logs:**
```bash
az containerapp logs show --name niya-admin-app-india --resource-group niya-rg --tail 50
```

2. **Look for:**
   - `ActionController::InvalidAuthenticityToken` - CSRF still active
   - `NoMethodError` - Missing method/gem
   - `ActiveRecord` errors - Database/validation issues

3. **Verify deployment:**
```bash
az containerapp show \
  --name niya-admin-app-india \
  --resource-group niya-rg \
  --query "properties.latestRevisionName"
```

4. **Check image tag:**
Make sure the correct image is deployed.

---

## 📚 Related Documentation

- `SESSION_STATUS_DEC_5_2025_APIS_FIXED.md` - Initial API fixes
- `DEPLOYMENT_PROCESS_DOCUMENTATION.md` - Deployment guide
- `NIYA_WEB_API_ENDPOINTS.md` - API endpoint mapping

---

**Status:** ✅ All API controllers have CSRF skip applied - Ready for deployment

**Next:** Commit, build, deploy, and test!



