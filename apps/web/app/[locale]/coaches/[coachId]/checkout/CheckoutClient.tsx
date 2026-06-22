"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createBrowserClient } from "@supabase/ssr";

interface CheckoutClientProps {
  coachId: string;
  packageId: string;
  coachName: string;
  packageTitle: string;
  packagePrice: number;
  packageFeatures?: string[];
  currency: string;
  currencySymbol?: string;
  isMinorWithoutConsent: boolean;
  errorMessage: string | null;
}

type CheckoutState = "idle" | "loading" | "error";
type BillingState = "idle" | "loading" | "error";

type TaxCondition =
  | "consumidor_final"
  | "monotributo"
  | "responsable_inscripto"
  | "exento";
type DocType = "DNI" | "CUIT" | "CUIL";

interface BillingForm {
  legal_name: string;
  tax_condition: TaxCondition;
  doc_type: DocType;
  doc_number: string;
  address: string;
}

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
  packageFeatures = [],
  currency,
  currencySymbol = "$",
  isMinorWithoutConsent,
  errorMessage,
}: CheckoutClientProps) {
  const t = useTranslations("checkout");
  const [state, setState] = useState<CheckoutState>("idle");
  const [billingState, setBillingState] = useState<BillingState>("idle");
  const [clientError, setClientError] = useState<string | null>(null);
  const [billingError, setBillingError] = useState<string | null>(null);

  const [billing, setBilling] = useState<BillingForm>({
    legal_name: "",
    tax_condition: "consumidor_final",
    doc_type: "DNI",
    doc_number: "",
    address: "",
  });

  const displayError = errorMessage ?? clientError;
  const hasInitialError = errorMessage !== null;

  // Pre-cargar billing profile existente
  useEffect(() => {
    if (hasInitialError || isMinorWithoutConsent) return;

    setBillingState("loading");
    fetch("/api/billing-profile")
      .then((r) => r.json())
      .then((data: { profile?: BillingForm | null; error?: string }) => {
        if (data.profile) {
          setBilling({
            legal_name: data.profile.legal_name ?? "",
            tax_condition:
              (data.profile.tax_condition as TaxCondition) ??
              "consumidor_final",
            doc_type: (data.profile.doc_type as DocType) ?? "DNI",
            doc_number: data.profile.doc_number ?? "",
            address: data.profile.address ?? "",
          });
        }
        setBillingState("idle");
      })
      .catch(() => {
        // Non-blocking: if we can't prefill, the user fills it manually
        setBillingState("idle");
      });
  }, [hasInitialError, isMinorWithoutConsent]);

  async function handlePagar() {
    if (isMinorWithoutConsent || hasInitialError) return;

    // Validate billing fields
    if (
      !billing.legal_name.trim() ||
      !billing.tax_condition ||
      !billing.doc_type ||
      !billing.doc_number.trim()
    ) {
      setBillingError(t("billing.errorRequired"));
      return;
    }

    setState("loading");
    setClientError(null);
    setBillingError(null);

    // 1. Guardar billing profile primero
    try {
      const bpRes = await fetch("/api/billing-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          legal_name: billing.legal_name.trim(),
          tax_condition: billing.tax_condition,
          doc_type: billing.doc_type,
          doc_number: billing.doc_number.trim(),
          address: billing.address.trim() || null,
        }),
      });

      if (!bpRes.ok) {
        const bpData = (await bpRes.json()) as { error?: string };
        setBillingError(bpData.error ?? t("billing.errorSave"));
        setState("error");
        return;
      }
    } catch {
      setBillingError(t("billing.errorNetwork"));
      setState("error");
      return;
    }

    // 2. Iniciar pago con Mercado Pago
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
          minor_no_consent: t("errorParentalConsent"),
          invalid_package: t("errorPackageUnavailable"),
          unauthorized: t("errorLoginRequired"),
          mp_error: t("errorPayment"),
        };
        setClientError(
          errorMap[data.error ?? ""] ?? t("errorInit")
        );
        setState("error");
        return;
      }

      window.location.href = data.init_point;
    } catch {
      setClientError(t("errorNetwork"));
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
            {t("backToCoach")}
          </Link>
          <h1 className="text-[#FAFAFA] text-2xl font-black mt-4 tracking-tight">
            {t("heading")}
          </h1>
          <p className="text-[#6A6A6A] text-sm mt-1">
            {t("subheading")}
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
              {t("viewOtherCoaches")}
            </Link>
          </div>
        )}

        {/* Error de menor sin consentimiento (Regla #7 — 403) */}
        {isMinorWithoutConsent && !hasInitialError && (
          <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-4">
            <p className="text-orange-400 text-sm font-semibold">
              {t("minorConsentTitle")}
            </p>
            <p className="text-orange-300 text-xs mt-1 leading-relaxed">
              {t("minorConsentBody")}
            </p>
          </div>
        )}

        {/* Resumen del paquete + datos fiscales */}
        {!hasInitialError && (
          <>
            <div className="rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-5 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#6A6A6A] text-xs uppercase tracking-wider mb-1">
                    {t("labelCoach")}
                  </p>
                  <p className="text-[#FAFAFA] font-semibold">{coachName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#6A6A6A] text-xs uppercase tracking-wider mb-1">
                    {t("labelPackage")}
                  </p>
                  <p className="text-[#FAFAFA] font-semibold">{packageTitle}</p>
                </div>
              </div>

              {packageFeatures.length > 0 && (
                <div className="border-t border-[#2A2A2A] pt-3">
                  <p className="text-[#6A6A6A] text-xs uppercase tracking-wider mb-2">
                    {t("includes")}
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {packageFeatures.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#FAFAFA] text-sm">
                        <span className="text-[#C8FF00] mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t border-[#2A2A2A] pt-3 flex justify-between items-center">
                <p className="text-[#6A6A6A] text-sm">{t("labelTotal")}</p>
                <p className="text-[#C8FF00] text-xl font-black font-mono">
                  {formatPrice(packagePrice, currencySymbol)}
                </p>
              </div>

              <p className="text-[#444444] text-xs">
                {t("paymentNote", { currency })}
              </p>
            </div>

            {/* Datos de facturación */}
            {!isMinorWithoutConsent && (
              <div className="rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-5 flex flex-col gap-4">
                <div>
                  <h2 className="text-[#FAFAFA] text-sm font-semibold">
                    {t("billing.sectionTitle")}
                  </h2>
                  <p className="text-[#6A6A6A] text-xs mt-1">
                    {t("billing.sectionHint")}
                  </p>
                </div>

                {billingState === "loading" ? (
                  <div className="h-8 rounded bg-[#2A2A2A] animate-pulse" />
                ) : (
                  <div className="flex flex-col gap-3">
                    {/* Nombre / razón social */}
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="bp-legal-name"
                        className="text-[#6A6A6A] text-xs uppercase tracking-wider"
                      >
                        {t("billing.legalNameLabel")}
                      </label>
                      <input
                        id="bp-legal-name"
                        type="text"
                        value={billing.legal_name}
                        onChange={(e) =>
                          setBilling((prev) => ({
                            ...prev,
                            legal_name: e.target.value,
                          }))
                        }
                        placeholder={t("billing.legalNamePlaceholder")}
                        className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-[#FAFAFA] text-sm placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#C8FF00] transition-colors"
                      />
                    </div>

                    {/* Condición IVA */}
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="bp-tax-condition"
                        className="text-[#6A6A6A] text-xs uppercase tracking-wider"
                      >
                        {t("billing.taxConditionLabel")}
                      </label>
                      <select
                        id="bp-tax-condition"
                        value={billing.tax_condition}
                        onChange={(e) =>
                          setBilling((prev) => ({
                            ...prev,
                            tax_condition: e.target.value as TaxCondition,
                          }))
                        }
                        className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-[#FAFAFA] text-sm focus:outline-none focus:border-[#C8FF00] transition-colors"
                      >
                        <option value="consumidor_final">
                          {t("billing.taxConditionConsumidorFinal")}
                        </option>
                        <option value="monotributo">
                          {t("billing.taxConditionMonotributo")}
                        </option>
                        <option value="responsable_inscripto">
                          {t("billing.taxConditionResponsableInscripto")}
                        </option>
                        <option value="exento">
                          {t("billing.taxConditionExento")}
                        </option>
                      </select>
                    </div>

                    {/* Tipo y número de documento */}
                    <div className="flex gap-3">
                      <div className="flex flex-col gap-1 w-28 shrink-0">
                        <label
                          htmlFor="bp-doc-type"
                          className="text-[#6A6A6A] text-xs uppercase tracking-wider"
                        >
                          {t("billing.docTypeLabel")}
                        </label>
                        <select
                          id="bp-doc-type"
                          value={billing.doc_type}
                          onChange={(e) =>
                            setBilling((prev) => ({
                              ...prev,
                              doc_type: e.target.value as DocType,
                            }))
                          }
                          className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-[#FAFAFA] text-sm focus:outline-none focus:border-[#C8FF00] transition-colors"
                        >
                          <option value="DNI">{t("billing.docTypeDNI")}</option>
                          <option value="CUIT">{t("billing.docTypeCUIT")}</option>
                          <option value="CUIL">{t("billing.docTypeCUIL")}</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <label
                          htmlFor="bp-doc-number"
                          className="text-[#6A6A6A] text-xs uppercase tracking-wider"
                        >
                          {t("billing.docNumberLabel")}
                        </label>
                        <input
                          id="bp-doc-number"
                          type="text"
                          inputMode="numeric"
                          value={billing.doc_number}
                          onChange={(e) =>
                            setBilling((prev) => ({
                              ...prev,
                              doc_number: e.target.value,
                            }))
                          }
                          placeholder={t("billing.docNumberPlaceholder")}
                          className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-[#FAFAFA] text-sm placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#C8FF00] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Domicilio fiscal */}
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="bp-address"
                        className="text-[#6A6A6A] text-xs uppercase tracking-wider"
                      >
                        {t("billing.addressLabel")}
                      </label>
                      <input
                        id="bp-address"
                        type="text"
                        value={billing.address}
                        onChange={(e) =>
                          setBilling((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        placeholder={t("billing.addressPlaceholder")}
                        className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-[#FAFAFA] text-sm placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#C8FF00] transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Error de validación de billing */}
                {billingError && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">
                    <p className="text-red-400 text-xs">{billingError}</p>
                  </div>
                )}
              </div>
            )}

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
                disabled={state === "loading" || billingState === "loading"}
                className="w-full bg-[#C8FF00] hover:bg-[#b8ef00] disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold text-base rounded-xl py-4 transition-colors"
              >
                {state === "loading" ? t("submitLoading") : t("submit")}
              </button>
            )}

            <p className="text-[#444444] text-xs text-center">
              {t("termsNotePre")}{" "}
              <Link href="/legales/terminos" className="underline hover:text-[#6A6A6A]">
                {t("termsLinkText")}
              </Link>
              {t("termsNotePost") ? ` ${t("termsNotePost")}` : ""}
            </p>
          </>
        )}
      </div>
    </main>
  );
}
