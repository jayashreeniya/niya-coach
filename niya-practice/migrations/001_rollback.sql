-- =============================================================================
-- NIYA Practice: Rollback Migration 001
-- Drops all tables in reverse dependency order
-- =============================================================================

BEGIN;

DROP TABLE IF EXISTS practice_reminders;
DROP TABLE IF EXISTS user_practice_stats;
DROP TABLE IF EXISTS user_practices;
DROP TABLE IF EXISTS practices;
DROP TABLE IF EXISTS practice_users;

COMMIT;
