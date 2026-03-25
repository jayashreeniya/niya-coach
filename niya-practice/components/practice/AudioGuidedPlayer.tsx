'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { VOICES, DEFAULT_PROSODY } from '@/types/tts';
import type { Practice, SupportedLanguage } from '@/types/database';

interface AudioGuidedPlayerProps {
  practice: Practice;
  userId: number;
  language: SupportedLanguage;
}

type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'gap' | 'done' | 'error';

export function AudioGuidedPlayer({
  practice,
  userId,
  language,
}: AudioGuidedPlayerProps) {
  const router = useRouter();
  const voiceInfo = VOICES[language];
  const steps = practice.instructions;

  const [stepIdx, setStepIdx] = useState(0);
  const [status, setStatus] = useState<PlayerStatus>('idle');
  const [gapCountdown, setGapCountdown] = useState(0);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const gapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gapIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  const stepIdxRef = useRef(0);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      clearGapTimers();
      if (audioRef.current) {
        audioRef.current.pause();
        const src = audioRef.current.src;
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
        if (src.startsWith('blob:')) URL.revokeObjectURL(src);
      }
    };
  }, []);

  const clearGapTimers = useCallback(() => {
    if (gapTimerRef.current) { clearTimeout(gapTimerRef.current); gapTimerRef.current = null; }
    if (gapIntervalRef.current) { clearInterval(gapIntervalRef.current); gapIntervalRef.current = null; }
  }, []);

  const getOrCreateAudio = useCallback((): HTMLAudioElement => {
    if (audioRef.current) return audioRef.current;
    const el = new Audio();
    el.preload = 'auto';
    audioRef.current = el;
    return el;
  }, []);

  const playStep = useCallback(
    async (idx: number) => {
      if (!mountedRef.current || idx >= steps.length) {
        setStatus('done');
        router.push(`/complete?practice=${practice.id}&mode=audio&lang=${language}`);
        return;
      }

      clearGapTimers();
      stepIdxRef.current = idx;
      const step = steps[idx];
      setStepIdx(idx);
      setStatus('loading');
      setProgress(0);

      const audio = getOrCreateAudio();

      const oldSrc = audio.src;
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      if (oldSrc.startsWith('blob:')) URL.revokeObjectURL(oldSrc);

      const startGapThenNext = (pauseSec: number) => {
        if (!mountedRef.current) return;
        setStatus('gap');
        setGapCountdown(pauseSec);
        let remaining = pauseSec;
        gapIntervalRef.current = setInterval(() => {
          remaining -= 1;
          if (mountedRef.current) setGapCountdown(Math.max(remaining, 0));
        }, 1000);
        gapTimerRef.current = setTimeout(() => {
          if (gapIntervalRef.current) clearInterval(gapIntervalRef.current);
          if (mountedRef.current) playStep(idx + 1);
        }, pauseSec * 1000);
      };

      try {
        const resp = await fetch('/api/tts/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: step.text,
            language,
            voice: voiceInfo.voice,
            speed: DEFAULT_PROSODY.rate,
          }),
        });

        if (!resp.ok) {
          console.warn(`[AudioPlayer] TTS returned ${resp.status}`);
          if (mountedRef.current) {
            setStatus('error');
            setErrorMsg(`Audio generation failed (${resp.status}). Tap Retry.`);
          }
          return;
        }

        const blob = await resp.blob();
        if (!mountedRef.current) return;

        const blobUrl = URL.createObjectURL(blob);
        audio.src = blobUrl;

        audio.ontimeupdate = () => {
          if (audio.duration > 0 && mountedRef.current) {
            setProgress(audio.currentTime / audio.duration);
          }
        };

        audio.onended = () => {
          if (blobUrl.startsWith('blob:')) URL.revokeObjectURL(blobUrl);
          startGapThenNext(step.pause_after ?? 3);
        };

        audio.onerror = () => {
          console.warn('[AudioPlayer] Audio element error');
          if (blobUrl.startsWith('blob:')) URL.revokeObjectURL(blobUrl);
          if (mountedRef.current) {
            setStatus('error');
            setErrorMsg('Audio playback failed. Tap Retry.');
          }
        };

        await audio.play();
        if (mountedRef.current) setStatus('playing');
      } catch (err: any) {
        console.warn('[AudioPlayer] Fetch/play failed:', err?.message);
        if (mountedRef.current) {
          setStatus('error');
          setErrorMsg('Could not play audio. Tap Retry.');
        }
      }
    },
    [steps, language, voiceInfo.voice, practice.id, router, clearGapTimers, getOrCreateAudio]
  );

  const handleStart = useCallback(() => {
    getOrCreateAudio();
    playStep(0);
  }, [getOrCreateAudio, playStep]);

  const handlePause = () => {
    audioRef.current?.pause();
    setStatus('paused');
  };

  const handleResume = () => {
    audioRef.current?.play().catch(() => {});
    setStatus('playing');
  };

  const handleSkip = () => {
    clearGapTimers();
    playStep(stepIdx + 1);
  };

  const handleRetry = () => {
    playStep(stepIdx);
  };

  const handleExit = () => {
    if (confirm('Are you sure you want to exit? Your progress will not be saved.')) {
      clearGapTimers();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
      }
      router.push('/practice');
    }
  };

  const currentStep = steps[stepIdx];
  const isLastStep = stepIdx === steps.length - 1;
  const overallProgress = ((stepIdx + progress) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-blue-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button onClick={handleExit} className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Exit</span>
        </button>
        <div className="text-center">
          <h2 className="font-semibold text-gray-900">{practice.title}</h2>
          <p className="text-xs text-gray-500">🎧 {voiceInfo.languageName} &middot; Audio Guided</p>
        </div>
        <div className="w-16" />
      </div>

      {/* Progress */}
      <div className="w-full bg-purple-100 h-1.5">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 transition-all duration-300" style={{ width: `${overallProgress}%` }} />
      </div>

      {/* Main */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-6">
          <p className="text-sm text-purple-600 font-medium mb-1">Step {stepIdx + 1} of {steps.length}</p>
          <h1 className="text-3xl font-bold text-gray-900">{currentStep?.title}</h1>
        </div>

        {/* Audio orb */}
        <div className="flex justify-center mb-8">
          <div className={`relative ${status === 'playing' ? 'animate-pulse-slow' : ''}`}>
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-200 to-blue-200 flex items-center justify-center">
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                <div className="text-white">
                  {status === 'loading' ? (
                    <svg className="w-16 h-16 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : status === 'paused' ? (
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                  ) : status === 'idle' ? (
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  ) : (
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  )}
                </div>
              </div>
            </div>
            {status === 'playing' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-56 h-56 rounded-full border-4 border-purple-300/30 animate-ping-slow" />
                <div className="absolute w-64 h-64 rounded-full border-4 border-blue-300/20 animate-ping-slower" />
              </div>
            )}
          </div>
        </div>

        {/* Status badges */}
        <div className="flex justify-center gap-2 mb-4">
          {status === 'gap' && gapCountdown > 0 && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">Silence &middot; {gapCountdown}s</span>
          )}
          {status === 'loading' && (
            <span className="text-xs text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">Generating audio...</span>
          )}
        </div>

        {/* Practice text */}
        {currentStep && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 border border-purple-100">
            <p className="text-lg text-gray-700 leading-relaxed text-center">{currentStep.text}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col items-center gap-4">
          {status === 'idle' ? (
            <button
              onClick={handleStart}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-12 py-4 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                Begin Session
              </span>
            </button>
          ) : (
            <button
              onClick={status === 'paused' ? handleResume : handlePause}
              disabled={status === 'loading' || status === 'gap'}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold px-12 py-4 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:transform-none disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Loading...
                </span>
              ) : status === 'paused' ? (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  Resume
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                  Pause
                </span>
              )}
            </button>
          )}

          {status !== 'idle' && !isLastStep && (
            <button onClick={handleSkip} disabled={status === 'loading'} className="text-gray-600 hover:text-gray-900 font-medium px-6 py-2 rounded-full hover:bg-gray-100 transition-all disabled:opacity-50">
              Skip this step &rarr;
            </button>
          )}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500 space-y-2">
          <p>🎧 Listen with headphones for the best experience</p>
          <p>⏸️ Pause anytime if you need a moment</p>
        </div>

        {status === 'error' && (
          <div className="mt-6 text-center">
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{errorMsg}</p>
            <button onClick={handleRetry} className="mt-2 text-sm text-purple-600 underline">Retry</button>
          </div>
        )}
      </div>
    </div>
  );
}
