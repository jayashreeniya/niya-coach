# How to Check Azure Container App Logs

## Method 1: Azure Portal - Log Stream (Real-time)

### Steps:
1. **Login to Azure Portal**: https://portal.azure.com
2. **Navigate to Container Apps**:
   - In the search bar at top, type "Container Apps"
   - Click on "Container Apps"
3. **Select your app**:
   - Click on `niya-admin-app-india`
4. **Open Log Stream**:
   - In the left menu, find "Monitoring" section
   - Click **"Log stream"**
5. **Watch for errors**:
   - The logs will start streaming in real-time
   - Keep this window open
6. **Trigger the error**:
   - Run: `python login_debug.py`
   - Immediately check the log stream for error messages

### What to Look For:
```
ERROR: ...
FATAL: ...
Exception: ...
ActiveRecord::...
RuntimeError: ...
```

---

## Method 2: Azure Portal - Logs Query (Historical)

### Steps:
1. Go to your Container App → `niya-admin-app-india`
2. Click **"Logs"** in the left menu (under Monitoring)
3. Run this query:

```kusto
ContainerAppConsoleLogs_CL
| where TimeGenerated > ago(1h)
| where Log_s contains "ERROR" or Log_s contains "Exception" or Log_s contains "Failed"
| project TimeGenerated, Log_s
| order by TimeGenerated desc
| take 50
```

4. Click "Run"

### Or check all recent logs:

```kusto
ContainerAppConsoleLogs_CL
| where TimeGenerated > ago(30m)
| project TimeGenerated, Log_s
| order by TimeGenerated desc
| take 100
```

---

## Method 3: Azure CLI (Command Line)

If you have Azure CLI installed:

```bash
# Login
az login

# Get logs
az containerapp logs show \
  --name niya-admin-app-india \
  --resource-group YOUR_RESOURCE_GROUP \
  --follow
```

---

## Method 4: Check System Logs for Container Issues

1. Go to Container App → `niya-admin-app-india`
2. Click "Revision management" in left menu
3. Click on the active revision
4. Look for:
   - **Provisioning State**: Should be "Provisioned"
   - **Running Status**: Should be "Running"
   - **Replica Count**: Should be > 0

---

## What Errors to Look For

### For Login Issues (422 errors):
```
Failed to find account
Email validation failed
Password authentication failed
ActiveRecord::RecordNotFound
Parameter parsing error
JSON deserialization failed
```

### For Admin Portal 500 Errors:
```
ActiveRecord::StatementInvalid
Azure::Storage::Blob error
Ransack error
undefined method
NoMethodError
```

### For Recent Breakage:
```
Database connection failed
Environment variable missing
Configuration error
```

---

## Copy the Logs and Share

Once you see the logs, please copy and share:
1. Any ERROR or Exception messages
2. Stack traces (lines starting with "from" or "at")
3. The timestamp of when the error occurred
4. Any messages around the time you ran the login test

---

## Alternative: Check Container App Events

1. Go to Container App → `niya-admin-app-india`
2. Click "Overview" in left menu
3. Scroll down to see recent events
4. Look for:
   - Container restart events
   - Configuration change events
   - Scaling events
   - Any failed health checks

---

## Quick Health Check Commands

If you can access the container directly, run:

```bash
# Check if Rails is running
curl https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/

# Check database connectivity
# (This would need Rails console access)
```

---

## What I Need From You

Please share:
1. **Any ERROR or Exception messages** from the logs
2. **The log entries** from when you try to login (run `python login_debug.py` while watching logs)
3. **Recent events** or changes to the container (deployments, config changes)
4. **Any warnings** about missing environment variables

This will tell us exactly why the login API is failing.






