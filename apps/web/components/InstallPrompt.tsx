"use client";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "forzza-install-dismissed";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Don't show if user dismissed recently (24h)
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt && Date.now() - Number(dismissedAt) < 24 * 60 * 60 * 1000) {
      return;
    }
    setDismissed(false);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setDismissed(true);
    setDeferredPrompt(null);
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 80,
        left: 20,
        right: 20,
        background: "#0E0E18",
        border: "1px solid #242436",
        borderRadius: 12,
        padding: "14px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        zIndex: 999,
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: "#F0F0FF", margin: 0, fontWeight: 600, fontSize: 14 }}>
          Instalar Forzza
        </p>
        <p style={{ color: "#6868A0", margin: 0, fontSize: 12 }}>
          Accedé más rápido desde tu pantalla de inicio
        </p>
      </div>
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <button
          onClick={handleDismiss}
          style={{
            background: "transparent",
            color: "#6868A0",
            border: "1px solid #242436",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Ahora no
        </button>
        <button
          onClick={async () => {
            await deferredPrompt.prompt();
            handleDismiss();
          }}
          style={{
            background: "#C8FF00",
            color: "#000",
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Instalar
        </button>
      </div>
    </div>
  );
}
