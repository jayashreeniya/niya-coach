'use client';

import { useState, useRef, useCallback } from 'react';
import type { SupportedLanguage } from '@/types/database';
import type {
  AudioPlaybackStatus,
  AudioPlaybackState,
  TTSResponse,
} from '@/types/tts';
import { INITIAL_PLAYBACK_STATE, DEFAULT_PROSODY } from '@/types/tts';

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

interface UseAudioPlayerProps {
  voice: string;
  language: SupportedLanguage;
  onStepComplete: () => void;
}

export interface UseAudioPlayerReturn {
  playStep: (text: string, pauseAfter?: number) => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  seekTo: (position: number) => void;
  state: AudioPlaybackState;
  /** Convenience aliases */
  isLoading: boolean;
  progress: number;
}

export function useAudioPlayer({
  voice,
  language,
  onStepComplete,
}: UseAudioPlayerProps): UseAudioPlayerReturn {
  const [state, setState] = useState<AudioPlaybackState>(INITIAL_PLAYBACK_STATE);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateStatus = (status: AudioPlaybackStatus, extra?: Partial<AudioPlaybackState>) => {
    setState((prev) => ({ ...prev, status, ...extra }));
  };

  const playStep = useCallback(
    async (text: string, pauseAfter: number = 3) => {
      updateStatus('loading', { progress: 0, currentTime: 0, duration: 0 });

      try {
        const response = await fetch('/api/tts/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            language,
            voice,
            speed: DEFAULT_PROSODY.rate,
          }),
        });

        if (!response.ok) throw new Error('TTS generation failed');

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const audio = new Audio(blobUrl);
        audioRef.current = audio;

        audio.onloadedmetadata = () => {
          updateStatus('playing', { duration: audio.duration });
          audio.play();
        };

        audio.ontimeupdate = () => {
          if (audio.duration) {
            setState((prev) => ({
              ...prev,
              progress: audio.currentTime / audio.duration,
              currentTime: audio.currentTime,
            }));
          }
        };

        audio.onended = () => {
          updateStatus('waiting', { progress: 1 });
          pauseTimeoutRef.current = setTimeout(() => {
            updateStatus('complete', { progress: 0, currentTime: 0 });
            onStepComplete();
          }, pauseAfter * 1000);
        };

        audio.onerror = () => {
          updateStatus('error', { errorMessage: 'Audio playback failed' });
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Audio playback error';
        updateStatus('error', { errorMessage: message });
      }
    },
    [voice, language, onStepComplete]
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
    updateStatus('paused');
  }, []);

  const resume = useCallback(() => {
    audioRef.current?.play();
    updateStatus('playing');
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    setState(INITIAL_PLAYBACK_STATE);
  }, []);

  const seekTo = useCallback((position: number) => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = position * audioRef.current.duration;
    }
  }, []);

  return {
    playStep,
    pause,
    resume,
    stop,
    seekTo,
    state,
    isLoading: state.status === 'loading',
    progress: state.progress,
  };
}
