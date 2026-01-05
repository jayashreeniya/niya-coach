-- Check current focus_areas format
SELECT id, expertise, focus_areas FROM coach_specializations;

-- Rails serialize format for arrays in MySQL should be like this:
-- For [28, 26] it should be: '---\n- 28\n- 26\n'

-- Let's fix the format - update with proper YAML
UPDATE coach_specializations SET focus_areas = '---
- 28
- 26
' WHERE expertise = 'Anxiety Depression';

UPDATE coach_specializations SET focus_areas = '---
- 29
- 26
' WHERE expertise = 'Stress Management';

UPDATE coach_specializations SET focus_areas = '---
- 26
- 27
' WHERE expertise = 'Relationship Counseling';

UPDATE coach_specializations SET focus_areas = '---
- 27
- 28
' WHERE expertise = 'Self Confidence';

-- Verify the update
SELECT id, expertise, focus_areas FROM coach_specializations;












