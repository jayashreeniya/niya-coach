# Create test records via direct SQL
ActiveRecord::Base.connection.execute("
  SET @hr_role_id = (SELECT id FROM roles WHERE name = 'HR' LIMIT 1);
")

# Create test HR
ActiveRecord::Base.connection.execute("
  INSERT INTO accounts (full_name, email, full_phone_number, password_digest, access_code, role_id, created_at, updated_at)
  SELECT 
    'Test HR',
    'testhr@niya.test',
    '919999999999',
    '$2a$12$yqwZ2.X6mVeUCsKugmimouGnLjnGzZ1yWVFPadqJZcKNmEO8Z4f9C',
    'TESTHR001',
    @hr_role_id,
    NOW(),
    NOW()
  WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE email = 'testhr@niya.test');
")

# Create test Account
ActiveRecord::Base.connection.execute("
  INSERT INTO accounts (full_name, email, full_phone_number, password_digest, created_at, updated_at)
  SELECT 
    'Test Account',
    'testaccount@niya.test',
    '919999999998',
    '$2a$12$yqwZ2.X6mVeUCsKugmimouGnLjnGzZ1yWVFPadqJZcKNmEO8Z4f9C',
    NOW(),
    NOW()
  WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE email = 'testaccount@niya.test');
")

# Show results
results = ActiveRecord::Base.connection.execute("
  SELECT id, full_name, email, role_id, created_at 
  FROM accounts 
  WHERE email IN ('testhr@niya.test', 'testaccount@niya.test');
")

puts "Created test records:"
results.each do |row|
  puts "  ID: #{row[0]}, Name: #{row[1]}, Email: #{row[2]}, Role ID: #{row[3]}"
end

puts "Done!"













