import crypto from 'crypto';
import type { SupportedLanguage } from '@/types/database';
import { VOICES } from '@/types/tts';

const GOOGLE_SA_KEY = process.env.GOOGLE_SA_KEY;
const TTS_ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize';
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
    try {
      return JSON.parse(GOOGLE_SA_KEY);
    } catch {
      console.error('[Google TTS] Failed to parse GOOGLE_SA_KEY');
      return null;
    }
  }
}

function base64url(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input) : input;
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function createJWT(sa: ServiceAccount): string {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: sa.client_email,
    scope: SCOPE,
    aud: sa.token_uri || TOKEN_URI,
    iat: now,
    exp: now + 3600,
  };

  const segments = [
    base64url(JSON.stringify(header)),
    base64url(JSON.stringify(payload)),
  ];
  const signingInput = segments.join('.');

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signingInput);
  const signature = sign.sign(sa.private_key);

  return `${signingInput}.${base64url(signature)}`;
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }

  const sa = getServiceAccount();
  if (!sa) throw new Error('GOOGLE_SA_KEY not configured');

  const jwt = createJWT(sa);

  const resp = await fetch(TOKEN_URI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!resp.ok) {
    const err = await resp.text();
    console.error(`[Google TTS] Token exchange failed (${resp.status}): ${err}`);
    throw new Error(`Google auth failed: ${err}`);
  }

  const data = await resp.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
  return cachedToken.token;
}

export function isGoogleTTSConfigured(): boolean {
  return !!GOOGLE_SA_KEY;
}

export interface GoogleSynthesizeOpts {
  text: string;
  language: SupportedLanguage;
  voice?: string;
  speakingRate?: number;
}

export async function googleSynthesize(opts: GoogleSynthesizeOpts): Promise<Buffer> {
  const token = await getAccessToken();
  const voiceInfo = VOICES[opts.language];
  const voiceName = opts.voice || voiceInfo?.voice || 'en-US-Wavenet-F';
  const languageCode = voiceInfo?.locale || 'en-US';

  const body = {
    input: { text: opts.text },
    voice: { languageCode, name: voiceName },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: opts.speakingRate ?? 0.80,
      pitch: -2.0,
      volumeGainDb: -2.0,
    },
  };

  console.log(`[Google TTS] lang=${opts.language}, voice=${voiceName}, locale=${languageCode}, chars=${opts.text.length}`);

  const response = await fetch(TTS_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`[Google TTS] ${response.status} error: ${errorBody}`);
    throw new Error(`Google TTS failed (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const audioContent: string = data.audioContent;

  if (!audioContent) {
    throw new Error('Google TTS returned empty audio');
  }

  console.log(`[Google TTS] OK: received ${audioContent.length} base64 chars`);
  return Buffer.from(audioContent, 'base64');
}
