'use client';

import { MOOD_OPTIONS } from '@/types/database';
import type { MoodSelectorProps } from '@/types/props';

export function MoodSelector({
  title,
  subtitle,
  onSelect,
  moods = MOOD_OPTIONS,
}: MoodSelectorProps) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
      <p className="text-sm text-gray-500 mb-10">{subtitle}</p>

      <div className="flex gap-4">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => onSelect(mood.value)}
            className="flex flex-col items-center gap-2 group"
          >
            <span className="text-4xl transition-transform group-hover:scale-125">
              {mood.emoji}
            </span>
            <span className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
              {mood.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
