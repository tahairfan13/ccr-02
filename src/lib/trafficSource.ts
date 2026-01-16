/**
 * Utility functions to detect and track traffic source
 * Supports: Meta Ads, Google Ads, and Direct traffic
 */

export interface TrafficSourceData {
  trafficSource: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
}

/**
 * Detects the traffic source based on URL parameters and referrer
 * Returns a readable source name: "Meta Ads", "Google Ads", "Direct", or referrer domain
 */
export function detectTrafficSource(): TrafficSourceData {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    return {
      trafficSource: 'Unknown',
    };
  }

  const urlParams = new URLSearchParams(window.location.search);
  const referrer = document.referrer;
  
  // Extract UTM parameters
  const utmSource = urlParams.get('utm_source') || undefined;
  const utmMedium = urlParams.get('utm_medium') || undefined;
  const utmCampaign = urlParams.get('utm_campaign') || undefined;

  let trafficSource = 'Direct';

  // Check for Meta/Facebook Ads
  if (utmSource) {
    const source = utmSource.toLowerCase();
    
    // Meta Ads detection
    if (source.includes('facebook') || source.includes('fb') || source.includes('meta') || source.includes('instagram') || source.includes('ig')) {
      trafficSource = 'Meta Ads';
    }
    // Google Ads detection
    else if (source.includes('google') || source === 'adwords' || utmMedium?.toLowerCase() === 'cpc') {
      trafficSource = 'Google Ads';
    }
    // Other UTM sources
    else {
      trafficSource = utmSource;
    }
  }
  // Check referrer if no UTM parameters
  else if (referrer) {
    try {
      const referrerUrl = new URL(referrer);
      const referrerDomain = referrerUrl.hostname;

      // Meta/Facebook referrer
      if (referrerDomain.includes('facebook.com') || referrerDomain.includes('fb.com') || 
          referrerDomain.includes('instagram.com') || referrerDomain.includes('meta.com')) {
        trafficSource = 'Meta';
      }
      // Google referrer
      else if (referrerDomain.includes('google.com') || referrerDomain.includes('google.') ||
               referrerDomain.includes('googleadservices.com')) {
        trafficSource = 'Google';
      }
      // Other referrers
      else if (referrerDomain !== window.location.hostname) {
        trafficSource = `Referral: ${referrerDomain}`;
      }
    } catch (error) {
      console.error('Error parsing referrer:', error);
    }
  }

  // Store in sessionStorage to persist across page reloads
  try {
    const storedSource = sessionStorage.getItem('trafficSource');
    if (!storedSource) {
      sessionStorage.setItem('trafficSource', trafficSource);
      if (utmSource) sessionStorage.setItem('utmSource', utmSource);
      if (utmMedium) sessionStorage.setItem('utmMedium', utmMedium);
      if (utmCampaign) sessionStorage.setItem('utmCampaign', utmCampaign);
      if (referrer) sessionStorage.setItem('referrer', referrer);
    } else {
      // Use stored values for consistent tracking throughout the session
      trafficSource = storedSource;
    }
  } catch (error) {
    console.error('Error accessing sessionStorage:', error);
  }

  return {
    trafficSource,
    utmSource,
    utmMedium,
    utmCampaign,
    referrer: referrer || undefined,
  };
}

/**
 * Get stored traffic source data from sessionStorage
 */
export function getStoredTrafficSource(): TrafficSourceData {
  if (typeof window === 'undefined') {
    return { trafficSource: 'Unknown' };
  }

  try {
    return {
      trafficSource: sessionStorage.getItem('trafficSource') || 'Direct',
      utmSource: sessionStorage.getItem('utmSource') || undefined,
      utmMedium: sessionStorage.getItem('utmMedium') || undefined,
      utmCampaign: sessionStorage.getItem('utmCampaign') || undefined,
      referrer: sessionStorage.getItem('referrer') || undefined,
    };
  } catch (error) {
    console.error('Error accessing sessionStorage:', error);
    return { trafficSource: 'Unknown' };
  }
}

/**
 * Get a formatted display string for the traffic source
 */
export function formatTrafficSource(data: TrafficSourceData): string {
  if (data.utmCampaign) {
    return `${data.trafficSource} (Campaign: ${data.utmCampaign})`;
  }
  return data.trafficSource;
}
