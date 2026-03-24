import type { RowDataPacket } from 'mysql2/promise';

// ---------------------------------------------------------------------------
// Shared enum / union types
// ---------------------------------------------------------------------------

export type OAuthProvider = 'google' | 'apple' | 'microsoft';
export type PracticeMode = 'text' | 'audio' | 'video';
export type SupportedLanguage =
  | 'en' | 'hi' | 'ta' | 'te'
  | 'bn' | 'gu' | 'kn' | 'ml' | 'mr' | 'pa' | 'ur'
  | 'ar' | 'zh' | 'ja' | 'ko'
  | 'fr' | 'de' | 'es' | 'pt' | 'it' | 'nl' | 'ru' | 'pl'
  | 'tr' | 'th' | 'vi' | 'id' | 'ms' | 'sw' | 'fil';

export type PracticePhase = 'Foundation' | 'Development' | 'Integration';
export type EmotionalFitnessCategory =
  | 'building'
  | 'developing'
  | 'strong'
  | 'peak';

/** Mood is always 1-5 (mapped to Low → Great) */
export type MoodValue = 1 | 2 | 3 | 4 | 5;

export const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = [
  'en', 'hi', 'ta', 'te',
  'bn', 'gu', 'kn', 'ml', 'mr', 'pa', 'ur',
  'ar', 'zh', 'ja', 'ko',
  'fr', 'de', 'es', 'pt', 'it', 'nl', 'ru', 'pl',
  'tr', 'th', 'vi', 'id', 'ms', 'sw', 'fil',
] as const;

export const PRACTICE_MODES: readonly PracticeMode[] = [
  'text',
  'audio',
  'video',
] as const;

export const OAUTH_PROVIDERS: readonly OAuthProvider[] = [
  'google',
  'apple',
  'microsoft',
] as const;

export const MILESTONE_DAYS = [3, 7, 14, 21, 30, 60, 90] as const;
export type MilestoneDay = (typeof MILESTONE_DAYS)[number];

export const TOTAL_JOURNEY_DAYS = 90 as const;

/** Phase boundary ranges (inclusive) */
export const PHASE_RANGES: Record<PracticePhase, { start: number; end: number }> = {
  Foundation:  { start: 1,  end: 30 },
  Development: { start: 31, end: 60 },
  Integration: { start: 61, end: 90 },
};

// ---------------------------------------------------------------------------
// Table row types — practice_users
// ---------------------------------------------------------------------------

