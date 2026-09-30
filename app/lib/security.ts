import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function applyHelmetSecurity(response: NextResponse, _request: NextRequest) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()" );
  response.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self' data:;");
  return response;
}
