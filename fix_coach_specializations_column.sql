-- Fix the focus_areas column type
-- Change from integer to text to support serialized arrays

ALTER TABLE coach_specializations 
MODIFY COLUMN focus_areas TEXT;

-- Now insert with proper YAML serialization format
-- Delete existing records first
DELETE FROM coach_specializations;

-- Insert with correct format
INSERT INTO coach_specializations (expertise, focus_areas, created_at, updated_at)
VALUES 
  ('Anxiety Depression', '---
- 28
- 26
', NOW(), NOW()),
  
  ('Stress Management', '---
- 29
- 26
', NOW(), NOW()),
  
  ('Relationship Counseling', '---
- 26
- 27
', NOW(), NOW()),
  
  ('Self Confidence', '---
- 27
- 28
', NOW(), NOW());

-- Verify
SELECT id, expertise, focus_areas FROM coach_specializations;


