# 🚀 Niya App - Quick Reference Guide

**Last Updated:** December 10, 2025

---

## 🌐 **Production URLs:**

| Service | URL |
|---------|-----|
| **User App** | https://book-appointment.niya.app |
| **Backend API** | https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io |
| **Admin Panel** | [Backend URL]/admin |
| **Main Website** | https://niya.app |

---

## 🔑 **Login Credentials:**

### **Admin Account:**
- Email: `nidhil@niya.app`
- Password: `[Ask Jayashree]`
- Role: Coach + Admin

### **Test User Account:**
- Email: `jayshv@hotmail.com`
- Role: Coach + User

---

## 📊 **Database Access:**

```
Host: niya-admin-db.mysql.database.azure.com
Database: niya_admin_db
Username: niya_admin
Password: [Stored in Azure secrets]
Port: 3306
SSL: Required
```

**Azure MySQL Query Editor:**
https://portal.azure.com → MySQL → niya-admin-db → Query Editor

---

## 🎯 **Key Concepts:**

### **User Flow:**
```
Login → Assessment (Q1→Q2→Q3) → Booking → Payment → Success
```

### **Payment Flow:**
```
Click "Schedule" → Store in localStorage → Razorpay Payment
  ↓ Success → /payment-success → Create Booking → Send Emails
  ↓ Fail → /bookappointment → Nothing created
```

### **Coach Matching:**
```
User selects focus areas (Q3) → System finds coaches with matching expertise → Show available coaches
```

---

## 🔧 **Common Commands:**

### **Deploy Frontend:**
```bash
cd NIYa-web-main
npm run build
swa deploy ./build --deployment-token b11871a8ddfa1e04b56bc4e3fc7a9af0d1ff1df391f0cf256fd4d59890e0eba203-a5e40077-505b-4195-9eab-fd11d018bd1b00014010c528ce00 --env production
```

### **Deploy Backend:**
```bash
cd back-end
az containerapp up --name niya-admin-app-india --resource-group niya-rg --source . --ingress external --target-port 3000
```

### **Check Backend Logs:**
```bash
az containerapp logs show --name niya-admin-app-india --resource-group niya-rg --tail 50
```

### **Git Commands:**
```bash
git add -A
git commit -m "Your message"
git push origin master
```

---

## 📋 **Useful SQL Queries:**

### **Check Recent Bookings:**
```sql
SELECT 
  bs.id,
  u.full_name as user_name,
  c.full_name as coach_name,
  bs.booking_date,
  bs.start_time,
  bs.end_time,
  bs.created_at
FROM bx_block_appointment_management_booked_slots bs
JOIN accounts u ON bs.service_user_id = u.id
JOIN accounts c ON bs.service_provider_id = c.id
ORDER BY bs.created_at DESC
LIMIT 10;
```

### **Check User's Assessment Answers:**
```sql
SELECT 
  sa.id,
  a.full_name,
  sa.multiple_answers,
  sa.created_at
FROM select_answers sa
JOIN accounts a ON sa.account_id = a.id
ORDER BY sa.created_at DESC
LIMIT 10;
```

### **Check Coach Specializations:**
```sql
SELECT * FROM coach_specializations;
```

### **Check Available Coaches:**
```sql
SELECT 
  id,
  full_name,
  email,
  expertise,
  activated
FROM accounts
WHERE role_id = 4
ORDER BY full_name;
```

---

## 🐛 **Troubleshooting:**

### **Issue: Coaches not appearing**
```sql
-- Check coach specializations
SELECT * FROM coach_specializations;

-- Should show focus_areas as YAML array like:
-- ---
-- - 28
```

**Fix:** Run `PERMANENT_COACH_FIX.sql`

### **Issue: No email sent**
**Check:**
1. Is payment successful?
2. Check backend logs for email errors
3. Verify environment variables: `MICROSOFT_EMAIL_USERNAME`, `MICROSOFT_EMAIL_PASSWORD`

### **Issue: Popup not showing**
**Check:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Open console (F12) → Check for errors
3. Verify `/payment-success` route is accessible

