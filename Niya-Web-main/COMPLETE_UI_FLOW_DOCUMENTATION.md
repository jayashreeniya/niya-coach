# NIYa Web App - Complete UI Flow & Functional Documentation

**Date:** December 5, 2025  
**Version:** 1.0  
**Purpose:** Complete user journey and technical documentation

---

## 🎯 Application Overview

**NIYa** is a wellbeing coaching platform that:
1. Assesses users' wellbeing through personality questions
2. Identifies focus areas based on answers
3. Connects users with certified coaches
4. Facilitates appointment booking

---

## 📱 Complete User Journey

### **Page 1: Login** (`/`)

**Component:** `Login.js`  
**Route:** `/`

#### UI Elements:
```
┌─────────────────────────────────┐
│         NIYA Logo               │
│                                 │
│    Login / Register Tabs        │
│                                 │
│  ┌──────────────────────────┐  │
│  │ Email Address            │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │ Password                 │  │
│  └──────────────────────────┘  │
│                                 │
│     [ LOGIN Button ]            │
│                                 │
│     Forgot Password?            │
│                                 │
└─────────────────────────────────┘
```

#### Functionality:

**Login Tab:**
- **Inputs:**
  - Email (text field)
  - Password (password field)
- **API:** `POST /bx_block_login/logins`
- **Payload:**
```json
{
  "data": {
    "type": "email_account",
    "attributes": {
      "email": "user@example.com",
      "password": "password123"
    }
  }
}
```
- **On Success:**
  - Receives token + refresh_token
  - Stores in `localStorage.accessToken`
  - Stores user ID in `localStorage`
  - **Redirects to:** `/wellbeingquestions`

**Register Tab:**
- **Inputs:**
  - Full Name
  - Email
  - Phone Number (with country code selector)
  - Password
  - Confirm Password
  - Access Code (required: `a4Bln0g`)
- **API:** `POST /account_block/accounts`
- **On Success:**
  - Auto-login with token
  - **Redirects to:** `/wellbeingquestions`

**Forgot Password Flow:**
1. Click "Forgot Password"
2. Enter email
3. **API:** `POST /bx_block_forgot_password/otps` (sends OTP)
4. Enter OTP code
5. **API:** `POST /bx_block_forgot_password/otp_confirmations` (verifies OTP)
6. Enter new password
7. **API:** `POST /bx_block_forgot_password/forgot_password` (resets password)

---

### **Page 2: Wellbeing Assessment** (`/wellbeingquestions`)

**Component:** `Wellbeing.js`  
**Route:** `/wellbeingquestions`  
**Requires:** Valid token in localStorage

#### UI Flow - Sequential Questions

The page shows **3 sequential questions** that appear one after another:

```
┌─────────────────────────────────────────┐
│            NIYA Logo                    │
│                                         │
│   [Username], [Question Title]          │
│                                         │
│   ○ Answer Option 1                     │
│   ○ Answer Option 2                     │
│   ○ Answer Option 3                     │
│   ○ Answer Option 4                     │
│                                         │
│        (or checkboxes for Q3)           │
│                                         │
└─────────────────────────────────────────┘
```

#### Question Progression Logic:

**State Variables:**
- `radio` = false → Shows Question 1
- `radio` = true, `radio2` = false → Shows Question 2
- `radio` = true, `radio2` = true → Shows Question 3+

---

#### **Question 1: Personal Life (Radio Buttons)**

**Component:** `App()` (internal function)  
**Input Type:** Radio buttons (single select)  
**Data Source:** `answers1` array from `Attributesquestion1`

**UI:**
```
┌─────────────────────────────────────────┐
│   jayashree venkataraman, Personal Life │
│                                         │
│   ○ Answer 1                            │
│   ○ Answer 2                            │
│   ○ Answer 3                            │
│                                         │
└─────────────────────────────────────────┘
```

**Functionality:**
- User clicks a radio button
- Calls `selectwellbeingQuestion1(answerId)`
- Sets `radio = true` (triggers Question 2 to show)
- **No API call** - just moves to next question

**Code:**
```javascript
<input
  type="radio"
  name="question1"
  value={user.id}
  onClick={(e) => selectwellbeingQuestion1(e.target.value)}
/>
<span>{user.answers}</span>
```

---

#### **Question 2: Professional Life (Radio Buttons)**

**Component:** `App2()` (internal function)  
**Input Type:** Radio buttons (single select)  
**Data Source:** `answers2` array from `Attributesquestion2`

**UI:**
```
┌─────────────────────────────────────────┐
│ jayashree venkataraman, Professional Life│
│                                         │
│   ○ Conflict Resolution                 │
│   ○ Work-Life Balance                   │
│   ○ Career Development                  │
│                                         │
└─────────────────────────────────────────┘
```

