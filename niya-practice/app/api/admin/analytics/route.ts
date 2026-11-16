import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getAdminAnalytics } from '@/lib/visit-analytics';

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const daysParam = Number(searchParams.get('days') || 30);
  const days = Number.isFinite(daysParam)
    ? Math.max(1, Math.min(365, Math.floor(daysParam)))
    : 30;

  const data = await getAdminAnalytics(days);
  return NextResponse.json({ days, ...data });
}
