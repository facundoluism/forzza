"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface LiveSessionStatusButtonProps {
  sessionId: string;
  newStatus: "completed" | "canceled";
}

export function LiveSessionStatusButton({
  sessionId,
  newStatus,
}: LiveSessionStatusButtonProps) {
  const router = useRouter();
  const t = useTranslations("coach");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/coach/live-sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sessionId, status: newStatus }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? t("alumnos.detail.liveSessions.errorSave"));
      } else {
        router.refresh();
      }
    } catch {
      setError(t("alumnos.detail.liveSessions.errorNetwork"));
    } finally {
      setLoading(false);
    }
  }

  const label =
    newStatus === "completed"
      ? t("alumnos.detail.liveSessions.markCompleted")
      : t("alumnos.detail.liveSessions.markCanceled");

  const colorClass =
    newStatus === "completed"
      ? "text-green-400 hover:text-green-300"
      : "text-red-400 hover:text-red-300";

  return (
    <span className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={loading}
        onClick={() => void handleClick()}
        className={`text-xs font-medium transition-colors disabled:opacity-50 ${colorClass}`}
      >
        {loading ? "…" : label}
      </button>
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </span>
  );
}
