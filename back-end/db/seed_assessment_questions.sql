-- Seed Assessment Questions and Answers for NIYa Wellbeing App
-- Run this SQL script to populate the database with complete assessment data

-- ============================================================
-- CLEAR EXISTING TEST DATA (Optional - uncomment if needed)
-- ============================================================
-- DELETE FROM assesment_test_answers WHERE id > 0;
-- DELETE FROM assesment_test_questions WHERE id > 0;

-- ============================================================
-- QUESTION 1: Personal Life (Sequence 1)
-- ============================================================

-- Insert Question 1
INSERT INTO assesment_test_questions (title, sequence_number, created_at, updated_at)
VALUES ('In Personal Life what do you want to talk about?', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
  title = VALUES(title),
  updated_at = NOW();

-- Get the question ID (assuming it's ID 1, adjust if needed)
SET @question1_id = LAST_INSERT_ID();
IF @question1_id = 0 THEN SET @question1_id = 1; END IF;

-- Insert Answers for Question 1
INSERT INTO assesment_test_answers (assesment_test_question_id, answers, title, created_at, updated_at)
VALUES
  (@question1_id, 'Stress Management', 'Stress Management', NOW(), NOW()),
  (@question1_id, 'Relationship Issues', 'Relationship Issues', NOW(), NOW()),
  (@question1_id, 'Self-Confidence', 'Self-Confidence', NOW(), NOW()),
  (@question1_id, 'Life Balance', 'Life Balance', NOW(), NOW()),
  (@question1_id, 'Personal Growth', 'Personal Growth', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
  answers = VALUES(answers),
  title = VALUES(title),
  updated_at = NOW();

-- ============================================================
-- QUESTION 2: Professional Life (Sequence 2)
-- ============================================================

-- Insert Question 2
INSERT INTO assesment_test_questions (title, sequence_number, created_at, updated_at)
VALUES ('My Professional Life', 2, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
  title = VALUES(title),
  updated_at = NOW();

SET @question2_id = LAST_INSERT_ID();
IF @question2_id = 0 THEN SET @question2_id = 2; END IF;

-- Insert Answers for Question 2
INSERT INTO assesment_test_answers (assesment_test_question_id, answers, title, created_at, updated_at)
VALUES
  (@question2_id, 'Work-Life Balance', 'Work-Life Balance', NOW(), NOW()),
  (@question2_id, 'Career Development', 'Career Development', NOW(), NOW()),
  (@question2_id, 'Conflict Resolution', 'Conflict Resolution', NOW(), NOW()),
  (@question2_id, 'Leadership Skills', 'Leadership Skills', NOW(), NOW()),
  (@question2_id, 'Job Satisfaction', 'Job Satisfaction', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
  answers = VALUES(answers),
  title = VALUES(title),
  updated_at = NOW();

-- ============================================================
-- VERIFY INSERTED DATA
-- ============================================================

SELECT 'Assessment Questions:' as '';
SELECT id, title, sequence_number, created_at FROM assesment_test_questions ORDER BY sequence_number;

SELECT 'Assessment Answers:' as '';
SELECT 
  a.id,
  a.assesment_test_question_id as question_id,
  q.title as question_title,
  a.answers,
  a.title
FROM assesment_test_answers a
JOIN assesment_test_questions q ON q.id = a.assesment_test_question_id
ORDER BY a.assesment_test_question_id, a.id;

-- ============================================================
-- SUMMARY
-- ============================================================
SELECT 'Seed Data Summary:' as '';
SELECT 
  COUNT(DISTINCT id) as total_questions 
FROM assesment_test_questions;

SELECT 
  COUNT(id) as total_answers 
FROM assesment_test_answers;





