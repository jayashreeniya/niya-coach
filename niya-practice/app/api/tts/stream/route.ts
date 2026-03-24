import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { VOICES, DEFAULT_PROSODY, isSarvamLanguage } from '@/types/tts';
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

  const voiceInfo = VOICES[language];
  const resolvedVoice = voice || voiceInfo.voice;
  const provider = isSarvamLanguage(language) ? 'sarvam' : 'google';
  console.log(`[TTS/stream] provider=${provider}, language=${language}, voice=${resolvedVoice}`);

  try {
    const audioBuffer = await synthesizeRaw({
      text,
      language,
      voice: resolvedVoice,
      speed: speed ?? DEFAULT_PROSODY.rate,
    });

    console.log(`[TTS/stream] OK: ${audioBuffer.byteLength} bytes via ${provider}`);

    const contentType = provider === 'sarvam' ? 'audio/wav' : 'audio/mpeg';
    const bytes = new Uint8Array(audioBuffer);
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(bytes.byteLength),
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error(`[TTS/stream] Error:`, error.message);
    return NextResponse.json({ error: 'TTS failed', details: error.message }, { status: 500 });
  }
}
