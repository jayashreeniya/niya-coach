'use client';

import type { EmotionalFitnessCategory } from '@/types/database';

interface ScoreWidgetProps {
  score: number;
  category: EmotionalFitnessCategory;
}

const CATEGORY_CONFIG: Record<EmotionalFitnessCategory, { label: string; color: string }> = {
  building: { label: 'Building', color: 'text-blue-600' },
  developing: { label: 'Developing', color: 'text-purple-600' },
  strong: { label: 'Strong', color: 'text-green-600' },
  peak: { label: 'Peak Fitness', color: 'text-amber-600' },
};

export function ScoreWidget({ score, category }: ScoreWidgetProps) {
  const config = CATEGORY_CONFIG[category];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-500">Emotional Fitness</h3>
        <span className={`text-xs font-semibold capitalize ${config.color}`}>
          {config.label}
        </span>
      </div>

      <div className="flex items-end gap-2 mb-3">
        <span className="text-3xl font-bold text-gray-900">{score}</span>
        <span className="text-sm text-gray-400 mb-1">/100</span>
      </div>

      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-niya-500 to-blue-500 transition-all duration-700"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
