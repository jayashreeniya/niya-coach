import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getPracticeByDay } from '@/lib/practice-queries';
import { PracticePlayerWrapper } from '@/components/practice/PracticePlayerWrapper';
import type { PracticeMode, SupportedLanguage } from '@/types/database';

interface PracticePlayerPageProps {
  params: { id: string };
  searchParams: { mode?: string; lang?: string };
}

export default async function PracticePlayerPage({
  params,
  searchParams,
}: PracticePlayerPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect('/');

  const dayNumber = parseInt(params.id, 10);
  if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 90) {
    notFound();
  }

  const practice = await getPracticeByDay(dayNumber);

  const mode: PracticeMode =
    searchParams.mode === 'audio' ? 'audio' : 'text';
  const language: SupportedLanguage =
    (searchParams.lang as SupportedLanguage) || 'en';

  return (
    <PracticePlayerWrapper
      practice={JSON.parse(JSON.stringify(practice))}
      userId={user.id}
      mode={mode}
      language={language}
    />
  );
}
