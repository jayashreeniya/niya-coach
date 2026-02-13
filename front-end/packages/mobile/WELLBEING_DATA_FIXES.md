# Well-Being Assessment Data Fixes

**Date:** December 29, 2025  
**Issue:** Incorrect score-based messages and focus areas not populating

---

## Problem Summary

1. **Wrong advice message displayed** - Score of 10 shows "significant risk" instead of "NO significant risk"
2. **Focus areas from wellbeing assessment not showing** - Low-scoring subcategories should appear in Top Focus Areas

---

## Fix 1: UserAnswerResult - Category Level (Main Score)

### Location
Admin Panel → **User Answer Results** → Filter by Category: Physical wellbeing, Subcategory: (blank/null)

### Current Data (WRONG)
| ID | Category | Subcategory | Min Score | Max Score | Advice |
|----|----------|-------------|-----------|-----------|--------|
| 1 | Physical wellbeing | — | 0 | 36 | "You have significant risk in general health & wellbeing..." |
| 2 | Physical wellbeing | — | 0 | 32 | "You have NO significant risk in general health & wellbeing..." |

**Problem:** Both have `min_score=0`, causing overlapping ranges. Score of 10 matches ID 1 first.

### Corrected Data (FIX THIS)
| ID | Category | Subcategory | Min Score | Max Score | Score Level | Advice |
|----|----------|-------------|-----------|-----------|-------------|--------|
| 1 | Physical wellbeing | — | **0** | **7** | low | "You have significant risk in general health & wellbeing in current scenario, risks in the domain of social functioning, higher risk of anxiety, depression and loss of confidence." |
| 2 | Physical wellbeing | — | **8** | **100** | high | "You have NO significant risk in general health & wellbeing in current scenario." |

---

## Fix 2: UserAnswerResult - Subcategory Level (For Focus Areas)

For focus areas to work correctly, EACH subcategory needs UserAnswerResult records with proper score ranges.

### Location
Admin Panel → **User Answer Results** → Create/Edit records for each subcategory

### Required Records for Physical Wellbeing Subcategories

**Note:** The `score_level` field determines:
- `"low"` → Adds subcategory to **Top Focus Areas**
- `"high"` → Adds subcategory to **Top Strengths**
- `"medium"` → Neither

#### Nutrition (Subcategory ID: check your database)
| Min Score | Max Score | Score Level | Advice |
|-----------|-----------|-------------|--------|
| 0 | 3 | low | "Focus on improving your nutrition habits" |
| 4 | 6 | medium | "Your nutrition is average" |
| 7 | 10 | high | "Great nutritional habits!" |

#### Balancing Energy (Subcategory ID: check your database)
| Min Score | Max Score | Score Level | Advice |
|-----------|-----------|-------------|--------|
| 0 | 3 | low | "You need to work on energy management" |
| 4 | 6 | medium | "Average energy balance" |
| 7 | 10 | high | "Excellent energy management!" |

#### Physical Activity & Exercise (Subcategory ID: check your database)
| Min Score | Max Score | Score Level | Advice |
|-----------|-----------|-------------|--------|
| 0 | 3 | low | "Increase your physical activity" |
| 4 | 6 | medium | "Moderate physical activity" |
| 7 | 10 | high | "Great physical activity levels!" |

#### Sleep (Subcategory ID: check your database)
| Min Score | Max Score | Score Level | Advice |
|-----------|-----------|-------------|--------|
| 0 | 3 | low | "Your sleep needs attention" |
| 4 | 6 | medium | "Average sleep quality" |
| 7 | 10 | high | "Excellent sleep habits!" |

#### Substance Use (Subcategory ID: check your database)
| Min Score | Max Score | Score Level | Advice |
|-----------|-----------|-------------|--------|
| 0 | 3 | low | "Consider reducing substance use" |
| 4 | 6 | medium | "Moderate concern" |
| 7 | 10 | high | "Healthy choices!" |

