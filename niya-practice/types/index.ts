export type {
  // Enums / unions
  OAuthProvider,
  PracticeMode,
  SupportedLanguage,
  PracticePhase,
  EmotionalFitnessCategory,
  MoodValue,
  MilestoneDay,
  PracticeStepTitle,

  // Table row types
  PracticeUser,
  Practice,
  PracticeStep,
  UserPractice,
  UserPracticeStats,
  PracticeReminder,

  // Insert / update types
  PracticeUserInsert,
  PracticeUserUpdate,
  PracticeInsert,
  UserPracticeInsert,
  UserPracticeStatsUpsert,
  PracticeReminderUpsert,

  // Derived / computed
  PracticeSummary,
  UserPracticeWithDetails,
  StreakData,
  ScoreBreakdown,
  DashboardData,
  MoodOption,

  // mysql2 row types
  PracticeUserRow,
  PracticeRow,
  UserPracticeStatsRow,
  UserPracticeRow,
  PracticeReminderRow,
  UserPracticeWithDetailsRow,
} from './database';

export {
  SUPPORTED_LANGUAGES,
  PRACTICE_MODES,
  OAUTH_PROVIDERS,
  MILESTONE_DAYS,
  TOTAL_JOURNEY_DAYS,
  PHASE_RANGES,
  MOOD_OPTIONS,
} from './database';

export type {
  TTSProvider,
  TTSVoice,
  SSMLProsody,
  TTSRequest,
  TTSResponse,
  TTSError,
  AudioPlaybackStatus,
  AudioPlaybackState,
  AudioPlayerControls,
  StepAudioEvent,
} from './tts';

export {
  VOICES,
  DEFAULT_PROSODY,
  INITIAL_PLAYBACK_STATE,
  isSarvamLanguage,
  getVoiceForLanguage,
} from './tts';

export type {
  ApiSuccess,
  ApiError,
  ApiResponse,
  PracticeCompleteRequest,
  PracticeCompleteResponse,
  TodayPracticeResponse,
  ProgressResponse,
  ReminderUpdateRequest,
  ReminderUpdateResponse,
  LanguageUpdateRequest,
  LanguageUpdateResponse,
  HealthCheckResponse,
} from './api';

export type {
  NavBarProps,
  LoginButtonProps,
  PracticeSessionProps,
  SessionPhase,
  PracticeIntroProps,
  PracticeStepViewProps,
  MoodSelectorProps,
  ScoreCardProps,
  StatTileProps,
  StreakBadgeProps,
  ProgressBarProps,
  PracticeHistoryListProps,
  PracticeHistoryItemProps,
  CompletionCardProps,
  CircularTimerProps,
  AudioControlBarProps,
  LanguageSelectorProps,
} from './props';
