# Email Testing Guide - December 9, 2025

**Backend Status:** ✅ DEPLOYED with Microsoft 365 SMTP  
**Frontend Status:** ✅ Running on localhost:3000  
**Email Service:** Microsoft 365 (hello@niya.app)

---

## 🎯 Complete Test Flow

### Step 1: Start Frontend (if not running)
```bash
cd NIYa-web-main
npm start
```
**Should open:** http://localhost:3000

### Step 2: Login
- **URL:** http://localhost:3000
- **Email:** jayshv@hotmail.com
- **Password:** [your password]

### Step 3: Complete Assessment
1. **Question 1:** Select any option (radio button)
2. **Question 2:** Select any option (radio button)
3. **Question 3:** Select UP TO 3 options (checkboxes)
   - Self Confidence
   - Anxiety
   - Stress
4. Click **SUBMIT**

### Step 4: Book Appointment
1. **Select Date:** 12/12/2025 (or any future date)
2. **Select Time:** 11:00 (or any available time)
3. **Coach appears:** Noreen Choudhary (or other available coach)
4. Click **"Schedule a Call"**

### Step 5: Payment (Razorpay)
- You'll be redirected to Razorpay
- **Test Mode:** Just click "Done" (no actual payment needed)
- **Production Mode:** Complete payment

### Step 6: Verify Return & Popup
**Expected:**
- ❌ **Will redirect to:** `https://www.niya.app/booking/bookappointment`
- ❌ **Will show:** 404 Page Not Found
- ❌ **Popup won't appear** (because React app not on production domain)

**Why?** Frontend is only on localhost, not deployed to niya.app yet.

---

## 📧 Email Verification

### Check Your Inbox: jayshv@hotmail.com

**You should receive:**
- **Subject:** "Your Appointment with Niya is Confirmed!"
- **From:** hello@niya.app
- **Content:**
  - Coach name
  - Date & time
  - Meeting code
  - Instructions

### Check Coach Inbox: noreen@gmail.com (or coach's email)

**Coach should receive:**
- **Subject:** "New Appointment Booked - Niya"
- **From:** hello@niya.app
- **Content:**
  - Client name (jayashree venkataraman)
  - Date & time
  - Meeting code

---

## 🔍 Verify Booking in Database

Run this SQL query in Azure MySQL:

```sql
SELECT 
    bs.id,
    bs.booking_date,
    bs.start_time,
    bs.end_time,
    u.full_name as user_name,
    u.email as user_email,
    c.full_name as coach_name,
    c.email as coach_email,
    bs.meeting_code,
    bs.created_at
FROM bx_block_appointment_management_booked_slots bs
LEFT JOIN accounts u ON bs.service_user_id = u.id
LEFT JOIN accounts c ON bs.service_provider_id = c.id
ORDER BY bs.id DESC
LIMIT 3;
```

**Expected:** Latest booking should show:
- ✅ Your name and email
- ✅ Coach name and email
- ✅ Correct date and time
- ✅ Meeting code generated
- ✅ created_at timestamp

---

## 🐛 Known Issues & Workarounds

### Issue 1: Success Popup Not Showing
**Problem:** Razorpay redirects to `niya.app/booking/bookappointment` which shows 404  
**Why:** React app not deployed to production domain  
**Impact:** ❌ No success popup  
**Workaround:** Check email for confirmation instead

### Issue 2: Can't Test Locally with Razorpay
**Problem:** Razorpay return URL is set to production domain  
**Solution:** Change return URL in Razorpay dashboard to `http://localhost:3000/bookappointment`  
**Then:** Success popup will work locally

---

## ✅ Success Criteria

### Backend Logs (Check Azure)
```bash
az containerapp logs show --name niya-admin-app-india --resource-group niya-rg --tail 50
```

**Look for:**
```
✅ POST /bx_block_calendar/booked_slots → 201 Created
✅ Rendered appointment_mailer/booking_confirmation_email
✅ Delivered mail [message_id]
✅ Rendered appointment_mailer/coach_notification_email
✅ Delivered mail [message_id]
```

**Should NOT see:**
```
❌ Failed to send email
❌ Maximum credits exceeded (SendGrid error)
❌ Connection refused (SMTP error)
```

### Email Delivery
- ✅ User receives confirmation email within 1-2 minutes
- ✅ Coach receives notification email within 1-2 minutes
- ✅ Emails have correct booking details
- ✅ Meeting code is included

### Database
- ✅ Booking record created
- ✅ Availability count decremented
- ✅ Meeting code generated

---

## 🚨 If Emails Don't Arrive

### Check 1: Backend Logs
```bash
az containerapp logs show --name niya-admin-app-india --resource-group niya-rg --tail 100 | Select-String -Pattern "mail|email|smtp"
```

### Check 2: SMTP Credentials
```bash
az containerapp revision show --name niya-admin-app-india --resource-group niya-rg --revision niya-admin-app-india--email-enabled --query "properties.template.containers[0].env[?name=='MICROSOFT_EMAIL_USERNAME' || name=='MICROSOFT_EMAIL_PASSWORD']"
```

**Should show:**
- MICROSOFT_EMAIL_USERNAME: hello@niya.app
- MICROSOFT_EMAIL_PASSWORD: V#niya6~

### Check 3: Microsoft 365 Account
- Login to https://outlook.office.com with hello@niya.app
- Check if account is active
- Verify password is correct
- Check "Sent Items" folder

### Check 4: Spam/Junk Folders
- Check jayshv@hotmail.com spam folder
- Check noreen@gmail.com spam folder

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

✅/❌ Login successful
✅/❌ Assessment completed
✅/❌ Coach appeared after date/time selection
✅/❌ Booking created (201 response)
✅/❌ Redirected to Razorpay
✅/❌ Returned to app after payment

Email Delivery:
✅/❌ User email received (time: ______)
✅/❌ Coach email received (time: ______)
✅/❌ Email content correct
✅/❌ Meeting code present

Database:
✅/❌ Booking record exists
✅/❌ Correct date/time
✅/❌ Meeting code matches email

Issues Encountered:
_______________________________
_______________________________
```

---

## 🔧 Troubleshooting Commands

### View Latest Backend Logs
```bash
az containerapp logs show --name niya-admin-app-india --resource-group niya-rg --tail 100
```

### Check Active Revision
```bash
az containerapp revision list --name niya-admin-app-india --resource-group niya-rg --query "[?properties.active==\`true\`].{name:name, health:properties.healthState, traffic:properties.trafficWeight}" -o table
```

### Test Backend API
```powershell
Invoke-WebRequest -Uri "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/health" -Method GET
```

### Restart Frontend
```bash
# Stop: Ctrl+C in terminal
cd NIYa-web-main
npm start
```

---

## 🎯 Next Steps After Successful Test

1. **Deploy Frontend to Production**
   - Build: `npm run build`
   - Deploy to Azure Static Web App
   - Configure domain: niya.app/booking

2. **Update Razorpay Return URL**
   - Change to: `https://www.niya.app/booking/bookappointment`
   - Success popup will work

3. **Monitor Email Delivery**
   - Check Microsoft 365 sending limits
   - Set up email delivery monitoring
   - Add error alerts

---

**Ready to test!** 🚀

Start at Step 1 and report back with results!



