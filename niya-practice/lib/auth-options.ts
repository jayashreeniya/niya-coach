import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import AzureADProvider from 'next-auth/providers/azure-ad';
import { execute, queryOne } from '@/lib/db';
import type { RowDataPacket } from 'mysql2/promise';

interface PracticeUserRow extends RowDataPacket {
  id: number;
  email: string;
  full_name: string;
  avatar_url: string | null;
  oauth_provider: string;
  oauth_id: string;
}

/**
 * Upsert a user in practice_users on every sign-in.
 * Returns the database user id.
 */
async function upsertPracticeUser(
  email: string,
  fullName: string,
  avatarUrl: string | null,
  oauthProvider: 'google' | 'apple' | 'microsoft',
  oauthId: string
): Promise<number> {
  const existing = await queryOne<PracticeUserRow>(
    'SELECT id FROM practice_users WHERE oauth_provider = ? AND oauth_id = ?',
    [oauthProvider, oauthId]
  );

  if (existing) {
    await execute(
      `UPDATE practice_users
         SET email = ?, full_name = ?, avatar_url = ?, last_login_at = NOW()
       WHERE id = ?`,
      [email, fullName, avatarUrl, existing.id]
    );
    return existing.id;
  }

  const result = await execute(
    `INSERT INTO practice_users
       (email, full_name, avatar_url, oauth_provider, oauth_id, last_login_at)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [email, fullName, avatarUrl, oauthProvider, oauthId]
  );

  const userId = result.insertId;

  // Bootstrap default stats and reminder rows for new users
  await execute(
    'INSERT IGNORE INTO user_practice_stats (user_id) VALUES (?)',
    [userId]
  );
  await execute(
    'INSERT IGNORE INTO practice_reminders (user_id) VALUES (?)',
    [userId]
  );

  return userId;
}

function resolveProvider(
  providerId: string | undefined
): 'google' | 'apple' | 'microsoft' {
  switch (providerId) {
    case 'google':
      return 'google';
    case 'apple':
      return 'apple';
    case 'azure-ad':
      return 'microsoft';
    default:
      return 'google';
  }
}

const providers: NextAuthOptions['providers'] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET) {
  providers.push(
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
    })
  );
}

if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
  providers.push(
    AzureADProvider({
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      tenantId: 'common',
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/',
    error: '/',
  },

  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        // .niya.app allows sharing across subdomains (practice.niya.app, niya.app)
        domain:
          process.env.NODE_ENV === 'production' ? '.niya.app' : undefined,
      },
    },
  },

  callbacks: {
    async signIn({ user, account }) {
      if (!account || !user.email) return false;

      const oauthProvider = resolveProvider(account.provider);

      const dbUserId = await upsertPracticeUser(
        user.email,
        user.name || user.email.split('@')[0],
        user.image ?? null,
        oauthProvider,
        account.providerAccountId
      );

      // Attach the DB id so the jwt callback can pick it up
      (user as any).id = dbUserId;
      (user as any).oauthProvider = oauthProvider;

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id as number;
        token.oauthProvider = (user as any).oauthProvider;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.userId;
      session.user.oauthProvider = token.oauthProvider;
      return session;
    },
  },
};
