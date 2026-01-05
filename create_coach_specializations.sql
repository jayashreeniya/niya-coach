-- Create Coach Specializations via SQL
-- Rails serializes arrays as YAML format in MySQL

-- Insert coach specializations
INSERT INTO coach_specializations (expertise, focus_areas, created_at, updated_at)
VALUES 
  -- Anxiety and Depression specialist
  ('Anxiety Depression', '---
- 28
- 26
', NOW(), NOW()),
  
  -- Stress Management specialist
  ('Stress Management', '---
- 29
- 26
', NOW(), NOW()),
  
  -- Relationship Counseling specialist
  ('Relationship Counseling', '---
- 26
- 27
', NOW(), NOW()),
  
  -- Self Confidence Coach
  ('Self Confidence', '---
- 27
- 28
', NOW(), NOW());

-- Verify the records were created
SELECT * FROM coach_specializations;












