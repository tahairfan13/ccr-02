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
    
    console.log("🚀 Traffic Source Hook Initializing (with sourcebuster)...");
    console.log("📍 Current URL:", window.location.href);
    console.log("📍 Search params:", searchParams?.toString());
    
    // Initialize sourcebuster
    // This will automatically:
    // - Parse UTM parameters
    // - Detect referrer
    // - Handle session logic
    // - Store in cookies
    sbjs.init({
      domain: window.location.hostname,
      lifetime: 6, // Cookie lifetime in months
      session_length: 30, // Session length in minutes
      callback: () => {
        console.log("📊 Sourcebuster initialized");
        console.log("📊 Current source:", sbjs.get.current);
        console.log("📊 First source:", sbjs.get.first);
        console.log("📊 Current add:", sbjs.get.current_add);
      }
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
    const gclid = searchParams?.get("gclid") || null;
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
    
    const newData: TrafficSourceData = {
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
    };
    
    setTrafficData(newData);
    
    console.log("✅ Traffic data captured:", newData);
    console.log(`✨ Detected source: ${finalSource}`);
    
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
    
    // Also clear old storage keys
    localStorage.removeItem("tecaudex_traffic_source");
    sessionStorage.removeItem("tecaudex_traffic_source");
    document.cookie = "tecaudex_traffic_source=; path=/; max-age=0";
    
    console.log("🗑️ Traffic source data cleared");
  } catch (e) {
    console.error("Failed to clear traffic source:", e);
  }
}
