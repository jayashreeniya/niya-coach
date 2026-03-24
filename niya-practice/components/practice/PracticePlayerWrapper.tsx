'use client';

import { TextPracticePlayer } from './TextPracticePlayer';
import { AudioGuidedPlayer } from './AudioGuidedPlayer';
import type { Practice, PracticeMode, SupportedLanguage } from '@/types/database';

interface PracticePlayerWrapperProps {
  practice: Practice;
  userId: number;
  mode: PracticeMode;
  language: SupportedLanguage;
}

export function PracticePlayerWrapper({
  practice,
  userId,
  mode,
  language,
}: PracticePlayerWrapperProps) {
  if (mode === 'audio') {
    return (
      <AudioGuidedPlayer
        practice={practice}
        userId={userId}
        language={language}
      />
    );
  }

  return <TextPracticePlayer practice={practice} userId={userId} />;
}
