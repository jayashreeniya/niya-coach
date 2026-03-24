import type { StreakData } from '@/types/database';

const MILESTONES = [3, 7, 14, 21, 30, 60, 90];

/**
 * Calculate the new streak after completing today's practice.
 *
 * @param lastPracticeDate  The user's last_practice_date (or null if never)
 * @param currentStreak     The user's current_streak value
 */
export function calculateStreak(
  lastPracticeDate: Date | null,
  currentStreak: number
): StreakData {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let newStreak: number;
  let streakIncreased = false;

  if (!lastPracticeDate) {
    newStreak = 1;
    streakIncreased = true;
  } else {
    const last = new Date(lastPracticeDate);
    last.setHours(0, 0, 0, 0);

    const diffMs = today.getTime() - last.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Already practiced today
      newStreak = currentStreak;
    } else if (diffDays === 1) {
      // Consecutive day
      newStreak = currentStreak + 1;
      streakIncreased = true;
    } else {
      // Streak broken — restart at 1
      newStreak = 1;
      streakIncreased = true;
    }
  }

  const isMilestone = MILESTONES.includes(newStreak);

  return {
    current_streak: newStreak,
    longest_streak: Math.max(newStreak, currentStreak),
    streak_increased: streakIncreased,
    is_milestone: isMilestone,
    milestone_day: isMilestone ? (newStreak as StreakData['milestone_day']) : undefined,
  };
}
