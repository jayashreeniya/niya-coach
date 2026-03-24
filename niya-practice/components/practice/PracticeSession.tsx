'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { PracticeStep, PracticeMode, SupportedLanguage, MoodValue } from '@/types/database';
import type { PracticeSessionProps, SessionPhase } from '@/types/props';
import type { PracticeCompleteResponse } from '@/types/api';
import { VOICES } from '@/types/tts';
import { usePracticeTimer } from '@/hooks/usePracticeTimer';
import { usePracticeAudio } from '@/hooks/usePracticeAudio';
import { formatTime } from '@/lib/utils';
import { MoodSelector } from './MoodSelector';

export function PracticeSession({
  practice,
  userId,
  initialMode,
}: PracticeSessionProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<SessionPhase>('intro');
  const [mode] = useState<PracticeMode>(initialMode);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [moodBefore, setMoodBefore] = useState<MoodValue | null>(null);
  const [moodAfter, setMoodAfter] = useState<MoodValue | null>(null);
  const [reflection, setReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = practice.instructions;
  const currentStep: PracticeStep | undefined = steps[currentStepIdx];
  const isAudioMode = mode === 'audio';

  // ---- Text-mode timer ----
  const handleTextStepComplete = useCallback(() => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      setPhase('mood-after');
    }
  }, [currentStepIdx, steps.length]);

  const timer = usePracticeTimer({
    duration: currentStep?.duration_seconds ?? 60,
    onComplete: handleTextStepComplete,
  });

  // ---- Audio-mode orchestrator ----
  const practiceAudio = usePracticeAudio({
    steps,
    language,
    onStepComplete: (idx) => setCurrentStepIdx(idx + 1 < steps.length ? idx + 1 : idx),
    onAllStepsComplete: () => setPhase('mood-after'),
    enabled: isAudioMode,
  });

  // Pre-fetch audio on intro screen when in audio mode
  useEffect(() => {
    if (isAudioMode && phase === 'intro') {
      practiceAudio.prefetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAudioMode, phase]);

  const startPractice = () => {
    setPhase('mood-before');
  };

  const submitMoodBefore = (val: MoodValue) => {
    setMoodBefore(val);
    setPhase('practicing');
    if (isAudioMode) {
      practiceAudio.play(0);
    }
  };

  const submitCompletion = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/practice/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          practiceId: practice.id,
          mode,
          audioLanguage: isAudioMode ? language : null,
          moodBefore,
          moodAfter,
          reflectionText: reflection || null,
        }),
      });

      const data: PracticeCompleteResponse = await response.json();
      router.push(`/complete?day=${practice.day_number}&streak=${data.streak?.current_streak || 0}`);
    } catch (error) {
      console.error('Completion error:', error);
      setIsSubmitting(false);
    }
  };

  // ---- Intro ----
  if (phase === 'intro') {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <span className="text-xs uppercase tracking-wide text-niya-600 font-medium mb-2">
          Day {practice.day_number} of 90
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {practice.title}
        </h1>
        <p className="text-gray-600 max-w-md mb-6 leading-relaxed">
          {practice.description}
        </p>
        <p className="text-sm text-gray-400 mb-8">
          {practice.duration_minutes} minutes &middot; {steps.length} steps
        </p>

        {isAudioMode && (
          <div className="mb-6">
            <p className="text-xs text-gray-500 mb-2">Audio Language</p>
            <div className="flex gap-2">
              {(Object.keys(VOICES) as SupportedLanguage[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    language === lang
                      ? 'bg-niya-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {VOICES[lang].languageName}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={startPractice}
          className="rounded-xl bg-gradient-to-r from-niya-600 to-niya-700 px-10 py-3.5 text-sm font-medium text-white shadow-md hover:shadow-lg transition-all"
        >
          Begin Practice
        </button>
      </div>
    );
  }

  // ---- Mood before ----
  if (phase === 'mood-before') {
    return (
      <MoodSelector
        title="How are you feeling right now?"
        subtitle="Before we begin — there are no wrong answers."
        onSelect={submitMoodBefore}
      />
    );
  }

  // ---- Active practice ----
  if (phase === 'practicing' && currentStep) {
    const audioState = practiceAudio.state;
    const displayStep = isAudioMode
      ? steps[audioState.currentStepIndex] ?? currentStep
      : currentStep;
    const displayStepIdx = isAudioMode ? audioState.currentStepIndex : currentStepIdx;

    return (
      <div className="flex flex-col items-center py-8">
        {/* Step indicator */}
        <div className="flex gap-1.5 mb-6">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 w-8 rounded-full transition-colors ${
                idx === displayStepIdx
                  ? 'bg-niya-600'
                  : idx < displayStepIdx
                  ? 'bg-niya-300'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <h2 className="text-sm font-medium text-niya-600 uppercase tracking-wide mb-2">
          Step {displayStep.step}: {displayStep.title}
        </h2>

        {/* Audio source badge */}
        {isAudioMode && (
          <div className="flex items-center gap-2 mb-4">
            {audioState.source === 'azure' && (
              <span className="inline-flex items-center gap-1 text-xs text-niya-600 bg-niya-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-niya-500 animate-pulse" />
                Azure TTS
              </span>
            )}
            {audioState.source === 'browser' && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Browser Voice
              </span>
            )}
            {audioState.status === 'loading' && (
              <span className="text-xs text-gray-400">Generating audio...</span>
            )}
            {audioState.status === 'waiting' && audioState.pauseCountdown > 0 && (
              <span className="text-xs text-gray-400">
                Silence... {audioState.pauseCountdown}s
              </span>
            )}
          </div>
        )}

        {/* Timer / progress circle */}
        <div className="relative w-40 h-40 mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="45"
              fill="none" stroke="#e5e7eb" strokeWidth="4"
            />
            <circle
              cx="50" cy="50" r="45"
              fill="none" stroke="#9333ea" strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${
                2 * Math.PI * 45 * (1 - (isAudioMode ? audioState.progress : timer.progress))
              }`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {isAudioMode ? (
              <div className="text-center">
                {audioState.status === 'loading' ? (
                  <div className="w-8 h-8 border-2 border-niya-200 border-t-niya-600 rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="text-lg">
                      {audioState.status === 'playing' ? '🎧' : audioState.status === 'paused' ? '⏸' : '⏳'}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {Math.round(audioState.progress * 100)}%
                    </p>
                  </>
                )}
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-900 tabular-nums">
                {formatTime(timer.timeRemaining)}
              </span>
            )}
          </div>
        </div>

        {/* Text content */}
        <div className="max-w-lg mx-auto mb-8">
          <p className="text-gray-700 leading-relaxed text-center text-sm">
            {displayStep.text.length > 400
              ? displayStep.text.slice(0, 400) + '...'
              : displayStep.text}
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {isAudioMode ? (
            <>
              <button
                onClick={
                  audioState.status === 'paused'
                    ? practiceAudio.resume
                    : practiceAudio.pause
                }
                disabled={audioState.status === 'loading'}
                className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40"
              >
                {audioState.status === 'paused' ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={practiceAudio.skipStep}
                className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Skip Step
              </button>
              <button
                onClick={() => {
                  practiceAudio.stop();
                  setPhase('mood-after');
                }}
                className="rounded-xl border border-red-100 px-6 py-2.5 text-sm font-medium text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                End Early
              </button>
            </>
          ) : (
            <>
              <button
                onClick={timer.togglePlayPause}
                className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {timer.isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={timer.skip}
                className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Skip Step
              </button>
            </>
          )}
        </div>

        {/* Audio error fallback message */}
        {isAudioMode && audioState.status === 'error' && (
          <p className="mt-4 text-xs text-red-500 bg-red-50 rounded-lg px-4 py-2 max-w-sm text-center">
            {audioState.errorMessage}
          </p>
        )}
      </div>
    );
  }

  // ---- Mood after ----
  if (phase === 'mood-after') {
    return (
      <MoodSelector
        title="How do you feel now?"
        subtitle="After the practice — notice any shifts."
        onSelect={(val: MoodValue) => {
          setMoodAfter(val);
          setPhase('reflection');
        }}
      />
    );
  }

  // ---- Reflection ----
  return (
    <div className="flex flex-col items-center py-12 text-center max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        Any reflections?
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Optional — write a few words about your experience today.
      </p>

      <textarea
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        placeholder="Today I noticed..."
        maxLength={500}
        rows={4}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-niya-400 focus:ring-2 focus:ring-niya-100 outline-none resize-none mb-6"
      />

      <button
        onClick={submitCompletion}
        disabled={isSubmitting}
        className="w-full rounded-xl bg-gradient-to-r from-niya-600 to-niya-700 px-6 py-3.5 text-sm font-medium text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Complete Practice'}
      </button>

      <button
        onClick={submitCompletion}
        disabled={isSubmitting}
        className="mt-2 text-xs text-gray-400 hover:text-gray-600"
      >
        Skip &amp; Complete
      </button>
    </div>
  );
}
