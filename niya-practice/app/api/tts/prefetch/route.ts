import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import type { SupportedLanguage } from '@/types/database';
import { VOICES } from '@/types/tts';
import { synthesizeRaw, isTTSConfigured, getCacheStats } from '@/lib/tts-service';

interface PrefetchRequest {
  steps: { text: string; pause_after?: number }[];
  language: SupportedLanguage;
  speed?: number;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isTTSConfigured()) {
    return NextResponse.json({ error: 'TTS not configured' }, { status: 503 });
  }

  let body: PrefetchRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const { steps, language, speed } = body;

  if (!steps?.length || !language || !VOICES[language]) {
    return NextResponse.json({ error: 'Missing or invalid steps/language' }, { status: 400 });
  }

  try {
    await Promise.all(
      steps.map((step) => synthesizeRaw({ text: step.text, language, speed }))
    );
    const stats = getCacheStats();
    return NextResponse.json({ success: true, stepsProcessed: steps.length, cache: stats });
  } catch (error: any) {
    console.error('TTS prefetch error:', error);
    return NextResponse.json({ error: 'Prefetch failed', details: error.message }, { status: 500 });
  }
}
