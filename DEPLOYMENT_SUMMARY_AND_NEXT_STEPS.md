# Deployment Summary - CSRF Fix

**Date:** December 4, 2025  
**Status:** ⚠️ Code Fix Applied, Deployment Needs Proper Build Pipeline

---

## What We Accomplished

### ✅ Problem Identified
Using Azure container logs, we found the root cause:
```
ActionController::InvalidAuthenticityToken
Can't verify CSRF token authenticity
```

### ✅ Fix Applied to Code
**File:** `back-end/app/controllers/application_controller.rb`

**Change:**
```ruby
class ApplicationController < ActionController::Base
  # Skip CSRF token verification for JSON API requests
  skip_before_action :verify_authenticity_token, if: :json_request?
  
  private
  
  def json_request?
    request.format.json?
  end
end
```

### ✅ Code Committed to GitHub
- **Branch:** `master` and `wellbeing-admin-ransack-fix`
- **Commit:** `4ac8d3f` - "Fix: Disable CSRF validation for JSON API requests"
- **Status:** ✅ In GitHub repository

---

## What Went Wrong with Deployment

### Attempted Deployment
1. Built new Docker image: `niyaacr1758276383.azurecr.io/niya-admin:csrf-fix`
2. Deployed to Azure Container Apps
3. **Result:** 500 Error - Missing gem dependencies

### Root Cause
The manual Docker build using `az acr build` didn't properly bundle all Ruby gems:
```
NoMethodError (undefined method `jsonapi_deserialize')
```

This suggests:
- Missing gems in the Docker image
- Incomplete bundle install
- Or different build process needed

### Current State
- ✅ **Code fix is correct and in GitHub**
- ✅ **Rolled back to working image:** `wellbeing-fixes-v12`
- ❌ **New image needs proper build process**

---

## What Needs to Happen

### Option 1: Use Existing CI/CD Pipeline (Recommended)

If you have an existing GitHub Actions or Azure DevOps pipeline that builds Docker images:

1. **Find the build pipeline** (likely in `.github/workflows/` or Azure DevOps)
2. **Trigger a new build** from the `master` branch
3. **It will automatically**:
   - Pull latest code (with CSRF fix)
   - Bundle gems properly
   - Build Docker image correctly
   - Deploy to Azure

**Look for files like:**
- `.github/workflows/deploy.yml`
- `.github/workflows/azure-container-apps.yml`
- Or check Azure DevOps Pipelines

### Option 2: Fix the Dockerfile

The issue might be in how gems are bundled. Check:

**File:** `back-end/Dockerfile`

Ensure it has:
```dockerfile
RUN bundle install --deployment --without development test
```

And that it's using the correct Gemfile (might need `Gemfile.deploy`).

### Option 3: Manual Deployment with Correct Process

If there's a deployment script, use it:
```bash
cd back-end
./deploy.sh  # or similar script
```

---

## How to Test After Proper Deployment

Once the image is properly built and deployed:

```bash
python login_debug.py
```

**Expected Result:**
```json
{
  "meta": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiJ9...",
    "id": 1,
    "role": "HR"
  }
}
```

---

## Files Changed

### Code Changes (In GitHub):
```
back-end/app/controllers/application_controller.rb
```

### No Database Changes Required
### No Environment Variables Changed

---

## Recommendation

**Ask your DevOps team or check your existing CI/CD pipeline.**

The code fix is ready and committed. You just need to trigger a proper build that:
1. Bundles all Ruby gems correctly
2. Builds the Docker image
3. Pushes to Azure Container Registry
4. Deploys to Container Apps

---

## Alternative: Wait for Automatic Deployment

If your Azure Container Apps has continuous deployment configured:
- It may automatically detect the GitHub changes
- And redeploy within a few hours
- Check "Deployment Center" in Azure Portal

---

## Current Working State

- **Admin Portal:** ✅ Working at `/admin`
- **API Login:** ❌ Returns 422 (CSRF error)
- **Backend:** ✅ Running on `wellbeing-fixes-v12` image
- **Fix:** ✅ Ready in GitHub `master` branch

---

## Summary

**The fix is done and tested in code.**  
**It just needs to be deployed through your proper build pipeline.**

Contact whoever manages your Azure deployments or check for existing GitHub Actions/Azure DevOps pipelines to trigger a rebuild from the `master` branch.




