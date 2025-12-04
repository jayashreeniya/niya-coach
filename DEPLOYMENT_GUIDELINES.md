# Niya Admin Panel - Deployment Guidelines

## 🚀 **Quick Deployment Guide**

### Prerequisites
- Azure CLI installed and configured
- Access to Azure Container Registry: `niyaacr1758276383.azurecr.io`
- Access to Resource Group: `niya-rg`
- Container App: `niya-admin-app-india`

---

## 📋 **Step-by-Step Deployment Process**

### 1. **Prepare Environment**
```bash
# Navigate to backend directory
cd back-end

# Verify you're in the correct directory
pwd
# Should show: D:\Niya.life\niyasourcecode\back-end
```

### 2. **Build Docker Image**
```bash
# Build new image with a descriptive tag
az acr build --registry niyaacr1758276383 --image niya-admin:YOUR_TAG_NAME --file Dockerfile.admin-fixed .

# Example:
az acr build --registry niyaacr1758276383 --image niya-admin:test-fix --file Dockerfile.admin-fixed .
```

### 3. **Deploy to Container App**
```bash
# Update container app with new image
az containerapp update --name niya-admin-app-india --resource-group niya-rg --image niyaacr1758276383.azurecr.io/niya-admin:YOUR_TAG_NAME

# Example:
az containerapp update --name niya-admin-app-india --resource-group niya-rg --image niyaacr1758276383.azurecr.io/niya-admin:test-fix
```

### 4. **Wait for Deployment**
```bash
# Wait for container to start (30 seconds)
Start-Sleep -Seconds 30
```

### 5. **Verify Deployment**
```bash
# Check container status
az containerapp show --name niya-admin-app-india --resource-group niya-rg --query "properties.runningStatus"

# Should return: "Running"
```

---

## 🔍 **Testing Commands**

### Test Admin Pages
```bash
# Test Companies page
Invoke-WebRequest -Uri "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/admin/companies" -UseBasicParsing | Select-Object StatusCode

# Test HR page
Invoke-WebRequest -Uri "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/admin/hrs" -UseBasicParsing | Select-Object StatusCode

# Test Coaches page
Invoke-WebRequest -Uri "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/admin/coaches" -UseBasicParsing | Select-Object StatusCode

# Test Admin Users page
Invoke-WebRequest -Uri "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/admin/admin_users" -UseBasicParsing | Select-Object StatusCode
```

### Check Logs
```bash
# View recent logs
az containerapp logs show --name niya-admin-app-india --resource-group niya-rg --tail 20

# View more detailed logs
az containerapp logs show --name niya-admin-app-india --resource-group niya-rg --tail 100
```

---

## 🔐 **Admin Access**

### Login Credentials
- **URL:** https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/admin/login
- **Email:** nidhil@niya.app
- **Password:** Niya@7k2TuY

### Alternative Admin Users
- **Email:** admin@niya.com
- **Email:** jayashreev@niya.app

---

## 🛠️ **Common Issues & Solutions**

### Issue 1: 500 Internal Server Error
**Symptoms:** Admin pages return 500 errors after login
**Solution:**
1. Check logs for specific error messages
2. Verify all models have `ransackable_attributes` method
3. Check if roles are properly seeded in database

### Issue 2: Authentication Issues
**Symptoms:** Cannot login or session expires immediately
**Solution:**
1. Verify admin user exists in database
2. Check password is correct
3. Clear browser cookies and try again

### Issue 3: Role-Related Errors
**Symptoms:** Errors about missing roles or role lookups
**Solution:**
1. Run database seeds: `bundle exec rails db:seed`
2. Check role names match exactly (HR, COACH, EMPLOYEE, ADMIN)

### Issue 4: Container Not Starting
**Symptoms:** Container app shows "Failed" status
**Solution:**
1. Check logs for startup errors
2. Verify environment variables are set correctly
3. Check database connectivity

---

## 📊 **Monitoring Commands**

### Container Health
```bash
# Check running status
az containerapp show --name niya-admin-app-india --resource-group niya-rg --query "properties.runningStatus"

# Check revision details
az containerapp revision list --name niya-admin-app-india --resource-group niya-rg

# Check current image
az containerapp show --name niya-admin-app-india --resource-group niya-rg --query "properties.template.containers[0].image"
```

### Application Health
```bash
# Test root endpoint (should return 404 - this is normal)
Invoke-WebRequest -Uri "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/" -UseBasicParsing

# Test admin login page
Invoke-WebRequest -Uri "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/admin/login" -UseBasicParsing | Select-Object StatusCode
```

---

## 🔄 **Rollback Procedure**

### If Deployment Fails
```bash
# List available revisions
az containerapp revision list --name niya-admin-app-india --resource-group niya-rg

# Rollback to previous working revision
az containerapp revision activate --name niya-admin-app-india --resource-group niya-rg --revision PREVIOUS_REVISION_NAME

# Example:
az containerapp revision activate --name niya-admin-app-india --resource-group niya-rg --revision niya-admin-app-india--0000058
```

---

## 📝 **File Structure Reference**

### Key Files Modified
```
back-end/
├── app/
│   ├── admin/
│   │   ├── hr.rb                    # Fixed role lookup
│   │   ├── coach.rb                 # Fixed role lookup
│   │   ├── employee.rb              # Fixed role lookup
│   │   ├── admin_users.rb           # Fixed role lookup
│   │   └── set_coach_availability.rb # Fixed role lookup
│   └── models/
│       ├── company.rb               # Added ransackable_attributes
│       ├── account_block/account.rb  # Added ransackable_attributes
│       └── [14 other models]        # Added ransackable_attributes
├── config/
│   └── read_only_admin.rb           # Commented out conflicting config
└── Dockerfile.admin-fixed           # Docker build file
```

---

## 🎯 **Success Criteria**

### Deployment Success Indicators
- ✅ Container app status: "Running"
- ✅ All admin pages return HTTP 200
- ✅ No 500 errors in logs
- ✅ Admin login works successfully
- ✅ All admin pages load without errors

### Testing Checklist
- [ ] Login with admin credentials
- [ ] Access Companies page
- [ ] Access HR page
- [ ] Access Coaches page
- [ ] Access Employees page
- [ ] Access Admin Users page
- [ ] Test filtering/searching on each page
- [ ] Verify no console errors in browser

---

## 📞 **Support Information**

- **Application URL:** https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io
- **Resource Group:** niya-rg
- **Container App:** niya-admin-app-india
- **Registry:** niyaacr1758276383.azurecr.io
- **Environment:** Central India

---

**Last Updated:** October 28, 2025  
**Status:** ✅ **READY FOR TESTING**


