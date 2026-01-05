-- Check if the booking was created for 12/12/2025 at 11:00 AM
SELECT 
    id,
    service_user_id,
    service_provider_id,
    booking_date,
    start_time,
    end_time,
    meeting_code,
    created_at
FROM bx_block_appointment_management_booked_slots
WHERE booking_date = '12/12/2025'
  AND start_time LIKE '%11:00%'
ORDER BY id DESC
LIMIT 3;

-- Get all recent bookings
SELECT 
    bs.id,
    bs.booking_date,
    bs.start_time,
    u.full_name as user_name,
    c.full_name as coach_name,
    bs.created_at
FROM bx_block_appointment_management_booked_slots bs
LEFT JOIN accounts u ON bs.service_user_id = u.id
LEFT JOIN accounts c ON bs.service_provider_id = c.id
ORDER BY bs.id DESC
LIMIT 5;











