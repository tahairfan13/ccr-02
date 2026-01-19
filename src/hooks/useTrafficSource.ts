"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";

export type TrafficSource = "Meta Ads" | "Google Ads" | "Direct" | "Organic" | string;

export interface TrafficSourceData {
  source: TrafficSource;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  gclid: string | null;
  fbclid: string | null;
  referrer: string | null;
  landingPage: string | null;
}

const STORAGE_KEY = "tecaudex_traffic_source";

// ============================================
// Storage Functions
// ============================================
function saveTrafficSource(data: TrafficSourceData): void {
  if (typeof window === "undefined") return;
  
  try {
    const dataToStore = JSON.stringify(data);
    
    // Save to localStorage (persists across sessions)
    localStorage.setItem(STORAGE_KEY, dataToStore);
    
    // Also save to sessionStorage (for current session)
    sessionStorage.setItem(STORAGE_KEY, dataToStore);
    
    // Save to cookie for 30 days (compressed)
    const cookieValue = encodeURIComponent(JSON.stringify({
      s: data.source,
      us: data.utmSource,
      um: data.utmMedium,
      uc: data.utmCampaign,
      uct: data.utmContent,
      ut: data.utmTerm,
      g: data.gclid,
      f: data.fbclid,
      r: data.referrer,
      lp: data.landingPage,
    }));
    document.cookie = `${STORAGE_KEY}=${cookieValue}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
    
    console.log("✅ Traffic source saved:", data);
  } catch (e) {
    console.error("Failed to save traffic source:", e);
  }
}

function loadTrafficSource(): TrafficSourceData | null {
  if (typeof window === "undefined") return null;
  
  try {
    // Try sessionStorage first (most recent session data)
    const sessionData = sessionStorage.getItem(STORAGE_KEY);
    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      console.log("📦 Loaded from sessionStorage:", parsed);
      return parsed;
    }
    
    // Try localStorage (persists across sessions)
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
      const parsed = JSON.parse(localData);
      // Also save to session storage for faster access
      sessionStorage.setItem(STORAGE_KEY, localData);
      console.log("📦 Loaded from localStorage:", parsed);
      return parsed;
    }
    
    // Try cookie as fallback
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === STORAGE_KEY && value) {
        const parsed = JSON.parse(decodeURIComponent(value));
        console.log("🍪 Loaded from cookie:", parsed);
        return {
          source: parsed.s || "Direct",
          utmSource: parsed.us || null,
          utmMedium: parsed.um || null,
          utmCampaign: parsed.uc || null,
          utmContent: parsed.uct || null,
          utmTerm: parsed.ut || null,
          gclid: parsed.g || null,
          fbclid: parsed.f || null,
          referrer: parsed.r || null,
          landingPage: parsed.lp || null,
        };
      }
    }
  } catch (e) {
    console.error("Failed to load traffic source:", e);
  }
  
  return null;
}

// ============================================
// Detection Functions
// ============================================
function detectSource(
  utmSource: string | null,
  utmMedium: string | null,
  utmCampaign: string | null,
  gclid: string | null,
  fbclid: string | null,
  referrer: string
): TrafficSource {
  const source = (utmSource || "").toLowerCase();
  const medium = (utmMedium || "").toLowerCase();
  
  console.log("🔍 Detecting source from:", { utmSource, utmMedium, gclid, fbclid, referrer });
  
  // Priority 1: Check for Meta/Facebook Ads (fbclid or utm params)
  if (fbclid) {
    console.log("✨ Detected: Meta Ads (via fbclid)");
    return "Meta Ads";
  }
  if (source.includes("facebook") || source.includes("fb") || 
      source.includes("instagram") || source.includes("ig") || 
      source.includes("meta")) {
    console.log("✨ Detected: Meta Ads (via utm_source)");
    return "Meta Ads";
  }
  
  // Priority 2: Check for Google Ads (gclid or utm params with cpc/ppc)
  if (gclid) {
    console.log("✨ Detected: Google Ads (via gclid)");
    return "Google Ads";
  }
  if (source.includes("google") && (medium === "cpc" || medium === "ppc" || medium === "paid")) {
    console.log("✨ Detected: Google Ads (via utm_source + utm_medium)");
    return "Google Ads";
  }
  
  // Priority 3: Check referrer for organic traffic
  const ref = referrer.toLowerCase();
  if (ref.includes("facebook.com") || ref.includes("instagram.com") || ref.includes("fb.com") || ref.includes("messenger.com")) {
    console.log("✨ Detected: Organic (from Meta platforms)");
    return "Organic";
  }
  if (ref.includes("google.com") || ref.includes("google.co.") || ref.includes("bing.com") || ref.includes("yahoo.com")) {
    console.log("✨ Detected: Organic (from Search Engines)");
    return "Organic";
  }
  
  // Priority 4: If there are any UTM params, classify based on them
  if (utmSource) {
    // Check for other known sources
    if (source.includes("linkedin")) {
      console.log("✨ Detected: LinkedIn");
      return "LinkedIn";
    }
    if (source.includes("twitter") || source.includes("x.com")) {
      console.log("✨ Detected: Twitter/X");
      return "Twitter/X";
    }
    if (source.includes("tiktok")) {
      console.log("✨ Detected: TikTok");
      return "TikTok";
    }
    if (source.includes("email") || source.includes("newsletter")) {
      console.log("✨ Detected: Email");
      return "Email";
    }
    // Return the utm_source as-is for unknown sources
    console.log(`✨ Detected: ${utmSource} (custom UTM source)`);
    return utmSource;
  }
  
  // Priority 5: Check if there's a referrer but no UTM params
  if (referrer && !referrer.includes(typeof window !== "undefined" ? window.location.hostname : "")) {
    try {
      const refUrl = new URL(referrer);
      console.log(`✨ Detected: Referral from ${refUrl.hostname}`);
      return `Referral: ${refUrl.hostname}`;
    } catch {
      // Invalid referrer URL
    }
  }
  
  console.log("✨ Detected: Direct");
  return "Direct";
}

// ============================================
// Main Hook - Uses Next.js useSearchParams
// ============================================
export function useTrafficSource(): TrafficSourceData {
  const searchParams = useSearchParams();
  
  const [trafficData, setTrafficData] = useState<TrafficSourceData>(() => {
    // Try to load from storage immediately (synchronous)
    if (typeof window !== "undefined") {
      const stored = loadTrafficSource();
      if (stored && stored.source !== "Direct") {
        return stored;
      }
    }
    return {
      source: "Direct",
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
      utmTerm: null,
      gclid: null,
      fbclid: null,
      referrer: null,
      landingPage: null,
    };
  });

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;
    
    console.log("🚀 Traffic Source Hook Initializing...");
    console.log("📍 Current URL:", window.location.href);
    console.log("📍 Search params from Next.js:", searchParams?.toString());
    console.log("📍 Referrer:", document.referrer);
    
    // Get URL parameters from Next.js useSearchParams (most reliable in App Router)
    const utmSource = searchParams?.get("utm_source") || null;
    const utmMedium = searchParams?.get("utm_medium") || null;
    const utmCampaign = searchParams?.get("utm_campaign") || null;
    const utmContent = searchParams?.get("utm_content") || null;
    const utmTerm = searchParams?.get("utm_term") || null;
    const gclid = searchParams?.get("gclid") || null;
    const fbclid = searchParams?.get("fbclid") || null;
    
    const referrer = document.referrer || "";
    const landingPage = window.location.href;
    
    const hasTrackingParams = utmSource || utmMedium || utmCampaign || gclid || fbclid;
    
    console.log("📊 Tracking params found:", { utmSource, utmMedium, utmCampaign, utmContent, utmTerm, gclid, fbclid });
    
    // If we have fresh tracking params in URL, use them (new campaign visit)
    if (hasTrackingParams) {
      const source = detectSource(utmSource, utmMedium, utmCampaign, gclid, fbclid, referrer);
      const newData: TrafficSourceData = {
        source,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        utmTerm,
        gclid,
        fbclid,
        referrer,
        landingPage,
      };
      
      saveTrafficSource(newData);
      setTrafficData(newData);
      console.log("✅ Fresh tracking data captured:", newData);
      return;
    }
    
    // No fresh params - check if we have stored data
    const storedData = loadTrafficSource();
    if (storedData && storedData.source !== "Direct") {
      setTrafficData(storedData);
      console.log("✅ Using stored tracking data:", storedData);
      return;
    }
    
    // No stored data - detect from referrer only
    const source = detectSource(null, null, null, null, null, referrer);
    const newData: TrafficSourceData = {
      source,
      utmSource: null,
      utmMedium: source !== "Direct" ? "organic" : null,
      utmCampaign: null,
      utmContent: null,
      utmTerm: null,
      gclid: null,
      fbclid: null,
      referrer: referrer || null,
      landingPage,
    };
    
    // Save if not direct (to preserve organic source info)
    if (source !== "Direct") {
      saveTrafficSource(newData);
    }
    
    setTrafficData(newData);
    console.log("✅ Final traffic data:", newData);
    
  }, [searchParams]); // Re-run when searchParams change

  return trafficData;
}

// ============================================
// Utility function to clear stored tracking (for testing)
// ============================================
export function clearTrafficSource(): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    document.cookie = `${STORAGE_KEY}=; path=/; max-age=0`;
    console.log("🗑️ Traffic source data cleared");
  } catch (e) {
    console.error("Failed to clear traffic source:", e);
  }
}

// ============================================
// Utility function to get traffic source for API calls
// ============================================
export function getTrafficSourceForAPI(): TrafficSourceData {
  const stored = loadTrafficSource();
  return stored || {
    source: "Direct",
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmContent: null,
    utmTerm: null,
    gclid: null,
    fbclid: null,
    referrer: null,
    landingPage: null,
  };
}
