import { execute, queryRows, pool } from '@/lib/db';
import type { RowDataPacket } from 'mysql2/promise';

interface DailyCountRow extends RowDataPacket {
  day: string;
  visitors: number;
}

interface DailyActivityRow extends RowDataPacket {
  day: string;
  activities: number;
}

interface UserSummaryRow extends RowDataPacket {
  user_id: number;
  email: string;
  full_name: string;
  last_visit_at: Date | null;
  total_visit_days: number;
  total_hit_count: number;
  last_activity_at: Date | null;
  total_activities: number;
}

interface ActivityDetailRow extends RowDataPacket {
  day: string;
  user_id: number;
  full_name: string;
  email: string;
  day_number: number;
  title: string;
  mode: string;
  language: string | null;
  completed_at: Date;
}

interface TotalsRow extends RowDataPacket {
  total_visitors: number;
  total_activity_plays: number;
}

interface TopActivityRow extends RowDataPacket {
  day_number: number;
  title: string;
  plays: number;
}

interface LanguageBreakdownRow extends RowDataPacket {
  language: string;
  plays: number;
}

export async function ensureVisitTable(): Promise<void> {
  // Use pool().query() instead of execute() because DDL statements
  // cannot go through prepared-statement path on TiDB / some MySQL versions.
  const sql = `
    CREATE TABLE IF NOT EXISTS practice_visits (
      id BIGINT NOT NULL AUTO_INCREMENT,
      user_id BIGINT NOT NULL,
      path VARCHAR(255) NOT NULL DEFAULT '/',
      visit_date DATE NOT NULL,
      first_visited_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_visited_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      hit_count INT NOT NULL DEFAULT 1,
      user_agent VARCHAR(500) DEFAULT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_visit_user_day (user_id, visit_date),
      INDEX idx_visit_date (visit_date),
      INDEX idx_visit_user (user_id)
    ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;
  try {
    await pool().query(sql);
  } catch (err) {
    console.warn('[visit-analytics] ensureVisitTable failed (table may already exist):', (err as Error).message);
  }
}

export async function logVisit(opts: {
  userId: number;
  path: string;
  userAgent?: string | null;
}): Promise<void> {
  await ensureVisitTable();
  await execute(
    `
      INSERT INTO practice_visits
        (user_id, path, visit_date, first_visited_at, last_visited_at, hit_count, user_agent)
      VALUES (?, ?, CURDATE(), NOW(), NOW(), 1, ?)
      ON DUPLICATE KEY UPDATE
        last_visited_at = NOW(),
        hit_count = hit_count + 1,
        path = VALUES(path),
        user_agent = COALESCE(VALUES(user_agent), user_agent)
    `,
    [opts.userId, opts.path || '/', opts.userAgent ?? null]
  );
}

export async function getAdminAnalytics(days = 30) {
  await ensureVisitTable();

  const totals = await queryRows<TotalsRow>(
    `
      SELECT
        (SELECT COUNT(DISTINCT user_id) FROM practice_visits) AS total_visitors,
        (SELECT COUNT(*) FROM user_practices) AS total_activity_plays
    `
  );

  const dailyVisitors = await queryRows<DailyCountRow>(
    `
      SELECT DATE_FORMAT(visit_date, '%Y-%m-%d') AS day, COUNT(DISTINCT user_id) AS visitors
      FROM practice_visits
      WHERE visit_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE_FORMAT(visit_date, '%Y-%m-%d')
      ORDER BY day DESC
    `,
    [days]
  );

  const dailyActivities = await queryRows<DailyActivityRow>(
    `
      SELECT DATE_FORMAT(DATE(completed_at), '%Y-%m-%d') AS day, COUNT(*) AS activities
      FROM user_practices
      WHERE completed_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE_FORMAT(DATE(completed_at), '%Y-%m-%d')
      ORDER BY day DESC
    `,
    [days]
  );

  const users = await queryRows<UserSummaryRow>(
    `
      SELECT
        u.id AS user_id,
        u.email,
        u.full_name,
        COALESCE(v_agg.last_visit_at, NULL) AS last_visit_at,
        COALESCE(v_agg.total_visit_days, 0) AS total_visit_days,
        COALESCE(v_agg.total_hit_count, 0) AS total_hit_count,
        COALESCE(up_agg.last_activity_at, NULL) AS last_activity_at,
        COALESCE(up_agg.total_activities, 0) AS total_activities
      FROM practice_users u
      LEFT JOIN (
        SELECT user_id,
               MAX(last_visited_at) AS last_visit_at,
               COUNT(DISTINCT visit_date) AS total_visit_days,
               SUM(hit_count) AS total_hit_count
        FROM practice_visits GROUP BY user_id
      ) v_agg ON v_agg.user_id = u.id
      LEFT JOIN (
        SELECT user_id,
               MAX(completed_at) AS last_activity_at,
               COUNT(*) AS total_activities
        FROM user_practices GROUP BY user_id
      ) up_agg ON up_agg.user_id = u.id
      ORDER BY last_visit_at DESC
      LIMIT 500
    `
  );

  const activityDetails = await queryRows<ActivityDetailRow>(
    `
      SELECT
        DATE_FORMAT(DATE(up.completed_at), '%Y-%m-%d') AS day,
        u.id AS user_id,
        u.full_name,
        u.email,
        p.day_number,
        p.title,
        up.mode,
        up.audio_language AS language,
        up.completed_at
      FROM user_practices up
      JOIN practice_users u ON u.id = up.user_id
      JOIN practices p ON p.id = up.practice_id
      WHERE up.completed_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      ORDER BY up.completed_at DESC
      LIMIT 1000
    `,
    [days]
  );

  const topActivities = await queryRows<TopActivityRow>(
    `
      SELECT
        p.day_number,
        p.title,
        COUNT(*) AS plays
      FROM user_practices up
      JOIN practices p ON p.id = up.practice_id
      WHERE up.completed_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY p.day_number, p.title
      ORDER BY plays DESC
      LIMIT 20
    `,
    [days]
  );

  const languageBreakdown = await queryRows<LanguageBreakdownRow>(
    `
      SELECT
        COALESCE(NULLIF(up.audio_language, ''), 'n/a') AS language,
        COUNT(*) AS plays
      FROM user_practices up
      WHERE up.completed_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY COALESCE(NULLIF(up.audio_language, ''), 'n/a')
      ORDER BY plays DESC
    `,
    [days]
  );

  return {
    totals: totals[0] ?? { total_visitors: 0, total_activity_plays: 0 },
    dailyVisitors,
    dailyActivities,
    users,
    activityDetails,
    topActivities,
    languageBreakdown,
  };
}
