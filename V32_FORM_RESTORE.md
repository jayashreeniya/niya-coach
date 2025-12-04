# V32 Form Structure Restore

**Date:** November 10, 2025  
**Status:** In Progress

---

## Problem

v31 has a unified form with `avail_type` selector, but v15 had **two separate sections**:
1. "Coach Availability" section for available time
2. "Unavailable Time" section for unavailable time

The user reported "complete functionality is missing now" - existing records may not be displaying correctly.

---

## Changes Applied (v32)

### File: `back-end/app/admin/set_coach_availability.rb`

**Form Structure:**
- Split into two separate `f.inputs` blocks:
  - `f.inputs "Coach Availability"` - shows available records (avail_type IS NULL OR avail_type = "available")
  - `f.inputs "Unavailable Time"` - shows unavailable records (avail_type = "unavailable")

**Code:**
```ruby
f.inputs "Coach Availability" do
  available_collection = f.object.coach_par_avails.where("avail_type IS NULL OR avail_type = ?", "available")
  f.has_many :coach_par_avails, heading: "Available Time", allow_destroy: true, new_record: "Add Availability Block", for: [:coach_par_avails, available_collection] do |t|
    # ... fields ...
  end
end

f.inputs "Unavailable Time" do
  unavailable_collection = f.object.coach_par_avails.where(avail_type: "unavailable")
  f.has_many :coach_par_avails, heading: "Unavailable Time", allow_destroy: true, new_record: "Add Unavailable Block", for: [:coach_par_avails, unavailable_collection] do |t|
    # ... fields ...
  end
end
```

---

## Issues to Address

1. **Two `has_many` blocks for same association**: ActiveAdmin might get confused managing the same association twice. Need to verify this works.

2. **`for` option with collection**: The `for` option syntax might not work correctly with filtered collections. May need to adjust.

3. **Update method logic**: The `process_coach_par_avails` method needs to set `avail_type` correctly:
   - Records from "Available" section: `avail_type = "available"` or `nil`
   - Records from "Unavailable" section: `avail_type = "unavailable"`

4. **Distinguishing sections**: Need a way to know which section a record came from when processing in the update method.

---

## Next Steps

1. **Test syntax** - ✅ Done (Syntax OK)
2. **Update process_coach_par_avails method** - Set avail_type based on section
3. **Build v32** - Test if form renders correctly
4. **Deploy and test** - Verify existing records show in correct sections

---

## Alternative Approach (if current doesn't work)

If two `has_many` blocks cause issues, we could:
- Use one unified form but with better filtering/display logic
- Use custom form builder
- Use JavaScript to filter/separate records in the UI

---

## Reference

- v15: Last known working version with separate sections
- v31: Current version with unified form (missing functionality)






