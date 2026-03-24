'use client';

interface BreathingAnimationProps {
  isPlaying: boolean;
}

export function BreathingAnimation({ isPlaying }: BreathingAnimationProps) {
  return (
    <div className="flex justify-center">
      <div className={`relative ${isPlaying ? 'animate-pulse-slow' : ''}`}>
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-200 to-sky-200 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-300 to-sky-300 flex items-center justify-center">
            <span className="text-3xl">🌬️</span>
          </div>
        </div>
        {isPlaying && (
          <>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-40 h-40 rounded-full border-2 border-blue-200/40 animate-ping-slow" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 rounded-full border-2 border-sky-200/20 animate-ping-slower" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
