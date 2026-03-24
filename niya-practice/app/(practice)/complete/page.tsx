'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { completePractice } from '@/lib/practice-actions';
import { MoodCheckIn } from '@/components/practice/MoodCheckIn';
import { ReflectionInput } from '@/components/practice/ReflectionInput';
import { useWindowSize } from '@/hooks/useWindowSize';
import type { PracticeMode, SupportedLanguage, MoodValue } from '@/types/database';

const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

export default function CompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const practiceId = searchParams.get('practice');
  const dayParam = searchParams.get('day');
  const mode = (searchParams.get('mode') || 'text') as PracticeMode;
  const lang = searchParams.get('lang') as SupportedLanguage | null;
  const streakParam = searchParams.get('streak');
  const { width, height } = useWindowSize();

  const [mood, setMood] = useState<MoodValue | null>(null);
  const [reflection, setReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [streakInfo, setStreakInfo] = useState<{
    current_streak: number;
    streak_increased: boolean;
    is_milestone: boolean;
  } | null>(
    streakParam
      ? { current_streak: parseInt(streakParam), streak_increased: true, is_milestone: false }
      : null
  );

  if (!practiceId && !dayParam) {
    router.push('/practice');
    return null;
  }

  const handleSubmit = async () => {
    if (!mood) return;

    setIsSubmitting(true);

    try {
      const result = await completePractice({
        practiceId: parseInt(practiceId || '0', 10),
        mode,
        audioLanguage: mode === 'audio' ? lang || 'en' : undefined,
        moodAfter: mood,
        reflectionText: reflection || null,
      });

      setStreakInfo(result);

      if (result.streak_increased || result.is_milestone) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }

      setTimeout(() => {
        router.push('/practice');
      }, 3000);
    } catch (error) {
      console.error('Failed to save practice:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}

      <div className="max-w-md w-full">
        {/* Success icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Practice Complete!
          </h1>
          {mode === 'audio' && (
            <p className="text-sm text-purple-600">
              🎧 Audio-guided practice completed
            </p>
          )}
          {streakInfo && streakInfo.is_milestone && (
            <p className="text-lg text-green-600 font-semibold mt-2">
              🎉 {streakInfo.current_streak} Day Streak!
            </p>
          )}
        </div>

        {!streakInfo ? (
          <>
            {/* Mood check-in */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                How do you feel after this practice?
              </h2>
              <MoodCheckIn value={mood} onChange={setMood} />
            </div>

            {/* Reflection */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Any reflections? (Optional)
              </h2>
              <ReflectionInput
                value={reflection}
                onChange={setReflection}
                maxLength={200}
                placeholder="What did you notice during this practice?"
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!mood || isSubmitting}
              className="w-full bg-gradient-to-r from-niya-600 to-niya-700 hover:from-niya-700 hover:to-niya-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 rounded-xl transition-colors shadow-md"
            >
              {isSubmitting ? 'Saving...' : 'Done for Today'}
            </button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              {streakInfo.streak_increased
                ? `Great work! You're on a ${streakInfo.current_streak} day streak.`
                : 'You completed today\'s practice!'}
            </p>
            <p className="text-sm text-gray-500">Redirecting to home...</p>
          </div>
        )}
      </div>
    </div>
  );
}
