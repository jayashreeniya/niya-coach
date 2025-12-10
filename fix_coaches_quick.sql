-- Quick fix for missing coaches - Run this in Azure MySQL Query Editor

-- 1. First check what's there
SELECT 'CHECKING COACH SPECIALIZATIONS' as status;
SELECT id, expertise, focus_areas FROM coach_specializations;

SELECT 'CHECKING AVAILABILITIES FOR 12/12/2025' as status;
SELECT id, service_provider_id, availability_date, available_slots_count 
FROM availabilities 
WHERE availability_date = '12/12/2025';

SELECT 'CHECKING ACTIVE COACHES' as status;
SELECT id, email, full_name, activated, role_id 
FROM accounts 
WHERE role_id = 4 AND activated = 1;

-- 2. Fix coach specializations if empty (same as before)
UPDATE coach_specializations 
SET focus_areas = '---
- 28
'
WHERE expertise = 'Anxiety Depression' AND (focus_areas IS NULL OR focus_areas = '0' OR focus_areas = 0);

UPDATE coach_specializations 
SET focus_areas = '---
- 29
'
WHERE expertise = 'Stress Management' AND (focus_areas IS NULL OR focus_areas = '0' OR focus_areas = 0);

UPDATE coach_specializations 
SET focus_areas = '---
- 26
'
WHERE expertise = 'Relationship Counseling' AND (focus_areas IS NULL OR focus_areas = '0' OR focus_areas = 0);

UPDATE coach_specializations 
SET focus_areas = '---
- 27
'
WHERE expertise = 'Self Confidence' AND (focus_areas IS NULL OR focus_areas = '0' OR focus_areas = 0);

-- 3. Verify fixes
SELECT 'AFTER FIX' as status;
SELECT id, expertise, focus_areas FROM coach_specializations;

-- 4. Check if Noreen has availability
SELECT 'NOREEN AVAILABILITY' as status;
SELECT a.id, a.availability_date, a.time_slots, a.available_slots_count,
       acc.full_name as coach_name
FROM availabilities a
JOIN accounts acc ON a.service_provider_id = acc.id
WHERE acc.email = 'noreen@gmail.com'
  AND a.availability_date = '12/12/2025';

