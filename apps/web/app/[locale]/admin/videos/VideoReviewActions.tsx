"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface Props {
  videoId: string;
  currentStatus: string;
}

export function VideoReviewActions({ videoId, currentStatus }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations("admin");

  async function handleAction(action: "publish" | "unpublish") {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/exercise-videos/${videoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error(await res.text());
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("videos.errorGeneric"));
    } finally {
      setLoading(false);
    }
  }

  async function handleDiscard() {
    if (!confirm(t("videos.confirmDiscard"))) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/exercise-videos/${videoId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("videos.errorGeneric"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {currentStatus === "needs_review" && (
          <button
            onClick={() => handleAction("publish")}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium bg-[#C8FF00] text-black rounded hover:bg-[#b8ef00] disabled:opacity-50 transition-colors"
          >
            {loading ? t("videos.publishing") : t("videos.publish")}
          </button>
        )}
        {currentStatus === "published" && (
          <button
            onClick={() => handleAction("unpublish")}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded hover:bg-yellow-500/30 disabled:opacity-50 transition-colors"
          >
            {loading ? t("videos.unpublishing") : t("videos.unpublish")}
          </button>
        )}
        <button
          onClick={handleDiscard}
          disabled={loading}
          className="px-3 py-1.5 text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 disabled:opacity-50 transition-colors"
        >
          {t("videos.discard")}
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
