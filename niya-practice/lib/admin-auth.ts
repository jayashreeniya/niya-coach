import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

function parseAdminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS || '';
  return new Set(
    raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  );
}

export async function requireAdmin(): Promise<{
  ok: boolean;
  status: number;
  email?: string;
}> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();

  if (!email) {
    return { ok: false, status: 401 };
  }

  const admins = parseAdminEmails();
  if (!admins.has(email)) {
    return { ok: false, status: 403, email };
  }

  return { ok: true, status: 200, email };
}
