"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface ApproveRejectButtonsProps {
  coachId: string;
  currentStatus: string;
}

export function ApproveRejectButtons({
  coachId,
  currentStatus,
}: ApproveRejectButtonsProps) {
  const router = useRouter();
  const t = useTranslations("admin");
  const [loading, setLoading] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleApprove() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/coaches/${coachId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? t("coaches.errorApprove"));
      } else {
        router.refresh();
      }
    } catch {
      setError(t("coaches.errorNetwork"));
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    if (!rejectionReason.trim()) {
      setError(t("coaches.errorReasonRequired"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/coaches/${coachId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "rejected",
          rejection_reason: rejectionReason.trim(),
        }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? t("coaches.errorReject"));
      } else {
        setShowRejectDialog(false);
        setRejectionReason("");
        router.refresh();
      }
    } catch {
      setError(t("coaches.errorNetwork"));
    } finally {
      setLoading(false);
    }
  }

  if (currentStatus === "approved") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
        {t("coaches.statusApproved")}
      </span>
    );
  }

  if (currentStatus === "rejected") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
        {t("coaches.statusRejected")}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button
        onClick={handleApprove}
        disabled={loading}
        className="px-3 py-1.5 rounded-lg bg-[#C8FF00] text-[#0A0A0A] text-xs font-semibold hover:bg-[#AADD00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? t("coaches.loadingApproving") : t("coaches.btnApprove")}
      </button>

      <button
        onClick={() => setShowRejectDialog(true)}
        disabled={loading}
        className="px-3 py-1.5 rounded-lg bg-[#1A1A1A] text-red-400 text-xs font-semibold border border-red-500/20 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t("coaches.btnReject")}
      </button>

      {/* Rejection dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-[#FAFAFA] font-semibold mb-2">
              {t("coaches.dialogTitle")}
            </h3>
            <p className="text-[#666666] text-sm mb-4">
              {t("coaches.dialogBody")}
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder={t("coaches.dialogPlaceholder")}
              rows={3}
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-[#FAFAFA] text-sm placeholder-[#444444] focus:outline-none focus:border-[#C8FF00] resize-none mb-4"
            />
            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectionReason("");
                  setError(null);
                }}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-[#1A1A1A] text-[#888888] text-sm hover:text-[#FAFAFA] transition-colors"
              >
                {t("coaches.btnCancel")}
              </button>
              <button
                onClick={handleReject}
                disabled={loading || !rejectionReason.trim()}
                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-semibold border border-red-500/20 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("coaches.loadingRejecting") : t("coaches.btnConfirmReject")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
