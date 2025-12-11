-- PERMANENT FIX FOR COACH SPECIALIZATIONS
-- Run this in Azure MySQL Query Editor

-- =============================================================================
-- STEP 1: Ensure coach_specializations table has correct data
-- =============================================================================

-- Check current state
SELECT 'BEFORE FIX - Coach Specializations' as status;
SELECT id, expertise, focus_areas FROM coach_specializations ORDER BY id;

-- Fix focus_areas with YAML array format
UPDATE coach_specializations 
SET focus_areas = '---
- 28
'
WHERE id = 1; -- Anxiety Depression

UPDATE coach_specializations 
SET focus_areas = '---
- 29
'
WHERE id = 2; -- Stress Management

UPDATE coach_specializations 
SET focus_areas = '---
- 26
'
WHERE id = 3; -- Relationship Counseling

UPDATE coach_specializations 
SET focus_areas = '---
- 27
'
WHERE id = 4; -- Self Confidence

-- Verify
SELECT 'AFTER FIX - Coach Specializations' as status;
SELECT id, expertise, focus_areas FROM coach_specializations ORDER BY id;

-- =============================================================================
-- STEP 2: Update coach accounts with expertise
-- =============================================================================

-- Noreen (all specializations)
UPDATE accounts 
SET expertise = '["Anxiety Depression", "Stress Management", "Relationship Counseling", "Self Confidence"]'
WHERE id = 7;

-- Nidhi
UPDATE accounts 
SET expertise = '["Anxiety Depression", "Stress Management"]'
WHERE id = 3;

-- Jayashree
UPDATE accounts 
SET expertise = '["Self Confidence", "Stress Management"]'
WHERE id = 6;

-- Maya
UPDATE accounts 
SET expertise = '["Relationship Counseling", "Anxiety Depression"]'
WHERE id = 12;

SELECT 'Coach Accounts Updated' as status;
SELECT id, full_name, email, expertise 
FROM accounts 
WHERE role_id = 4 AND activated = 1
ORDER BY id;

-- =============================================================================
-- STEP 3: Ensure availabilities exist for testing
-- =============================================================================

SELECT 'Checking Availabilities for 12/12/2025' as status;
SELECT id, service_provider_id, availability_date, available_slots_count,
       (SELECT full_name FROM accounts WHERE id = service_provider_id) as coach_name
FROM availabilities
WHERE availability_date = '12/12/2025'
ORDER BY service_provider_id;

-- If no availabilities, add them:
-- INSERT INTO availabilities (service_provider_id, availability_date, time_slots, available_slots_count, created_at, updated_at)
-- VALUES (7, '12/12/2025', '["11:00", "14:00", "15:00"]', 12, NOW(), NOW());

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

SELECT '=== VERIFICATION COMPLETE ===' as status;

SELECT 'Focus Area Mappings' as check_type, id, answers as focus_area_name
FROM assesment_test_type_answers
WHERE id IN (26, 27, 28, 29)
ORDER BY id;

SELECT 'User Recent Focus Areas' as check_type, 
       sa.id, sa.account_id, sa.multiple_answers,
       a.full_name as user_name
FROM select_answers sa
JOIN accounts a ON sa.account_id = a.id
ORDER BY sa.id DESC
LIMIT 3;



