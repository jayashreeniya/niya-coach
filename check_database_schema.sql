-- Check the actual database schema

-- Show structure of Question 2 answers table
DESCRIBE assesment_test_answers;

-- Show structure of Question 3 questions table
DESCRIBE assesment_test_types;

-- Show structure of Question 3 answers table
DESCRIBE assesment_test_type_answers;

-- Check what Question 3 data exists
SELECT 'Question 3 Questions:' AS info;
SELECT * FROM assesment_test_types ORDER BY id;

SELECT 'Question 3 Answers:' AS info;
SELECT * FROM assesment_test_type_answers ORDER BY assesment_test_type_id, id;




