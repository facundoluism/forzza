"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  settlementId: string;
}

export function InvoiceUploadButton({ settlementId }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(file.type)) {
      setError("Solo se permiten PDF, JPG o PNG.");
      return;
    }

    // Validate file size (max 10 MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("El archivo no puede superar los 10 MB.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `/api/coach/settlements/${settlementId}/invoice`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Error al subir la factura.");
      } else {
        router.refresh();
      }
    } catch {
      setError("Error inesperado.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="text-[#C8FF00] hover:text-[#AADD00] text-xs font-medium transition-colors disabled:opacity-50"
      >
        {uploading ? "Subiendo..." : "Subir factura"}
      </button>
      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => void handleFileChange(e)}
        className="hidden"
      />
    </div>
  );
}
