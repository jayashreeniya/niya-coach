-- Check what's in the answers column
SELECT id, title, answers, assesment_test_type_id 
FROM assesment_test_type_answers
WHERE id IN (26, 27, 28, 29)
ORDER BY id;

-- Check all records
SELECT * FROM assesment_test_type_answers ORDER BY id;



