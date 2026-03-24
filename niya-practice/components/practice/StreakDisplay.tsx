'use client';

import { MILESTONE_DAYS } from '@/types/database';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  dayNumber: number;
}

export function StreakDisplay({ currentStreak, longestStreak, dayNumber }: StreakDisplayProps) {
  const isMilestone = (MILESTONE_DAYS as readonly number[]).includes(currentStreak);
  const nextMilestone = (MILESTONE_DAYS as readonly number[]).find((m) => m > currentStreak) ?? 90;

  return (
    <div className="flex items-center gap-4 mb-6">
      {/* Current streak */}
      <div className="flex-1 rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🔥</span>
          <span className="text-2xl font-bold text-gray-900">{currentStreak}</span>
        </div>
        <p className="text-xs text-gray-500">Day Streak</p>
        {isMilestone && currentStreak > 0 && (
          <p className="text-xs font-medium text-orange-600 mt-1">
            Milestone reached!
          </p>
        )}
        {!isMilestone && currentStreak > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            Next: {nextMilestone} days
          </p>
        )}
      </div>

      {/* Longest streak */}
      <div className="flex-1 rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50 to-niya-50 p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🏆</span>
          <span className="text-2xl font-bold text-gray-900">{longestStreak}</span>
        </div>
        <p className="text-xs text-gray-500">Longest Streak</p>
      </div>

      {/* Total progress */}
      <div className="flex-1 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50 p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">📅</span>
          <span className="text-2xl font-bold text-gray-900">{dayNumber}</span>
        </div>
        <p className="text-xs text-gray-500">Current Day</p>
      </div>
    </div>
  );
}
