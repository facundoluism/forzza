import { requireCoach } from "@/lib/auth/coach";
import type { Metadata } from "next";
import { PerfilForm } from "./PerfilForm";

export const metadata: Metadata = {
  title: "Mi perfil — Forzza Coach",
};

export default async function PerfilPage() {
  const { supabase, coachProfileId } = await requireCoach();

  // Fetch coach profile
  const { data: coachProfile } = await supabase
    .from("coach_profiles")
    .select(
      "id, display_name, bio, specialties, years_experience, country"
    )
    .eq("id", coachProfileId)
    .single();

  // Fetch packages
  const { data: packages } = await supabase
    .from("coach_packages")
    .select("id, title, description, price, active")
    .eq("coach_id", coachProfileId)
    .order("created_at", { ascending: true });

  // Fetch min_coach_price from country_config
  const { data: countryConfig } = await supabase
    .from("country_config")
    .select("min_coach_price, currency_symbol")
    .eq("country", coachProfile?.country ?? "AR")
    .single();

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#FAFAFA]">Mi perfil</h1>
        <p className="text-[#666666] text-sm mt-1">
          Editá tu perfil público y paquetes de servicio
        </p>
      </div>

      <PerfilForm
        initialProfile={{
          display_name: coachProfile?.display_name ?? "",
          bio: coachProfile?.bio ?? "",
          specialties: coachProfile?.specialties ?? [],
          years_experience: coachProfile?.years_experience ?? null,
        }}
        initialPackages={
          (packages ?? []).map((p) => ({
            id: p.id,
            name: p.title,
            description: p.description ?? "",
            price_cents: p.price,
            billing_type: "mensual" as const,
            features: [],
            is_active: p.active ?? true,
          }))
        }
        minCoachPrice={countryConfig?.min_coach_price ?? 0}
        currencySymbol={countryConfig?.currency_symbol ?? "$"}
      />
    </div>
  );
}
