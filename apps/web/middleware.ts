// TODO: Add rate limiting for /api/leads and /api/mp-preapproval
// Recommended: Upstash Redis with @upstash/ratelimit in production
//   npm i @upstash/ratelimit @upstash/redis
//   See: https://github.com/upstash/ratelimit-js
// V1: Supabase RLS and Mercado Pago's own rate limiting provide some protection
//     until Upstash is wired in.

import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// next-intl middleware handles locale detection, cookie persistence and
// redirects (e.g. /en/ ↔ / for the default locale).
const intlMiddleware = createIntlMiddleware(routing);

function loginPathFor(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return `/${locale}/login`;
    }
  }
  return "/login";
}

function isRouteSegment(pathname: string, segment: string): boolean {
  return pathname === segment || pathname.startsWith(`${segment}/`);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Static assets and API routes ────────────────────────────────────────────
  // next-intl must NOT touch /api/**, /sw.js, /manifest.json, /offline, or
  // Next.js internals. The matcher below already excludes _next/* and images,
  // but api, sw.js and manifest need an explicit guard here too.
  const isPublicFile =
    pathname.startsWith("/api/") ||
    pathname.startsWith("/auth/") ||
    pathname === "/sw.js" ||
    pathname === "/manifest.json" ||
    pathname === "/offline" ||
    pathname.startsWith("/offline");

  if (isPublicFile) {
    return NextResponse.next();
  }

  // ── Locale routing (next-intl) ───────────────────────────────────────────────
  // Run intl middleware first so the locale cookie/header is set before auth.
  const intlResponse = intlMiddleware(request);

  // ── Auth middleware (Supabase) ───────────────────────────────────────────────
  const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "";
  const supabaseKey = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ?? "";
  const isDevMode = !supabaseUrl || supabaseUrl.includes("placeholder");

  // In dev mode (no Supabase configured) skip auth checks entirely.
  if (isDevMode) return intlResponse;

  // Strip locale prefix to get the canonical pathname for route protection.
  // e.g. /en/admin/dashboard → /admin/dashboard
  let canonicalPath = pathname;
  for (const locale of routing.locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      canonicalPath = pathname.slice(locale.length + 1) || "/";
      break;
    }
  }

  // Only protect /coach/* and /admin/* routes.
  const needsAuth =
    isRouteSegment(canonicalPath, "/coach") ||
    isRouteSegment(canonicalPath, "/admin");

  if (!needsAuth) return intlResponse;

  // Build a Supabase client that propagates cookies from the incoming request
  // and writes updated cookies into the outgoing response.
  let authResponse = intlResponse ?? NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(
        cookiesToSet: { name: string; value: string; options: CookieOptions }[]
      ) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        authResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          authResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL(loginPathFor(pathname), request.url));
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    isRouteSegment(canonicalPath, "/admin") &&
    userData?.role !== "owner"
  ) {
    return NextResponse.redirect(new URL(loginPathFor(pathname), request.url));
  }

  if (
    isRouteSegment(canonicalPath, "/coach") &&
    userData?.role !== "coach"
  ) {
    return NextResponse.redirect(new URL(loginPathFor(pathname), request.url));
  }

  return authResponse;
}

export const config = {
  // Match all routes EXCEPT:
  //   - Next.js internals (_next/static, _next/image)
  //   - favicon and static image extensions
  //   - /api/** routes (handled by route handlers, not middleware)
  //   - /sw.js and /manifest.json (PWA files)
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/).*)",
  ],
};
