'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { SupportedLanguage, PracticeStep } from '@/types/database';
import type { AudioPlaybackState, AudioPlaybackStatus, TTSResponse } from '@/types/tts';
import { VOICES, DEFAULT_PROSODY, INITIAL_PLAYBACK_STATE } from '@/types/tts';
import {
  isSpeechSynthesisAvailable,
  speakWithFallback,
  cancelCurrent,
} from '@/lib/speech-fallback';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function dataUriToBlobUrl(dataUri: string): string {
  try {
    const [header, base64] = dataUri.split(',');
    const mime = header?.match(/:(.*?);/)?.[1] || 'audio/mpeg';
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return URL.createObjectURL(new Blob([bytes], { type: mime }));
  } catch {
    return dataUri;
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AudioSource = 'azure' | 'browser' | 'none';

export interface PracticeAudioState extends AudioPlaybackState {
  /** Which TTS engine is active */
  source: AudioSource;
  /** Whether Azure TTS is available for this session */
  azureAvailable: boolean;
  /** Whether browser speech fallback is available */
  browserFallbackAvailable: boolean;
  /** Total steps in the practice */
  totalSteps: number;
  /** Seconds remaining in the post-step silence gap */
  pauseCountdown: number;
}

export interface UsePracticeAudioProps {
  steps: PracticeStep[];
  language: SupportedLanguage;
  /** Called when each step finishes (including pause gap) */
  onStepComplete: (stepIndex: number) => void;
  /** Called when all steps have finished playing */
  onAllStepsComplete: () => void;
  enabled?: boolean;
}

export interface UsePracticeAudioReturn {
  state: PracticeAudioState;
  /** Start playing from the given step index (default 0) */
  play: (fromStep?: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  /** Skip to next step immediately (cancels pause gap) */
  skipStep: () => void;
  /** Pre-fetch all step audio into server cache */
  prefetch: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function usePracticeAudio({
  steps,
  language,
  onStepComplete,
  onAllStepsComplete,
  enabled = true,
}: UsePracticeAudioProps): UsePracticeAudioReturn {
  const voice = VOICES[language];

  const [state, setState] = useState<PracticeAudioState>({
    ...INITIAL_PLAYBACK_STATE,
    source: 'none',
    azureAvailable: true,
    browserFallbackAvailable: false,
    totalSteps: steps.length,
    pauseCountdown: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pauseIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const browserControlsRef = useRef<ReturnType<typeof speakWithFallback> | null>(null);
  const prefetchedRef = useRef<Map<number, TTSResponse>>(new Map());
  const isPausedRef = useRef(false);

  useEffect(() => {
    setState((p) => ({
      ...p,
      browserFallbackAvailable: isSpeechSynthesisAvailable(),
      totalSteps: steps.length,
    }));
  }, [steps.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
      cancelCurrent();
    };
  }, []);

  const updateState = useCallback(
    (patch: Partial<PracticeAudioState>) => {
      setState((prev) => ({ ...prev, ...patch }));
    },
    []
  );

  // ---- Cleanup helpers ----

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      const src = audioRef.current.src;
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current = null;
      if (src.startsWith('blob:')) URL.revokeObjectURL(src);
    }
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    if (pauseIntervalRef.current) clearInterval(pauseIntervalRef.current);
    browserControlsRef.current?.cancel();
    browserControlsRef.current = null;
  }, []);

  // ---- Advance to next step or finish ----

  const advanceStep = useCallback(
    (completedIndex: number) => {
      onStepComplete(completedIndex);

      const nextIndex = completedIndex + 1;
      if (nextIndex >= steps.length) {
        updateState({ status: 'complete', pauseCountdown: 0 });
        onAllStepsComplete();
      } else {
        playStepByIndex(nextIndex);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [steps.length, onStepComplete, onAllStepsComplete]
  );

  // ---- Post-step silence gap ----

  const startPauseGap = useCallback(
    (stepIndex: number, pauseSeconds: number) => {
      updateState({ status: 'waiting', progress: 1, pauseCountdown: pauseSeconds });

      let remaining = pauseSeconds;
      pauseIntervalRef.current = setInterval(() => {
        remaining -= 1;
        updateState({ pauseCountdown: Math.max(remaining, 0) });
      }, 1000);

      pauseTimerRef.current = setTimeout(() => {
        if (pauseIntervalRef.current) clearInterval(pauseIntervalRef.current);
        updateState({ pauseCountdown: 0 });
        advanceStep(stepIndex);
      }, pauseSeconds * 1000);
    },
    [advanceStep, updateState]
  );

  // ---- Play a single step via Azure TTS ----

  const playStepAzure = useCallback(
    async (stepIndex: number, step: PracticeStep) => {
      updateState({
        status: 'loading',
        currentStepIndex: stepIndex,
        progress: 0,
        currentTime: 0,
        duration: 0,
        source: 'azure',
      });

      try {
        let audioSrc: string | undefined;
        const cached = prefetchedRef.current.get(stepIndex);

        if (cached) {
          audioSrc = dataUriToBlobUrl(cached.audioUrl);
        } else {
          const resp = await fetch('/api/tts/stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: step.text,
              language,
              voice: voice.voice,
              speed: DEFAULT_PROSODY.rate,
            }),
          });

          if (!resp.ok) throw new Error(`TTS API returned ${resp.status}`);
          const blob = await resp.blob();
          audioSrc = URL.createObjectURL(blob);
        }

        const audio = new Audio(audioSrc);
        audioRef.current = audio;

        audio.onloadedmetadata = () => {
          if (!isPausedRef.current) {
            updateState({ status: 'playing', duration: audio.duration });
            audio.play().catch(() => {});
          }
        };

        audio.ontimeupdate = () => {
          if (audio.duration) {
            updateState({
              progress: audio.currentTime / audio.duration,
              currentTime: audio.currentTime,
            });
          }
        };

        audio.onended = () => {
          const pauseAfter = step.pause_after ?? 3;
          startPauseGap(stepIndex, pauseAfter);
        };

        audio.onerror = () => {
          console.warn('Azure audio playback failed, trying browser fallback');
          updateState({ azureAvailable: false });
          playStepBrowser(stepIndex, step);
        };
      } catch (err) {
        console.warn('Azure TTS request failed, trying browser fallback:', err);
        updateState({ azureAvailable: false });
        playStepBrowser(stepIndex, step);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language, voice.voice, startPauseGap, updateState]
  );

  // ---- Play a single step via browser speech synthesis ----

  const playStepBrowser = useCallback(
    (stepIndex: number, step: PracticeStep) => {
      if (!isSpeechSynthesisAvailable()) {
        updateState({
          status: 'error',
          errorMessage: 'No TTS engine available. Try text mode instead.',
          source: 'none',
        });
        return;
      }

      updateState({
        status: 'playing',
        currentStepIndex: stepIndex,
        progress: 0,
        source: 'browser',
      });

      const controls = speakWithFallback({
        text: step.text,
        language,
        onEnd: () => {
          const pauseAfter = step.pause_after ?? 3;
          startPauseGap(stepIndex, pauseAfter);
        },
        onError: (error) => {
          updateState({
            status: 'error',
            errorMessage: `Speech failed: ${error}`,
          });
        },
        onBoundary: (charIndex) => {
          const total = step.text.length;
          if (total > 0) {
            updateState({ progress: charIndex / total });
          }
        },
      });

      browserControlsRef.current = controls;
    },
    [language, startPauseGap, updateState]
  );

  // ---- Main play-step dispatcher ----

  const playStepByIndex = useCallback(
    (index: number) => {
      const step = steps[index];
      if (!step) return;

      cleanupAudio();
      isPausedRef.current = false;

      if (state.azureAvailable) {
        playStepAzure(index, step);
      } else {
        playStepBrowser(index, step);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [steps, state.azureAvailable, playStepAzure, playStepBrowser, cleanupAudio]
  );

  // ---- Public controls ----

  const play = useCallback(
    (fromStep: number = 0) => {
      if (!enabled) return;
      playStepByIndex(fromStep);
    },
    [enabled, playStepByIndex]
  );

  const pause = useCallback(() => {
    isPausedRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    browserControlsRef.current?.pause();
    updateState({ status: 'paused' });
  }, [updateState]);

  const resume = useCallback(() => {
    isPausedRef.current = false;
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    browserControlsRef.current?.resume();
    updateState({ status: 'playing' });
  }, [updateState]);

  const stop = useCallback(() => {
    cleanupAudio();
    cancelCurrent();
    isPausedRef.current = false;
    setState({
      ...INITIAL_PLAYBACK_STATE,
      source: 'none',
      azureAvailable: state.azureAvailable,
      browserFallbackAvailable: state.browserFallbackAvailable,
      totalSteps: steps.length,
      pauseCountdown: 0,
    });
  }, [cleanupAudio, state.azureAvailable, state.browserFallbackAvailable, steps.length]);

  const skipStep = useCallback(() => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    if (pauseIntervalRef.current) clearInterval(pauseIntervalRef.current);
    cleanupAudio();
    cancelCurrent();
    advanceStep(state.currentStepIndex);
  }, [cleanupAudio, advanceStep, state.currentStepIndex]);

  const prefetch = useCallback(async () => {
    const promises = steps.map(async (step, idx) => {
      try {
        const resp = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: step.text,
            language,
            voice: voice.voice,
            speed: DEFAULT_PROSODY.rate,
          }),
        });
        if (resp.ok) {
          const data: TTSResponse = await resp.json();
          prefetchedRef.current.set(idx, data);
        }
      } catch {
        // Pre-fetch failure is non-critical; will fetch on demand
      }
    });
    await Promise.allSettled(promises);
  }, [steps, language, voice.voice]);

  return {
    state,
    play,
    pause,
    resume,
    stop,
    skipStep,
    prefetch,
  };
}
