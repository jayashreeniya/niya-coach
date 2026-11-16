import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { requireAdmin } from '@/lib/admin-auth';
import { getAdminAnalytics } from '@/lib/visit-analytics';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams?: { days?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/');
  }

  const auth = await requireAdmin();
  if (!auth.ok) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Admin Analytics</h1>
        <p className="mt-3 text-slate-600">
          Access denied. Add your email to <code>ADMIN_EMAILS</code> in environment variables.
        </p>
      </main>
    );
  }

  const daysParam = Number(searchParams?.days || 30);
  const days = Number.isFinite(daysParam)
    ? Math.max(1, Math.min(365, Math.floor(daysParam)))
    : 30;
  const data = await getAdminAnalytics(days);

  return (
    <main className="mx-auto max-w-7xl p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">NIYA Emotional Fitness GYM — Admin Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Last {days} days overview: visitors, activity plays, day-wise breakdown, and user history.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[7, 30, 90, 180].map((d) => (
            <a
              key={d}
              href={`/admin?days=${d}`}
              className={`rounded-md px-3 py-1 text-sm ${
                days === d
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {d} days
            </a>
          ))}
          <a
            href={`/api/admin/analytics/export?days=${days}`}
            className="rounded-md bg-emerald-600 px-3 py-1 text-sm text-white hover:bg-emerald-700"
          >
            Export CSV
          </a>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Visitors</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">
            {data.totals.total_visitors}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Fitness Activities Played</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">
            {data.totals.total_activity_plays}
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Day-wise Visitors</h2>
          <div className="max-h-80 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2">Date</th>
                  <th className="py-2">Visitors</th>
                </tr>
              </thead>
              <tbody>
                {data.dailyVisitors.map((row) => (
                  <tr key={row.day} className="border-t border-slate-100">
                    <td className="py-2 text-slate-700">{row.day}</td>
                    <td className="py-2 font-medium text-slate-900">{row.visitors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Day-wise Activity Plays</h2>
          <div className="max-h-80 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2">Date</th>
                  <th className="py-2">Activities</th>
                </tr>
              </thead>
              <tbody>
                {data.dailyActivities.map((row) => (
                  <tr key={row.day} className="border-t border-slate-100">
                    <td className="py-2 text-slate-700">{row.day}</td>
                    <td className="py-2 font-medium text-slate-900">{row.activities}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Most Played Activities</h2>
          <div className="max-h-80 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2">Day</th>
                  <th className="py-2">Activity</th>
                  <th className="py-2">Plays</th>
                </tr>
              </thead>
              <tbody>
                {data.topActivities.map((r) => (
                  <tr key={`${r.day_number}-${r.title}`} className="border-t border-slate-100">
                    <td className="py-2">{r.day_number}</td>
                    <td className="py-2 text-slate-700">{r.title}</td>
                    <td className="py-2 font-medium text-slate-900">{r.plays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Language Breakdown</h2>
          <div className="max-h-80 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2">Language</th>
                  <th className="py-2">Plays</th>
                </tr>
              </thead>
              <tbody>
                {data.languageBreakdown.map((r) => (
                  <tr key={r.language} className="border-t border-slate-100">
                    <td className="py-2 text-slate-700">{r.language}</td>
                    <td className="py-2 font-medium text-slate-900">{r.plays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Who Visited (User Summary)</h2>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">Visit Days</th>
                <th className="py-2 pr-3">Total Hits</th>
                <th className="py-2 pr-3">Activities Done</th>
                <th className="py-2 pr-3">Last Visit</th>
                <th className="py-2">Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((u) => (
                <tr key={u.user_id} className="border-t border-slate-100">
                  <td className="py-2 pr-3 text-slate-900">{u.full_name}</td>
                  <td className="py-2 pr-3 text-slate-700">{u.email}</td>
                  <td className="py-2 pr-3">{u.total_visit_days}</td>
                  <td className="py-2 pr-3">{u.total_hit_count}</td>
                  <td className="py-2 pr-3">{u.total_activities}</td>
                  <td className="py-2 pr-3 text-slate-700">
                    {u.last_visit_at ? new Date(u.last_visit_at).toLocaleString() : '-'}
                  </td>
                  <td className="py-2 text-slate-700">
                    {u.last_activity_at ? new Date(u.last_activity_at).toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          Day-wise Activity Details (Who did what)
        </h2>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">User</th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">Activity</th>
                <th className="py-2 pr-3">Day</th>
                <th className="py-2 pr-3">Mode</th>
                <th className="py-2">Language</th>
              </tr>
            </thead>
            <tbody>
              {data.activityDetails.map((a, idx) => (
                <tr key={`${a.user_id}-${a.completed_at}-${idx}`} className="border-t border-slate-100">
                  <td className="py-2 pr-3 text-slate-700">{a.day}</td>
                  <td className="py-2 pr-3 text-slate-900">{a.full_name}</td>
                  <td className="py-2 pr-3 text-slate-700">{a.email}</td>
                  <td className="py-2 pr-3 text-slate-900">{a.title}</td>
                  <td className="py-2 pr-3">{a.day_number}</td>
                  <td className="py-2 pr-3">{a.mode}</td>
                  <td className="py-2">{a.language || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
