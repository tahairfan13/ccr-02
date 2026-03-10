import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  COOKIE_PREFIX,
  COOKIE_MAX_AGE_SECONDS,
  ALL_TRACKING_PARAMS,
} from "@/lib/tracking-constants";

export function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const response = NextResponse.next();

  // Collect tracking params from the URL query string
  const trackingValues: Record<string, string> = {};
  for (const param of ALL_TRACKING_PARAMS) {
    const value = searchParams.get(param);
    if (value) {
      trackingValues[param] = value;
    }
  }

  const isProduction = process.env.NODE_ENV === "production";

  // Only set cookies if at least one tracking param is present in the URL.
  // This overwrites previous values (last-touch attribution).
  if (Object.keys(trackingValues).length > 0) {
    for (const [param, value] of Object.entries(trackingValues)) {
      response.cookies.set(`${COOKIE_PREFIX}${param}`, value, {
        path: "/",
        maxAge: COOKIE_MAX_AGE_SECONDS,
        httpOnly: false, // Must be readable by client-side JS
        secure: isProduction,
        sameSite: "lax",
      });
    }

    // Store the landing page path
    response.cookies.set(
      `${COOKIE_PREFIX}landing_page`,
      request.nextUrl.pathname,
      {
        path: "/",
        maxAge: COOKIE_MAX_AGE_SECONDS,
        httpOnly: false,
        secure: isProduction,
        sameSite: "lax",
      },
    );
  }

  // Capture external referrer when there are no tracking params and no
  // existing attribution cookies. This identifies organic/referral traffic.
  if (
    Object.keys(trackingValues).length === 0 &&
    !request.cookies.get(`${COOKIE_PREFIX}utm_source`) &&
    !request.cookies.get(`${COOKIE_PREFIX}gclid`) &&
    !request.cookies.get(`${COOKIE_PREFIX}referrer`)
  ) {
    const referer = request.headers.get("referer");
    if (referer) {
      try {
        const refererUrl = new URL(referer);
        if (refererUrl.hostname !== request.nextUrl.hostname) {
          response.cookies.set(
            `${COOKIE_PREFIX}referrer`,
            refererUrl.hostname,
            {
              path: "/",
              maxAge: COOKIE_MAX_AGE_SECONDS,
              httpOnly: false,
              secure: isProduction,
              sameSite: "lax",
            },
          );
        }
      } catch {
        // Invalid referer URL — ignore
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all page requests. Exclude:
     * - /api routes
     * - /_next/static, /_next/image, /_next/data
     * - Static assets by extension
     */
    "/((?!api|_next/static|_next/image|_next/data|favicon\\.ico|icon\\.png|icon\\.svg|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf|eot|mp4|webm)).*)",
  ],
};
