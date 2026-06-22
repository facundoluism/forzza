"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "loading" | "success" | "error";

export function ExportDataButton() {
  const t = useTranslations("coach.perfil.exportData");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleExport() {
    if (status === "loading") return;
    setStatus("loading");
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.functions.invoke("export-user-data", {
        method: "GET",
      });

      if (error) {
        setErrorMsg(t("errorGeneric"));
        setStatus("error");
        return;
      }

      // Build a downloadable Blob from the JSON response
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const today = new Date().toISOString().slice(0, 10);
      const filename = `forzza-mis-datos-${today}.json`;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      setStatus("success");
    } catch {
      setErrorMsg(t("errorNetwork"));
      setStatus("error");
    }
  }

  const isLoading = status === "loading";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
        padding: "16px 0",
        borderTop: "1px solid #1E1E2E",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            color: "#F0F0FF",
            fontSize: 14,
            fontWeight: 600,
            margin: 0,
            marginBottom: 2,
          }}
        >
          {t("btn")}
        </p>
        <p
          style={{
            color: "#6868A0",
            fontSize: 12,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {t("description")}
        </p>
        {status === "success" && (
          <p
            style={{
              color: "#C8FF00",
              fontSize: 12,
              margin: "6px 0 0",
            }}
          >
            {t("successNotice")}
          </p>
        )}
        {status === "error" && errorMsg && (
          <p
            style={{
              color: "var(--color-error, #EF4444)",
              fontSize: 12,
              margin: "6px 0 0",
            }}
          >
            {errorMsg}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={handleExport}
        disabled={isLoading}
        aria-busy={isLoading}
        style={{
          flexShrink: 0,
          background: "transparent",
          border: "1px solid #3A3A5C",
          borderRadius: 8,
          color: "#C8FF00",
          cursor: isLoading ? "default" : "pointer",
          fontSize: 13,
          fontWeight: 600,
          opacity: isLoading ? 0.6 : 1,
          padding: "8px 14px",
          transition: "opacity 0.15s",
          whiteSpace: "nowrap",
        }}
      >
        {isLoading ? t("btnLoading") : t("btn")}
      </button>
    </div>
  );
}
