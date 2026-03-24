import type { SupportedLanguage } from './database';

// ---------------------------------------------------------------------------
// Voice definitions — provider-agnostic
// ---------------------------------------------------------------------------

export type TTSProvider = 'sarvam' | 'google';

export interface TTSVoice {
  language: SupportedLanguage;
  languageName: string;
  provider: TTSProvider;
  voice: string;
  description: string;
  locale: string;
}

// Sarvam Bulbul v3 — Shruti voice for all Indian languages
const SARVAM_VOICES: Partial<Record<SupportedLanguage, TTSVoice>> = {
  en:  { language: 'en',  languageName: 'English',     provider: 'sarvam', voice: 'shruti', description: 'Shruti', locale: 'en-IN' },
  hi:  { language: 'hi',  languageName: 'Hindi',       provider: 'sarvam', voice: 'shruti', description: 'Shruti', locale: 'hi-IN' },
  ta:  { language: 'ta',  languageName: 'Tamil',       provider: 'sarvam', voice: 'shruti', description: 'Shruti', locale: 'ta-IN' },
  te:  { language: 'te',  languageName: 'Telugu',      provider: 'sarvam', voice: 'shruti', description: 'Shruti', locale: 'te-IN' },
  ml:  { language: 'ml',  languageName: 'Malayalam',   provider: 'sarvam', voice: 'shruti', description: 'Shruti', locale: 'ml-IN' },
  bn:  { language: 'bn',  languageName: 'Bengali',     provider: 'sarvam', voice: 'shruti', description: 'Shruti', locale: 'bn-IN' },
  gu:  { language: 'gu',  languageName: 'Gujarati',    provider: 'sarvam', voice: 'shruti', description: 'Shruti', locale: 'gu-IN' },
  kn:  { language: 'kn',  languageName: 'Kannada',     provider: 'sarvam', voice: 'shruti', description: 'Shruti', locale: 'kn-IN' },
  mr:  { language: 'mr',  languageName: 'Marathi',     provider: 'sarvam', voice: 'shruti', description: 'Shruti', locale: 'mr-IN' },
  pa:  { language: 'pa',  languageName: 'Punjabi',     provider: 'sarvam', voice: 'shruti', description: 'Shruti', locale: 'pa-IN' },
};

// Google WaveNet — for non-Indian languages
const GOOGLE_VOICES: Partial<Record<SupportedLanguage, TTSVoice>> = {
  ur:  { language: 'ur',  languageName: 'Urdu',        provider: 'google', voice: 'ur-PK-Wavenet-A', description: 'WaveNet',  locale: 'ur-PK' },
  ar:  { language: 'ar',  languageName: 'Arabic',      provider: 'google', voice: 'ar-XA-Wavenet-A', description: 'WaveNet',  locale: 'ar-XA' },
  zh:  { language: 'zh',  languageName: 'Chinese',     provider: 'google', voice: 'cmn-CN-Wavenet-A', description: 'WaveNet', locale: 'cmn-CN' },
  ja:  { language: 'ja',  languageName: 'Japanese',    provider: 'google', voice: 'ja-JP-Wavenet-A', description: 'WaveNet',  locale: 'ja-JP' },
  ko:  { language: 'ko',  languageName: 'Korean',      provider: 'google', voice: 'ko-KR-Wavenet-A', description: 'WaveNet',  locale: 'ko-KR' },
  fr:  { language: 'fr',  languageName: 'French',      provider: 'google', voice: 'fr-FR-Wavenet-C', description: 'WaveNet',  locale: 'fr-FR' },
  de:  { language: 'de',  languageName: 'German',      provider: 'google', voice: 'de-DE-Wavenet-C', description: 'WaveNet',  locale: 'de-DE' },
  es:  { language: 'es',  languageName: 'Spanish',     provider: 'google', voice: 'es-ES-Wavenet-C', description: 'WaveNet',  locale: 'es-ES' },
  pt:  { language: 'pt',  languageName: 'Portuguese',  provider: 'google', voice: 'pt-BR-Wavenet-A', description: 'WaveNet',  locale: 'pt-BR' },
  it:  { language: 'it',  languageName: 'Italian',     provider: 'google', voice: 'it-IT-Wavenet-A', description: 'WaveNet',  locale: 'it-IT' },
  nl:  { language: 'nl',  languageName: 'Dutch',       provider: 'google', voice: 'nl-NL-Wavenet-A', description: 'WaveNet',  locale: 'nl-NL' },
  ru:  { language: 'ru',  languageName: 'Russian',     provider: 'google', voice: 'ru-RU-Wavenet-A', description: 'WaveNet',  locale: 'ru-RU' },
  pl:  { language: 'pl',  languageName: 'Polish',      provider: 'google', voice: 'pl-PL-Wavenet-A', description: 'WaveNet',  locale: 'pl-PL' },
  tr:  { language: 'tr',  languageName: 'Turkish',     provider: 'google', voice: 'tr-TR-Wavenet-A', description: 'WaveNet',  locale: 'tr-TR' },
  th:  { language: 'th',  languageName: 'Thai',        provider: 'google', voice: 'th-TH-Standard-A', description: 'Standard', locale: 'th-TH' },
  vi:  { language: 'vi',  languageName: 'Vietnamese',  provider: 'google', voice: 'vi-VN-Wavenet-A', description: 'WaveNet',  locale: 'vi-VN' },
  id:  { language: 'id',  languageName: 'Indonesian',  provider: 'google', voice: 'id-ID-Wavenet-A', description: 'WaveNet',  locale: 'id-ID' },
  ms:  { language: 'ms',  languageName: 'Malay',       provider: 'google', voice: 'ms-MY-Wavenet-A', description: 'WaveNet',  locale: 'ms-MY' },
  sw:  { language: 'sw',  languageName: 'Swahili',     provider: 'google', voice: 'en-US-Wavenet-F', description: 'WaveNet',  locale: 'en-US' },
  fil: { language: 'fil', languageName: 'Filipino',    provider: 'google', voice: 'fil-PH-Wavenet-A', description: 'WaveNet', locale: 'fil-PH' },
};

