// OAuth / PKCE callback handler.
// Supabase redirects here after social sign-in (Google, Apple) with a `code`
// query parameter. We exchange it for a session and redirect the user to the
// appropriate backoffice based on their role.
//
// URL registered in Supabase Auth → Site URL / Redirect URLs:
//   <origin>/auth/callback
//
// This route lives outside [locale] so next-intl does not intercept it.
// The middleware explicitly bypasses /auth/* (no locale prefix needed).

import { NextRequest, NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // If Supabase is not configured (dev mode) redirect to login so the app
  // does not crash silently.
  if (!isSupabaseConfigured() || !code) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // Something went wrong — send back to login with an error hint.
      const loginUrl = new URL("/login", origin);
      loginUrl.searchParams.set("error", "oauth_callback_failed");
      return NextResponse.redirect(loginUrl);
    }

    // Determine where to redirect based on the user's role.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/login", origin));
    }

    const { data: userRow } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const destination =
      userRow?.role === "owner" ? "/admin/dashboard" : "/coach";

    return NextResponse.redirect(new URL(destination, origin));
  } catch {
    // Unexpected error — fail safely back to login.
    return NextResponse.redirect(new URL("/login", origin));
  }
}
