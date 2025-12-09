# Code Walkthrough: How Questions Are Asked

**File:** `NIYa-web-main/src/components/login/Wellbeing.js`  
**Purpose:** Shows how the wellbeing assessment questions are fetched and displayed

---

## 📊 Overview

The component uses **conditional rendering** with state flags to show questions sequentially:

```
radio = false        → Show Question 1
radio = true         → Show Question 2
radio2 = true        → Show Question 3+
```

---

## 🔄 Complete Flow

### **Step 1: Load Questions from API (Lines 237-296)**

When the component loads, it fetches all questions from the backend:

```javascript
// Line 237: API endpoint for getting questions
var apiBaseUrl4 = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_assessmenttest/personality_test_questions"

const payload4 = {
  method: "GET",
  headers: {
    'Content-Type': 'application/json;',
    'accept': 'application/json',
    "token": ""+token+""
  }
};

// Line 251: Fetch questions
fetch(apiBaseUrl4, payload4)
  .then(response => response.json())
  .then((data) => { 
    console.log("Personality questions received:", data);
    
    setApiloaded1(true);
    
    // Line 271: Parse the response and store questions
    if(data.data && data.data.length > 0) {
        data.data.forEach(question => {
            if(question.attributes) {
                // Store Question 1
                if(question.attributes.sequence_number === 1){
                    setAttributesquestion1(question.attributes);
                    setAnswers1(question.attributes.answers || [])
                }
                // Store Question 2
                if(question.attributes.sequence_number === 2){
                    setAttributesquestion2(question.attributes);
                    setAnswers2(question.attributes.answers || [])
                }
            }
        });
    }
  })
```

**API Response Format:**
```json
{
  "data": [
    {
      "id": "1",
      "type": "assesment_test_question",
      "attributes": {
        "title": "In Personal Life what do you want to talk about?",
        "sequence_number": 1,
        "answers": [
          {"id": 1, "answers": "Stress Management", "title": "Stress Management"},
          {"id": 2, "answers": "Relationship Issues", "title": "Relationship Issues"},
          ...
        ]
      }
    },
    {
      "id": "2",
      "attributes": {
        "title": "My Professional Life",
        "sequence_number": 2,
        "answers": [...]
      }
    }
  ]
}
```

---

### **Step 2: Display Questions Conditionally (Lines 409-461)**

The return statement uses nested conditionals to show one question at a time:

```javascript
return (
  <div style={{"textAlign":"center"}}>
    {/* Logo */}
    <img src={Logo} alt="logo" />
    
    {/* CONDITIONAL RENDERING BASED ON STATE */}
    
    {!radio ? (
      // ============================================
      // QUESTION 1: Shows when radio = false
      // ============================================
      <div>
        <div className="col-md-12" style={{"display":"inline-flex","width":"100%"}}>
          <div className="col-md-4"><label></label></div>
          <div className="col-md-6" style={{ "textAlign": "left" }}>
            {/* 👆 THIS IS WHERE QUESTION 1 TEXT SHOWS */}
            <span style={{"fontSize":20}}>
              {loginusername}, {Attributesquestion1.title}
            </span>
          </div>
        </div>
        {/* 👇 THIS IS WHERE QUESTION 1 ANSWERS SHOW */}
        <App />  {/* Radio buttons component */}
      </div>
      
    ) : (
      // ============================================
      // When radio = true, check radio2
      // ============================================
      <div>
        {!radio2 ? (
          // ============================================
          // QUESTION 2: Shows when radio = true, radio2 = false
          // ============================================
          <div>
            <div className="col-md-12" style={{"display":"inline-flex","width":"100%"}}>
              <div className="col-md-4"><label></label></div>
              <div className="col-md-6" style={{ "textAlign": "left" }}>
                {/* 👆 THIS IS WHERE QUESTION 2 TEXT SHOWS */}
                <span style={{"fontSize":20}}>
                  {loginusername}, {Attributesquestion2.title}
                </span>
              </div>
            </div>
            {/* 👇 THIS IS WHERE QUESTION 2 ANSWERS SHOW */}
            <App2 />  {/* Radio buttons component */}
          </div>
          
        ) : (
          // ============================================
          // QUESTION 3+: Shows when radio = true, radio2 = true
          // ============================================
          <div>
            <div className="col-md-12" style={{"display":"inline-flex","width":"100%"}}>
              <div className="col-md-4"><label></label></div>
              <div className="col-md-6" style={{ "textAlign": "left" }}>
                {/* 👆 THIS IS WHERE QUESTION 3+ TEXT SHOWS */}
                <span style={{"fontSize":20}}>
                  {loginusername}, {upcoming_question && upcoming_question.title ? upcoming_question.title : ''}
                </span>
              </div>
            </div>
            {/* 👇 THIS IS WHERE QUESTION 3+ ANSWERS SHOW */}
            <App3 />  {/* Checkboxes component */}
          </div>
        )}
      </div>
    )}
    
  </div>
);
```

