# How to Seed the NIYa Database

**Date:** December 5, 2025  
**Status:** ✅ Seed files ready to use

---

## 📁 Available Seed Files

### 1. **`db/seeds.rb`** (MAIN SEED FILE)
Seeds everything including:
- ✅ Admin users
- ✅ Roles (admin, hr, employee, coach)
- ✅ Motions (wellbeing status indicators)
- ✅ WellBeing Focus Areas (21 items)
- ✅ **Assessment Questions** (NEW - just added!)
- ✅ **Assessment Answers** (NEW - just added!)
- ✅ Languages, Content Types, Categories

### 2. **`lib/tasks/seed_assessment_questions.rake`**
Rake task specifically for assessment questions with 3 commands:
- `app:seed_assessment_questions` - Add questions
- `app:clear_assessment_questions` - Remove all questions
- `app:reset_assessment_questions` - Clear and reseed

### 3. **`db/seed_assessment_questions.sql`**
Raw SQL script (if you prefer SQL over Rails)

---

## 🚀 How to Run Seeds

### **Method 1: Seed Everything (RECOMMENDED)**

This runs the main `seeds.rb` which now includes assessment questions:

```bash
cd back-end
rails db:seed
```

**What it does:**
- ✅ Creates admin user (`nidhil@niya.app`)
- ✅ Creates all roles
- ✅ Creates motions and focus areas
- ✅ **Creates 2 assessment questions with 10 answers total**
- ✅ Seeds languages, content types, categories

---

### **Method 2: Seed Only Assessment Questions**

If you only want to add assessment questions:

```bash
cd back-end
rails app:seed_assessment_questions
```

**Output:**
```
============================================================
Seeding Assessment Test Questions and Answers...
============================================================

📝 Creating Question 1: Personal Life...
✓ Question 1 ID: 1
  Adding answers for Question 1...
    ✓ Stress Management
    ✓ Relationship Issues
    ✓ Self-Confidence
    ✓ Life Balance
    ✓ Personal Growth

📝 Creating Question 2: Professional Life...
✓ Question 2 ID: 2
  Adding answers for Question 2...
    ✓ Work-Life Balance
    ✓ Career Development
    ✓ Conflict Resolution
    ✓ Leadership Skills
    ✓ Job Satisfaction

============================================================
✅ Seeding Complete!
============================================================
Total Questions: 2
Total Answers: 10
```

---

### **Method 3: Reset Assessment Questions**

If you want to clear existing questions and reseed from scratch:

```bash
cd back-end
rails app:reset_assessment_questions
```

**⚠️ WARNING:** This will delete ALL existing assessment questions and answers!

---

### **Method 4: Using SQL Directly**

If Rails commands don't work, use raw SQL:

```bash
mysql -h [hostname] -u [username] -p [database] < db/seed_assessment_questions.sql
```

---

## 🧪 Verify Seeds Were Successful

### **Method 1: Using Rails Console**

```bash
cd back-end
rails console

# In the console:
BxBlockAssessmenttest::AssesmentTestQuestion.count
# => 2

BxBlockAssessmenttest::AssesmentTestAnswer.count
# => 10

# See all questions:
BxBlockAssessmenttest::AssesmentTestQuestion.all.each do |q|
  puts "#{q.sequence_number}. #{q.title}"
end

# See all answers for question 1:
q1 = BxBlockAssessmenttest::AssesmentTestQuestion.find_by(sequence_number: 1)
q1.assesment_test_answers.each do |a|
  puts "  - #{a.answers}"
end
```

### **Method 2: Using Rake Task**

```bash
rails app:verify_seed
```

### **Method 3: Using SQL**

```sql
-- Check questions
SELECT * FROM assesment_test_questions ORDER BY sequence_number;

-- Check answers
SELECT 
  q.sequence_number,
  q.title as question,
  a.answers as answer
FROM assesment_test_questions q
LEFT JOIN assesment_test_answers a ON a.assesment_test_question_id = q.id
ORDER BY q.sequence_number, a.id;
```

