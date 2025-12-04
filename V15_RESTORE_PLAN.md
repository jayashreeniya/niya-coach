# V15 Restore Plan - November 7, 2025

## Current Status
- **v37 (local)** includes the restored v15 form structure plus time normalization for existing slots.
- **Latest deployed image** remains `admin-fixes-v35` (still showing time_select errors for existing slots).
- **Pending**: Build and deploy `admin-fixes-v37`, verify ActiveAdmin edits end-to-end.

## What We Know About v15

From `CURRENT_WORK_STATUS.md` (November 5, 2025):

### v15 Fixes Applied:
1. **Iteration Fix**: Changed from `each do |avl|` to `each do |key, avl_data|` 
2. **Week Days Handling**: Handles both array `["", "Monday", "Tuesday"]` and string `"Monday"` formats
3. **Condition Fix**: Processes all keys ("0", "1", "2"), not just "0"
4. **Logging Added**: Comprehensive logging throughout
5. **Error Handling**: Improved rescue blocks

### Current Code Status:
- ✅ `process_coach_par_avails` method has v15 fixes (lines 215-369)
- ✅ `process_coach_leaves` method has v15 fixes (lines 172-213)
- ✅ `update` method has v15 structure (lines 75-168)
- ❌ **Form block has syntax error** (lines 395-450) - this is what broke in v16+

## The Problem

The form block in `set_coach_availability.rb` has a syntax error:
- Error: `syntax error, unexpected 'end', expecting end-of-input` at line 450
- Root cause: Attempted to use `def` methods inside form block (v16), then tried lambdas (v29), both failed
- v15's form block structure is unknown (not saved)

## Solution Plan

### Option 1: Extract Helper Methods Outside Form Block (Recommended)
Move the helper methods (`coach_par_avails_section`, `coach_par_times_section`) outside the `form` block, define them as module-level methods or use a different pattern.

### Option 2: Inline the Form Code
Remove the helper methods entirely and inline all the form code directly in the `form` block.

### Option 3: Use ActiveAdmin's Built-in Patterns
Check how other working admin files (like `coach.rb`, `hr.rb`) structure their forms and follow that pattern.

## ✅ Completed Steps

1. **✅ Fixed form block syntax** - Inlined all form code (Option 2)
2. **✅ Removed postgresql-dev** - Restored Dockerfile to v15 state
3. **✅ Removed account validation** - Restored update method to v15 state
4. **✅ Removed "else super" clause** - Restored update method logic
5. **✅ Built v30** - Image build initiated with restored code
6. **✅ Added time normalization** - Ensured `time_select` receives real `Time` objects so editing existing availability works.

## Next Steps

1. Build `admin-fixes-v37` from the refreshed code.
2. Deploy `admin-fixes-v37` to `niya-admin-app-india` and confirm the app boots cleanly.
3. Test Coach Availability form:
   - Render edit page for coach with existing availability (no 500 error).
   - Add/edit availability, unavailability, and leave entries; ensure records persist.
   - Confirm “Add Unavailable Block” behaves as expected.

## Files to Fix

- `back-end/app/admin/set_coach_availability.rb` - form block (lines 395-450)

## Reference

- Working version: `admin-fixes-v15` (currently deployed)
- Broken versions: v16-v29
- Last known good: v15


