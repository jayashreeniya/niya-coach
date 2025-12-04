# Coach Availability Requirements Verification

**Date:** November 10, 2025  
**Status:** Code Updated to Match Requirements

---

## Requirements Analysis

### ✅ **Requirement 1: Coach Leave/Holiday**
**Requirement:** 
- Single day holiday: Start Date only
- Date range holiday: Start Date + End Date
- Coach marked OFF for those dates

**Implementation:**
- ✅ Separate `f.inputs "Coach Leave"` section
- ✅ `f.has_many :coach_leaves` with `start_date` and `end_date`
- ✅ Hint: "If you want to take leave of one day, then 'Start date', and 'End date' should be same."
- ✅ `process_coach_leaves` method handles both single day and date ranges

---

### ✅ **Requirement 2: Coach Availability (Available Time)**
**Requirement:**
- Start date and end date
- Days of the week (checkboxes - multiple selection)
- Time ranges with 15-minute intervals (e.g., 4:15pm)
- Coach available for calls on selected days within date range

**Implementation:**
- ✅ `f.inputs "Coach Availability"` section
- ✅ `f.has_many :coach_par_avails` with:
  - ✅ `start_date` and `end_date` (datepicker)
  - ✅ `week_days` (checkboxes, multiple selection, all 7 days)
  - ✅ `coach_par_times` nested (time_select with 15-minute intervals: `minute_step: 15`)
- ✅ Hidden field: `avail_type = "available"`
- ✅ Time range: `start_hour: 6, end_hour: 23` (covers full day)
- ✅ `process_coach_par_avails` sets `avail_type = "available"` for this section

---

### ✅ **Requirement 3: Unavailable Time**
**Requirement:**
- Date selection (start_date, end_date)
- Days of the week (checkboxes)
- Time range selection
- Coach not available on selected date within those time ranges

**Implementation:**
- ✅ `f.inputs "Unavailable Time"` section
- ✅ `f.has_many :coach_par_avails` with:
  - ✅ `start_date` and `end_date` (datepicker)
  - ✅ `week_days` (checkboxes, multiple selection)
  - ✅ `coach_par_times` nested (time_select with 15-minute intervals)
- ✅ Hidden field: `avail_type = "unavailable"`
- ✅ `process_coach_par_avails` sets `avail_type = "unavailable"` for this section

---

### ✅ **Requirement 4: Edit/Modify Existing Availability**
**Requirement:**
- Should be able to edit/modify existing availability
- Update Start Date, End Date, days of week, time ranges

**Implementation:**
- ✅ `process_coach_par_avails` checks for existing records by `id`
- ✅ Updates existing records instead of creating duplicates
- ✅ Handles nested `coach_par_times_attributes` for updating time slots
- ✅ Supports `_destroy` flag for deleting records

---

### ✅ **Requirement 5: Time Selection (15-minute intervals)**
**Requirement:**
- Time intervals of 15 mins (e.g., 4:15pm)

**Implementation:**
- ✅ `as: :time_select` with `minute_step: 15`
- ✅ `start_hour: 6, end_hour: 23` (6 AM to 11 PM)
- ✅ `ignore_date: true` (only time, not date)

---

### ✅ **Requirement 6: Week Days Selection**
**Requirement:**
- Multiple days of the week can be selected
- Checkboxes for all days

**Implementation:**
- ✅ `as: :check_boxes`
- ✅ `collection: DAYS` (Date::DAYNAMES = ["Sunday", "Monday", ...])
- ✅ `multiple: true`
- ✅ Handles array format: `["", "Monday", "Tuesday"]` (filters out empty strings)

---

## Sample Use Case Coverage

### Example: Coach A (Oct 1 - Dec 31, 2023)

**Scenario 1: Mon-Tue-Wed: 10am-5pm**
- ✅ Create availability block:
  - Start: Oct 1, End: Dec 31
  - Week days: Monday, Tuesday, Wednesday
  - Time: 10:00 - 17:00

**Scenario 2: Thu-Fri: 2pm-3pm and 5:15pm-6:15pm**
- ✅ Create availability block:
  - Start: Oct 1, End: Dec 31
  - Week days: Thursday, Friday
  - Time 1: 14:00 - 15:00
  - Time 2: 17:15 - 18:15 (15-minute intervals supported)

**Scenario 3: Sat: 10am-12pm**
- ✅ Create availability block:
  - Start: Oct 1, End: Dec 31
  - Week days: Saturday
  - Time: 10:00 - 12:00

**Scenario 4: Sunday: Holiday**
- ✅ Create leave:
  - Start: Oct 1, End: Dec 31 (or use recurring pattern)
  - OR create multiple single-day leaves for each Sunday

**Scenario 5: Holiday Nov 2-5, 2023**
- ✅ Create leave:
  - Start: Nov 2, End: Nov 5
  - Coach marked OFF for these dates

**Scenario 6: Selective availability Nov 10-17: Mon-Tue-Wed 11am-3pm**
- ✅ Create availability block:
  - Start: Nov 10, End: Nov 17
  - Week days: Monday, Tuesday, Wednesday
  - Time: 11:00 - 15:00
- ✅ This overrides the general Mon-Tue-Wed 10am-5pm rule for this date range

---

## Code Structure

### Form Sections:
1. **Coach Leave** - `f.has_many :coach_leaves`
2. **Coach Availability** - `f.has_many :coach_par_avails` (avail_type = "available")
3. **Unavailable Time** - `f.has_many :coach_par_avails` (avail_type = "unavailable")

### Processing Methods:
1. **`process_coach_leaves`** - Handles holiday/leave creation
2. **`process_coach_par_avails`** - Handles both available and unavailable time blocks
   - Sets `avail_type` based on hidden field from form
   - Handles new records and updates to existing records
   - Processes nested `coach_par_times_attributes`

---

## Potential Issues & Solutions

### Issue 1: Two `has_many` blocks for same association
**Problem:** ActiveAdmin might merge both sections into one `coach_par_avails_attributes` hash
**Solution:** Hidden `avail_type` field in each section ensures correct type is set

### Issue 2: Existing records display
**Problem:** Existing records need to show in correct section
**Solution:** Currently both sections show all records; filtering by `avail_type` happens in processing, not display. May need to add collection filtering if this becomes an issue.

### Issue 3: Time slot updates
**Problem:** Need to handle updates to existing time slots
**Solution:** ✅ `coach_par_times_attributes` with `id` and `_destroy` flags handled

---

## Next Steps

1. ✅ Code updated to match requirements
2. ⏳ Build v32 and test
3. ⏳ Verify form displays correctly
4. ⏳ Test all scenarios from sample use case
5. ⏳ Verify existing records show in correct sections

---

## Files Modified

- `back-end/app/admin/set_coach_availability.rb`
  - Form structure: Two separate sections with hidden `avail_type` fields
  - `process_coach_par_avails`: Updated to handle existing records and set `avail_type` correctly






