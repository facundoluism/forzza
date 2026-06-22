/**
 * AppQrCode — Server Component
 * Generates a QR code as a data URL using the `qrcode` package.
 * The URL encoded in the QR is configurable via NEXT_PUBLIC_APP_DOWNLOAD_URL.
 * Falls back to the current origin (self) if not set.
 * Uses a data: URL so it works within the existing CSP (img-src: self data:).
 */

import qrcode from "qrcode";

interface AppQrCodeProps {
  /** Override the URL encoded in the QR (defaults to env var or "/") */
  url?: string;
  size?: number;
  alt?: string;
}

export async function AppQrCode({
  url,
  size = 200,
  alt = "QR code para descargar la app",
}: AppQrCodeProps) {
  const target =
    url ??
    process.env["NEXT_PUBLIC_APP_DOWNLOAD_URL"] ??
    "https://forzza.app";

  let dataUrl: string;
  try {
    dataUrl = await qrcode.toDataURL(target, {
      width: size,
      margin: 1,
      color: {
        dark: "#C8FF00", // lime — matches Forzza brand
        light: "#0A0A0A", // near-black background
      },
      errorCorrectionLevel: "M",
    });
  } catch {
    // Fallback: a 1×1 transparent pixel — never crashes the page
    dataUrl =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={dataUrl}
      alt={alt}
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        borderRadius: "12px",
        display: "block",
      }}
    />
  );
}
