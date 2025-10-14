import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !code) {
      return NextResponse.json(
        { error: "Phone number and code are required" },
        { status: 400 }
      );
    }

    // Verify the code via Twilio Verify API
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks.create({ to: phone, code });

    if (verificationCheck.status === "approved") {
      return NextResponse.json({
        success: true,
        verified: true,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error verifying code:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify code" },
      { status: 500 }
    );
  }
}
