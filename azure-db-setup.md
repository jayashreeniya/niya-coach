# Azure Database Connection Setup for Niya Admin Module

## Prerequisites
- Azure MySQL Database instance
- Database connection details (host, username, password, database name)
- Ruby 2.7.5 installed
- Rails 6.x installed

## Step 1: Get Azure Database Connection Details

You'll need the following information from your Azure portal:

1. **Server Name**: `your-server.mysql.database.azure.com`
2. **Database Name**: Your database name
3. **Username**: Your admin username
4. **Password**: Your database password
5. **Port**: Usually 3306 (default MySQL port)
6. **SSL**: Azure requires SSL connections

## Step 2: Configure Environment Variables

Create a `.env` file in the `back-end` directory with your Azure database details:

```bash
# Azure Database Configuration
TEMPLATEAPP_DATABASE=your_database_name
TEMPLATEAPP_DATABASE_USER=your_username@your-server
TEMPLATEAPP_DATABASE_PASSWORD=your_password
TEMPLATE_DATABASE_HOSTNAME=your-server.mysql.database.azure.com
RAILS_DATABASE_PORT=3306
RAILS_DB_POOL=5
```

## Step 3: Update Database Configuration

The current `database.yml` is already configured to use environment variables. For Azure, we might need to add SSL configuration.

## Step 4: Install Dependencies

```bash
cd back-end
bundle install
```

## Step 5: Test Connection

```bash
rails db:migrate:status
```

## Step 6: Start Admin Interface

```bash
rails server
```

Then visit: `http://localhost:3000/admin`

## Azure-Specific Configuration

If you encounter SSL issues, we may need to update the database configuration to include SSL settings for Azure.

## Next Steps

1. Provide your Azure database connection details
2. I'll help you configure the connection
3. Set up the admin interface with your production data
4. Test the admin functionality

Would you like to proceed with providing your Azure database connection details?
