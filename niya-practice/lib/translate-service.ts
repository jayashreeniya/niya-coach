import crypto from 'crypto';
import type { SupportedLanguage } from '@/types/database';
import { VOICES } from '@/types/tts';

const GOOGLE_SA_KEY = process.env.GOOGLE_SA_KEY;
const TRANSLATE_ENDPOINT = 'https://translation.googleapis.com/language/translate/v2';
const TOKEN_URI = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/cloud-platform';

let cachedToken: { token: string; expiresAt: number } | null = null;

interface ServiceAccount {
  client_email: string;
  private_key: string;
  token_uri?: string;
}

function getServiceAccount(): ServiceAccount | null {
  if (!GOOGLE_SA_KEY) return null;
  try {
    const json = Buffer.from(GOOGLE_SA_KEY, 'base64').toString('utf-8');
    return JSON.parse(json);
  } catch {
    try { return JSON.parse(GOOGLE_SA_KEY); }
    catch { return null; }
  }
}

function base64url(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input) : input;
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function createJWT(sa: ServiceAccount): string {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = { iss: sa.client_email, scope: SCOPE, aud: sa.token_uri || TOKEN_URI, iat: now, exp: now + 3600 };
  const segments = [base64url(JSON.stringify(header)), base64url(JSON.stringify(payload))];
  const signingInput = segments.join('.');
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signingInput);
  return `${signingInput}.${base64url(sign.sign(sa.private_key))}`;
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) return cachedToken.token;
  const sa = getServiceAccount();
  if (!sa) throw new Error('GOOGLE_SA_KEY not configured');
  const resp = await fetch(TOKEN_URI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${createJWT(sa)}`,
  });
  if (!resp.ok) throw new Error(`Google auth failed: ${await resp.text()}`);
  const data = await resp.json();
  cachedToken = { token: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return cachedToken.token;
}

const translationCache = new Map<string, string>();
const MAX_CACHE_SIZE = 2000;

function cacheKey(text: string, lang: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  return `${lang}:${hash}`;
}

export function isTranslatorConfigured(): boolean {
  return !!GOOGLE_SA_KEY;
}

export async function translateText(text: string, targetLang: SupportedLanguage): Promise<string> {
  if (targetLang === 'en' || !GOOGLE_SA_KEY) return text;

  const key = cacheKey(text, targetLang);
  const cached = translationCache.get(key);
  if (cached) return cached;

  try {
    const token = await getAccessToken();
    const response = await fetch(TRANSLATE_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: 'en', target: targetLang, format: 'text' }),
    });

    if (!response.ok) {
      console.error(`[Google Translate] Failed (${response.status}): ${await response.text()}`);
      return text;
    }

    const data = await response.json();
    const translated: string = data?.data?.translations?.[0]?.translatedText ?? text;

    if (translationCache.size >= MAX_CACHE_SIZE) {
      const firstKey = translationCache.keys().next().value;
      if (firstKey !== undefined) translationCache.delete(firstKey);
    }
    translationCache.set(key, translated);
    console.log(`[Google Translate] en->${targetLang}: "${text.substring(0, 40)}..." -> "${translated.substring(0, 40)}..."`);
    return translated;
  } catch (err) {
    console.error('[Google Translate] Request failed:', err);
    return text;
  }
}

/*
 * --- Previous OpenAI GPT-4o-mini implementation (commented out) ---
 *
 * const OPENAI_KEY = process.env.OPENAI_API_KEY;
 * const OPENAI_MODEL = 'gpt-4o-mini';
 *
 * const LANGUAGE_NAMES: Record<SupportedLanguage, string> = Object.fromEntries(
 *   Object.entries(VOICES).map(([k, v]) => [k, v.languageName])
 * ) as Record<SupportedLanguage, string>;
 *
 * export async function translateText(text: string, targetLang: SupportedLanguage): Promise<string> {
 *   if (targetLang === 'en' || !OPENAI_KEY) return text;
 *   const langName = LANGUAGE_NAMES[targetLang] || targetLang;
 *   const key = cacheKey(text, targetLang);
 *   const cached = translationCache.get(key);
 *   if (cached) return cached;
 *   try {
 *     const response = await fetch('https://api.openai.com/v1/chat/completions', {
 *       method: 'POST',
 *       headers: { Authorization: `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
 *       body: JSON.stringify({
 *         model: OPENAI_MODEL, temperature: 0.3, max_tokens: 2048,
 *         messages: [
 *           { role: 'system', content:
 *             `You translate guided emotional wellness exercises into ${langName}. ` +
 *             `This text will be read aloud by a text-to-speech voice, so the translation must sound natural when spoken. ` +
 *             `Use warm, encouraging, and conversational language. Return ONLY the translated text.` },
 *           { role: 'user', content: text },
 *         ],
 *       }),
 *     });
 *     if (!response.ok) return text;
 *     const data = await response.json();
 *     return data?.choices?.[0]?.message?.content?.trim() ?? text;
 *   } catch { return text; }
 * }
 */
