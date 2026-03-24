import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { execute, queryOne, transaction } from '@/lib/db';
import { calculateStreak } from '@/lib/streak';
import { calculateEmotionalFitnessScore } from '@/lib/score';
import type { UserPracticeStatsRow } from '@/types/database';
import type {
  PracticeCompleteRequest,
  PracticeCompleteResponse,
  ApiError,
} from '@/types/api';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json<ApiError>({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  let body: PracticeCompleteRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<ApiError>({ error: 'Invalid JSON' }, { status: 400 });
  }
  const {
    practiceId,
    mode = 'text',
    audioLanguage = null,
    moodBefore = null,
    moodAfter = null,
    reflectionText = null,
  } = body;

  if (!practiceId) {
    return NextResponse.json<ApiError>({ error: 'Missing practiceId' }, { status: 400 });
  }

  try {
    const result = await transaction(async (conn) => {
      await conn.execute(
        `INSERT INTO user_practices
           (user_id, practice_id, mode, audio_language, mood_before, mood_after, reflection_text)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, practiceId, mode, audioLanguage, moodBefore, moodAfter, reflectionText]
      );

      const [[stats]] = await conn.query<UserPracticeStatsRow[]>(
        'SELECT * FROM user_practice_stats WHERE user_id = ?',
        [userId]
      );

      const streak = calculateStreak(
        stats?.last_practice_date ?? null,
        stats?.current_streak ?? 0
      );

      const isAudio = mode === 'audio' ? 1 : 0;

      await conn.execute(
        `UPDATE user_practice_stats
         SET current_streak   = ?,
             longest_streak   = GREATEST(longest_streak, ?),
             total_practices  = total_practices + 1,
             audio_practices  = audio_practices + ?,
             last_practice_date = CURDATE()
         WHERE user_id = ?`,
        [streak.current_streak, streak.longest_streak, isAudio, userId]
      );

      return { streak };
    });

    const score = await calculateEmotionalFitnessScore(userId);

    const response: PracticeCompleteResponse = {
      success: true,
      streak: result.streak,
      score,
    };

    return NextResponse.json<PracticeCompleteResponse>(response);
  } catch (error) {
    console.error('Practice completion error:', error);
    return NextResponse.json<ApiError>(
      { error: 'Failed to record practice' },
      { status: 500 }
    );
  }
}
