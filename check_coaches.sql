-- Check if there are any coaches/psychologists in the database
SELECT id, email, full_name, activated, account_type 
FROM accounts 
WHERE activated = 1
ORDER BY id;

-- Check roles
SELECT * FROM roles;

-- Check if there are any booked slots
SELECT * FROM booked_slots LIMIT 5;












