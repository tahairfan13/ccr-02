interface TrafficSourceData {
  source: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
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

export async function sendGoogleChatNotification(data: LeadData): Promise<void> {
  try {
    const statusEmoji = data.isComplete ? "✅" : "⏳";
    const statusText = data.isComplete ? "COMPLETE" : "INCOMPLETE";

    // Calculate hours range (assuming -20% to +30% variance)
    const minHours = data.totalHours * 0.8;
    const maxHours = data.totalHours * 1.3;

    // Format application types
    const appTypes = data.applicationType.join(", ");

    // Format traffic source - handle various formats
    const getSourceLabel = (source: string): string => {
      const sourceLower = source.toLowerCase();
      
      if (sourceLower.includes("meta") || sourceLower.includes("facebook") || sourceLower.includes("fb") || sourceLower.includes("instagram")) {
        return "📘 Meta Ads (Facebook/Instagram)";
      }
      if (sourceLower.includes("google") && (sourceLower.includes("ads") || sourceLower.includes("cpc") || sourceLower.includes("ppc"))) {
        return "🔍 Google Ads";
      }
      if (sourceLower.includes("organic")) {
        return "🌱 Organic Search";
      }
      if (sourceLower.includes("linkedin")) {
        return "💼 LinkedIn";
      }
      if (sourceLower.includes("twitter") || sourceLower.includes("x.com")) {
        return "🐦 Twitter/X";
      }
      if (sourceLower.includes("tiktok")) {
        return "🎵 TikTok";
      }
      if (sourceLower.includes("email") || sourceLower.includes("newsletter")) {
        return "📧 Email";
      }
      if (sourceLower.includes("referral")) {
        return `🔗 ${source}`;
      }
      if (sourceLower === "direct" || sourceLower === "unknown") {
        return "🔗 Direct";
      }
      
      // Return the source as-is if unrecognized
      return `🔗 ${source}`;
    };

    const trafficSourceLabel = data.trafficSource
      ? getSourceLabel(data.trafficSource.source)
      : "🔗 Not tracked";

    // Use exact cost if provided, otherwise show range
    const costDisplay = data.exactCost
      ? `$${data.exactCost.toLocaleString()}`
      : `$${data.estimatedCost.min.toLocaleString()} - $${data.estimatedCost.max.toLocaleString()}`;

    const message = {
      text: `${statusEmoji} Sales Lead Alert`,
      cards: [{
        header: {
          title: `${statusEmoji} ${statusText} - New Lead Alert: ${data.name}`,
          subtitle: "INFO",
          imageUrl: "https://fonts.gstatic.com/s/i/short-term/release/googlesymbols/priority_high/default/24px.svg"
        },
        sections: [{
          widgets: [
            {
              textParagraph: {
                text: `<b>👤 Client Information:</b><br>• <b>Name:</b> ${data.name}<br>• <b>Email:</b> ${data.email}<br>• <b>Phone:</b> ${data.countryCode} ${data.phone} ✅ Verified<br>• <b>Region:</b> ${data.country}`
              }
            },
            {
              textParagraph: {
                text: `<b>Traffic Source:</b> ${trafficSourceLabel}${data.trafficSource?.utmCampaign ? `<br>• <b>Campaign:</b> ${data.trafficSource.utmCampaign}` : ''}${data.trafficSource?.utmMedium ? `<br>• <b>Medium:</b> ${data.trafficSource.utmMedium}` : ''}${data.trafficSource?.utmSource ? `<br>• <b>Source:</b> ${data.trafficSource.utmSource}` : ''}`
              }
            },
            {
              textParagraph: {
                text: `<b>🎯 Project Details:</b><br>• <b>Type:</b> ${appTypes}<br>• <b>Scale:</b> ${data.projectScale || 'Not specified'}<br>• <b>Description:</b> ${data.description}`
              }
            },
            {
              textParagraph: {
                text: `<b>💰 Cost Estimate:</b><br>• <b>Total Hours:</b> ${data.totalHours} hrs<br>• <b>Hours Range:</b> ${minHours.toFixed(1)}-${maxHours.toFixed(1)} hrs<br>• <b>Exact Cost:</b> ${costDisplay}`
              }
            },
            {
              textParagraph: {
                text: data.isComplete
                  ? `<b>💡 Status:</b> CCR Report has been sent to the client. Ready for follow-up!<br>• <b>WhatsApp:</b> ✅ Ready to Message`
                  : `<b>💡 Status:</b> Lead is filling out the form. Initial estimate in progress.`
              }
            }
          ]
        }]
      }]
    };

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Chat webhook error:", response.status, errorText);
      throw new Error(`Webhook failed: ${response.status}`);
    }

    console.log("Google Chat notification sent successfully:", statusText);
  } catch (error) {
    console.error("Error sending Google Chat notification:", error);
    // Don't throw - we don't want to break the user flow
  }
}
