# Read-Only Azure Database Connection Setup

## ⚠️ IMPORTANT: READ-ONLY MODE
This setup will **ONLY READ** from your Azure production database. It will **NOT**:
- Run any migrations
- Create any tables
- Modify any data
- Initialize any schemas
- Run any seeds

## Safe Connection Steps

### 1. Create Read-Only Environment File
Create `back-end/.env` with your Azure details:

```bash
# Azure Database Configuration (READ-ONLY)
TEMPLATEAPP_DATABASE=your_database_name
TEMPLATEAPP_DATABASE_USER=your_username@your-server
TEMPLATEAPP_DATABASE_PASSWORD=your_password
TEMPLATE_DATABASE_HOSTNAME=your-server.mysql.database.azure.com
RAILS_DATABASE_PORT=3306
RAILS_DB_POOL=5

# Rails Environment
RAILS_ENV=development
```

### 2. Skip Database Initialization
**DO NOT RUN:**
- `rails db:migrate`
- `rails db:setup`
- `rails db:seed`
- `rails db:create`

### 3. Test Connection Only
```bash
cd back-end
bundle install
rails db:migrate:status  # This only checks, doesn't modify
```

### 4. Start Admin Interface
```bash
rails server
```

## What This Will Do:
✅ **Connect** to your existing Azure database  
✅ **Display** all existing data in admin interface  
✅ **Show** all 31 admin modules with production data  
✅ **Allow viewing** of users, companies, content, etc.  
✅ **Preserve** all existing data unchanged  

## What This Will NOT Do:
❌ **Modify** any existing data  
❌ **Create** any new tables  
❌ **Run** any migrations  
❌ **Initialize** any schemas  
❌ **Seed** any data  

## Safety Measures:
- Uses existing database schema
- Only reads from existing tables
- No write operations to production data
- Admin interface displays existing data only

## Next Steps:
1. Provide your Azure connection details
2. I'll help you configure the read-only connection
3. Test the connection safely
4. Start the admin interface to view your production data
