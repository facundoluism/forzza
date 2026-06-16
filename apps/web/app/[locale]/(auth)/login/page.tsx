"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { loginSchema } from "@forzza/core";

const SUPABASE_URL = process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "";
const IS_DEV_MODE = !SUPABASE_URL || SUPABASE_URL.includes("placeholder");

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        </form>
      </div>
    </div>
  );
}
