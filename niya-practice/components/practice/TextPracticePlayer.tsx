'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePracticeTimer } from '@/hooks/usePracticeTimer';
import { BreathingAnimation } from './BreathingAnimation';
import { formatTime } from '@/lib/utils';
import type { Practice } from '@/types/database';

interface TextPracticePlayerProps {
  practice: Practice;
  userId: number;
}

export function TextPracticePlayer({ practice, userId }: TextPracticePlayerProps) {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = practice.instructions[currentStepIndex];
  const isLastStep = currentStepIndex === practice.instructions.length - 1;
  const showBreathingAnimation =
    currentStep.title === 'Settle' || currentStep.title === 'Reflect';

  const { timeRemaining, isPlaying, isPaused, progress, togglePlayPause, skip } =
    usePracticeTimer({
      duration: currentStep.duration_seconds,
      onComplete: () => {
        if (isLastStep) {
          router.push(`/complete?practice=${practice.id}&mode=text`);
        } else {
          setCurrentStepIndex((prev) => prev + 1);
        }
      },
    });

  const handleExit = () => {
    if (confirm('Are you sure you want to exit? Your progress will not be saved.')) {
      router.push('/practice');
    }
  };

  const overallProgress =
    ((currentStepIndex + progress) / practice.instructions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={handleExit}
          className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Exit</span>
        </button>
        <h2 className="font-semibold text-gray-900">{practice.title}</h2>
        <div className="w-12" />
      </div>

      {/* Progress */}
      <div className="w-full bg-gray-200 h-1">
        <div
          className="bg-blue-500 h-1 transition-all duration-300"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      {/* Main */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 mb-2">
            Step {currentStepIndex + 1} of {practice.instructions.length}
          </p>
          <h1 className="text-2xl font-bold text-gray-900">{currentStep.title}</h1>
        </div>

        {showBreathingAnimation && (
          <div className="mb-8">
            <BreathingAnimation isPlaying={isPlaying && !isPaused} />
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
            {currentStep.text}
          </p>
        </div>

        <div className="text-center mb-8">
          <div className="text-5xl font-bold text-blue-600 mb-2 tabular-nums">
            {formatTime(timeRemaining)}
          </div>
          <p className="text-sm text-gray-500">
            {Math.floor(currentStep.duration_seconds / 60)} minute
            {currentStep.duration_seconds >= 120 ? 's' : ''} for this step
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={togglePlayPause}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>

          {!isLastStep && (
            <button
              onClick={skip}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-full font-semibold transition-colors"
            >
              Skip Step &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
