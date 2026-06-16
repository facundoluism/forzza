"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

interface TicketResolveButtonProps {
  ticketId: string;
  currentStatus: TicketStatus;
}

export function TicketResolveButton({
  ticketId,
  currentStatus,
}: TicketResolveButtonProps) {
  const router = useRouter();
  const t = useTranslations("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(newStatus: TicketStatus) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? t("tickets.errorUpdate"));
      } else {
        router.refresh();
      }
    } catch {
      setError(t("tickets.errorNetwork"));
    } finally {
      setLoading(false);
    }
  }

  if (currentStatus === "resolved") {
    return (
      <span className="text-[#444444] text-xs">
        {t("tickets.terminalResolved")}
      </span>
    );
  }

  if (currentStatus === "closed") {
    return (
      <span className="text-[#444444] text-xs">
        {t("tickets.terminalClosed")}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex gap-2">
        {currentStatus === "open" && (
          <button
            onClick={() => updateStatus("in_progress")}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-[#1A1A1A] text-blue-400 text-xs font-semibold border border-blue-500/20 hover:bg-blue-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "…" : t("tickets.btnInProgress")}
          </button>
        )}

        <button
          onClick={() => updateStatus("resolved")}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-[#C8FF00] text-[#0A0A0A] text-xs font-semibold hover:bg-[#AADD00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "…" : t("tickets.btnResolve")}
        </button>
      </div>
    </div>
  );
}
