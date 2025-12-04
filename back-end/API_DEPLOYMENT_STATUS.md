# API Date Format Fixes - Deployment Status

## Deployment Date: 2025-11-13

## Summary
The earlier deployment of the API date format fixes remains live and stable. A subsequent attempt (tags `wellbeing-fixes` / `wellbeing-fixes-2`) to deploy the wellbeing admin changes rolled out the latest ActiveAdmin updates but **failed to boot in Azure** because the container crashes while loading `lib/azure/storage/core/auth/shared_access_signature.rb`. Traffic is currently routed to the healthy revision `niya-admin-app-india--0000107`; revision `--0000115` is failing during Rails initialization.

### Current blockers
- Container crash stack trace originates from `Azure::Storage::Blob::Core::Auth::SharedAccessSignature` no longer existing in `azure-storage-blob` v2.
- Need to either adjust our shim to the new namespace or remove the override before redeploying.

### Immediate next steps
1. Patch the Azure storage shim locally and verify `bundle exec rails server` boots.
2. Rebuild and redeploy (new tag) once the fix is confirmed.
3. Keep `--0000107` serving traffic until the new revision is healthy.

## Changes Deployed

### 1. `availabilities_controller.rb`
- ✅ Added `parse_availability_date` helper method
- ✅ Supports DD/MM/YYYY and YYYY-MM-DD formats
- ✅ Added error handling with clear error messages
- ✅ Updated `index` method with date parsing
- ✅ Updated `create` method to normalize date format

### 2. `booked_slots_controller.rb`
- ✅ Standardized date format to `"%d/%m/%Y"` in `create` method
- ✅ Standardized date format to `"%d/%m/%Y"` in `cancel_booking` method

## Deployment Details

### Docker Image
- **Tag**: `api-date-format-fixes`
- **Registry**: `niyaacr1758276383.azurecr.io`
- **Image**: `niyaacr1758276383.azurecr.io/niya-admin:api-date-format-fixes`
- **Digest**: `sha256:49a37faf1938b6c513caccccd90c027e286ddfb46d25eb84944369deb5e4ffa1`
- **Build Time**: ~8m25s
- **Status**: ✅ Successfully built and pushed

### Container App
- **Name**: `niya-admin-app-india`
- **Resource Group**: `niya-rg`
- **Latest Revision**: `niya-admin-app-india--0000113`
- **Running Status**: Running
- **Deployment Time**: 2025-11-13 06:26:03

## Testing Checklist

### ✅ Completed
- [x] Docker image built successfully
- [x] Image pushed to Azure Container Registry
- [x] Container app updated with new image
- [x] Container app status verified (Running)

### ⏳ Pending
- [ ] Test API endpoints with DD/MM/YYYY format
- [ ] Test API endpoints with YYYY-MM-DD format
- [ ] Test error handling for invalid date formats
- [ ] Verify date format consistency across endpoints
- [ ] Test from mobile app after rebuild

## Next Steps

1. **Test API Endpoints**
   - Test availability endpoints with various date formats
   - Verify error messages for invalid formats
   - Test booking endpoints

2. **Mobile App Integration**
   - Rebuild mobile app with updated backend URL
   - Test date format handling in mobile app
   - Verify booking flow works correctly

3. **Monitor Logs**
   - Check for any date parsing errors
   - Monitor API endpoint responses
   - Verify no regressions

## API Endpoints Affected

### Availability Endpoints
- `GET /bx_block_appointment_management/availabilities`
- `POST /bx_block_appointment_management/availabilities`

### Booking Endpoints
- `POST /bx_block_calendar/booked_slots` (create)
- `POST /bx_block_calendar/booked_slots/cancel_booking`

## Expected Behavior

### Valid Date Formats
- `DD/MM/YYYY` (e.g., `13/11/2025`) ✅
- `YYYY-MM-DD` (e.g., `2025-11-13`) ✅

### Invalid Date Formats (Should Return 422)
- `MM/DD/YYYY` (e.g., `11/13/2025`) ❌
- `invalid-date` ❌
- Empty string ❌

### Error Response Format
```json
{
  "errors": [
    {
      "availability_date": "Invalid date format. Expected DD/MM/YYYY or YYYY-MM-DD, got: [invalid_date]"
    }
  ]
}
```

## Backup Files

Original files backed up:
- `availabilities_controller.rb.original`
- `booked_slots_controller.rb.original`
- Timestamped backups created

See `API_CONTROLLER_BACKUPS.md` for restore instructions.

## Notes

- All changes are backward compatible
- Admin portal functionality remains unchanged
- API endpoints now have better date format handling
- Error messages are more descriptive


