import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { VOICES } from '@/types/tts';
import type { SupportedLanguage } from '@/types/database';
import { synthesizeRaw, isTTSConfigured } from '@/lib/tts-service';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isTTSConfigured()) {
    return NextResponse.json({ error: 'TTS not configured' }, { status: 503 });
  }

  let body: { text: string; language: SupportedLanguage; voice?: string; speed?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { text, language, voice, speed } = body;
  if (!text || !language || !VOICES[language]) {
    return NextResponse.json({ error: 'Missing or invalid params' }, { status: 400 });
  }

  try {
    const audioBuffer = await synthesizeRaw({ text, language, voice, speed });
    const base64 = audioBuffer.toString('base64');
    return NextResponse.json({
      audioUrl: `data:audio/wav;base64,${base64}`,
      duration: audioBuffer.byteLength / 48000,
      voice: voice || VOICES[language].voice,
      format: 'wav',
    });
  } catch (error: any) {
    console.error(`[TTS] Error:`, error.message);
    return NextResponse.json({ error: 'TTS failed', details: error.message }, { status: 500 });
  }
}
