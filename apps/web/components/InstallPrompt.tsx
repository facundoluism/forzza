"use client";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!deferredPrompt) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        right: 20,
        background: "#1A1A1A",
        border: "1px solid #C8FF00",
        borderRadius: 8,
        padding: "16px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div>
        <p style={{ color: "#FFFFFF", margin: 0, fontWeight: 600 }}>
          Instalar Forzza
        </p>
        <p style={{ color: "#999", margin: 0, fontSize: 14 }}>
          Accedé más rápido desde tu pantalla de inicio
        </p>
      </div>
      <button
        onClick={async () => {
          await deferredPrompt.prompt();
          setDeferredPrompt(null);
        }}
        style={{
          background: "#C8FF00",
          color: "#000",
          border: "none",
          borderRadius: 6,
          padding: "8px 16px",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Instalar
      </button>
    </div>
  );
}
