# Booking System Setup Required - December 8, 2025

## Current Status

✅ **Assessment Flow Complete:**
- Login → Question 1 → Question 2 → Question 3 → Submit → Book Appointment page

✅ **Book Appointment Page Loads:**
- Shows "Focus Areas You Selected"
- Shows booking form with date/time pickers
- All API endpoints updated to Azure backend

❌ **No Coaches Available:**
- The booking page requires psychologists/coaches to be registered
- Coaches need to set up their availability schedules
- Without coaches, the booking system cannot function

## What's Needed for Booking to Work

### 1. Register Psychologist/Coach Accounts

Coaches need to be registered in the system with:
- Email and password
- Account type: Coach/Psychologist
- Profile information
- Activated status = true

**How to create coaches:**
- Use the admin panel: https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/admin
- Or register via API: `POST /account_block/accounts`

### 2. Set Up Coach Availability

Each coach needs to configure their availability schedule:
- **Table:** `bx_block_appointment_management_availabilities`
- **Fields:**
  - `service_provider_id` (coach account ID)
  - `availability_date` (date in dd/mm/yyyy format)
  - `timeslots` (JSON array of available time slots)

**Example timeslot format:**
```json
[
  {"from": "09:00 AM", "to": "09:15 AM", "booked_status": false},
  {"from": "09:15 AM", "to": "09:30 AM", "booked_status": false},
  {"from": "09:30 AM", "to": "09:45 AM", "booked_status": false},
  ...
]
```

### 3. API Flow for Booking

When a user books an appointment:

1. **User selects date/time** → Frontend calls:
   ```
   GET /bx_block_calendar/booked_slots/view_coach_availability?booking_date=DD/MM/YYYY
   ```
   Returns available coaches for that date

2. **User selects coach and time slot** → Frontend calls:
   ```
   POST /bx_block_calendar/booked_slots
   ```
   Creates booking in `bx_block_appointment_management_booked_slots` table

3. **System validates:**
   - Coach is available for selected time
   - User doesn't have overlapping bookings
   - Booking is at least 24 hours in advance
   - Time slot hasn't been booked by someone else

4. **On success:**
   - Booking record created
   - Coach's timeslot marked as booked
   - Confirmation sent to user

## Current Database State

Based on SQL checks:
- ✅ Accounts table exists
- ✅ Booked slots table exists (`bx_block_appointment_management_booked_slots`)
- ✅ Availabilities table exists (`bx_block_appointment_management_availabilities`)
- ❌ No coaches registered (or no activated coaches)
- ❌ No coach availability schedules configured

## Next Steps to Enable Booking

### Option 1: Use Admin Panel (Recommended)
1. Login to admin: https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/admin
   - Email: `jayashreev@niya.app`
   - Password: `V#niya6!`

2. **Create Coach Accounts:**
   - Navigate to Accounts section
   - Create new account with account_type = coach/psychologist
   - Ensure activated = true

3. **Set Up Coach Availability:**
   - Navigate to Availabilities section
   - Create availability records for each coach
   - Set dates and time slots

### Option 2: SQL Insert (Quick Test)
Run SQL to create a test coach and availability:

```sql
-- Create test coach account
INSERT INTO accounts (email, full_name, password_digest, activated, account_type, created_at, updated_at)
VALUES ('coach@niya.app', 'Test Coach', '$2a$12$...', 1, 'coach', NOW(), NOW());

-- Get the coach ID
SET @coach_id = LAST_INSERT_ID();

-- Create availability for next week
INSERT INTO bx_block_appointment_management_availabilities 
(service_provider_id, availability_date, timeslots, created_at, updated_at)
VALUES 
(@coach_id, '15/12/2025', '[
  {"from": "09:00 AM", "to": "09:15 AM", "booked_status": false},
  {"from": "09:15 AM", "to": "09:30 AM", "booked_status": false},
  {"from": "09:30 AM", "to": "09:45 AM", "booked_status": false},
  {"from": "10:00 AM", "to": "10:15 AM", "booked_status": false}
]', NOW(), NOW());
```

### Option 3: Register Coach via Web
If there's a coach registration page in the web app, use it to register psychologists.

## Testing Booking After Setup

Once coaches and availabilities are set up:

1. **Refresh the booking page**
2. **Select a date** that has coach availability
3. **Select hour and minute**
4. **Coaches should appear** with their available time slots
5. **Select a time slot and book**
6. **Should show confirmation**

## Admin Panel for Coaches

The admin panel should allow psychologists to:
- Set their availability calendar
- View their bookings
- Manage their schedule

Check if this functionality exists at:
- https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/admin

## Summary

**The web app is working correctly!** The booking page is functional but requires:
1. Psychologist/coach accounts to be created
2. Availability schedules to be configured

This is expected behavior - a booking system can't show appointments without service providers being set up first.

**Recommended Action:** Work with your psychologists to onboard them and set up their availability schedules through the admin panel.




