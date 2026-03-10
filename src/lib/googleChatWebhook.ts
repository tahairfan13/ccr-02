interface TrafficSourceData {
  source: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  msclkid?: string;
  landing_page?: string;
  referrer?: string;
  // Legacy camelCase format (sourcebuster)
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
}

interface LeadData {
  name: string;
  email: string;
  country: string;
  phone: string;
  countryCode: string;
  applicationType: string[];
  projectScale: string | null;
  description: string;
  totalHours: number;
  estimatedCost: {
    min: number;
    max: number;
  };
  exactCost?: number;
  isComplete: boolean;
  trafficSource?: TrafficSourceData;
}

const WEBHOOK_URL = "https://chat.googleapis.com/v1/spaces/AAAACFWW_6g/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=zQ8eDGM5G-ABlY0M7ZW2ZPqfhZWRTClqzcNINlsDLb0";

function getSourceLabel(source: string): string {
  const s = source.toLowerCase();
  if (s.includes("meta") || s.includes("facebook") || s.includes("fb") || s.includes("instagram")) return "Meta Ads";
  if (s.includes("google") && (s.includes("ads") || s.includes("cpc") || s.includes("ppc"))) return "Google Ads";
  if (s === "google_ads") return "Google Ads";
  if (s === "facebook_ads") return "Meta Ads";
  if (s === "microsoft_ads") return "Microsoft Ads";
  if (s.includes("organic")) return "Organic Search";
  if (s.includes("linkedin")) return "LinkedIn";
  if (s.includes("twitter") || s.includes("x.com")) return "Twitter/X";
  if (s.includes("tiktok")) return "TikTok";
  if (s.includes("email") || s.includes("newsletter")) return "Email";
  if (s.includes("referral")) return `Referral (${source})`;
  if (s === "direct" || s === "unknown") return "Direct";
  return source;
}

function formatTrafficSection(ts?: TrafficSourceData): string {
  if (!ts) return "<b>Attribution</b><br>No tracking data";

  const sourceLabel = getSourceLabel(ts.source);
  const campaign = ts.utm_campaign || ts.utmCampaign || "";
  const medium = ts.utm_medium || ts.utmMedium || "";
  const source = ts.utm_source || ts.utmSource || "";
  const gclid = ts.gclid || "";
  const fbclid = ts.fbclid || "";
  const msclkid = ts.msclkid || "";
  const landing = ts.landing_page || "";
  const referrer = ts.referrer || "";

  let text = `<b>Attribution</b><br>Channel: ${sourceLabel}`;
  if (source) text += `<br>Source: ${source}`;
  if (medium) text += `<br>Medium: ${medium}`;
  if (campaign) text += `<br>Campaign: ${campaign}`;
  if (ts.utm_term) text += `<br>Term: ${ts.utm_term}`;
  if (ts.utm_content) text += `<br>Content: ${ts.utm_content}`;
  if (gclid) text += `<br>GCLID: ${gclid.substring(0, 24)}${gclid.length > 24 ? "..." : ""}`;
  if (fbclid) text += `<br>FBCLID: ${fbclid.substring(0, 24)}${fbclid.length > 24 ? "..." : ""}`;
  if (msclkid) text += `<br>MSCLKID: ${msclkid.substring(0, 24)}${msclkid.length > 24 ? "..." : ""}`;
  if (landing) text += `<br>Landing page: ${landing}`;
  if (referrer) text += `<br>Referrer: ${referrer}`;
  return text;
}

export async function sendGoogleChatNotification(data: LeadData): Promise<void> {
  try {
    const status = data.isComplete ? "SUBMITTED" : "IN PROGRESS";
    const appTypes = data.applicationType.join(", ");

    const costDisplay = data.exactCost
      ? `£${data.exactCost.toLocaleString()}`
      : `£${data.estimatedCost.min.toLocaleString()} - £${data.estimatedCost.max.toLocaleString()}`;

    const minHours = Math.round(data.totalHours * 0.8);
    const maxHours = Math.round(data.totalHours * 1.3);

    const message = {
      text: `CCR Lead [${status}]: ${data.name}`,
      cards: [{
        header: {
          title: `${data.name} — ${status}`,
          subtitle: `${appTypes} | ${data.projectScale || "Not specified"} | ${costDisplay}`,
        },
        sections: [
          {
            header: "Contact",
            widgets: [{
              textParagraph: {
                text: [
                  `<b>${data.name}</b>`,
                  `${data.email}`,
                  `${data.countryCode} ${data.phone} (verified)`,
                  `${data.country}`,
                ].join("<br>")
              }
            }]
          },
          {
            header: "Project",
            widgets: [{
              textParagraph: {
                text: [
                  `Type: ${appTypes}`,
                  `Scale: ${data.projectScale || "Not specified"}`,
                  `Hours: ${data.totalHours}h (range: ${minHours}–${maxHours}h)`,
                  `Estimate: ${costDisplay}`,
                  ``,
                  `${data.description.length > 300 ? data.description.substring(0, 300) + "..." : data.description}`,
                ].join("<br>")
              }
            }]
          },
          {
            header: "Attribution",
            widgets: [{
              textParagraph: {
                text: formatTrafficSection(data.trafficSource)
              }
            }]
          },
          {
            widgets: [{
              textParagraph: {
                text: data.isComplete
                  ? `<b>Status:</b> Report sent to client. Ready for follow-up.`
                  : `<b>Status:</b> Lead is still completing the form.`
              }
            }]
          }
        ]
      }]
    };

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Chat webhook error:", response.status, errorText);
      throw new Error(`Webhook failed: ${response.status}`);
    }
  } catch (error) {
    console.error("Error sending Google Chat notification:", error);
  }
}
