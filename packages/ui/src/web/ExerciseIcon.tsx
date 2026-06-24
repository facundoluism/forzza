// ExerciseIcon — web (SVG nativo HTML)
// viewBox 0 0 80 80, stroke ~1.8, fill por capas.
// Color de acento parametrizable; colores de estructura desde tokens.ts.
// Regla: CERO hex sueltos — todos los colores vienen de tokens.

import type { CSSProperties } from "react";
import { colors } from "../tokens";
import type { ExerciseIconProps, ExerciseIconKey } from "../exerciseIconTypes";

// Colores estructurales del DS
const GL = colors.muted;

type IconRenderer = (ac: string) => React.ReactElement;

const ICONS: Record<ExerciseIconKey, IconRenderer> = {
  // ------------------------------------------------------------------
  // bench-press — Press de banca plano
  // ------------------------------------------------------------------
  "bench-press": (ac) => (
    <>
      {/* barra con discos (acento) */}
      <path d="M12 28 L68 28" stroke={ac} strokeWidth="5" strokeLinecap="round" />
      <rect x="13" y="20" width="6" height="16" rx="3" stroke={ac} strokeWidth="4" fill="none" />
      <rect x="61" y="20" width="6" height="16" rx="3" stroke={ac} strokeWidth="4" fill="none" />
      {/* banco (estructura) */}
      <path d="M18 52 L58 52" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      <path d="M24 52 L24 68" stroke={GL} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M52 52 L52 68" stroke={GL} strokeWidth="4.5" strokeLinecap="round" />
    </>
  ),

  // ------------------------------------------------------------------
  // incline-press — Press inclinado
  // ------------------------------------------------------------------
  "incline-press": (ac) => (
    <>
      {/* barra con discos arriba (acento) */}
      <path d="M14 18 L66 18" stroke={ac} strokeWidth="5" strokeLinecap="round" />
      <rect x="15" y="10" width="6" height="16" rx="3" stroke={ac} strokeWidth="4" fill="none" />
      <rect x="59" y="10" width="6" height="16" rx="3" stroke={ac} strokeWidth="4" fill="none" />
      {/* banco inclinado: respaldo + asiento + patas (estructura) */}
      <path d="M24 64 L48 40" stroke={GL} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 64 L44 64" stroke={GL} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 64 L30 72" stroke={GL} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M40 64 L40 72" stroke={GL} strokeWidth="4.5" strokeLinecap="round" />
    </>
  ),

  // ------------------------------------------------------------------
  // decline-press — Press declinado
  // ------------------------------------------------------------------
  "decline-press": (ac) => (
    <>
      {/* barra con discos (acento) */}
      <path d="M14 20 L66 20" stroke={ac} strokeWidth="5" strokeLinecap="round" />
      <rect x="15" y="12" width="6" height="16" rx="3" stroke={ac} strokeWidth="4" fill="none" />
      <rect x="59" y="12" width="6" height="16" rx="3" stroke={ac} strokeWidth="4" fill="none" />
      {/* banco declinado: respaldo descendente + asiento + patas (estructura) */}
      <path d="M32 40 L56 64" stroke={GL} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M36 64 L56 64" stroke={GL} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 64 L40 72" stroke={GL} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M52 64 L52 72" stroke={GL} strokeWidth="4.5" strokeLinecap="round" />
    </>
  ),

  // ------------------------------------------------------------------
  // overhead-press — Press militar / overhead
  // ------------------------------------------------------------------
  "overhead-press": (ac) => (
    <>
      {/* asiento vertical con respaldo recto (estructura) */}
      <path d="M30 34 L30 64" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      <path d="M30 64 L52 64" stroke={GL} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M36 64 L36 72" stroke={GL} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M48 64 L48 72" stroke={GL} strokeWidth="4.5" strokeLinecap="round" />
      {/* barra con discos arriba del todo (acento) */}
      <path d="M14 16 L66 16" stroke={ac} strokeWidth="5" strokeLinecap="round" />
      <rect x="15" y="8" width="6" height="16" rx="3" stroke={ac} strokeWidth="4" fill="none" />
      <rect x="59" y="8" width="6" height="16" rx="3" stroke={ac} strokeWidth="4" fill="none" />
    </>
  ),

  // ------------------------------------------------------------------
  // chest-fly — Aperturas
  // ------------------------------------------------------------------
  "chest-fly": (ac) => (
    <>
      {/* pec-deck: asiento central y poste (estructura) */}
      <path d="M40 36 L40 64" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      <path d="M30 64 L50 64" stroke={GL} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      {/* brazos / almohadillas que se abren en arco (acento) */}
      <path d="M40 40 Q22 40 16 24" stroke={ac} strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M40 40 Q58 40 64 24" stroke={ac} strokeWidth="5" strokeLinecap="round" fill="none" />
      <rect x="11" y="16" width="6" height="14" rx="3" stroke={ac} strokeWidth="4" fill="none" />
      <rect x="63" y="16" width="6" height="14" rx="3" stroke={ac} strokeWidth="4" fill="none" />
    </>
  ),

  // ------------------------------------------------------------------
  // pulldown — Jalón al pecho
  // ------------------------------------------------------------------
  "pulldown": (ac) => (
    <>
      {/* poste vertical de la torre (estructura) */}
      <path d="M62 12 L62 68" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      <path d="M52 68 L72 68" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      {/* polea arriba */}
      <path d="M62 14 L40 14" stroke={GL} strokeWidth="4.5" strokeLinecap="round" />
      {/* cable + barra ancha colgando (acento) */}
      <path d="M30 16 L30 30" stroke={ac} strokeWidth="4" strokeLinecap="round" />
      <path d="M14 32 L46 32" stroke={ac} strokeWidth="5" strokeLinecap="round" />
      <path d="M18 32 L18 40" stroke={ac} strokeWidth="4" strokeLinecap="round" />
      <path d="M42 32 L42 40" stroke={ac} strokeWidth="4" strokeLinecap="round" />
    </>
  ),

  // ------------------------------------------------------------------
  // pullup — Dominadas
  // ------------------------------------------------------------------
  "pullup": (ac) => (
    <>
      {/* soportes verticales (estructura) */}
      <path d="M16 20 L16 68" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      <path d="M64 20 L64 68" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      <path d="M8 68 L24 68" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      <path d="M56 68 L72 68" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      {/* barra alta con cables colgando (acento) */}
      <path d="M16 18 L64 18" stroke={ac} strokeWidth="5" strokeLinecap="round" />
      <path d="M32 20 L32 34" stroke={ac} strokeWidth="4" strokeLinecap="round" />
      <path d="M48 20 L48 34" stroke={ac} strokeWidth="4" strokeLinecap="round" />
    </>
  ),

  // ------------------------------------------------------------------
  // row — Remo
  // ------------------------------------------------------------------
  "row": (ac) => (
    <>
      {/* poste de polea baja, asiento y reposapiés (estructura) */}
      <path d="M66 22 L66 60" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      <path d="M20 56 L48 56" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      <path d="M14 48 L14 60" stroke={GL} strokeWidth="4.5" strokeLinecap="round" />
      {/* cable horizontal hacia el mango (acento) */}
      <path d="M64 50 L30 50" stroke={ac} strokeWidth="5" strokeLinecap="round" />
      <path d="M30 42 L30 58" stroke={ac} strokeWidth="5" strokeLinecap="round" />
    </>
  ),

  // ------------------------------------------------------------------
  // deadlift — Peso muerto
  // ------------------------------------------------------------------
  "deadlift": (ac) => (
    <>
      {/* línea de piso (estructura) */}
      <path d="M8 66 L72 66" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      {/* barra baja con discos grandes apoyados en el suelo (acento) */}
      <path d="M14 50 L66 50" stroke={ac} strokeWidth="5" strokeLinecap="round" />
      <rect x="11" y="36" width="9" height="28" rx="4" stroke={ac} strokeWidth="4.5" fill="none" />
      <rect x="60" y="36" width="9" height="28" rx="4" stroke={ac} strokeWidth="4.5" fill="none" />
    </>
  ),

  // ------------------------------------------------------------------
  // squat — Sentadilla
  // ------------------------------------------------------------------
  "squat": (ac) => (
    <>
      {/* postes del rack */}
      <path d="M20 16 L20 70" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      <path d="M60 16 L60 70" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      {/* base */}
      <path d="M12 70 L28 70" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      <path d="M52 70 L68 70" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      {/* barra con discos (acento) */}
      <path d="M8 32 L72 32" stroke={ac} strokeWidth="5" strokeLinecap="round" />
      <rect x="9" y="24" width="6" height="16" rx="3" stroke={ac} strokeWidth="4" fill="none" />
      <rect x="65" y="24" width="6" height="16" rx="3" stroke={ac} strokeWidth="4" fill="none" />
    </>
  ),

  // ------------------------------------------------------------------
  // lunge — Zancada
  // ------------------------------------------------------------------
  "lunge": (ac) => (
    <>
      {/* línea de piso (estructura) */}
      <path d="M10 66 L70 66" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      {/* dos mancuernas verticales, una a cada lado (acento) */}
      <path d="M20 22 L20 52" stroke={ac} strokeWidth="5" strokeLinecap="round" />
      <path d="M14 26 L26 26" stroke={ac} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M14 48 L26 48" stroke={ac} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M60 22 L60 52" stroke={ac} strokeWidth="5" strokeLinecap="round" />
      <path d="M54 26 L66 26" stroke={ac} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M54 48 L66 48" stroke={ac} strokeWidth="4.5" strokeLinecap="round" />
    </>
  ),

  // ------------------------------------------------------------------
  // leg-extension — Extensión de cuádriceps en máquina
  // ------------------------------------------------------------------
  "leg-extension": (ac) => (
    <>
      {/* asiento con respaldo (estructura) */}
      <path d="M18 26 L18 50" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      <path d="M18 50 L46 50" stroke={GL} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 50 L22 64" stroke={GL} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M46 50 L46 64" stroke={GL} strokeWidth="4.5" strokeLinecap="round" />
      {/* brazo de palanca + rodillo acolchado abajo adelante (acento) */}
      <path d="M46 52 L58 64" stroke={ac} strokeWidth="5" strokeLinecap="round" />
      <rect x="52" y="62" width="14" height="10" rx="5" stroke={ac} strokeWidth="4.5" fill="none" />
    </>
  ),

  // ------------------------------------------------------------------
  // leg-curl — Curl femoral
  // ------------------------------------------------------------------
  "leg-curl": (ac) => (
    <>
      {/* camilla / banco con patas (estructura) */}
      <path d="M14 38 L62 38" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      <path d="M18 38 L18 56" stroke={GL} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M50 38 L50 56" stroke={GL} strokeWidth="4.5" strokeLinecap="round" />
      {/* brazo + rodillo acolchado abajo atrás (acento) */}
      <path d="M60 40 L60 56" stroke={ac} strokeWidth="5" strokeLinecap="round" />
      <rect x="53" y="54" width="14" height="10" rx="5" stroke={ac} strokeWidth="4.5" fill="none" />
    </>
  ),

  // ------------------------------------------------------------------
  // hip-thrust — Empuje de cadera
  // ------------------------------------------------------------------
  "hip-thrust": (ac) => (
    <>
      {/* banco bajo horizontal (estructura) */}
      <path d="M14 50 L54 50" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      <path d="M18 50 L18 64" stroke={GL} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M50 50 L50 64" stroke={GL} strokeWidth="4.5" strokeLinecap="round" />
      {/* barra con discos cruzando a la altura de la cadera (acento) */}
      <path d="M14 34 L66 34" stroke={ac} strokeWidth="5" strokeLinecap="round" />
      <rect x="15" y="26" width="6" height="16" rx="3" stroke={ac} strokeWidth="4" fill="none" />
      <rect x="59" y="26" width="6" height="16" rx="3" stroke={ac} strokeWidth="4" fill="none" />
    </>
  ),

  // ------------------------------------------------------------------
  // biceps-curl — Curl de bíceps (basado en el prototipo hammerCurl)
  // ------------------------------------------------------------------
  "biceps-curl": (ac) => (
    <>
      {/* mango */}
      <path d="M30 40 L50 40" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      {/* discos izquierda */}
      <rect x="13" y="28" width="7" height="24" rx="3" stroke={ac} strokeWidth="4.5" fill="none" />
      <rect x="23" y="32" width="5" height="16" rx="2.5" stroke={GL} strokeWidth="4" fill="none" />
      {/* discos derecha */}
      <rect x="60" y="28" width="7" height="24" rx="3" stroke={ac} strokeWidth="4.5" fill="none" />
      <rect x="52" y="32" width="5" height="16" rx="2.5" stroke={GL} strokeWidth="4" fill="none" />
    </>
  ),

  // ------------------------------------------------------------------
  // triceps-ext — Extensión de tríceps
  // ------------------------------------------------------------------
  "triceps-ext": (ac) => (
    <>
      {/* poste de la torre + brazo de polea alta (estructura) */}
      <path d="M40 14 L40 68" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      <path d="M30 68 L50 68" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      <path d="M40 16 L22 16" stroke={GL} strokeWidth="4.5" strokeLinecap="round" />
      {/* cuerda doble bajando desde la polea (acento) */}
      <path d="M22 18 L16 44" stroke={ac} strokeWidth="5" strokeLinecap="round" />
      <path d="M22 18 L28 44" stroke={ac} strokeWidth="5" strokeLinecap="round" />
    </>
  ),

  // ------------------------------------------------------------------
  // lateral-raise — Elevación lateral
  // ------------------------------------------------------------------
  "lateral-raise": (ac) => (
    <>
      {/* cabeza/hombros + cuerpo + brazos en V (estructura) */}
      <circle cx="40" cy="42" r="6" stroke={GL} strokeWidth="4.5" fill="none" />
      <path d="M40 48 L40 64" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      <path d="M35 39 L20 32" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      <path d="M45 39 L60 32" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      {/* mancuernas a los lados (acento) */}
      <path d="M18 24 L18 40" stroke={ac} strokeWidth="5" strokeLinecap="round" />
      <path d="M62 24 L62 40" stroke={ac} strokeWidth="5" strokeLinecap="round" />
    </>
  ),

  // ------------------------------------------------------------------
  // cable — Cable / polea genérico
  // ------------------------------------------------------------------
  "cable": (ac) => (
    <>
      {/* torre de poleas: poste vertical (estructura) */}
      <path d="M52 10 L52 70" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      <path d="M44 70 L60 70" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      {/* dos poleas */}
      <circle cx="52" cy="20" r="6" stroke={GL} strokeWidth="4" fill="none" />
      <circle cx="52" cy="52" r="6" stroke={GL} strokeWidth="4" fill="none" />
      {/* cable con mango (acento) */}
      <path d="M46 20 L26 32" stroke={ac} strokeWidth="5" strokeLinecap="round" />
      <path d="M20 28 L20 40" stroke={ac} strokeWidth="5" strokeLinecap="round" />
    </>
  ),

  // ------------------------------------------------------------------
  // core-plank — Plancha / core
  // ------------------------------------------------------------------
  "core-plank": (ac) => (
    <>
      {/* torso con borde redondeado (estructura) */}
      <rect x="29" y="14" width="22" height="50" rx="11" stroke={GL} strokeWidth="5" fill="none" />
      {/* abdominales (acento) */}
      <path d="M35 30 L45 30" stroke={ac} strokeWidth="4" strokeLinecap="round" />
      <path d="M35 39 L45 39" stroke={ac} strokeWidth="4" strokeLinecap="round" />
      <path d="M35 48 L45 48" stroke={ac} strokeWidth="4" strokeLinecap="round" />
    </>
  ),

  // ------------------------------------------------------------------
  // cardio — Cardio / carrera
  // ------------------------------------------------------------------
  "cardio": (ac) => (
    <>
      {/* deck de la cinta */}
      <path d="M10 60 L52 53" stroke={GL} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 60 L16 68" stroke={GL} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M50 53 L54 68" stroke={GL} strokeWidth="4.5" strokeLinecap="round" />
      {/* poste de consola */}
      <path d="M52 53 L60 26" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      {/* consola (acento) */}
      <rect x="53" y="14" width="18" height="13" rx="3" stroke={ac} strokeWidth="4" fill="none" />
    </>
  ),

  // ------------------------------------------------------------------
  // machine-generic — Máquina genérica (fallback)
  // ------------------------------------------------------------------
  "machine-generic": (ac) => (
    <>
      {/* asiento con respaldo (estructura) */}
      <path d="M22 26 L22 50" stroke={GL} strokeWidth="5" strokeLinecap="round" />
      <path d="M22 50 L44 50" stroke={GL} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 50 L26 66" stroke={GL} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M40 50 L40 66" stroke={GL} strokeWidth="4.5" strokeLinecap="round" />
      {/* stack de pesas con pin de selección (acento) */}
      <rect x="54" y="20" width="16" height="40" rx="3" stroke={ac} strokeWidth="4" fill="none" />
      <path d="M54 32 L70 32" stroke={ac} strokeWidth="4" strokeLinecap="round" />
      <path d="M54 44 L70 44" stroke={ac} strokeWidth="4" strokeLinecap="round" />
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
