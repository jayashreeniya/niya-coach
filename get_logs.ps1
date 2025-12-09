# Get recent Azure container logs
az containerapp logs show `
    --name niya-admin-app-india `
    --resource-group niya-rg `
    --tail 100 `
    --follow false

# If that doesn't work, try getting logs from the revision
# az containerapp revision list --name niya-admin-app-india --resource-group niya-rg --output table


