# 🧪 Payment Flow Testing Guide - December 10, 2025

**What Changed:** Emails now send ONLY after payment success, not before!

---

## ✅ **Test Scenario 1: Successful Payment**

### Steps:
1. Login to app: https://book-appointment.niya.app
2. Complete assessment questions (Q1, Q2, Q3)
3. Select date: **12/12/2025**
4. Select time: **11:00**
5. Coach should appear (Nidhi or Noreen)
6. Click **"Schedule a Call"**
7. You'll be redirected to Razorpay
8. **Complete the payment**
9. Click "Done" or let it redirect automatically

### Expected Results:
✅ Redirected back to booking page  
✅ **Success popup appears** with appointment details and Zoom link  
✅ **ONE email sent** to your email address with:
   - Coach name
   - Date/Time
   - Zoom link: https://us06web.zoom.us/j/9774013865
   - "Thank You!" message
✅ Coach (Noreen or Nidhi) receives notification email  
✅ Booking saved in database  

### Check Your Email:
- **Subject:** "Your Appointment with Niya is Confirmed!"
- **From:** hello@niya.app
- **Contains:** Zoom link, date, time, coach name
- **Count:** Only 1 email (not 2!)

---

## ❌ **Test Scenario 2: Exit Without Payment (CRITICAL)**

### Steps:
1. Login to app: https://book-appointment.niya.app
2. Complete assessment questions (Q1, Q2, Q3)
3. Select date: **12/12/2025**
4. Select time: **11:00**
5. Coach should appear
6. Click **"Schedule a Call"**
7. You'll be redirected to Razorpay
8. **Click the back button or close the Razorpay page WITHOUT paying**
9. You'll return to the booking page

### Expected Results:
✅ **NO popup appears**  
✅ **NO email sent** to your address  
✅ **NO email sent** to coach  
✅ Booking should be **cancelled/deleted** in database  
✅ You can book again without issues  

### Check Your Email:
- **Count:** 0 emails
- **Spam folder:** Also check - should be empty

---

## 🔍 **Test Scenario 3: Payment Failed**

### Steps:
1. Same as Scenario 2, steps 1-7
2. **Enter incorrect payment details** (if using test mode)
3. Payment fails
4. You'll return to the booking page

### Expected Results:
✅ **NO popup appears**  
✅ **NO email sent**  
✅ Booking cancelled  
✅ Can try again  

---

## 📊 **How to Verify in Database:**

### Check Booking Status:
```sql
-- Login to Azure MySQL Query Editor
SELECT 
  id,
  service_user_id,
  service_provider_id,
  booking_date,
  start_time,
  payment_status,
  payment_id,
  created_at
FROM bx_block_appointment_management_booked_slots
WHERE service_user_id = 6  -- Your user ID
ORDER BY created_at DESC
LIMIT 5;
```

**After Successful Payment:**
- ✅ Row exists
- ✅ `payment_status`: 'paid' (if column exists)
- ✅ `payment_id`: 'pay_xxx...'

**After Exiting Without Payment:**
- ✅ Row deleted OR marked as 'cancelled'
- ✅ No pending records

---

## 📧 **Email Testing Checklist:**

| Test | Expected | Result |
|------|----------|--------|
| Successful payment | 1 email with Zoom link | ✅ ❌ |
| Exit without payment | 0 emails | ✅ ❌ |
| Payment failed | 0 emails | ✅ ❌ |
| Email goes to spam | No (after DNS fix) | ✅ ❌ |
| Duplicate emails | No duplicates | ✅ ❌ |
| Zoom link present | Yes in email | ✅ ❌ |
| Coach gets email | Yes after payment | ✅ ❌ |

---

## 🐛 **If Something Goes Wrong:**

### Issue: Still getting emails without payment
**Check:**
```javascript
// Open browser console (F12)
// Look for:
"Payment successful, showing confirmation popup and sending emails"
"Payment confirmed and emails sent:"
```

### Issue: Getting 2 emails
**Check:**
- Both emails from hello@niya.app? (Should only be 1)
- One from different sender? (Old emailjs - shouldn't happen)

### Issue: Popup shows but no email
**Check backend logs:**
```bash
az containerapp logs show \
  --name niya-admin-app-india \
  --resource-group niya-rg \
  --tail 50
```
Look for: "Failed to send email:"

### Issue: Booking not cancelled on exit
**Check browser console:**
```javascript
// Should see:
"else coachbook true"
"booksloatids: 123 Coach Name"
"cancel booking status: 200"
"Booking cancelled successfully: {...}"
```

---

## 🔧 **Quick Debug Commands:**

### Check Recent Bookings:
```sql
SELECT COUNT(*) as total_bookings FROM bx_block_appointment_management_booked_slots;
```

### Check Recent Emails (if logging enabled):
```sql
-- This table may not exist, just for reference
SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 10;
```

### Check Frontend Console:
```
F12 → Console
Should see:
- "Payment successful..." if paid
- "Booking cancelled..." if exited
```

---

## ✨ **Success Criteria:**

All 3 scenarios pass:
1. ✅ Payment success → Email sent
2. ✅ Exit without payment → No email, booking cancelled
3. ✅ Payment failed → No email, booking cancelled

---

## 📞 **Need Help?**

If any test fails, collect:
1. Browser console logs (F12 → Console)
2. Network tab (F12 → Network → filter "booked_slots")
3. Email received (or not received)
4. Database booking record

---

**Ready to Test?** Start with Scenario 2 (Exit Without Payment) first! 🚀










