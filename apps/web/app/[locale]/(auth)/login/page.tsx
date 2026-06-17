"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { loginSchema } from "@forzza/core";
import { FEATURE_FLAGS } from "@forzza/config";

const SUPABASE_URL = process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "";
const IS_DEV_MODE = !SUPABASE_URL || SUPABASE_URL.includes("placeholder");

const SHOW_GOOGLE = FEATURE_FLAGS.GOOGLE_SIGN_IN;
const SHOW_APPLE = FEATURE_FLAGS.APPLE_SIGN_IN;
const SHOW_SSO = SHOW_GOOGLE || SHOW_APPLE;

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<"google" | "apple" | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? t("errorInvalid"));
      return;
    }

    setLoading(true);

    // Dev bypass: skip Supabase, redirect based on email
    if (IS_DEV_MODE) {
      await new Promise((r) => setTimeout(r, 300)); // simulate network
      if (email.includes("admin")) {
        router.push("/admin/dashboard");
      } else {
        router.push("/coach/alumnos");
      }
      return;
    }

    // Production: real Supabase auth
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? t("errorCredentials")
          : t("errorGeneric")
      );
      setLoading(false);
      return;
    }

    if (!authData.user) {
      setError(t("errorNoUser"));
      setLoading(false);
      return;
    }

    const { data: userRow } = await supabase
      .from("users")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    window.location.href =
      userRow?.role === "owner" ? "/admin/dashboard" : "/coach";
  }

  async function handleOAuth(provider: "google" | "apple") {
    setError(null);
    setSsoLoading(provider);

    if (IS_DEV_MODE) {
      // Dev mode: no real OAuth available — show a friendly message.
      setError(t("ssoError"));
      setSsoLoading(null);
      return;
    }

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });

    if (oauthError) {
      setError(t("ssoError"));
      setSsoLoading(null);
    }
    // On success, Supabase redirects the browser — no further action needed here.
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    backgroundColor: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "8px",
    color: "var(--color-text)",
    fontSize: "16px",
    boxSizing: "border-box",
    outline: "none",
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px 24px' }}>
        <h1 style={{ color: "#C8FF00", fontSize: "32px", fontWeight: "bold", marginBottom: "8px", fontFamily: "var(--font-display)", letterSpacing: "4px" }}>
          FORZZA
        </h1>
        <p style={{ color: "var(--color-muted)", marginBottom: "32px" }}>
          {t("title")}
        </p>

        {IS_DEV_MODE && (
          <div style={{ background: 'rgba(200,255,0,0.08)', border: '1px solid rgba(200,255,0,0.2)', borderRadius: '8px', padding: '12px', marginBottom: '24px', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: '#C8FF00', fontWeight: 700 }}>{t("devBannerTitle")}</span>
            <span style={{ color: '#9898C0' }}> — </span>
            <br />
            <span style={{ color: '#6868A0', fontSize: '12px' }}>
              {t("devBannerBody")}
            </span>
          </div>
        )}

        <form onSubmit={(e) => { void handleSubmit(e); }}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "var(--color-text)", marginBottom: "8px", fontSize: '14px' }}>
              {t("emailLabel")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              required
              disabled={loading}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "var(--color-text)", marginBottom: "8px", fontSize: '14px' }}>
              {t("passwordLabel")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
              required
              disabled={loading}
              style={inputStyle}
            />
          </div>

          {error && (
            <p style={{ color: "#FF4466", marginBottom: "16px", fontSize: "14px" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: loading ? "#242436" : "#C8FF00",
              color: "#080810",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              transition: 'background-color 200ms',
            }}
          >
            {loading ? t("submitLoading") : t("submit")}
          </button>

          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <Link
              href="/forgot-password"
              style={{ color: "var(--color-muted)", fontSize: "14px" }}
            >
              {t("forgotPassword")}
            </Link>
          </div>

          {SHOW_SSO && (
            <>
              {/* Divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "24px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "var(--color-border)",
                  }}
                />
                <span
                  style={{
                    color: "var(--color-muted)",
                    fontSize: "13px",
                    fontFamily: "var(--font-mono)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("ssoOr")}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "var(--color-border)",
                  }}
                />
              </div>

              {/* SSO buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {SHOW_GOOGLE && (
                  <button
                    type="button"
                    disabled={loading || ssoLoading !== null}
                    onClick={() => { void handleOAuth("google"); }}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      fontSize: "15px",
                      fontWeight: 600,
                      cursor: loading || ssoLoading !== null ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      opacity: loading || (ssoLoading !== null && ssoLoading !== "google") ? 0.5 : 1,
                      transition: "opacity 200ms",
                    }}
                  >
                    {/* Google "G" icon — inline SVG, no external fetch */}
                    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
                    </svg>
                    {ssoLoading === "google" ? "..." : t("ssoGoogle")}
                  </button>
                )}

                {SHOW_APPLE && (
                  <button
                    type="button"
                    disabled={loading || ssoLoading !== null}
                    onClick={() => { void handleOAuth("apple"); }}
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      fontSize: "15px",
                      fontWeight: 600,
                      cursor: loading || ssoLoading !== null ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      opacity: loading || (ssoLoading !== null && ssoLoading !== "apple") ? 0.5 : 1,
                      transition: "opacity 200ms",
                    }}
                  >
                    {/* Apple icon — inline SVG */}
                    <svg width="16" height="18" viewBox="0 0 814 1000" aria-hidden="true" fill="currentColor">
                      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 405.8 0 303.3 0 207.7 0 94.6 62.1 34.2 125.4 20.3c30.6-7.1 60.8-11.3 90.6-11.3 68 0 134.5 34.2 180.1 34.2 44.8 0 126.6-39.5 207.6-39.5 33.4 0 124.1 3.2 183.5 75.1z"/>
                    </svg>
                    {ssoLoading === "apple" ? "..." : t("ssoApple")}
                  </button>
                )}
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
