# Admin Panel Debug Status

## Last Updated: January 12, 2026

## Current Status: ✅ COMPLETE - All Admin Features Fixed

### Quick Summary

**Coach Availability Features** (all working):
- ✅ Add/Edit Available Time blocks with date ranges, week days, and time windows
- ✅ Add/Edit Unavailable Time blocks (removes slots from availability)
- ✅ Add/Edit Coach Leave dates
- ✅ Availability records (bookable 14-min slots) are automatically generated
- ✅ No duplicate entries on form submission
- ✅ Correct timezone handling (no 1-hour offset)

**Admin Pages Fixed** (Ransack 500 errors):
- ✅ `/admin/assessment_scores`
- ✅ `/admin/assess_yourself_test_type_questions`
- ✅ `/admin/emotion_questions`
- ✅ `/admin/bx_block_time_tracking_billing_summary_tracks`
- ✅ `/admin/well_being_reports`
- ✅ `/admin/video_call_feedbacks`

### Issue Summary
Coach availability system has been fixed. Availability records are now being created correctly when availability is set through the Admin Panel.

---

## Completed Tasks

### 1. Fixed Duplicate Records in Admin Panel ✅
- **Problem**: Unavailable time entries were replicating each time the form was submitted
- **Root Cause**: Two `has_many` blocks for `:coach_par_avails` in the form causing duplicate submissions
- **Solution**: 
  - Created scoped associations `available_coach_par_avails` and `unavailable_coach_par_avails` in Account model
  - Updated `process_coach_par_avails` method to track processed signatures (including week_days) to prevent duplicates
  - Added similar logic for `process_coach_leaves`
- **Files Modified**:
  - `back-end/app/models/account_block/account.rb` - Added scoped associations
  - `back-end/app/admin/set_coach_availability.rb` - Updated form and controller logic

### 2. Fixed "Add Availability Block" Button Missing ✅
- **Problem**: The button to add new availability blocks was not showing
- **Root Cause**: Using `collection:` parameter in `f.has_many` blocks was preventing the button
- **Solution**: Removed `collection:` parameter and used scoped associations instead
- **Files Modified**: `back-end/app/admin/set_coach_availability.rb`

### 3. Fixed Timezone Offset in Time Slots ✅
- **Problem**: User entered 10:00-12:00 but slots showed as 11:00-13:00 (1 hour offset)
- **Root Cause**: `Time.parse` was applying local timezone offset
- **Solution**: 
  - Modified `convert_time_format` in `available_time.rb` to use direct string manipulation instead of Time.parse
  - Modified `TimeSlotsCalculator` to use a fixed reference date when parsing times
- **Files Modified**:
  - `back-end/app/models/bx_block_appointment_management/available_time.rb`
  - `back-end/app/services/bx_block_appointment_management/time_slots_calculator.rb`

### 4. Cleaned Up Duplicate Records ✅
- **Rake Task**: `rake cleanup:cleanup_all_coach_duplicates`
- **Result**: Removed duplicate CoachLeave and CoachParAvail records

### 5. Fixed Availability Records Not Being Created ✅ (January 9, 2026)
- **Problem**: `Availability` records (bookable slots) were not being created when saving coach availability
- **Root Causes Found**:
  1. **Stale data in callback**: The `after_create` callback was querying `coach_avail.coach_par_times` which returned stale/incomplete records during batch creation
  2. **Regex capture bug**: `match?()` was used instead of `match()` in `convert_time_format`, causing `$1` and `$2` to be nil, resulting in "12:00 AM" for all times
