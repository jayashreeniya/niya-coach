import type {
  Practice,
  PracticeMode,
  SupportedLanguage,
  MoodValue,
  MoodOption,
  UserPracticeStats,
  UserPracticeWithDetails,
  PracticePhase,
  EmotionalFitnessCategory,
  ScoreBreakdown,
  PracticeStep,
} from './database';
import type { AuthUser } from '@/lib/auth';

// ---------------------------------------------------------------------------
// Layout / navigation
// ---------------------------------------------------------------------------

export interface NavBarProps {
  user: AuthUser;
}

// ---------------------------------------------------------------------------
// Auth components
// ---------------------------------------------------------------------------

export interface LoginButtonProps {
  /** Override the default list of providers shown */
  providers?: ('google' | 'apple' | 'microsoft')[];
  /** Where to redirect after successful login */
  callbackUrl?: string;
}

// ---------------------------------------------------------------------------
// Practice session
// ---------------------------------------------------------------------------

export interface PracticeSessionProps {
  practice: Practice;
  userId: number;
  initialMode: PracticeMode;
}

export type SessionPhase =
  | 'intro'
  | 'mood-before'
  | 'practicing'
  | 'mood-after'
  | 'reflection';

export interface PracticeIntroProps {
  practice: Practice;
  mode: PracticeMode;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onStart: () => void;
}

export interface PracticeStepViewProps {
  step: PracticeStep;
  stepIndex: number;
  totalSteps: number;
  mode: PracticeMode;
  timeRemaining: number;
  progress: number;
  isPaused: boolean;
  isAudioLoading?: boolean;
  audioProgress?: number;
  onTogglePause: () => void;
  onSkip: () => void;
}

// ---------------------------------------------------------------------------
// Mood
// ---------------------------------------------------------------------------

export interface MoodSelectorProps {
  title: string;
  subtitle: string;
  onSelect: (value: MoodValue) => void;
  /** Optional list of moods to display (defaults to all 5) */
  moods?: readonly MoodOption[];
}

// ---------------------------------------------------------------------------
// Progress / stats
// ---------------------------------------------------------------------------

export interface ScoreCardProps {
  score: number;
  category: EmotionalFitnessCategory;
  breakdown?: ScoreBreakdown['components'];
  /** Show animated fill on mount */
  animate?: boolean;
}

export interface StatTileProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: string;
  /** Colour accent: 'purple' | 'blue' | 'green' | 'amber' */
  accent?: string;
}

export interface StreakBadgeProps {
  currentStreak: number;
  longestStreak: number;
  isMilestone?: boolean;
}

export interface ProgressBarProps {
  /** 0-100 percentage */
  value: number;
  label?: string;
  /** Show percentage text on the right */
  showPercent?: boolean;
  className?: string;
}

export interface PracticeHistoryListProps {
  practices: UserPracticeWithDetails[];
  emptyMessage?: string;
}

export interface PracticeHistoryItemProps {
  practice: UserPracticeWithDetails;
}

// ---------------------------------------------------------------------------
// Completion / celebration
// ---------------------------------------------------------------------------

export interface CompletionCardProps {
  dayNumber: number;
  streak: number;
  score: number;
  category: EmotionalFitnessCategory;
  totalPractices: number;
  isMilestone?: boolean;
}

// ---------------------------------------------------------------------------
// Timer
// ---------------------------------------------------------------------------

export interface CircularTimerProps {
  timeRemaining: number;
  totalDuration: number;
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Audio controls
// ---------------------------------------------------------------------------

export interface AudioControlBarProps {
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;
  language: SupportedLanguage;
  onTogglePlay: () => void;
  onStop: () => void;
}

export interface LanguageSelectorProps {
  selected: SupportedLanguage;
  onChange: (lang: SupportedLanguage) => void;
  /** Render as compact pill buttons (default) or dropdown */
  variant?: 'pills' | 'dropdown';
  disabled?: boolean;
}
