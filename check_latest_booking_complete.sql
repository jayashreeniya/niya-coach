-- Check the most recent booking
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

