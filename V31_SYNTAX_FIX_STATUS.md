# V31 Syntax Fix Status

**Date:** November 10, 2025  
**Status:** Build in progress

---

## Problem Identified

**Error:** `syntax error, unexpected 'end', expecting end-of-input` at line 425  
**Root Cause:** The form block had incorrect structure - missing proper closing of `f.inputs` blocks

---

## Fix Applied

### File: `back-end/app/admin/set_coach_availability.rb`

**Changes:**
1. **Restructured form block** - Properly closed all `f.inputs` blocks
2. **Simplified form structure** - Combined all availability forms into one unified form with `avail_type` selector
3. **Fixed indentation** - Corrected controller method indentation warnings

**Before (v30):**
- Multiple separate `f.has_many` blocks for different availability types
- Missing proper `f.inputs` wrapper closures
- Syntax error at line 425

**After (v31):**
- Single unified form with `avail_type` selector (available/unavailable)
- Proper `f.inputs` blocks with correct closures
- All syntax validated: `Syntax OK`

---

## Form Structure (v31)

```ruby
form title: "Edit Coach Availability" do |f|
  f.inputs "Coach Leave" do
    f.has_many :coach_leaves, allow_destroy: true, new_record: "Add Leave" do |t|
      # leave inputs
    end
  end

  f.inputs "Coach Availability & Unavailable Time" do
    f.has_many :coach_par_avails, allow_destroy: true, new_record: "Add Availability Block" do |t|
      t.input :avail_type, as: :select, collection: [["Available", "available"], ["Unavailable", "unavailable"]]
      # date and time inputs
      t.has_many :coach_par_times do |c_p|
        # time inputs
      end
    end
  end

  f.actions do
    f.submit "Submit"
  end
end
```

---

## Build Status

**Image:** `niya-admin:admin-fixes-v31`  
**Dockerfile:** `Dockerfile.admin-fixed`  
**Status:** Building in background

---

## Next Steps

1. **Wait for build completion** (~5-10 minutes)
2. **Verify build success:**
   ```bash
   az acr repository show-tags --name niyaacr1758276383 --repository niya-admin --output table | Select-String "admin-fixes-v31"
   ```
3. **Deploy v31:**
   ```bash
   az containerapp update --name niya-admin-app-india --resource-group niya-rg --image niyaacr1758276383.azurecr.io/niya-admin:admin-fixes-v31
   ```
4. **Verify app boots:**
   - Check container logs for startup errors
   - Verify no syntax errors
   - Test form rendering

---

## Key Improvements

1. **Unified Form** - Single form for both available and unavailable time (using `avail_type` selector)
2. **Cleaner Structure** - Proper block closures, no syntax errors
3. **Better UX** - Clear labels and hints for users

---

**Last Updated:** November 10, 2025  
**Status:** Awaiting build completion







