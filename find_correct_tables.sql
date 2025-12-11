-- Find all tables related to availability
SHOW TABLES LIKE '%availab%';

-- Find all tables related to appointment
SHOW TABLES LIKE '%appointment%';

-- Find all tables related to booked
SHOW TABLES LIKE '%booked%';

-- Check the accounts table structure to find correct column names
DESCRIBE accounts;

-- Check what accounts exist
SELECT id, email, full_name, activated FROM accounts WHERE activated = 1;

-- List all tables to see what we have
SHOW TABLES;




