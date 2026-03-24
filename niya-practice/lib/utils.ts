import { type ClassValue, clsx } from 'clsx';

/**
 * Merge Tailwind classes safely (uses clsx; add tailwind-merge if needed).
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format seconds into "M:SS" display.
 */
export function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}
