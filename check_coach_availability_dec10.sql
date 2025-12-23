-- Check if coaches are available for 12/12/2025 at 11:00

-- 1. Check user's selected focus areas
SELECT 'User Focus Areas' as check_type,
       sa.id, sa.account_id, sa.multiple_answers
FROM select_answers sa
WHERE sa.account_id = 6
ORDER BY sa.id DESC
LIMIT 1;

-- 2. Check availabilities for 12/12/2025
SELECT 'Availabilities' as check_type,
       id, service_provider_id, availability_date, 
       available_slots_count, time_slots
FROM availabilities
WHERE availability_date = '12/12/2025'
ORDER BY id;

-- 3. Check coach accounts
SELECT 'Coach Accounts' as check_type,
       a.id, a.email, a.full_name, a.activated, a.role_id
FROM accounts a
WHERE a.role_id = 4 AND a.activated = 1
ORDER BY a.id;

-- 4. Check coach specializations
SELECT 'Coach Specializations' as check_type,
       id, expertise, focus_areas
FROM coach_specializations
ORDER BY id;










