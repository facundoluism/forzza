// ExerciseIcon — web (SVG nativo HTML)
// viewBox 0 0 80 80, stroke ~1.8, fill por capas.
// Color de acento parametrizable; colores de estructura desde tokens.ts.
// Regla: CERO hex sueltos — todos los colores vienen de tokens.

import type { CSSProperties } from "react";
import { colors } from "../tokens";
import type { ExerciseIconProps, ExerciseIconKey } from "../exerciseIconTypes";

// Colores estructurales del DS
const S2 = colors.surface2;
const S3 = colors.surface3;
const S4 = colors.surface4;
const GL = colors.muted;

type IconRenderer = (ac: string) => React.ReactElement;

const ICONS: Record<ExerciseIconKey, IconRenderer> = {
  // ------------------------------------------------------------------
  // bench-press — Press de banca plano
  // ------------------------------------------------------------------
  "bench-press": (ac) => (
    <>
      <rect x="10" y="46" width="60" height="8" rx="4" fill={S3} />
      <rect x="6" y="52" width="4" height="20" rx="2" fill={S3} />
      <rect x="70" y="52" width="4" height="20" rx="2" fill={S3} />
      <rect x="8" y="26" width="64" height="5" rx="2.5" fill={ac} opacity="0.9" />
      <rect x="4" y="22" width="12" height="12" rx="3" fill={ac} opacity="0.55" />
      <rect x="64" y="22" width="12" height="12" rx="3" fill={ac} opacity="0.55" />
      <ellipse cx="40" cy="40" rx="10" ry="6" fill={GL} opacity="0.65" />
      <path d="M30 40 L18 28" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      <path d="M50 40 L62 28" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      <circle cx="40" cy="48" r="6" fill={GL} opacity="0.65" />
    </>
  ),

  // ------------------------------------------------------------------
  // incline-press — Press inclinado
  // ------------------------------------------------------------------
  "incline-press": (ac) => (
    <>
      <rect x="8" y="22" width="64" height="5" rx="2.5" fill={ac} opacity="0.9" />
      <rect x="4" y="18" width="11" height="11" rx="3" fill={ac} opacity="0.55" />
      <rect x="65" y="18" width="11" height="11" rx="3" fill={ac} opacity="0.55" />
      <rect x="14" y="50" width="50" height="7" rx="3.5" fill={S3} transform="rotate(-28 39 53)" />
      <rect x="6" y="56" width="4" height="18" rx="2" fill={S3} />
      <rect x="68" y="44" width="4" height="18" rx="2" fill={S3} />
      <circle cx="32" cy="44" r="6" fill={GL} opacity="0.65" />
      <path d="M32 50 L28 68" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      <path d="M32 38 L50 26" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.8" />
      <path d="M32 38 L14 30" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.8" />
    </>
  ),

  // ------------------------------------------------------------------
  // decline-press — Press declinado
  // ------------------------------------------------------------------
  "decline-press": (ac) => (
    <>
      <rect x="8" y="28" width="64" height="5" rx="2.5" fill={ac} opacity="0.9" />
      <rect x="4" y="24" width="11" height="11" rx="3" fill={ac} opacity="0.55" />
      <rect x="65" y="24" width="11" height="11" rx="3" fill={ac} opacity="0.55" />
      <rect x="14" y="44" width="50" height="7" rx="3.5" fill={S3} transform="rotate(20 39 47)" />
      <rect x="6" y="44" width="4" height="22" rx="2" fill={S3} />
      <rect x="70" y="38" width="4" height="22" rx="2" fill={S3} />
      <circle cx="48" cy="42" r="6" fill={GL} opacity="0.65" />
      <path d="M48 48 L52 65" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      <path d="M42 42 L28 34" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.8" />
      <path d="M54 38 L62 32" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.8" />
    </>
  ),

  // ------------------------------------------------------------------
  // overhead-press — Press militar / overhead
  // ------------------------------------------------------------------
  "overhead-press": (ac) => (
    <>
      <rect x="8" y="16" width="64" height="5" rx="2.5" fill={ac} opacity="0.9" />
      <rect x="4" y="12" width="11" height="11" rx="3" fill={ac} opacity="0.55" />
      <rect x="65" y="12" width="11" height="11" rx="3" fill={ac} opacity="0.55" />
      <circle cx="40" cy="30" r="7" fill={GL} opacity="0.75" />
      <rect x="33" y="38" width="14" height="16" rx="6" fill={GL} opacity="0.65" />
      <path d="M33 40 L14 22" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.85" />
      <path d="M47 40 L66 22" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.85" />
      <path d="M36 54 L32 72" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
      <path d="M44 54 L48 72" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
    </>
  ),

  // ------------------------------------------------------------------
  // chest-fly — Aperturas
  // ------------------------------------------------------------------
  "chest-fly": (ac) => (
    <>
      <rect x="30" y="46" width="20" height="8" rx="4" fill={S3} />
      <rect x="30" y="52" width="4" height="20" rx="2" fill={S3} />
      <rect x="46" y="52" width="4" height="20" rx="2" fill={S3} />
      <rect x="4" y="30" width="14" height="6" rx="3" fill={ac} opacity="0.85" />
      <rect x="62" y="30" width="14" height="6" rx="3" fill={ac} opacity="0.85" />
      <circle cx="40" cy="40" r="7" fill={GL} opacity="0.65" />
      <path d="M33 40 Q18 36 14 33" stroke={GL} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M47 40 Q62 36 66 33" stroke={GL} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />
    </>
  ),

  // ------------------------------------------------------------------
  // pulldown — Jalón al pecho
  // ------------------------------------------------------------------
  "pulldown": (ac) => (
    <>
      <rect x="20" y="8" width="40" height="5" rx="2.5" fill={S4} />
      <rect x="38" y="13" width="4" height="10" rx="2" fill={S4} />
      <rect x="16" y="23" width="48" height="5" rx="2.5" fill={ac} opacity="0.9" />
      <circle cx="40" cy="36" r="7" fill={GL} opacity="0.75" />
      <rect x="33" y="44" width="14" height="14" rx="4" fill={GL} opacity="0.65" />
      <path d="M33 40 L22 26" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.85" />
      <path d="M47 40 L58 26" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.85" />
      <path d="M37 58 L28 72" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
      <path d="M43 58 L52 72" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
    </>
  ),

  // ------------------------------------------------------------------
  // pullup — Dominadas
  // ------------------------------------------------------------------
  "pullup": (ac) => (
    <>
      <rect x="10" y="10" width="60" height="6" rx="3" fill={ac} opacity="0.9" />
      <rect x="10" y="6" width="4" height="14" rx="2" fill={S4} />
      <rect x="66" y="6" width="4" height="14" rx="2" fill={S4} />
      <circle cx="40" cy="26" r="7" fill={GL} opacity="0.75" />
      <rect x="33" y="34" width="14" height="16" rx="5" fill={GL} opacity="0.65" />
      <path d="M33 30 L26 16" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.85" />
      <path d="M47 30 L54 16" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.85" />
      <path d="M37 50 L34 70" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
      <path d="M43 50 L46 70" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
    </>
  ),

  // ------------------------------------------------------------------
  // row — Remo
  // ------------------------------------------------------------------
  "row": (ac) => (
    <>
      <rect x="62" y="10" width="10" height="60" rx="4" fill={S3} />
      <circle cx="67" cy="24" r="5" fill={S2} stroke={ac} strokeWidth="1.8" opacity="0.9" />
      <path d="M63 24 Q44 24 36 30" stroke={ac} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M63 24 Q44 26 36 38" stroke={ac} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <circle cx="26" cy="22" r="7" fill={GL} opacity="0.75" />
      <rect x="20" y="30" width="12" height="18" rx="5" fill={GL} opacity="0.65" />
      <path d="M30 34 L36 30" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      <path d="M30 38 L36 38" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      <path d="M22 48 L18 68" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
      <path d="M30 48 L32 68" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
    </>
  ),

  // ------------------------------------------------------------------
  // deadlift — Peso muerto
  // ------------------------------------------------------------------
  "deadlift": (ac) => (
    <>
      <rect x="8" y="62" width="64" height="5" rx="2.5" fill={ac} opacity="0.9" />
      <rect x="4" y="55" width="12" height="16" rx="4" fill={ac} opacity="0.55" />
      <rect x="64" y="55" width="12" height="16" rx="4" fill={ac} opacity="0.55" />
      <circle cx="40" cy="20" r="7" fill={GL} opacity="0.75" />
      <path d="M40 27 L40 50" stroke={GL} strokeWidth="6" strokeLinecap="round" opacity="0.65" />
      <path d="M37 42 L20 62" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.8" />
      <path d="M43 42 L60 62" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.8" />
      <path d="M37 50 L30 66" stroke={GL} strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      <path d="M43 50 L50 66" stroke={GL} strokeWidth="5" strokeLinecap="round" opacity="0.7" />
    </>
  ),

  // ------------------------------------------------------------------
  // squat — Sentadilla
  // ------------------------------------------------------------------
  "squat": (ac) => (
    <>
      <rect x="8" y="24" width="64" height="5" rx="2.5" fill={ac} opacity="0.9" />
      <rect x="4" y="20" width="11" height="11" rx="3" fill={ac} opacity="0.55" />
      <rect x="65" y="20" width="11" height="11" rx="3" fill={ac} opacity="0.55" />
      <circle cx="40" cy="18" r="7" fill={GL} opacity="0.75" />
      <path d="M40 25 L38 48" stroke={GL} strokeWidth="6" strokeLinecap="round" opacity="0.65" />
      <path d="M38 32 L22 30" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      <path d="M42 32 L58 30" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      <path d="M35 48 L22 62" stroke={GL} strokeWidth="5.5" strokeLinecap="round" opacity="0.8" />
      <path d="M41 48 L54 62" stroke={GL} strokeWidth="5.5" strokeLinecap="round" opacity="0.8" />
      <path d="M22 62 L24 76" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.7" />
      <path d="M54 62 L52 76" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.7" />
    </>
  ),

  // ------------------------------------------------------------------
  // lunge — Zancada
  // ------------------------------------------------------------------
  "lunge": (ac) => (
    <>
      <rect x="4" y="40" width="14" height="6" rx="3" fill={ac} opacity="0.85" />
      <rect x="62" y="40" width="14" height="6" rx="3" fill={ac} opacity="0.85" />
      <circle cx="40" cy="16" r="7" fill={GL} opacity="0.75" />
      <path d="M40 23 L40 44" stroke={GL} strokeWidth="6" strokeLinecap="round" opacity="0.65" />
      <path d="M37 34 L18 42" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      <path d="M43 34 L62 42" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      <path d="M37 44 L26 60" stroke={GL} strokeWidth="5.5" strokeLinecap="round" opacity="0.8" />
      <path d="M26 60 L28 76" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.7" />
      <path d="M43 44 L56 58" stroke={GL} strokeWidth="5.5" strokeLinecap="round" opacity="0.8" />
      <path d="M56 58 L58 74" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.7" />
    </>
  ),

  // ------------------------------------------------------------------
  // leg-extension — Extensión de cuádriceps en máquina
  // ------------------------------------------------------------------
  "leg-extension": (ac) => (
    <>
      <rect x="10" y="38" width="40" height="8" rx="4" fill={S3} />
      <rect x="10" y="46" width="8" height="28" rx="4" fill={S3} />
      <rect x="42" y="46" width="8" height="28" rx="4" fill={S3} />
      <rect x="48" y="20" width="8" height="26" rx="4" fill={S3} />
      <ellipse cx="30" cy="32" rx="9" ry="6" fill={GL} opacity="0.65" />
      <circle cx="30" cy="22" r="6" fill={GL} opacity="0.65" />
      <path d="M22 40 Q20 52 55 52" stroke={GL} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.8" />
      <rect x="52" y="47" width="14" height="10" rx="3" fill={ac} opacity="0.85" />
    </>
  ),

  // ------------------------------------------------------------------
  // leg-curl — Curl femoral
  // ------------------------------------------------------------------
  "leg-curl": (ac) => (
    <>
      <rect x="10" y="30" width="60" height="8" rx="4" fill={S3} />
      <rect x="10" y="38" width="8" height="30" rx="4" fill={S3} />
      <rect x="62" y="38" width="8" height="30" rx="4" fill={S3} />
      <ellipse cx="40" cy="28" rx="18" ry="7" fill={GL} opacity="0.65" />
      <circle cx="22" cy="22" r="6" fill={GL} opacity="0.65" />
      <path d="M52 28 Q60 28 62 42" stroke={GL} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.8" />
      <rect x="58" y="38" width="12" height="10" rx="3" fill={ac} opacity="0.85" />
    </>
  ),

  // ------------------------------------------------------------------
  // hip-thrust — Empuje de cadera
  // ------------------------------------------------------------------
  "hip-thrust": (ac) => (
    <>
      <rect x="6" y="50" width="30" height="8" rx="4" fill={S3} />
      <rect x="8" y="34" width="64" height="5" rx="2.5" fill={ac} opacity="0.9" />
      <rect x="4" y="30" width="11" height="11" rx="3" fill={ac} opacity="0.55" />
      <rect x="65" y="30" width="11" height="11" rx="3" fill={ac} opacity="0.55" />
      <circle cx="18" cy="44" r="6" fill={GL} opacity="0.75" />
      <path d="M18 50 L36 50" stroke={GL} strokeWidth="6" strokeLinecap="round" opacity="0.65" />
      <rect x="30" y="30" width="16" height="20" rx="6" fill={GL} opacity="0.65" />
      <path d="M46 44 L58 52" stroke={GL} strokeWidth="5.5" strokeLinecap="round" opacity="0.8" />
      <path d="M58 52 L60 68" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.7" />
      <path d="M30 50 L24 66" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.65" />
    </>
  ),

  // ------------------------------------------------------------------
  // biceps-curl — Curl de bíceps (basado en el prototipo hammerCurl)
  // ------------------------------------------------------------------
  "biceps-curl": (ac) => (
    <>
      <circle cx="40" cy="14" r="7" fill={GL} opacity="0.75" />
      <rect x="32" y="22" width="16" height="20" rx="6" fill={GL} opacity="0.65" />
      <path d="M35 42 L32 70" stroke={GL} strokeWidth="5" strokeLinecap="round" opacity="0.65" />
      <path d="M45 42 L48 70" stroke={GL} strokeWidth="5" strokeLinecap="round" opacity="0.65" />
      <path d="M34 28 L20 34 L22 48" stroke={GL} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.85" />
      <rect x="14" y="45" width="14" height="6" rx="3" fill={ac} opacity="0.9" />
      <rect x="12" y="42" width="5" height="12" rx="2.5" fill={ac} opacity="0.65" />
      <rect x="23" y="42" width="5" height="12" rx="2.5" fill={ac} opacity="0.65" />
      <path d="M46 28 L58 38" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.55" />
    </>
  ),

  // ------------------------------------------------------------------
  // triceps-ext — Extensión de tríceps
  // ------------------------------------------------------------------
  "triceps-ext": (ac) => (
    <>
      <rect x="62" y="8" width="10" height="44" rx="4" fill={S3} />
      <circle cx="67" cy="16" r="4" fill={S2} stroke={ac} strokeWidth="1.8" opacity="0.9" />
      <path d="M63 16 Q48 20 40 28" stroke={ac} strokeWidth="2" strokeLinecap="round" opacity="0.75" />
      <circle cx="30" cy="18" r="7" fill={GL} opacity="0.75" />
      <rect x="23" y="26" width="14" height="18" rx="5" fill={GL} opacity="0.65" />
      <path d="M34 30 L40 28" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      <path d="M34 36 L40 44" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      <path d="M38 40 L42 46 L44 44" stroke={ac} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8" />
      <path d="M26 44 L22 68" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
      <path d="M34 44 L36 68" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
    </>
  ),

  // ------------------------------------------------------------------
  // lateral-raise — Elevación lateral
  // ------------------------------------------------------------------
  "lateral-raise": (ac) => (
    <>
      <circle cx="40" cy="16" r="7" fill={GL} opacity="0.75" />
      <rect x="33" y="24" width="14" height="18" rx="5" fill={GL} opacity="0.65" />
      <path d="M33 30 L12 26" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.85" />
      <path d="M47 30 L68 26" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.85" />
      <rect x="4" y="22" width="12" height="6" rx="3" fill={ac} opacity="0.9" />
      <rect x="64" y="22" width="12" height="6" rx="3" fill={ac} opacity="0.9" />
      <path d="M37 42 L33 68" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
      <path d="M43 42 L47 68" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
    </>
  ),

  // ------------------------------------------------------------------
  // cable — Cable / polea genérico
  // ------------------------------------------------------------------
  "cable": (ac) => (
    <>
      <rect x="60" y="8" width="12" height="64" rx="4" fill={S3} />
      <circle cx="66" cy="18" r="5" fill={S2} stroke={ac} strokeWidth="1.8" opacity="0.9" />
      <circle cx="66" cy="52" r="5" fill={S2} stroke={ac} strokeWidth="1.8" opacity="0.75" />
      <path d="M62 18 Q40 22 30 36" stroke={ac} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <circle cx="24" cy="26" r="7" fill={GL} opacity="0.75" />
      <rect x="17" y="34" width="14" height="18" rx="5" fill={GL} opacity="0.65" />
      <path d="M27 36 L30 36" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      <path d="M20 44 L12 58" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
      <path d="M28 44 L28 62" stroke={GL} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
    </>
  ),

  // ------------------------------------------------------------------
  // core-plank — Plancha / core
  // ------------------------------------------------------------------
  "core-plank": (ac) => (
    <>
      <rect x="8" y="68" width="64" height="4" rx="2" fill={S4} opacity="0.6" />
      <circle cx="18" cy="44" r="7" fill={GL} opacity="0.75" />
      <rect x="18" y="48" width="40" height="10" rx="5" fill={GL} opacity="0.65" />
      <path d="M18 52 L10 68" stroke={GL} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      <path d="M56 54 L60 68" stroke={GL} strokeWidth="5" strokeLinecap="round" opacity="0.75" />
      <path d="M50 56 L54 68" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.7" />
      <path d="M24 52 L52 52" stroke={ac} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="4 3" opacity="0.7" />
    </>
  ),

  // ------------------------------------------------------------------
  // cardio — Cardio / carrera
  // ------------------------------------------------------------------
  "cardio": (ac) => (
    <>
      <circle cx="40" cy="14" r="7" fill={GL} opacity="0.75" />
      <path d="M40 21 L36 42" stroke={GL} strokeWidth="6" strokeLinecap="round" opacity="0.65" />
      <path d="M38 28 L24 22" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.85" />
      <path d="M38 34 L52 38" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.85" />
      <path d="M34 42 L22 56" stroke={GL} strokeWidth="5.5" strokeLinecap="round" opacity="0.8" />
      <path d="M22 56 L18 68" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.7" />
      <path d="M38 42 L52 50" stroke={GL} strokeWidth="5.5" strokeLinecap="round" opacity="0.8" />
      <path d="M52 50 L60 42" stroke={GL} strokeWidth="4.5" strokeLinecap="round" opacity="0.7" />
      <path d="M10 72 L70 72" stroke={ac} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </>
  ),

  // ------------------------------------------------------------------
  // machine-generic — Máquina genérica (fallback)
  // ------------------------------------------------------------------
  "machine-generic": (ac) => (
    <>
      <rect x="12" y="10" width="56" height="60" rx="6" fill={S3} opacity="0.8" />
      <rect x="18" y="16" width="44" height="32" rx="4" fill={S4} opacity="0.7" />
      <rect x="22" y="20" width="36" height="22" rx="3" fill={S2} opacity="0.9" />
      <circle cx="26" cy="54" r="3" fill={ac} opacity="0.9" />
      <circle cx="36" cy="54" r="3" fill={ac} opacity="0.65" />
      <circle cx="46" cy="54" r="3" fill={ac} opacity="0.65" />
      <circle cx="56" cy="54" r="3" fill={ac} opacity="0.5" />
      <rect x="16" y="68" width="8" height="6" rx="2" fill={S3} />
      <rect x="56" y="68" width="8" height="6" rx="2" fill={S3} />
      <path d="M36 24 L40 36 L44 24" stroke={ac} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9" />
    </>
  ),
};

// ---------------------------------------------------------------------------
// Componente público
// ---------------------------------------------------------------------------

export type { ExerciseIconProps, ExerciseIconKey };

export function ExerciseIcon({
  icon,
  size = 40,
  color = colors.lime,
}: ExerciseIconProps & { style?: CSSProperties }) {
  const key = (icon in ICONS ? icon : "machine-generic") as ExerciseIconKey;
  const renderer = ICONS[key];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {renderer(color)}
    </svg>
  );
}
