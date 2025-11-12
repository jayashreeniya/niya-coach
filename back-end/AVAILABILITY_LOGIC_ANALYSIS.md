# Availability, Leave, and Unavailability Logic Analysis

**Date:** November 12, 2025  
**Last Updated:** November 12, 2025  
**Status:** Most Issues Fixed - Unavailable Time Deletion Pending

---

## 🔍 **Current Logic Flow**

### **1. Form Display Logic** (`set_coach_availability.rb` lines 487-563)

**Structure:**
- Two separate `f.has_many :coach_par_avails` blocks:
  - "Coach Availability" section (line 490)
  - "Unavailable Time" section (line 529)
- Each section has a hidden `avail_type` field:
  - Available section: `value: "available"`
  - Unavailable section: `value: "unavailable"`

**Problem #1: No Filtering**
- Both `has_many` blocks show **ALL** `coach_par_avails` records
- No filtering by `avail_type` when displaying existing records
- Result: Same record appears in both sections when editing

**Example from logs:**
```
Key "0" (available): id=1, avail_type="available"
Key "1" (unavailable): id=1, avail_type="unavailable"  ← SAME ID!
```

---

### **2. Processing Logic** (`process_coach_par_avails` lines 220-420)

**Flow:**
1. Iterates through all `avails_data` keys ("0", "1", etc.)
2. For each key:
   - Checks if `id` exists → update existing or create new
   - Sets `avail_type` from hidden field
   - Saves `CoachParAvail`
   - Processes time slots

**Problem #2: Same Record Updated Twice**
- When both sections have the same record ID, the second update overwrites the first
- Line 312-313: `find_by(id: avl_data['id'])` finds the same record for both keys
- Line 340-351: `avail_type` gets set, but if it's the same record, second update wins

**Example:**
```
Key "0": Updates id=1, sets avail_type="available" → SAVED
Key "1": Updates id=1, sets avail_type="unavailable" → OVERWRITES previous!
Final result: id=1 has avail_type="unavailable" (last one wins)
```

---

### **3. AvailableTime Callback** (`update_avalibility` in `available_time.rb`)

**For Available Time (`avail_type != "unavailable"`):**
- Lines 62-71: Creates/updates `Availability` records
- Adds time slots to the availability
- ✅ **Works correctly**

**For Unavailable Time (`avail_type == "unavailable"`):**
- Lines 72-89: Finds existing `Availability` records
- Lines 77-80: Removes slots using `timeslot_condition`
- Line 83: Rejects slots using same condition
- Line 87: Updates `unavailable_start_time` and `unavailable_end_time`

**Problem #3: Unavailable Time Automatically Removes Slots (Should Only Remove on Delete)**

**Current behavior:**
- When unavailable time is created/updated, the `update_avalibility` callback (line 6) automatically runs
- The callback removes slots from availability records (lines 72-89)
- This happens on EVERY save, not just when delete is checked

**`timeslot_condition` (line 121-123):**
```ruby
def timeslot_condition(start_time, end_time, s_time, e_time)
  start_time >= s_time && end_time <= e_time
end
```

**This condition means:**
- Removes slot ONLY if: `slot_start >= unavailable_start AND slot_end <= unavailable_end`
- In other words: Only removes slots that are **completely within** the unavailable range

**Example:**
- Existing availability: 9 AM - 1 PM (morning)
- Unavailable time: 3 PM - 6 PM (afternoon) - created/updated
- Result: Morning slots remain because they don't overlap, but callback still runs

**Expected behavior (per user):**
- Unavailable time has a delete checkbox (`_destroy` flag)
- Slots should ONLY be removed when delete checkbox is checked
- When creating/updating unavailable time (without delete), it should NOT remove slots
- The callback should check if this is a delete operation before removing slots

---

### **4. CoachLeave Callback** (`coach_off_time` in `coach_leave.rb`)

**Flow:**
- Line 15: If no `end_date` → processes all single-date leaves
- Line 22-33: If `end_date` exists → processes date range

**Problem #4: Uses `.last` Instead of `self`**

**Line 23:**
```ruby
coach_off_dates = BxBlockAppointmentManagement::CoachLeave.last
```

