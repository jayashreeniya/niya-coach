-- Check select_answers table structure
DESCRIBE select_answers;

-- Check if there are any select_answers records
SELECT * FROM select_answers ORDER BY id DESC LIMIT 5;

-- Check the most recent record
SELECT id, account_id, assesment_test_type_id, multiple_answers, created_at 
FROM select_answers 
ORDER BY id DESC LIMIT 1;




