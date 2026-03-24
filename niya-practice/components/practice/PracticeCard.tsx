'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LanguageSelectionModal } from './LanguageSelectionModal';
import type { Practice, PracticePhase, SupportedLanguage } from '@/types/database';

interface PracticeCardProps {
  practice: Practice;
  phase: PracticePhase;
  dayNumber: number;
  userId: number;
  preferredLanguage: SupportedLanguage;
}

export function PracticeCard({
  practice,
  phase,
  dayNumber,
  userId,
  preferredLanguage,
}: PracticeCardProps) {
  const router = useRouter();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const handleTextPractice = () => {
    router.push(`/practice/${practice.day_number}?mode=text`);
  };

  const handleAudioPractice = () => {
    setShowLanguageModal(true);
  };

  const handleLanguageSelected = (language: SupportedLanguage) => {
    router.push(`/practice/${practice.day_number}?mode=audio&lang=${language}`);
    setShowLanguageModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {practice.title}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {practice.description}
          </p>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1">
            <span>⏱️</span> {practice.duration_minutes} minutes
          </span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1">
            <span>📝</span> {practice.instructions.length} steps
          </span>
        </div>

        <div className="space-y-3">
          {/* Primary: Audio Guidance */}
          <button
            onClick={handleAudioPractice}
            className="w-full bg-gradient-to-r from-purple-500 via-purple-600 to-blue-500 hover:from-purple-600 hover:via-purple-700 hover:to-blue-600 text-white font-semibold py-5 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg active:scale-[0.98] flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full group-hover:bg-white/30 transition-colors">
                <span className="text-3xl">🎧</span>
              </div>
              <div className="text-left">
                <div className="text-lg font-bold">Audio Guidance</div>
                <div className="text-sm opacity-90">
                  Guided voice &middot; Gentle pacing
                </div>
              </div>
            </div>
            <svg
              className="w-6 h-6 opacity-80 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Secondary: Text Practice */}
          <button
            onClick={handleTextPractice}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-4 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📖</span>
              <div className="text-left">
                <div>Read &amp; Practice</div>
                <div className="text-xs text-gray-500">Self-paced, no audio</div>
              </div>
            </div>
            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Step 1 Preview */}
        {practice.instructions[0] && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Preview &middot; Step 1: {practice.instructions[0].title}
            </p>
            <p className="text-gray-700 italic leading-relaxed text-sm">
              &ldquo;{practice.instructions[0].text.substring(0, 120)}...&rdquo;
            </p>
          </div>
        )}

        {/* Video coming soon */}
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <span>Video guidance coming soon</span>
        </div>
      </div>

      <LanguageSelectionModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        onSelect={handleLanguageSelected}
        defaultLanguage={preferredLanguage}
      />
    </>
  );
}
