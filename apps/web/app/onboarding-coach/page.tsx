"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Step = 1 | 2 | 3 | 4;

interface CoachData {
  display_name: string;
  bio: string;
  legal_entity_type: string;
  fiscal_id: string;
  country: "AR" | "CL";
  /** CBU (22 dígitos) para AR */
  cbu: string;
  /** Alias CBU para AR */
  alias_cbu: string;
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
    cbu: "",
    alias_cbu: "",
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

    const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "";
    const isDevMode = !supabaseUrl || supabaseUrl.includes("placeholder");

    // Dev bypass: skip Supabase, go straight to pendiente
    if (isDevMode) {
      await new Promise((r) => setTimeout(r, 500));
      window.location.href = "/onboarding-coach/pendiente";
      return;
    }

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

      // Crear el perfil de coach — usa cbu/alias_cbu (columnas 0615)
      const { error: profileError } = await supabase
        .from("coach_profiles")
        .insert({
          user_id: user.id,
          display_name: data.display_name,
          bio: data.bio,
          country: data.country,
          legal_entity_type: data.legal_entity_type as "monotributo" | "responsable_inscripto" | "empresa" | "otro",
          fiscal_id: data.fiscal_id,
          cbu: data.cbu || null,
          alias_cbu: data.alias_cbu || null,
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
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)", padding: "32px 24px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {/* Logo */}
        <div style={{ marginBottom: "32px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-block" }}>
            <span style={{ color: "var(--color-lime)", fontSize: "24px", fontWeight: 800, letterSpacing: "6px", fontFamily: "var(--font-display)" }}>FORZZA</span>
          </Link>
        </div>
        {/* Header */}
        <h1 style={{ color: "var(--color-lime)", fontSize: "28px", fontWeight: "bold", marginBottom: "8px", fontFamily: "var(--font-display)", letterSpacing: "1px" }}>
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

            <PdfDropzone
              file={data.constancia_file}
              onFile={(f) => updateData({ constancia_file: f })}
              onError={setError}
            />

            {error && <p style={{ color: "#FF4466", marginBottom: "16px", fontSize: "14px" }}>{error}</p>}

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
                ? "Ingresá tu CBU (22 dígitos) y/o alias bancario."
                : "Ingresá tu número de cuenta y RUT."}
            </p>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", color: "#AAAAAA", marginBottom: "8px", fontSize: "14px" }}>
                {data.country === "AR" ? "CBU (22 dígitos) *" : "Cuenta bancaria + RUT *"}
              </label>
              <input
                type="text"
                value={data.cbu}
                onChange={(e) => updateData({ cbu: e.target.value })}
                placeholder={data.country === "AR" ? "0000003100012345678901" : "12345678-9 / Banco XX"}
                style={inputStyle}
              />
            </div>

            {data.country === "AR" && (
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", color: "#AAAAAA", marginBottom: "8px", fontSize: "14px" }}>
                  Alias bancario (opcional)
                </label>
                <input
                  type="text"
                  value={data.alias_cbu}
                  onChange={(e) => updateData({ alias_cbu: e.target.value })}
                  placeholder="mi.alias.banco"
                  style={inputStyle}
                />
              </div>
            )}

            {error && <p style={{ color: "#FF4466", marginBottom: "16px", fontSize: "14px" }}>{error}</p>}

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setStep(2)} style={secondaryButtonStyle}>← Atrás</button>
              <button
                onClick={() => {
                  if (!data.cbu.trim()) {
                    setError("El CBU es obligatorio");
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

            {error && <p style={{ color: "#FF4466", marginBottom: "16px", fontSize: "14px" }}>{error}</p>}

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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function PdfDropzone({
  file,
  onFile,
  onError,
}: {
  file: File | null;
  onFile: (f: File | null) => void;
  onError: (msg: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (f: File) => {
      if (f.type !== "application/pdf") {
        onError("Solo se aceptan archivos PDF.");
        return;
      }
      if (f.size > MAX_FILE_SIZE) {
        onError(`El archivo supera el límite de 5 MB (${(f.size / 1024 / 1024).toFixed(1)} MB).`);
        return;
      }
      onError(null);
      onFile(f);
    },
    [onFile, onError],
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }

  if (file) {
    return (
      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "block", color: "#9898C0", marginBottom: "8px", fontSize: "14px" }}>
          Constancia de inscripción
        </label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px",
            backgroundColor: "#0E0E18",
            border: "1px solid #242436",
            borderRadius: "12px",
          }}
        >
          {/* PDF icon */}
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              backgroundColor: "rgba(200,255,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#C8FF00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 2v6h6" stroke="#C8FF00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="7" y="18" fill="#C8FF00" fontSize="6" fontWeight="700" fontFamily="monospace">PDF</text>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: "#F0F0FF", fontSize: "14px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {file.name}
            </p>
            <p style={{ color: "#6868A0", fontSize: "12px", margin: "2px 0 0", fontFamily: "var(--font-mono)" }}>
              {(file.size / 1024).toFixed(0)} KB
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onFile(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            style={{
              background: "none",
              border: "none",
              color: "#6868A0",
              cursor: "pointer",
              padding: "8px",
              fontSize: "18px",
              lineHeight: 1,
            }}
            title="Quitar archivo"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "24px" }}>
      <label style={{ display: "block", color: "#9898C0", marginBottom: "8px", fontSize: "14px" }}>
        Constancia de inscripción *
      </label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragging ? "#C8FF00" : "#242436"}`,
          borderRadius: "12px",
          padding: "32px 16px",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: dragging ? "rgba(200,255,0,0.04)" : "#0E0E18",
          transition: "all 0.15s ease",
        }}
      >
        {/* Upload icon */}
        <div style={{ marginBottom: "12px" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto" }}>
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke={dragging ? "#C8FF00" : "#6868A0"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 8l-5-5-5 5" stroke={dragging ? "#C8FF00" : "#6868A0"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 3v12" stroke={dragging ? "#C8FF00" : "#6868A0"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p style={{ color: "#F0F0FF", fontSize: "15px", margin: "0 0 4px", fontWeight: 600 }}>
          Arrastrá tu archivo o <span style={{ color: "#C8FF00" }}>buscá en tu dispositivo</span>
        </p>
        <p style={{ color: "#6868A0", fontSize: "12px", margin: 0, fontFamily: "var(--font-mono)" }}>
          Solo PDF · Máx. 5 MB
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleChange}
        style={{ display: "none" }}
      />
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
