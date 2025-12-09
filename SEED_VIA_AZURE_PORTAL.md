# Seed Assessment Questions via Azure Portal (5 minutes) ✅

## Quick Steps

### Step 1: Get Database Connection Info

Your database is likely one of these:
- Resource name: `niya-mysql-server` or similar
- Resource group: `niya-rg`

### Step 2: Open Query Editor

1. Go to: https://portal.azure.com
2. Search for "MySQL" in top search bar
3. Click on your MySQL database server
4. In left menu, click **"Query editor"** or **"Query"**
5. Login with your MySQL credentials

### Step 3: Run This SQL (Copy-Paste ALL of it)

```sql
-- ============================================================
-- Complete Assessment Questions Seed
-- ============================================================

-- Question 1
INSERT INTO assesment_test_questions (title, sequence_number, created_at, updated_at)
VALUES ('In Personal Life what do you want to talk about?', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE title = VALUES(title), updated_at = NOW();

SET @q1_id = LAST_INSERT_ID();
IF @q1_id = 0 THEN
  SELECT id INTO @q1_id FROM assesment_test_questions WHERE sequence_number = 1;
END IF;

-- Question 1 Answers
INSERT INTO assesment_test_answers (assesment_test_question_id, answers, title, created_at, updated_at)
VALUES
  (@q1_id, 'Stress Management', 'Stress Management', NOW(), NOW()),
  (@q1_id, 'Relationship Issues', 'Relationship Issues', NOW(), NOW()),
  (@q1_id, 'Self-Confidence', 'Self-Confidence', NOW(), NOW()),
  (@q1_id, 'Life Balance', 'Life Balance', NOW(), NOW()),
  (@q1_id, 'Personal Growth', 'Personal Growth', NOW(), NOW())
ON DUPLICATE KEY UPDATE answers = VALUES(answers), title = VALUES(title), updated_at = NOW();

-- Question 2
INSERT INTO assesment_test_questions (title, sequence_number, created_at, updated_at)
VALUES ('My Professional Life', 2, NOW(), NOW())
ON DUPLICATE KEY UPDATE title = VALUES(title), updated_at = NOW();

SET @q2_id = LAST_INSERT_ID();
IF @q2_id = 0 THEN
  SELECT id INTO @q2_id FROM assesment_test_questions WHERE sequence_number = 2;
END IF;

-- Question 2 Answers (with specific IDs for linking)
INSERT INTO assesment_test_answers (assesment_test_question_id, answers, title, created_at, updated_at)
VALUES
  (@q2_id, 'Work-Life Balance', 'Work-Life Balance', NOW(), NOW()),
  (@q2_id, 'Career Development', 'Career Development', NOW(), NOW()),
  (@q2_id, 'Conflict Resolution', 'Conflict Resolution', NOW(), NOW()),
  (@q2_id, 'Leadership Skills', 'Leadership Skills', NOW(), NOW()),
  (@q2_id, 'Job Satisfaction', 'Job Satisfaction', NOW(), NOW())
ON DUPLICATE KEY UPDATE answers = VALUES(answers), title = VALUES(title), updated_at = NOW();

-- Get Q2 answer IDs for linking
SELECT id INTO @ans_wlb FROM assesment_test_answers WHERE assesment_test_question_id = @q2_id AND answers = 'Work-Life Balance';
SELECT id INTO @ans_career FROM assesment_test_answers WHERE assesment_test_question_id = @q2_id AND answers = 'Career Development';
SELECT id INTO @ans_conflict FROM assesment_test_answers WHERE assesment_test_question_id = @q2_id AND answers = 'Conflict Resolution';
SELECT id INTO @ans_leadership FROM assesment_test_answers WHERE assesment_test_question_id = @q2_id AND answers = 'Leadership Skills';
SELECT id INTO @ans_satisfaction FROM assesment_test_answers WHERE assesment_test_question_id = @q2_id AND answers = 'Job Satisfaction';

-- ============================================================
-- Question 3 variants (assesment_test_types)
-- ============================================================

-- Q3 for Work-Life Balance
INSERT INTO assesment_test_types (question_title, assesment_test_answer_id, created_at, updated_at)
VALUES ('What would you like to talk about today?', @ans_wlb, NOW(), NOW())
ON DUPLICATE KEY UPDATE question_title = VALUES(question_title), updated_at = NOW();

SET @q3_wlb = LAST_INSERT_ID();
IF @q3_wlb = 0 THEN
  SELECT id INTO @q3_wlb FROM assesment_test_types WHERE assesment_test_answer_id = @ans_wlb;
END IF;

INSERT INTO assesment_test_type_answers (assesment_test_type_id, answers, created_at, updated_at)
VALUES
  (@q3_wlb, 'Time Management', NOW(), NOW()),
  (@q3_wlb, 'Setting Boundaries', NOW(), NOW()),
  (@q3_wlb, 'Prioritization', NOW(), NOW()),
  (@q3_wlb, 'Energy Management', NOW(), NOW()),
  (@q3_wlb, 'Self-Care', NOW(), NOW())
ON DUPLICATE KEY UPDATE answers = VALUES(answers), updated_at = NOW();

-- Q3 for Career Development
INSERT INTO assesment_test_types (question_title, assesment_test_answer_id, created_at, updated_at)
VALUES ('What would you like to talk about today?', @ans_career, NOW(), NOW())
ON DUPLICATE KEY UPDATE question_title = VALUES(question_title), updated_at = NOW();

SET @q3_career = LAST_INSERT_ID();
IF @q3_career = 0 THEN
  SELECT id INTO @q3_career FROM assesment_test_types WHERE assesment_test_answer_id = @ans_career;
END IF;

INSERT INTO assesment_test_type_answers (assesment_test_type_id, answers, created_at, updated_at)
VALUES
  (@q3_career, 'Career Goals', NOW(), NOW()),
  (@q3_career, 'Skill Development', NOW(), NOW()),
  (@q3_career, 'Career Transition', NOW(), NOW()),
  (@q3_career, 'Professional Growth', NOW(), NOW()),
  (@q3_career, 'Networking', NOW(), NOW())
ON DUPLICATE KEY UPDATE answers = VALUES(answers), updated_at = NOW();

-- Q3 for Conflict Resolution
INSERT INTO assesment_test_types (question_title, assesment_test_answer_id, created_at, updated_at)
VALUES ('What would you like to talk about today?', @ans_conflict, NOW(), NOW())
ON DUPLICATE KEY UPDATE question_title = VALUES(question_title), updated_at = NOW();

SET @q3_conflict = LAST_INSERT_ID();
IF @q3_conflict = 0 THEN
  SELECT id INTO @q3_conflict FROM assesment_test_types WHERE assesment_test_answer_id = @ans_conflict;
END IF;

INSERT INTO assesment_test_type_answers (assesment_test_type_id, answers, created_at, updated_at)
VALUES
  (@q3_conflict, 'Team Dynamics', NOW(), NOW()),
  (@q3_conflict, 'Communication Skills', NOW(), NOW()),
  (@q3_conflict, 'Difficult Conversations', NOW(), NOW()),
  (@q3_conflict, 'Negotiation', NOW(), NOW()),
  (@q3_conflict, 'Emotional Intelligence', NOW(), NOW())
ON DUPLICATE KEY UPDATE answers = VALUES(answers), updated_at = NOW();

-- Q3 for Leadership Skills
INSERT INTO assesment_test_types (question_title, assesment_test_answer_id, created_at, updated_at)
VALUES ('What would you like to talk about today?', @ans_leadership, NOW(), NOW())
ON DUPLICATE KEY UPDATE question_title = VALUES(question_title), updated_at = NOW();

SET @q3_leadership = LAST_INSERT_ID();
IF @q3_leadership = 0 THEN
  SELECT id INTO @q3_leadership FROM assesment_test_types WHERE assesment_test_answer_id = @ans_leadership;
END IF;

INSERT INTO assesment_test_type_answers (assesment_test_type_id, answers, created_at, updated_at)
VALUES
  (@q3_leadership, 'Leadership Style', NOW(), NOW()),
  (@q3_leadership, 'Team Management', NOW(), NOW()),
  (@q3_leadership, 'Decision Making', NOW(), NOW()),
  (@q3_leadership, 'Motivating Others', NOW(), NOW()),
  (@q3_leadership, 'Strategic Thinking', NOW(), NOW())
ON DUPLICATE KEY UPDATE answers = VALUES(answers), updated_at = NOW();

-- Q3 for Job Satisfaction
INSERT INTO assesment_test_types (question_title, assesment_test_answer_id, created_at, updated_at)
VALUES ('What would you like to talk about today?', @ans_satisfaction, NOW(), NOW())
ON DUPLICATE KEY UPDATE question_title = VALUES(question_title), updated_at = NOW();

SET @q3_satisfaction = LAST_INSERT_ID();
IF @q3_satisfaction = 0 THEN
  SELECT id INTO @q3_satisfaction FROM assesment_test_types WHERE assesment_test_answer_id = @ans_satisfaction;
END IF;

INSERT INTO assesment_test_type_answers (assesment_test_type_id, answers, created_at, updated_at)
VALUES
  (@q3_satisfaction, 'Finding Purpose', NOW(), NOW()),
  (@q3_satisfaction, 'Work Environment', NOW(), NOW()),
  (@q3_satisfaction, 'Recognition', NOW(), NOW()),
  (@q3_satisfaction, 'Job Security', NOW(), NOW()),
  (@q3_satisfaction, 'Growth Opportunities', NOW(), NOW())
ON DUPLICATE KEY UPDATE answers = VALUES(answers), updated_at = NOW();

-- Verification
SELECT 'Questions 1 & 2:' as Result;
SELECT id, title, sequence_number FROM assesment_test_questions ORDER BY sequence_number;

SELECT 'Question 2 Answers (for linking):' as Result;
SELECT id, answers FROM assesment_test_answers WHERE assesment_test_question_id = @q2_id;

SELECT 'Question 3 variants:' as Result;
SELECT id, question_title, assesment_test_answer_id FROM assesment_test_types;

SELECT 'Total Counts:' as Result;
SELECT 
  (SELECT COUNT(*) FROM assesment_test_questions) as questions_1_2,
  (SELECT COUNT(*) FROM assesment_test_answers WHERE assesment_test_question_id IN (@q1_id, @q2_id)) as answers_1_2,
  (SELECT COUNT(*) FROM assesment_test_types) as questions_3,
  (SELECT COUNT(*) FROM assesment_test_type_answers) as answers_3;
```

### Step 4: Verify

You should see output showing:
- **questions_1_2**: 2
- **answers_1_2**: 10  
- **questions_3**: 5
- **answers_3**: 25

### Step 5: Test Web App

1. Go to: http://localhost:3000 (if running locally)
2. Login with: `jayashreev@niya.app` / `V#niya6!`
3. You should now see all 3 questions with proper answers!

---

## Alternative: MySQL Workbench or Command Line

If you have MySQL Workbench or MySQL command line:

```bash
mysql -h [your-azure-mysql-host] -u [username] -p [database] < back-end/db/complete_assessment_seed.sql
```

---

## Next: Fix Admin Panel

After this works, we'll fix the admin panel so psychologists can add custom questions easily!



