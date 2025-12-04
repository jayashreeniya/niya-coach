# SQL Commands to Create Test Records

Execute these SQL commands directly in your MySQL database to create test HR and Account records:

```sql
-- Get HR role ID
SET @hr_role_id = (SELECT id FROM roles WHERE name = 'HR' LIMIT 1);

-- Create test HR account (password: Test@1234)
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

-- Create test Account record (password: Test@1234)
INSERT INTO accounts (full_name, email, full_phone_number, password_digest, created_at, updated_at)
SELECT 
  'Test Account',
  'testaccount@niya.test',
  '919999999998',
  '$2a$12$yqwZ2.X6mVeUCsKugmimouGnLjnGzZ1yWVFPadqJZcKNmEO8Z4f9C',
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE email = 'testaccount@niya.test');

-- Verify records were created
SELECT id, full_name, email, role_id, created_at 
FROM accounts 
WHERE email IN ('testhr@niya.test', 'testaccount@niya.test');
```

**Password for both test accounts: `Test@1234`**

You can execute this via:
1. MySQL client directly connected to the database
2. Any database management tool (phpMyAdmin, MySQL Workbench, etc.)
3. Azure Portal's Query Editor if available













