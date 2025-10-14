import { NextRequest, NextResponse } from "next/server";
import dns from "dns";
import { promisify } from "util";

const resolveMx = promisify(dns.resolveMx);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format", valid: false },
        { status: 400 }
      );
    }

    // Extract domain from email
    const domain = email.split("@")[1];

    try {
      // Check if domain has MX records (mail servers)
      const mxRecords = await resolveMx(domain);

      if (mxRecords && mxRecords.length > 0) {
        return NextResponse.json({
          success: true,
          valid: true,
          message: "Email domain is valid",
        });
      } else {
        return NextResponse.json(
          {
            error: "Email domain has no mail servers",
            valid: false
          },
          { status: 400 }
        );
      }
    } catch (dnsError: any) {
      // DNS lookup failed - domain doesn't exist or has no MX records
      return NextResponse.json(
        {
          error: "Email domain does not exist or cannot receive emails",
          valid: false
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error validating email:", error);
    return NextResponse.json(
      { error: error.message || "Failed to validate email" },
      { status: 500 }
    );
  }
}
