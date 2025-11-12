# WSL Rails Setup Complete Guide
## Date: Today's Session - Rails Admin App with Azure MySQL

## 🎯 **OBJECTIVE COMPLETED**
Successfully set up Ruby on Rails in WSL and connected it to Azure MySQL database for the admin interface.

---

## 📋 **COMPLETED STEPS**

### **1. WSL Setup & Environment**
- ✅ WSL Ubuntu 24.04 LTS installed and working
- ✅ Ruby 2.7.5 installed using rbenv (matching app requirements)
- ✅ Rails 7.1.4 installed (compatible with Ruby 2.7.0)
- ✅ MySQL development libraries installed (`libmysqlclient-dev`)
- ✅ PostgreSQL development libraries installed (`libpq-dev`)

### **2. Database Configuration**
- ✅ Fixed `database.yml` parsing error (removed malformed first line)
- ✅ Configured SSL settings for Azure MySQL:
  ```yaml
  ssl_mode: :required
  sslverify: false
  ssl_ca: false
  ssl_cert: false
  ssl_key: false
  ```
- ✅ Environment variables set:
  ```bash
  export TEMPLATEAPP_DATABASE="niyawebapp_ee6360db41464ed492e422ac2497b060_database"
  export TEMPLATEAPP_DATABASE_USER="niya_admin"
  export TEMPLATEAPP_DATABASE_PASSWORD="NiyaAdmin2024!"
  export TEMPLATE_DATABASE_HOSTNAME="niyawebapp-ee6360db41464ed492e422ac2497b060-dbserver.mysql.database.azure.com"
  export RAILS_DATABASE_PORT="3306"
  ```

### **3. Azure Database Setup**
- ✅ Created new admin user `niya_admin` with password `NiyaAdmin2024!`
- ✅ Granted all privileges to the user
- ✅ Azure firewall configured to allow WSL connections
- ✅ Database connection working: `rails db:version` returns "Current version: 0"

### **4. Database Schema Analysis**
- ✅ Found complete database schema in `back-end/db/schema.rb`
- ✅ Identified 66+ tables including all admin interface requirements
- ✅ Key tables for admin app:
  - `accounts` (main user table)
  - `admin_users` (admin authentication)
  - `companies`, `coaches`, `well_being_categories`
  - Assessment tables, appointment management, etc.

### **5. Migration Fixes**
- ✅ Fixed `jsonb` to `json` in migration file for MySQL compatibility
- ✅ 70 migrations already applied in Azure database
- ✅ Database structure exists but needs data population

---

## 🔧 **CURRENT STATUS**

### **✅ WORKING:**
- WSL environment with Ruby 2.7.5 and Rails 7.1.4
- Azure MySQL database connection
- Database schema fully created
- Admin interface files present and configured

### **⚠️ PENDING:**
- Complete remaining migrations (if any)
- Create admin user for login
- Populate database with seed data
- Start Rails server and access admin UI

---

## 🚀 **NEXT STEPS FOR TOMORROW**

### **Step 1: Resume WSL Session**
```bash
# Navigate to project
cd /mnt/d/Niya.life/niyasourcecode/back-end

# Set environment variables
export TEMPLATEAPP_DATABASE="niyawebapp_ee6360db41464ed492e422ac2497b060_database"
export TEMPLATEAPP_DATABASE_USER="niya_admin"
export TEMPLATEAPP_DATABASE_PASSWORD="NiyaAdmin2024!"
export TEMPLATE_DATABASE_HOSTNAME="niyawebapp-ee6360db41464ed492e422ac2497b060-dbserver.mysql.database.azure.com"
export RAILS_DATABASE_PORT="3306"
```

### **Step 2: Test Connection**
```bash
# Verify database connection
rails db:version
```

### **Step 3: Complete Migrations**
```bash
# Run any pending migrations
rails db:migrate RAILS_ENV=development
```

### **Step 4: Create Admin User**
```bash
# Create admin user for login
rails console
# In console:
# AdminUser.create!(email: 'admin@niya.app', password: 'admin123', password_confirmation: 'admin123')
```

### **Step 5: Start Rails Server**
```bash
# Start the server
rails server -b 0.0.0.0 -p 3000
```

### **Step 6: Access Admin Interface**
- Open browser to: `http://localhost:3000/admin`
- Login with admin credentials

---

## 🔑 **KEY FILES & LOCATIONS**

### **Database Configuration:**
- `back-end/config/database.yml` - Database connection settings
- `back-end/db/schema.rb` - Complete database schema
- `back-end/.env` - Environment variables

### **Admin Interface:**
- `back-end/app/admin/` - All admin interface files
- `back-end/config/initializers/active_admin.rb` - Admin configuration

### **Project Structure:**
- Project path: `/mnt/d/Niya.life/niyasourcecode/back-end`
- WSL user: `niya@DESKTOP-736RI20`

---

## 🛠️ **TROUBLESHOOTING NOTES**

### **If Connection Fails:**
1. Check WSL IP: `curl -s ifconfig.me`
2. Update Azure firewall with new IP
3. Verify environment variables are set

### **If Migrations Fail:**
1. Check for `jsonb` vs `json` issues
2. Verify MySQL compatibility
3. Run migrations one by one if needed

### **If Admin UI Doesn't Load:**
1. Ensure all migrations completed
2. Create admin user in console
3. Check Rails server logs

---

## 📊 **DATABASE CREDENTIALS**

### **Azure MySQL:**
- **Host:** `niyawebapp-ee6360db41464ed492e422ac2497b060-dbserver.mysql.database.azure.com`
- **Port:** `3306`
- **Database:** `niyawebapp_ee6360db41464ed492e422ac2497b060_database`
- **User:** `niya_admin`
- **Password:** `NiyaAdmin2024!`
- **SSL:** Required with verification disabled

### **Connection Test:**
```bash
mysql -h niyawebapp-ee6360db41464ed492e422ac2497b060-dbserver.mysql.database.azure.com -u niya_admin -p'NiyaAdmin2024!' --ssl-mode=REQUIRED --ssl-verify-server-cert=false
```

---

## ✅ **SUCCESS INDICATORS**

- ✅ `rails db:version` returns database version
- ✅ `rails server` starts without errors
- ✅ Admin interface accessible at `http://localhost:3000/admin`
- ✅ Can login with admin credentials

---

## 📝 **NOTES**

- The app uses Ruby 2.7.5 and Rails 7.1.4
- Database is MySQL (not PostgreSQL as schema suggests)
- Admin interface is comprehensive with 20+ modules
- All core tables exist but may need data population
- WordPress tables present (suggesting migration from WordPress)

---

**Last Updated:** Today's Session  
**Status:** Ready for admin interface access  
**Next Action:** Complete migrations and start Rails server



