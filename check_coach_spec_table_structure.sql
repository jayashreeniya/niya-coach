-- Check the table structure
DESCRIBE coach_specializations;

-- Check current data
SELECT id, expertise, focus_areas, HEX(focus_areas) as hex_value FROM coach_specializations;

-- Check if it's stored as text or integer
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'coach_specializations' 
AND COLUMN_NAME = 'focus_areas';