**Expected output:**
```
sequence_number | question                                      | answer
1               | In Personal Life what do you want to talk...  | Stress Management
1               | In Personal Life what do you want to talk...  | Relationship Issues
1               | In Personal Life what do you want to talk...  | Self-Confidence
1               | In Personal Life what do you want to talk...  | Life Balance
1               | In Personal Life what do you want to talk...  | Personal Growth
2               | My Professional Life                          | Work-Life Balance
2               | My Professional Life                          | Career Development
2               | My Professional Life                          | Conflict Resolution
2               | My Professional Life                          | Leadership Skills
2               | My Professional Life                          | Job Satisfaction
```

---

## 🐳 Running Seeds in Docker/Azure

### **In Azure Container:**

```bash
# Connect to the container
az containerapp exec --name niya-admin-app-india --resource-group niya-rg --command /bin/sh

# Once inside:
cd /app
rails db:seed
exit
```

### **Or using Azure CLI:**

```bash
az containerapp exec \
  --name niya-admin-app-india \
  --resource-group niya-rg \
  --command "rails db:seed"
```

---

## ⚠️ Troubleshooting

### **Issue 1: "Table doesn't exist"**

**Problem:** Database schema not created yet

**Solution:**
```bash
rails db:create
rails db:migrate
rails db:seed
```

---

### **Issue 2: "PG::ConnectionBad" or "Mysql2::Error"**

**Problem:** Database connection issue

**Solution:**
- Check `config/database.yml` has correct credentials
- Verify environment variables are set
- Check database server is running

---

### **Issue 3: "find_or_create_by! failed"**

**Problem:** Validation errors or missing fields

**Solution:**
```bash
# Check Rails logs
tail -f log/development.log

# Or run in console to see exact error
rails console
BxBlockAssessmenttest::AssesmentTestQuestion.find_or_create_by!(sequence_number: 1) do |q|
  q.title = "Test"
end
```

---

### **Issue 4: Seeds run but questions still empty in web app**

**Problem:** Cache or wrong environment

**Solution:**
1. Verify in Rails console (not just SQL):
   ```ruby
   BxBlockAssessmenttest::AssesmentTestQuestion.count
   ```
2. Clear cache:
   ```bash
   rails tmp:clear
   ```
3. Restart server:
   ```bash
   # If using Puma
   pumactl restart
   ```
4. Check web app is pointing to correct database

---

## 📊 What Gets Seeded

### **Assessment Questions:**

**Question 1:** "In Personal Life what do you want to talk about?"
- Stress Management
- Relationship Issues
- Self-Confidence
- Life Balance
- Personal Growth

**Question 2:** "My Professional Life"
- Work-Life Balance
- Career Development
- Conflict Resolution
- Leadership Skills
- Job Satisfaction

---

## 🎯 After Seeding

### **Test in Web App:**

1. Open http://localhost:3000
2. Login with test credentials
3. You should see:
   - ✅ Question 1 with 5 radio button options
   - ✅ After selecting, Question 2 with 5 radio button options
   - ✅ Proper text labels (not empty!)

### **Test in Admin Portal:**

1. Open https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/admin
2. Login with: `jayashreev@niya.app` / `V#niya6!`
3. Navigate to **"Assesment Test Questions"**
4. You should see 2 questions listed
5. Navigate to **"Assesment Test Answers"**
6. You should see 10 answers listed

---

## 🔄 Quick Commands Reference

```bash
# Seed everything
rails db:seed

# Seed only assessment questions
rails app:seed_assessment_questions

# Clear assessment questions
rails app:clear_assessment_questions

# Reset assessment questions (clear + reseed)
rails app:reset_assessment_questions

# Verify seeds worked
rails app:verify_seed

# Check in console
rails console
BxBlockAssessmenttest::AssesmentTestQuestion.count
```

---

## ✅ Success Criteria

After running seeds, you should have:
- ✅ 2 assessment questions
- ✅ 10 assessment answers (5 per question)
- ✅ Questions have proper titles
- ✅ Answers have proper text (not empty/null)
- ✅ Sequence numbers are correct (1, 2)
- ✅ Questions show correctly in web app

---

**Status:** ✅ Ready to use!

**Recommended:** Run `rails db:seed` to seed everything at once.












