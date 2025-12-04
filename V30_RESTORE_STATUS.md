# V30 Restore Status - Current Session

**Date:** November 7, 2025  
**Status:** Build in progress / Completed (needs verification)

---

## Summary

We performed reverse engineering to restore the codebase to v15's working state, removing problematic changes that were added in v16-v29.

---

## Changes Made (Reverse Engineering)

### 1. Dockerfile Changes
**File:** `back-end/Dockerfile.admin-fixed`
- **Removed:** `postgresql-dev` from package list (line 14)
- **Reason:** Added after v15, not needed (app uses MySQL, not PostgreSQL)
- **Impact:** Matches v15's Dockerfile configuration

### 2. Form Block Restoration
**File:** `back-end/app/admin/set_coach_availability.rb`
- **Removed:** Lambda-based helper methods (`coach_par_times_section`, `coach_par_avails_section`)
- **Removed:** `def` methods inside form block (caused syntax errors)
- **Changed:** Inlined all form code directly in the form block
- **Result:** Form block now matches v15's working structure

### 3. Update Method Restoration
**File:** `back-end/app/admin/set_coach_availability.rb`
- **Removed:** "else super" clause (added in v25)
- **Removed:** Account validation with coach_role lookup (added in v16)
- **Changed:** Reverted to simple `AccountBlock::Account.find(params['id'])`
- **Result:** Update method matches v15's manual processing approach

### 4. ApplicationRecord
**File:** `back-end/app/models/account_block/application_record.rb`
- **Changed:** Reverted from `::ApplicationRecord` to `ApplicationRecord`
- **Note:** May need `::ApplicationRecord` fix if circular dependency error returns

---

## Build Status

**Image:** `niya-admin:admin-fixes-v30`  
**Dockerfile Used:** `Dockerfile.admin-fixed`  
**Build Command:**
```bash
az acr build --registry niyaacr1758276383 --image niya-admin:admin-fixes-v30 --file Dockerfile.admin-fixed .
```

**Status:** Build initiated, completion needs verification

---

## Files Modified

### Core Files:
1. `back-end/Dockerfile.admin-fixed` - Removed postgresql-dev
2. `back-end/app/admin/set_coach_availability.rb` - Restored form block and update method
3. `back-end/app/models/account_block/application_record.rb` - Reverted inheritance

### Other Modified Files (from git diff):
- Multiple model files with ransackable_attributes additions
- Configuration files (application.rb, production.rb, active_admin.rb, devise.rb)
- Seeds file updates

**Total:** 43 files changed, 1078 insertions(+), 360 deletions(-)

---

## Next Steps

1. **Verify Build Completion:**
   ```bash
   az acr repository show-tags --registry niyaacr1758276383 --repository niya-admin --query "[?contains(name, 'admin-fixes-v30')]"
   ```

2. **Deploy v30:**
   ```bash
   az containerapp update --name niya-admin-app-india --resource-group niya-rg --image niyaacr1758276383.azurecr.io/niya-admin:admin-fixes-v30
   ```

3. **Verify App Boots:**
   - Check container logs for startup errors
   - Verify no circular dependency errors
   - Verify no syntax errors

4. **Test Coach Availability:**
   - Navigate to Coach Availability edit page
   - Add availability records
   - Verify records are saved to database
   - Check logs for processing messages

---

## Key Differences from v15

### What We Kept (from later versions):
- Comprehensive logging (useful for debugging)
- tzdata in Dockerfile (needed for timezone support)
- All ransackable_attributes fixes (needed for ActiveAdmin filters)

### What We Removed (restored to v15):
- postgresql-dev (not needed)
- Form block helper methods (caused syntax errors)
- Account validation in update method (v16 addition)
- "else super" clause (v25 addition)

---

## Potential Issues to Watch

1. **ApplicationRecord Circular Dependency:**
   - If app fails to boot with circular dependency error, change back to `::ApplicationRecord`

2. **Form Block Syntax:**
   - If form still has syntax errors, may need to check exact v15 structure

3. **Build Completion:**
   - Verify build actually completed before deploying

---

## Version History Context

- **v15:** Working version (currently deployed and healthy)
- **v16-v29:** Various fixes that introduced issues
- **v30:** Restored to v15 state with improvements kept

---

## Commands for Next Session

### Check Build Status:
```bash
az acr repository show-tags --registry niyaacr1758276383 --repository niya-admin --output table | Select-String "admin-fixes-v30"
```

### Deploy v30:
```bash
az containerapp update --name niya-admin-app-india --resource-group niya-rg --image niyaacr1758276383.azurecr.io/niya-admin:admin-fixes-v30
```

### Monitor Logs:
```bash
az containerapp logs show --name niya-admin-app-india --resource-group niya-rg --tail 100 --follow
```

---

**Last Updated:** November 7, 2025  
**Status:** Ready for deployment verification and testing








