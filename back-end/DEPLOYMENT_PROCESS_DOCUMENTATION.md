# Backend Deployment Process Documentation

**Last Updated:** December 5, 2025  
**Azure Container App:** niya-admin-app-india  
**Resource Group:** niya-rg  
**Current Image:** `niya-admin:api-fixes-v1`  
**Current Revision:** `niya-admin-app-india--0000133`

---

## 🎯 Overview

This document outlines the complete process for deploying the NIYa backend application to Azure Container Apps.

---

## 📋 Prerequisites

### 1. Azure CLI
**Install:** https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

**Verify Installation:**
```bash
az --version
```

### 2. Azure Login
```bash
az login
```

**Verify Subscription:**
```bash
az account show
```

Expected output:
```json
{
  "name": "NEW_Microsoft Azure Sponsorship",
  "user": {
    "name": "partner@zupain.com"
  }
}
```

### 3. Access to GitHub Repository
**Repository:** https://github.com/jayashreeniya/niya-coach.git  
**Branch:** `master`  
**Backend Code:** `back-end/` directory

---

## 🏗️ Build Process

### Step 1: Commit Changes to Git

```bash
cd back-end

# Check status
git status

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Your commit message here"

# Push to GitHub
git push origin master
```

### Step 2: Build Docker Image in Azure Container Registry

**Command:**
```bash
az acr build \
  --registry niyaacr1758276383 \
  --image niya-admin:{TAG_NAME} \
  --file Dockerfile \
  .
```

**Parameters:**
- `--registry`: Azure Container Registry name (`niyaacr1758276383`)
- `--image`: Image name with tag (`niya-admin:{TAG_NAME}`)
- `--file`: Dockerfile location (`Dockerfile` in current directory)
- `.`: Build context (current directory)

**Example:**
```bash
az acr build \
  --registry niyaacr1758276383 \
  --image niya-admin:api-fixes-v1 \
  --file Dockerfile \
  .
```

**Expected Output:**
```
Run ID: ca5s was successful after 6m44s
repository: niya-admin
tag: api-fixes-v1
digest: sha256:c7953aa5a8a752fe71c367c2a9b95e74330a0edd5a46ce679441bb0371206155
```

---

## 🚀 Deployment Process

### Step 3: Deploy Image to Container App

**Command:**
```bash
az containerapp update \
  --name niya-admin-app-india \
  --resource-group niya-rg \
  --image niyaacr1758276383.azurecr.io/niya-admin:{TAG_NAME}
```

**Parameters:**
- `--name`: Container app name (`niya-admin-app-india`)
- `--resource-group`: Resource group (`niya-rg`)
- `--image`: Full image path with registry, name, and tag

**Example:**
```bash
az containerapp update \
  --name niya-admin-app-india \
  --resource-group niya-rg \
  --image niyaacr1758276383.azurecr.io/niya-admin:api-fixes-v1
```

**Expected Output:**
```json
{
  "properties": {
    "latestRevisionName": "niya-admin-app-india--0000133",
    "provisioningState": "Succeeded",
    "runningStatus": "Running",
    "configuration": {
      "ingress": {
        "fqdn": "niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io"
      }
    }
  }
}
```

### Step 4: Wait for Container to Start

**Recommended Wait Time:** 90-120 seconds

```bash
# Windows PowerShell
timeout /t 90 /nobreak

# Linux/Mac/WSL
sleep 90
```

---

## ✅ Verification

### 1. Check Container Status

```bash
az containerapp show \
  --name niya-admin-app-india \
  --resource-group niya-rg \
  --query "properties.{Status:runningStatus,Revision:latestRevisionName,FQDN:configuration.ingress.fqdn}"
```

**Expected Output:**
```json
{
  "FQDN": "niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io",
  "Revision": "niya-admin-app-india--0000133",
  "Status": "Running"
}
```

### 2. Check Container Logs

```bash
az containerapp logs show \
  --name niya-admin-app-india \
  --resource-group niya-rg \
  --tail 50
```

**Look for:**
- `Puma starting in single mode...`
- `Listening on tcp://0.0.0.0:3000`
- No error messages

### 3. Test API Endpoints

#### Test Admin Portal:
```bash
curl https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/admin
```
Expected: 200 OK with HTML content

