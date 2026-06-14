import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Forzza — Entrenamiento con coach que funciona',
  description: 'Conectamos alumnos con coaches certificados. Rutinas personalizadas, check-ins, progreso y pagos en un solo lugar.',
}

const features = [
  { icon: '⚡', title: 'Rutinas personalizadas', desc: 'Tu coach arma tu plan según tus objetivos y nivel. Vos lo seguís con guía paso a paso.', tag: 'CORE' },
  { icon: '📈', title: 'Progreso medible', desc: 'Registrá sesiones, peso y fotos. Ves la evolución real semana a semana.', tag: 'TRACKING' },
  { icon: '💬', title: 'Chat directo', desc: 'Feedback de tu coach en tiempo real. Corregís técnica, ajustás plan.', tag: 'REALTIME' },
  { icon: '🔐', title: 'Pagos seguros', desc: 'Mercado Pago con 72h de garantía. El coach cobra cuando cumple.', tag: 'PAGOS' },
  { icon: '📱', title: 'Offline-first', desc: 'Entrená sin conexión. Sync automático cuando volvés a tener internet.', tag: 'MOBILE' },
  { icon: '✅', title: 'Coaches verificados', desc: 'Proceso de validación real. Constancia del ejercicio profesional incluida.', tag: 'TRUST' },
]

const steps = [
  { n: '01', title: 'Elegís tu coach', desc: 'Explorás el marketplace, ves perfiles, precios y especialidades.' },
  { n: '02', title: 'Empezás a entrenar', desc: 'Tu coach te arma la rutina y te da seguimiento personalizado.' },
  { n: '03', title: 'Medís tu progreso', desc: 'Check-ins semanales, fotos corporales y métricas. Sin excusas.' },
]

const freeFeatures = ['3 rutinas activas', 'Historial 10 días', 'Registro de sesiones', 'Marketplace de coaches']
const proFeatures = ['Rutinas ilimitadas', 'Historial completo', 'Fotos de progreso (privadas)', 'Análisis avanzado', 'Sin publicidad', 'Prioridad de soporte']

