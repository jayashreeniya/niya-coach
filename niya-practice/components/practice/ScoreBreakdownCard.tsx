'use client';

import type { EmotionalFitnessCategory, ScoreBreakdown } from '@/types/database';

interface ScoreBreakdownCardProps {
  score: number;
  category: EmotionalFitnessCategory;
  breakdown: ScoreBreakdown;
}

const CATEGORY_INFO: Record<
  EmotionalFitnessCategory,
  { label: string; description: string; gradient: string }
> = {
  building: {
    label: 'Building',
    description: "You're laying the foundation",
    gradient: 'from-blue-500 to-sky-500',
  },
  developing: {
    label: 'Developing',
    description: "You're making progress",
    gradient: 'from-purple-500 to-niya-500',
  },
  strong: {
    label: 'Strong',
    description: "You're doing great",
    gradient: 'from-green-500 to-emerald-500',
  },
  peak: {
    label: 'Peak Fitness',
    description: "You're thriving",
    gradient: 'from-amber-500 to-orange-500',
  },
};

export function ScoreBreakdownCard({
  score,
  category,
  breakdown,
}: ScoreBreakdownCardProps) {
  const info = CATEGORY_INFO[category];

  return (
    <div>
      {/* Main score */}
      <div className={`rounded-2xl bg-gradient-to-br ${info.gradient} p-6 text-white text-center mb-6`}>
        <p className="text-sm opacity-80 mb-1">Emotional Fitness</p>
        <div className="flex items-end justify-center gap-2">
          <span className="text-6xl font-bold">{score}</span>
          <span className="text-xl opacity-70 mb-2">/100</span>
        </div>
        <p className="text-lg font-semibold mt-1">{info.label}</p>
        <p className="text-sm opacity-80">{info.description}</p>
      </div>

      {/* Component breakdown */}
      <div className="space-y-4">
        <ScoreBar
          label="Completion Rate"
          value={breakdown.components.completion}
          max={40}
          description="Practices completed (weight: 40%)"
          color="bg-blue-500"
        />
        <ScoreBar
          label="Mood Improvement"
          value={breakdown.components.mood}
          max={30}
          description="How you feel after practices (weight: 30%)"
          color="bg-green-500"
        />
        <ScoreBar
          label="Consistency"
          value={breakdown.components.consistency}
          max={30}
          description="Your current practice streak (weight: 30%)"
          color="bg-purple-500"
        />
      </div>
    </div>
  );
}

function ScoreBar({
  label,
  value,
  max,
  description,
  color,
}: {
  label: string;
  value: number;
  max: number;
  description: string;
  color: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">
          {value}/{max}
        </span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden mb-1">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}
