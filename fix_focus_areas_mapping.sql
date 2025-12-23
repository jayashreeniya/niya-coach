-- Find what focus area IDs 27, 28, 29 actually are
SELECT id, title as answer, assesment_test_type_id
FROM assesment_test_type_answers
WHERE id IN (27, 28, 29);

-- Check the structure
DESCRIBE assesment_test_type_answers;

-- Update coach_specializations with proper focus_area IDs
-- These need to be stored as YAML arrays (since it's a TEXT column with serialize)

-- First, let's see what we're working with
SELECT * FROM coach_specializations;

-- The focus_areas should map to assesment_test_type_answers.id
-- Let me check all available focus areas
SELECT id, title, assesment_test_type_id 
FROM assesment_test_type_answers
ORDER BY id;










