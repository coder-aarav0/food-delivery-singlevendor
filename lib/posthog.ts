import posthog from 'posthog-js';
import { PostHogEvents } from '@/types/events';

let posthogInitialized = false;

export function initPostHog() {
  if (typeof window !== 'undefined' && !posthogInitialized) {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

    if (posthogKey) {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        capture_pageview: true,
        persistence: 'localStorage',
        autocapture: false, // Explicit tracking only for performance
      });
      posthogInitialized = true;
    }
  }
}

export function trackEvent<K extends keyof PostHogEvents>(
  eventName: K,
  properties: PostHogEvents[K]
) {
  if (typeof window !== 'undefined') {
    if (!posthogInitialized) {
      initPostHog();
    }
    try {
      posthog.capture(eventName, properties);
    } catch (err) {
      console.warn('PostHog tracking failed silently:', err);
    }
  }
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && posthogInitialized) {
    posthog.identify(userId, traits);
  }
}

export function resetUser() {
  if (typeof window !== 'undefined' && posthogInitialized) {
    posthog.reset();
  }
}
