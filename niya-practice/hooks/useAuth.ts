'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import type { AuthUser } from '@/lib/auth';
import type { OAuthProvider } from '@/types/database';

const PROVIDER_MAP: Record<OAuthProvider, string> = {
  google: 'google',
  apple: 'apple',
  microsoft: 'azure-ad',
};

export function useAuth() {
  const { data: session, status } = useSession();

  const user: AuthUser | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        fullName: session.user.name,
        avatarUrl: session.user.image ?? null,
        oauthProvider: session.user.oauthProvider,
      }
    : null;

  const loginWithOAuth = (provider: OAuthProvider) => {
    signIn(PROVIDER_MAP[provider], { callbackUrl: '/practice' });
  };

  const logout = () => {
    signOut({ callbackUrl: '/' });
  };

  return {
    user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    loginWithOAuth,
    logout,
  };
}
