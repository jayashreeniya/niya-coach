import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getUserStats, getTodaysPractice, hasCompletedToday } from '@/lib/practice-queries';
import { getScoreCategory, getPracticePhase } from '@/lib/score';
import { PhaseIndicator } from '@/components/practice/PhaseIndicator';
import { StreakDisplay } from '@/components/practice/StreakDisplay';
import { PracticeCard } from '@/components/practice/PracticeCard';
import { ScoreWidget } from '@/components/practice/ScoreWidget';
import { CompletionMessage } from '@/components/practice/CompletionMessage';

export default async function PracticeDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect('/');

  const [stats, practice, completedToday] = await Promise.all([
    getUserStats(user.id),
    getTodaysPractice(user.id),
    hasCompletedToday(user.id),
  ]);

  const currentDay = (stats.total_practices % 90) + 1;
  const phase = getPracticePhase(currentDay);
  const category = getScoreCategory(stats.emotional_fitness_score);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.fullName.split(' ')[0]}
        </h1>
      </div>

      <PhaseIndicator
        phase={phase}
        dayNumber={currentDay}
        totalCompleted={stats.total_practices}
      />

      <StreakDisplay
        currentStreak={stats.current_streak}
        longestStreak={stats.longest_streak}
        dayNumber={currentDay}
      />

      {completedToday ? (
        <CompletionMessage
          message="Great work today! Come back tomorrow for your next practice."
          nextPractice={practice}
        />
      ) : (
        <PracticeCard
          practice={practice}
          phase={phase}
          dayNumber={currentDay}
          userId={user.id}
          preferredLanguage={stats.preferred_language}
        />
      )}

      <ScoreWidget
        score={stats.emotional_fitness_score}
        category={category}
      />
    </div>
  );
}
