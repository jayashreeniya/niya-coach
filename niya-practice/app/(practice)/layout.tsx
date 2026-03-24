import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { NavBar } from '@/components/navigation/NavBar';
import { AppFooter } from '@/components/integration/AppFooter';

export default async function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/');

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <NavBar user={user} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
