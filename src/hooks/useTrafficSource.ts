"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import sbjs from "sourcebuster";

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
  // Additional sourcebuster data
  firstVisit?: {
    source: string;
    medium: string;
    campaign: string;
    date: string;
  };
}

// ============================================
// Source Detection Logic
// ============================================
function detectSourceName(
  utmSource: string | null,
  utmMedium: string | null,
  sbjsSource: string,
  sbjsMedium: string
): TrafficSource {
  // Use sourcebuster data as primary, fallback to UTM params
  const source = (utmSource || sbjsSource || "").toLowerCase();
  const medium = (utmMedium || sbjsMedium || "").toLowerCase();
  
  // Meta/Facebook Ads detection
  if (source.includes("facebook") || source.includes("fb") || 
      source.includes("instagram") || source.includes("ig") || 
      source.includes("meta")) {
    return "Meta Ads";
  }
  
  // Google Ads detection
  if (source.includes("google") && (medium === "cpc" || medium === "ppc" || medium === "paid")) {
    return "Google Ads";
  }
  
  // Organic search
  if (medium === "organic" || sbjsMedium === "organic") {
    return "Organic";
  }
  
  // Referral traffic
  if (medium === "referral" || sbjsMedium === "referral") {
    return `Referral: ${sbjsSource || source}`;
  }
  
  // Social traffic
  if (medium === "social" || source.includes("linkedin") || source.includes("twitter") || 
      source.includes("tiktok") || source.includes("youtube")) {
    if (source.includes("linkedin")) return "LinkedIn";
    if (source.includes("twitter") || source.includes("x.com")) return "Twitter/X";
    if (source.includes("tiktok")) return "TikTok";
    if (source.includes("youtube")) return "YouTube";
    return "Social";
  }
  
  // Email
  if (source.includes("email") || source.includes("newsletter") || medium === "email") {
    return "Email";
  }
  
  // Direct traffic (sourcebuster marks this as "(direct)")
  if (source === "(direct)" || source === "direct" || sbjsSource === "(direct)") {
    return "Direct";
  }
  
  // Typein (user typed URL directly)
  if (sbjsMedium === "typein") {
    return "Direct";
  }
  
  // Return source as-is if we have one
  if (source && source !== "(none)") {
    return source;
  }
  
  return "Direct";
}

// ============================================
// GCLID Persistent Storage (cookie + localStorage)
// Attribution model: last-touch (overwrite)
// ============================================
const GCLID_COOKIE_NAME = "_tecaudex_gclid";
const GCLID_LS_KEY = "tecaudex_gclid";
const GCLID_EXPIRY_DAYS = 90;

function saveGclid(gclid: string): void {
  try {
    const expires = new Date(Date.now() + GCLID_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toUTCString();
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${GCLID_COOKIE_NAME}=${encodeURIComponent(gclid)}; path=/; max-age=${GCLID_EXPIRY_DAYS * 24 * 60 * 60}; expires=${expires}; SameSite=Lax${secure}`;
    localStorage.setItem(GCLID_LS_KEY, gclid);
  } catch (e) {
    console.error("Failed to save gclid:", e);
  }
}

export function getStoredGclid(): string | null {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${GCLID_COOKIE_NAME}=([^;]*)`));
    if (match) return decodeURIComponent(match[1]);
    return localStorage.getItem(GCLID_LS_KEY) || null;
  } catch {
    return null;
  }
}

function clearGclid(): void {
  try {
    document.cookie = `${GCLID_COOKIE_NAME}=; path=/; max-age=0`;
    document.cookie = `${GCLID_COOKIE_NAME}=; path=/; domain=${window.location.hostname}; max-age=0`;
    localStorage.removeItem(GCLID_LS_KEY);
  } catch {
    // silently ignore
  }
}

// ============================================
// Main Hook - Uses sourcebuster for tracking
// ============================================
export function useTrafficSource(): TrafficSourceData {
  const searchParams = useSearchParams();
  
  const [trafficData, setTrafficData] = useState<TrafficSourceData>({
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
  });

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    // Initialize sourcebuster
    sbjs.init({
      domain: window.location.hostname,
      lifetime: 6,
      session_length: 30,
    });

    // Get data from sourcebuster
    const current = sbjs.get.current;
    const first = sbjs.get.first;
    const currentAdd = sbjs.get.current_add;

    // Also get from URL params (for immediate detection before cookie sync)
    const utmSource = searchParams?.get("utm_source") || current.src || null;
    const utmMedium = searchParams?.get("utm_medium") || current.mdm || null;
    const utmCampaign = searchParams?.get("utm_campaign") || current.cmp || null;
    const utmContent = searchParams?.get("utm_content") || current.cnt || null;
    const utmTerm = searchParams?.get("utm_term") || current.trm || null;
    const urlGclid = searchParams?.get("gclid") || null;
    if (urlGclid) {
      saveGclid(urlGclid);
    }
    const gclid = urlGclid || getStoredGclid();
    const fbclid = searchParams?.get("fbclid") || null;

    // Detect the friendly source name
    const sourceName = detectSourceName(
      utmSource,
      utmMedium,
      current.src,
      current.mdm
    );

    // Handle fbclid/gclid override
    let finalSource = sourceName;
    if (fbclid && sourceName === "Direct") {
      finalSource = "Meta Ads";
    } else if (gclid && sourceName === "Direct") {
      finalSource = "Google Ads";
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate data-fetching pattern
    setTrafficData({
      source: finalSource,
      utmSource: utmSource !== "(none)" ? utmSource : null,
      utmMedium: utmMedium !== "(none)" ? utmMedium : null,
      utmCampaign: utmCampaign !== "(none)" ? utmCampaign : null,
      utmContent: utmContent !== "(none)" ? utmContent : null,
      utmTerm: utmTerm !== "(none)" ? utmTerm : null,
      gclid,
      fbclid,
      referrer: currentAdd?.rf || document.referrer || null,
      landingPage: currentAdd?.ep || window.location.href,
      firstVisit: first ? {
        source: first.src,
        medium: first.mdm,
        campaign: first.cmp,
        date: first.fd || "",
      } : undefined,
    });

  }, [searchParams]);

  return trafficData;
}

// ============================================
// Utility to get raw sourcebuster data
// ============================================
export function getSourcebusterData() {
  if (typeof window === "undefined") return null;
  
  try {
    return {
      current: sbjs.get.current,
      first: sbjs.get.first,
      currentAdd: sbjs.get.current_add,
      firstAdd: sbjs.get.first_add,
      session: sbjs.get.session,
      udata: sbjs.get.udata,
    };
  } catch {
    return null;
  }
}

// ============================================
// Utility function to clear stored tracking (for testing)
// ============================================
export function clearTrafficSource(): void {
  if (typeof window === "undefined") return;
  
  try {
    // Clear sourcebuster cookies
    const cookies = ["sbjs_current", "sbjs_first", "sbjs_current_add", "sbjs_first_add", "sbjs_session", "sbjs_udata"];
    cookies.forEach(name => {
      document.cookie = `${name}=; path=/; max-age=0`;
      document.cookie = `${name}=; path=/; domain=${window.location.hostname}; max-age=0`;
    });
    
    // Clear GCLID persistent storage
    clearGclid();
    
    // Also clear old storage keys
    localStorage.removeItem("tecaudex_traffic_source");
    sessionStorage.removeItem("tecaudex_traffic_source");
    document.cookie = "tecaudex_traffic_source=; path=/; max-age=0";
    
    console.log("🗑️ Traffic source data cleared");
  } catch (e) {
    console.error("Failed to clear traffic source:", e);
  }
}
