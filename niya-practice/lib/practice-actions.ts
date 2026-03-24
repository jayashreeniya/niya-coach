'use server';

import { getCurrentUser } from '@/lib/auth';
import { transaction } from '@/lib/db';
import { calculateStreak } from '@/lib/streak';
import { calculateEmotionalFitnessScore } from '@/lib/score';
import type { PracticeMode, SupportedLanguage, UserPracticeStatsRow } from '@/types/database';

export async function completePractice({
  practiceId,
  mode,
  audioLanguage,
  moodBefore,
  moodAfter,
  reflectionText,
}: {
  practiceId: number;
  mode: PracticeMode;
  audioLanguage?: SupportedLanguage;
  moodBefore?: number | null;
  moodAfter: number;
  reflectionText: string | null;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const result = await transaction(async (conn) => {
    await conn.execute(
      `INSERT INTO user_practices
       (user_id, practice_id, completed_at, mode, audio_language, mood_before, mood_after, reflection_text)
       VALUES (?, ?, NOW(), ?, ?, ?, ?, ?)`,
      [
        user.id,
        practiceId,
        mode,
        audioLanguage || null,
        moodBefore ?? null,
        moodAfter,
        reflectionText,
      ]
    );

    const [[stats]] = await conn.query<UserPracticeStatsRow[]>(
      'SELECT * FROM user_practice_stats WHERE user_id = ?',
      [user.id]
    );

    const streakData = calculateStreak(
      stats?.last_practice_date ?? null,
      stats?.current_streak ?? 0
    );

    const isAudio = mode === 'audio' ? 1 : 0;

    if (audioLanguage) {
      await conn.execute(
        `UPDATE user_practice_stats
         SET current_streak = ?,
             longest_streak = GREATEST(longest_streak, ?),
             total_practices = total_practices + 1,
             audio_practices = audio_practices + ?,
             preferred_language = ?,
             last_practice_date = CURDATE()
         WHERE user_id = ?`,
        [streakData.current_streak, streakData.longest_streak, isAudio, audioLanguage, user.id]
      );
    } else {
      await conn.execute(
        `UPDATE user_practice_stats
         SET current_streak = ?,
             longest_streak = GREATEST(longest_streak, ?),
             total_practices = total_practices + 1,
             audio_practices = audio_practices + ?,
             last_practice_date = CURDATE()
         WHERE user_id = ?`,
        [streakData.current_streak, streakData.longest_streak, isAudio, user.id]
      );
    }

    return {
      current_streak: streakData.current_streak,
      streak_increased: streakData.streak_increased,
      is_milestone: streakData.is_milestone,
    };
  });

  calculateEmotionalFitnessScore(user.id).catch(console.error);

  return result;
}
