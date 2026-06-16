"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface PackageEntry {
  id?: string;
  name: string;
  description: string;
  price_cents: number;
  billing_type: "mensual" | "paquete";
  features: string[];
  is_active: boolean;
  _deleted?: boolean;
}

interface ProfileData {
  display_name: string;
  bio: string;
  specialties: string[];
  years_experience: number | null;
}

interface Props {
  initialProfile: ProfileData;
  initialPackages: (PackageEntry & { id: string })[];
  minCoachPrice: number;
  currencySymbol: string;
}

export function PerfilForm({
  initialProfile,
  initialPackages,
  minCoachPrice,
  currencySymbol,
}: Props) {
  const t = useTranslations("coach");
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [packages, setPackages] = useState<PackageEntry[]>(initialPackages);
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addSpecialty() {
    const trimmed = specialtyInput.trim();
    if (!trimmed || profile.specialties.includes(trimmed)) return;
    setProfile((p) => ({ ...p, specialties: [...p.specialties, trimmed] }));
    setSpecialtyInput("");
  }

  function removeSpecialty(tag: string) {
    setProfile((p) => ({
      ...p,
      specialties: p.specialties.filter((s) => s !== tag),
    }));
  }

  function addPackage() {
    setPackages((prev) => [
      ...prev,
      {
        name: "",
        description: "",
        // minCoachPrice is already in centavos (from country_config.min_coach_price)
        price_cents: minCoachPrice,
        billing_type: "mensual",
        features: [],
        is_active: true,
      },
    ]);
  }

  function updatePackage(
    index: number,
    field: keyof PackageEntry,
    value: string | number | boolean | string[]
  ) {
    setPackages((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  }

  function removePackage(index: number) {
    setPackages((prev) => {
      const pkg = prev[index];
      if (pkg?.id) {
        // Mark existing for deletion
        return prev.map((p, i) => (i === index ? { ...p, _deleted: true } : p));
      }
      return prev.filter((_, i) => i !== index);
    });
  }

  function addFeature(pkgIndex: number) {
    const newFeature = prompt("Nueva característica:");
    if (!newFeature?.trim()) return;
    setPackages((prev) =>
      prev.map((p, i) =>
        i === pkgIndex
          ? { ...p, features: [...p.features, newFeature.trim()] }
          : p
      )
    );
  }

  function removeFeature(pkgIndex: number, featIndex: number) {
    setPackages((prev) =>
      prev.map((p, i) =>
        i === pkgIndex
          ? { ...p, features: p.features.filter((_, fi) => fi !== featIndex) }
          : p
      )
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate packages price
    // minCoachPrice and price_cents are both in centavos (country_config.min_coach_price)
    const activePackages = packages.filter((p) => !p._deleted);
    for (const pkg of activePackages) {
      if (!pkg.name.trim()) {
        setError(t("perfil.errorSave"));
        return;
      }
      if (pkg.price_cents < minCoachPrice) {
        const minDisplay = (minCoachPrice / 100).toLocaleString("es-AR");
        setError(
          t("perfil.validationPrice", { symbol: currencySymbol, min: minDisplay })
        );
        return;
      }
    }

    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/coach/perfil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: {
            bio: profile.bio || null,
            specialties: profile.specialties,
            years_experience: profile.years_experience,
          },
          packages: packages.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description || null,
            price_cents: p.price_cents,
            billing_type: p.billing_type,
            features: p.features,
            is_active: p.is_active,
            _deleted: p._deleted ?? false,
          })),
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? t("perfil.errorSave"));
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError(t("perfil.errorNetwork"));
      setLoading(false);
    }
  }

  const visiblePackages = packages.filter((p) => !p._deleted);

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-8">
      {/* Profile section */}
      <section className="rounded-xl border border-border bg-surface p-6 space-y-5">
        <h2 className="text-sm font-semibold text-text uppercase tracking-wider">
          {t("perfil.title")}
        </h2>

        <div>
          <label className="block text-sm font-medium text-text mb-2">
            {t("perfil.fieldBio")}
          </label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
            rows={4}
            placeholder="Contá quién sos, tu experiencia y metodología..."
            className="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text placeholder-[#444444] focus:outline-none focus:border-[#C8FF00] transition-colors resize-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">
            {t("perfil.fieldExperience")}
          </label>
          <input
            type="number"
            min={0}
            max={60}
            value={profile.years_experience ?? ""}
            onChange={(e) =>
              setProfile((p) => ({
                ...p,
                years_experience: e.target.value
                  ? parseInt(e.target.value)
                  : null,
              }))
            }
            placeholder="Ej: 5"
            className="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text placeholder-[#444444] focus:outline-none focus:border-[#C8FF00] transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">
            {t("perfil.fieldSpecialties")}
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={specialtyInput}
              onChange={(e) => setSpecialtyInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSpecialty();
                }
              }}
              placeholder="Ej: Pérdida de peso"
              className="flex-1 px-4 py-2 bg-surface-2 border border-border rounded-lg text-text placeholder-[#444444] focus:outline-none focus:border-[#C8FF00] transition-colors text-sm"
            />
            <button
              type="button"
              onClick={addSpecialty}
              className="px-3 py-2 bg-surface-2 border border-border rounded-lg text-lime hover:border-[#C8FF00] transition-colors text-sm"
            >
              {t("perfil.addSpecialty")}
            </button>
          </div>
          {profile.specialties.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.specialties.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-surface-2 border border-border rounded-full text-xs text-muted"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeSpecialty(tag)}
                    className="text-muted hover:text-red-400 transition-colors ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Packages section */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-text uppercase tracking-wider">
            {t("perfil.packages")}
          </h2>
          <button
            type="button"
            onClick={addPackage}
            className="text-lime hover:text-[#AADD00] text-sm font-medium transition-colors"
          >
            {t("perfil.addPackage")}
          </button>
        </div>

        {visiblePackages.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-muted text-sm opacity-60">{t("perfil.addPackage")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {packages.map((pkg, index) => {
              if (pkg._deleted) return null;
              const isPriceInvalid = pkg.price_cents < minCoachPrice;
              return (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-surface-2 p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-muted text-xs font-mono">
                      {t("perfil.packages")} {index + 1}
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pkg.is_active}
                          onChange={(e) =>
                            updatePackage(index, "is_active", e.target.checked)
                          }
                          className="w-3.5 h-3.5 accent-[#C8FF00]"
                        />
                        <span className="text-muted text-xs">{t("perfil.packageActive")}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => removePackage(index)}
                        className="text-muted hover:text-red-400 text-xs transition-colors"
                      >
                        {t("perfil.removePackage")}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-muted text-xs mb-1">
                        {t("perfil.packageName")}
                      </label>
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) =>
                          updatePackage(index, "name", e.target.value)
                        }
                        placeholder="Ej: Plan Básico"
                        className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text placeholder-[#444444] focus:outline-none focus:border-[#C8FF00] text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-muted text-xs mb-1">
                        {t("perfil.packageBilling")}
                      </label>
                      <select
                        value={pkg.billing_type}
                        onChange={(e) =>
                          updatePackage(
                            index,
                            "billing_type",
                            e.target.value as "mensual" | "paquete"
                          )
                        }
                        className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text text-sm focus:outline-none focus:border-[#C8FF00] transition-colors"
                      >
                        <option value="mensual">{t("perfil.billingMonthly")}</option>
                        <option value="paquete">{t("perfil.billingPerSession")}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-muted text-xs mb-1">
                      {t("perfil.packagePrice")} ({currencySymbol}) — {t("perfil.errorPriceMin")}{" "}
                      {currencySymbol} {(minCoachPrice / 100).toLocaleString("es-AR")}
                    </label>
                    <input
                      type="number"
                      min={minCoachPrice / 100}
                      step={1}
                      value={pkg.price_cents / 100}
                      onChange={(e) =>
                        updatePackage(
                          index,
                          "price_cents",
                          Math.round(parseFloat(e.target.value || "0") * 100)
                        )
                      }
                      className={`w-full px-3 py-2 bg-surface rounded-lg text-text text-sm focus:outline-none transition-colors ${
                        isPriceInvalid
                          ? "border-2 border-red-500 focus:border-red-500"
                          : "border border-border focus:border-[#C8FF00]"
                      }`}
                    />
                    {isPriceInvalid && (
                      <p className="text-red-400 text-xs mt-1">
                        {t("perfil.validationPrice", {
                          symbol: currencySymbol,
                          min: (minCoachPrice / 100).toLocaleString("es-AR"),
                        })}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-muted text-xs mb-1">
                      {t("perfil.packageDescription")}
                    </label>
                    <textarea
                      value={pkg.description}
                      onChange={(e) =>
                        updatePackage(index, "description", e.target.value)
                      }
                      rows={2}
                      placeholder="Describí qué incluye este paquete..."
                      className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text placeholder-[#444444] focus:outline-none focus:border-[#C8FF00] text-sm resize-none transition-colors"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-muted text-xs">
                        {t("perfil.packageFeatures")}
                      </label>
                      <button
                        type="button"
                        onClick={() => addFeature(index)}
                        className="text-lime text-xs hover:text-[#AADD00] transition-colors"
                      >
                        + Agregar
                      </button>
                    </div>
                    {pkg.features.length > 0 && (
                      <ul className="space-y-1">
                        {pkg.features.map((feat, fi) => (
                          <li
                            key={fi}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="text-muted">• {feat}</span>
                            <button
                              type="button"
                              onClick={() => removeFeature(index, fi)}
                              className="text-muted hover:text-red-400 transition-colors"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {success && (
        <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3">
          {t("perfil.successSaved")}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#C8FF00] text-[#0A0A0A] rounded-lg font-semibold hover:bg-[#AADD00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? t("perfil.btnSaving") : t("perfil.btnSave")}
      </button>
    </form>
  );
}
