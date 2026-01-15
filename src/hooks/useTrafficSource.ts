"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export type TrafficSource = "meta" | "google" | "direct";

export interface TrafficSourceData {
  source: TrafficSource;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  gclid: string | null;
  fbclid: string | null;
}

const SESSION_STORAGE_KEY = "traffic_source_session";
const LOCAL_STORAGE_KEY = "traffic_source_data";
const COOKIE_NAME = "traffic_src";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

// ============================================
// Storage Functions (with fallbacks)
// ============================================

function setCookie(data: TrafficSourceData): void {
  try {
    // Store minimal data in cookie to stay under size limits
    const cookieData = {
      s: data.source,
      us: data.utmSource,
      um: data.utmMedium,
      uc: data.utmCampaign,
    };
    const value = encodeURIComponent(JSON.stringify(cookieData));
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  } catch {
    // Cookie storage failed
  }
}

function getCookie(): Partial<TrafficSourceData> | null {
  try {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === COOKIE_NAME && value) {
        const parsed = JSON.parse(decodeURIComponent(value));
        return {
          source: parsed.s,
          utmSource: parsed.us,
          utmMedium: parsed.um,
          utmCampaign: parsed.uc,
        };
      }
    }
  } catch {
    // Cookie parse failed
  }
  return null;
}

function saveToSessionStorage(data: TrafficSourceData): void {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage not available
  }
}

function loadFromSessionStorage(): TrafficSourceData | null {
  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as TrafficSourceData;
    }
  } catch {
    // sessionStorage not available
  }
  return null;
}

function saveToLocalStorage(data: TrafficSourceData): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage not available
  }
}

function loadFromLocalStorage(): TrafficSourceData | null {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as TrafficSourceData;
    }
  } catch {
    // localStorage not available
  }
  return null;
}

// Save to all storage mechanisms for redundancy
function saveToAllStorage(data: TrafficSourceData): void {
  saveToSessionStorage(data);
  saveToLocalStorage(data);
  setCookie(data);
}

// Load with fallback chain: sessionStorage -> localStorage -> cookie
function loadFromAnyStorage(): TrafficSourceData | null {
  // Try sessionStorage first (most reliable for current session)
  const sessionData = loadFromSessionStorage();
  if (sessionData && sessionData.source !== "direct") {
    return sessionData;
  }

  // Try localStorage second
  const localData = loadFromLocalStorage();
  if (localData && localData.source !== "direct") {
    return localData;
  }

  // Try cookie as last resort
  const cookieData = getCookie();
  if (cookieData && cookieData.source && cookieData.source !== "direct") {
    return {
      source: cookieData.source,
      utmSource: cookieData.utmSource || null,
      utmMedium: cookieData.utmMedium || null,
      utmCampaign: cookieData.utmCampaign || null,
      utmContent: null,
      utmTerm: null,
      gclid: null,
      fbclid: null,
    };
  }

  return null;
}

// ============================================
// Detection Functions
// ============================================

function detectSourceFromReferrer(): TrafficSource {
  if (typeof window === "undefined") return "direct";

  const referrer = document.referrer.toLowerCase();
  if (!referrer) return "direct";

  // Meta platforms (organic traffic)
  if (
    referrer.includes("facebook.com") ||
    referrer.includes("fb.com") ||
    referrer.includes("instagram.com") ||
    referrer.includes("messenger.com") ||
    referrer.includes("l.facebook.com") // Facebook's link shim
  ) {
    return "meta";
  }

  // Google platforms (organic traffic)
  if (
    referrer.includes("google.com") ||
    referrer.includes("google.co.") ||
    referrer.includes("googleapis.com")
  ) {
    return "google";
  }

  return "direct";
}

/**
 * Detection priority (2025/2026 best practice):
 * 1. UTM parameters - Safari explicitly does NOT strip these
 * 2. Click IDs (gclid/fbclid) - Being stripped by Safari, less reliable
 * 3. Referrer - Also being stripped, least reliable
 */
function detectSourceFromParams(
  utmSource: string | null,
  gclid: string | null,
  fbclid: string | null
): TrafficSource {
  // PRIORITY 1: Check UTM source parameter first (most reliable in 2025/2026)
  // Safari explicitly allows "campaign-style parameters" like UTMs
  if (utmSource) {
    const sourceLower = utmSource.toLowerCase();

    // Meta platforms
    if (
      sourceLower.includes("facebook") ||
      sourceLower.includes("fb") ||
      sourceLower.includes("instagram") ||
      sourceLower.includes("ig") ||
      sourceLower.includes("meta")
    ) {
      return "meta";
    }

    // Google platforms
    if (sourceLower.includes("google")) {
      return "google";
    }
  }

  // PRIORITY 2: Click IDs (less reliable - Safari strips these in Private Browsing,
  // Mail, Messages, and may expand to regular browsing)
  if (gclid) return "google";
  if (fbclid) return "meta";

  return "direct";
}

// ============================================
// Main Hook
// ============================================

export function useTrafficSource(): TrafficSourceData {
  const searchParams = useSearchParams();
  const [trafficData, setTrafficData] = useState<TrafficSourceData>(() => {
    // Initialize with stored data if available (for SSR hydration)
    if (typeof window !== "undefined") {
      const stored = loadFromAnyStorage();
      if (stored) return stored;
    }
    return {
      source: "direct",
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
      utmTerm: null,
      gclid: null,
      fbclid: null,
    };
  });

  useEffect(() => {
    // Get current URL params immediately (before any browser intervention)
    const utmSource = searchParams.get("utm_source");
    const utmMedium = searchParams.get("utm_medium");
    const utmCampaign = searchParams.get("utm_campaign");
    const utmContent = searchParams.get("utm_content");
    const utmTerm = searchParams.get("utm_term");
    const gclid = searchParams.get("gclid");
    const fbclid = searchParams.get("fbclid");

    const hasUrlParams = utmSource || utmMedium || utmCampaign || gclid || fbclid;

    // CASE 1: URL has tracking params - use them (fresh attribution)
    if (hasUrlParams) {
      const source = detectSourceFromParams(utmSource, gclid, fbclid);
      const newData: TrafficSourceData = {
        source,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        utmTerm,
        gclid,
        fbclid,
      };
      saveToAllStorage(newData);
      setTrafficData(newData);
      return;
    }

    // CASE 2: No URL params - check stored attribution
    const storedData = loadFromAnyStorage();
    if (storedData && storedData.source !== "direct") {
      setTrafficData(storedData);
      return;
    }

    // CASE 3: Fallback to referrer detection (for organic traffic)
    // Note: Safari is stripping tracking data from referrer too, but
    // domain detection (facebook.com, google.com) still works
    const referrerSource = detectSourceFromReferrer();
    const newData: TrafficSourceData = {
      source: referrerSource,
      utmSource: null,
      utmMedium: referrerSource !== "direct" ? "organic" : null,
      utmCampaign: null,
      utmContent: null,
      utmTerm: null,
      gclid: null,
      fbclid: null,
    };

    // Only save non-direct sources
    if (referrerSource !== "direct") {
      saveToAllStorage(newData);
    }

    setTrafficData(newData);
  }, [searchParams]);

  return trafficData;
}
