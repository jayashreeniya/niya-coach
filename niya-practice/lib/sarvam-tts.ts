import type { SupportedLanguage } from '@/types/database';
import { VOICES, SARVAM_LANG_CODES } from '@/types/tts';

const SARVAM_KEY = process.env.SARVAM_API_KEY;
const SARVAM_ENDPOINT = 'https://api.sarvam.ai/text-to-speech';
const MODEL = 'bulbul:v3';

export function isSarvamConfigured(): boolean {
  return !!SARVAM_KEY;
}

export interface SarvamSynthesizeOpts {
  text: string;
  language: SupportedLanguage;
  speaker?: string;
  pace?: number;
}

export async function sarvamSynthesize(opts: SarvamSynthesizeOpts): Promise<Buffer> {
  if (!SARVAM_KEY) throw new Error('SARVAM_API_KEY not configured');

  const voiceInfo = VOICES[opts.language];
  const speaker = opts.speaker || voiceInfo?.voice || 'shruti';
  const targetLang = SARVAM_LANG_CODES[opts.language] || 'en-IN';
  const pace = opts.pace ?? 0.80;

  console.log(`[Sarvam TTS] lang=${opts.language}, speaker=${speaker}, target=${targetLang}, pace=${pace}, chars=${opts.text.length}`);

  const body = {
    text: opts.text,
    target_language_code: targetLang,
    speaker,
    model: MODEL,
    pace,
    speech_sample_rate: 22050,
  };

  const response = await fetch(SARVAM_ENDPOINT, {
    method: 'POST',
    headers: {
      'api-subscription-key': SARVAM_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`[Sarvam TTS] ${response.status} error: ${errorBody}`);
    throw new Error(`Sarvam TTS failed (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const audioB64: string = data.audios?.[0];
  if (!audioB64) throw new Error('Sarvam TTS returned empty audio');

  const buf = Buffer.from(audioB64, 'base64');
  console.log(`[Sarvam TTS] OK: ${buf.length} bytes`);
  return buf;
}
