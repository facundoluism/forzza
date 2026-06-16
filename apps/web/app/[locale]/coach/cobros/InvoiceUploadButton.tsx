"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface Props {
  settlementId: string;
}

export function InvoiceUploadButton({ settlementId }: Props) {
  const router = useRouter();
  const t = useTranslations("coach");
  const inputRef = useRef<HTMLInputElement>(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const normalizedInvoiceNumber = invoiceNumber.trim();
    if (!normalizedInvoiceNumber) {
      setError(t("cobros.upload.errorRequired"));
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // Validate file type
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(file.type)) {
      setError(t("cobros.upload.errorFileType"));
      return;
    }

    // Validate file size (max 10 MB)
    if (file.size > 10 * 1024 * 1024) {
      setError(t("cobros.upload.errorFileSize"));
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("invoice_number", normalizedInvoiceNumber);

      const res = await fetch(
        `/api/coach/settlements/${settlementId}/invoice`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? t("cobros.upload.errorUpload"));
      } else {
        setInvoiceNumber("");
        router.refresh();
      }
    } catch {
      setError(t("cobros.upload.errorNetwork"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <input
        value={invoiceNumber}
        onChange={(e) => setInvoiceNumber(e.target.value)}
        aria-label={t("cobros.upload.invoiceNumber")}
        placeholder={t("cobros.upload.invoicePlaceholder")}
        className="w-32 rounded-lg border border-border bg-bg px-2 py-1.5 text-right text-xs text-text placeholder:text-muted focus:border-[#C8FF00] focus:outline-none"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading || invoiceNumber.trim().length === 0}
        className="text-[#C8FF00] hover:text-[#AADD00] text-xs font-medium transition-colors disabled:opacity-50"
      >
        {uploading ? t("cobros.upload.btnUploading") : t("cobros.btnUploadInvoice")}
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