#### Test Login API:
```python
python login_debug.py
```
Expected: 200 OK with token

#### Test Registration API:
```python
python test_registration_new.py
```
Expected: 201 Created with user data

---

## 📊 Deployment History

| Date | Revision | Image | Status | Notes |
|------|----------|-------|--------|-------|
| 2025-10-XX | --0000126 | wellbeing-fixes-v12 | ⚠️ Had CSRF error | Original image |
| 2025-12-04 | --0000127 | quickstart:latest | ❌ Failed | Wrong image |
| 2025-12-04 | --0000128 | csrf-fix | ❌ Failed | Missing gems |
| 2025-12-04 | --0000129 | wellbeing-fixes-v12 | ✅ Rolled back | Temporary |
| 2025-12-04 | --0000130 | csrf-fix-v2 | ❌ Failed | Missing jsonapi_deserialize |
| 2025-12-04 | --0000131 | csrf-fix-v3 | ❌ Failed | Missing jsonapi_deserialize |
| 2025-12-05 | --0000132 | csrf-jsonapi-fix | ⚠️ Partial | Account model error |
| **2025-12-05** | **--0000133** | **api-fixes-v1** | ✅ **WORKING** | **All issues fixed** |

---

## 🔄 Rollback Process

### If Deployment Fails:

**1. List Recent Revisions:**
```bash
az containerapp revision list \
  --name niya-admin-app-india \
  --resource-group niya-rg \
  --query "[].{Name:name,Active:properties.active,CreatedAt:properties.createdTime}" \
  --output table
```

**2. Activate Previous Working Revision:**
```bash
az containerapp revision activate \
  --name niya-admin-app-india \
  --resource-group niya-rg \
  --revision {REVISION_NAME}
```

**Example:**
```bash
az containerapp revision activate \
  --name niya-admin-app-india \
  --resource-group niya-rg \
  --revision niya-admin-app-india--0000133
```

---

## 🐛 Troubleshooting

### Build Failures

**Issue:** `az acr build` fails  
**Common Causes:**
- Network issues
- Dockerfile errors
- Missing files

**Solution:**
1. Check Dockerfile syntax
2. Verify all required files exist
3. Check Azure CLI authentication
4. Review build logs for specific errors

---

### Deployment Failures

**Issue:** Container app won't start  
**Common Causes:**
- Database connection issues
- Missing environment variables
- Code errors

**Solution:**
```bash
# Check logs
az containerapp logs show \
  --name niya-admin-app-india \
  --resource-group niya-rg \
  --tail 100
```

---

### 500 Internal Server Error

**Issue:** APIs return 500 errors  
**Common Causes:**
- Missing methods or gems
- Database query errors
- Model validation errors

**Solution:**
1. Check container logs for stack traces
2. Identify the specific error
3. Fix the code issue
4. Rebuild and redeploy

---

### 422 Unprocessable Entity

**Issue:** APIs return 422 errors  
**Common Causes:**
- CSRF token validation (for API endpoints)
- Invalid request parameters
- Validation errors

**Solution:**
1. For CSRF errors: Add `skip_before_action :verify_authenticity_token` to controller
2. For validation errors: Check request parameters match model requirements
3. Review logs for specific validation failures

---

## 🔧 Configuration

### Environment Variables

The container app has the following environment variables configured:

| Variable | Purpose | Set via |
|----------|---------|---------|
| `RAILS_ENV` | Rails environment | Azure Portal |
| `DATABASE_URL` | MySQL connection string | Azure Portal |
| `SECRET_KEY_BASE` | Rails secret | Azure Portal |
| `AZURE_STORAGE_ACCOUNT_NAME` | Azure blob storage account | Azure Portal |
| `AZURE_STORAGE_ACCESS_KEY` | Azure blob storage key | Azure Portal |
| `AZURE_STORAGE_CONTAINER` | Azure blob storage container | Azure Portal |
| `RAILS_LOG_TO_STDOUT` | Enable stdout logging | Azure Portal |
| `RAILS_SERVE_STATIC_FILES` | Serve static assets | Azure Portal |

**To update environment variables:**
1. Go to Azure Portal
2. Navigate to Container App
3. Go to "Containers" section
4. Edit environment variables
5. Save and restart

---

## 📂 Important Files

