/**
 * Shared constants for ad click tracking and UTM parameter capture.
 * Used by middleware.ts (server-side cookie setting) and
 * hooks/useTrackingParams.ts (client-side cookie reading).
 *
 * Matches the main tecaudex.com marketing site's tracking system
 * so attribution is consistent across domains.
 */

export const COOKIE_PREFIX = "_txa_";
export const COOKIE_MAX_AGE_SECONDS = 90 * 24 * 60 * 60; // 90 days

/** Ad platform click identifiers */
export const CLICK_ID_PARAMS = [
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
] as const;

/** Standard UTM campaign parameters */
export const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

/** All tracking parameters captured from URL query strings */
export const ALL_TRACKING_PARAMS = [
  ...CLICK_ID_PARAMS,
  ...UTM_PARAMS,
] as const;

/** Additional context fields stored in cookies (not from URL params) */
export const CONTEXT_FIELDS = ["referrer", "landing_page"] as const;

/** Every cookie key the tracking system uses (params + context) */
export const ALL_COOKIE_KEYS = [
  ...ALL_TRACKING_PARAMS,
  ...CONTEXT_FIELDS,
] as const;

export type ClickIdParam = (typeof CLICK_ID_PARAMS)[number];
export type UtmParam = (typeof UTM_PARAMS)[number];
export type TrackingParam = (typeof ALL_TRACKING_PARAMS)[number];
export type CookieKey = (typeof ALL_COOKIE_KEYS)[number];
