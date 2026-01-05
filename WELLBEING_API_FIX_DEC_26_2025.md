# Well-Being Assessment API Fix - December 26, 2025

## ✅ STATUS: FIXED AND DEPLOYED

**Deployed Image:** `niyaacr1758276383.azurecr.io/niya-admin:wellbeing-fix-v2`  
**Active Revision:** `niya-admin-app-india--0000157`

---

## Problems Identified & Fixed

### 1. Missing `current_user` nil check (500 Error)
**File:** `back-end/app/controllers/bx_block_wellbeing/well_beings_controller.rb`

The `index` action crashed when `current_user` was nil:
```ruby
# BEFORE (crashed):
user_answers = current_user.user_question_answers.where(...)

# AFTER (fixed):
unless current_user
  render json: { error: "Unauthorized" }, status: :unauthorized
  return
end
```

### 2. Missing `SECRET_KEY` environment variable
JWT decode failed with "No verification key available". Added `SECRET_KEY` env var to match `SECRET_KEY_BASE`.

### 3. `all_categories` required authentication
**File:** `back-end/app/controllers/bx_block_wellbeing/application_controller.rb`

Made `all_categories` a public endpoint:
```ruby
before_action :validate_json_web_token, except: [:all_categories]
```

---

## API Status After Fix

| Endpoint | Status | Notes |
|----------|--------|-------|
| `GET /bx_block_wellbeing/all_categories` | ✅ Working | Public, no auth required |
| `GET /bx_block_wellbeing/well_beings?category_id={id}` | ✅ Working | Requires valid token |
| `POST /bx_block_wellbeing/user_answer` | ✅ Working | Requires valid token |

---

## What the User Needs to Do

### On the Android App:
1. **Log out** from the app
2. **Log back in** to get a fresh authentication token
3. Navigate to **Well-Being Assessment → Physical Health**
4. Questions should now load correctly!

---

## Files Modified

| File | Change |
|------|--------|
| `back-end/app/controllers/bx_block_wellbeing/well_beings_controller.rb` | Added `current_user` nil check |
| `back-end/app/controllers/bx_block_wellbeing/application_controller.rb` | Skipped auth for `all_categories` |

## Environment Variables Added

| Variable | Value Source |
|----------|--------------|
| `SECRET_KEY` | Same as `SECRET_KEY_BASE` |

---

## Verification Commands

```powershell
# Test categories (should work without token)
Invoke-RestMethod -Uri "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_wellbeing/all_categories" -Method GET

# Test questions (requires valid token)
$token = "YOUR_FRESH_TOKEN_HERE"
Invoke-RestMethod -Uri "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_wellbeing/well_beings?category_id=2" -Headers @{token=$token} -Method GET
```