### **Issue: "Missing booking details in localStorage"**
**Cause:** User went directly to `/payment-success` without booking
**Fix:** Redirect will happen automatically to `/bookappointment`

---

## 📧 **Email Configuration:**

**Service:** Microsoft 365 SMTP

**Settings:**
```
SMTP Server: smtp.office365.com
Port: 587
Username: hello@niya.app
Password: V#niya6~
TLS: Enabled
```

**DNS Records (GoDaddy):**
```
SPF: v=spf1 include:spf.protection.outlook.com -all
DKIM: Configured via Microsoft 365 (selector1, selector2)
DMARC: v=DMARC1; p=none; rua=mailto:hello@niya.app
```

---

## 💳 **Razorpay Configuration:**

**Payment Button ID:** `pl_PlfPpsIDwS9SkD`

**Return URL (CRITICAL):**
```
https://book-appointment.niya.app/payment-success
```

**Where to update:**
1. Login to https://dashboard.razorpay.com
2. Go to Payment Buttons
3. Find button: `pl_PlfPpsIDwS9SkD`
4. Update "Return URL"

---

## 🔄 **Coach Availability:**

**Sample Availability Data:**
```sql
-- Nidhi Lal (ID: 3) available on 12/12/2025
-- Jayashree (ID: 6) available on 12/12/2025
-- Noreen (ID: 7) available on multiple dates
```

**To Add Availability:**
```sql
INSERT INTO availabilities (
  service_provider_id,
  availability_date,
  time_slots,
  available_slots_count,
  created_at,
  updated_at
) VALUES (
  3,  -- Coach ID
  '12/15/2025',
  '["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]',
  24,
  NOW(),
  NOW()
);
```

---

## 📱 **Testing Checklist:**

### **Before Testing:**
- [ ] Clear browser cache
- [ ] Check you're logged in
- [ ] Wait 2 minutes since last Razorpay test

### **Test Flow:**
- [ ] Login successful
- [ ] Answer Q1 (radio button)
- [ ] Answer Q2 (radio button)
- [ ] Answer Q3 (checkboxes, select 2-3)
- [ ] Click SUBMIT → Navigate to booking page
- [ ] Select date
- [ ] Select hour and minute
- [ ] Coaches appear
- [ ] Click "Schedule a Call"
- [ ] Redirected to Razorpay
- [ ] **Test A:** Exit without paying → No booking, no email ✅
- [ ] **Test B:** Complete payment → Booking created, email sent ✅

---

## 📞 **Support:**

**Email:** hello@niya.app  
**Repository:** https://github.com/jayashreeniya/niya-coach  
**Cloud:** Microsoft Azure  
**Domain:** GoDaddy (niya.app)

---

## 🎯 **Focus Areas (IDs):**

```
26 - Relationship issues → Relationship Counseling
27 - Self Confidence → Self Confidence
28 - Anxiety → Anxiety Depression
29 - Stress → Stress Management
```

---

## 👥 **Coach Expertise Mapping:**

```
Nidhi Lal:        [Anxiety Depression, Stress Management]
Jayashree:        [Self Confidence, Stress Management]
Noreen:           [All 4 areas]
Maya:             [Relationship Counseling, Anxiety Depression]
```

---

## 🔗 **Zoom Link:**

**Meeting Link:** https://us06web.zoom.us/j/9774013865

**Included in:**
- Success popup
- User confirmation email
- Coach notification email

---

## ⏰ **Session Duration:**

**Default:** 60 minutes (1 hour)

**Calculated as:**
```
End Time = Start Time + 59 minutes
Example: 11:00 → 11:59
```

---

## 🎨 **Brand Assets:**

**Logo:** Located in `NIYa-web-main/src/assets/images/niyalogo.png`

**Color Scheme:**
- Primary: Blue (#4A90E2)
- Text: Dark Gray
- Background: Light Gray (#f5f5f5)

---

## ✅ **Status: PRODUCTION READY**

**Last Tested:** December 10, 2025  
**Status:** All features working ✅  
**Known Issues:** Admin panel coach specialization UI (workaround exists)

---

**Keep this document handy for quick reference!** 📌



