/**
 * Drop-in banner component for the main NIYA app (niya.app).
 * Encourages users to try the daily practice feature.
 *
 * Usage in the main NIYA app:
 *   <PracticeBanner />
 *
 * Place on: dashboard, after booking sessions, in wellness tips section.
 */

export function PracticeBanner() {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <span className="text-2xl">{'\uD83D\uDCAA'}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">
            Build Your Emotional Fitness
          </h3>
          <p className="text-purple-100 text-sm mb-4 leading-relaxed">
            Take 15 minutes daily to strengthen your emotional well-being with
            guided practices. Audio guidance available in any language you
            prefer.
          </p>
          <a
            href="https://practice.niya.app"
            className="inline-flex items-center gap-2 bg-white text-purple-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-50 transition-colors"
          >
            Start Daily Practice
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