export default async function HomePage() {
  // Fetch PRO price from country_config. Falls back to 999900 cents (AR default) if DB not available.
  let proPrice = 999900;
  let currencySymbol = '$';
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: config } = await supabase
        .from('country_config')
        .select('pro_monthly_price_cents, currency_symbol')
        .eq('country', 'AR')
        .single();
      if (config) {
        proPrice = config.pro_monthly_price_cents ?? 999900;
        currencySymbol = config.currency_symbol ?? '$';
      }
    } catch {
      // Fallback values already set above
    }
  }
  const proPriceFormatted = `${currencySymbol}${(proPrice / 100).toLocaleString('es-AR')}`;

  return (
    <main style={{ background: 'var(--color-bg)', minHeight: '100vh', color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)', zIndex: 50 }}>
        <span style={{ color: 'var(--color-lime)', fontSize: '24px', fontWeight: 800, letterSpacing: '6px', fontFamily: 'var(--font-display)' }}>FORZZA</span>
        <div className="nav-mobile" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/coaches" className="hide-mobile" style={{ color: 'var(--color-muted)', fontSize: '14px', padding: '8px 12px', textDecoration: 'none', transition: 'color 200ms' }}>Coaches</Link>
          <Link href="/login" className="btn-outline hide-mobile" style={{ fontSize: '14px', padding: '8px 16px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'var(--color-text)', textDecoration: 'none' }}>Ingresar</Link>
          <Link href="/login" className="btn-lime" style={{ fontSize: '14px', padding: '8px 20px', background: 'var(--color-lime)', borderRadius: '8px', color: '#000', fontWeight: 700, textDecoration: 'none' }}>Empezar gratis</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(200,255,0,0.1)', border: '1px solid rgba(200,255,0,0.3)', borderRadius: '999px', padding: '4px 12px 4px 4px', marginBottom: '32px' }}>
          <span style={{ background: 'var(--color-lime)', color: '#000', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', letterSpacing: '1px' }}>NUEVO</span>
          <span style={{ color: 'var(--color-lime)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>Beta · Argentina 🇦🇷</span>
        </div>

        <h1 style={{ fontSize: 'clamp(64px, 12vw, 120px)', fontWeight: 900, lineHeight: 1, letterSpacing: '2px', color: 'var(--color-lime)', margin: '0 0 24px', fontFamily: 'var(--font-display)', textShadow: '0 0 60px rgba(200,255,0,0.2)' }}>
          FORZZA
        </h1>
        <p style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', color: 'var(--color-text)', marginBottom: '16px', lineHeight: 1.3, fontWeight: 600 }}>
          Entrenamiento con coach que realmente funciona.
        </p>
        <p style={{ fontSize: '18px', color: 'var(--color-muted)', marginBottom: '40px', maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.7 }}>
          Conectamos alumnos con coaches certificados. Rutinas, check-ins, progreso y pagos en un solo lugar.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
          <Link href="/login" className="btn-lime" style={{ padding: '16px 36px', background: 'var(--color-lime)', borderRadius: '12px', color: '#000', fontWeight: 700, fontSize: '18px', textDecoration: 'none', boxShadow: '0 0 24px rgba(200,255,0,0.35)' }}>
            Empezar gratis →
          </Link>
          <Link href="/coaches" className="btn-outline" style={{ padding: '16px 36px', border: '2px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: 'var(--color-text)', fontWeight: 700, fontSize: '18px', textDecoration: 'none' }}>
            Ver coaches
          </Link>
        </div>
        <p style={{ color: '#4A4A4A', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>Sin tarjeta · Plan Free para siempre</p>
      </section>

      {/* STATS STRIP */}
      <section style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '24px 16px', display: 'flex', justifyContent: 'center', gap: 'clamp(24px, 6vw, 64px)', flexWrap: 'wrap' }}>
        {[['72h', 'Garantía de devolución'], ['20%', 'Comisión plataforma'], ['100%', 'Coaches verificados']].map(([n, l]) => (
          <div key={n} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--color-lime)', fontFamily: 'var(--font-display)', lineHeight: 1, letterSpacing: '1px' }}>{n}</div>
            <div style={{ color: 'var(--color-muted)', fontSize: '13px', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>{l}</div>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, textAlign: 'center', marginBottom: '12px', fontFamily: 'var(--font-display)', letterSpacing: '0.5px' }}>
          Todo lo que necesitás para entrenar mejor
        </h2>
        <p style={{ color: 'var(--color-muted)', textAlign: 'center', marginBottom: '48px', fontSize: '17px' }}>Una plataforma. Alumnos, coaches y dueños.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '20px' }}>
          {features.map((f) => (
            <div key={f.title} className="card-hover" style={{ padding: '28px', background: 'var(--color-surface)', borderRadius: '16px', border: '1px solid var(--color-border)', cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ fontSize: '36px' }}>{f.icon}</span>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-lime)', background: 'rgba(200,255,0,0.1)', border: '1px solid rgba(200,255,0,0.2)', borderRadius: '4px', padding: '2px 8px', letterSpacing: '1px' }}>{f.tag}</span>
              </div>
              <h3 style={{ color: 'var(--color-text)', fontWeight: 700, fontSize: '18px', marginBottom: '8px', fontFamily: 'var(--font-display)', letterSpacing: '0.5px' }}>{f.title}</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 24px', background: '#080808' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, marginBottom: '56px', fontFamily: 'var(--font-display)' }}>Tres pasos para empezar</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: '40px' }}>
            {steps.map((s) => (
              <div key={s.n} style={{ position: 'relative' }}>
                <div style={{ fontSize: '72px', fontWeight: 800, color: 'rgba(200,255,0,0.15)', fontFamily: 'var(--font-display)', lineHeight: 1, marginBottom: '16px', letterSpacing: '2px', textShadow: '0 0 30px rgba(200,255,0,0.1)' }}>{s.n}</div>
                <h3 style={{ color: 'var(--color-text)', fontWeight: 700, fontSize: '20px', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>{s.title}</h3>
                <p style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '80px 24px', maxWidth: '860px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, textAlign: 'center', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>Planes para alumnos</h2>
        <p style={{ color: 'var(--color-muted)', textAlign: 'center', marginBottom: '48px' }}>Empezás gratis. Subís cuando querés más.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '24px' }}>
          {/* Free */}
          <div style={{ padding: '36px', background: 'var(--color-surface)', borderRadius: '20px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', letterSpacing: '3px', color: '#6A6A6A', marginBottom: '16px' }}>{"// FREE"}</div>
            <div style={{ fontSize: '64px', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'var(--font-display)', lineHeight: 1, letterSpacing: '1px', marginBottom: '4px' }}>$0</div>
            <div style={{ color: '#6A6A6A', fontSize: '14px', marginBottom: '28px', fontFamily: 'var(--font-mono)' }}>Para siempre</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {freeFeatures.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-muted)', fontSize: '15px' }}>
                  <span style={{ color: '#4A4A4A', fontSize: '16px' }}>○</span>{f}
                </li>
              ))}
            </ul>
            <Link href="/login" className="btn-outline" style={{ display: 'block', textAlign: 'center', padding: '14px', border: '2px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: 'var(--color-text)', fontWeight: 700, textDecoration: 'none' }}>
              Empezar gratis
            </Link>
          </div>
          {/* PRO */}
          <div style={{ padding: '36px', background: 'var(--color-surface)', borderRadius: '20px', border: '2px solid var(--color-lime)', position: 'relative', boxShadow: '0 0 40px rgba(200,255,0,0.1)', display: 'flex', flexDirection: 'column' }}>
            {/* Top highlight strip */}
            <div style={{ position: 'absolute', top: 0, left: '20px', right: '20px', height: '2px', background: 'linear-gradient(90deg, transparent, var(--color-lime), transparent)', borderRadius: '2px' }} />
            <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-lime)', color: '#000', padding: '4px 14px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>⚡ RECOMENDADO</div>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', letterSpacing: '3px', color: 'var(--color-lime)', marginBottom: '16px' }}>{"// PRO"}</div>
            <div style={{ fontSize: '64px', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'var(--font-display)', lineHeight: 1, letterSpacing: '1px', marginBottom: '4px' }}>{proPriceFormatted}</div>
            <div style={{ color: '#6A6A6A', fontSize: '14px', marginBottom: '28px', fontFamily: 'var(--font-mono)' }}>por mes · cancelás cuando querés</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {proFeatures.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-muted)', fontSize: '15px' }}>
                  <span style={{ color: 'var(--color-lime)', fontSize: '16px' }}>●</span>{f}
                </li>
              ))}
            </ul>
            <Link href="/upgrade" className="btn-lime" style={{ display: 'block', textAlign: 'center', padding: '14px', background: 'var(--color-lime)', borderRadius: '12px', color: '#000', fontWeight: 700, fontSize: '16px', textDecoration: 'none', boxShadow: '0 0 20px rgba(200,255,0,0.3)' }}>
              Activar PRO →
            </Link>
          </div>
        </div>
      </section>

      {/* COACH CTA */}
      <section style={{ padding: '80px 24px', background: '#050505' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', padding: 'clamp(32px, 5vw, 56px) clamp(20px, 4vw, 40px)', background: 'var(--color-surface)', borderRadius: '24px', border: '1px solid var(--color-border)', position: 'relative', overflow: 'hidden' }}>
          {/* Corner accent */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'radial-gradient(circle at top right, rgba(200,255,0,0.15), transparent 70%)' }} />
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏋️</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, marginBottom: '16px', fontFamily: 'var(--font-display)' }}>¿Sos coach?</h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '17px', marginBottom: '32px', lineHeight: 1.7 }}>
            Creá tu perfil, publicá tus paquetes y manejá tus alumnos desde un solo lugar.<br />
            Sin suscripción fija. Comisión solo cuando vendés.
          </p>
          <Link href="/onboarding-coach" className="btn-lime" style={{ display: 'inline-block', padding: '16px 36px', background: 'var(--color-lime)', borderRadius: '12px', color: '#000', fontWeight: 700, fontSize: '18px', textDecoration: 'none', boxShadow: '0 0 20px rgba(200,255,0,0.3)' }}>
            Registrarme como coach →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--color-border)', padding: '40px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px', textAlign: 'center' }}>
          <span style={{ color: 'var(--color-lime)', fontSize: '20px', fontWeight: 800, letterSpacing: '6px', fontFamily: 'var(--font-display)' }}>FORZZA</span>
          <div style={{ display: 'flex', gap: '24px' }}>
            {([['Coaches', '/coaches'], ['Planes', '/upgrade'], ['Términos', '/legales/terminos'], ['Privacidad', '/legales/privacidad']] as [string, string][]).map(([l, h]) => (
              <Link key={l} href={h} style={{ color: '#4A4A4A', fontSize: '14px', textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
          <p style={{ color: '#555555', fontSize: '13px', fontFamily: 'var(--font-mono)', margin: 0 }}>© 2026 Forzza · Argentina</p>
        </div>
      </footer>
    </main>
  )
}