// Merged map — Sarvam takes priority for Indian languages
export const VOICES: Record<SupportedLanguage, TTSVoice> = {
  ...GOOGLE_VOICES,
  ...SARVAM_VOICES,
} as Record<SupportedLanguage, TTSVoice>;

/** Sarvam-supported language codes that map to their target_language_code format */
export const SARVAM_LANG_CODES: Partial<Record<SupportedLanguage, string>> = {
  en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN', ml: 'ml-IN',
  bn: 'bn-IN', gu: 'gu-IN', kn: 'kn-IN', mr: 'mr-IN', pa: 'pa-IN',
};

export function isSarvamLanguage(lang: SupportedLanguage): boolean {
  return lang in SARVAM_LANG_CODES;
}

export function getVoiceForLanguage(lang: SupportedLanguage): TTSVoice {
  return VOICES[lang] ?? VOICES.en;
}

// ---------------------------------------------------------------------------
// Prosody / speed
// ---------------------------------------------------------------------------

export interface SSMLProsody {
  rate: number;
  pitch?: string;
  volume?: string;
}

export const DEFAULT_PROSODY: SSMLProsody = {
  rate: 0.80,
  pitch: '-2st',
  volume: 'soft',
};

// ---------------------------------------------------------------------------
// API request / response
// ---------------------------------------------------------------------------

export interface TTSRequest {
  text: string;
  language: SupportedLanguage;
  voice?: string;
  speed?: number;
  prosody?: Partial<Omit<SSMLProsody, 'rate'>>;
}

export interface TTSResponse {
  audioUrl: string;
  duration: number;
  voice: string;
  format: string;
}

export interface TTSError {
  error: string;
  details?: string;
}

// ---------------------------------------------------------------------------
// Client-side audio playback state
// ---------------------------------------------------------------------------

export type AudioPlaybackStatus =
  | 'idle'
  | 'loading'
  | 'playing'
  | 'paused'
  | 'waiting'
  | 'error'
  | 'complete';

export interface AudioPlaybackState {
  status: AudioPlaybackStatus;
  progress: number;
  currentTime: number;
  duration: number;
  currentStepIndex: number;
  errorMessage?: string;
}

export const INITIAL_PLAYBACK_STATE: AudioPlaybackState = {
  status: 'idle',
  progress: 0,
  currentTime: 0,
  duration: 0,
  currentStepIndex: 0,
};

export interface AudioPlayerControls {
  playStep: (text: string, pauseAfter?: number) => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  seekTo: (position: number) => void;
}

export interface StepAudioEvent {
  stepIndex: number;
  stepTitle: string;
  language: SupportedLanguage;
  voice: string;
  playbackDuration: number;
  wasPaused: boolean;
  wasSkipped: boolean;
}
