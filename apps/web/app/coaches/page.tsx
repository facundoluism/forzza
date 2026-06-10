import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { colors, spacing } from "@forzza/ui";

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

function CoachCard({ coach }: { coach: Coach }) {
  const minPrice = cheapestPrice(coach.packages);
  const bioSnippet = coach.bio
    ? coach.bio.length > 120
      ? coach.bio.slice(0, 117) + "..."
      : coach.bio
    : null;

  return (
    <Link
      href={`/coaches/${coach.id}`}
      style={{ textDecoration: "none" }}
    >
      <div
        style={{
          backgroundColor: colors.gray900,
          borderRadius: "16px",
          border: `1px solid ${colors.gray800}`,
          padding: `${spacing[6]}px`,
          display: "flex",
          flexDirection: "column",
          gap: `${spacing[3]}px`,
          cursor: "pointer",
          transition: "border-color 0.15s",
          height: "100%",
        }}
      >
        {/* Avatar + name */}
        <div style={{ display: "flex", alignItems: "center", gap: `${spacing[3]}px` }}>
          {coach.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coach.avatar_url}
              alt={coach.display_name}
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: colors.gray700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: "900",
                color: colors.lime,
                letterSpacing: "1px",
                flexShrink: 0,
              }}
            >
              {getInitials(coach.display_name)}
            </div>
          )}
          <div>
            <h3
              style={{
                color: colors.white,
                fontSize: "20px",
                fontWeight: "800",
                margin: 0,
                letterSpacing: "-0.5px",
              }}
            >
              {coach.display_name}
            </h3>
            {coach.years_experience !== null && (
              <p style={{ color: colors.gray400, fontSize: "13px", margin: 0 }}>
                {coach.years_experience}{" "}
                {coach.years_experience === 1 ? "año" : "años"} de experiencia
              </p>
            )}
          </div>
        </div>

        {/* Specialties */}
        {coach.specialties.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: `${spacing[1]}px` }}>
            {coach.specialties.slice(0, 3).map((s) => (
              <span
                key={s}
                style={{
                  backgroundColor: colors.gray800,
                  color: colors.gray300,
                  borderRadius: "9999px",
                  padding: `${spacing[1]}px ${spacing[3]}px`,
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Bio snippet */}
        {bioSnippet && (
          <p
            style={{
              color: colors.gray400,
              fontSize: "14px",
              lineHeight: "1.6",
              margin: 0,
              flex: 1,
            }}
          >
            {bioSnippet}
          </p>
        )}

        {/* Price */}
        {minPrice !== null && (
          <p style={{ color: colors.gray500, fontSize: "13px", margin: 0 }}>
            Desde{" "}
            <span
              style={{
                color: colors.lime,
                fontWeight: "700",
                fontFamily: "monospace",
                fontSize: "16px",
              }}
            >
              ${(minPrice / 100).toLocaleString("es-AR")}
            </span>
            {"/mes"}
          </p>
        )}

        {/* CTA */}
        <div
          style={{
            display: "inline-block",
            backgroundColor: colors.lime,
            color: colors.black,
            borderRadius: "8px",
            padding: `${spacing[2]}px ${spacing[4]}px`,
            fontWeight: "700",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          Ver perfil
        </div>
      </div>
    </Link>
  );
}

export default async function CoachesPage() {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: coaches } = await (supabase as any)
    .from("coach_profiles")
    .select(
      "id, display_name, bio, specialties, avatar_url, years_experience, packages:coach_packages(id, price_cents, billing_type)"
    )
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  const coachList = (coaches ?? []) as Coach[];

  return (
    <main style={{ backgroundColor: colors.black, minHeight: "100vh" }}>
      {/* Header */}
      <section
        style={{
          padding: `${spacing[16]}px ${spacing[6]}px ${spacing[8]}px`,
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Link href="/" style={{ color: colors.gray500, fontSize: "14px", textDecoration: "none" }}>
          {"← Volver al inicio"}
        </Link>
        <h1
          style={{
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: "900",
            color: colors.white,
            marginTop: `${spacing[4]}px`,
            marginBottom: `${spacing[2]}px`,
            letterSpacing: "-1px",
          }}
        >
          Coaches verificados
        </h1>
        <p style={{ color: colors.gray400, fontSize: "18px", maxWidth: "600px" }}>
          Todos nuestros coaches pasan por un proceso de validación. Encontrá al que mejor se adapte a tus objetivos.
        </p>
      </section>

      {/* Grid */}
      <section
        style={{
          padding: `0 ${spacing[6]}px ${spacing[16]}px`,
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {coachList.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: `${spacing[16]}px`,
              color: colors.gray500,
              fontSize: "16px",
            }}
          >
            No hay coaches disponibles todavía. Volvé pronto.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: `${spacing[6]}px`,
            }}
          >
            {coachList.map((coach) => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
