import { APP_CONFIG } from '../config/appConfig';

const VISITOR_ID_KEY = 'pomodoro-visitor-id';

/**
 * Generates or retrieves a privacy-friendly anonymous Visitor ID (no email required)
 * so you can accurately track DAU/MAU, active themes, and feature usage.
 */
export function getOrCreateVisitorId(): string {
  try {
    let existing = localStorage.getItem(VISITOR_ID_KEY);
    if (!existing) {
      const randomHex =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID().slice(0, 12)
          : Math.random().toString(36).slice(2, 12);
      existing = `warrior-${randomHex}`;
      localStorage.setItem(VISITOR_ID_KEY, existing);
    }
    return existing;
  } catch {
    return 'warrior-guest';
  }
}

function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w <= 1180) return 'tablet';
  return 'desktop';
}

/**
 * Sends a lightweight, non-blocking anonymous telemetry event to PostHog (if configured)
 * and/or your Google Apps Script webhook so you can see active users even when guests
 * skip entering an email address.
 */
export function trackAnonymousEvent(
  eventName: string,
  properties: Record<string, string | number | boolean> = {},
  webhookUrl?: string
): void {
  const visitorId = getOrCreateVisitorId();
  const payload = {
    visitor_id: visitorId,
    device: getDeviceType(),
    ...properties,
  };

  // 1. Optional PostHog HTTP Capture API (zero SDK bundle weight, works everywhere)
  const posthogKey =
    (import.meta as any).env?.VITE_POSTHOG_KEY || APP_CONFIG.POSTHOG_KEY || '';
  if (posthogKey) {
    const host = (
      (import.meta as any).env?.VITE_POSTHOG_HOST ||
      APP_CONFIG.POSTHOG_HOST ||
      'https://us.i.posthog.com'
    ).replace(/\/$/, '');

    fetch(`${host}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: posthogKey,
        event: eventName,
        distinct_id: visitorId,
        properties: {
          $lib: 'focus-arena-web',
          ...payload,
        },
      }),
      keepalive: true,
    }).catch(() => {});
  }

  // 2. Optional Google Apps Script webhook ping for active-session logging
  const targetWebhook = webhookUrl || APP_CONFIG.USER_TRACKING_WEBHOOK_URL;
  if (targetWebhook && (eventName === 'session_start' || eventName === 'bonus_world_claimed')) {
    fetch(targetWebhook, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Event: eventName,
        Timestamp: new Date().toISOString(),
        ...payload,
      }),
      keepalive: true,
    }).catch(() => {});
  }
}
