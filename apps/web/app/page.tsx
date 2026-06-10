import { colors, spacing } from "@forzza/ui";

export const metadata = {
  title: "Forzza — Tu plataforma de entrenamiento personalizado",
  description: "Entrená con el coach correcto. Rutinas, seguimiento y resultados reales.",
};

export default function HomePage() {
  return (
    <main style={{ backgroundColor: colors.black, minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{
        padding: `${spacing[20]}px ${spacing[6]}px`,
        textAlign: "center",
        maxWidth: "800px",
        margin: "0 auto",
      }}>
        <h1 style={{
          fontSize: "clamp(48px, 8vw, 96px)",
          fontWeight: "900",
          color: colors.lime,
          lineHeight: 1,
          marginBottom: `${spacing[4]}px`,
          letterSpacing: "-2px",
          fontFamily: "system-ui, sans-serif",
        }}>
          FORZZA
        </h1>
        <p style={{
          fontSize: "clamp(20px, 3vw, 28px)",
          color: colors.white,
          marginBottom: `${spacing[4]}px`,
          lineHeight: 1.4,
        }}>
          Entrenamiento personalizado que realmente funciona.
        </p>
        <p style={{
          fontSize: "18px",
          color: colors.gray400,
          marginBottom: `${spacing[10]}px`,
          lineHeight: 1.6,
        }}>
          Conectamos alumnos con coaches certificados. Rutinas, check-ins, seguimiento de progreso
          y pagos, todo en un solo lugar.
        </p>
        <div style={{ display: "flex", gap: `${spacing[4]}px`, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="/auth/login"
            style={{
              display: "inline-block",
              padding: `${spacing[4]}px ${spacing[8]}px`,
              backgroundColor: colors.lime,
              color: colors.black,
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "18px",
              textDecoration: "none",
            }}
          >
            Empezar gratis
          </a>
          <a
            href="#coaches"
            style={{
              display: "inline-block",
              padding: `${spacing[4]}px ${spacing[8]}px`,
              border: `2px solid ${colors.gray700}`,
              color: colors.white,
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "18px",
              textDecoration: "none",
            }}
          >
            Ver coaches
          </a>
        </div>
      </section>

      {/* Features */}
      <section style={{
        padding: `${spacing[16]}px ${spacing[6]}px`,
        maxWidth: "1100px",
        margin: "0 auto",
      }}>
        <h2 style={{ color: colors.white, fontSize: "36px", textAlign: "center", marginBottom: `${spacing[10]}px` }}>
          Todo lo que necesitás para entrenar mejor
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: `${spacing[6]}px` }}>
          {[
            { icon: "🏋️", title: "Rutinas personalizadas", desc: "Tu coach crea rutinas según tus objetivos y nivel. Vos la seguís con guía paso a paso." },
            { icon: "📊", title: "Progreso visible", desc: "Registrá tus entrenamientos, pesaje y fotos de progreso. Ves la evolución real." },
            { icon: "💬", title: "Chat directo con tu coach", desc: "Preguntás, corregís la técnica y recibís feedback en tiempo real." },
            { icon: "🔒", title: "Pagos seguros", desc: "Pagás directamente por Mercado Pago. El coach recibe su pago cuando cumple." },
            { icon: "📱", title: "Desde el celular", desc: "App para iOS y Android. Entrená sin conexión, sync automático cuando volvés." },
            { icon: "⭐", title: "Coaches verificados", desc: "Todos los coaches pasan por un proceso de validación. Constancia real." },
          ].map((feature) => (
            <div
              key={feature.title}
              style={{
                padding: `${spacing[6]}px`,
                backgroundColor: colors.gray900,
                borderRadius: "12px",
                border: `1px solid ${colors.gray800}`,
              }}
            >
              <p style={{ fontSize: "40px", marginBottom: `${spacing[3]}px` }}>{feature.icon}</p>
              <h3 style={{ color: colors.white, marginBottom: `${spacing[2]}px`, fontSize: "18px" }}>
                {feature.title}
              </h3>
              <p style={{ color: colors.gray400, fontSize: "15px", lineHeight: "1.6" }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Precios */}
      <section id="pricing" style={{
        padding: `${spacing[16]}px ${spacing[6]}px`,
        maxWidth: "900px",
        margin: "0 auto",
        textAlign: "center",
      }}>
        <h2 style={{ color: colors.white, fontSize: "36px", marginBottom: `${spacing[4]}px` }}>
          Planes para alumnos
        </h2>
        <p style={{ color: colors.gray400, marginBottom: `${spacing[10]}px`, fontSize: "16px" }}>
          Empezás gratis. Cuando querés más, pasás a PRO.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: `${spacing[6]}px` }}>
          {/* Plan Free */}
          <div style={{
            padding: `${spacing[8]}px`,
            backgroundColor: colors.gray900,
            borderRadius: "16px",
            border: `1px solid ${colors.gray700}`,
          }}>
            <h3 style={{ color: colors.gray300, fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: `${spacing[2]}px` }}>
              FREE
            </h3>
            <p style={{ fontSize: "48px", fontWeight: "900", color: colors.white, marginBottom: `${spacing[1]}px` }}>$0</p>
            <p style={{ color: colors.gray500, fontSize: "14px", marginBottom: `${spacing[6]}px` }}>Para siempre</p>
            <ul style={{ textAlign: "left", listStyle: "none", padding: 0, marginBottom: `${spacing[8]}px` }}>
              {[
                "3 rutinas activas",
                "Historial últimos 10 días",
                "Registro de entrenamientos",
                "Acceso al marketplace de coaches",
              ].map((item) => (
                <li key={item} style={{ color: colors.gray300, marginBottom: `${spacing[2]}px`, paddingLeft: "24px", position: "relative" }}>
                  <span style={{ position: "absolute", left: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="/auth/login"
              style={{
                display: "block",
                padding: `${spacing[3]}px`,
                border: `2px solid ${colors.gray700}`,
                color: colors.white,
                borderRadius: "8px",
                fontWeight: "700",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Empezar gratis
            </a>
          </div>

          {/* Plan PRO */}
          <div style={{
            padding: `${spacing[8]}px`,
            backgroundColor: colors.gray900,
            borderRadius: "16px",
            border: `2px solid ${colors.lime}`,
            position: "relative",
          }}>
            <div style={{
              position: "absolute",
              top: "-14px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: colors.lime,
              color: colors.black,
              padding: `${spacing[1]}px ${spacing[3]}px`,
              borderRadius: "99px",
              fontSize: "12px",
              fontWeight: "700",
            }}>
              RECOMENDADO
            </div>
            <h3 style={{ color: colors.lime, fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: `${spacing[2]}px` }}>
              PRO
            </h3>
            <p style={{ fontSize: "48px", fontWeight: "900", color: colors.white, marginBottom: `${spacing[1]}px` }}>TODO_COPY</p>
            <p style={{ color: colors.gray500, fontSize: "14px", marginBottom: `${spacing[6]}px` }}>por mes</p>
            <ul style={{ textAlign: "left", listStyle: "none", padding: 0, marginBottom: `${spacing[8]}px` }}>
              {[
                "Rutinas ilimitadas",
                "Historial completo",
                "Análisis de progreso avanzado",
                "Sin publicidad",
                "Todo lo de Free incluido",
              ].map((item) => (
                <li key={item} style={{ color: colors.gray300, marginBottom: `${spacing[2]}px`, paddingLeft: "24px", position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, color: colors.lime }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="/auth/login"
              style={{
                display: "block",
                padding: `${spacing[3]}px`,
                backgroundColor: colors.lime,
                color: colors.black,
                borderRadius: "8px",
                fontWeight: "700",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Empezar con PRO
            </a>
          </div>
        </div>
      </section>

      {/* CTA para coaches */}
      <section style={{
        padding: `${spacing[16]}px ${spacing[6]}px`,
        background: `linear-gradient(135deg, ${colors.gray900} 0%, ${colors.black} 100%)`,
        textAlign: "center",
      }}>
        <h2 style={{ color: colors.white, fontSize: "36px", marginBottom: `${spacing[4]}px` }}>
          ¿Sos coach?
        </h2>
        <p style={{ color: colors.gray400, fontSize: "18px", marginBottom: `${spacing[8]}px`, maxWidth: "500px", margin: `0 auto ${spacing[8]}px` }}>
          Creá tu perfil, publicá tus paquetes y gestioná a tus alumnos desde una sola plataforma.
          Sin suscripción fija al principio.
        </p>
        <a
          href="/onboarding-coach"
          style={{
            display: "inline-block",
            padding: `${spacing[4]}px ${spacing[8]}px`,
            backgroundColor: colors.lime,
            color: colors.black,
            borderRadius: "8px",
            fontWeight: "700",
            fontSize: "18px",
            textDecoration: "none",
          }}
        >
          Registrarme como coach
        </a>
      </section>

      {/* Footer */}
      <footer style={{
        padding: `${spacing[8]}px ${spacing[6]}px`,
        borderTop: `1px solid ${colors.gray800}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: `${spacing[4]}px`,
        maxWidth: "1200px",
        margin: "0 auto",
      }}>
        <p style={{ color: colors.gray500, fontSize: "14px" }}>© 2026 Forzza. Todos los derechos reservados.</p>
        <div style={{ display: "flex", gap: `${spacing[6]}px` }}>
          <a href="/legales/terminos" style={{ color: colors.gray500, fontSize: "14px", textDecoration: "none" }}>
            Términos y condiciones
          </a>
          <a href="/legales/privacidad" style={{ color: colors.gray500, fontSize: "14px", textDecoration: "none" }}>
            Política de privacidad
          </a>
        </div>
      </footer>
    </main>
  );
}
