#!/usr/bin/env ruby
# Test Azure Database Connection Script
# This script tests the connection to Azure database without using mysql2 gem

require 'net/http'
require 'uri'
require 'json'

puts "=== Testing Azure Database Connection ==="
puts

# Azure database connection details
host = "niyawebapp-ee6360db41464ed492e422ac2497b060-dbserver.mysql.database.azure.com"
port = 3306
username = "fzdzwbvndw"
password = "{V#ayin6!}"
database = "niyawebapp_ee6360db41464ed492e422ac2497b060_database"

puts "Host: #{host}"
puts "Port: #{port}"
puts "Username: #{username}"
puts "Database: #{database}"
puts

# Test basic connectivity
puts "Testing basic connectivity..."
begin
  require 'socket'
  socket = Socket.new(Socket::AF_INET, Socket::SOCK_STREAM, 0)
  socket.connect(Socket.pack_sockaddr_in(port, host))
  puts "✅ Successfully connected to Azure MySQL server!"
  socket.close
rescue => e
  puts "❌ Connection failed: #{e.message}"
  exit 1
end

puts
puts "=== Connection Test Complete ==="
puts "The Azure database is reachable and ready for admin module setup."
puts
puts "Next steps:"
puts "1. We need to resolve the mysql2 gem compilation issue"
puts "2. Or use an alternative database connection method"
puts "3. Then start the Rails admin server"
