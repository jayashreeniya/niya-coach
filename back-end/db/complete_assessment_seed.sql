-- Complete Assessment Questions Seed
-- This populates BOTH tables needed for the assessment flow

-- ============================================================
-- PART 1: Questions 1 & 2 (assesment_test_questions table)
-- ============================================================

-- Question 1
INSERT INTO assesment_test_questions (id, title, sequence_number, created_at, updated_at)
VALUES (1, 'In Personal Life what do you want to talk about?', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE title = VALUES(title), updated_at = NOW();

-- Question 1 Answers
INSERT INTO assesment_test_answers (assesment_test_question_id, answers, title, created_at, updated_at)
VALUES
  (1, 'Stress Management', 'Stress Management', NOW(), NOW()),
  (1, 'Relationship Issues', 'Relationship Issues', NOW(), NOW()),
  (1, 'Self-Confidence', 'Self-Confidence', NOW(), NOW()),
  (1, 'Life Balance', 'Life Balance', NOW(), NOW()),
  (1, 'Personal Growth', 'Personal Growth', NOW(), NOW())
ON DUPLICATE KEY UPDATE answers = VALUES(answers), title = VALUES(title), updated_at = NOW();

-- Question 2
INSERT INTO assesment_test_questions (id, title, sequence_number, created_at, updated_at)
VALUES (2, 'My Professional Life', 2, NOW(), NOW())
ON DUPLICATE KEY UPDATE title = VALUES(title), updated_at = NOW();

-- Question 2 Answers (store IDs for linking)
INSERT INTO assesment_test_answers (id, assesment_test_question_id, answers, title, created_at, updated_at)
VALUES
  (10, 2, 'Work-Life Balance', 'Work-Life Balance', NOW(), NOW()),
  (11, 2, 'Career Development', 'Career Development', NOW(), NOW()),
  (12, 2, 'Conflict Resolution', 'Conflict Resolution', NOW(), NOW()),
  (13, 2, 'Leadership Skills', 'Leadership Skills', NOW(), NOW()),
  (14, 2, 'Job Satisfaction', 'Job Satisfaction', NOW(), NOW())
ON DUPLICATE KEY UPDATE answers = VALUES(answers), title = VALUES(title), updated_at = NOW();

-- ============================================================
-- PART 2: Question 3 (assesment_test_types table)
-- ============================================================
-- Link to each Question 2 answer

-- Question 3 for "Work-Life Balance" answer (ID 10)
INSERT INTO assesment_test_types (question_title, assesment_test_answer_id, created_at, updated_at)
VALUES ('What would you like to talk about today?', 10, NOW(), NOW())
ON DUPLICATE KEY UPDATE question_title = VALUES(question_title), updated_at = NOW();

SET @q3_wlb = LAST_INSERT_ID();

INSERT INTO assesment_test_type_answers (assesment_test_type_id, answers, created_at, updated_at)
VALUES
  (@q3_wlb, 'Time Management', NOW(), NOW()),
  (@q3_wlb, 'Setting Boundaries', NOW(), NOW()),
  (@q3_wlb, 'Prioritization', NOW(), NOW()),
  (@q3_wlb, 'Energy Management', NOW(), NOW()),
  (@q3_wlb, 'Self-Care', NOW(), NOW())
ON DUPLICATE KEY UPDATE answers = VALUES(answers), updated_at = NOW();

-- Question 3 for "Career Development" answer (ID 11)
INSERT INTO assesment_test_types (question_title, assesment_test_answer_id, created_at, updated_at)
VALUES ('What would you like to talk about today?', 11, NOW(), NOW())
ON DUPLICATE KEY UPDATE question_title = VALUES(question_title), updated_at = NOW();

SET @q3_career = LAST_INSERT_ID();

INSERT INTO assesment_test_type_answers (assesment_test_type_id, answers, created_at, updated_at)
VALUES
  (@q3_career, 'Career Goals', NOW(), NOW()),
  (@q3_career, 'Skill Development', NOW(), NOW()),
  (@q3_career, 'Career Transition', NOW(), NOW()),
  (@q3_career, 'Professional Growth', NOW(), NOW()),
  (@q3_career, 'Networking', NOW(), NOW())
ON DUPLICATE KEY UPDATE answers = VALUES(answers), updated_at = NOW();

-- Question 3 for "Conflict Resolution" answer (ID 12)
INSERT INTO assesment_test_types (question_title, assesment_test_answer_id, created_at, updated_at)
VALUES ('What would you like to talk about today?', 12, NOW(), NOW())
ON DUPLICATE KEY UPDATE question_title = VALUES(question_title), updated_at = NOW();

SET @q3_conflict = LAST_INSERT_ID();

INSERT INTO assesment_test_type_answers (assesment_test_type_id, answers, created_at, updated_at)
VALUES
  (@q3_conflict, 'Team Dynamics', NOW(), NOW()),
  (@q3_conflict, 'Communication Skills', NOW(), NOW()),
  (@q3_conflict, 'Difficult Conversations', NOW(), NOW()),
  (@q3_conflict, 'Negotiation', NOW(), NOW()),
  (@q3_conflict, 'Emotional Intelligence', NOW(), NOW())
ON DUPLICATE KEY UPDATE answers = VALUES(answers), updated_at = NOW();

-- Question 3 for "Leadership Skills" answer (ID 13)
INSERT INTO assesment_test_types (question_title, assesment_test_answer_id, created_at, updated_at)
VALUES ('What would you like to talk about today?', 13, NOW(), NOW())
ON DUPLICATE KEY UPDATE question_title = VALUES(question_title), updated_at = NOW();

SET @q3_leadership = LAST_INSERT_ID();

INSERT INTO assesment_test_type_answers (assesment_test_type_id, answers, created_at, updated_at)
VALUES
  (@q3_leadership, 'Leadership Style', NOW(), NOW()),
  (@q3_leadership, 'Team Management', NOW(), NOW()),
  (@q3_leadership, 'Decision Making', NOW(), NOW()),
  (@q3_leadership, 'Motivating Others', NOW(), NOW()),
  (@q3_leadership, 'Strategic Thinking', NOW(), NOW())
ON DUPLICATE KEY UPDATE answers = VALUES(answers), updated_at = NOW();

-- Question 3 for "Job Satisfaction" answer (ID 14)
INSERT INTO assesment_test_types (question_title, assesment_test_answer_id, created_at, updated_at)
VALUES ('What would you like to talk about today?', 14, NOW(), NOW())
ON DUPLICATE KEY UPDATE question_title = VALUES(question_title), updated_at = NOW();

SET @q3_satisfaction = LAST_INSERT_ID();

INSERT INTO assesment_test_type_answers (assesment_test_type_id, answers, created_at, updated_at)
VALUES
  (@q3_satisfaction, 'Finding Purpose', NOW(), NOW()),
  (@q3_satisfaction, 'Work Environment', NOW(), NOW()),
  (@q3_satisfaction, 'Recognition', NOW(), NOW()),
  (@q3_satisfaction, 'Job Security', NOW(), NOW()),
  (@q3_satisfaction, 'Growth Opportunities', NOW(), NOW())
ON DUPLICATE KEY UPDATE answers = VALUES(answers), updated_at = NOW();

-- ============================================================
-- VERIFICATION
-- ============================================================

SELECT 'Questions 1 & 2:' as Section;
SELECT id, title, sequence_number FROM assesment_test_questions ORDER BY sequence_number;

SELECT 'Question 2 Answers (for linking):' as Section;
SELECT id, answers FROM assesment_test_answers WHERE assesment_test_question_id = 2;

SELECT 'Question 3 variants:' as Section;
SELECT id, question_title, assesment_test_answer_id FROM assesment_test_types;

SELECT 'Total counts:' as Section;
SELECT 
  (SELECT COUNT(*) FROM assesment_test_questions) as questions_1_2,
  (SELECT COUNT(*) FROM assesment_test_answers WHERE assesment_test_question_id IN (1,2)) as answers_1_2,
  (SELECT COUNT(*) FROM assesment_test_types) as questions_3,
  (SELECT COUNT(*) FROM assesment_test_type_answers) as answers_3;



