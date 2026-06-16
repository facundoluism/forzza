"use client";

interface Props {
  signedUrl: string;
}

export function InvoiceViewButton({ signedUrl }: Props) {
  return (
    <a
      href={signedUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#C8FF00] hover:text-[#AADD00] text-xs font-medium transition-colors"
    >
      Ver factura
    </a>
  );
}
