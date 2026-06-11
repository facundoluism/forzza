import Link from "next/link";

export const metadata = {
  title: "Forzza — Tu plataforma de entrenamiento personalizado",
  description: "Entrená con el coach correcto. Rutinas, seguimiento y resultados reales.",
};

const features = [
  { icon: "🏋️", title: "Rutinas personalizadas", desc: "Tu coach crea rutinas según tus objetivos y nivel." },
  { icon: "📊", title: "Progreso visible", desc: "Registrá entrenamientos y fotos. Ves la evolución real." },
  { icon: "💬", title: "Chat directo", desc: "Feedback de tu coach en tiempo real." },
  { icon: "🔒", title: "Pagos seguros", desc: "Mercado Pago. El coach cobra cuando cumple." },
  { icon: "📱", title: "Offline-first", desc: "Entrená sin conexión, sync automático." },
  { icon: "✅", title: "Coaches verificados", desc: "Proceso de validación real. Constancia incluida." },
];

export default function HomePage() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen text-[#FAFAFA]">
      {/* NAV */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A] sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-50">
        <span className="text-[#C8FF00] text-2xl font-black tracking-widest">FORZZA</span>
        <div className="flex gap-3">
          <Link href="/coaches" className="text-[#8A8A8A] hover:text-[#FAFAFA] text-sm px-3 py-2 transition-colors">Ver coaches</Link>
          <Link href="/auth/login" className="text-sm px-4 py-2 border border-[#3A3A3A] rounded-lg hover:border-[#C8FF00] transition-colors">Ingresar</Link>
          <Link href="/auth/login" className="text-sm px-4 py-2 bg-[#C8FF00] text-black font-bold rounded-lg hover:bg-[#b8ef00] transition-colors">Empezar gratis</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-6 py-24 text-center max-w-4xl mx-auto">
        <div className="inline-block bg-[#1A1A1A] border border-[#2A2A2A] text-[#C8FF00] text-xs font-mono px-3 py-1 rounded-full mb-6 tracking-widest">
          BETA — ARGENTINA
        </div>
        <h1 className="text-[clamp(64px,12vw,120px)] font-black leading-none tracking-tighter text-[#C8FF00] mb-6">
          FORZZA
        </h1>
        <p className="text-[clamp(20px,3vw,28px)] text-[#FAFAFA] mb-4 leading-snug">
          Entrenamiento con coach que realmente funciona.
        </p>
        <p className="text-lg text-[#8A8A8A] mb-10 max-w-xl mx-auto">
          Conectamos alumnos con coaches certificados. Rutinas, check-ins, progreso y pagos en un solo lugar.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/auth/login" className="px-8 py-4 bg-[#C8FF00] text-black font-bold text-lg rounded-xl hover:bg-[#b8ef00] transition-colors">
            Empezar gratis
          </Link>
          <Link href="/coaches" className="px-8 py-4 border-2 border-[#3A3A3A] text-[#FAFAFA] font-bold text-lg rounded-xl hover:border-[#C8FF00] transition-colors">
            Ver coaches
          </Link>
        </div>
        <p className="mt-8 text-[#4A4A4A] text-sm">Sin tarjeta de crédito · Gratis para siempre en plan Free</p>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#FAFAFA] mb-3">Todo lo que necesitás para entrenar mejor</h2>
        <p className="text-[#8A8A8A] text-center mb-12">Una plataforma. Tres roles. Un objetivo.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="p-6 bg-[#111111] rounded-2xl border border-[#2A2A2A] hover:border-[#3A3A3A] transition-colors group">
              <span className="text-4xl mb-4 block">{f.icon}</span>
              <h3 className="text-[#FAFAFA] font-semibold text-lg mb-2 group-hover:text-[#C8FF00] transition-colors">{f.title}</h3>
              <p className="text-[#8A8A8A] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-20 bg-[#080808]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#FAFAFA] mb-12">¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Elegís tu coach", desc: "Explorás el marketplace, ves perfiles y paquetes." },
              { step: "02", title: "Empezás a entrenar", desc: "Tu coach te arma la rutina y te hace seguimiento." },
              { step: "03", title: "Medís tu progreso", desc: "Check-ins semanales, fotos y métricas. Sin excusas." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="text-[#C8FF00] text-5xl font-black font-mono mb-4">{s.step}</div>
                <h3 className="text-[#FAFAFA] font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-[#8A8A8A] text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-6 py-20 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#FAFAFA] mb-3">Planes para alumnos</h2>
        <p className="text-[#8A8A8A] mb-12">Empezás gratis. Subís cuando querés más.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free */}
          <div className="p-8 bg-[#111111] rounded-2xl border border-[#2A2A2A] text-left">
            <span className="text-xs font-mono tracking-widest text-[#6A6A6A] uppercase">Free</span>
            <div className="mt-3 mb-1 text-5xl font-black text-[#FAFAFA]">$0</div>
            <div className="text-[#6A6A6A] text-sm mb-6">Para siempre</div>
            <ul className="space-y-3 mb-8">
              {["3 rutinas activas", "Historial últimos 10 días", "Registro de entrenamientos", "Marketplace de coaches"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[#AAAAAA] text-sm">
                  <span className="text-[#4A4A4A]">✓</span>{item}
                </li>
              ))}
            </ul>
            <Link href="/auth/login" className="block text-center py-3 border-2 border-[#3A3A3A] rounded-xl text-[#FAFAFA] font-bold hover:border-[#C8FF00] transition-colors">
              Empezar gratis
            </Link>
          </div>
          {/* PRO */}
          <div className="p-8 bg-[#111111] rounded-2xl border-2 border-[#C8FF00] text-left relative">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C8FF00] text-black text-xs font-bold px-3 py-1 rounded-full">RECOMENDADO</span>
            <span className="text-xs font-mono tracking-widest text-[#C8FF00] uppercase">PRO</span>
            <div className="mt-3 mb-1 text-5xl font-black text-[#FAFAFA]">$ 9.999</div>
            <div className="text-[#6A6A6A] text-sm mb-6">por mes · cancelás cuando querés</div>
            <ul className="space-y-3 mb-8">
              {["Rutinas ilimitadas", "Historial completo", "Análisis de progreso avanzado", "Fotos de progreso privadas", "Sin publicidad", "Todo lo de Free"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[#AAAAAA] text-sm">
                  <span className="text-[#C8FF00]">✓</span>{item}
                </li>
              ))}
            </ul>
            <Link href="/upgrade" className="block text-center py-3 bg-[#C8FF00] rounded-xl text-black font-bold hover:bg-[#b8ef00] transition-colors">
              Activar PRO
            </Link>
          </div>
        </div>
      </section>

      {/* COACH CTA */}
      <section className="px-6 py-20 bg-[#080808]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#FAFAFA] mb-4">¿Sos coach?</h2>
          <p className="text-[#8A8A8A] text-lg mb-8">Creá tu perfil, publicá tus paquetes y manejá tus alumnos desde un solo lugar. Sin suscripción fija al principio.</p>
          <Link href="/onboarding-coach" className="inline-block px-8 py-4 bg-[#C8FF00] text-black font-bold text-lg rounded-xl hover:bg-[#b8ef00] transition-colors">
            Registrarme como coach →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1A1A1A] px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-[#C8FF00] text-xl font-black tracking-widest">FORZZA</span>
          <div className="flex gap-6 text-sm text-[#6A6A6A]">
            <Link href="/legales/terminos" className="hover:text-[#FAFAFA] transition-colors">Términos</Link>
            <Link href="/legales/privacidad" className="hover:text-[#FAFAFA] transition-colors">Privacidad</Link>
            <Link href="/coaches" className="hover:text-[#FAFAFA] transition-colors">Coaches</Link>
          </div>
          <p className="text-[#4A4A4A] text-xs">© 2026 Forzza. Argentina.</p>
        </div>
      </footer>
    </main>
  );
}