export interface PracticeUser {
  id: number;
  email: string;
  full_name: string;
  avatar_url: string | null;
  oauth_provider: OAuthProvider;
  oauth_id: string;
  locale: string;
  last_login_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export type PracticeUserInsert = Omit<
  PracticeUser,
  'id' | 'last_login_at' | 'created_at' | 'updated_at'
>;

export type PracticeUserUpdate = Partial<
  Pick<PracticeUser, 'full_name' | 'avatar_url' | 'locale'>
>;

// ---------------------------------------------------------------------------
// Table row types — practices
// ---------------------------------------------------------------------------

export interface Practice {
  id: number;
  day_number: number;
  title: string;
  description: string;
  duration_minutes: number;
  language: SupportedLanguage;
  instructions: PracticeStep[];
  audio_url: string | null;
  video_url: string | null;
  created_at: Date;
  updated_at: Date;
}

/** A single step within a practice's JSON instructions array */
export interface PracticeStep {
  step: number;
  title: PracticeStepTitle;
  text: string;
  duration_seconds: number;
  /** Seconds of silence after TTS finishes this step */
  pause_after?: number;
}

/** Every practice follows the 3-step Settle → Core Practice → Reflect arc */
export type PracticeStepTitle = 'Settle' | 'Core Practice' | 'Reflect';

export type PracticeInsert = Omit<Practice, 'id' | 'created_at' | 'updated_at'>;

/** Lightweight practice object without full instructions (for lists) */
export type PracticeSummary = Pick<
  Practice,
  'id' | 'day_number' | 'title' | 'description' | 'duration_minutes' | 'language'
>;

// ---------------------------------------------------------------------------
// Table row types — user_practices
// ---------------------------------------------------------------------------

export interface UserPractice {
  id: number;
  user_id: number;
  practice_id: number;
  completed_at: Date;
  mode: PracticeMode;
  audio_language: SupportedLanguage | null;
  mood_before: MoodValue | null;
  mood_after: MoodValue | null;
  reflection_text: string | null;
  created_at: Date;
}

export type UserPracticeInsert = Omit<UserPractice, 'id' | 'completed_at' | 'created_at'>;

/** Joined type returned by progress page queries */
export interface UserPracticeWithDetails extends UserPractice {
  title: string;
  day_number: number;
  description?: string;
}

// ---------------------------------------------------------------------------
// Table row types — user_practice_stats
// ---------------------------------------------------------------------------

export interface UserPracticeStats {
  user_id: number;
  current_streak: number;
  longest_streak: number;
  total_practices: number;
  audio_practices: number;
  preferred_language: SupportedLanguage;
  emotional_fitness_score: number;
  last_practice_date: Date | null;
  score_updated_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export type UserPracticeStatsUpsert = Partial<
  Omit<UserPracticeStats, 'created_at' | 'updated_at'>
> &
  Pick<UserPracticeStats, 'user_id'>;

// ---------------------------------------------------------------------------
// Table row types — practice_reminders
// ---------------------------------------------------------------------------

export interface PracticeReminder {
  user_id: number;
  /** HH:MM:SS format */
  reminder_time: string;
  /** IANA timezone identifier, e.g. 'Asia/Kolkata' */
  timezone: string;
  notifications_enabled: boolean;
  created_at: Date;
  updated_at: Date;
}

export type PracticeReminderUpsert = Pick<
  PracticeReminder,
  'user_id' | 'reminder_time' | 'timezone' | 'notifications_enabled'
>;

// ---------------------------------------------------------------------------
// Computed / helper types
// ---------------------------------------------------------------------------

export interface StreakData {
  current_streak: number;
  longest_streak: number;
  streak_increased: boolean;
  is_milestone: boolean;
  milestone_day?: MilestoneDay;
}

export interface ScoreBreakdown {
  score: number;
  category: EmotionalFitnessCategory;
  components: {
    /** Practices completed / 90 (weight: 40%) */
    completion: number;
    /** Average post-practice mood, normalised (weight: 30%) */
    mood: number;
    /** Streak / 30, capped at 1 (weight: 30%) */
    consistency: number;
  };
}

/** High-level dashboard state combining stats and today's context */
export interface DashboardData {
  user: Pick<PracticeUser, 'id' | 'full_name' | 'avatar_url'>;
  stats: UserPracticeStats;
  todayPractice: Practice;
  todayCompleted: boolean;
  phase: PracticePhase;
  category: EmotionalFitnessCategory;
  journeyProgress: number;
}

/** Mood emoji mapping used by UI components */
export interface MoodOption {
  value: MoodValue;
  emoji: string;
  label: string;
}

export const MOOD_OPTIONS: readonly MoodOption[] = [
  { value: 1, emoji: '😔', label: 'Low' },
  { value: 2, emoji: '😕', label: 'Down' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
] as const;

// ---------------------------------------------------------------------------
// Row types for mysql2 queries (extend RowDataPacket)
// ---------------------------------------------------------------------------

export interface PracticeUserRow extends PracticeUser, RowDataPacket {}
export interface PracticeRow extends Practice, RowDataPacket {}
export interface UserPracticeStatsRow extends UserPracticeStats, RowDataPacket {}
export interface UserPracticeRow extends UserPractice, RowDataPacket {}
export interface PracticeReminderRow extends PracticeReminder, RowDataPacket {}
export interface UserPracticeWithDetailsRow extends UserPracticeWithDetails, RowDataPacket {}
