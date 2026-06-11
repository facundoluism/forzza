// TODO: Add rate limiting for /api/leads and /api/mp-preapproval
// Recommended: Upstash Redis with @upstash/ratelimit in production
//   npm i @upstash/ratelimit @upstash/redis
//   See: https://github.com/upstash/ratelimit-js
// V1: Supabase RLS and Mercado Pago's own rate limiting provide some protection
//     until Upstash is wired in.

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Dev mode: skip auth when Supabase not configured
  const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "";
  const supabaseKey = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ?? "";
  const isDevMode = !supabaseUrl || supabaseUrl.includes("placeholder");
  if (isDevMode) return NextResponse.next({ request });

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Proteger rutas /coach/* y /admin/*
  if (pathname.startsWith("/coach") || pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Verificar rol
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (pathname.startsWith("/admin") && userData?.role !== "owner") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (pathname.startsWith("/coach") && userData?.role !== "coach") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
