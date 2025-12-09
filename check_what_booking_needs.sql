-- Check what's actually needed for booking to work

-- 1. Check if there are any coach accounts
SELECT id, email, full_name, account_type, activated 
FROM accounts 
WHERE activated = 1 
LIMIT 10;

-- 2. Check if there are availability schedules (this is what booking really needs)
SELECT * FROM bx_block_appointment_management_availabilities 
ORDER BY id DESC 
LIMIT 5;

-- 3. Check existing coach specializations (don't modify)
SELECT * FROM coach_specializations;

-- 4. Check what the focus_areas column actually contains
SELECT id, expertise, focus_areas 
FROM coach_specializations;

