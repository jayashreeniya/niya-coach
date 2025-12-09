-- Check the complete booking system setup

-- 1. Check roles to understand account types
SELECT * FROM roles;

-- 2. Check which accounts are coaches (by role_id)
SELECT id, email, full_name, role_id, type, user_type, activated, expertise
FROM accounts 
WHERE activated = 1;

-- 3. Check availabilities table structure
DESCRIBE availabilities;

-- 4. Check if there are any availability records
SELECT * FROM availabilities 
ORDER BY id DESC 
LIMIT 5;

-- 5. Check booked_slots structure
DESCRIBE bx_block_appointment_management_booked_slots;

-- 6. Check if there are any bookings
SELECT * FROM bx_block_appointment_management_booked_slots 
ORDER BY id DESC 
LIMIT 3;


