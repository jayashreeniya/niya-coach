'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import type { AuthUser } from '@/lib/auth';

interface NavBarProps {
  user: AuthUser;
}

export function NavBar({ user }: NavBarProps) {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-purple-100 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link
          href="/practice"
          className="text-lg font-bold text-niya-700 hover:text-niya-800 transition-colors"
        >
          NIYA Fitness GYM
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/progress"
            className="text-sm font-medium text-gray-600 hover:text-niya-600 transition-colors"
          >
            Progress
          </Link>

          <div className="flex items-center gap-2">
            {user.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt={`${user.fullName}'s avatar`}
                className="h-7 w-7 rounded-full"
              />
            )}
            <span className="hidden text-sm text-gray-600 sm:inline">
              {user.fullName.split(' ')[0]}
            </span>
          </div>

          <button
            onClick={logout}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>
    </header>
  );
}
