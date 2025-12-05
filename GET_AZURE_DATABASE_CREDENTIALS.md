# How to Get Azure Database Connection Details

## Method 1: From Container App Environment Variables (Easiest)

1. **Login to Azure Portal**: https://portal.azure.com

2. **Navigate to your Container App**:
   - Search for "Container Apps" in the top search bar
   - Click on `niya-admin-app-india`

3. **Get Environment Variables**:
   - In the left menu, click on "Containers"
   - Click on your container name
   - Look for "Environment variables" section
   - Find these variables (copy their values):
     - `TEMPLATEAPP_DATABASE` (database name)
     - `TEMPLATEAPP_DATABASE_USER` (username)
     - `TEMPLATEAPP_DATABASE_PASSWORD` (password)
     - `TEMPLATE_DATABASE_HOSTNAME` (host/server address)

## Method 2: From MySQL Database Resource

1. **Login to Azure Portal**: https://portal.azure.com

2. **Find MySQL Database**:
   - Search for "Azure Database for MySQL" in the top search bar
   - Click on your database server

3. **Get Connection Details**:
   - **Server name**: Copy from the "Overview" page (this is the hostname)
   - **Username**: Found in "Settings" → "Connection security"
   - **Password**: You set this when creating the database (if you don't know it, you may need to reset it)
   - **Database name**: Found in "Databases" section

## What You Need:

After getting the details, you should have:

```
Hostname: something.mysql.database.azure.com
Username: adminuser@servername (or just adminuser)
Password: YourPassword123
Database: niya_production (or similar)
Port: 3306 (default)
```

## Next Step:

Once you have these details, provide them to me and I'll create a script to:
1. Connect to the database
2. Create a new user account with proper password hash
3. Set the account as activated
4. Test login with the new account


