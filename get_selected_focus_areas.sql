-- Get the actual focus areas the user selected
SELECT id, answers, assesment_test_type_id 
FROM assesment_test_type_answers
WHERE id IN (27, 28, 29)
ORDER BY id;



