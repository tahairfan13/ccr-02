import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Comprehensive email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format. Please enter a valid email address.", valid: false },
        { status: 400 }
      );
    }

    // Check for common disposable email domains
    const disposableDomains = ['tempmail.com', 'throwaway.email', '10minutemail.com', 'guerrillamail.com'];
    const domain = email.split("@")[1].toLowerCase();

    if (disposableDomains.includes(domain)) {
      return NextResponse.json(
        { error: "Please use a valid business or personal email address.", valid: false },
        { status: 400 }
      );
    }

    // Email format is valid
    return NextResponse.json({
      success: true,
      valid: true,
      message: "Email format is valid",
    });
  } catch (error: any) {
    console.error("Error validating email:", error);
    return NextResponse.json(
      { error: error.message || "Failed to validate email" },
      { status: 500 }
    );
  }
}
