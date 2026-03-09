import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      console.error("Twilio credentials not configured");
      return NextResponse.json(
        { error: "Phone validation service unavailable" },
        { status: 503 }
      );
    }

    const client = twilio(accountSid, authToken);

    const lookup = await client.lookups.v2
      .phoneNumbers(phone)
      .fetch({ fields: "line_type_intelligence" });

    const valid = lookup.valid;
    const lineType =
      lookup.lineTypeIntelligence?.type || "unknown";

    if (!valid) {
      return NextResponse.json(
        { valid: false, lineType, error: "Invalid phone number" },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true, lineType });
  } catch (error: any) {
    console.error("Phone validation error:", error);

    if (error.status === 404) {
      return NextResponse.json(
        { valid: false, error: "Phone number not found" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Phone validation failed" },
      { status: 500 }
    );
  }
}