---

## 🎨 Question Display Components

### **App() Component - Question 1 Radio Buttons (Lines 303-329)**

```javascript
function App() {
  return (
    <div>
      {/* Map through answers1 array */}
      {answers1 && answers1.map && answers1.map((user, index) => (
        <div className="col-md-12" style={{"display":"inline-flex","width":"100%"}}>
          <div className="col-md-4"><label></label></div>
          <div className="col-md-6" style={{ "textAlign": "left" }}>
            <label>
              {/* 👇 RADIO BUTTON */}
              <input
                type="radio"
                name="question1"
                value={user.id}
                onClick={(e) => selectwellbeingQuestion1(e.target.value)}
              />
              {/* 👇 ANSWER TEXT */}
              <span style={{ "paddingLeft": 10 }}>{user.answers}</span>
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
```

**What it displays:**
```
jayashree venkataraman, In Personal Life what do you want to talk about?

○ Stress Management
○ Relationship Issues
○ Self-Confidence
○ Life Balance
○ Personal Growth
```

**When user clicks:**
- Calls `selectwellbeingQuestion1(answerId)`
- Sets `radio = true`
- Question 2 appears

---

### **App2() Component - Question 2 Radio Buttons (Lines 332-359)**

```javascript
function App2() {
  return (
    <div>
      {/* Map through answers2 array */}
      {answers2 && answers2.map && answers2.map((user, index) => (
        <div className="col-md-12" style={{"display":"inline-flex","width":"100%"}}>
          <div className="col-md-4"><label></label></div>
          <div className="col-md-6" style={{ "textAlign": "left" }}>
            <ul>
              <li style={{"marginBottom":10}}>
                <label>
                  {/* 👇 RADIO BUTTON */}
                  <input
                    type="radio"
                    name="question2"
                    value={user.id}
                    onClick={(e) => selectwellbeingQuestion2(e.target.value, Attributesquestion2.id)}
                  />
                  {/* 👇 ANSWER TEXT */}
                  <span style={{"paddingLeft":10}}>{user.answers}</span>
                </label>
              </li>
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
```

**What it displays:**
```
jayashree venkataraman, My Professional Life

○ Work-Life Balance
○ Career Development
○ Conflict Resolution
○ Leadership Skills
○ Job Satisfaction
```

**When user clicks:**
- Calls `selectwellbeingQuestion2(answerId, questionId)`
- Makes API call to save answer
- Response contains next question
- Sets `radio2 = true`
- Question 3 appears

---

### **App3() Component - Question 3+ Checkboxes (Lines 361-407)**

```javascript
function App3() {
  return (
    <div>
      {/* Map through upcoming_answers or answers1 array */}
      {(upcoming_answers || answers1 || answers2 || []).map && 
       (upcoming_answers || answers1 || answers2 || []).map((user, index) => (
        <div className="col-md-12" style={{"display":"inline-flex","width":"100%"}}>
          <div className="col-md-4"><label></label></div>
          <div className="col-md-6" style={{ "textAlign": "left" }}>
            <ul>
              <li style={{"marginBottom":10}}>
                <label>
                  {/* 👇 CHECKBOX (multi-select) */}
                  <input
                    type="checkbox"
                    value={user.id}
                    checked={checked.includes(user.id)}
                    onChange={() => handleCheckboxChange(user.id)}
                  />
                  {/* 👇 ANSWER TEXT */}
                  <span style={{"paddingLeft":10}}>{user.answers}</span>
                </label>
              </li>
            </ul>
          </div>
        </div>
      ))}
      
      {/* 👇 SUBMIT BUTTON */}
      <Button 
        className="" 
        variant="primary" 
        style={{"width":200,"marginBottom":100}} 
        type="submit" 
        onClick={SUBMITANSWERS}
      >
        SUBMIT
      </Button>
    </div>
  );
}
```

**What it displays:**
```
jayashree venkataraman, [Question 3 Title]

☐ Answer Option 1
☐ Answer Option 2
☐ Answer Option 3
☐ Answer Option 4
☐ Answer Option 5

      [SUBMIT]
```

**When user clicks SUBMIT:**
- Calls `SUBMITANSWERS()`
- Makes API call to save selected answers
- Redirects to `/bookappointment`

---

## 📝 The "What would you like to talk about" Text

**This comes from the Question Title field in the database!**

