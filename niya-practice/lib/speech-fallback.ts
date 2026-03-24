'use client';

import type { SupportedLanguage } from '@/types/database';

/**
 * Maps language codes to BCP-47 locale tags for the Web Speech API.
 * Languages without a specific mapping fall back to en-IN.
 */
const SPEECH_LOCALES: Partial<Record<SupportedLanguage, string>> = {
  en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN',
  bn: 'bn-IN', gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN',
  mr: 'mr-IN', pa: 'pa-IN', ur: 'ur-IN',
  ar: 'ar-SA', zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR',
  fr: 'fr-FR', de: 'de-DE', es: 'es-ES', pt: 'pt-BR',
  it: 'it-IT', nl: 'nl-NL', ru: 'ru-RU', pl: 'pl-PL',
  tr: 'tr-TR', th: 'th-TH', vi: 'vi-VN', id: 'id-ID',
  ms: 'ms-MY', sw: 'sw-KE', fil: 'fil-PH',
};

function getLocale(lang: SupportedLanguage): string {
  return SPEECH_LOCALES[lang] ?? 'en-IN';
}

/** Default speaking rate (0.75 = guided pacing) */
const FALLBACK_RATE = 0.75;
const FALLBACK_PITCH = 0.95;

/**
 * Whether the browser supports the Web Speech Synthesis API.
 */
export function isSpeechSynthesisAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Get available voices for a specific language.
 * Voices may load asynchronously, so this returns a promise.
 */
export function getVoicesForLanguage(
  language: SupportedLanguage
): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!isSpeechSynthesisAvailable()) {
      resolve([]);
      return;
    }

    const locale = getLocale(language);

    const tryGetVoices = () => {
      const voices = speechSynthesis.getVoices();
      const matching = voices.filter(
        (v) => v.lang === locale || v.lang.startsWith(language)
      );
      return matching;
    };

    const voices = tryGetVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    // Voices may not be loaded yet (Chrome loads them async)
    speechSynthesis.onvoiceschanged = () => {
      resolve(tryGetVoices());
    };

    // Timeout in case onvoiceschanged never fires
    setTimeout(() => resolve(tryGetVoices()), 2000);
  });
}

export interface FallbackSpeakOptions {
  text: string;
  language: SupportedLanguage;
  rate?: number;
  pitch?: number;
  onEnd?: () => void;
  onError?: (error: string) => void;
  onBoundary?: (charIndex: number, charLength: number) => void;
}

let currentUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Speak text using the browser's built-in speech synthesis.
 * Falls back gracefully if no matching voice is found for the language
 * (uses the browser default voice).
 *
 * Returns an object with controls to pause/resume/cancel.
 */
export function speakWithFallback(opts: FallbackSpeakOptions) {
  if (!isSpeechSynthesisAvailable()) {
    opts.onError?.('Speech synthesis not available in this browser');
    return { pause: noop, resume: noop, cancel: noop };
  }

  cancelCurrent();

  const utterance = new SpeechSynthesisUtterance(opts.text);
  currentUtterance = utterance;

  utterance.lang = getLocale(opts.language);
  utterance.rate = opts.rate ?? FALLBACK_RATE;
  utterance.pitch = opts.pitch ?? FALLBACK_PITCH;
  utterance.volume = 1;

  getVoicesForLanguage(opts.language).then((voices) => {
    if (voices.length > 0) {
      utterance.voice = voices[0];
    }
  });

  utterance.onend = () => {
    currentUtterance = null;
    opts.onEnd?.();
  };

  utterance.onerror = (event) => {
    currentUtterance = null;
    if (event.error !== 'canceled') {
      opts.onError?.(event.error);
    }
  };

  utterance.onboundary = (event) => {
    opts.onBoundary?.(event.charIndex, event.charLength);
  };

  speechSynthesis.speak(utterance);

  return {
    pause: () => speechSynthesis.pause(),
    resume: () => speechSynthesis.resume(),
    cancel: () => {
      speechSynthesis.cancel();
      currentUtterance = null;
    },
  };
}

/**
 * Cancel any currently-speaking utterance.
 */
export function cancelCurrent(): void {
  if (isSpeechSynthesisAvailable()) {
    speechSynthesis.cancel();
  }
  currentUtterance = null;
}

/**
 * Check if speech is currently in progress.
 */
export function isSpeaking(): boolean {
  return isSpeechSynthesisAvailable() && speechSynthesis.speaking;
}

function noop() {}
