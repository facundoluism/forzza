"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface Props {
  currentVideoSignedUrl: string | null;
}

const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export function VideoUpload({ currentVideoSignedUrl }: Props) {
  const t = useTranslations("coach.perfil.video");
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function showSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      setError(t("errorType"));
      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      setError(t("errorSize"));
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/coach/video", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        setError(t("errorUpload"));
        setUploading(false);
        return;
      }

      showSuccess(t("successUploaded"));
      router.refresh();
    } catch {
      setError(t("errorNetwork"));
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/coach/video", {
        method: "DELETE",
      });

      if (!res.ok) {
        setError(t("errorDelete"));
        setDeleting(false);
        return;
      }

      setConfirmDelete(false);
      showSuccess(t("successDeleted"));
      router.refresh();
    } catch {
      setError(t("errorNetwork"));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-6 space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-text uppercase tracking-wider">
          {t("title")}
        </h2>
        <p className="text-muted text-xs mt-1">{t("hint")}</p>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {successMsg && (
        <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3">
          {successMsg}
        </p>
      )}

      {currentVideoSignedUrl && (
        <div className="rounded-lg overflow-hidden border border-border bg-surface-2">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            controls
            src={currentVideoSignedUrl}
            className="w-full max-h-64 object-contain bg-black"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 bg-surface-2 border border-border rounded-lg text-lime hover:border-[#C8FF00] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading
            ? t("btnUploading")
            : currentVideoSignedUrl
              ? t("btnChange")
              : t("btnUpload")}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm"
          className="hidden"
          onChange={(e) => void handleUpload(e)}
        />

        {currentVideoSignedUrl && !confirmDelete && (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="px-3 py-2 bg-surface-2 border border-red-500/30 rounded-lg text-red-400 hover:border-red-500 transition-colors text-sm"
          >
            {t("btnDelete")}
          </button>
        )}

        {confirmDelete && (
          <>
            <button
              type="button"
              disabled={deleting}
              onClick={() => void handleDelete()}
              className="px-3 py-2 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? t("btnDeleting") : t("btnConfirmDelete")}
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={() => setConfirmDelete(false)}
              className="px-3 py-2 bg-surface-2 border border-border rounded-lg text-muted hover:border-[#C8FF00] transition-colors text-sm disabled:opacity-50"
            >
              {t("btnCancelDelete")}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
