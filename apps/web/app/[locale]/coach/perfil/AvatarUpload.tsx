"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface Props {
  currentAvatarUrl: string | null;
}

export function AvatarUpload({ currentAvatarUrl }: Props) {
  const t = useTranslations("coach");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function clearFeedback() {
    setError(null);
    setSuccess(null);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    clearFeedback();

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError(t("perfil.avatar.errorType"));
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(t("perfil.avatar.errorSize"));
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/coach/avatar", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json()) as { ok?: boolean; avatar_url?: string; error?: string };

      if (!res.ok || !data.ok) {
        setError(data.error ?? t("perfil.avatar.errorUpload"));
      } else {
        setAvatarUrl(data.avatar_url ?? null);
        setSuccess(t("perfil.avatar.successUploaded"));
        setTimeout(() => setSuccess(null), 3000);
        router.refresh();
      }
    } catch {
      setError(t("perfil.avatar.errorNetwork"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    clearFeedback();
    setDeleting(true);
    setConfirmDelete(false);

    try {
      const res = await fetch("/api/coach/avatar", { method: "DELETE" });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setError(data.error ?? t("perfil.avatar.errorDelete"));
      } else {
        setAvatarUrl(null);
        setSuccess(t("perfil.avatar.successDeleted"));
        setTimeout(() => setSuccess(null), 3000);
        router.refresh();
      }
    } catch {
      setError(t("perfil.avatar.errorNetwork"));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-6">
      <h2 className="text-sm font-semibold text-text uppercase tracking-wider mb-5">
        {t("perfil.avatar.title")}
      </h2>

      <div className="flex items-center gap-5">
        {/* Avatar preview */}
        <div className="relative flex-shrink-0">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={t("perfil.avatar.imgAlt")}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-surface-2 border-2 border-dashed border-border flex items-center justify-center">
              <span className="text-2xl text-muted select-none">?</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {/* Upload button */}
          <button
            type="button"
            onClick={() => { clearFeedback(); inputRef.current?.click(); }}
            disabled={uploading || deleting}
            className="px-4 py-2 bg-[#C8FF00] text-[#0A0A0A] rounded-lg text-sm font-semibold hover:bg-[#AADD00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading
              ? t("perfil.avatar.btnUploading")
              : avatarUrl
                ? t("perfil.avatar.btnChange")
                : t("perfil.avatar.btnUpload")}
          </button>

          {/* Delete button — only shown when avatar exists */}
          {avatarUrl && (
            <button
              type="button"
              onClick={() => void handleDelete()}
              disabled={uploading || deleting}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                confirmDelete
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "border border-border text-muted hover:text-red-400 hover:border-red-400"
              }`}
            >
              {deleting
                ? t("perfil.avatar.btnDeleting")
                : confirmDelete
                  ? t("perfil.avatar.btnConfirmDelete")
                  : t("perfil.avatar.btnDelete")}
            </button>
          )}

          {confirmDelete && !deleting && (
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="text-xs text-muted hover:text-text transition-colors"
            >
              {t("perfil.avatar.btnCancelDelete")}
            </button>
          )}

          <p className="text-muted text-xs">{t("perfil.avatar.hint")}</p>
        </div>
      </div>

      {/* Feedback */}
      {error && (
        <p className="mt-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-4 text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3">
          {success}
        </p>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => void handleFileChange(e)}
        className="hidden"
      />
    </section>
  );
}