**Issue:**
- Uses `CoachLeave.last` (last record in database)
- Should use `self` (current record being created)
- If multiple leaves are created, only the last one processes correctly
- Earlier leaves may process the wrong date range

**Example:**
1. Create Leave A: 21-25 Nov → callback uses `.last` (might be Leave B if it exists)
2. Create Leave B: 26-30 Nov → callback uses `.last` (correct, but Leave A is wrong)

**Expected:**
```ruby
coach_off_dates = self  # Use current record
start_date = self.start_date.to_date
end_date = self.end_date.to_date
```

---

## 📋 **Summary of Issues**

| Issue | Location | Impact | Severity |
|-------|----------|--------|----------|
| **#1: Form shows all records in both sections** | `set_coach_availability.rb:490,529` | User sees wrong records when editing | High |
| **#2: Same record updated twice** | `process_coach_par_avails:312-351` | Last update overwrites first, wrong `avail_type` | High |
| **#3: Unavailable only removes overlapping slots** | `available_time.rb:78,83` | Morning slots remain when afternoon unavailable | Medium |
| **#4: Leave uses `.last` instead of `self`** | `coach_leave.rb:23` | Wrong leave dates processed, 25th still shows | High |

---

## 🎯 **Root Causes**

1. **Form filtering missing**: ActiveAdmin's `has_many` doesn't filter by default
2. **ID collision**: Both form sections can reference the same record ID
3. **Unavailable logic too narrow**: Only removes completely-contained slots
4. **Leave callback bug**: Uses `.last` instead of current record

---

## ✅ **Required Fixes**

### **Fix #1: Filter Form Collections**
- Filter "Available" section to show only `avail_type IS NULL OR avail_type = "available"`
- Filter "Unavailable" section to show only `avail_type = "unavailable"`
- Use `collection` option or pre-filter the association

### **Fix #2: Prevent ID Collision**
- When processing, check if record with same ID already processed
- If same ID appears twice with different `avail_type`, create new record for second one
- OR: Ensure form generates unique IDs for new records

### **Fix #3: Fix Unavailable Slot Removal Logic**
- **Check `_destroy` flag**: Only remove slots when unavailable time record is being deleted
- **Don't auto-remove on create/update**: When creating/updating unavailable time, don't automatically remove slots
- **Fix overlap logic**: If slots should be removed, fix `timeslot_condition` to handle overlapping slots correctly
- Current: Automatically removes slots on every save, only removes completely-contained slots

### **Fix #4: Fix Leave Callback**
- Change `CoachLeave.last` to `self`
- Use current record's dates instead of last record in database

---

## 🔄 **Expected Behavior After Fixes**

1. **Form Display:**
   - "Available" section shows only available records
   - "Unavailable" section shows only unavailable records
   - No duplicate records across sections

2. **Processing:**
   - Available and unavailable records saved separately
   - No overwriting of `avail_type`

3. **Unavailable Time:**
   - When creating/updating unavailable time: Record is saved, but slots are NOT removed
   - When delete checkbox is checked: Unavailable time record is deleted AND slots are removed
   - Slot removal only happens on delete operation

4. **Leave:**
   - Leave 21-25 Nov deletes availability for all dates in range (21, 22, 23, 24, 25)
   - Uses current record's dates, not last record in database

---

## ✅ **Fixes Applied (v41-v45)**

1. ✅ **Form filtering implemented** - Each section now shows only matching records
2. ✅ **ID collision prevention** - Tracks processed IDs to prevent duplicate updates
3. ✅ **Leave callback fixed** - Uses `self` instead of `.last`
4. ✅ **Unavailable callback modified** - Skips slot removal on create, only removes on delete
5. ✅ **Delete detection improved** - Enhanced `_destroy` flag detection with logging

## ⚠️ **Remaining Issue**

### **Unavailable Time Deletion Not Working**
- Delete checkbox is not triggering record deletion
- `_destroy` flag may not be reaching processing logic
- Or deletion logic may not be executing properly
- **Status:** Not a show blocker - can be fixed later

## 📝 **Next Steps**

1. ⏳ Debug unavailable time deletion (when ready)
2. ⏳ Test slot removal when unavailable time is deleted
3. ✅ Test wellbeing focus areas (user testing)
4. ✅ Test coach specialization (user testing)

