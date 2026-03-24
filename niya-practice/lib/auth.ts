import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import { queryOne } from '@/lib/db';
import type { OAuthProvider, PracticeUserRow } from '@/types/database';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  oauthProvider: OAuthProvider;
}

// ---------------------------------------------------------------------------
// getCurrentUser — returns the authenticated user or null (server-side)
// ---------------------------------------------------------------------------

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const row = await queryOne<PracticeUserRow>(
    'SELECT id, email, full_name, avatar_url, oauth_provider FROM practice_users WHERE id = ?',
    [session.user.id]
  );

  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    oauthProvider: row.oauth_provider as AuthUser['oauthProvider'],
  };
}

// ---------------------------------------------------------------------------
// requireAuth — redirect to login if not authenticated (server components)
// ---------------------------------------------------------------------------

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/');
  return user;
}

// ---------------------------------------------------------------------------
// getSession — thin wrapper for use in API routes / server actions
// ---------------------------------------------------------------------------

export async function getSession() {
  return getServerSession(authOptions);
}