### Dockerfile
**Location:** `back-end/Dockerfile`  
**Purpose:** Defines how to build the Docker image

**Key Sections:**
1. Base image: `ruby:2.7.5-alpine3.13`
2. Install system dependencies
3. Copy `Gemfile.deploy` as `Gemfile`
4. Install gems (public then private from `vendor/cache`)
5. Copy application code
6. Precompile assets
7. Expose port 3000
8. Start Puma server

### Gemfile.deploy
**Location:** `back-end/Gemfile.deploy`  
**Purpose:** Production gem dependencies

**Important Gems:**
- `rails` (6.1.7.6)
- `mysql2` (0.5.0)
- `puma` (4.1)
- `jsonapi-serializer` (2.2) - For JSON API serialization
- `jwt` (2.7) - For authentication tokens

### Vendor Cache
**Location:** `back-end/vendor/cache/`  
**Purpose:** Contains private `bx_block_*` gems

**Why Important:**
- These gems are not on RubyGems.org
- Must be bundled with the application
- Docker build process installs them from here

---

## 🔐 Security Notes

### Container Registry Access
- Registry: `niyaacr1758276383.azurecr.io`
- Authentication: Managed by Azure (automatic for Container Apps)
- No manual credentials needed in deployment

### Database Access
- MySQL database hosted in Azure
- Connection string stored in environment variables
- No direct SQL access needed for deployment

### Admin Portal
- CSRF protection enabled for `/admin` routes
- API endpoints have CSRF protection disabled
- This is intentional and secure

---

## 📈 Best Practices

### 1. Naming Conventions

**Image Tags:**
- Use descriptive names: `api-fixes-v1`, `wellbeing-update-v2`
- Include version numbers
- Avoid generic names like `latest` or `v1`

**Git Commits:**
- Use clear, descriptive commit messages
- Include what was changed and why
- Reference issue numbers if applicable

### 2. Testing Before Deployment

**Always test locally first:**
```bash
# In back-end directory
docker build -t niya-admin-test -f Dockerfile .
docker run -p 3000:3000 --env-file .env.production niya-admin-test
```

### 3. Incremental Changes

- Make small, focused changes
- Test each change
- Commit frequently
- Deploy one feature at a time

### 4. Keep Documentation Updated

- Update this file when process changes
- Document any issues encountered
- Keep track of successful tag names

---

## 🎯 Quick Reference

### One-Line Complete Deployment:
```bash
cd back-end && \
git add . && \
git commit -m "Your message" && \
git push origin master && \
az acr build --registry niyaacr1758276383 --image niya-admin:$(date +%Y%m%d-%H%M%S) --file Dockerfile . && \
az containerapp update --name niya-admin-app-india --resource-group niya-rg --image niyaacr1758276383.azurecr.io/niya-admin:$(date +%Y%m%d-%H%M%S)
```

### Common Commands:
```bash
# Build only
az acr build --registry niyaacr1758276383 --image niya-admin:TAG --file Dockerfile .

# Deploy only
az containerapp update --name niya-admin-app-india --resource-group niya-rg --image niyaacr1758276383.azurecr.io/niya-admin:TAG

# Check status
az containerapp show --name niya-admin-app-india --resource-group niya-rg --query "properties.runningStatus"

# View logs
az containerapp logs show --name niya-admin-app-india --resource-group niya-rg --tail 50

# List revisions
az containerapp revision list --name niya-admin-app-india --resource-group niya-rg --output table
```

---

## ✅ Deployment Checklist

Before deploying:
- [ ] Code changes committed to Git
- [ ] Code pushed to GitHub
- [ ] Tests pass locally
- [ ] No syntax errors or linter warnings
- [ ] Environment variables are correct
- [ ] Database migrations (if any) are included
- [ ] Descriptive tag name chosen

After deploying:
- [ ] Container starts successfully
- [ ] Logs show no errors
- [ ] Admin portal loads
- [ ] Test login API
- [ ] Test registration API
- [ ] Test other critical endpoints
- [ ] Document the deployment

---

**End of Documentation**

For questions or issues, check:
1. Azure container logs
2. GitHub commit history
3. Previous deployment attempts
4. This documentation

**Current Working Deployment:** `niya-admin:api-fixes-v1` on revision `--0000133`



