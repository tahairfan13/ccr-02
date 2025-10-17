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
  isComplete: boolean;
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

    // Format project name from description (first few words)
    const projectName = data.description.split(" ").slice(0, 3).join(" ") + (data.description.split(" ").length > 3 ? "..." : "");

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
                text: `<b>🎯 Project Details:</b><br>• <b>Type:</b> ${appTypes}<br>• <b>Project:</b> ${projectName}<br>• <b>Estimated Hours:</b> ${minHours.toFixed(1)}-${maxHours.toFixed(1)}<br>• <b>Estimated Cost:</b> $${data.estimatedCost.min.toLocaleString()} - $${data.estimatedCost.max.toLocaleString()}`
              }
            },
            {
              textParagraph: {
                text: `<b>📧 Contact Information:</b><br>• <b>Email:</b> ${data.email}<br>• <b>Phone:</b> ${data.countryCode} ${data.phone}<br>• <b>WhatsApp:</b> ✅ Ready to Message`
              }
            },
            {
              textParagraph: {
                text: `<b>📍 Location:</b> ${data.country}`
              }
            },
            {
              textParagraph: {
                text: data.isComplete
                  ? `<b>💡 Status:</b> CCR Report has been sent to the client. Ready for follow-up!`
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
