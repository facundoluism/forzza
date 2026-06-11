export const metadata = {
  title: "Política de privacidad — Forzza",
};

export default function PrivacidadPage() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen px-6 py-16 max-w-[800px] mx-auto text-[#FAFAFA]">
      <a href="/" className="text-[#C8FF00] text-sm hover:text-[#b8ef00] transition-colors">
        ← Volver al inicio
      </a>
      <h1 className="text-4xl font-black text-[#FAFAFA] mt-6 mb-6 tracking-tight">
        Política de privacidad
      </h1>
      <div className="bg-[#1A1A1A] border border-[#FFAA00] rounded-lg p-4 mb-6">
        <p className="text-[#FFAA00] m-0 text-sm">
          ⚠️ DRAFT — Este documento está pendiente de revisión legal.
        </p>
      </div>
      <div className="text-[#AAAAAA] leading-[1.8] text-base">
        <p>TODO_COPY — Pendiente de redacción final por abogado especialista en datos personales (PDPA Argentina).</p>
        <h2 className="text-[#FAFAFA] text-2xl font-bold mt-8 mb-3">Datos que recopilamos</h2>
        <p>Email, nombre, fecha de nacimiento, historial de entrenamientos y datos de pago (gestionados por Mercado Pago/RevenueCat).</p>
        <h2 className="text-[#FAFAFA] text-2xl font-bold mt-8 mb-3">Datos sensibles</h2>
        <p>Las fotos corporales y constancias fiscales se almacenan en servidores privados con acceso restringido. No se comparten con terceros ni se usan para analytics.</p>
        <h2 className="text-[#FAFAFA] text-2xl font-bold mt-8 mb-3">Tus derechos</h2>
        <p>Podés solicitar la eliminación de tu cuenta y todos tus datos en cualquier momento desde la configuración de tu cuenta.</p>
      </div>
    </main>
  );
}
