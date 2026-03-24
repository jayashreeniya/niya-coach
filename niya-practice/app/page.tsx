import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { LoginButton } from '@/components/auth/LoginButton';
import { AppFooter } from '@/components/integration/AppFooter';

function GymIcon() {
  return (
    <svg className="w-12 h-12 text-white" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="12" r="5.5" fill="currentColor" />
      <path d="M32 20c-3.5 0-6.5 2.5-6.5 6v9h13v-9c0-3.5-3-6-6.5-6z" fill="currentColor" opacity="0.85" />
      <path d="M17 31h30M13 27v8M51 27v8M9 29v4M55 29v4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M25.5 35l-3 12M38.5 35l3 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="11" r="2.5" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M28 8c-1-2 0-4 2-5M36 8c1-2 0-4-2-5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

export default async function LandingPage() {
  const user = await getCurrentUser();
  if (user) redirect('/practice');

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-purple-50 via-white to-blue-50">
    <main className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="text-center mb-10 max-w-lg">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg mb-6">
          <GymIcon />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-3 text-balance">
          NIYA Emotional Fitness GYM
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed mb-2">
          Everyday Emotional Fitness Journey
        </p>

        <p className="text-sm text-gray-500 leading-relaxed">
          Build lasting emotional resilience with guided daily practices.
          Choose audio guidance in any language you prefer.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-md">
        {[
          { icon: '\uD83C\uDFA7', label: 'Audio Guided' },
          { icon: '\uD83D\uDCD6', label: 'Text Mode' },
          { icon: '\uD83D\uDD25', label: 'Streak Tracking' },
          { icon: '\uD83D\uDCCA', label: 'Emotional Score' },
          { icon: '\uD83C\uDF0D', label: 'All Languages' },
        ].map((f) => (
          <span
            key={f.label}
            className="inline-flex items-center gap-1.5 bg-white/80 border border-purple-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm"
          >
            <span>{f.icon}</span>
            {f.label}
          </span>
        ))}
      </div>

      <LoginButton />

      <p className="mt-12 text-xs text-gray-400">
        By continuing you agree to NIYA&apos;s Terms of Service and Privacy
        Policy.
      </p>
    </main>
    <AppFooter />
    </div>
  );
}
