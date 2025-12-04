require 'bcrypt'

password = "Test@1234"
password_hash = BCrypt::Password.create(password)

sql = <<~SQL
-- Create test HR record
SET @hr_role_id = (SELECT id FROM roles WHERE name = 'HR' LIMIT 1);

-- Create test HR account (password: #{password})
INSERT INTO accounts (full_name, email, full_phone_number, password_digest, access_code, role_id, created_at, updated_at)
SELECT 
  'Test HR',
  'testhr@niya.test',
  '919999999999',
  '#{password_hash}',
  'TESTHR001',
  @hr_role_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE email = 'testhr@niya.test');

-- Create test Account record
INSERT INTO accounts (full_name, email, full_phone_number, password_digest, created_at, updated_at)
SELECT 
  'Test Account',
  'testaccount@niya.test',
  '919999999998',
  '#{password_hash}',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE email = 'testaccount@niya.test');

-- Show created records
SELECT id, full_name, email, role_id, created_at FROM accounts WHERE email IN ('testhr@niya.test', 'testaccount@niya.test');
SQL

puts sql













