-- Update coach_specializations to map expertise to correct focus_area IDs
-- Rails serializes arrays as YAML format in TEXT columns

-- Self Confidence maps to focus_area ID 27
UPDATE coach_specializations 
SET focus_areas = '---
- 27
'
WHERE expertise = 'Self Confidence';

-- Anxiety Depression maps to focus_area ID 28 (Anxiety)
UPDATE coach_specializations 
SET focus_areas = '---
- 28
'
WHERE expertise = 'Anxiety Depression';

-- Stress Management maps to focus_area ID 29 (Stress)
UPDATE coach_specializations 
SET focus_areas = '---
- 29
'
WHERE expertise = 'Stress Management';

-- Relationship Counseling maps to focus_area ID 26 (Relationship issues)
UPDATE coach_specializations 
SET focus_areas = '---
- 26
'
WHERE expertise = 'Relationship Counseling';

-- Verify the updates
SELECT id, expertise, focus_areas FROM coach_specializations ORDER BY id;











