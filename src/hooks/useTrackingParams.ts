"use client";

import { useSyncExternalStore } from "react";
import {
  COOKIE_PREFIX,
  ALL_COOKIE_KEYS,
  type CookieKey,
} from "@/lib/tracking-constants";

export interface TrackingParams {
  // Ad platform click IDs
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  msclkid?: string;
  // UTM campaign params
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  // Context
  referrer?: string;
  landing_page?: string;
}

/**
 * Parse all _txa_ prefixed cookies into a TrackingParams object.
 * Caches the result so useSyncExternalStore gets a stable reference
 * when cookies haven't changed (Object.is comparison).
 */
let _cachedRaw = "";
let _cachedSnapshot: TrackingParams = {};

function getSnapshot(): TrackingParams {
  if (typeof document === "undefined") return SERVER_SNAPSHOT;

  const raw = document.cookie;
  if (raw === _cachedRaw) return _cachedSnapshot;

  _cachedRaw = raw;
  const params: TrackingParams = {};

  try {
    const cookies = new Map<string, string>();
    for (const pair of raw.split(";")) {
      const eqIdx = pair.indexOf("=");
      if (eqIdx === -1) continue;
      const name = pair.substring(0, eqIdx).trim();
      const value = decodeURIComponent(pair.substring(eqIdx + 1).trim());
      cookies.set(name, value);
    }

    for (const key of ALL_COOKIE_KEYS) {
      const value = cookies.get(`${COOKIE_PREFIX}${key}`);
      if (value) {
        params[key as CookieKey] = value;
      }
    }
  } catch {
    // Cookie parsing error — return empty
  }

  _cachedSnapshot = params;
  return params;
}

// Snapshot for SSR — always empty (no document.cookie on server)
const SERVER_SNAPSHOT: TrackingParams = {};

// Subscribe is a no-op: cookies don't fire events when they change,
// but the value is read once on hydration which is all we need.
function subscribe(_onStoreChange: () => void) {
  return () => {};
}

/**
 * React hook that reads tracking parameters from cookies set by middleware.
 * Uses useSyncExternalStore to avoid setState-in-effect lint errors.
 */
export function useTrackingParams(): TrackingParams {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
}

/**
 * Non-hook version for use outside React component lifecycles
 * (e.g., inside useEffect callbacks on thank-you pages).
 */
export function getTrackingParams(): TrackingParams {
  return getSnapshot();
}

/**
 * Derive a human-readable traffic source label from tracking params.
 *
 * Priority:
 *   utm_source → click ID platform name → referrer hostname → "Direct"
 */
export function getTrafficSourceLabel(params: TrackingParams): string {
  if (params.utm_source) return params.utm_source;
  if (params.gclid || params.gbraid || params.wbraid) return "google_ads";
  if (params.fbclid) return "facebook_ads";
  if (params.msclkid) return "microsoft_ads";
  if (params.referrer) return params.referrer;
  return "Direct";
}
