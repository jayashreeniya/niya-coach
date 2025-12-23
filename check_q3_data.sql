-- Check if Question 3 data exists in the database

-- Check AssesmentTestType (Question 3 questions)
SELECT 'Question 3 Questions:' AS info;
SELECT id, question_title, created_at 
FROM assesment_test_types 
ORDER BY id;

-- Check AssesmentTestTypeAnswer (Question 3 answers)
SELECT 'Question 3 Answers:' AS info;
SELECT id, answers, assesment_test_type_id 
FROM assesment_test_type_answers 
ORDER BY assesment_test_type_id, id;

-- Check the linkage between Q2 answers and Q3 questions
SELECT 'Q2 to Q3 Mapping:' AS info;
SELECT 
    q2_ans.id AS q2_answer_id,
    q2_ans.answers AS q2_answer_text,
    q2_ans.upcoming_question_id AS q3_question_id,
    q3.question_title AS q3_question_title
FROM assesment_test_answers q2_ans
LEFT JOIN assesment_test_types q3 ON q2_ans.upcoming_question_id = q3.id
WHERE q2_ans.assesment_test_question_id = (SELECT id FROM assesment_test_questions WHERE sequence_number = 2)
ORDER BY q2_ans.id;











