'use client';

const NIYA_URL = process.env.NEXT_PUBLIC_NIYA_URL || 'https://niya.app';

interface CoachingLinkProps {
  variant?: 'default' | 'compact';
}

export function CoachingLink({ variant = 'default' }: CoachingLinkProps) {
  if (variant === 'compact') {
    return (
      <a
        href={`${NIYA_URL}/coaching`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-niya-600 hover:text-niya-700 font-medium transition-colors"
      >
        <span>💬</span>
        Book 1:1 coaching session
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    );
  }

  return (
    <div className="rounded-2xl border border-niya-200 bg-gradient-to-br from-niya-50 to-purple-50 p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-niya-100 rounded-xl flex items-center justify-center">
          <span className="text-2xl">💬</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Want Deeper Support?
          </h3>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Book 1:1 sessions with our certified coaches and therapists for
            personalized guidance on your emotional fitness journey.
          </p>
          <a
            href={`${NIYA_URL}/coaching`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-niya-600 hover:bg-niya-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            Book a Coach
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
