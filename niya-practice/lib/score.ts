import type {
  EmotionalFitnessCategory,
  PracticePhase,
  ScoreBreakdown,
} from '@/types/database';
import { execute, queryOne } from '@/lib/db';
import type { RowDataPacket } from 'mysql2/promise';

export function getScoreCategory(score: number): EmotionalFitnessCategory {
  if (score >= 80) return 'peak';
  if (score >= 60) return 'strong';
  if (score >= 40) return 'developing';
  return 'building';
}

export function getPracticePhase(dayNumber: number): PracticePhase {
  if (dayNumber <= 30) return 'Foundation';
  if (dayNumber <= 60) return 'Development';
  return 'Integration';
}

export function getWeekNumber(dayNumber: number): number {
  return Math.ceil(dayNumber / 7);
}

/** On-demand score recalculation for the progress page */
export async function getScoreBreakdown(
  userId: number
): Promise<ScoreBreakdown> {
  return calculateEmotionalFitnessScore(userId);
}

interface StatsAgg extends RowDataPacket {
  total: number;
  avg_mood: number | null;
  streak: number;
}

/**
 * Re-calculate and persist the emotional fitness score for a user.
 *
 * Formula (out of 100):
 *   completion (40%) + mood_improvement (30%) + consistency (30%)
 */
export async function calculateEmotionalFitnessScore(
  userId: number
): Promise<ScoreBreakdown> {
  const row = await queryOne<StatsAgg>(
    `SELECT
       ups.total_practices  AS total,
       ups.current_streak   AS streak,
       (SELECT AVG(mood_after) FROM user_practices WHERE user_id = ? AND mood_after IS NOT NULL) AS avg_mood
     FROM user_practice_stats ups
     WHERE ups.user_id = ?`,
    [userId, userId]
  );

  const total = row?.total ?? 0;
  const avgMood = row?.avg_mood ?? 3;
  const streak = row?.streak ?? 0;

  const completion = Math.min(total / 90, 1) * 40;
  const mood = ((avgMood - 1) / 4) * 30;
  const consistency = Math.min(streak / 30, 1) * 30;
  const score = Math.round(completion + mood + consistency);

  await execute(
    `UPDATE user_practice_stats
       SET emotional_fitness_score = ?, score_updated_at = NOW()
     WHERE user_id = ?`,
    [score, userId]
  );

  return {
    score,
    category: getScoreCategory(score),
    components: {
      completion: Math.round(completion),
      mood: Math.round(mood),
      consistency: Math.round(consistency),
    },
  };
}
