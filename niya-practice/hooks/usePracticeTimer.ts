'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UsePracticeTimerProps {
  duration: number;
  onComplete: () => void;
}

export function usePracticeTimer({ duration, onComplete }: UsePracticeTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const progress = 1 - timeRemaining / duration;

  useEffect(() => {
    setTimeRemaining(duration);
    setIsPlaying(true);
    setIsPaused(false);
  }, [duration]);

  useEffect(() => {
    if (isPlaying && !isPaused && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, isPaused, timeRemaining, onComplete]);

  const togglePlayPause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const skip = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeRemaining(0);
    onComplete();
  }, [onComplete]);

  return { timeRemaining, isPlaying, isPaused, progress, togglePlayPause, skip };
}
