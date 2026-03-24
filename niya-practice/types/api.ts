import type {
  PracticeMode,
  SupportedLanguage,
  MoodValue,
  StreakData,
  ScoreBreakdown,
  UserPracticeStats,
  Practice,
  UserPracticeWithDetails,
} from './database';

// ---------------------------------------------------------------------------
// Generic API envelope
// ---------------------------------------------------------------------------

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
}

export interface ApiError {
  success?: false;
  error: string;
  details?: string;
  /** HTTP status code echoed for client convenience */
  status?: number;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ---------------------------------------------------------------------------
// POST /api/practice/complete
// ---------------------------------------------------------------------------

export interface PracticeCompleteRequest {
  practiceId: number;
  mode?: PracticeMode;
  audioLanguage?: SupportedLanguage | null;
  moodBefore?: MoodValue | null;
  moodAfter?: MoodValue | null;
  reflectionText?: string | null;
}

export interface PracticeCompleteResponse {
  success: true;
  streak: StreakData;
  score: ScoreBreakdown;
}

// ---------------------------------------------------------------------------
// GET /api/practice/today
// ---------------------------------------------------------------------------

export interface TodayPracticeResponse {
  practice: Practice;
  completed: boolean;
  stats: UserPracticeStats;
}

// ---------------------------------------------------------------------------
// GET /api/progress
// ---------------------------------------------------------------------------

export interface ProgressResponse {
  stats: UserPracticeStats;
  recentPractices: UserPracticeWithDetails[];
  scoreBreakdown: ScoreBreakdown;
}

// ---------------------------------------------------------------------------
// PUT /api/settings/reminders
// ---------------------------------------------------------------------------

export interface ReminderUpdateRequest {
  reminderTime: string;
  timezone: string;
  notificationsEnabled: boolean;
}

export interface ReminderUpdateResponse {
  success: true;
  reminderTime: string;
  timezone: string;
  notificationsEnabled: boolean;
}

// ---------------------------------------------------------------------------
// PUT /api/settings/language
// ---------------------------------------------------------------------------

export interface LanguageUpdateRequest {
  preferredLanguage: SupportedLanguage;
}

export interface LanguageUpdateResponse {
  success: true;
  preferredLanguage: SupportedLanguage;
}

// ---------------------------------------------------------------------------
// GET /api/health
// ---------------------------------------------------------------------------

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'down';
  database: { ok: boolean; latencyMs: number };
  tts: { configured: boolean; sarvam?: boolean; google?: boolean };
  translator?: { configured: boolean };
  timestamp: string;
}
