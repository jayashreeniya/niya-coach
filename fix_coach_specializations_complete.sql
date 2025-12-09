-- Step 1: Change focus_areas column from INT to TEXT
ALTER TABLE coach_specializations MODIFY focus_areas TEXT;

-- Step 2: Update with proper YAML array format (Rails serialize format)
UPDATE coach_specializations 
SET focus_areas = '---
- 27
'
WHERE expertise = 'Self Confidence';

UPDATE coach_specializations 
SET focus_areas = '---
- 28
'
WHERE expertise = 'Anxiety Depression';

UPDATE coach_specializations 
SET focus_areas = '---
- 29
'
WHERE expertise = 'Stress Management';

UPDATE coach_specializations 
SET focus_areas = '---
- 26
'
WHERE expertise = 'Relationship Counseling';

-- Step 3: Verify the structure and data
DESCRIBE coach_specializations;

-- Step 4: Verify the updates worked
SELECT id, expertise, focus_areas FROM coach_specializations ORDER BY id;

