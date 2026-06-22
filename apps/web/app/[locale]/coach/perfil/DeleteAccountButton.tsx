"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/navigation";

type Step = "idle" | "confirm1" | "confirm2" | "loading" | "error";

export function DeleteAccountButton() {
  const t = useTranslations("deleteAccount");
  const router = useRouter();
  const [step, setStep] = useState<Step>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleOpen = useCallback(() => {
    setErrorMsg(null);
    setStep("confirm1");
  }, []);

  const handleCancel = useCallback(() => {
    setStep("idle");
    setErrorMsg(null);
  }, []);

  const handleConfirm1 = useCallback(() => {
    setStep("confirm2");
  }, []);

  const handleConfirm2 = useCallback(async () => {
    setStep("loading");
    setErrorMsg(null);
    try {
      const supabase = createClient();
      // functions.invoke is not available in dev-mode mock — handle gracefully
      const invokeFn = (supabase as unknown as { functions?: { invoke: (name: string) => Promise<{ error: unknown }> } }).functions?.invoke;
      if (!invokeFn) {
        // Dev mode: simulate success
        await supabase.auth.signOut();
        router.replace("/");
        return;
      }
      const { error } = await invokeFn("delete-account");
      if (error) throw error;
      await supabase.auth.signOut();
      router.replace("/");
    } catch {
      setErrorMsg(t("errorGeneric"));
      setStep("error");
    }
  }, [t, router]);

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={handleOpen}
        style={{
          background: "transparent",
          border: "1px solid var(--color-error)",
          color: "var(--color-error)",
          borderRadius: "8px",
          padding: "10px 20px",
          fontSize: "14px",
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }}
      >
        {t("trigger")}
      </button>

      {/* Modal overlay */}
      {(step === "confirm1" || step === "confirm2" || step === "loading" || step === "error") && (
        <div
          role="dialog"
          aria-modal
          aria-labelledby="delete-account-dialog-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          {/* Backdrop */}
          <div
            onClick={step === "loading" ? undefined : handleCancel}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
              cursor: step === "loading" ? "default" : "pointer",
            }}
          />

          {/* Dialog panel */}
          <div
            style={{
              position: "relative",
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "16px",
              padding: "28px 24px",
              maxWidth: "440px",
              width: "100%",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            }}
          >
            {/* Step 1: first confirmation */}
            {step === "confirm1" && (
              <>
                <h2
                  id="delete-account-dialog-title"
                  style={{
                    color: "var(--color-text)",
                    fontSize: "18px",
                    fontWeight: 800,
                    marginBottom: "12px",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {t("confirm1Title")}
                </h2>
                <p style={{ color: "var(--color-muted)", fontSize: "14px", lineHeight: 1.6, marginBottom: "24px" }}>
                  {t("confirm1Body")}
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    style={secondaryBtnStyle}
                  >
                    {t("cancel")}
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm1}
                    style={dangerBtnStyle}
                  >
                    {t("confirm1Btn")}
                  </button>
                </div>
              </>
            )}

            {/* Step 2: second destructive confirmation */}
            {step === "confirm2" && (
              <>
                <h2
                  id="delete-account-dialog-title"
                  style={{
                    color: "var(--color-error)",
                    fontSize: "18px",
                    fontWeight: 800,
                    marginBottom: "12px",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {t("confirm2Title")}
                </h2>
                <p style={{ color: "var(--color-muted)", fontSize: "14px", lineHeight: 1.6, marginBottom: "8px" }}>
                  {t("confirm2Body")}
                </p>
                <p
                  style={{
                    color: "var(--color-text)",
                    fontSize: "13px",
                    fontWeight: 700,
                    backgroundColor: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    marginBottom: "24px",
                    lineHeight: 1.5,
                  }}
                >
                  {t("scheduledNotice")}
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    style={secondaryBtnStyle}
                  >
                    {t("cancel")}
                  </button>
                  <button
                    type="button"
                    onClick={() => { void handleConfirm2(); }}
                    style={dangerBtnStyle}
                  >
                    {t("confirm2Btn")}
                  </button>
                </div>
              </>
            )}

            {/* Loading state */}
            {step === "loading" && (
              <>
                <h2
                  id="delete-account-dialog-title"
                  style={{
                    color: "var(--color-text)",
                    fontSize: "18px",
                    fontWeight: 800,
                    marginBottom: "12px",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {t("loadingTitle")}
                </h2>
                <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>
                  {t("loadingBody")}
                </p>
              </>
            )}

            {/* Error state */}
            {step === "error" && (
              <>
                <h2
                  id="delete-account-dialog-title"
                  style={{
                    color: "var(--color-error)",
                    fontSize: "18px",
                    fontWeight: 800,
                    marginBottom: "12px",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {t("errorTitle")}
                </h2>
                <p style={{ color: "var(--color-muted)", fontSize: "14px", marginBottom: "20px" }}>
                  {errorMsg}
                </p>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    style={secondaryBtnStyle}
                  >
                    {t("close")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const secondaryBtnStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid var(--color-border)",
  color: "var(--color-muted)",
  borderRadius: "8px",
  padding: "10px 18px",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
};

const dangerBtnStyle: React.CSSProperties = {
  background: "var(--color-error)",
  border: "none",
  color: "#fff",
  borderRadius: "8px",
  padding: "10px 18px",
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
};
