'use client';

import type { PracticePhase } from '@/types/database';
import { PHASE_RANGES } from '@/types/database';

interface PhaseIndicatorProps {
  phase: PracticePhase;
  dayNumber: number;
  totalCompleted: number;
}

const PHASE_CONFIG: Record<PracticePhase, { color: string; bg: string; icon: string; description: string }> = {
  Foundation: {
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
    icon: '🌱',
    description: 'Awareness & Regulation',
  },
  Development: {
    color: 'text-purple-700',
    bg: 'bg-purple-50 border-purple-200',
    icon: '🌿',
    description: 'Skills & Meaning',
  },
  Integration: {
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    icon: '🌳',
    description: 'Meaning & Sustainability',
  },
};

export function PhaseIndicator({ phase, dayNumber, totalCompleted }: PhaseIndicatorProps) {
  const config = PHASE_CONFIG[phase];
  const range = PHASE_RANGES[phase];
  const phaseProgress = ((dayNumber - range.start) / (range.end - range.start + 1)) * 100;

  return (
    <div className={`rounded-xl border p-4 mb-6 ${config.bg}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{config.icon}</span>
          <div>
            <h3 className={`font-semibold text-sm ${config.color}`}>
              {phase} Phase
            </h3>
            <p className="text-xs text-gray-500">{config.description}</p>
          </div>
        </div>
        <span className={`text-xs font-medium ${config.color}`}>
          Day {dayNumber} of 90
        </span>
      </div>

      <div className="h-1.5 rounded-full bg-white/60 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-niya-500 to-blue-500 transition-all duration-500"
          style={{ width: `${phaseProgress}%` }}
        />
      </div>

      <div className="flex justify-between mt-1.5 text-xs text-gray-400">
        <span>Day {range.start}</span>
        <span>Day {range.end}</span>
      </div>
    </div>
  );
}
