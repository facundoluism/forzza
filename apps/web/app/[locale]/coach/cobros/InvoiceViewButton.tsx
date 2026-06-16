"use client";

import { useTranslations } from "next-intl";

interface Props {
  signedUrl: string;
}

export function InvoiceViewButton({ signedUrl }: Props) {
  const t = useTranslations("coach");

  return (
    <a
      href={signedUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#C8FF00] hover:text-[#AADD00] text-xs font-medium transition-colors"
    >
      {t("cobros.btnViewInvoice")}
    </a>
  );
}
