type AppName = 'niya' | 'practice';

interface CrossAppEvent {
  from_app: AppName;
  to_app: AppName;
  user_id?: number;
  timestamp: string;
}

interface PracticeEvent {
  event: string;
  properties?: Record<string, unknown>;
}

/**
 * Track navigation from one NIYA ecosystem app to another.
 * Fires a custom event that can be picked up by any analytics
 * provider (GA4, Mixpanel, Application Insights, etc.).
 */
export function trackCrossAppNavigation(from: AppName, to: AppName) {
  const event: CrossAppEvent = {
    from_app: from,
    to_app: to,
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    // Google Analytics 4
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'cross_app_navigation', event);
    }

    // Generic dataLayer (GTM)
    if (Array.isArray((window as any).dataLayer)) {
      (window as any).dataLayer.push({
        event: 'cross_app_navigation',
        ...event,
      });
    }
  }
}

/**
 * General-purpose event tracking for practice-specific actions.
 */
export function trackEvent(event: string, properties?: Record<string, unknown>) {
  const payload: PracticeEvent = { event, properties };

  if (typeof window !== 'undefined') {
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', event, properties || {});
    }

    if (Array.isArray((window as any).dataLayer)) {
      (window as any).dataLayer.push({ event, ...properties });
    }
  }

  return payload;
}

/**
 * Key events to track across the NIYA Emotional Fitness GYM app:
 *
 * - practice_started   { day_number, mode, language }
 * - practice_completed { day_number, mode, mood_after, streak }
 * - streak_milestone   { streak_days }
 * - audio_fallback     { language, reason }
 * - cross_app_navigation { from_app, to_app }
 * - settings_updated   { field }
 */
