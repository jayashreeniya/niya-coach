-- Check the latest bookings to confirm appointment was created
SELECT 
    id,
    service_user_id,
    service_provider_id,
    booking_date,
    start_time,
    end_time,
    meeting_code,
    created_at,
    updated_at
FROM bx_block_appointment_management_booked_slots
ORDER BY id DESC
LIMIT 5;

-- Check which coach was booked (should be Noreen, ID 7)
SELECT 
    bs.id as booking_id,
    bs.booking_date,
    bs.start_time,
    bs.end_time,
    a.id as coach_id,
    a.full_name as coach_name,
    a.email as coach_email,
    u.id as user_id,
    u.full_name as user_name,
    u.email as user_email
FROM bx_block_appointment_management_booked_slots bs
LEFT JOIN accounts a ON bs.service_provider_id = a.id
LEFT JOIN accounts u ON bs.service_user_id = u.id
ORDER BY bs.id DESC
LIMIT 3;



