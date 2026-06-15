"use client";

import { useState } from "react";

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
        setError("Todos los paquetes deben tener un nombre.");
        return;
      }
      if (pkg.price_cents < minCoachPrice) {
        const minDisplay = (minCoachPrice / 100).toLocaleString("es-AR");
        setError(
          `El precio mínimo por paquete es ${currencySymbol} ${minDisplay}.`
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
        setError(data.error ?? "Error al guardar el perfil.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Error inesperado. Intentá de nuevo.");
      setLoading(false);
    }
  }

  const visiblePackages = packages.filter((p) => !p._deleted);

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-8">
      {/* Profile section */}
      <section className="rounded-xl border border-[#2A2A2A] bg-[#111111] p-6 space-y-5">
        <h2 className="text-sm font-semibold text-[#FAFAFA] uppercase tracking-wider">
          Datos del perfil
        </h2>

        <div>
          <label className="block text-sm font-medium text-[#FAFAFA] mb-2">
            Biografía
          </label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
            rows={4}
            placeholder="Contá quién sos, tu experiencia y metodología..."
            className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#FAFAFA] placeholder-[#444444] focus:outline-none focus:border-[#C8FF00] transition-colors resize-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#FAFAFA] mb-2">
            Años de experiencia
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
            className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#FAFAFA] placeholder-[#444444] focus:outline-none focus:border-[#C8FF00] transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#FAFAFA] mb-2">
            Especialidades
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
              className="flex-1 px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#FAFAFA] placeholder-[#444444] focus:outline-none focus:border-[#C8FF00] transition-colors text-sm"
            />
            <button
              type="button"
              onClick={addSpecialty}
              className="px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#C8FF00] hover:border-[#C8FF00] transition-colors text-sm"
            >
              +
            </button>
          </div>
          {profile.specialties.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.specialties.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full text-xs text-[#AAAAAA]"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeSpecialty(tag)}
                    className="text-[#666666] hover:text-red-400 transition-colors ml-1"
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
      <section className="rounded-xl border border-[#2A2A2A] bg-[#111111] p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-[#FAFAFA] uppercase tracking-wider">
            Paquetes
          </h2>
          <button
            type="button"
            onClick={addPackage}
            className="text-[#C8FF00] hover:text-[#AADD00] text-sm font-medium transition-colors"
          >
            + Agregar paquete
          </button>
        </div>

        {visiblePackages.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#2A2A2A] p-8 text-center">
            <p className="text-[#444444] text-sm">Sin paquetes. Agregá tu primer paquete.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {packages.map((pkg, index) => {
              if (pkg._deleted) return null;
              return (
                <div
                  key={index}
                  className="rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[#666666] text-xs font-mono">
                      Paquete {index + 1}
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
                        <span className="text-[#666666] text-xs">Activo</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => removePackage(index)}
                        className="text-[#666666] hover:text-red-400 text-xs transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#666666] text-xs mb-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) =>
                          updatePackage(index, "name", e.target.value)
                        }
                        placeholder="Ej: Plan Básico"
                        className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#FAFAFA] placeholder-[#444444] focus:outline-none focus:border-[#C8FF00] text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[#666666] text-xs mb-1">
                        Tipo de facturación
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
                        className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#FAFAFA] text-sm focus:outline-none focus:border-[#C8FF00] transition-colors"
                      >
                        <option value="mensual">Mensual</option>
                        <option value="paquete">Paquete</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#666666] text-xs mb-1">
                      Precio ({currencySymbol}) — mínimo{" "}
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
                      className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#FAFAFA] text-sm focus:outline-none focus:border-[#C8FF00] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666666] text-xs mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={pkg.description}
                      onChange={(e) =>
                        updatePackage(index, "description", e.target.value)
                      }
                      rows={2}
                      placeholder="Describí qué incluye este paquete..."
                      className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[#FAFAFA] placeholder-[#444444] focus:outline-none focus:border-[#C8FF00] text-sm resize-none transition-colors"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[#666666] text-xs">
                        Características
                      </label>
                      <button
                        type="button"
                        onClick={() => addFeature(index)}
                        className="text-[#C8FF00] text-xs hover:text-[#AADD00] transition-colors"
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
                            <span className="text-[#AAAAAA]">• {feat}</span>
                            <button
                              type="button"
                              onClick={() => removeFeature(index, fi)}
                              className="text-[#666666] hover:text-red-400 transition-colors"
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
          Perfil guardado correctamente.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#C8FF00] text-[#0A0A0A] rounded-lg font-semibold hover:bg-[#AADD00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
