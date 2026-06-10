import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { colors, spacing } from "@forzza/ui";

interface CoachPackage {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  billing_type: "mensual" | "paquete";
  features: string[];
  is_active: boolean;
}

interface CoachProfile {
  id: string;
  display_name: string;
  bio: string | null;
  specialties: string[];
  avatar_url: string | null;
  years_experience: number | null;
  packages: CoachPackage[];
}

interface PageProps {
  params: Promise<{ coachId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { coachId } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("coach_profiles")
    .select("display_name, bio")
    .eq("id", coachId)
    .eq("status", "approved")
    .single();

  if (!data) {
    return { title: "Coach no encontrado — Forzza" };
  }

  return {
    title: `${data.display_name} — Coach en Forzza`,
    description: data.bio ?? `Contratá a ${data.display_name} como tu coach personal en Forzza.`,
  };
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function CoachProfilePage({ params }: PageProps) {
  const { coachId } = await params;
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: coach } = await (supabase as any)
    .from("coach_profiles")
    .select(
      "id, display_name, bio, specialties, avatar_url, years_experience, packages:coach_packages(id, name, description, price_cents, billing_type, features, is_active)"
    )
    .eq("id", coachId)
    .eq("status", "approved")
    .single();

  if (!coach) {
    notFound();
  }

  const coachData = coach as unknown as CoachProfile;
  const activePackages = coachData.packages.filter((p) => p.is_active);
  const initials = getInitials(coachData.display_name);

  return (
    <main style={{ backgroundColor: colors.black, minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: `${spacing[16]}px ${spacing[6]}px ${spacing[16]}px`,
        }}
      >
        {/* Back link */}
        <Link
          href="/coaches"
          style={{ color: colors.gray500, fontSize: "14px", textDecoration: "none" }}
        >
          {"← Todos los coaches"}
        </Link>

        {/* Hero */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: `${spacing[4]}px`,
            paddingTop: `${spacing[8]}px`,
            paddingBottom: `${spacing[8]}px`,
          }}
        >
          {coachData.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coachData.avatar_url}
              alt={coachData.display_name}
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "50%",
                backgroundColor: colors.gray700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: "900",
                color: colors.lime,
                letterSpacing: "2px",
              }}
            >
              {initials}
            </div>
          )}

          <h1
            style={{
              color: colors.white,
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: "900",
              margin: 0,
              letterSpacing: "-1px",
            }}
          >
            {coachData.display_name}
          </h1>

          {coachData.years_experience !== null && (
            <p style={{ color: colors.gray400, fontSize: "15px", margin: 0 }}>
              {coachData.years_experience}{" "}
              {coachData.years_experience === 1 ? "año" : "años"} de experiencia
            </p>
          )}

          {coachData.specialties.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: `${spacing[2]}px`, justifyContent: "center" }}>
              {coachData.specialties.map((s) => (
                <span
                  key={s}
                  style={{
                    backgroundColor: colors.gray800,
                    color: colors.gray300,
                    borderRadius: "9999px",
                    padding: `${spacing[1]}px ${spacing[3]}px`,
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bio */}
        {coachData.bio && (
          <section style={{ marginBottom: `${spacing[10]}px` }}>
            <h2
              style={{
                color: colors.gray300,
                fontSize: "12px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: `${spacing[3]}px`,
              }}
            >
              Sobre el coach
            </h2>
            <p
              style={{
                color: colors.gray300,
                fontSize: "16px",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {coachData.bio}
            </p>
          </section>
        )}

        {/* Packages */}
        <section>
          <h2
            style={{
              color: colors.gray300,
              fontSize: "12px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: `${spacing[4]}px`,
            }}
          >
            Paquetes disponibles
          </h2>

          {activePackages.length === 0 ? (
            <div
              style={{
                backgroundColor: colors.gray900,
                borderRadius: "12px",
                border: `1px solid ${colors.gray800}`,
                padding: `${spacing[6]}px`,
                textAlign: "center",
                color: colors.gray500,
                fontSize: "15px",
              }}
            >
              Este coach no tiene paquetes publicados todavía.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: `${spacing[4]}px` }}>
              {activePackages.map((pkg) => {
                const price = (pkg.price_cents / 100).toLocaleString("es-AR");
                const billingLabel =
                  pkg.billing_type === "mensual" ? "/mes" : " (paquete único)";

                return (
                  <div
                    key={pkg.id}
                    style={{
                      backgroundColor: colors.gray900,
                      borderRadius: "16px",
                      border: `1px solid ${colors.gray800}`,
                      padding: `${spacing[6]}px`,
                      display: "flex",
                      flexDirection: "column",
                      gap: `${spacing[3]}px`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: `${spacing[3]}px`,
                      }}
                    >
                      <h3
                        style={{
                          color: colors.white,
                          fontSize: "22px",
                          fontWeight: "800",
                          margin: 0,
                          letterSpacing: "-0.5px",
                        }}
                      >
                        {pkg.name}
                      </h3>
                      <div style={{ textAlign: "right" }}>
                        <span
                          style={{
                            color: colors.lime,
                            fontWeight: "700",
                            fontSize: "22px",
                            fontFamily: "monospace",
                          }}
                        >
                          ${price}
                        </span>
                        <span style={{ color: colors.gray500, fontSize: "13px" }}>
                          {billingLabel}
                        </span>
                      </div>
                    </div>

                    {pkg.description && (
                      <p
                        style={{
                          color: colors.gray400,
                          fontSize: "14px",
                          lineHeight: "1.6",
                          margin: 0,
                        }}
                      >
                        {pkg.description}
                      </p>
                    )}

                    {pkg.features.length > 0 && (
                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: 0,
                          display: "flex",
                          flexDirection: "column",
                          gap: `${spacing[1]}px`,
                        }}
                      >
                        {pkg.features.map((feat, idx) => (
                          <li
                            key={idx}
                            style={{
                              color: colors.gray300,
                              fontSize: "14px",
                              paddingLeft: "20px",
                              position: "relative",
                            }}
                          >
                            <span
                              style={{
                                position: "absolute",
                                left: 0,
                                color: colors.lime,
                              }}
                            >
                              {"•"}
                            </span>
                            {feat}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* CTA — placeholder for V1: redirect to app */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: `${spacing[3]}px`,
                        marginTop: `${spacing[2]}px`,
                        flexWrap: "wrap",
                      }}
                    >
                      <Link
                        href={`/coaches/${coachData.id}/checkout?package_id=${pkg.id}`}
                        style={{
                          display: "inline-block",
                          backgroundColor: colors.lime,
                          color: colors.black,
                          borderRadius: "8px",
                          padding: `${spacing[3]}px ${spacing[6]}px`,
                          fontWeight: "700",
                          fontSize: "15px",
                          textDecoration: "none",
                        }}
                      >
                        Contratar
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