**Functionality:**
- User clicks a radio button
- Calls `selectwellbeingQuestion2(answerId, questionId)`
- **API Call:** `POST /bx_block_assessmenttest/choose_answers`
- **Payload:**
```json
{
  "sequence_number": 2,
  "question_id": "[questionId]",
  "answer_id": "[answerId]"
}
```
- **On Success:**
  - Response contains `upcoming_question` and `upcoming_answers`
  - Sets `radio2 = true` (triggers Question 3 to show)
  - Stores next question data for Question 3

**Expected Response:**
```json
{
  "data": {
    "attributes": {
      "assesment_test_answer": {...},
      "assesment_test_question": {...},
      "upcoming_question": {...},
      "upcoming_answers": [...]
    }
  }
}
```

---

#### **Question 3+: Focus Areas (Checkboxes)**

**Component:** `App3()` (internal function)  
**Input Type:** Checkboxes (multi-select, max 3)  
**Data Source:** `upcoming_answers` array

**UI:**
```
┌─────────────────────────────────────────┐
│  jayashree venkataraman, [Question Text]│
│                                         │
│   ☐ Focus Area 1                        │
│   ☐ Focus Area 2                        │
│   ☐ Focus Area 3                        │
│   ☐ Focus Area 4                        │
│                                         │
│         [ SUBMIT Button ]               │
│                                         │
└─────────────────────────────────────────┘
```

**Functionality:**
- User selects 1-3 checkboxes
- Calls `handleCheckboxChange(answerId)` on each click
- Stores selected IDs in `checked` array
- User clicks **SUBMIT**
- Calls `SUBMITANSWERS()`
- **API Call:** `POST /bx_block_assessmenttest/select_answers`
- **Payload:**
```json
{
  "question_id": "[questionId]",
  "answer_ids": [1, 2, 3]
}
```
- **On Success:**
  - Assessment complete
  - **Redirects to:** `/bookappointment`

**Validation:**
- ~~Must select at least 1 answer~~ (currently disabled)
- ~~Can select maximum 3 answers~~ (currently disabled)

**Code:**
```javascript
<input
  type="checkbox"
  value={user.id}
  checked={checked.includes(user.id)}
  onChange={() => handleCheckboxChange(user.id)}
/>
<span>{user.answers}</span>
```

---

### **Page 3: Book Appointment** (`/bookappointment`)

**Component:** `Bookappointment.js`  
**Route:** `/bookappointment`  
**Requires:** Valid token + completed assessment

#### UI Layout:

```
┌─────────────────────────────────────────┐
│            NIYA Logo                    │
│                                         │
│     Focus Areas You Selected            │
│      * Focus Area 1                     │
│      * Focus Area 2                     │
│      * Focus Area 3                     │
│                                         │
│      Book An Appointment                │
│      ○ Book 60 min                      │
│                                         │
│   Date    Hour    Minute                │
│  [📅]    [▼09]   [▼00]                  │
│                                         │
│  ┌────────────────────────────────┐    │
│  │  Coach Card 1                  │    │
│  │  Name: Dr. Smith               │    │
│  │  Education: PhD Psychology     │    │
│  │  Specialization: Anxiety, ...  │    │
│  │  ⭐ 4.0  📍 Mumbai  🗣️ English │    │
│  │  [ Schedule a call ]           │    │
│  └────────────────────────────────┘    │
│                                         │
│  ┌────────────────────────────────┐    │
│  │  Coach Card 2                  │    │
│  │  ...                           │    │
│  └────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

#### Functionality:

**1. Load Focus Areas**
- **API:** `POST /bx_block_assessmenttest/focus_areas`
- **On Load:** Displays the 3 focus areas user selected
- **Response:**
```json
{
  "data": {
    "attributes": {
      "assesment_test_type_answers": [
        {"id": 1, "answers": "Stress Management"},
        {"id": 2, "answers": "Work-Life Balance"},
        {"id": 3, "answers": "Career Development"}
      ]
    }
  }
}
```

**2. Select Date & Time**
- User picks date (calendar picker)
- User selects hour (dropdown: 00-23)
- User selects minute (dropdown: 00, 15, 30, 45)
- **Triggers:** `view_coach_availability` API call

**3. View Available Coaches**
- **API:** `GET /bx_block_calendar/booked_slots/view_coach_availability?booking_date=[dd/mm/yyyy]`
- **Response:** List of available coaches with:
  - Photo
  - Full name
  - Education
  - Expertise/Specializations
  - Rating
  - City
  - Languages spoken

**4. Book Coach**
- User clicks "Schedule a call" on a coach card
- **Validates:**
  - Date is selected
  - Time is selected
- **API:** `POST /bx_block_calendar/booked_slots`
- **Payload:**
```json
{
  "start_time": "09:00",
  "end_time": "10:00",
  "service_provider_id": 123,
  "booking_date": "05/12/2025"
}
```
- **On Success:**
  - Stores booking details in localStorage
  - Shows confirmation popup
  - **Redirects to:** Razorpay payment page

**5. Confirmation Popup**
```
┌─────────────────────────────────────────┐
│     Appointment Confirmed               │
│                                         │
│  Confirmed appointment with coach       │
│  Dr. Smith on 05/12/2025 09:00 to 10:00│
│                                         │
│  Please note: To reschedule your       │
│  session, you need to cancel the       │
│  booked session and book new session.  │
│  Booked session can only be cancelled  │
│  24 hours prior to scheduled time.     │
│                                         │
│  For the session with the expert       │
│  please download our niya wellbeing    │
│  app from playstore and app store.     │
│                                         │
│  Thank You!                            │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔧 Technical Implementation

