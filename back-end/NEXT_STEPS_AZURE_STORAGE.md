# Next Steps: Azure Storage Blob Fix

## Date: 2025-11-13

## Current Situation

**Working Deployment:**
- Revision: `niya-admin-app-india--0000107`
- Image: `admin-fixes-v40`
- Status: ✅ Healthy

**Failing Deployments:**
- Revisions: `--0000114`, `--0000115`
- Images: `wellbeing-fixes`, `wellbeing-fixes-2`
- Status: ❌ Crashing during boot
- Error: `uninitialized constant Azure::Storage::Blob::Core`

## Root Cause Confirmed

The `azure-storage-blob` gem was added to `Gemfile.deploy` **without a version constraint**. Between the successful deployment and the failing ones, RubyGems likely released v2.x which removed the `Core` namespace.

## Recommended Solution: Pin Gem Version

### Step 1: Pin to Version 1.x (Safest Option)

Update `Gemfile.deploy`:

```ruby
# Change from:
gem 'azure-storage-blob'

# To:
gem 'azure-storage-blob', '~> 1.1.1'
```

**Why 1.1.1?**
- Version 1.x series maintains the `Core` namespace
- `~> 1.1.1` allows patch updates (1.1.2, 1.1.3, etc.) but not minor (1.2.0) or major (2.0.0)
- This matches what was likely working before

### Step 2: Verify the Fix

1. **Update Gemfile.deploy** with the version constraint
2. **Rebuild Docker image:**
   ```bash
   az acr build --registry niyaacr1758276383 --image niya-admin:wellbeing-fixes-v3 .
   ```
3. **Deploy:**
   ```bash
   az containerapp update --resource-group niya-rg --name niya-admin-app-india --image niyaacr1758276383.azurecr.io/niya-admin:wellbeing-fixes-v3
   ```
4. **Monitor logs** to ensure container starts successfully

### Alternative: Fix Shim for v2.x

If you want to use the latest version, we need to:

1. **Research v2.x namespace structure**
   - Check if `Azure::Storage::Blob::Auth::SharedAccessSignature` exists
   - Or find the correct path

2. **Update the shim file** accordingly

3. **Test locally** before deploying

## Files to Modify

1. **`back-end/Gemfile.deploy`** - Add version constraint
2. **`back-end/lib/azure/storage/core/auth/shared_access_signature.rb`** - Only if fixing for v2.x

## Quick Fix Command

```bash
# In back-end directory
# Edit Gemfile.deploy and change:
# gem 'azure-storage-blob'
# to:
# gem 'azure-storage-blob', '~> 1.1.1'

# Then rebuild and deploy
az acr build --registry niyaacr1758276383 --image niya-admin:wellbeing-fixes-v3 .
az containerapp update --resource-group niya-rg --name niya-admin-app-india --image niyaacr1758276383.azurecr.io/niya-admin:wellbeing-fixes-v3
```

## Verification Checklist

- [ ] Gemfile.deploy updated with version constraint
- [ ] Docker image builds successfully
- [ ] Container starts without errors
- [ ] Rails application loads completely
- [ ] Admin portal pages load (question_well_beings, user_answer_results)
- [ ] No Azure storage errors in logs

## Long-term Recommendations

1. **Always pin gem versions** in production Gemfiles
2. **Keep Gemfile.lock** in Docker builds (don't remove it)
3. **Use version constraints** like `~> 1.1.1` instead of no constraint
4. **Test gem upgrades** in a staging environment first



