"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { LEGAL_DOCS_VERSION } from "@forzza/config";

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
  /** Debe ser true para poder enviar el formulario */
  terms_accepted: boolean;
}

export default function OnboardingCoachPage() {
  const t = useTranslations("onboardingCoach");
  const router = useRouter();
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
    terms_accepted: false,
  });

  const steps = [
    t("steps.account"),
    t("steps.fiscal"),
    t("steps.banking"),
    t("steps.profile"),
  ];

  function updateData(partial: Partial<CoachData>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  async function handleFinish() {
    // Términos obligatorios — bloquear antes de cualquier llamada de red
    if (!data.terms_accepted) {
      setError(t("step4.termsError"));
      return;
    }

    setLoading(true);
    setError(null);

    const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "";
    const isDevMode = !supabaseUrl || supabaseUrl.includes("placeholder");

    // Dev bypass: skip Supabase, go straight to pendiente
    if (isDevMode) {
      await new Promise((r) => setTimeout(r, 500));
      router.push("/onboarding-coach/pendiente");
      return;
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError(t("errorSession"));
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

      // Registrar aceptación de términos en audit_log — non-blocking
      try {
        await supabase.rpc("accept_terms", {
          p_version: LEGAL_DOCS_VERSION,
        });
      } catch (rpcErr) {
        console.error("[onboarding-coach] accept_terms RPC failed:", rpcErr);
      }

      router.push("/onboarding-coach/pendiente");
    } catch (err) {
      setError(t("errorSave"));
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
          {t("heading")}
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
            <h2 style={{ color: "#FAFAFA", marginBottom: "24px" }}>{t("step1.heading")}</h2>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", color: "var(--color-muted)", marginBottom: "8px", fontSize: "14px" }}>
                {t("step1.nameLabel")}
              </label>
              <input
                type="text"
                value={data.display_name}
                onChange={(e) => updateData({ display_name: e.target.value })}
                placeholder={t("step1.namePlaceholder")}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: "var(--color-muted)", marginBottom: "8px", fontSize: "14px" }}>
                {t("step1.countryLabel")}
              </label>
              <select
                value={data.country}
                onChange={(e) => updateData({ country: e.target.value as "AR" | "CL" })}
                style={inputStyle}
              >
                <option value="AR">{t("step1.countryAR")}</option>
                <option value="CL" disabled>{t("step1.countryCL")}</option>
              </select>
            </div>
            <button
              onClick={() => {
                if (!data.display_name.trim()) {
                  setError(t("step1.errorNameRequired"));
                  return;
                }
                setError(null);
                setStep(2);
              }}
              style={buttonStyle}
            >
              {t("next")}
            </button>
          </div>
        )}

        {/* Paso 2: Fiscal */}
        {step === 2 && (
          <div>
            <h2 style={{ color: "#FAFAFA", marginBottom: "8px" }}>{t("step2.heading")}</h2>
            <p style={{ color: "var(--color-muted)", marginBottom: "24px", fontSize: "14px" }}>
              {t("step2.subheading")}
            </p>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", color: "var(--color-muted)", marginBottom: "8px", fontSize: "14px" }}>
                {t("step2.figuraLabel")}
              </label>
              <select
                value={data.legal_entity_type}
                onChange={(e) => updateData({ legal_entity_type: e.target.value })}
                style={inputStyle}
              >
                <option value="">{t("step2.figuraPlaceholder")}</option>
                <option value="monotributo">{t("step2.figuraMonotributista")}</option>
                <option value="responsable_inscripto">{t("step2.figuraRI")}</option>
                <option value="empresa">{t("step2.figuraEmpresa")}</option>
                <option value="otro">{t("step2.figuraOtro")}</option>
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", color: "var(--color-muted)", marginBottom: "8px", fontSize: "14px" }}>
                {data.country === "AR" ? t("step2.cuitLabelAR") : t("step2.cuitLabelCL")}
              </label>
              <input
                type="text"
                value={data.fiscal_id}
                onChange={(e) => updateData({ fiscal_id: e.target.value })}
                placeholder={data.country === "AR" ? t("step2.cuitPlaceholderAR") : t("step2.cuitPlaceholderCL")}
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
              <button onClick={() => setStep(1)} style={secondaryButtonStyle}>{t("back")}</button>
              <button
                onClick={() => {
                  if (!data.legal_entity_type || !data.fiscal_id) {
                    setError(t("errorRequiredFields"));
                    return;
                  }
                  setError(null);
                  setStep(3);
                }}
                style={{ ...buttonStyle, flex: 1 }}
              >
                {t("next")}
              </button>
            </div>
          </div>
        )}

        {/* Paso 3: Bancario */}
        {step === 3 && (
          <div>
            <h2 style={{ color: "#FAFAFA", marginBottom: "8px" }}>{t("step3.heading")}</h2>
            <p style={{ color: "var(--color-muted)", marginBottom: "24px", fontSize: "14px" }}>
              {data.country === "AR"
                ? t("step3.descriptionAR")
                : t("step3.descriptionCL")}
            </p>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", color: "var(--color-muted)", marginBottom: "8px", fontSize: "14px" }}>
                {data.country === "AR" ? t("step3.cbuLabelAR") : t("step3.cbuLabelCL")}
              </label>
              <input
                type="text"
                value={data.cbu}
                onChange={(e) => updateData({ cbu: e.target.value })}
                placeholder={data.country === "AR" ? t("step3.cbuPlaceholderAR") : t("step3.cbuPlaceholderCL")}
                style={inputStyle}
              />
            </div>

            {data.country === "AR" && (
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", color: "var(--color-muted)", marginBottom: "8px", fontSize: "14px" }}>
                  {t("step3.aliasLabel")}
                </label>
                <input
                  type="text"
                  value={data.alias_cbu}
                  onChange={(e) => updateData({ alias_cbu: e.target.value })}
                  placeholder={t("step3.aliasPlaceholder")}
                  style={inputStyle}
                />
              </div>
            )}

            {error && <p style={{ color: "#FF4466", marginBottom: "16px", fontSize: "14px" }}>{error}</p>}

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setStep(2)} style={secondaryButtonStyle}>{t("back")}</button>
              <button
                onClick={() => {
                  if (!data.cbu.trim()) {
                    setError(t("step3.errorCbuRequired"));
                    return;
                  }
                  setError(null);
                  setStep(4);
                }}
                style={{ ...buttonStyle, flex: 1 }}
              >
                {t("next")}
              </button>
            </div>
          </div>
        )}

        {/* Paso 4: Perfil público */}
        {step === 4 && (
          <div>
            <h2 style={{ color: "#FAFAFA", marginBottom: "8px" }}>{t("step4.heading")}</h2>
            <p style={{ color: "var(--color-muted)", marginBottom: "24px", fontSize: "14px" }}>
              {t("step4.subheading")}
            </p>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: "var(--color-muted)", marginBottom: "8px", fontSize: "14px" }}>
                {t("step4.descriptionLabel")}
              </label>
              <textarea
                value={data.bio}
                onChange={(e) => updateData({ bio: e.target.value })}
                placeholder={t("step4.descriptionPlaceholder")}
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            {/* Términos y Política de Privacidad — OBLIGATORIO */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  cursor: loading ? "not-allowed" : "pointer",
                  lineHeight: 1.5,
                }}
              >
                <input
                  type="checkbox"
                  checked={data.terms_accepted}
                  onChange={(e) => {
                    updateData({ terms_accepted: e.target.checked });
                    if (e.target.checked && error === t("step4.termsError")) {
                      setError(null);
                    }
                  }}
                  disabled={loading}
                  style={{
                    marginTop: "3px",
                    accentColor: "#C8FF00",
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  aria-required="true"
                />
                <span style={{ color: "var(--color-muted)", fontSize: "14px" }}>
                  {t("step4.termsLabel")}{" "}
                  <Link
                    href="/legales/terminos"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#C8FF00", textDecoration: "underline" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t("step4.termsLinkTerms")}
                  </Link>{" "}
                  {t("step4.termsLinkAnd")}{" "}
                  <Link
                    href="/legales/privacidad"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#C8FF00", textDecoration: "underline" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t("step4.termsLinkPrivacy")}
                  </Link>
                </span>
              </label>
            </div>

            {error && <p style={{ color: "#FF4466", marginBottom: "16px", fontSize: "14px" }}>{error}</p>}

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setStep(3)} style={secondaryButtonStyle}>{t("back")}</button>
              <button
                onClick={() => { void handleFinish(); }}
                disabled={loading || !data.terms_accepted}
                style={{
                  ...buttonStyle,
                  flex: 1,
                  backgroundColor: loading || !data.terms_accepted ? "#4A4A4A" : "#C8FF00",
                  color: loading || !data.terms_accepted ? "#6A6A6A" : "#0A0A0A",
                  cursor: loading || !data.terms_accepted ? "not-allowed" : "pointer",
                }}
              >
                {loading ? t("step4.submitLoading") : t("step4.submit")}
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
  const t = useTranslations("onboardingCoach");
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (f: File) => {
      if (f.type !== "application/pdf") {
        onError(t("dropzone.errorPdfOnly"));
        return;
      }
      if (f.size > MAX_FILE_SIZE) {
        onError(t("dropzone.errorSizeLimit", { size: (f.size / 1024 / 1024).toFixed(1) }));
        return;
      }
      onError(null);
      onFile(f);
    },
    [onFile, onError, t],
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
        <label style={{ display: "block", color: "var(--color-muted)", marginBottom: "8px", fontSize: "14px" }}>
          {t("dropzone.labelOptional")}
        </label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px",
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
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
            title={t("dropzone.removeFile")}
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
        {t("dropzone.labelRequired")}
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
          border: `2px dashed ${dragging ? "#C8FF00" : "var(--color-border)"}`,
          borderRadius: "12px",
          padding: "32px 16px",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: dragging ? "rgba(200,255,0,0.04)" : "var(--color-surface)",
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
          {t("dropzone.uploadPromptPre")}{" "}
          <span style={{ color: "#C8FF00" }}>{t("dropzone.uploadPromptLink")}</span>
        </p>
        <p style={{ color: "#6868A0", fontSize: "12px", margin: 0, fontFamily: "var(--font-mono)" }}>
          {t("dropzone.hint")}
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
  backgroundColor: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "8px",
  color: "var(--color-text)",
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
  color: "var(--color-muted)",
  border: "1px solid var(--color-border)",
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "pointer",
};
