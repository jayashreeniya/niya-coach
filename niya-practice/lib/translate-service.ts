import type { SupportedLanguage } from '@/types/database';
import { VOICES } from '@/types/tts';

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = 'gpt-4o-mini';

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = Object.fromEntries(
  Object.entries(VOICES).map(([k, v]) => [k, v.languageName])
) as Record<SupportedLanguage, string>;

const translationCache = new Map<string, string>();
const MAX_CACHE_SIZE = 2000;

function cacheKey(text: string, lang: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  return `${lang}:${hash}`;
}

export function isTranslatorConfigured(): boolean {
  return !!OPENAI_KEY;
}

export async function translateText(
  text: string,
  targetLang: SupportedLanguage
): Promise<string> {
  if (targetLang === 'en' || !OPENAI_KEY) return text;

  const langName = LANGUAGE_NAMES[targetLang] || targetLang;
  const key = cacheKey(text, targetLang);
  const cached = translationCache.get(key);
  if (cached) return cached;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.3,
        max_tokens: 2048,
        messages: [
          {
            role: 'system',
            content:
              `You translate guided emotional wellness exercises into ${langName}. ` +
              `This text will be read aloud by a text-to-speech voice, so the translation must sound natural when spoken. ` +
              `Use warm, encouraging, and conversational language — as if a kind friend is gently guiding you through an exercise. ` +
              `Prefer short, flowing sentences. Avoid formal, literary, or stiff phrasing. ` +
              `Keep the meaning faithful but prioritize how it sounds when spoken. ` +
              `Return ONLY the translated text.`,
          },
          { role: 'user', content: text },
        ],
      }),
    });

    if (!response.ok) {
      console.error(`[Translate] Failed (${response.status}): ${await response.text()}`);
      return text;
    }

    const data = await response.json();
    const translated: string = data?.choices?.[0]?.message?.content?.trim() ?? text;

    if (translationCache.size >= MAX_CACHE_SIZE) {
      const firstKey = translationCache.keys().next().value;
      if (firstKey !== undefined) translationCache.delete(firstKey);
    }
    translationCache.set(key, translated);

    console.log(`[Translate] en->${targetLang}: "${text.substring(0, 40)}..." -> "${translated.substring(0, 40)}..."`);
    return translated;
  } catch (err) {
    console.error('[Translate] Request failed:', err);
    return text;
  }
}
