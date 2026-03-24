'use client';

import { useState } from 'react';
import { VOICES } from '@/types/tts';
import type { SupportedLanguage } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';

interface SettingsFormProps {
  userId: number;
  initialSettings: {
    reminderTime: string;
    timezone: string;
    notificationsEnabled: boolean;
    preferredLanguage: string;
  };
}

const TIMEZONES = [
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'America/New_York', label: 'US East (EST)' },
  { value: 'America/Chicago', label: 'US Central (CST)' },
  { value: 'America/Los_Angeles', label: 'US West (PST)' },
  { value: 'Europe/London', label: 'UK (GMT)' },
  { value: 'Asia/Dubai', label: 'UAE (GST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Australia/Sydney', label: 'Australia (AEST)' },
];

export function SettingsForm({ userId, initialSettings }: SettingsFormProps) {
  const { logout } = useAuth();

  const [reminderTime, setReminderTime] = useState(
    initialSettings.reminderTime.substring(0, 5)
  );
  const [timezone, setTimezone] = useState(initialSettings.timezone);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    initialSettings.notificationsEnabled
  );
  const [preferredLanguage, setPreferredLanguage] = useState(
    initialSettings.preferredLanguage
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reminderTime: reminderTime + ':00',
          timezone,
          notificationsEnabled,
          preferredLanguage,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      // Silently fail; user can retry
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Reminder time */}
      <div>
        <label htmlFor="reminder-time" className="block text-sm font-medium text-gray-700 mb-2">
          Daily Reminder Time
        </label>
        <input
          id="reminder-time"
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:border-niya-400 focus:ring-2 focus:ring-niya-100 outline-none"
        />
      </div>

      {/* Timezone */}
      <div>
        <label htmlFor="timezone-select" className="block text-sm font-medium text-gray-700 mb-2">
          Timezone
        </label>
        <select
          id="timezone-select"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:border-niya-400 focus:ring-2 focus:ring-niya-100 outline-none"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      {/* Preferred language */}
      <div>
        <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Audio Language
        </label>
        <select
          id="language-select"
          value={preferredLanguage}
          onChange={(e) => setPreferredLanguage(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:border-niya-400 focus:ring-2 focus:ring-niya-100 outline-none"
        >
          {(Object.keys(VOICES) as SupportedLanguage[]).map((lang) => (
            <option key={lang} value={lang}>
              {VOICES[lang].languageName}
            </option>
          ))}
        </select>
      </div>

      {/* Notifications */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700">
            Enable daily reminders
          </p>
          <p className="text-xs text-gray-500">
            Get notified at your chosen time
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={notificationsEnabled}
          aria-label="Enable daily reminders"
          onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            notificationsEnabled ? 'bg-niya-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-niya-600 hover:bg-niya-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:bg-gray-300 transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
        {saved && (
          <span className="text-sm text-green-600 font-medium">
            Settings saved!
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <button
          type="button"
          onClick={logout}
          className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          Sign out
        </button>
      </div>
    </form>
  );
}
