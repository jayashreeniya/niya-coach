import type { SupportedLanguage } from '@/types/database';
import { VOICES, DEFAULT_PROSODY, isSarvamLanguage } from '@/types/tts';
import { getTTSCache, TTSCache } from './tts-cache';
import { translateText } from './translate-service';
import { sarvamSynthesize, isSarvamConfigured } from './sarvam-tts';
import { googleSynthesize, isGoogleTTSConfigured } from './google-tts';

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface SynthesizeOptions {
  text: string;
  language: SupportedLanguage;
  voice?: string;
  speed?: number;
}

/**
 * Synthesize speech: translates text, then routes to Sarvam (Indian) or
 * Google WaveNet (others). Returns raw audio Buffer for streaming.
 * Results are cached by text+voice+speed hash.
 */
export async function synthesizeRaw(opts: SynthesizeOptions): Promise<Buffer> {
  const voiceInfo = VOICES[opts.language] ?? VOICES.en;
  const voiceId = opts.voice || voiceInfo.voice;
  const speed = opts.speed ?? DEFAULT_PROSODY.rate;
  const cache = getTTSCache();

  const cacheKey = TTSCache.buildKey({
    text: opts.text,
    voice: `${opts.language}:${voiceId}`,
    speed,
  });

  const cached = cache.get(cacheKey);
  if (cached) {
    console.log(`[TTS] Cache HIT for ${opts.language}/${voiceId}`);
    return Buffer.from(cached, 'base64');
  }

  const translatedText = await translateText(opts.text, opts.language);

  let audioBuffer: Buffer;

  if (isSarvamLanguage(opts.language) && isSarvamConfigured()) {
    audioBuffer = await sarvamSynthesize({
      text: translatedText,
      language: opts.language,
      speaker: voiceId,
      pace: speed,
    });
  } else if (isGoogleTTSConfigured()) {
    audioBuffer = await googleSynthesize({
      text: translatedText,
      language: opts.language,
      voice: voiceId,
      speakingRate: speed,
    });
  } else {
    throw new Error('No TTS provider configured for this language');
  }

  cache.set(cacheKey, audioBuffer.toString('base64'), voiceId);
  return audioBuffer;
}

/** Whether any TTS provider is available */
export function isTTSConfigured(): boolean {
  return isSarvamConfigured() || isGoogleTTSConfigured();
}

/** Return server-side cache metrics for health/monitoring */
export function getCacheStats() {
  return getTTSCache().stats();
}
