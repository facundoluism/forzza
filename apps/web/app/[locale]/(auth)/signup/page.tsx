"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { signupSchema } from "@forzza/core";
import { LEGAL_DOCS_VERSION } from "@forzza/config";

const SUPABASE_URL = process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "";
const IS_DEV_MODE = !SUPABASE_URL || SUPABASE_URL.includes("placeholder");

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

type PageState = "idle" | "loading" | "success";

export default function SignupPage() {
  const t = useTranslations("auth.signup");
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<PageState>("idle");
  const loading = state === "loading";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validate terms checkbox first — blocking
    if (!termsAccepted) {
      setError(t("termsError"));
      return;
    }

    const result = signupSchema.safeParse({ email, password, confirmPassword });
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? t("errorInvalid"));
      return;
    }

    setState("loading");

    // Dev bypass
    if (IS_DEV_MODE) {
      await new Promise((r) => setTimeout(r, 400));
      setState("success");
      return;
    }

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      // 1. Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      });

      if (signUpError) {
        if (
          signUpError.message.toLowerCase().includes("already registered") ||
          signUpError.message.toLowerCase().includes("email")
        ) {
          setError(t("errorEmailInUse"));
        } else {
          setError(t("errorGeneric"));
        }
        setState("idle");
        return;
      }

      const userId = authData.user?.id;

      // 2. Accept terms server-side — non-blocking on error
      if (userId) {
        try {
          await supabase.rpc("accept_terms", {
            p_version: LEGAL_DOCS_VERSION,
          });
        } catch (rpcErr) {
          // Log but don't block the user — terms can be re-accepted later
          console.error("[signup] accept_terms RPC failed:", rpcErr);
        }
      }

      setState("success");
    } catch (err) {
      console.error("[signup] unexpected error:", err);
      setError(t("errorGeneric"));
      setState("idle");
    }
  }

  if (state === "success") {
    return (
      <div style={{ textAlign: "center", padding: "32px 0" }}>
        <p style={{ fontSize: "48px", marginBottom: "16px" }}>&#10003;</p>
        <h2
          style={{
            color: "var(--color-lime)",
            fontSize: "24px",
            fontWeight: 800,
            fontFamily: "var(--font-display)",
            marginBottom: "12px",
          }}
        >
          {t("successTitle")}
        </h2>
        <p style={{ color: "var(--color-muted)", marginBottom: "32px", lineHeight: 1.6 }}>
          {t("successBody")}
        </p>
        <Link
          href="/ingresar"
          style={{
            display: "inline-block",
            padding: "12px 28px",
            backgroundColor: "var(--color-lime)",
            color: "#0A0A0A",
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "15px",
            textDecoration: "none",
          }}
        >
          {t("loginLinkCta")}
        </Link>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "400px", padding: "40px 24px" }}>
      <h1
        style={{
          color: "var(--color-lime)",
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "8px",
          fontFamily: "var(--font-display)",
          letterSpacing: "4px",
        }}
      >
        FORZZA
      </h1>
      <p style={{ color: "var(--color-muted)", marginBottom: "32px" }}>
        {t("title")}
      </p>

      <form onSubmit={(e) => { void handleSubmit(e); }}>
        {/* Display name */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              color: "var(--color-text)",
              marginBottom: "8px",
              fontSize: "14px",
            }}
          >
            {t("nameLabel")}
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={t("namePlaceholder")}
            required
            disabled={loading}
            style={inputStyle}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              color: "var(--color-text)",
              marginBottom: "8px",
              fontSize: "14px",
            }}
          >
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

        {/* Password */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              color: "var(--color-text)",
              marginBottom: "8px",
              fontSize: "14px",
            }}
          >
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

        {/* Confirm password */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              color: "var(--color-text)",
              marginBottom: "8px",
              fontSize: "14px",
            }}
          >
            {t("confirmPasswordLabel")}
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t("confirmPasswordPlaceholder")}
            required
            disabled={loading}
            style={inputStyle}
          />
        </div>

        {/* Terms checkbox — BLOCKING */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              cursor: loading ? "not-allowed" : "pointer",
              lineHeight: 1.5,
            }}
          >
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => {
                setTermsAccepted(e.target.checked);
                if (e.target.checked && error === t("termsError")) {
                  setError(null);
                }
              }}
              disabled={loading}
              style={{
                marginTop: "3px",
                accentColor: "var(--color-lime)",
                width: "16px",
                height: "16px",
                flexShrink: 0,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              aria-required="true"
            />
            <span style={{ color: "var(--color-muted)", fontSize: "14px" }}>
              {t("termsLabel")}{" "}
              <Link
                href="/legales/terminos"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--color-lime)", textDecoration: "underline" }}
                onClick={(e) => e.stopPropagation()}
              >
                {t("termsLinkTerms")}
              </Link>{" "}
              {t("termsLinkAnd")}{" "}
              <Link
                href="/legales/privacidad"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--color-lime)", textDecoration: "underline" }}
                onClick={(e) => e.stopPropagation()}
              >
                {t("termsLinkPrivacy")}
              </Link>
            </span>
          </label>
        </div>

        {/* Error message */}
        {error && (
          <p
            role="alert"
            style={{ color: "#FF4466", marginBottom: "16px", fontSize: "14px" }}
          >
            {error}
          </p>
        )}

        {/* Submit — disabled until terms accepted */}
        <button
          type="submit"
          disabled={loading || !termsAccepted}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: loading || !termsAccepted ? "#242436" : "var(--color-lime)",
            color: loading || !termsAccepted ? "var(--color-muted)" : "#080810",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: loading || !termsAccepted ? "not-allowed" : "pointer",
            transition: "background-color 200ms, color 200ms",
          }}
        >
          {loading ? t("submitLoading") : t("submit")}
        </button>

        {/* Login link */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <span style={{ color: "var(--color-muted)", fontSize: "14px" }}>
            {t("loginLink")}{" "}
          </span>
          <Link
            href="/login"
            style={{ color: "var(--color-lime)", fontSize: "14px" }}
          >
            {t("loginLinkCta")}
          </Link>
        </div>
      </form>
    </div>
  );
}