### **Line 421: Question 1**
```javascript
<span style={{"fontSize":20}}>
  {loginusername}, {Attributesquestion1.title}
</span>
```
**Displays:** "jayashree venkataraman, In Personal Life what do you want to talk about?"

### **Line 435: Question 2**
```javascript
<span style={{"fontSize":20}}>
  {loginusername}, {Attributesquestion2.title}
</span>
```
**Displays:** "jayashree venkataraman, My Professional Life"

### **Line 449: Question 3+**
```javascript
<span style={{"fontSize":20}}>
  {loginusername}, {upcoming_question.title}
</span>
```
**Displays:** "jayashree venkataraman, [Whatever the next question title is]"

---

## 🎯 Key Variables

| Variable | Contains | Set By |
|----------|----------|--------|
| `loginusername` | User's full name | Profile API (line 220) |
| `Attributesquestion1` | Question 1 data | Personality questions API (line 275) |
| `Attributesquestion2` | Question 2 data | Personality questions API (line 279) |
| `upcoming_question` | Next question data | Question 2 answer API response (line 155) |
| `answers1` | Question 1 answer options | Personality questions API (line 276) |
| `answers2` | Question 2 answer options | Personality questions API (line 280) |
| `upcoming_answers` | Question 3+ answer options | Question 2 answer API response (line 156) |
| `radio` | Controls Q1 → Q2 transition | Set to true when Q1 answered |
| `radio2` | Controls Q2 → Q3 transition | Set to true when Q2 answered |
| `checked` | Selected checkboxes for Q3 | Updated by `handleCheckboxChange()` |

---

## 🔄 Complete Flow Diagram

```
Component Mounts
     ↓
Load Profile Details (GET /profile_details)
  → Sets loginusername
     ↓
Load Personality Questions (GET /personality_test_questions)
  → Sets Attributesquestion1 (sequence 1)
  → Sets answers1 (answer options)
  → Sets Attributesquestion2 (sequence 2)
  → Sets answers2 (answer options)
     ↓
RENDER: Show Question 1
  Display: "{loginusername}, {Attributesquestion1.title}"
  Display: Radio buttons from answers1 array
     ↓
User Clicks Radio Button
  → Calls selectwellbeingQuestion1(answerId)
  → Sets radio = true
     ↓
RENDER: Show Question 2
  Display: "{loginusername}, {Attributesquestion2.title}"
  Display: Radio buttons from answers2 array
     ↓
User Clicks Radio Button  
  → Calls selectwellbeingQuestion2(answerId, questionId)
  → Makes API call: POST /bx_block_assessmenttest/choose_answers
  → Response contains upcoming_question and upcoming_answers
  → Sets radio2 = true
     ↓
RENDER: Show Question 3+
  Display: "{loginusername}, {upcoming_question.title}"
  Display: Checkboxes from upcoming_answers array
     ↓
User Selects Checkboxes (1-3)
  → Updates checked array
     ↓
User Clicks SUBMIT
  → Calls SUBMITANSWERS()
  → Makes API call: POST /bx_block_assessmenttest/select_answers
  → On success: navigate to /bookappointment
```

---

## 💻 Key Code Sections

### **1. Question Text Display (Lines 421, 435, 449)**

```javascript
// Question 1 Text
<span style={{"fontSize":20}}>
  {loginusername}, {Attributesquestion1.title}
</span>
// Example output: "jayashree venkataraman, In Personal Life what do you want to talk about?"

// Question 2 Text
<span style={{"fontSize":20}}>
  {loginusername}, {Attributesquestion2.title}
</span>
// Example output: "jayashree venkataraman, My Professional Life"

// Question 3+ Text
<span style={{"fontSize":20}}>
  {loginusername}, {upcoming_question.title}
</span>
// Example output: "jayashree venkataraman, What are your focus areas?"
```

---

### **2. Answer Options Display (Lines 309-325, 337-357, 366-398)**

**Question 1 - Radio Buttons:**
```javascript
{answers1 && answers1.map && answers1.map((user, index) => (
  <label>
    <input
      type="radio"
      name="question1"
      value={user.id}
      onClick={(e) => selectwellbeingQuestion1(e.target.value)}
    />
    <span style={{ "paddingLeft": 10 }}>{user.answers}</span>
  </label>
))}
```

**Question 2 - Radio Buttons:**
```javascript
{answers2 && answers2.map && answers2.map((user, index) => (
  <label>
    <input
      type="radio"
      name="question2"
      value={user.id}
      onClick={(e) => selectwellbeingQuestion2(e.target.value, Attributesquestion2.id)}
    />
    <span style={{"paddingLeft":10}}>{user.answers}</span>
  </label>
))}
```

