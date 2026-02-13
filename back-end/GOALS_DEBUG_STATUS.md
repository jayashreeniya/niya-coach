# Goals Feature Debug Status

## Last Updated: January 12, 2026

## Current Status: 🔄 IN PROGRESS - Backend Working, Frontend Fix Applied

---

## Summary

### What's Working ✅
1. **Database schema** is correct - `goals` table exists with proper columns
2. **StoringFocusArea** data is being saved correctly as JSON arrays
3. **Goal model validation** works properly
4. **Backend goal creation** works - tested via rake task, created goal ID=1 for account 20
5. **GoalsController** has proper logging and error handling

### What Was Fixed ✅
1. **Frontend error handling** - API errors were being silently ignored
   - File: `front-end/packages/blocks/dashboard/src/HomePageController.tsx`
   - Changed `addGoalApiCallId` response handler to show error alerts to users

### What Still Needs Testing 🔄
1. **End-to-end goal creation** from mobile app
2. **Goal display** in dashboard after creation
3. Verify the frontend fix shows errors when goal creation fails

---

## Technical Details

### Database
- **Goals table**: `goals` with columns: id, goal, date, completed, account_id, time_slot, is_complete, focus_area_id
- **StoringFocusArea table**: `storing_focusareas` with `focus_areas_id` as TEXT (JSON serialized array)
- Migration `20260107120000_fix_storing_focus_areas_column_type` has been run ✅

### Test Data Created
```
Goal ID: 1
Account: 20 (niyasupport1@gmail.com)
Focus Area ID: 30
Goal: "Test goal from rake task"
Date: 2026-01-13
Time Slot: "10:00 AM"
```

### StoringFocusArea Data (Account 20)
```
focus_areas_id: [30, 32, 33, 1, 2, 3, 8]
```

---

## Frontend Fix Applied

### File: `front-end/packages/blocks/dashboard/src/HomePageController.tsx`

**Before (errors silently ignored):**
```javascript
else if (apiRequestCallId === this.addGoalApiCallId) {
  this.updatedeleteGoalApiRes("");
}
```

**After (errors shown to user):**
```javascript
else if (apiRequestCallId === this.addGoalApiCallId) {
  if (responseJson?.error || responseJson?.errors) {
    this.setState({ goalLoader: false });
    const errorMsg = responseJson?.error || 
      (responseJson?.errors?.focus_area_id ? "Please select a valid focus area" : "Failed to add goal");
    this.showAlert("Error", errorMsg, "");
  } else {
    this.updatedeleteGoalApiRes(responseJson);
  }
}
```

---

## Debug Rake Tasks Available

```bash
# Test goal creation for an account
rake cleanup:test_goal_creation ACCOUNT_ID=20 FOCUS_AREA_ID=30

# List all goals in the system
rake cleanup:list_all_goals

# Check goals and StoringFocusArea for an account
rake cleanup:check_goals ACCOUNT_ID=20
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `bx_block_assessmenttest/goals` | POST | Create a new goal |
| `bx_block_assessmenttest/current_goals` | GET | Get current (incomplete) goals |
| `bx_block_assessmenttest/completed_goals` | GET | Get completed goals |
| `bx_block_assessmenttest/goal_boards` | GET | Get goal board with both current and completed |
| `bx_block_assessmenttest/update_goal?id=X` | PUT | Update a goal |
| `bx_block_assessmenttest/destroy_goal?id=X` | DELETE | Delete a goal |

---

## Next Steps

1. **Rebuild mobile app** with the frontend fix
2. **Test goal creation** from the mobile app
3. **Verify goals display** in the dashboard
4. If issues persist, check:
   - Network requests in the app
   - The `date` parameter format being sent (moment object serialization)
   - The `focus_area_id` value being sent (should be a single integer, not array)

---

## Current Deployed Backend Version
- **Image**: `niya-admin:goal-debug-v3`
- **Revision**: `niya-admin-app-india--0000195`
- **Status**: Backend goal creation verified working

## Frontend Changes (Not Yet Deployed to Mobile App)
- Error handling fix in `HomePageController.tsx`
- Mobile app rebuild required to apply changes