### **State Management**

#### Wellbeing Component States:
```javascript
const [loginusername, setLoginUserName] = useState("");
const [Attributesquestion1, setAttributesquestion1] = useState("");
const [Attributesquestion2, setAttributesquestion2] = useState("");
const [answers1, setAnswers1] = useState("");
const [answers2, setAnswers2] = useState("");
const [radio, setRadio] = useState(false);      // Controls Q1 → Q2
const [radio2, setRadio2] = useState(false);    // Controls Q2 → Q3
const [apiloaded1, setApiloaded1] = useState(false);
const [checked, setChecked] = useState([]);     // Checkbox selections
const [upcoming_question, setUpcoming_question] = useState("");
const [upcoming_answers, setUpcoming_answers] = useState("");
```

#### Book Appointment States:
```javascript
const [Focusareas, setFocusareas] = useState([]);
const [apiloaded, setApiloaded] = useState(false);
const [value, onChange] = useState(new Date());
const [selectvalue1, setSelectvalue1] = useState(""); // Hour
const [selectvalue2, setSelectvalue2] = useState(""); // Minute
const [coachlist, setCoachlist] = useState([]);
const [selecteddate, setSetdate] = useState("");
const [visibility, setVisibility] = useState(false); // Popup
```

---

### **API Endpoints Summary**

| Endpoint | Method | Purpose | Page |
|----------|--------|---------|------|
| `/bx_block_login/logins` | POST | User login | Login |
| `/account_block/accounts` | POST | Registration | Login |
| `/bx_block_forgot_password/otps` | POST | Send OTP | Login |
| `/bx_block_forgot_password/otp_confirmations` | POST | Verify OTP | Login |
| `/bx_block_assessmenttest/personality_test_questions` | GET | Get questions | Wellbeing |
| `/bx_block_assessmenttest/choose_answers` | POST | Submit Q2 answer | Wellbeing |
| `/bx_block_assessmenttest/select_answers` | POST | Submit Q3+ answers | Wellbeing |
| `/bx_block_assessmenttest/focus_areas` | POST | Get focus areas | Booking |
| `/bx_block_calendar/booked_slots/view_coach_availability` | GET | Get coaches | Booking |
| `/bx_block_calendar/booked_slots` | POST | Book appointment | Booking |
| `/bx_block_calendar/booked_slots/cancel_booking` | POST | Cancel booking | Booking |

---

### **LocalStorage Data**

| Key | Value | Set On |
|-----|-------|--------|
| `accessToken` | JWT token | Login success |
| `refreshToken` | Refresh token | Login success |
| `userId` | User ID | Login success |
| `fullname` | User's full name | Login success |
| `coachname` | Booking details | Booking success |
| `coachbooked` | Boolean | Booking success |
| `booksloatid` | Booking slot ID | Booking success |
| `onlycoachname` | Coach name | Booking success |
| `selecteddate` | Date of booking | Booking success |
| `starttime` | Start time | Booking success |
| `endtime` | End time | Booking success |

---

## 🎨 UI Components Used

### External Libraries:
- **React Router** - Page navigation
- **React Bootstrap** - UI components (Button, Card, Col)
- **react-date-picker** - Date selection
- **react-select** - Dropdown selects
- **react-otp-input** - OTP input
- **react-phone-number-input** - Phone number input
- **emailjs-com** - Email notifications
- **axios** - HTTP requests (some endpoints)

### Custom Components:
- `CustomPopup` - Modal/popup for alerts
- `CustomPopup2` - Booking confirmation popup
- `Media` - Coach profile layout
- `Avatar` - Coach profile picture
- `Text` - Typography component

---

## 🔄 Navigation Flow

