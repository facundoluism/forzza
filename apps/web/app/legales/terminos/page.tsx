export const metadata = {
  title: "Términos y condiciones — Forzza",
};

export default function TerminosPage() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen px-6 py-16 max-w-[800px] mx-auto text-[#FAFAFA]">
      <a href="/" className="text-[#C8FF00] text-sm hover:text-[#b8ef00] transition-colors">
        ← Volver al inicio
      </a>
      <h1 className="text-4xl font-black text-[#FAFAFA] mt-6 mb-6 tracking-tight">
        Términos y condiciones
      </h1>
      <div className="bg-[#1A1A1A] border border-[#FFAA00] rounded-lg p-4 mb-6">
        <p className="text-[#FFAA00] m-0 text-sm">
          ⚠️ DRAFT — Este documento está pendiente de revisión legal. No es vinculante hasta su publicación oficial.
        </p>
      </div>
      <div className="text-[#AAAAAA] leading-[1.8] text-base">
        <p>TODO_COPY — Contenido pendiente de revisión legal por abogado. Ver §23 del master doc para el checklist legal completo.</p>
        <h2 className="text-[#FAFAFA] text-2xl font-bold mt-8 mb-3">1. Aceptación de los términos</h2>
        <p>Al usar Forzza, aceptás estos términos. Si sos menor de 18 años, necesitás el consentimiento de un adulto responsable.</p>
        <h2 className="text-[#FAFAFA] text-2xl font-bold mt-8 mb-3">2. Servicio</h2>
        <p>Forzza es una plataforma que conecta alumnos con coaches independientes. Forzza actúa como intermediario y cobra una comisión del 20% sobre las transacciones.</p>
        <h2 className="text-[#FAFAFA] text-2xl font-bold mt-8 mb-3">3. Pagos</h2>
        <p>Los pagos se procesan a través de Mercado Pago y RevenueCat. Forzza no almacena datos de tarjetas.</p>
      </div>
    </main>
  );
}
