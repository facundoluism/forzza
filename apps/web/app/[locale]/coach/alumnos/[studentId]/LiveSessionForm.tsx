"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface LiveSessionFormProps {
  studentId: string;
  assignmentId: string;
}

export function LiveSessionForm({ studentId, assignmentId }: LiveSessionFormProps) {
  const router = useRouter();
  const t = useTranslations("coach");

  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [roomUrl, setRoomUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedUrl = roomUrl.trim();

    if (!trimmedTitle || !scheduledAt || !trimmedUrl) {
      setError(t("alumnos.detail.liveSessions.errorRequired"));
      return;
    }

    // Basic URL validation on client before sending
    try {
      new URL(trimmedUrl);
    } catch {
      setError(t("alumnos.detail.liveSessions.errorInvalidUrl"));
      return;
    }

    setError(null);
    setSaving(true);

    try {
      const res = await fetch("/api/coach/live-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          assignment_id: assignmentId,
          title: trimmedTitle,
          scheduled_at: new Date(scheduledAt).toISOString(),
          room_url: trimmedUrl,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? t("alumnos.detail.liveSessions.errorSave"));
      } else {
        setTitle("");
        setScheduledAt("");
        setRoomUrl("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        router.refresh();
      }
    } catch {
      setError(t("alumnos.detail.liveSessions.errorNetwork"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
      <div>
        <label className="block text-muted text-xs mb-1">
          {t("alumnos.detail.liveSessions.fieldTitle")}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("alumnos.detail.liveSessions.titlePlaceholder")}
          maxLength={200}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-muted focus:border-lime focus:outline-none"
          aria-label={t("alumnos.detail.liveSessions.fieldTitle")}
        />
      </div>
      <div>
        <label className="block text-muted text-xs mb-1">
          {t("alumnos.detail.liveSessions.fieldDate")}
        </label>
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-lime focus:outline-none"
          aria-label={t("alumnos.detail.liveSessions.fieldDate")}
        />
      </div>
      <div>
        <label className="block text-muted text-xs mb-1">
          {t("alumnos.detail.liveSessions.fieldRoomUrl")}
        </label>
        <input
          type="url"
          value={roomUrl}
          onChange={(e) => setRoomUrl(e.target.value)}
          placeholder={t("alumnos.detail.liveSessions.roomUrlPlaceholder")}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-muted focus:border-lime focus:outline-none"
          aria-label={t("alumnos.detail.liveSessions.fieldRoomUrl")}
        />
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {success && (
        <p className="text-green-400 text-xs">{t("alumnos.detail.liveSessions.saved")}</p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-lime px-5 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {saving
          ? t("alumnos.detail.liveSessions.saving")
          : t("alumnos.detail.liveSessions.schedule")}
      </button>
    </form>
  );
}
