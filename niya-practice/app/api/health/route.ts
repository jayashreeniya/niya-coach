import { NextResponse } from 'next/server';
import { healthCheck } from '@/lib/db';
import { isTTSConfigured } from '@/lib/tts-service';
import { isSarvamConfigured } from '@/lib/sarvam-tts';
import { isGoogleTTSConfigured } from '@/lib/google-tts';
import { isTranslatorConfigured } from '@/lib/translate-service';

export async function GET() {
  const db = await healthCheck();
  const ttsConfigured = isTTSConfigured();
  const translatorConfigured = isTranslatorConfigured();

  const status = db.ok ? (ttsConfigured ? 'ok' : 'degraded') : 'down';

  const response = {
    status,
    database: { ok: db.ok, latencyMs: db.latencyMs },
    tts: {
      configured: ttsConfigured,
      sarvam: isSarvamConfigured(),
      google: isGoogleTTSConfigured(),
    },
    translator: { configured: translatorConfigured },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    status: status === 'down' ? 503 : 200,
  });
}
