import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { logVisit } from '@/lib/visit-analytics';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let path = '/';
  try {
    const body = await req.json();
    if (body?.path && typeof body.path === 'string') {
      path = body.path.slice(0, 255);
    }
  } catch {
    // no-op; default path used
  }

  const ua = req.headers.get('user-agent');
  await logVisit({
    userId: session.user.id,
    path,
    userAgent: ua,
  });

  return NextResponse.json({ ok: true });
}
