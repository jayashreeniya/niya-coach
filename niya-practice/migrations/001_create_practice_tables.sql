-- =============================================================================
-- NIYA Practice: Database Migration 001
-- Standalone 90-Day Emotional Fitness Web App with Audio Guidance
-- Separate app from main NIYA — own users table with OAuth login
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. practice_users — OAuth-authenticated users (Google, Apple, Microsoft)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS practice_users (
  id              BIGINT        NOT NULL AUTO_INCREMENT,
  email           VARCHAR(255)  NOT NULL,
  full_name       VARCHAR(255)  NOT NULL,
  avatar_url      VARCHAR(500)  DEFAULT NULL,
  oauth_provider  VARCHAR(20)   NOT NULL,
  oauth_id        VARCHAR(255)  NOT NULL,
  locale          VARCHAR(10)   DEFAULT 'en',
  last_login_at   DATETIME      DEFAULT NULL,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_practice_users_oauth (oauth_provider, oauth_id),
  UNIQUE KEY uq_practice_users_email (email),
  INDEX idx_practice_users_provider (oauth_provider),

  CONSTRAINT chk_users_provider CHECK (oauth_provider IN ('google', 'apple', 'microsoft'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------------------------------
-- 2. practices — Content library (90-day curriculum with audio support)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS practices (
  id               BIGINT       NOT NULL AUTO_INCREMENT,
  day_number       INT          NOT NULL,
  title            VARCHAR(255) NOT NULL,
  description      TEXT         NOT NULL,
  duration_minutes INT          NOT NULL DEFAULT 15,
  language         VARCHAR(5)   NOT NULL DEFAULT 'en',
  instructions     JSON         NOT NULL,
  audio_url        VARCHAR(500) DEFAULT NULL,
  video_url        VARCHAR(500) DEFAULT NULL,
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_practices_day_lang (day_number, language),
  INDEX idx_practices_day (day_number),
  INDEX idx_practices_language (language),

  CONSTRAINT chk_practices_day_number CHECK (day_number BETWEEN 1 AND 90),
  CONSTRAINT chk_practices_duration CHECK (duration_minutes > 0),
  CONSTRAINT chk_practices_language CHECK (language IN ('en', 'hi', 'ta', 'te'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------------------------------
-- 3. user_practices — Completion tracking with mode (text/audio/video)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_practices (
  id              BIGINT       NOT NULL AUTO_INCREMENT,
  user_id         BIGINT       NOT NULL,
  practice_id     BIGINT       NOT NULL,
  completed_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  mode            VARCHAR(10)  NOT NULL DEFAULT 'text',
  audio_language  VARCHAR(5)   DEFAULT NULL,
  mood_before     TINYINT      DEFAULT NULL,
  mood_after      TINYINT      DEFAULT NULL,
  reflection_text VARCHAR(500) DEFAULT NULL,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_user_practices_user (user_id),
  INDEX idx_user_practices_completed (user_id, completed_at),
  INDEX idx_user_practices_practice (practice_id),
  INDEX idx_user_practices_mode (mode, audio_language),

  CONSTRAINT fk_user_practices_user
    FOREIGN KEY (user_id) REFERENCES practice_users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_practices_practice
    FOREIGN KEY (practice_id) REFERENCES practices(id) ON DELETE CASCADE,

  CONSTRAINT chk_practice_mode   CHECK (mode IN ('text', 'audio', 'video')),
  CONSTRAINT chk_audio_language  CHECK (audio_language IS NULL OR audio_language IN ('en', 'hi', 'ta', 'te')),
  CONSTRAINT chk_mood_before     CHECK (mood_before IS NULL OR mood_before BETWEEN 1 AND 5),
  CONSTRAINT chk_mood_after      CHECK (mood_after  IS NULL OR mood_after  BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------------------------------
-- 4. user_practice_stats — Cached statistics with audio tracking
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_practice_stats (
  user_id                 BIGINT      NOT NULL,
  current_streak          INT         NOT NULL DEFAULT 0,
  longest_streak          INT         NOT NULL DEFAULT 0,
  total_practices         INT         NOT NULL DEFAULT 0,
  audio_practices         INT         NOT NULL DEFAULT 0,
  preferred_language      VARCHAR(5)  NOT NULL DEFAULT 'en',
  emotional_fitness_score TINYINT     NOT NULL DEFAULT 50,
  last_practice_date      DATE        DEFAULT NULL,
  score_updated_at        DATETIME    DEFAULT NULL,
  created_at              DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (user_id),

  CONSTRAINT fk_practice_stats_user
    FOREIGN KEY (user_id) REFERENCES practice_users(id) ON DELETE CASCADE,

  CONSTRAINT chk_stats_streak      CHECK (current_streak >= 0),
  CONSTRAINT chk_stats_longest     CHECK (longest_streak >= 0),
  CONSTRAINT chk_stats_total       CHECK (total_practices >= 0),
  CONSTRAINT chk_stats_audio       CHECK (audio_practices >= 0),
  CONSTRAINT chk_stats_pref_lang   CHECK (preferred_language IN ('en', 'hi', 'ta', 'te')),
  CONSTRAINT chk_stats_score       CHECK (emotional_fitness_score BETWEEN 0 AND 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------------------------------
-- 5. practice_reminders — User notification preferences
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS practice_reminders (
  user_id                BIGINT      NOT NULL,
  reminder_time          TIME        NOT NULL DEFAULT '09:00:00',
  timezone               VARCHAR(50) NOT NULL DEFAULT 'Asia/Kolkata',
  notifications_enabled  TINYINT(1)  NOT NULL DEFAULT 1,
  created_at             DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (user_id),

  CONSTRAINT fk_practice_reminders_user
    FOREIGN KEY (user_id) REFERENCES practice_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


COMMIT;
