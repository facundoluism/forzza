import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { PRO_FEATURES } from "@/lib/plans";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Locale } from "@/i18n/routing";
import { quoteOfTheDay, quoteText } from "@forzza/core";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing.metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations({ locale, namespace: "landing" });

  // Fetch PRO price from country_config. Falls back to 999900 cents (AR default) if DB not available.
  let proPrice = 999900;
  let currencySymbol = "$";
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: config } = await supabase
        .from("country_config")
        .select("pro_monthly_price_cents, currency_symbol")
        .eq("country", "AR")
        .single();
      if (config) {
        proPrice = config.pro_monthly_price_cents ?? 999900;
        currencySymbol = config.currency_symbol ?? "$";
      }
    } catch {
      // Fallback values already set above
    }
  }
  const proPriceFormatted = `${currencySymbol}${(proPrice / 100).toLocaleString("es-AR")}`;

  const features = [
    { icon: "⚡", key: "routines" as const },
    { icon: "📈", key: "progress" as const },
    { icon: "💬", key: "chat" as const },
    { icon: "🔐", key: "payments" as const },
    { icon: "📱", key: "offline" as const },
    { icon: "✅", key: "trust" as const },
  ];

  const steps = ["step1", "step2", "step3"] as const;

  // Frase motivacional del día — determinística por epoch day, pura (sin deps).
  const epochDay = Math.floor(Date.now() / 86400000);
  const quote = quoteOfTheDay(epochDay);
  const quoteLang = (locale === "en" ? "en" : "es") as "es" | "en";
  const quoteDisplayText = quoteText(quote, quoteLang);
  const tLanding = await getTranslations({ locale, namespace: "landing.quote" });

  return (
    <main
      style={{
        background: "var(--color-bg)",
        minHeight: "100vh",
        color: "var(--color-text)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* NAV */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          borderBottom: "1px solid var(--color-border)",
          position: "sticky",
          top: 0,
          background: "rgba(10,10,10,0.92)",
          backdropFilter: "blur(12px)",
          zIndex: 50,
        }}
      >
        <span
          style={{
            color: "var(--color-lime)",
            fontSize: "24px",
            fontWeight: 800,
            letterSpacing: "6px",
            fontFamily: "var(--font-display)",
          }}
        >
          FORZZA
        </span>
        <div
          className="nav-mobile"
          style={{ display: "flex", gap: "12px", alignItems: "center" }}
        >
          <Link
            href="/coaches"
            className="hide-mobile"
            style={{
              color: "var(--color-muted)",
              fontSize: "14px",
              padding: "8px 12px",
              textDecoration: "none",
              transition: "color 200ms",
            }}
          >
            {t("nav.coaches")}
          </Link>
          <Link
            href="/ingresar"
            className="btn-outline hide-mobile"
            style={{
              fontSize: "14px",
              padding: "8px 16px",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              color: "var(--color-text)",
              textDecoration: "none",
            }}
          >
            {t("nav.login")}
          </Link>
          <Link
            href="/ingresar"
            className="btn-lime"
            style={{
              fontSize: "14px",
              padding: "8px 20px",
              background: "var(--color-lime)",
              borderRadius: "8px",
              color: "#000",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            {t("nav.cta")}
          </Link>
          <LanguageSwitcher />
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          padding: "80px 24px 60px",
          textAlign: "center",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(200,255,0,0.1)",
            border: "1px solid rgba(200,255,0,0.3)",
            borderRadius: "999px",
            padding: "4px 12px 4px 4px",
            marginBottom: "32px",
          }}
        >
          <span
            style={{
              background: "var(--color-lime)",
              color: "#000",
              fontSize: "10px",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "999px",
              letterSpacing: "1px",
            }}
          >
            {t("hero.badge")}
          </span>
          <span
            style={{
              color: "var(--color-lime)",
              fontSize: "13px",
              fontFamily: "var(--font-mono)",
            }}
          >
            {t("hero.badgeLabel")}
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(64px, 12vw, 120px)",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "2px",
            color: "var(--color-lime)",
            margin: "0 0 24px",
            fontFamily: "var(--font-display)",
            textShadow: "0 0 60px rgba(200,255,0,0.2)",
          }}
        >
          {t("hero.headline")}
        </h1>
        <p
          style={{
            fontSize: "clamp(22px, 3.5vw, 32px)",
            color: "var(--color-text)",
            marginBottom: "16px",
            lineHeight: 1.3,
            fontWeight: 600,
          }}
        >
          {t("hero.subheadline")}
        </p>
        <p
          style={{
            fontSize: "18px",
            color: "var(--color-muted)",
            marginBottom: "40px",
            maxWidth: "560px",
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          {t("hero.body")}
        </p>
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          <Link
            href="/ingresar"
            className="btn-lime"
            style={{
              padding: "16px 36px",
              background: "var(--color-lime)",
              borderRadius: "12px",
              color: "#000",
              fontWeight: 700,
              fontSize: "18px",
              textDecoration: "none",
              boxShadow: "0 0 24px rgba(200,255,0,0.35)",
            }}
          >
            {t("hero.ctaPrimary")}
          </Link>
          <Link
            href="/coaches"
            className="btn-outline"
            style={{
              padding: "16px 36px",
              border: "2px solid rgba(255,255,255,0.15)",
              borderRadius: "12px",
              color: "var(--color-text)",
              fontWeight: 700,
              fontSize: "18px",
              textDecoration: "none",
            }}
          >
            {t("hero.ctaSecondary")}
          </Link>
        </div>
        <p
          style={{
            color: "var(--color-muted)",
            fontSize: "13px",
            fontFamily: "var(--font-mono)",
          }}
        >
          {t("hero.disclaimer")}
        </p>
      </section>

      {/* QUOTE MOTIVACIONAL */}
      <section
        style={{
          padding: "0 24px 64px",
          maxWidth: "720px",
          margin: "0 auto",
        }}
      >
        <figure
          style={{
            margin: 0,
            padding: "28px 32px",
            background: "var(--color-surface)",
            borderRadius: "16px",
            border: "1px solid var(--color-border)",
            borderLeft: "3px solid var(--color-lime)",
            position: "relative",
          }}
        >
          {/* Comilla decorativa */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "12px",
              left: "20px",
              fontSize: "48px",
              lineHeight: 1,
              color: "var(--color-lime)",
              opacity: 0.25,
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              userSelect: "none",
            }}
          >
            &ldquo;
          </span>
          <blockquote
            style={{
              margin: "0 0 12px",
              paddingLeft: "8px",
              fontStyle: "italic",
              fontSize: "clamp(16px, 2.2vw, 20px)",
              lineHeight: 1.6,
              color: "var(--color-text)",
              fontFamily: "var(--font-body)",
            }}
          >
            {quoteDisplayText}
          </blockquote>
          <figcaption
            style={{
              paddingLeft: "8px",
              fontSize: "13px",
              fontFamily: "var(--font-mono)",
              color: "var(--color-lime)",
              letterSpacing: "0.5px",
            }}
          >
            &mdash; {quote.author}
            <span style={{ color: "var(--color-muted)", marginLeft: "6px" }}>
              &middot; {quote.sport}
            </span>
            {!quote.verified && (
              <span
                title={tLanding("unverifiedNote")}
                style={{
                  marginLeft: "8px",
                  color: "var(--color-muted)",
                  fontSize: "11px",
                  opacity: 0.6,
                }}
              >
                *
              </span>
            )}
          </figcaption>
        </figure>
      </section>

      {/* STATS STRIP */}
      <section
        style={{
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
          padding: "24px 16px",
          display: "flex",
          justifyContent: "center",
          gap: "clamp(24px, 6vw, 64px)",
          flexWrap: "wrap",
        }}
      >
        {(
          [
            ["72h", t("stats.guarantee")],
            ["20%", t("stats.commission")],
            ["100%", t("stats.verified")],
          ] as [string, string][]
        ).map(([n, l]) => (
          <div key={n} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "36px",
                fontWeight: 800,
                color: "var(--color-lime)",
                fontFamily: "var(--font-display)",
                lineHeight: 1,
                letterSpacing: "1px",
              }}
            >
              {n}
            </div>
            <div
              style={{
                color: "var(--color-muted)",
                fontSize: "13px",
                marginTop: "4px",
                fontFamily: "var(--font-mono)",
              }}
            >
              {l}
            </div>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section
        style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}
      >
        <h2
          style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "12px",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.5px",
          }}
        >
          {t("features.headline")}
        </h2>
        <p
          style={{
            color: "var(--color-muted)",
            textAlign: "center",
            marginBottom: "48px",
            fontSize: "17px",
          }}
        >
          {t("features.subheadline")}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: "20px",
          }}
        >
          {features.map((f) => (
            <div
              key={f.key}
              className="card-hover"
              style={{
                padding: "28px",
                background: "var(--color-surface)",
                borderRadius: "16px",
                border: "1px solid var(--color-border)",
                cursor: "default",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                }}
              >
                <span style={{ fontSize: "36px" }}>{f.icon}</span>
                <span
                  style={{
                    fontSize: "10px",
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-lime)",
                    background: "rgba(200,255,0,0.1)",
                    border: "1px solid rgba(200,255,0,0.2)",
                    borderRadius: "4px",
                    padding: "2px 8px",
                    letterSpacing: "1px",
                  }}
                >
                  {t(`features.items.${f.key}.tag`)}
                </span>
              </div>
              <h3
                style={{
                  color: "var(--color-text)",
                  fontWeight: 700,
                  fontSize: "18px",
                  marginBottom: "8px",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.5px",
                }}
              >
                {t(`features.items.${f.key}.title`)}
              </h3>
              <p
                style={{
                  color: "var(--color-muted)",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {t(`features.items.${f.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "80px 24px", background: "var(--color-bg)" }}>
        <div
          style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}
        >
          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 700,
              marginBottom: "56px",
              fontFamily: "var(--font-display)",
            }}
          >
            {t("howItWorks.headline")}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
              gap: "40px",
            }}
          >
            {steps.map((step, i) => (
              <div key={step} style={{ position: "relative" }}>
                <div
                  style={{
                    fontSize: "72px",
                    fontWeight: 800,
                    color: "rgba(200,255,0,0.15)",
                    fontFamily: "var(--font-display)",
                    lineHeight: 1,
                    marginBottom: "16px",
                    letterSpacing: "2px",
                    textShadow: "0 0 30px rgba(200,255,0,0.1)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3
                  style={{
                    color: "var(--color-text)",
                    fontWeight: 700,
                    fontSize: "20px",
                    marginBottom: "8px",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {t(`howItWorks.steps.${step}.title`)}
                </h3>
                <p
                  style={{
                    color: "var(--color-muted)",
                    fontSize: "14px",
                    lineHeight: 1.6,
                  }}
                >
                  {t(`howItWorks.steps.${step}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        style={{ padding: "80px 24px", maxWidth: "860px", margin: "0 auto" }}
      >
        <h2
          style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "12px",
            fontFamily: "var(--font-display)",
          }}
        >
          {t("pricing.headline")}
        </h2>
        <p
          style={{
            color: "var(--color-muted)",
            textAlign: "center",
            marginBottom: "48px",
          }}
        >
          {t("pricing.subheadline")}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: "24px",
          }}
        >
          {/* Free */}
          <div
            style={{
              padding: "36px",
              background: "var(--color-surface)",
              borderRadius: "20px",
              border: "1px solid var(--color-border)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                letterSpacing: "3px",
                color: "#6A6A6A",
                marginBottom: "16px",
              }}
            >
              {t("pricing.free.label")}
            </div>
            <div
              style={{
                fontSize: "64px",
                fontWeight: 800,
                color: "var(--color-text)",
                fontFamily: "var(--font-display)",
                lineHeight: 1,
                letterSpacing: "1px",
                marginBottom: "4px",
              }}
            >
              {t("pricing.free.price")}
            </div>
            <div
              style={{
                color: "var(--color-muted)",
                fontSize: "14px",
                marginBottom: "28px",
                fontFamily: "var(--font-mono)",
              }}
            >
              {t("pricing.free.period")}
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 32px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                flex: 1,
              }}
            >
              {(
                t.raw("pricing.free.features") as string[]
              ).map((f: string) => (
                <li
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    color: "var(--color-muted)",
                    fontSize: "15px",
                  }}
                >
                  <span style={{ color: "#4A4A4A", fontSize: "16px" }}>○</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/ingresar"
              className="btn-outline"
              style={{
                display: "block",
                textAlign: "center",
                padding: "14px",
                border: "2px solid rgba(255,255,255,0.12)",
                borderRadius: "12px",
                color: "var(--color-text)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              {t("pricing.free.cta")}
            </Link>
          </div>

          {/* PRO */}
          <div
            style={{
              padding: "36px",
              background: "var(--color-surface)",
              borderRadius: "20px",
              border: "2px solid var(--color-lime)",
              position: "relative",
              boxShadow: "0 0 40px rgba(200,255,0,0.1)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Top highlight strip */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "20px",
                right: "20px",
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent, var(--color-lime), transparent)",
                borderRadius: "2px",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "-14px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "var(--color-lime)",
                color: "#000",
                padding: "4px 14px",
                borderRadius: "999px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "1px",
                fontFamily: "var(--font-mono)",
                whiteSpace: "nowrap",
              }}
            >
              {t("pricing.pro.badge")}
            </div>
            <div
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                letterSpacing: "3px",
                color: "var(--color-lime)",
                marginBottom: "16px",
              }}
            >
              {t("pricing.pro.label")}
            </div>
            <div
              style={{
                fontSize: "64px",
                fontWeight: 800,
                color: "var(--color-text)",
                fontFamily: "var(--font-display)",
                lineHeight: 1,
                letterSpacing: "1px",
                marginBottom: "4px",
              }}
            >
              {proPriceFormatted}
            </div>
            <div
              style={{
                color: "var(--color-muted)",
                fontSize: "14px",
                marginBottom: "28px",
                fontFamily: "var(--font-mono)",
              }}
            >
              {t("pricing.pro.period")}
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 32px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                flex: 1,
              }}
            >
              {PRO_FEATURES.map((f) => (
                <li
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    color: "var(--color-muted)",
                    fontSize: "15px",
                  }}
                >
                  <span style={{ color: "var(--color-lime)", fontSize: "16px" }}>
                    ●
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/upgrade"
              className="btn-lime"
              style={{
                display: "block",
                textAlign: "center",
                padding: "14px",
                background: "var(--color-lime)",
                borderRadius: "12px",
                color: "#000",
                fontWeight: 700,
                fontSize: "16px",
                textDecoration: "none",
                boxShadow: "0 0 20px rgba(200,255,0,0.3)",
              }}
            >
              {t("pricing.pro.cta")}
            </Link>
          </div>
        </div>
      </section>

      {/* COACH CTA */}
      <section style={{ padding: "80px 24px", background: "var(--color-bg)" }}>
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            textAlign: "center",
            padding: "clamp(32px, 5vw, 56px) clamp(20px, 4vw, 40px)",
            background: "var(--color-surface)",
            borderRadius: "24px",
            border: "1px solid var(--color-border)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Corner accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "120px",
              height: "120px",
              background:
                "radial-gradient(circle at top right, rgba(200,255,0,0.15), transparent 70%)",
            }}
          />
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏋️</div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 700,
              marginBottom: "16px",
              fontFamily: "var(--font-display)",
            }}
          >
            {t("coachCta.headline")}
          </h2>
          <p
            style={{
              color: "var(--color-muted)",
              fontSize: "17px",
              marginBottom: "32px",
              lineHeight: 1.7,
              whiteSpace: "pre-line",
            }}
          >
            {t("coachCta.body")}
          </p>
          <Link
            href="/onboarding-coach"
            className="btn-lime"
            style={{
              display: "inline-block",
              padding: "16px 36px",
              background: "var(--color-lime)",
              borderRadius: "12px",
              color: "#000",
              fontWeight: 700,
              fontSize: "18px",
              textDecoration: "none",
              boxShadow: "0 0 20px rgba(200,255,0,0.3)",
            }}
          >
            {t("coachCta.cta")}
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--color-border)", padding: "40px 24px" }}>
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            textAlign: "center",
          }}
        >
          <span
            style={{
              color: "var(--color-lime)",
              fontSize: "20px",
              fontWeight: 800,
              letterSpacing: "6px",
              fontFamily: "var(--font-display)",
            }}
          >
            FORZZA
          </span>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>
            {(
              [
                ["footer.links.coaches", "/coaches"],
                ["footer.links.plans", "/upgrade"],
                ["footer.links.terms", "/legales/terminos"],
                ["footer.links.privacy", "/legales/privacidad"],
              ] as [string, string][]
            ).map(([key, href]) => (
              <Link
                key={key}
                href={href as "/coaches" | "/upgrade" | "/legales/terminos" | "/legales/privacidad"}
                style={{
                  color: "var(--color-muted)",
                  fontSize: "14px",
                  textDecoration: "none",
                }}
              >
                {t(key as Parameters<typeof t>[0])}
              </Link>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <p
              style={{
                color: "var(--color-muted)",
                fontSize: "13px",
                fontFamily: "var(--font-mono)",
                margin: 0,
              }}
            >
              {t("footer.copy")}
            </p>
            <LanguageSwitcher />
          </div>
        </div>
      </footer>
    </main>
  );
}
