"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface Props {
  videoId: string;
  currentStatus: string;
  youtubeId: string;
  channelTitle: string;
}

type DiscardReason = "bad_channel" | "wrong_variant" | "is_short" | "wrong_lang";

function parseYouTubeId(url: string): string | null {
  if (!url.trim()) return null;
  // Already a bare ID (11 chars, no slash)
  if (/^[A-Za-z0-9_-]{11}$/.test(url.trim())) return url.trim();
  try {
    const u = new URL(url.trim());
    const v = u.searchParams.get("v");
    if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
    // youtu.be/ID
    if (u.hostname === "youtu.be") {
      const seg = u.pathname.replace(/^\//, "");
      if (/^[A-Za-z0-9_-]{11}$/.test(seg)) return seg;
    }
  } catch {
    // not a URL
  }
  return null;
}

export function VideoReviewActions({
  videoId,
  currentStatus,
  youtubeId,
  channelTitle,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const t = useTranslations("admin");

  // Discard modal state
  const [reasons, setReasons] = useState<Set<DiscardReason>>(new Set());
  const [queryAdd, setQueryAdd] = useState("");
  const [queryRemove, setQueryRemove] = useState("");
  const [pinUrl, setPinUrl] = useState("");
  const [note, setNote] = useState("");

  function toggleReason(r: DiscardReason) {
    setReasons((prev) => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r);
      else next.add(r);
      return next;
    });
  }

  function resetModal() {
    setReasons(new Set());
    setQueryAdd("");
    setQueryRemove("");
    setPinUrl("");
    setNote("");
    setError(null);
  }

  function openModal() {
    resetModal();
    setShowModal(true);
  }

  function closeModal() {
    if (loading) return;
    setShowModal(false);
    resetModal();
  }

  // Validation
  function validate(): string | null {
    if (reasons.has("wrong_variant")) {
      const addTerms = queryAdd
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const removeTerms = queryRemove
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (addTerms.length === 0 && removeTerms.length === 0) {
        return t("videos.discardModal.errorVariantTermsRequired");
      }
    }
    if (pinUrl.trim()) {
      const pid = parseYouTubeId(pinUrl);
      if (!pid) return t("videos.discardModal.errorPinInvalid");
    }
    return null;
  }

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

  async function handleConfirmDiscard() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    const addTerms = queryAdd
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const removeTerms = queryRemove
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const pinVideoId = pinUrl.trim() ? parseYouTubeId(pinUrl) : null;

    const body = {
      reasons: Array.from(reasons),
      queryAdd: addTerms,
      queryRemove: removeTerms,
      pinYoutubeId: pinVideoId ?? undefined,
      note: note.trim() || undefined,
    };

    try {
      const res = await fetch(`/api/admin/exercise-videos/${videoId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? t("videos.errorGeneric"));
      }
      setShowModal(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("videos.errorGeneric"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
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
            onClick={openModal}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 disabled:opacity-50 transition-colors"
          >
            {t("videos.discard")}
          </button>
        </div>
        {error && !showModal && (
          <p className="text-xs text-red-400">{error}</p>
        )}
      </div>

      {/* Discard + feedback modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-[#FAFAFA] font-semibold text-base">
                {t("videos.discardModal.title")}
              </h3>
              <p className="text-[#666666] text-sm mt-1">
                {t("videos.discardModal.subtitle")}
              </p>
            </div>

            {/* Reason chips */}
            <div className="flex flex-col gap-2">
              <p className="text-[#888888] text-xs font-medium uppercase tracking-wider">
                {t("videos.discardModal.reasonsLabel")}
              </p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    "bad_channel",
                    "wrong_variant",
                    "is_short",
                    "wrong_lang",
                  ] as DiscardReason[]
                ).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => toggleReason(r)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      reasons.has(r)
                        ? "bg-[#C8FF00]/10 border-[#C8FF00]/60 text-[#C8FF00]"
                        : "bg-[#1A1A1A] border-[#2A2A2A] text-[#888888] hover:border-[#444444] hover:text-[#FAFAFA]"
                    }`}
                  >
                    {t(`videos.discardModal.reason_${r}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Conditional: wrong_variant → query terms */}
            {reasons.has("wrong_variant") && (
              <div className="flex flex-col gap-3 pl-2 border-l-2 border-[#C8FF00]/30">
                <div>
                  <label className="block text-[#888888] text-xs mb-1">
                    {t("videos.discardModal.queryAddLabel")}
                  </label>
                  <input
                    type="text"
                    value={queryAdd}
                    onChange={(e) => setQueryAdd(e.target.value)}
                    placeholder={t("videos.discardModal.queryAddPlaceholder")}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-[#FAFAFA] text-sm placeholder-[#444444] focus:outline-none focus:border-[#C8FF00]"
                  />
                </div>
                <div>
                  <label className="block text-[#888888] text-xs mb-1">
                    {t("videos.discardModal.queryRemoveLabel")}
                  </label>
                  <input
                    type="text"
                    value={queryRemove}
                    onChange={(e) => setQueryRemove(e.target.value)}
                    placeholder={t(
                      "videos.discardModal.queryRemovePlaceholder"
                    )}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-[#FAFAFA] text-sm placeholder-[#444444] focus:outline-none focus:border-[#C8FF00]"
                  />
                </div>
              </div>
            )}

            {/* Pin URL */}
            <div>
              <label className="block text-[#888888] text-xs mb-1">
                {t("videos.discardModal.pinLabel")}
              </label>
              <input
                type="text"
                value={pinUrl}
                onChange={(e) => setPinUrl(e.target.value)}
                placeholder={t("videos.discardModal.pinPlaceholder")}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-[#FAFAFA] text-sm placeholder-[#444444] focus:outline-none focus:border-[#C8FF00]"
              />
              <p className="text-[#555555] text-xs mt-1">
                {t("videos.discardModal.pinHint")}
              </p>
            </div>

            {/* Free note */}
            <div>
              <label className="block text-[#888888] text-xs mb-1">
                {t("videos.discardModal.noteLabel")}
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("videos.discardModal.notePlaceholder")}
                rows={2}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-[#FAFAFA] text-sm placeholder-[#444444] focus:outline-none focus:border-[#C8FF00] resize-none"
              />
            </div>

            {/* Info box */}
            <p className="text-[#555555] text-xs bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2">
              {t("videos.discardModal.alwaysBlocks", {
                youtubeId,
                channelTitle,
              })}
            </p>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModal}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-[#1A1A1A] text-[#888888] text-sm hover:text-[#FAFAFA] transition-colors disabled:opacity-50"
              >
                {t("videos.discardModal.btnCancel")}
              </button>
              <button
                onClick={handleConfirmDiscard}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-semibold border border-red-500/20 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? t("videos.discardModal.btnConfirmLoading")
                  : t("videos.discardModal.btnConfirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
