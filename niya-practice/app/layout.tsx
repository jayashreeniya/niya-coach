import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/auth/AuthProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NIYA Emotional Fitness GYM — Everyday Emotional Fitness',
  description:
    'Build lasting emotional resilience through guided daily practices with audio guidance in any language you prefer.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://practice.niya.app'
  ),
  openGraph: {
    title: 'NIYA Emotional Fitness GYM',
    description: 'Everyday Emotional Fitness Journey with Audio Guidance',
    siteName: 'NIYA Emotional Fitness GYM',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#9333ea',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
