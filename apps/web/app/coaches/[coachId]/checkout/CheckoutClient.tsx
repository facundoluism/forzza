"use client";

import { useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

interface CheckoutClientProps {
  coachId: string;
  packageId: string;
  coachName: string;
  packageTitle: string;
  packagePrice: number;
  currency: string;
  currencySymbol?: string;
  isMinorWithoutConsent: boolean;
  errorMessage: string | null;
}

type CheckoutState = "idle" | "loading" | "error";

function formatPrice(cents: number, symbol: string): string {
  return `${symbol} ${(cents / 100).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function CheckoutClient({
  coachId,
  packageId,
  coachName,
  packageTitle,
  packagePrice,
  currency,
  currencySymbol = "$",
  isMinorWithoutConsent,
  errorMessage,
}: CheckoutClientProps) {
  const [state, setState] = useState<CheckoutState>("idle");
  const [clientError, setClientError] = useState<string | null>(null);

  const displayError = errorMessage ?? clientError;

  // Si hay error de configuración o coach/paquete no disponible, mostrar solo el error
  const hasInitialError = errorMessage !== null;

  async function handlePagar() {
    if (isMinorWithoutConsent || hasInitialError) return;

    setState("loading");
    setClientError(null);

    try {
      const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "";
      const supabaseAnonKey = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ?? "";

      const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        const redirectUrl = `/coaches/${coachId}/checkout?package_id=${packageId}`;
        window.location.href = `/login?redirect=${encodeURIComponent(redirectUrl)}`;
        return;
      }

      const res = await fetch(`${supabaseUrl}/functions/v1/coach-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ coach_id: coachId, package_id: packageId }),
      });

      const data = (await res.json()) as { init_point?: string; error?: string };

      if (!res.ok || !data.init_point) {
        const errorMap: Record<string, string> = {
          minor_no_consent:
            "Necesitás consentimiento de tus padres para contratar un coach.",
          invalid_package: "El paquete ya no está disponible.",
          unauthorized: "Necesitás iniciar sesión.",
          mp_error: "Error al procesar el pago. Intentá de nuevo.",
        };
        setClientError(
          errorMap[data.error ?? ""] ??
            "Ocurrió un error al iniciar el pago. Intentá de nuevo."
        );
        setState("error");
        return;
      }

      // Redirigir a Mercado Pago
      window.location.href = data.init_point;
    } catch {
      setClientError("Error de red. Verificá tu conexión e intentá de nuevo.");
      setState("error");
    }
  }

  return (
    <main className="bg-[#0A0A0A] min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-[480px] w-full bg-[#111111] rounded-2xl border border-[#2A2A2A] p-8 flex flex-col gap-6">
        {/* Encabezado */}
        <div>
          <Link
            href={`/coaches/${coachId}`}
            className="text-[#6A6A6A] text-sm hover:text-[#FAFAFA] transition-colors"
          >
            {"← Volver al coach"}
          </Link>
          <h1 className="text-[#FAFAFA] text-2xl font-black mt-4 tracking-tight">
            Contratar coach
          </h1>
          <p className="text-[#6A6A6A] text-sm mt-1">
            Revisá los detalles antes de continuar al pago.
          </p>
        </div>

        {/* Error de inicialización (coach/paquete no disponible) */}
        {hasInitialError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
            <p className="text-red-400 text-sm font-medium">
              {displayError}
            </p>
            <Link
              href="/coaches"
              className="text-red-300 underline text-xs mt-2 inline-block"
            >
              Ver otros coaches
            </Link>
          </div>
        )}

        {/* Error de menor sin consentimiento (Regla #7 — 403) */}
        {isMinorWithoutConsent && !hasInitialError && (
          <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-4">
            <p className="text-orange-400 text-sm font-semibold">
              Necesitás autorización de un adulto
            </p>
            <p className="text-orange-300 text-xs mt-1 leading-relaxed">
              Sos menor de 18 años y todavía no tenemos el consentimiento de
              tus padres o tutores. Pediles que contacten a soporte para
              habilitar tu cuenta.
            </p>
          </div>
        )}

        {/* Resumen del paquete */}
        {!hasInitialError && (
          <>
            <div className="rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-5 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#6A6A6A] text-xs uppercase tracking-wider mb-1">
                    Coach
                  </p>
                  <p className="text-[#FAFAFA] font-semibold">{coachName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#6A6A6A] text-xs uppercase tracking-wider mb-1">
                    Paquete
                  </p>
                  <p className="text-[#FAFAFA] font-semibold">{packageTitle}</p>
                </div>
              </div>

              <div className="border-t border-[#2A2A2A] pt-3 flex justify-between items-center">
                <p className="text-[#6A6A6A] text-sm">Total</p>
                <p className="text-[#C8FF00] text-xl font-black font-mono">
                  {formatPrice(packagePrice, currencySymbol)}
                </p>
              </div>

              <p className="text-[#444444] text-xs">
                Pago procesado por Mercado Pago ({currency}). El cargo
                aparecerá en tu resumen de cuenta.
              </p>
            </div>

            {/* Error de cliente (MP o red) */}
            {state === "error" && clientError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-red-400 text-sm">{clientError}</p>
              </div>
            )}

            {/* CTA */}
            {!isMinorWithoutConsent && (
              <button
                type="button"
                onClick={() => void handlePagar()}
                disabled={state === "loading"}
                className="w-full bg-[#C8FF00] hover:bg-[#b8ef00] disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold text-base rounded-xl py-4 transition-colors"
              >
                {state === "loading"
                  ? "Redirigiendo a Mercado Pago..."
                  : "Pagar con Mercado Pago"}
              </button>
            )}

            <p className="text-[#444444] text-xs text-center">
              Al confirmar, aceptás los{" "}
              <Link href="/terminos" className="underline hover:text-[#6A6A6A]">
                Términos y Condiciones
              </Link>{" "}
              de Forzza.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
