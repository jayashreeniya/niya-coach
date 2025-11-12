#!/usr/bin/env ruby
# Azure Database Connection Setup Script

puts "=== Niya Admin Module - Azure Database Setup ==="
puts

# Check if we're in the right directory
unless File.exist?('back-end/config/database.yml')
  puts "❌ Error: Please run this script from the project root directory"
  puts "   Expected to find: back-end/config/database.yml"
  exit 1
end

puts "✅ Found Rails application in back-end directory"
puts

# Check for .env file
env_file = 'back-end/.env'
if File.exist?(env_file)
  puts "✅ Found existing .env file"
else
  puts "⚠️  No .env file found. We'll create one for you."
end

puts
puts "Please provide your Azure MySQL database connection details:"
puts

# Get Azure connection details
print "Azure Server Name (e.g., your-server.mysql.database.azure.com): "
server_name = gets.chomp

print "Database Name: "
database_name = gets.chomp

print "Username (include @server if required): "
username = gets.chomp

print "Password: "
password = gets.chomp

print "Port (default 3306): "
port = gets.chomp
port = "3306" if port.empty?

print "SSL Mode (required, preferred, disabled) [required]: "
ssl_mode = gets.chomp
ssl_mode = "required" if ssl_mode.empty?

puts
puts "Creating .env file with your Azure configuration..."

# Create .env file content
env_content = <<~ENV
  # Azure Database Configuration
  TEMPLATEAPP_DATABASE=#{database_name}
  TEMPLATEAPP_DATABASE_USER=#{username}
  TEMPLATEAPP_DATABASE_PASSWORD=#{password}
  TEMPLATE_DATABASE_HOSTNAME=#{server_name}
  RAILS_DATABASE_PORT=#{port}
  RAILS_DB_POOL=5
  
  # Rails Environment
  RAILS_ENV=development
ENV

# Write .env file
File.write(env_file, env_content)
puts "✅ Created #{env_file}"

# Check if we need to update database.yml for Azure SSL
database_yml_path = 'back-end/config/database.yml'
database_content = File.read(database_yml_path)

if ssl_mode == "required" && !database_content.include?("ssl_mode")
  puts
  puts "⚠️  Azure requires SSL. Updating database.yml..."
  
  # Add SSL configuration to database.yml
  updated_content = database_content.gsub(
    /default: &default\n  adapter: mysql2\n  encoding: utf8mb4/,
    "default: &default\n  adapter: mysql2\n  encoding: utf8mb4\n  ssl_mode: #{ssl_mode}"
  )
  
  File.write(database_yml_path, updated_content)
  puts "✅ Updated database.yml with SSL configuration"
end

puts
puts "=== Next Steps ==="
puts "1. cd back-end"
puts "2. bundle install"
puts "3. rails db:migrate:status  # Test connection"
puts "4. rails server"
puts "5. Visit: http://localhost:3000/admin"
puts
puts "If you encounter connection issues, check:"
puts "- Firewall rules in Azure"
puts "- SSL certificate requirements"
puts "- Username format (may need @server suffix)"
puts
puts "✅ Setup complete! Your Azure database connection is configured."
