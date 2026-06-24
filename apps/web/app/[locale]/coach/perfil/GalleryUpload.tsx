"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

interface GalleryItem {
  id: string;
  file_path: string;
  display_order: number;
  signed_url: string | null;
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export function GalleryUpload() {
  const t = useTranslations("coach.perfil.gallery");

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Press feedback: sólo transform, tokens via CSS vars.
  const pressStyle = { transition: "transform var(--duration-press) var(--ease-out)" };
  const onPressDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = "scale(var(--press-scale))";
  };
  const onPressUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = "scale(1)";
  };

  async function fetchGallery() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/coach/gallery");
      if (!res.ok) {
        setError(t("errorNetwork"));
        setLoading(false);
        return;
      }
      const data = (await res.json()) as { items: GalleryItem[] };
      setItems(data.items ?? []);
    } catch {
      setError(t("errorNetwork"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchGallery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function showSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!e.target) return;
    // Reset input
    e.target.value = "";

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError(t("errorType"));
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError(t("errorSize"));
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/coach/gallery", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        setError(t("errorUpload"));
        setUploading(false);
        return;
      }

      showSuccess(t("successUploaded"));
      await fetchGallery();
    } catch {
      setError(t("errorNetwork"));
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch("/api/coach/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        setError(t("errorDelete"));
        setDeletingId(null);
        return;
      }

      showSuccess(t("successDeleted"));
      await fetchGallery();
    } catch {
      setError(t("errorNetwork"));
    } finally {
      setDeletingId(null);
    }
  }

  async function handleMove(id: string, direction: "up" | "down") {
    setMovingId(id);
    setError(null);
    try {
      const res = await fetch("/api/coach/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, direction }),
      });

      if (!res.ok) {
        setError(t("errorNetwork"));
        setMovingId(null);
        return;
      }

      await fetchGallery();
    } catch {
      setError(t("errorNetwork"));
    } finally {
      setMovingId(null);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-text uppercase tracking-wider">
            {t("title")}
          </h2>
          <p className="text-muted text-xs mt-1">{t("hint")}</p>
        </div>
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          onMouseDown={onPressDown}
          onMouseUp={onPressUp}
          onMouseLeave={onPressUp}
          style={pressStyle}
          className="px-3 py-2 bg-surface-2 border border-border rounded-lg text-lime hover:border-[#C8FF00] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? t("btnUploading") : t("btnUpload")}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => void handleUpload(e)}
        />
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

      {loading ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-muted text-sm opacity-60">Cargando...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-muted text-sm opacity-60">{t("empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {items.map((item, index) => {
            const itemBusy = deletingId === item.id || movingId === item.id;
            return (
            <div
              key={item.id}
              className="relative rounded-lg overflow-hidden border border-border bg-surface-2 aspect-square group"
              style={{
                opacity: itemBusy ? 0.6 : 1,
                transform: itemBusy ? "scale(var(--press-scale))" : "scale(1)",
                transition:
                  "opacity var(--duration-dropdown) var(--ease-out), transform var(--duration-dropdown) var(--ease-out)",
              }}
            >
              {item.signed_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.signed_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted text-xs">
                  Sin URL
                </div>
              )}

              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <button
                  type="button"
                  disabled={index === 0 || movingId === item.id}
                  onClick={() => void handleMove(item.id, "up")}
                  onMouseDown={onPressDown}
                  onMouseUp={onPressUp}
                  onMouseLeave={onPressUp}
                  style={pressStyle}
                  className="w-full text-xs bg-surface/80 text-text px-2 py-1 rounded hover:bg-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t("btnMoveUp")}
                </button>
                <button
                  type="button"
                  disabled={index === items.length - 1 || movingId === item.id}
                  onClick={() => void handleMove(item.id, "down")}
                  onMouseDown={onPressDown}
                  onMouseUp={onPressUp}
                  onMouseLeave={onPressUp}
                  style={pressStyle}
                  className="w-full text-xs bg-surface/80 text-text px-2 py-1 rounded hover:bg-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t("btnMoveDown")}
                </button>
                <button
                  type="button"
                  disabled={deletingId === item.id}
                  onClick={() => void handleDelete(item.id)}
                  onMouseDown={onPressDown}
                  onMouseUp={onPressUp}
                  onMouseLeave={onPressUp}
                  style={pressStyle}
                  className="w-full text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded hover:bg-red-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {deletingId === item.id ? "..." : t("btnDelete")}
                </button>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
