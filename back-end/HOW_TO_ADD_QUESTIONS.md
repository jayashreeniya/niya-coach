# How to Add Assessment Questions to NIYa

**Date:** December 5, 2025

---

## 🎯 Two Methods to Add Questions

### **Method 1: Using SQL Script (RECOMMENDED)**

This is the fastest and most reliable way to populate questions.

#### Step 1: Connect to MySQL Database

```bash
# Using Azure CLI to get database connection string
az mysql flexible-server show --resource-group niya-rg --name [your-mysql-server]

# Or connect directly if you have credentials
mysql -h [hostname] -u [username] -p [database_name]
```

#### Step 2: Run the SQL Script

```bash
# From the back-end directory
mysql -h [hostname] -u [username] -p [database] < db/seed_assessment_questions.sql
```

**Or copy-paste the SQL directly into MySQL workbench or Azure portal query editor.**

---

### **Method 2: Using Admin Portal (If SQL doesn't work)**

#### The Correct Admin Pages to Use:

**For Assessment Questions, you need TWO tables:**

1. **`Assesment Test Questions`** - The actual questions
2. **`Assesment Test Answers`** - The answer options for each question

#### Steps:

**Step 1: Add a Question**

1. Go to Admin Portal: https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/admin
2. Login with: `jayashreev@niya.app` / `V#niya6!`
3. Find **"Assesment Test Questions"** in the menu
4. Click **"Add Assesment Test Question"**
5. Fill in:
   - **Title:** "In Personal Life what do you want to talk about?"
   - **Sequence Number:** 1
6. Click **"Create Assesment test question"**
7. Note the **Question ID** (you'll need it for answers)

**Step 2: Add Answers for That Question**

1. Find **"Assesment Test Answers"** in the menu
2. Click **"Add Assesment Test Answer"**
3. For EACH answer option, create a new entry:

**Answer 1:**
- **Assesment Test Question:** Select "In Personal Life..." from dropdown
- **Answers:** "Stress Management"
- **Title:** "Stress Management"
- Click **"Create Assesment test answer"**

**Answer 2:**
- **Assesment Test Question:** Select "In Personal Life..." from dropdown
- **Answers:** "Relationship Issues"
- **Title:** "Relationship Issues"
- Click **"Create Assesment test answer"**

**Repeat for all answers** (3-5 answer options per question)

**Step 3: Repeat for Question 2**

1. Add Question: "My Professional Life" (Sequence Number: 2)
2. Add 3-5 answers for this question

---

## 📊 Database Structure

### Tables Needed:

**1. `assesment_test_questions`**
```sql
+------------------+
| id               | (auto-increment)
| title            | (question text)
| sequence_number  | (1, 2, 3...)
| created_at       |
| updated_at       |
+------------------+
```

**2. `assesment_test_answers`**
```sql
+--------------------------------+
| id                             | (auto-increment)
| assesment_test_question_id     | (foreign key to question)
| answers                        | (answer text)
| title                          | (same as answers)
| created_at                     |
| updated_at                     |
+--------------------------------+
```

---

## 🎯 Sample Data to Add

### Question 1: Personal Life (Sequence: 1)
**Answers:**
- Stress Management
- Relationship Issues
- Self-Confidence
- Life Balance
- Personal Growth

### Question 2: Professional Life (Sequence: 2)
**Answers:**
- Work-Life Balance
- Career Development
- Conflict Resolution
- Leadership Skills
- Job Satisfaction

---

## ⚠️ Common Issues

### Issue 1: "Not able to add questions"

**Problem:** The admin form you showed is for "Niya Chat Board Test Type" which is a different feature.

**Solution:** Use the **"Assesment Test Questions"** menu item instead.

---

### Issue 2: "Answers not showing in web app"

**Problem:** Answers field is empty or null in database.

**Solution:** Make sure BOTH `answers` and `title` fields are filled with the same text.

---

### Issue 3: "Questions not appearing in correct order"

**Problem:** Sequence numbers are wrong.

**Solution:** 
- Question 1 should have `sequence_number = 1`
- Question 2 should have `sequence_number = 2`
- etc.

---

## ✅ Verification

After adding questions, test with this SQL:

```sql
-- Check questions
SELECT * FROM assesment_test_questions ORDER BY sequence_number;

-- Check answers
SELECT 
  q.id as q_id,
  q.title as question,
  q.sequence_number,
  a.id as a_id,
  a.answers as answer_text
FROM assesment_test_questions q
LEFT JOIN assesment_test_answers a ON a.assesment_test_question_id = q.id
ORDER BY q.sequence_number, a.id;
```

**Expected output:**
- At least 2 questions with sequence 1 and 2
- Each question should have 3-5 answers
- Answer text should NOT be empty or null

---

## 🧪 Test in Web App

After adding questions:

1. Open web app: http://localhost:3000
2. Login
3. You should see:
   - Question 1 with radio buttons showing answer options
   - After selecting, Question 2 appears
   - After selecting Q2, Question 3 appears (if you added it)

---

## 🚀 Quick Start SQL (Copy-Paste Ready)

If you have MySQL access, just run this:

```sql
-- Question 1
INSERT INTO assesment_test_questions (title, sequence_number, created_at, updated_at)
VALUES ('In Personal Life what do you want to talk about?', 1, NOW(), NOW());

SET @q1 = LAST_INSERT_ID();

INSERT INTO assesment_test_answers (assesment_test_question_id, answers, title, created_at, updated_at)
VALUES
  (@q1, 'Stress Management', 'Stress Management', NOW(), NOW()),
  (@q1, 'Relationship Issues', 'Relationship Issues', NOW(), NOW()),
  (@q1, 'Self-Confidence', 'Self-Confidence', NOW(), NOW()),
  (@q1, 'Life Balance', 'Life Balance', NOW(), NOW());

-- Question 2
INSERT INTO assesment_test_questions (title, sequence_number, created_at, updated_at)
VALUES ('My Professional Life', 2, NOW(), NOW());

SET @q2 = LAST_INSERT_ID();

INSERT INTO assesment_test_answers (assesment_test_question_id, answers, title, created_at, updated_at)
VALUES
  (@q2, 'Work-Life Balance', 'Work-Life Balance', NOW(), NOW()),
  (@q2, 'Career Development', 'Career Development', NOW(), NOW()),
  (@q2, 'Conflict Resolution', 'Conflict Resolution', NOW(), NOW()),
  (@q2, 'Leadership Skills', 'Leadership Skills', NOW(), NOW());

-- Verify
SELECT 'Questions:' as Section, id, title, sequence_number FROM assesment_test_questions;
SELECT 'Answers:' as Section, assesment_test_question_id as q_id, answers FROM assesment_test_answers;
```

---

## 📞 Need Help?

**Database Connection Issues:**
- Check Azure portal for MySQL connection details
- Verify firewall rules allow your IP

**Admin Portal Issues:**
- Clear browser cache
- Try different browser
- Check if you're logged in as admin role

**SQL Script Issues:**
- Make sure table names match your database
- Check if tables exist: `SHOW TABLES;`
- Check table structure: `DESCRIBE assesment_test_questions;`

---

**Status:** Ready to use ✅

Choose **Method 1 (SQL)** for fastest results!













