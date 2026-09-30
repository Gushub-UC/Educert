import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { getSessionFromRequest, hasAnyRole } from "@/app/lib/auth";
import { applyHelmetSecurity } from "@/app/lib/security";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = getSessionFromRequest(request);

  if (pathname.startsWith("/api/certificates")) {
    const isProtectedIssue = pathname.includes("/issue");

    if (isProtectedIssue && !hasAnyRole(session, [Role.ADMIN, Role.EMISOR])) {
      return applyHelmetSecurity(
        NextResponse.json({ error: "No autorizado" }, { status: 403 }),
        request,
      );
    }
  }

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    if (!session || !hasAnyRole(session, [Role.ADMIN, Role.EMISOR])) {
      const loginUrl = new URL("/login", request.url);
      return applyHelmetSecurity(NextResponse.redirect(loginUrl), request);
    }
  }

  return applyHelmetSecurity(NextResponse.next(), request);
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/api/certificates/:path*"],
};
