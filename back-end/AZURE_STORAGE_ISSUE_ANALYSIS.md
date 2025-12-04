# Azure Storage Blob Issue Analysis

## Date: 2025-11-13

## Problem Summary
The backend container is crashing during Rails initialization with the error:
```
uninitialized constant Azure::Storage::Blob::Core
```

This occurs when loading `lib/azure/storage/core/auth/shared_access_signature.rb`.

## Root Cause

### What Changed Between Successful and Failing Deployments

**Last Successful Deployment:**
- **Revision**: `niya-admin-app-india--0000107`
- **Status**: Healthy, running
- **Image Tag**: `api-date-format-fixes`

**Failing Deployments:**
- **Revisions**: `niya-admin-app-india--0000114`, `--0000115`
- **Status**: Unhealthy, crashing during boot
- **Image Tags**: `wellbeing-fixes`, `wellbeing-fixes-2`

### Key Finding: Unpinned Gem Version

**Dockerfile Analysis:**
```dockerfile
COPY Gemfile.deploy ./Gemfile
RUN bundle install
COPY . .
RUN rm -f Gemfile.lock
RUN bundle install --without development test
```

**Gemfile.deploy:**
```ruby
gem 'azure-storage-blob'  # ❌ NO VERSION CONSTRAINT
```

**Issue:**
1. The `azure-storage-blob` gem has **no version constraint** in `Gemfile.deploy`
2. Between deployments, RubyGems released a new version (likely v2.x)
3. When `bundle install` runs during Docker build, it installs the **latest version**
4. `azure-storage-blob` v2.x **removed the `Core` namespace** from the API
5. Our custom shim file still references the old namespace: `Azure::Storage::Blob::Core::Auth::SharedAccessSignature`

### The Custom Shim File

**Location**: `back-end/lib/azure/storage/core/auth/shared_access_signature.rb`

**Current Code:**
```ruby
require "azure/storage/blob"

module Azure
  module Storage
    module Core
      module Auth
        # azure-storage-blob v2.x no longer exposes the Core namespace. Delegate directly to the Auth module.
        SharedAccessSignature = ::Azure::Storage::Blob::Auth::SharedAccessSignature
      end
    end
  end
end
```

**Problem:**
- The comment says v2.x doesn't have `Core`, but the code still tries to create `Azure::Storage::Core::Auth`
- The constant assignment tries to reference `Azure::Storage::Blob::Auth::SharedAccessSignature`
- But the error suggests this path doesn't exist either, or the module structure changed

## Solution Options

### Option 1: Pin the Gem Version (Recommended)
Pin `azure-storage-blob` to the version that was working:

```ruby
# In Gemfile.deploy
gem 'azure-storage-blob', '~> 1.1.0'  # or whatever version was working
```

**Pros:**
- Quick fix
- Prevents future breaking changes
- Matches what was working before

**Cons:**
- Need to identify the exact working version
- Won't get security updates automatically

### Option 2: Fix the Shim for v2.x
Update the shim file to work with `azure-storage-blob` v2.x:

**Research needed:**
- Check what the actual namespace structure is in v2.x
- Verify if `Azure::Storage::Blob::Auth::SharedAccessSignature` exists
- Or find the correct path to the SharedAccessSignature class

### Option 3: Remove the Custom Shim
If the shim is no longer needed, remove it entirely:

**Files to check:**
- `lib/azure/storage.rb` (requires the shim)
- `lib/azure/storage/service.rb`
- Any code that uses `Azure::Storage::Core::Auth::SharedAccessSignature`

## Next Steps

1. **Identify Working Version:**
   - Check the Gemfile.lock from the successful deployment (if available)
   - Or check what version of `azure-storage-blob` was installed in revision 0000107

2. **Test Locally:**
   - Pin the gem version
   - Or update the shim file
   - Verify `bundle exec rails server` starts successfully

3. **Rebuild and Deploy:**
   - Build new Docker image with fix
   - Deploy to Azure Container App
   - Verify container starts without errors

## Files Involved

- `back-end/Dockerfile` - Uses Gemfile.deploy
- `back-end/Gemfile.deploy` - Has unpinned `azure-storage-blob`
- `back-end/lib/azure/storage.rb` - Requires the shim
- `back-end/lib/azure/storage/core/auth/shared_access_signature.rb` - The failing shim
- `back-end/lib/azure/storage/service.rb` - Also uses Azure storage

## Docker Build Process

The Dockerfile does:
1. Copy `Gemfile.deploy` as `Gemfile`
2. Run `bundle install` (installs gems from Gemfile.deploy)
3. Copy all source code (including lib/azure/storage/*)
4. Remove Gemfile.lock
5. Run `bundle install --without development test` again

**Note:** The second `bundle install` will resolve dependencies again, potentially getting newer gem versions if Gemfile.lock was removed.

## Recommendation

**Immediate Fix:**
1. Pin `azure-storage-blob` to a known working version (likely ~1.1.0 or similar)
2. Rebuild and deploy

**Long-term:**
1. Always pin gem versions in production Gemfiles
2. Use `Gemfile.lock` in Docker builds (don't remove it)
3. Or use version constraints in Gemfile



