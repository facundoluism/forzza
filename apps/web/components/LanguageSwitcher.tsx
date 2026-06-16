"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";
import type { Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchLocale(next: Locale) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "2px",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "8px",
        padding: "2px",
        opacity: isPending ? 0.6 : 1,
        transition: "opacity 200ms",
      }}
      aria-label="Cambiar idioma / Change language"
    >
      {(["es", "en"] as Locale[]).map((loc) => {
        const active = loc === locale;
        return (
          <button
            key={loc}
            onClick={() => switchLocale(loc)}
            disabled={isPending}
            style={{
              background: active ? "var(--color-lime)" : "transparent",
              color: active ? "#000" : "var(--color-muted)",
              border: "none",
              borderRadius: "6px",
              padding: "4px 10px",
              fontSize: "12px",
              fontWeight: active ? 700 : 500,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.5px",
              cursor: active || isPending ? "default" : "pointer",
              transition: "background 150ms, color 150ms",
              lineHeight: 1.5,
            }}
            aria-pressed={active}
          >
            {loc.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