**Question 3+ - Checkboxes:**
```javascript
{(upcoming_answers || answers1 || answers2 || []).map((user, index) => (
  <label>
    <input
      type="checkbox"
      value={user.id}
      checked={checked.includes(user.id)}
      onChange={() => handleCheckboxChange(user.id)}
    />
    <span style={{"paddingLeft":10}}>{user.answers}</span>
  </label>
))}
```

---

### **3. User Interaction Handlers**

**Question 1 Handler (Line 28-33):**
```javascript
const selectwellbeingQuestion1 = async (event) => {
  setRadio(true);  // This triggers Question 2 to show
  console.log(radio);
}
```

**Question 2 Handler (Line 125-199):**
```javascript
const selectwellbeingQuestion2 = async (event1, event2) => {
  // event1 = answer_id
  // event2 = question_id
  
  var apiBaseUrl3 = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_assessmenttest/choose_answers"
  
  const payload3 = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json;',
      'accept': 'application/json',
      "token": ""+token+""
    },
    body: JSON.stringify({
      "sequence_number": 2,
      "question_id": ""+event2+"",
      "answer_id": ""+event1+""
    })
  };

  fetch(apiBaseUrl3, payload3)
    .then(response => response.json())
    .then((data) => { 
      setApiloaded1(true);
      
      // Store the upcoming question data from API response
      setAssesment_test_answer(data.data.attributes.assesment_test_answer);
      setAssesment_test_question(data.data.attributes.assesment_test_question);
      setUpcoming_question(data.data.attributes.upcoming_question);
      setUpcoming_answers(data.data.attributes.upcoming_answers);
      
      setRadio2(true);  // This triggers Question 3 to show
    })
}
```

**Question 3+ Handler (Line 35-92):**
```javascript
const SUBMITANSWERS = async (event) => {
  // Get current question (could be from any source)
  const currentQuestion = upcoming_question || Attributesquestion1 || Attributesquestion2;
  
  if (!currentQuestion || !currentQuestion.id) {
    alert("Question data is not available. Please refresh and try again.");
    return;
  }
  
  var apiBaseUrl3 = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_assessmenttest/select_answers"
  
  const payload3 = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json;',
      'accept': 'application/json',
      "token": ""+token+""
    },
    body: JSON.stringify({
      "question_id": currentQuestion.id,
      "answer_ids": checked  // Array of selected checkbox IDs
    })
  };

  fetch(apiBaseUrl3, payload3)
    .then(response => response.json())
    .then((data) => { 
      // On success, redirect to booking page
      navigate('/bookappointment');
    })
}
```

**Checkbox Change Handler (Line 99-122):**
```javascript
const handleCheckboxChange = (checkboxId) => {
  setChecked((prev) => {
    const isChecked = checked.includes(checkboxId);
    if (isChecked) {
      // Uncheck: remove from array
      return checked.filter((item) => item !== checkboxId);
    } else {
      // Check: add to array
      return [...prev, checkboxId];
    }
  });
}
```

---

## 🎯 Where the Welcome Message Comes From

### **The Personalized Greeting:**

```javascript
{loginusername}, {Attributesquestion1.title}
```

**Breakdown:**
- `loginusername` → User's full name (e.g., "jayashree venkataraman")
- `, ` → Comma separator
- `Attributesquestion1.title` → Question text from database

**Example Output:**
```
jayashree venkataraman, In Personal Life what do you want to talk about?
```

**So the "what would you like to talk about today" text IS the question title from the database!**

---

## 🐛 Why It's Not Working Now

### **Current Database State:**
```json
{
  "id": "1",
  "attributes": {
    "title": "Personal life",  // ✅ Has title
    "sequence_number": 1,
    "answers": [
      {
        "id": 1,
        "answers": "",  // ❌ EMPTY!
        "title": null   // ❌ NULL!
      }
    ]
  }
}
```

### **What You See:**
```
jayashree venkataraman, Personal life

○ [empty text]
```

### **What You Should See:**
```
jayashree venkataraman, In Personal Life what do you want to talk about?

○ Stress Management
○ Relationship Issues
○ Self-Confidence
○ Life Balance
○ Personal Growth
```

---

## ✅ Solution Summary

**You need to add:**
1. ✅ Proper question titles (e.g., "In Personal Life what do you want to talk about?")
2. ✅ Answer options with text (e.g., "Stress Management", "Relationship Issues")

**Two ways to do this:**
1. **Admin Portal:** https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/admin/niya_chat_boards (NOT test_types!)
2. **Seed Files:** Run `rails app:seed_assessment_questions`

---

**The code is all there and working! It just needs the proper data in the database.** 🎯


