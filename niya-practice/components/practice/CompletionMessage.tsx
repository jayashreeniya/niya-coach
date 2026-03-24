'use client';

import type { Practice } from '@/types/database';

interface CompletionMessageProps {
  message: string;
  nextPractice: Practice;
}

export function CompletionMessage({ message, nextPractice }: CompletionMessageProps) {
  return (
    <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 mb-6 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
        <span className="text-3xl">✅</span>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-2">{message}</h2>

      <div className="mt-4 pt-4 border-t border-green-100">
        <p className="text-xs text-gray-500 mb-1">Tomorrow&apos;s Preview</p>
        <p className="text-sm font-medium text-gray-700">{nextPractice.title}</p>
        <p className="text-xs text-gray-500 mt-1">
          {nextPractice.duration_minutes} min &middot;{' '}
          {nextPractice.instructions.length} steps
        </p>
      </div>
    </div>
  );
}
