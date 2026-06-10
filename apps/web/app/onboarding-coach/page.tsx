"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Step = 1 | 2 | 3 | 4;

interface CoachData {
  display_name: string;
  bio: string;
  legal_entity_type: string;
  fiscal_id: string;
  country: "AR" | "CL";
  bank_account: string;
  constancia_file: File | null;
}

export default function OnboardingCoachPage() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CoachData>({
    display_name: "",
    bio: "",
    legal_entity_type: "",
    fiscal_id: "",
    country: "AR",
    bank_account: "",
    constancia_file: null,
  });

  const steps = [
    "Cuenta",
    "Fiscal",
    "Bancario",
    "Perfil público",
  ];

  function updateData(partial: Partial<CoachData>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  async function handleFinish() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Sesión expirada. Iniciá sesión de nuevo.");
      setLoading(false);
      return;
    }

    try {
      let constancia_path: string | undefined;

      // Subir constancia al bucket privado
      if (data.constancia_file) {
        const ext = data.constancia_file.name.split(".").pop() ?? "pdf";
        const path = `${user.id}/constancia.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("fiscal-docs")
          .upload(path, data.constancia_file, { upsert: true });

        if (uploadError) throw uploadError;
        constancia_path = path;
      }

      // Crear el perfil de coach
      const { error: profileError } = await supabase
        .from("coach_profiles")
        .insert({
          user_id: user.id,
          display_name: data.display_name,
          bio: data.bio,
          country: data.country,
          legal_entity_type: data.legal_entity_type as "monotributo" | "responsable_inscripto" | "empresa" | "otro",
          fiscal_id: data.fiscal_id,
          bank_account: data.bank_account,
          constancia_path: constancia_path ?? null,
          status: "pending",
        });

      if (profileError) throw profileError;

      // Actualizar rol del usuario a coach
      await supabase
        .from("users")
        .update({ role: "coach" })
        .eq("id", user.id);

      window.location.href = "/onboarding-coach/pendiente";
    } catch (err) {
      setError("Hubo un error al guardar tu perfil. Intentá de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0A0A0A", padding: "32px 24px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {/* Header */}
        <h1 style={{ color: "#C8FF00", fontSize: "28px", fontWeight: "bold", marginBottom: "8px" }}>
          Registrarse como coach
        </h1>

        {/* Progress */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "32px" }}>
          {steps.map((label, i) => (
            <div key={label} style={{ flex: 1 }}>
              <div style={{
                height: "4px",
                backgroundColor: i < step ? "#C8FF00" : "#2A2A2A",
                borderRadius: "2px",
                transition: "background-color 0.2s",
              }} />
              <p style={{ color: i < step ? "#C8FF00" : "#6A6A6A", fontSize: "12px", marginTop: "4px" }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Paso 1: Cuenta básica */}
        {step === 1 && (
          <div>
            <h2 style={{ color: "#FAFAFA", marginBottom: "24px" }}>Tu cuenta</h2>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", color: "#AAAAAA", marginBottom: "8px", fontSize: "14px" }}>
                Nombre público *
              </label>
              <input
                type="text"
                value={data.display_name}
                onChange={(e) => updateData({ display_name: e.target.value })}
                placeholder="Cómo te vas a ver en Forzza"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: "#AAAAAA", marginBottom: "8px", fontSize: "14px" }}>
                País
              </label>
              <select
                value={data.country}
                onChange={(e) => updateData({ country: e.target.value as "AR" | "CL" })}
                style={inputStyle}
              >
                <option value="AR">Argentina</option>
                <option value="CL" disabled>Chile (próximamente)</option>
              </select>
            </div>
            <button
              onClick={() => {
                if (!data.display_name.trim()) {
                  setError("El nombre es obligatorio");
                  return;
                }
                setError(null);
                setStep(2);
              }}
              style={buttonStyle}
            >
              Siguiente →
            </button>
          </div>
        )}

        {/* Paso 2: Fiscal */}
        {step === 2 && (
          <div>
            <h2 style={{ color: "#FAFAFA", marginBottom: "8px" }}>Datos fiscales</h2>
            <p style={{ color: "#AAAAAA", marginBottom: "24px", fontSize: "14px" }}>
              Necesitamos estos datos para poder liquidarte los pagos.
            </p>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", color: "#AAAAAA", marginBottom: "8px", fontSize: "14px" }}>
                Figura impositiva *
              </label>
              <select
                value={data.legal_entity_type}
                onChange={(e) => updateData({ legal_entity_type: e.target.value })}
                style={inputStyle}
              >
                <option value="">Seleccioná una opción</option>
                <option value="monotributo">Monotributista</option>
                <option value="responsable_inscripto">Responsable inscripto</option>
                <option value="empresa">Empresa/Sociedad</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", color: "#AAAAAA", marginBottom: "8px", fontSize: "14px" }}>
                {data.country === "AR" ? "CUIT *" : "RUT *"}
              </label>
              <input
                type="text"
                value={data.fiscal_id}
                onChange={(e) => updateData({ fiscal_id: e.target.value })}
                placeholder={data.country === "AR" ? "20-12345678-9" : "12.345.678-9"}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: "#AAAAAA", marginBottom: "8px", fontSize: "14px" }}>
                Constancia de inscripción (PDF o JPG, máx. 10MB)
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => updateData({ constancia_file: e.target.files?.[0] ?? null })}
                style={{ color: "#FAFAFA", fontSize: "14px" }}
              />
              {data.constancia_file && (
                <p style={{ color: "#00CC66", fontSize: "12px", marginTop: "4px" }}>
                  ✓ {data.constancia_file.name}
                </p>
              )}
            </div>

            {error && <p style={{ color: "#FF4444", marginBottom: "16px", fontSize: "14px" }}>{error}</p>}

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setStep(1)} style={secondaryButtonStyle}>← Atrás</button>
              <button
                onClick={() => {
                  if (!data.legal_entity_type || !data.fiscal_id) {
                    setError("Completá los campos obligatorios");
                    return;
                  }
                  setError(null);
                  setStep(3);
                }}
                style={{ ...buttonStyle, flex: 1 }}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* Paso 3: Bancario */}
        {step === 3 && (
          <div>
            <h2 style={{ color: "#FAFAFA", marginBottom: "8px" }}>Datos bancarios</h2>
            <p style={{ color: "#AAAAAA", marginBottom: "24px", fontSize: "14px" }}>
              {data.country === "AR"
                ? "Ingresá tu CBU o alias de Mercado Pago / banco."
                : "Ingresá tu número de cuenta y RUT."}
            </p>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: "#AAAAAA", marginBottom: "8px", fontSize: "14px" }}>
                {data.country === "AR" ? "CBU o alias *" : "Cuenta bancaria + RUT *"}
              </label>
              <input
                type="text"
                value={data.bank_account}
                onChange={(e) => updateData({ bank_account: e.target.value })}
                placeholder={data.country === "AR" ? "0000003100012345678901" : "12345678-9 / Banco XX"}
                style={inputStyle}
              />
            </div>

            {error && <p style={{ color: "#FF4444", marginBottom: "16px", fontSize: "14px" }}>{error}</p>}

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setStep(2)} style={secondaryButtonStyle}>← Atrás</button>
              <button
                onClick={() => {
                  if (!data.bank_account.trim()) {
                    setError("El dato bancario es obligatorio");
                    return;
                  }
                  setError(null);
                  setStep(4);
                }}
                style={{ ...buttonStyle, flex: 1 }}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* Paso 4: Perfil público */}
        {step === 4 && (
          <div>
            <h2 style={{ color: "#FAFAFA", marginBottom: "8px" }}>Tu perfil público</h2>
            <p style={{ color: "#AAAAAA", marginBottom: "24px", fontSize: "14px" }}>
              Esto es lo que van a ver los alumnos en el marketplace.
            </p>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: "#AAAAAA", marginBottom: "8px", fontSize: "14px" }}>
                Descripción (opcional)
              </label>
              <textarea
                value={data.bio}
                onChange={(e) => updateData({ bio: e.target.value })}
                placeholder="Contá quién sos, qué te diferencia como coach..."
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            {error && <p style={{ color: "#FF4444", marginBottom: "16px", fontSize: "14px" }}>{error}</p>}

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setStep(3)} style={secondaryButtonStyle}>← Atrás</button>
              <button
                onClick={() => { void handleFinish(); }}
                disabled={loading}
                style={{ ...buttonStyle, flex: 1, backgroundColor: loading ? "#4A4A4A" : "#C8FF00" }}
              >
                {loading ? "Guardando..." : "Enviar solicitud"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#1A1A1A",
  border: "1px solid #3A3A3A",
  borderRadius: "8px",
  color: "#FAFAFA",
  fontSize: "16px",
  boxSizing: "border-box",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  backgroundColor: "#C8FF00",
  color: "#0A0A0A",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: "14px 24px",
  backgroundColor: "transparent",
  color: "#AAAAAA",
  border: "1px solid #3A3A3A",
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "pointer",
};
