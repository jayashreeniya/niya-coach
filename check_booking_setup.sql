-- Check accounts (users and coaches)
SELECT id, email, full_name, activated, account_type 
FROM accounts 
WHERE activated = 1
ORDER BY id;

-- Check booked slots
SELECT * FROM bx_block_appointment_management_booked_slots LIMIT 5;

-- Check availabilities (coach availability schedule)
SELECT * FROM bx_block_appointment_management_availabilities LIMIT 5;

-- Check roles
SELECT * FROM roles;