```
┌─────────┐
│  START  │
└────┬────┘
     │
     ▼
┌─────────────┐      Login Success      ┌────────────────────┐
│   Login     ├────────────────────────>│  Wellbeing Q1      │
│    (/)      │                         │ /wellbeingquestions│
└─────────────┘                         └──────────┬─────────┘
     │                                              │
     │ Register                                     │ Select Answer
     └─────────────────────────────────────────────┘
                                                    │
                                                    ▼
                                         ┌────────────────────┐
                                         │  Wellbeing Q2      │
                                         │ /wellbeingquestions│
                                         └──────────┬─────────┘
                                                    │
                                                    │ Select Answer (API call)
                                                    ▼
                                         ┌────────────────────┐
                                         │  Wellbeing Q3+     │
                                         │ /wellbeingquestions│
                                         └──────────┬─────────┘
                                                    │
                                                    │ Submit (API call)
                                                    ▼
                                         ┌────────────────────┐
                                         │  Book Appointment  │
                                         │  /bookappointment  │
                                         └──────────┬─────────┘
                                                    │
                                                    │ Book Coach (API call)
                                                    ▼
                                         ┌────────────────────┐
                                         │  Payment (Razorpay)│
                                         │  External Link     │
                                         └────────────────────┘
```

---

## ⚠️ Current Issues & Database Problems

### **Critical Issue: Incomplete Database**

The application cannot function properly because the database has:

1. **❌ Only 1 question** ("Personal life")
2. **❌ Empty answer options** (answers = "" or null)
3. **❌ No proper assessment flow data**

**Impact:**
- Questions don't display properly
- Answer text is blank/empty
- Users see checkboxes with no labels
- Cannot complete assessment flow

### **What's Missing:**

```sql
-- Need to populate:
-- 1. Assessment Test Questions table
INSERT INTO assesment_test_questions (title, sequence_number, created_at, updated_at)
VALUES 
  ('Personal life', 1, NOW(), NOW()),
  ('My Professional Life', 2, NOW(), NOW()),
  ('Focus Areas', 3, NOW(), NOW());

-- 2. Assessment Test Answers table
INSERT INTO assesment_test_answers (assesment_test_question_id, answers, created_at, updated_at)
VALUES
  (1, 'Stress Management', NOW(), NOW()),
  (1, 'Relationship Issues', NOW(), NOW()),
  (1, 'Personal Growth', NOW(), NOW()),
  (2, 'Work-Life Balance', NOW(), NOW()),
  (2, 'Career Development', NOW(), NOW()),
  (2, 'Conflict Resolution', NOW(), NOW());

-- 3. Assessment Test Type Answers (for checkboxes)
-- Similar structure for multiple choice questions
```

---

## 📝 User Experience Summary

### **Expected Flow (When Database is Populated):**

1. **User visits site** → Sees login page
2. **User logs in** → Token stored, redirected
3. **Wellbeing Assessment begins:**
   - **Q1**: "Hi [Name], tell us about your Personal life"
   - Shows 3-5 radio options about personal wellbeing
   - User selects one → Next question appears
   
   - **Q2**: "Hi [Name], tell us about your Professional Life"
   - Shows 3-5 radio options about work life
   - User selects one → API call → Next question appears
   
   - **Q3**: "Hi [Name], what would you like to talk about today?"
   - Shows multiple checkboxes (focus areas)
   - User selects up to 3 → Clicks SUBMIT → API call
   
4. **Focus Areas displayed** → "You selected: X, Y, Z"
5. **Coach selection** → User sees available coaches
6. **Booking** → Select date/time, click coach
7. **Payment** → Redirect to payment gateway
8. **Confirmation** → Success message with booking details

---

## 🚀 Recommendations

### **Immediate Fixes Needed:**

1. **✅ DONE** - Fixed CSRF protection on all API endpoints
2. **✅ DONE** - Fixed null pointer errors in Wellbeing component
3. **✅ DONE** - Updated all API URLs to Azure backend
4. **⏳ TODO** - Populate database with proper questions and answers
5. **⏳ TODO** - Test complete flow end-to-end
6. **⏳ TODO** - Add error boundaries for better error handling

### **Future Enhancements:**

1. Loading indicators during API calls
2. Better validation messages
3. Progress indicator for assessment (1/3, 2/3, 3/3)
4. "Back" button to review previous answers
5. Save partial progress (resume later)
6. Mobile-responsive improvements

---

## 📞 Support Information

### **For Testing:**
- **Test Email:** `jayashreev@niya.app`
- **Test Password:** `V#niya6!`
- **Access Code:** `a4Bln0g`

### **Known Working Features:**
- ✅ Login
- ✅ Registration
- ✅ API connectivity
- ✅ Token-based authentication

### **Known Issues:**
- ⚠️ Database has incomplete question/answer data
- ⚠️ Cannot complete full assessment flow
- ⚠️ Checkbox labels appear empty

---

**End of Documentation**

**Last Updated:** December 5, 2025  
**Status:** Backend APIs fixed ✅ | Database needs population ⏳



