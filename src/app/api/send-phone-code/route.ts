import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Send verification code via Twilio Verify API
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications.create({ to: phone, channel: "sms" });

    return NextResponse.json({
      success: true,
      status: verification.status,
    });
  } catch (error: any) {
    console.error("Error sending verification code:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send verification code" },
      { status: 500 }
    );
  }
}
