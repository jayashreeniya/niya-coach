# Quick Seed Instructions for Assessment Questions

## Problem
The rake task `seed_complete_assessment` doesn't exist in Azure yet because we just created it. We have two options:

## Option 1: Use SQL Script (FASTEST - 2 minutes) ⚡

### Step 1: Open Azure Portal
1. Go to: https://portal.azure.com
2. Navigate to your MySQL database
3. Open "Query editor"

### Step 2: Run SQL Script
1. Copy entire contents of `back-end/db/complete_assessment_seed.sql`
2. Paste into Query editor
3. Click "Run"

### Step 3: Verify
Run these queries to check:
```sql
SELECT COUNT(*) FROM assesment_test_questions;  -- Should be 2
SELECT COUNT(*) FROM assesment_test_answers WHERE assesment_test_question_id IN (1,2);  -- Should be 10
SELECT COUNT(*) FROM assesment_test_types;  -- Should be 5
SELECT COUNT(*) FROM assesment_test_type_answers;  -- Should be 25
```

## Option 2: Deploy New Rake Task (SLOWER - 15 minutes) 🐢

### Step 1: Build and Push
```bash
cd back-end
docker build -t <your-registry>/niya-backend:seed-v1 -f Dockerfile.deploy .
docker push <your-registry>/niya-backend:seed-v1
```

### Step 2: Update Container
```bash
az containerapp update \
  --name niya-admin-app-india \
  --resource-group niya-rg \
  --image <your-registry>/niya-backend:seed-v1
```

### Step 3: Run Rake Task
```bash
az containerapp exec \
  --name niya-admin-app-india \
  --resource-group niya-rg \
  --command "bundle exec rails app:seed_complete_assessment RAILS_ENV=production"
```

## Option 3: Add to db/seeds.rb and run rails db:seed (MEDIUM - 5 minutes)

I can update the existing seeds.rb file with the seed logic.

---

## Recommendation: Use Option 1 (SQL Script) NOW
Then we can test the web app immediately!

After testing, we'll fix the admin panel for custom questions.





