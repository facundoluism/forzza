"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface FeedbackFormProps {
  studentId: string;
  targetType: "metric" | "photo";
  targetId: string;
  /** Label shown above the textarea (e.g. metric date or photo date) */
  targetLabel: string;
}

export function FeedbackForm({
  studentId,
  targetType,
  targetId,
  targetLabel,
}: FeedbackFormProps) {
  const router = useRouter();
  const t = useTranslations("coach");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    setError(null);
    setSaving(true);

    try {
      const res = await fetch("/api/coach/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          target_type: targetType,
          target_id: targetId,
          feedback_text: trimmed,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? t("alumnos.detail.feedback.errorSave"));
      } else {
        setText("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        router.refresh();
      }
    } catch {
      setError(t("alumnos.detail.feedback.errorNetwork"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="mt-3 space-y-2">
      <p className="text-muted text-xs">{t("alumnos.detail.feedback.commentOn", { label: targetLabel })}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("alumnos.detail.feedback.placeholder")}
        rows={3}
        maxLength={1000}
        className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-muted focus:border-lime focus:outline-none resize-none"
        aria-label={t("alumnos.detail.feedback.placeholder")}
      />
      <div className="flex items-center justify-between">
        <span className="text-muted text-xs">{text.length}/1000</span>
        <button
          type="submit"
          disabled={saving || text.trim().length === 0}
          className="rounded-lg bg-lime px-4 py-1.5 text-xs font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {saving ? t("alumnos.detail.feedback.saving") : t("alumnos.detail.feedback.save")}
        </button>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {success && (
        <p className="text-green-400 text-xs">{t("alumnos.detail.feedback.saved")}</p>
      )}
    </form>
  );
}
