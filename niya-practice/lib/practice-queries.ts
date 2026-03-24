import { queryOne, queryRows, execute } from '@/lib/db';
import type {
  PracticeRow,
  UserPracticeStatsRow,
  UserPracticeStats,
  Practice,
} from '@/types/database';
import type { RowDataPacket } from 'mysql2/promise';

// ---------------------------------------------------------------------------
// Get today's practice for a user (cycles through 1-90)
// ---------------------------------------------------------------------------

export async function getTodaysPractice(userId: number): Promise<Practice> {
  const stats = await getUserStats(userId);
  const dayNumber = (stats.total_practices % 90) + 1;
  return getPracticeByDay(dayNumber);
}

// ---------------------------------------------------------------------------
// Get a practice by its day_number
// ---------------------------------------------------------------------------

export async function getPracticeByDay(dayNumber: number): Promise<Practice> {
  const row = await queryOne<PracticeRow>(
    "SELECT * FROM practices WHERE day_number = ? AND language = 'en'",
    [dayNumber]
  );

  if (!row) {
    throw new Error(`Practice for day ${dayNumber} not found`);
  }

  let instructions = row.instructions;
  if (typeof instructions === 'string') {
    try {
      instructions = JSON.parse(instructions);
    } catch {
      throw new Error(`Malformed instructions JSON for day ${dayNumber}`);
    }
  }

  if (!Array.isArray(instructions) || instructions.length === 0) {
    throw new Error(`Empty or invalid instructions for day ${dayNumber}`);
  }

  return { ...row, instructions };
}

// ---------------------------------------------------------------------------
// Get (or bootstrap) user stats
// ---------------------------------------------------------------------------

export async function getUserStats(
  userId: number
): Promise<UserPracticeStats> {
  const row = await queryOne<UserPracticeStatsRow>(
    'SELECT * FROM user_practice_stats WHERE user_id = ?',
    [userId]
  );

  if (row) return row;

  await execute(
    "INSERT IGNORE INTO user_practice_stats (user_id, preferred_language) VALUES (?, 'en')",
    [userId]
  );

  return {
    user_id: userId,
    current_streak: 0,
    longest_streak: 0,
    total_practices: 0,
    audio_practices: 0,
    preferred_language: 'en',
    emotional_fitness_score: 50,
    last_practice_date: null,
    score_updated_at: null,
    created_at: new Date(),
    updated_at: new Date(),
  };
}

// ---------------------------------------------------------------------------
// Check if user already completed a practice today
// ---------------------------------------------------------------------------

interface CountRow extends RowDataPacket {
  cnt: number;
}

export async function hasCompletedToday(userId: number): Promise<boolean> {
  const row = await queryOne<CountRow>(
    `SELECT COUNT(*) AS cnt
     FROM user_practices
     WHERE user_id = ? AND DATE(completed_at) = CURDATE()`,
    [userId]
  );
  return (row?.cnt ?? 0) > 0;
}

// ---------------------------------------------------------------------------
// Completion history for calendar heatmap
// ---------------------------------------------------------------------------

interface DateRow extends RowDataPacket {
  practice_date: string;
}

export async function getCompletionHistory(
  userId: number,
  days: number = 30
): Promise<Date[]> {
  const rows = await queryRows<DateRow>(
    `SELECT DATE(completed_at) AS practice_date
     FROM user_practices
     WHERE user_id = ?
       AND completed_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
     GROUP BY DATE(completed_at)
     ORDER BY practice_date ASC`,
    [userId, days]
  );

  return rows.map((r) => new Date(r.practice_date));
}

// ---------------------------------------------------------------------------
// User reminders / settings
// ---------------------------------------------------------------------------

interface ReminderRow extends RowDataPacket {
  reminder_time: string;
  timezone: string;
  notifications_enabled: number;
  preferred_language: string;
}

export async function getUserReminders(userId: number) {
  const row = await queryOne<ReminderRow>(
    `SELECT pr.reminder_time, pr.timezone, pr.notifications_enabled,
            ups.preferred_language
     FROM practice_reminders pr
     LEFT JOIN user_practice_stats ups ON ups.user_id = pr.user_id
     WHERE pr.user_id = ?`,
    [userId]
  );

  return {
    reminderTime: row?.reminder_time ?? '09:00:00',
    timezone: row?.timezone ?? 'Asia/Kolkata',
    notificationsEnabled: row ? Boolean(row.notifications_enabled) : true,
    preferredLanguage: row?.preferred_language ?? 'en',
  };
}

export async function updateUserSettings(
  userId: number,
  settings: {
    reminderTime?: string;
    timezone?: string;
    notificationsEnabled?: boolean;
    preferredLanguage?: string;
  }
) {
  await execute(
    `INSERT INTO practice_reminders (user_id, reminder_time, timezone, notifications_enabled)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       reminder_time = VALUES(reminder_time),
       timezone = VALUES(timezone),
       notifications_enabled = VALUES(notifications_enabled)`,
    [
      userId,
      settings.reminderTime || '09:00:00',
      settings.timezone || 'Asia/Kolkata',
      settings.notificationsEnabled ?? true,
    ]
  );

  if (settings.preferredLanguage) {
    await execute(
      'UPDATE user_practice_stats SET preferred_language = ? WHERE user_id = ?',
      [settings.preferredLanguage, userId]
    );
  }
}
