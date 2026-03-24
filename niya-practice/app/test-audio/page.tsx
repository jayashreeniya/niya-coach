'use client';

import { useState, useRef } from 'react';
import { VOICES } from '@/types/tts';
import type { SupportedLanguage } from '@/types/database';

const LANGS = Object.entries(VOICES).map(([k, v]) => ({
  code: k as SupportedLanguage,
  name: v.languageName,
  voice: v.voice,
}));

export default function TestAudioPage() {
  const [lang, setLang] = useState<SupportedLanguage>('ta');
  const [log, setLog] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const addLog = (msg: string) => {
    const ts = new Date().toLocaleTimeString();
    setLog((prev) => [...prev, `[${ts}] ${msg}`]);
  };

  const testStream = async () => {
    setLog([]);
    setPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const voice = VOICES[lang];
    addLog(`Testing: lang=${lang}, voice=${voice.voice}`);

    try {
      addLog('Fetching /api/tts/stream...');
      const resp = await fetch('/api/tts/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'Welcome to your practice. Take a deep breath and relax.',
          language: lang,
          voice: voice.voice,
          speed: 0.75,
        }),
      });

      addLog(`Response: status=${resp.status}, type=${resp.headers.get('content-type')}`);

      if (!resp.ok) {
        const errText = await resp.text();
        addLog(`ERROR: ${errText}`);
        return;
      }

      const blob = await resp.blob();
      addLog(`Blob: size=${blob.size} bytes, type=${blob.type}`);

      const blobUrl = URL.createObjectURL(blob);
      addLog(`Blob URL: ${blobUrl}`);

      const audio = new Audio(blobUrl);
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        addLog(`Metadata loaded: duration=${audio.duration.toFixed(1)}s`);
      };

      audio.oncanplay = () => {
        addLog('Can play — starting...');
        audio.play()
          .then(() => {
            addLog('Playing!');
            setPlaying(true);
          })
          .catch((err) => {
            addLog(`Play REJECTED: ${err.message}`);
          });
      };

      audio.onended = () => {
        addLog('Playback ended');
        setPlaying(false);
        URL.revokeObjectURL(blobUrl);
      };

      audio.onerror = () => {
        addLog(`Audio ERROR: code=${audio.error?.code}, msg=${audio.error?.message}`);
      };
    } catch (err: any) {
      addLog(`Fetch ERROR: ${err.message}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">TTS Audio Test</h1>

      <div className="flex gap-3 mb-6">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as SupportedLanguage)}
          className="border rounded-lg px-3 py-2"
        >
          {LANGS.map((l) => (
            <option key={l.code} value={l.code}>
              {l.name} ({l.voice})
            </option>
          ))}
        </select>

        <button
          onClick={testStream}
          disabled={playing}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {playing ? 'Playing...' : 'Test Audio'}
        </button>
      </div>

      <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs h-80 overflow-y-auto">
        {log.length === 0 ? (
          <p className="text-gray-500">Select a language and click Test Audio</p>
        ) : (
          log.map((line, i) => <p key={i}>{line}</p>)
        )}
      </div>
    </div>
  );
}
