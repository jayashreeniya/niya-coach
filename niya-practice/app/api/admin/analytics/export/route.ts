import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getAdminAnalytics } from '@/lib/visit-analytics';

function esc(v: unknown): string {
  const s = String(v ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

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
  const rows = [
    [
      'date',
      'user_id',
      'full_name',
      'email',
      'activity_day_number',
      'activity_title',
      'mode',
      'language',
      'completed_at',
    ].join(','),
    ...data.activityDetails.map((a) =>
      [
        esc(a.day),
        esc(a.user_id),
        esc(a.full_name),
        esc(a.email),
        esc(a.day_number),
        esc(a.title),
        esc(a.mode),
        esc(a.language || ''),
        esc(new Date(a.completed_at).toISOString()),
      ].join(',')
    ),
  ];

  return new NextResponse(rows.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="practice-analytics-${days}d.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
