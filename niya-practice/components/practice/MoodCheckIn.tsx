'use client';

import { MOOD_OPTIONS } from '@/types/database';
import type { MoodValue } from '@/types/database';

interface MoodCheckInProps {
  value: MoodValue | null;
  onChange: (value: MoodValue) => void;
}

export function MoodCheckIn({ value, onChange }: MoodCheckInProps) {
  return (
    <div className="flex justify-center gap-3">
      {MOOD_OPTIONS.map((mood) => (
        <button
          key={mood.value}
          onClick={() => onChange(mood.value)}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
            value === mood.value
              ? 'bg-niya-100 ring-2 ring-niya-500 scale-110'
              : 'hover:bg-gray-50 hover:scale-105'
          }`}
        >
          <span className="text-3xl">{mood.emoji}</span>
          <span
            className={`text-xs ${
              value === mood.value
                ? 'font-semibold text-niya-700'
                : 'text-gray-400'
            }`}
          >
            {mood.label}
          </span>
        </button>
      ))}
    </div>
  );
}
