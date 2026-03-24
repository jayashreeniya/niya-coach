import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/',
  },
});

// Protect all /practice, /complete, /progress, and /api (except /api/auth) routes
export const config = {
  matcher: ['/practice/:path*', '/complete/:path*', '/progress/:path*'],
};
