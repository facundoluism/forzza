import type { Metadata } from "next";
import Link from "next/link";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Coaches — Forzza",
  description:
    "Encontrá al coach ideal para tus objetivos. Coaches certificados y verificados, con paquetes desde ARS 0.",
};

interface CoachPackage {
  id: string;
  price_cents: number;
  billing_type: "mensual" | "paquete";
}

interface Coach {
  id: string;
  display_name: string;
  bio: string | null;
  specialties: string[];
  avatar_url: string | null;
  years_experience: number | null;
  packages: CoachPackage[];
}

function cheapestPrice(packages: CoachPackage[]): number | null {
  if (!packages || packages.length === 0) return null;
  return packages.reduce(
    (min, p) => (p.price_cents < min ? p.price_cents : min),
    packages[0]!.price_cents
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

async function getCoaches(): Promise<Coach[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: coaches } = await (supabase as any)
      .from("coach_profiles")
      .select(
        "id, display_name, bio, specialties, avatar_url, years_experience, packages:coach_packages(id, price_cents, billing_type)"
      )
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    return (coaches ?? []) as Coach[];
  } catch {
    return [];
  }
}

function CoachCard({ coach }: { coach: Coach }) {
  const minPrice = cheapestPrice(coach.packages);
  const bioSnippet = coach.bio
    ? coach.bio.length > 120
      ? coach.bio.slice(0, 117) + "..."
      : coach.bio
    : null;

  return (
    <Link href={`/coaches/${coach.id}`} className="block h-full">
      <div className="bg-[#111111] rounded-2xl border border-[#2A2A2A] hover:border-[#3A3A3A] p-6 flex flex-col gap-3 cursor-pointer transition-colors h-full">
        {/* Avatar + name */}
        <div className="flex items-center gap-3">
          {coach.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coach.avatar_url}
              alt={coach.display_name}
              className="w-[60px] h-[60px] rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-[60px] h-[60px] rounded-full bg-[#3A3A3A] flex items-center justify-center text-[22px] font-black text-[#C8FF00] tracking-wide flex-shrink-0">
              {getInitials(coach.display_name)}
            </div>
          )}
          <div>
            <h3 className="text-[#FAFAFA] text-xl font-extrabold tracking-tight m-0">
              {coach.display_name}
            </h3>
            {coach.years_experience !== null && (
              <p className="text-[#8A8A8A] text-[13px] m-0">
                {coach.years_experience}{" "}
                {coach.years_experience === 1 ? "año" : "años"} de experiencia
              </p>
            )}
          </div>
        </div>

        {/* Specialties */}
        {coach.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {coach.specialties.slice(0, 3).map((s) => (
              <span
                key={s}
                className="bg-[#2A2A2A] text-[#AAAAAA] rounded-full px-3 py-1 text-xs font-semibold"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Bio snippet */}
        {bioSnippet && (
          <p className="text-[#8A8A8A] text-sm leading-relaxed m-0 flex-1">
            {bioSnippet}
          </p>
        )}

        {/* Price */}
        {minPrice !== null && (
          <p className="text-[#6A6A6A] text-[13px] m-0">
            Desde{" "}
            <span className="text-[#C8FF00] font-bold font-mono text-base">
              ${(minPrice / 100).toLocaleString("es-AR")}
            </span>
            {"/mes"}
          </p>
        )}

        {/* CTA */}
        <div className="inline-block bg-[#C8FF00] text-black rounded-lg px-4 py-2 font-bold text-sm text-center">
          Ver perfil
        </div>
      </div>
    </Link>
  );
}

export default async function CoachesPage() {
  const coachList = await getCoaches();

  return (
    <main className="bg-[#0A0A0A] min-h-screen text-[#FAFAFA]">
      {/* Header */}
      <section className="px-6 pt-16 pb-8 max-w-[1200px] mx-auto">
        <Link href="/" className="text-[#6A6A6A] text-sm hover:text-[#FAFAFA] transition-colors">
          {"← Volver al inicio"}
        </Link>
        <h1 className="text-[clamp(36px,5vw,64px)] font-black text-[#FAFAFA] mt-4 mb-2 tracking-tight">
          Coaches verificados
        </h1>
        <p className="text-[#8A8A8A] text-lg max-w-[600px]">
          Todos nuestros coaches pasan por un proceso de validación. Encontrá al que mejor se adapte a tus objetivos.
        </p>
      </section>

      {/* Grid */}
      <section className="px-6 pb-16 max-w-[1200px] mx-auto">
        {coachList.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">🏋️</p>
            <h2 className="text-2xl font-bold text-[#FAFAFA] mb-3">Coaches próximamente</h2>
            <p className="text-[#8A8A8A]">Estamos incorporando los primeros coaches verificados.</p>
            <Link href="/" className="mt-6 inline-block px-6 py-3 bg-[#C8FF00] text-black font-bold rounded-xl hover:bg-[#b8ef00] transition-colors">
              Volver al inicio
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coachList.map((coach) => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