---

## Fix 3: WellBeingFocusArea Records

### Location
Admin Panel → **Well Being Focus Areas**

### Required Records
Each subcategory needs a WellBeingFocusArea record that links the subcategory ID to a focus area name.

**Check that these exist:**

| well_being_sub_categoryid | answers (Focus Area Name) |
|---------------------------|---------------------------|
| 1 | Nutritional Health |
| 2 | Balancing Energy |
| 3 | Physical Activity and Exercise |
| 4 | Maintaining Individuality |
| 5 | Personal Growth |
| 6 | Inner Energy |
| 7 | Positive Thinking |
| 8 | Sleep Concerns |
| 9 | Emotional regulation |
| 10 | Adaptability |
| 11 | Interpersonal Relationships |
| 12 | Goal Setting |
| ... | ... |

**Important:** The `well_being_sub_categoryid` is stored as a **STRING** (e.g., "1", "2"), not an integer.

---

## Fix 4: Verify WellBeingSubCategory IDs

### Location
Admin Panel → **Well Being Sub Categories**

### Check
Make sure the subcategory IDs match between:
1. `WellBeingSubCategory` table
2. `UserAnswerResult.subcategory_id`
3. `WellBeingFocusArea.well_being_sub_categoryid`

Example for Physical Wellbeing (category_id=2):
| ID | Sub Category Name | well_being_category_id |
|----|-------------------|------------------------|
| ? | Nutrition | 2 |
| ? | Balancing Energy | 2 |
| ? | Physical Activity & Exercise | 2 |
| ? | Sleep | 2 |
| ? | Substance Use | 2 |

---

## How the Logic Works

### For Main Category Score Display:
```ruby
# Code in GetResultSerializer
user_answer_result = UserAnswerResult.where(category_id: category.id, subcategory_id: nil)
user_answer_result.each do |uar|
  if score >= uar.min_score && score <= uar.max_score
    advice = uar.advice
    break  # First match wins!
  end
end
```

### For Focus Areas (from low subcategory scores):
```ruby
# When score_level == "low", user is added to WellBeingFocusArea.multiple_account
if score_level == "low"
  well_being_focus_area.multiple_account << user_id
  well_being_focus_area.save
end
```

### For Top Strengths (from high subcategory scores):
```ruby
# When score_level == "high", subcategory becomes a strength
if score_level == "high"
  top_strength << subcategory_name
end
```

---

## Verification Steps

After making the data fixes:

1. **Complete a Well-Being Assessment** in the app
2. **Check the Result Screen:**
   - Score ≥8 should show "NO significant risk"
   - Score <8 should show "significant risk"
3. **Go to HomePage:**
   - **Top Strengths** should show subcategories where you scored HIGH
   - **Top Focus Areas** should show subcategories where you scored LOW (plus chat-based focus areas)

---

## API Endpoints for Testing

```powershell
$token = "YOUR_TOKEN_HERE"

# Get insights (top strengths + focus areas)
Invoke-RestMethod -Uri "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_wellbeing/insights" -Headers @{token=$token} -Method GET

# Trigger result calculation
Invoke-RestMethod -Uri "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_wellbeing/get_result?value=true" -Headers @{token=$token} -Method GET

# Get user strengths
Invoke-RestMethod -Uri "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_wellbeing/user_strength" -Headers @{token=$token} -Method GET
```

---

## Summary of Admin Panel Changes Needed

| Table | Action | Details |
|-------|--------|---------|
| UserAnswerResult | **Edit** | Fix min_score/max_score for Physical wellbeing category (main) |
| UserAnswerResult | **Create** | Add records for each subcategory with low/medium/high ranges |
| WellBeingFocusArea | **Verify** | Ensure records exist for all subcategories |
| WellBeingSubCategory | **Verify** | Note down IDs for mapping |

---

## Contact
If you need help with specific IDs or SQL queries to fix the data, let me know!














