"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

interface ReportModalProps {
  coachId: string;
}

type Status = "idle" | "loading" | "success" | "error";

const REASONS = [
  "spam",
  "fake",
  "inappropriate",
  "harassment",
  "other",
] as const;

type Reason = (typeof REASONS)[number];

const REASON_KEYS: Record<Reason, string> = {
  spam: "reasonSpam",
  fake: "reasonFake",
  inappropriate: "reasonInappropriate",
  harassment: "reasonHarassment",
  other: "reasonOther",
};

export function ReportModal({ coachId }: ReportModalProps) {
  const t = useTranslations("marketplace.report");
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<Reason | "">("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  function openModal() {
    setOpen(true);
    setReason("");
    setDetails("");
    setStatus("idle");
    setErrorMsg(null);
    setValidationError(null);
  }

  function closeModal() {
    if (status === "loading") return;
    setOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError(null);

    if (!reason) {
      setValidationError(t("errorReasonRequired"));
      return;
    }

    setStatus("loading");
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.functions.invoke("submit-content-report", {
        body: {
          target_type: "coach_profile",
          target_id: coachId,
          reason,
          ...(details.trim() ? { details: details.trim() } : {}),
        },
      });

      if (error) {
        setErrorMsg(t("errorGeneric"));
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMsg(t("errorNetwork"));
      setStatus("error");
    }
  }

  const isLoading = status === "loading";

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={openModal}
        style={{
          background: "transparent",
          border: "1px solid #3A3A3A",
          borderRadius: 8,
          color: "#6868A0",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 600,
          padding: "8px 14px",
          transition: "color 0.15s, border-color 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "#EF4444";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.4)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "#6868A0";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#3A3A3A";
        }}
      >
        {t("btn")}
      </button>

      {/* Modal backdrop + dialog */}
      {open && (
        <div
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-modal-title"
            style={{
              background: "#111111",
              border: "1px solid #2A2A2A",
              borderRadius: 16,
              padding: "28px 28px 24px",
              width: "100%",
              maxWidth: 440,
            }}
          >
            <h2
              id="report-modal-title"
              style={{
                color: "#FAFAFA",
                fontSize: 18,
                fontWeight: 800,
                margin: "0 0 20px",
              }}
            >
              {t("modalTitle")}
            </h2>

            {status === "success" ? (
              /* Success state */
              <div style={{ textAlign: "center", padding: "8px 0 12px" }}>
                <p
                  style={{
                    color: "#C8FF00",
                    fontSize: 15,
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  {t("successTitle")}
                </p>
                <p style={{ color: "#6868A0", fontSize: 14, margin: "0 0 20px" }}>
                  {t("successBody")}
                </p>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    background: "#C8FF00",
                    border: "none",
                    borderRadius: 8,
                    color: "#000",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 700,
                    padding: "10px 24px",
                  }}
                >
                  {t("cancel")}
                </button>
              </div>
            ) : (
              /* Form state (idle / loading / error) */
              <form onSubmit={handleSubmit}>
                {/* Reason select */}
                <div style={{ marginBottom: 16 }}>
                  <label
                    htmlFor="report-reason"
                    style={{
                      display: "block",
                      color: "#A0A0C0",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: 6,
                    }}
                  >
                    {t("reasonLabel")}
                  </label>
                  <select
                    id="report-reason"
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value as Reason | "");
                      setValidationError(null);
                    }}
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      background: "#1A1A2E",
                      border: validationError
                        ? "1px solid #EF4444"
                        : "1px solid #2A2A3E",
                      borderRadius: 8,
                      color: reason ? "#FAFAFA" : "#6868A0",
                      fontSize: 14,
                      padding: "10px 12px",
                      outline: "none",
                    }}
                  >
                    <option value="" disabled>
                      {t("reasonPlaceholder")}
                    </option>
                    {REASONS.map((r) => (
                      <option key={r} value={r}>
                        {t(REASON_KEYS[r] as Parameters<typeof t>[0])}
                      </option>
                    ))}
                  </select>
                  {validationError && (
                    <p
                      style={{
                        color: "#EF4444",
                        fontSize: 12,
                        margin: "4px 0 0",
                      }}
                    >
                      {validationError}
                    </p>
                  )}
                </div>

                {/* Details textarea */}
                <div style={{ marginBottom: 20 }}>
                  <label
                    htmlFor="report-details"
                    style={{
                      display: "block",
                      color: "#A0A0C0",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: 6,
                    }}
                  >
                    {t("detailsLabel")}
                  </label>
                  <textarea
                    id="report-details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    disabled={isLoading}
                    placeholder={t("detailsPlaceholder")}
                    rows={3}
                    style={{
                      width: "100%",
                      background: "#1A1A2E",
                      border: "1px solid #2A2A3E",
                      borderRadius: 8,
                      color: "#FAFAFA",
                      fontSize: 14,
                      padding: "10px 12px",
                      resize: "vertical",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Error from API */}
                {status === "error" && errorMsg && (
                  <p
                    style={{
                      color: "#EF4444",
                      fontSize: 13,
                      margin: "0 0 14px",
                    }}
                  >
                    {errorMsg}
                  </p>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isLoading}
                    style={{
                      background: "transparent",
                      border: "1px solid #3A3A3A",
                      borderRadius: 8,
                      color: "#6868A0",
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: 600,
                      padding: "10px 18px",
                      opacity: isLoading ? 0.5 : 1,
                    }}
                  >
                    {t("cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    aria-busy={isLoading}
                    style={{
                      background: "#EF4444",
                      border: "none",
                      borderRadius: 8,
                      color: "#fff",
                      cursor: isLoading ? "default" : "pointer",
                      fontSize: 14,
                      fontWeight: 700,
                      opacity: isLoading ? 0.7 : 1,
                      padding: "10px 20px",
                    }}
                  >
                    {isLoading ? t("submitting") : t("submit")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
