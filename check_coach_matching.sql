-- Check why coaches aren't showing up for booking

-- 1. Check user's selected focus areas
SELECT 'User Focus Areas' as check_type, 
       sa.id, sa.account_id, sa.multiple_answers
FROM select_answers sa
WHERE sa.account_id = 6
ORDER BY sa.id DESC
LIMIT 1;

-- 2. Check what those focus area IDs correspond to
SELECT 'Focus Area Names' as check_type,
       id, answer, assesment_test_type_id
FROM assesment_test_type_answers
WHERE id IN (27, 28, 29);

-- 3. Check availabilities for 10/12/2025
SELECT 'Availabilities for 10/12/2025' as check_type,
       id, service_provider_id, availability_date, available_slots_count
FROM availabilities
WHERE availability_date = '10/12/2025'
ORDER BY id;

-- 4. Check coach accounts (activated and have role_id = 4)
SELECT 'Coach Accounts' as check_type,
       a.id, a.email, a.full_name, a.activated, a.role_id, a.expertise
FROM accounts a
WHERE a.role_id = 4
ORDER BY a.id;

-- 5. Check coach_specializations
SELECT 'Coach Specializations' as check_type,
       id, expertise, focus_areas
FROM coach_specializations
ORDER BY id;

-- 6. Check if coach expertise matches (coach ID 6 and 7)
SELECT 'Coach 6 (jayashree) Details' as check_type,
       id, email, full_name, expertise, activated
FROM accounts
WHERE id = 6;

SELECT 'Coach 7 (Noreen) Details' as check_type,
       id, email, full_name, expertise, activated
FROM accounts
WHERE id = 7;

SELECT 'Coach 3 (Nidhi) Details' as check_type,
       id, email, full_name, expertise, activated
FROM accounts
WHERE id = 3;



