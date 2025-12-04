puts "Database: #{ActiveRecord::Base.connection.current_database}"
puts "Host: #{ActiveRecord::Base.connection_config[:host]}"
puts "Tables count: #{ActiveRecord::Base.connection.tables.count}"
puts "Environment: #{Rails.env}"
puts "Connection status: #{ActiveRecord::Base.connected? ? 'Connected' : 'Not Connected'}"


