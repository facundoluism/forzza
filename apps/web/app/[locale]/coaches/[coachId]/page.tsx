import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

interface CoachPackage {
  id: string;
  /** title is the real column in coach_packages */
  title: string;
  description: string | null;
  /** price in centavos/enteros */
  price: number;
  tier: "starter" | "pro" | "elite";
  active: boolean;
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
  params: Promise<{ locale: string; coachId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, coachId } = await params;
  const t = await getTranslations({ locale, namespace: "marketplace" });

  if (!isSupabaseConfigured()) {
    return { title: t("coachMetaTitle") };
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("coach_profiles")
      .select("display_name, bio")
      .eq("id", coachId)
      .eq("status", "approved")
      .single();

    if (!data) {
      return { title: t("coachMetaNotFound") };
    }

    return {
      title: t("coachMetaTitleNamed", { name: data.display_name }),
      description: data.bio ?? t("coachMetaDescription", { name: data.display_name }),
    };
  } catch {
    return { title: t("coachMetaTitle") };
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function CoachProfilePage({ params }: PageProps) {
  const { locale, coachId } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations({ locale, namespace: "marketplace" });

  if (!isSupabaseConfigured()) {
    notFound();
  }

  let coachData: CoachProfile;
  try {
    const supabase = await createClient();
    // TODO: regenerar db-types para eliminar el cast
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: coach } = await (supabase as any)
      .from("coach_profiles")
      .select(
        "id, display_name, bio, specialties, avatar_url, years_experience, packages:coach_packages(id, title, description, price, tier, active)"
      )
      .eq("id", coachId)
      .eq("status", "approved")
      .single();

    if (!coach) {
      notFound();
    }
    coachData = coach as unknown as CoachProfile;
  } catch {
    notFound();
  }

  const activePackages = coachData.packages.filter((p) => p.active);
  const initials = getInitials(coachData.display_name);

  return (
    <main className="bg-bg min-h-screen text-[#FAFAFA]">
      <div className="max-w-[800px] mx-auto px-6 py-16">
        {/* Back link */}
        <Link href="/coaches" className="text-muted text-sm hover:text-[#FAFAFA] transition-colors">
          {t("backToCoaches")}
        </Link>

        {/* Hero */}
        <div className="flex flex-col items-center text-center gap-4 pt-8 pb-8">
          {coachData.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coachData.avatar_url}
              alt={coachData.display_name}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#3A3A3A] flex items-center justify-center text-3xl font-black text-[#C8FF00] tracking-wide">
              {initials}
            </div>
          )}

          <h1 className="text-[clamp(28px,4vw,48px)] font-black text-[#FAFAFA] m-0 tracking-tight">
            {coachData.display_name}
          </h1>

          {coachData.years_experience !== null && (
            <p className="text-muted text-[15px] m-0">
              {t("experience", { count: coachData.years_experience })}
            </p>
          )}

          {coachData.specialties.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {coachData.specialties.map((s) => (
                <span
                  key={s}
                  className="bg-[#2A2A2A] text-muted rounded-full px-3 py-1 text-[13px] font-semibold"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bio */}
        {coachData.bio && (
          <section className="mb-10">
            <h2 className="text-muted text-xs font-bold uppercase tracking-[2px] mb-3">
              {t("aboutCoach")}
            </h2>
            <p className="text-muted text-base leading-[1.7] m-0">
              {coachData.bio}
            </p>
          </section>
        )}

        {/* Packages */}
        <section>
          <h2 className="text-muted text-xs font-bold uppercase tracking-[2px] mb-4">
            {t("packages")}
          </h2>

          {activePackages.length === 0 ? (
            <div className="bg-[#111111] rounded-xl border border-[#2A2A2A] p-6 text-center text-muted text-[15px]">
              {t("noPackages")}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {activePackages.map((pkg) => {
                const price = (pkg.price / 100).toLocaleString("es-AR");

                return (
                  <div
                    key={pkg.id}
                    className="bg-[#111111] rounded-2xl border border-[#2A2A2A] p-6 flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-start flex-wrap gap-3">
                      <h3 className="text-[#FAFAFA] text-[22px] font-extrabold m-0 tracking-tight">
                        {pkg.title}
                      </h3>
                      <div className="text-right">
                        <span className="text-[#C8FF00] font-bold text-[22px] font-mono">
                          ${price}
                        </span>
                        <span className="text-muted text-[13px]">
                          {"/" + t("pricePerMonth", { price: "" }).split("/")[1]}
                        </span>
                      </div>
                    </div>

                    {pkg.description && (
                      <p className="text-muted text-sm leading-relaxed m-0">
                        {pkg.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <Link
                        href={`/coaches/${coachData.id}/checkout?package_id=${pkg.id}`}
                        className="inline-block bg-[#C8FF00] text-black rounded-lg px-6 py-3 font-bold text-[15px] hover:bg-[#b8ef00] transition-colors"
                      >
                        {t("hire")}
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