- **Solutions**:
  1. Modified callback to use only `self.from` and `self.to` (current record's values) instead of querying all coach_par_times
  2. Changed `match?()` to `match()` and used `match_data[1]` and `match_data[2]` instead of `$1` and `$2`
  3. Added logic to MERGE time slots from multiple time windows instead of overwriting
- **Files Modified**: `back-end/app/models/bx_block_appointment_management/available_time.rb`
- **Deployed Version**: `niya-admin:fix-avail-v2`
- **Current Revision**: `niya-admin-app-india--0000186`
- **Result**: ✅ Availability records are now created correctly for all dates

---

## Recently Fixed (January 10, 2026)

### "Add Unavailable Block" Button ✅
- **Problem**: The "Unavailable Time" section didn't show the "Add Unavailable Block" button
- **Root Cause**: ActiveAdmin's `has_many` with scoped associations doesn't show the "Add" button when collection is empty
- **Solution**: Added `f.object.unavailable_coach_par_avails.build` to ensure an empty record exists
- **File Modified**: `back-end/app/admin/set_coach_availability.rb`
- **Status**: ✅ Deployed in `fix-unavail-v1`

### Time Fields Not Showing in Unavailable Time Section ✅
- **Problem**: After clicking "Add Unavailable Block", the From/To time fields were missing
- **Root Cause**: The nested `coach_par_times` record wasn't being built when creating empty `unavailable_coach_par_avails`
- **Solution**: Added `new_unavail.coach_par_times.build` after building the parent record
- **File Modified**: `back-end/app/admin/set_coach_availability.rb`
- **Status**: ✅ Deployed in `fix-unavail-v2`
- **User Confirmed**: Working as expected

### Unavailable Slots Not Being Removed from Availability ✅ (January 12, 2026)
- **Problem**: Setting unavailable time didn't remove slots from existing availability
- **Root Cause**: Code returned early for "unavailable" type and time format mismatch in comparisons
- **Solution**: Rewrote unavailable logic to properly find and remove slots, using 24-hour format for comparisons
- **File Modified**: `back-end/app/models/bx_block_appointment_management/available_time.rb`
- **Status**: ✅ Deployed in `fix-unavail-v3`
- **User Confirmed**: Working as expected

---

## Remaining Pending Items

### Goals Not Showing in Dashboard
- **Status**: Pending investigation
- **Related Files**: 
  - `back-end/app/controllers/bx_block_assessmenttest/goals_controller.rb`
  - `back-end/db/migrate/20260107120000_fix_storing_focus_areas_column_type.rb`

---

## Key Files

### Admin Panel Configuration
- `back-end/app/admin/set_coach_availability.rb`
  - Contains form definition and controller logic
  - `process_coach_par_avails` - handles creation/update of CoachParAvail records
  - `process_coach_par_times` - handles creation of time windows
  - `process_coach_leaves` - handles coach leave records

### Models
- `back-end/app/models/account_block/account.rb`
  - Has associations: `coach_par_avails`, `available_coach_par_avails`, `unavailable_coach_par_avails`
  - `accepts_nested_attributes_for` for all availability associations

- `back-end/app/models/bx_block_appointment_management/available_time.rb`
  - Table: `coach_par_times`
  - **Key callback**: `after_create :update_avalibility`
  - This callback is supposed to create `Availability` records for each date in the range

- `back-end/app/models/bx_block_appointment_management/coach_par_avail.rb`
  - Table: `coach_par_avails`
  - Stores date ranges, week_days, and avail_type (available/unavailable)

- `back-end/app/models/bx_block_appointment_management/availability.rb`
  - Table: `availabilities`
  - Stores actual bookable timeslots per date
  - Key fields: `availability_date`, `service_provider_id`, `timeslots` (JSON array)

### Services
- `back-end/app/services/bx_block_appointment_management/time_slots_calculator.rb`
  - Calculates 14-minute time slots from a time range

### Rake Tasks
- `back-end/lib/tasks/cleanup_duplicate_coach_avails.rake`
  - `cleanup:cleanup_all_coach_duplicates` - removes all duplicates
  - `cleanup:check_coach_availability` - checks availability for a coach (NEW)
  - `cleanup:list_coach_avails` - lists CoachParAvail records

---

## Database Schema Reference

### coach_par_avails
- `id`, `account_id`, `start_date`, `end_date`, `week_days` (JSON array), `avail_type` (available/unavailable)

### coach_par_times
- `id`, `coach_par_avail_id`, `from` (string HH:MM), `to` (string HH:MM), `booked_slot` (boolean)

### availabilities
- `id`, `service_provider_id`, `availability_date` (string DD/MM/YYYY), `timeslots` (JSON array), `start_time`, `end_time`

---

## How the System Should Work

1. Admin enters availability in Coach Availability form:
   - Date range (start_date, end_date)
   - Week days (e.g., Monday, Tuesday, Saturday)
   - Time windows (e.g., 10:00-13:00, 16:00-18:00)

2. On form submit:
   - `CoachParAvail` record created with dates and week_days
   - `CoachParTime` records created for each time window

3. `after_create` callback on `CoachParTime` (`update_avalibility`):
   - Gets all dates in range that match week_days
   - For each date, creates/updates `Availability` record
   - Calculates 14-minute slots and stores in `timeslots` JSON field

4. When user books appointment:
   - System looks up `Availability` by date and coach ID
   - Shows available slots from `timeslots` array

---

## Commands

### Check logs
```powershell
az containerapp logs show --name niya-admin-app-india --resource-group niya-rg --tail 100 2>&1 | Select-String "update_avalibility"
```

### Check coach availability
```powershell
az containerapp exec --name niya-admin-app-india --resource-group niya-rg --command "rake cleanup:check_coach_availability NAME=Nidhi"
```

### Deploy new version
```powershell
cd D:\Niya.life\niyasourcecode\back-end
az acr build --registry niyaacr1758276383 --image niya-admin:TAG_NAME --file Dockerfile .
az containerapp update --name niya-admin-app-india --resource-group niya-rg --image niyaacr1758276383.azurecr.io/niya-admin:TAG_NAME
```

---

## Current Deployed Version
- **Image**: `niya-admin:fix-ransack-v3`
- **Revision**: `niya-admin-app-india--0000192`
- **Status**: ✅ All admin features working
- **Deployed**: January 12, 2026

---

## Ransack/ActiveAdmin Fixes (January 12, 2026)

### Problem
Multiple admin pages were returning 500 errors due to missing `ransackable_attributes` and `ransackable_associations` methods required by Ransack 4.0+ for filtering/searching.

### Models Fixed

| Model | Admin Page | Attributes Added |
|-------|------------|------------------|
| `BxBlockAssessmenttest::AnixetyCutoff` | `/admin/assessment_scores` | anixety_title, category_id, max_score, min_score |
| `BxBlockAssessmenttest::AssessYourselfTestType` | `/admin/assess_yourself_test_type_questions` | assess_yourself_answer_id, question_title, sequence_number |
| `BxBlockAssessmenttest::MotionQuestion` | `/admin/emotion_questions` | emo_question, motion_answer_ids |
| `BxBlockTimeTrackingBilling::SummaryTrack` | `/admin/bx_block_time_tracking_billing_summary_tracks` | spend_time + associations |
| `WellbeingScoreReport` | `/admin/well_being_reports` | category_id, submitted_at, category_result, sub_category_result |
| `BxBlockRating::CoachRating` | `/admin/video_call_feedbacks` | app_rating, coach_id, feedback, organisation |

### Files Modified
- `back-end/app/models/bx_block_assessmenttest/anixety_cutoff.rb`
- `back-end/app/models/bx_block_assessmenttest/assess_yourself_test_type.rb`
- `back-end/app/models/bx_block_assessmenttest/motion_question.rb`
- `back-end/app/models/bx_block_time_tracking_billing/summary_track.rb`
- `back-end/app/models/wellbeing_score_report.rb`
- `back-end/app/models/bx_block_rating/coach_rating.rb`

### Deploy Versions
- `fix-ransack-v1` - Initial fix for AnixetyCutoff and AssessYourselfTestType
- `fix-ransack-v2` - Added fixes for MotionQuestion, SummaryTrack, WellbeingScoreReport
- `fix-ransack-v3` - Added fixes for CoachRating and MotionQuestion (emo_question)

## Key Fixes Made (January 9, 2026)

### Fix 1: Use self.from/to instead of querying all times
```ruby
# BEFORE (broken) - queried all coach_par_times which returned stale data
all_time = coach_avail&.coach_par_times
all_time&.each do |a_slot|
  from_time = a_slot.from.to_s  # Could be stale/wrong
  ...
end

# AFTER (fixed) - use only this record's values
from_time = convert_time_format(self.from.to_s)
to_time = convert_time_format(self.to.to_s)
```

### Fix 2: Ruby regex capture groups
```ruby
# BEFORE (broken) - match?() doesn't capture groups
if time_str.match?(/^(\d{1,2}):(\d{2})$/)
  hour = $1.to_i  # $1 is nil! Returns 0, becomes "12:00 AM"

# AFTER (fixed) - use match() and access via match_data
if match_data = time_str.match(/^(\d{1,2}):(\d{2})$/)
  hour = match_data[1].to_i  # Correctly gets the captured hour
```

### Fix 3: Merge time slots instead of overwrite
```ruby
# BEFORE - each time window would overwrite the previous
avail.timeslots = time_slots

# AFTER - merge with existing slots
existing_slots = avail.timeslots || []
new_slots = @new_time_slot.flatten
all_slots = existing_slots + new_slots
all_slots.uniq! { |s| [s["from"], s["to"]] }
avail.timeslots = all_slots
```


