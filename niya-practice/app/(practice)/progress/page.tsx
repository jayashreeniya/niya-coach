import { requireAuth } from '@/lib/auth';
import {
  getUserStats,
  getCompletionHistory,
  getUserReminders,
} from '@/lib/practice-queries';
import { getScoreCategory, getPracticePhase, getScoreBreakdown } from '@/lib/score';
import { queryRows } from '@/lib/db';
import type { UserPracticeRow } from '@/types/database';
import { CalendarHeatmap } from '@/components/practice/CalendarHeatmap';
import { ScoreBreakdownCard } from '@/components/practice/ScoreBreakdownCard';
import { SettingsForm } from '@/components/practice/SettingsForm';
import { CoachingLink } from '@/components/integration/CoachingLink';

export default async function ProgressPage() {
  const user = await requireAuth();

  const [stats, history, scoreBreakdown, reminders] = await Promise.all([
    getUserStats(user.id),
    getCompletionHistory(user.id, 30),
    getScoreBreakdown(user.id),
    getUserReminders(user.id),
  ]);

  const dayNumber = (stats.total_practices % 90) + 1;
  const phase = getPracticePhase(dayNumber);
  const category = getScoreCategory(scoreBreakdown.score);

  const recentPractices = await queryRows<UserPracticeRow>(
    `SELECT up.*, p.title, p.day_number
     FROM user_practices up
     JOIN practices p ON p.id = up.practice_id
     WHERE up.user_id = ?
     ORDER BY up.completed_at DESC
     LIMIT 10`,
    [user.id]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Progress</h1>
        <p className="text-sm text-gray-500 mt-1">
          Day {dayNumber} of 90 &middot; {phase} Phase
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile
          label="Current Streak"
          value={`${stats.current_streak}`}
          unit="days"
          icon="🔥"
        />
        <StatTile
          label="Longest Streak"
          value={`${stats.longest_streak}`}
          unit="days"
          icon="🏆"
        />
        <StatTile
          label="Total Practices"
          value={`${stats.total_practices}`}
          icon="📊"
        />
        <StatTile
          label="Audio Sessions"
          value={`${stats.audio_practices}`}
          icon="🎧"
        />
      </div>

      {/* Calendar heatmap */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Last 30 Days
        </h2>
        <CalendarHeatmap
          completionDates={history.map((d) => d.toISOString())}
        />
      </div>

      {/* Emotional fitness score breakdown */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Emotional Fitness Score
        </h2>
        <ScoreBreakdownCard
          score={scoreBreakdown.score}
          category={category}
          breakdown={scoreBreakdown}
        />
      </div>

      {/* Recent practice history */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Practices
        </h2>
        {recentPractices.length === 0 ? (
          <p className="text-sm text-gray-500">
            No practices yet. Start your first one today!
          </p>
        ) : (
          <div className="space-y-2">
            {recentPractices.map((rp: any) => (
              <div
                key={rp.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Day {rp.day_number}: {rp.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(rp.completed_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                    {rp.mode === 'audio' ? ' · 🎧 Audio' : ' · 📖 Text'}
                  </p>
                </div>
                {rp.mood_after && (
                  <span className="text-lg">
                    {rp.mood_after >= 4
                      ? '😊'
                      : rp.mood_after >= 3
                        ? '😌'
                        : '😔'}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coaching CTA */}
      <CoachingLink />

      {/* Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
        <SettingsForm userId={user.id} initialSettings={reminders} />
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  unit,
  icon,
}: {
  label: string;
  value: string;
  unit?: string;
  icon: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900">
        {value}
        {unit && (
          <span className="text-xs font-normal text-gray-400 ml-1">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}
