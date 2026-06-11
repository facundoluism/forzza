"use client";

import { useState } from "react";

interface CountryConfig {
  country_code: string;
  commission_rate: number;
  currency: string;
  currency_code: string;
  currency_symbol: string;
  min_coach_price: number;
  pro_monthly_price_cents: number;
  active: boolean;
}

interface ConfigEditorProps {
  configs: CountryConfig[];
}

interface EditState {
  commission_rate: string;
  min_coach_price: string;
  pro_monthly_price_cents: string;
  currency_symbol: string;
  active: boolean;
}

export function ConfigEditor({ configs }: ConfigEditorProps) {
  const [editStates, setEditStates] = useState<Record<string, EditState>>(
    Object.fromEntries(
      configs.map((c) => [
        c.country_code,
        {
          commission_rate: (c.commission_rate * 100).toFixed(1),
          min_coach_price: c.min_coach_price.toString(),
          pro_monthly_price_cents: c.pro_monthly_price_cents.toString(),
          currency_symbol: c.currency_symbol,
          active: c.active,
        },
      ])
    )
  );

  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});

  function updateField(
    countryCode: string,
    field: keyof EditState,
    value: string | boolean
  ) {
    setEditStates((prev) => ({
      ...prev,
      [countryCode]: {
        ...prev[countryCode]!,
        [field]: value,
      },
    }));
  }

  async function handleSave(countryCode: string) {
    const state = editStates[countryCode];
    if (!state) return;

    setSaving((prev) => ({ ...prev, [countryCode]: true }));
    setMessages((prev) => ({ ...prev, [countryCode]: "" }));

    const commissionRate = parseFloat(state.commission_rate) / 100;

    if (isNaN(commissionRate) || commissionRate < 0 || commissionRate > 1) {
      setMessages((prev) => ({
        ...prev,
        [countryCode]: "La comisión debe estar entre 0% y 100%",
      }));
      setSaving((prev) => ({ ...prev, [countryCode]: false }));
      return;
    }

    const minCoachPrice = parseInt(state.min_coach_price, 10);
    if (isNaN(minCoachPrice) || minCoachPrice <= 0) {
      setMessages((prev) => ({
        ...prev,
        [countryCode]: "El precio mínimo debe ser mayor a 0",
      }));
      setSaving((prev) => ({ ...prev, [countryCode]: false }));
      return;
    }

    const proPrice = parseInt(state.pro_monthly_price_cents, 10);
    if (isNaN(proPrice) || proPrice <= 0) {
      setMessages((prev) => ({
        ...prev,
        [countryCode]: "El precio PRO debe ser mayor a 0",
      }));
      setSaving((prev) => ({ ...prev, [countryCode]: false }));
      return;
    }

    try {
      const res = await fetch("/api/admin/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country_code: countryCode,
          commission_rate: commissionRate,
          min_coach_price: minCoachPrice,
          pro_monthly_price_cents: proPrice,
          currency_symbol: state.currency_symbol,
          active: state.active,
        }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setMessages((prev) => ({
          ...prev,
          [countryCode]: data.error ?? "Error al guardar",
        }));
      } else {
        setMessages((prev) => ({
          ...prev,
          [countryCode]: "Guardado correctamente",
        }));
        setTimeout(() => {
          setMessages((prev) => ({ ...prev, [countryCode]: "" }));
        }, 3000);
      }
    } catch {
      setMessages((prev) => ({
        ...prev,
        [countryCode]: "Error de red",
      }));
    } finally {
      setSaving((prev) => ({ ...prev, [countryCode]: false }));
    }
  }

  if (configs.length === 0) {
    return (
      <div className="rounded-xl border border-[#1E1E1E] bg-[#111111] p-12 text-center">
        <p className="text-[#555555]">No hay configuraciones de países.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {configs.map((config) => {
        const state = editStates[config.country_code];
        if (!state) return null;
        const isSaving = saving[config.country_code] ?? false;
        const message = messages[config.country_code] ?? "";
        const isSuccess = message === "Guardado correctamente";

        return (
          <div
            key={config.country_code}
            className="rounded-xl border border-[#1E1E1E] bg-[#111111] overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#1E1E1E] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold text-[#FAFAFA]">
                  {config.country_code}
                </h2>
                <span className="text-[#555555] text-sm">
                  {config.currency} ({config.currency_code})
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-[#666666] text-xs">
                  {state.active ? "Activo" : "Inactivo"}
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={state.active}
                    onChange={(e) =>
                      updateField(config.country_code, "active", e.target.checked)
                    }
                    className="sr-only"
                  />
                  <div
                    onClick={() =>
                      updateField(config.country_code, "active", !state.active)
                    }
                    className={`w-10 h-6 rounded-full transition-colors cursor-pointer ${
                      state.active ? "bg-[#C8FF00]" : "bg-[#2A2A2A]"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                        state.active ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </div>
                </div>
              </label>
            </div>

            {/* Fields */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="block text-[#555555] text-xs uppercase tracking-wider mb-2">
                  Comisión (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={state.commission_rate}
                    onChange={(e) =>
                      updateField(
                        config.country_code,
                        "commission_rate",
                        e.target.value
                      )
                    }
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-[#FAFAFA] text-sm focus:outline-none focus:border-[#C8FF00] pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444444] text-sm">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[#555555] text-xs uppercase tracking-wider mb-2">
                  Precio mínimo coach (centavos)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={state.min_coach_price}
                  onChange={(e) =>
                    updateField(
                      config.country_code,
                      "min_coach_price",
                      e.target.value
                    )
                  }
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-[#FAFAFA] text-sm focus:outline-none focus:border-[#C8FF00]"
                />
                <p className="text-[#444444] text-xs mt-1">
                  = {state.currency_symbol}{" "}
                  {(parseInt(state.min_coach_price || "0") / 100).toLocaleString(
                    "es-AR"
                  )}
                </p>
              </div>

              <div>
                <label className="block text-[#555555] text-xs uppercase tracking-wider mb-2">
                  Precio PRO mensual (centavos)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={state.pro_monthly_price_cents}
                  onChange={(e) =>
                    updateField(
                      config.country_code,
                      "pro_monthly_price_cents",
                      e.target.value
                    )
                  }
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-[#FAFAFA] text-sm focus:outline-none focus:border-[#C8FF00]"
                />
                <p className="text-[#444444] text-xs mt-1">
                  = {state.currency_symbol}{" "}
                  {(
                    parseInt(state.pro_monthly_price_cents || "0") / 100
                  ).toLocaleString("es-AR")}
                </p>
              </div>

              <div>
                <label className="block text-[#555555] text-xs uppercase tracking-wider mb-2">
                  Símbolo de moneda
                </label>
                <input
                  type="text"
                  maxLength={5}
                  value={state.currency_symbol}
                  onChange={(e) =>
                    updateField(
                      config.country_code,
                      "currency_symbol",
                      e.target.value
                    )
                  }
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-[#FAFAFA] text-sm focus:outline-none focus:border-[#C8FF00]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#1E1E1E] flex items-center justify-between">
              {message ? (
                <p
                  className={`text-sm ${isSuccess ? "text-[#C8FF00]" : "text-red-400"}`}
                >
                  {message}
                </p>
              ) : (
                <span />
              )}
              <button
                onClick={() => handleSave(config.country_code)}
                disabled={isSaving}
                className="px-5 py-2 rounded-lg bg-[#C8FF00] text-[#0A0A0A] text-sm font-semibold hover:bg-[#AADD00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Guardando…" : "Guardar cambios"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
