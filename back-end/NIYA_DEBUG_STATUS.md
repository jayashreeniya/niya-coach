# Niya Debug Status - January 14, 2026

## ✅ COMPLETED FIXES

### 1. Coach Availability (Admin Panel)
- **Issue**: Duplicate records, missing buttons, timezone offsets, availability not created
- **Fixes Applied**:
  - Fixed `permit_params` for nested attributes in `set_coach_availability.rb`
  - Added `protect_from_forgery with: :null_session` for API controllers
  - Fixed `convert_time_format` regex in `available_time.rb` (use `match()` not `match?()`)
  - Fixed callback to use `self.from`/`self.to` instead of stale query data
  - Added "Add Availability Block" and "Add Unavailable Block" buttons
  - Fixed unavailable slots removal logic

### 2. Admin Panel 500 Errors (Ransack)
- **Issue**: Multiple admin pages returning 500 errors
- **Fixes Applied** (added `ransackable_attributes` to these models):
  - `BxBlockAssessmenttest::AnixetyCutoff` - `/admin/assessment_scores`
  - `BxBlockAssessmenttest::AssessYourselfTestType` - `/admin/assess_yourself_test_type_questions`
  - `BxBlockAssessmenttest::MotionQuestion` - `/admin/emotion_questions`
  - `BxBlockTimeTrackingBilling::SummaryTrack` - `/admin/bx_block_time_tracking_billing_summary_tracks`
  - `WellbeingScoreReport` - `/admin/well_being_reports`
  - `BxBlockRating::CoachRating` - `/admin/video_call_feedbacks`
  - `BxBlockUpload::MultipleUploadFile` - `/admin/multiple_upload_files`
  - `BxBlockUpload::FileType` - for nested forms

### 3. Goals (Mobile App)
- **Issue**: Goals not being added from mobile app
- **Root Cause**: CSRF token verification blocking API requests
- **Fix**: Added `protect_from_forgery with: :null_session` to `GoalsController`
- **Status**: ✅ Working

### 4. Assess Yourself (Mobile App)
- **Issue**: Looping after selecting a test (e.g., Anger Management)
- **Root Cause**: CSRF token verification blocking API requests
- **Fixes Applied**:
  - Added `protect_from_forgery with: :null_session` to:
    - `BxBlockAssessmenttest::ApplicationController` (base controller)
    - `AssessYourselfChooseAnswersController`
    - `AssessSelectAnswersController`
- **Status**: ✅ Working

### 5. Action Items (Mobile App)
- **Issue**: Action items not visible when added
- **Root Cause**: CSRF token verification blocking API requests
- **Fix**: Added `protect_from_forgery with: :null_session` to `ActionItemsController`
- **Status**: ✅ Deployed (Revision 199) - Needs Testing

### 6. Multiple Upload Files (Admin Panel)
- **Issue**: `/admin/multiple_upload_files/new` returning 500 error
- **Fix**: Added `ransackable_attributes` and `ransackable_associations` to `BxBlockUpload::FileType`
- **Status**: ✅ Deployed (Revision 199) - Needs Testing

---

## 📋 PENDING TESTS

1. **Action Items** - Test adding action items from mobile app and verify they appear
2. **Multiple Upload Files** - Test creating new uploads at `/admin/multiple_upload_files/new`

---

## 🔧 KEY FILES MODIFIED

### Backend Controllers (CSRF Fixes)
- `app/controllers/bx_block_assessmenttest/application_controller.rb`
- `app/controllers/bx_block_assessmenttest/goals_controller.rb`
- `app/controllers/bx_block_assessmenttest/assess_yourself_choose_answers_controller.rb`
- `app/controllers/bx_block_assessmenttest/assess_select_answers_controller.rb`
- `app/controllers/bx_block_assessmenttest/action_items_controller.rb`

### Backend Models (Ransack Fixes)
- `app/models/bx_block_assessmenttest/anixety_cutoff.rb`
- `app/models/bx_block_assessmenttest/assess_yourself_test_type.rb`
- `app/models/bx_block_assessmenttest/motion_question.rb`
- `app/models/bx_block_time_tracking_billing/summary_track.rb`
- `app/models/wellbeing_score_report.rb`
- `app/models/bx_block_rating/coach_rating.rb`
- `app/models/bx_block_upload/file_type.rb`
- `app/models/bx_block_upload/multiple_upload_file.rb`

### Backend Admin
- `app/admin/set_coach_availability.rb`

### Backend Models (Coach Availability)
- `app/models/bx_block_appointment_management/available_time.rb`

### Rake Tasks
- `lib/tasks/cleanup_duplicate_coach_avails.rake` - Added debug tasks

---

## 🚀 DEPLOYMENT INFO

- **Current Revision**: `niya-admin-app-india--0000199`
- **Latest Image**: `niyaacr1758276383.azurecr.io/niya-admin:action-upload-fix`
- **Container App**: `niya-admin-app-india`
- **Resource Group**: `niya-rg`
- **Region**: Central India

---

## 📊 ASSESS YOURSELF DATA STRUCTURE

```
AssessYourselfQuestion (Main questions)
└── AssessYourselfAnswer (Test types like "Anger Management")
    └── AssessYourselfTestType (10 sub-questions per test)
        └── AssessTtAnswer (4 answer options per question, scores 0-3)

AnixetyCutoff (Score ranges for results)
- Category 26 (Anger Management):
  - 0-13: Minimal Clinical Anger
  - 14-19: Mild Clinical Anger
  - 20-28: Moderate Clinical Anger
  - 29-63: Severe Clinical Anger
```

---

## 📝 NOTES

- All API controllers using JWT authentication need `protect_from_forgery with: :null_session`
- All ActiveAdmin models need `ransackable_attributes` for filtering/searching
- Time handling uses direct string manipulation to avoid timezone issues
- Coach availability callbacks use `self.from`/`self.to` to avoid stale data

---

## 🔄 TO CONTINUE

1. Test Action Items in mobile app
2. Test Multiple Upload Files in admin panel
3. Check for any other 500 errors or CSRF issues
4. Monitor logs: `az containerapp logs show --name niya-admin-app-india --resource-group niya-rg --tail 100`
