import 'next-auth';
import 'next-auth/jwt';
import type { OAuthProvider } from './database';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      email: string;
      name: string;
      image?: string | null;
      oauthProvider: OAuthProvider;
    };
  }

  interface User {
    id: number;
    email: string;
    name: string;
    image?: string | null;
    oauthProvider: OAuthProvider;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: number;
    oauthProvider: OAuthProvider;
  }
}
