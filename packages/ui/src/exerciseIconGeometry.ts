// exerciseIconGeometry.ts — Geometría compartida de los 21 íconos de ejercicio.
// viewBox 0 0 80 80. Fuente de verdad para native (react-native-svg) y referencia
// para web (que la embebe directamente como JSX SVG HTML).
//
// IMPORTANTE: web y native rinden desde esta misma fuente. Si cambiás coordenadas
// aquí, ambas plataformas se actualizan; si modificás SOLO el web (ExerciseIcon.tsx),
// debés reflejar el cambio aquí para mantener sincronía.
//
// Colores de acento ("ac") se pasan en runtime — aquí se representan como la
// constante simbólica "__ac__" y se reemplazan en render.
// Colores estructurales se usan directamente desde tokens.ts.

import { colors } from "./tokens";
import type { ExerciseIconKey } from "./exerciseIconTypes";

const GL = colors.muted;

// ---------------------------------------------------------------------------
// Tipos de formas soportadas
// ---------------------------------------------------------------------------

export interface RectShape {
  type: "rect";
  x: number; y: number; width: number; height: number;
  rx?: number;
  /** Color de relleno. Acepta el sentinel AC, un color de token, o "none" (line-icon). */
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinejoin?: "round" | "miter" | "bevel";
  opacity?: number;
  transform?: string;
}

export interface CircleShape {
  type: "circle";
  cx: number; cy: number; r: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}

export interface EllipseShape {
  type: "ellipse";
  cx: number; cy: number; rx: number; ry: number;
  fill: string;
  opacity?: number;
}

export interface PathShape {
  type: "path";
  d: string;
  stroke: string;
  strokeWidth: number;
  strokeLinecap?: "round" | "butt" | "square";
  strokeLinejoin?: "round" | "miter" | "bevel";
  strokeDasharray?: string;
  fill?: string;
  opacity?: number;
}

export type Shape = RectShape | CircleShape | EllipseShape | PathShape;

// Sentinel para color de acento (reemplazado en render)
const AC = "__ac__";

// ---------------------------------------------------------------------------
// Helper: color de acento con opacidad
// En render se debe interpretar AC como el color de acento pasado en props.
// La opacidad se aplica con el atributo opacity de la forma, no mezclando el color.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Definiciones de los 21 íconos
// Las coordenadas son EXACTAMENTE las mismas que en web/ExerciseIcon.tsx.
// ---------------------------------------------------------------------------

export const EXERCISE_ICON_GEOMETRY: Record<ExerciseIconKey, Shape[]> = {

  // --------------------------------------------------------------------------
  // bench-press — Press de banca plano
  // --------------------------------------------------------------------------
  "bench-press": [
    { type: "path", d: "M12 28 L68 28", stroke: AC, strokeWidth: 5, strokeLinecap: "round" },
    { type: "rect", x: 13, y: 20, width: 6, height: 16, rx: 3, stroke: AC, strokeWidth: 4, fill: "none" },
    { type: "rect", x: 61, y: 20, width: 6, height: 16, rx: 3, stroke: AC, strokeWidth: 4, fill: "none" },
    { type: "path", d: "M18 52 L58 52", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M24 52 L24 68", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round" },
    { type: "path", d: "M52 52 L52 68", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round" },
  ],

  // --------------------------------------------------------------------------
  // incline-press — Press inclinado
  // --------------------------------------------------------------------------
  "incline-press": [
    { type: "path", d: "M14 18 L66 18", stroke: AC, strokeWidth: 5, strokeLinecap: "round" },
    { type: "rect", x: 15, y: 10, width: 6, height: 16, rx: 3, stroke: AC, strokeWidth: 4, fill: "none" },
    { type: "rect", x: 59, y: 10, width: 6, height: 16, rx: 3, stroke: AC, strokeWidth: 4, fill: "none" },
    { type: "path", d: "M24 64 L48 40", stroke: GL, strokeWidth: 5, strokeLinecap: "round", strokeLinejoin: "round" },
    { type: "path", d: "M24 64 L44 64", stroke: GL, strokeWidth: 5, strokeLinecap: "round", strokeLinejoin: "round" },
    { type: "path", d: "M30 64 L30 72", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round" },
    { type: "path", d: "M40 64 L40 72", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round" },
  ],

  // --------------------------------------------------------------------------
  // decline-press — Press declinado
  // --------------------------------------------------------------------------
  "decline-press": [
    { type: "path", d: "M14 20 L66 20", stroke: AC, strokeWidth: 5, strokeLinecap: "round" },
    { type: "rect", x: 15, y: 12, width: 6, height: 16, rx: 3, stroke: AC, strokeWidth: 4, fill: "none" },
    { type: "rect", x: 59, y: 12, width: 6, height: 16, rx: 3, stroke: AC, strokeWidth: 4, fill: "none" },
    { type: "path", d: "M32 40 L56 64", stroke: GL, strokeWidth: 5, strokeLinecap: "round", strokeLinejoin: "round" },
    { type: "path", d: "M36 64 L56 64", stroke: GL, strokeWidth: 5, strokeLinecap: "round", strokeLinejoin: "round" },
    { type: "path", d: "M40 64 L40 72", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round" },
    { type: "path", d: "M52 64 L52 72", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round" },
  ],

  // --------------------------------------------------------------------------
  // overhead-press — Press militar / overhead
  // --------------------------------------------------------------------------
  "overhead-press": [
    { type: "path", d: "M30 34 L30 64", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M30 64 L52 64", stroke: GL, strokeWidth: 5, strokeLinecap: "round", strokeLinejoin: "round" },
    { type: "path", d: "M36 64 L36 72", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round" },
    { type: "path", d: "M48 64 L48 72", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round" },
    { type: "path", d: "M14 16 L66 16", stroke: AC, strokeWidth: 5, strokeLinecap: "round" },
    { type: "rect", x: 15, y: 8, width: 6, height: 16, rx: 3, stroke: AC, strokeWidth: 4, fill: "none" },
    { type: "rect", x: 59, y: 8, width: 6, height: 16, rx: 3, stroke: AC, strokeWidth: 4, fill: "none" },
  ],

  // --------------------------------------------------------------------------
  // chest-fly — Aperturas
  // --------------------------------------------------------------------------
  "chest-fly": [
    { type: "path", d: "M40 36 L40 64", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M30 64 L50 64", stroke: GL, strokeWidth: 5, strokeLinecap: "round", strokeLinejoin: "round" },
    { type: "path", d: "M40 40 Q22 40 16 24", stroke: AC, strokeWidth: 5, strokeLinecap: "round", fill: "none" },
    { type: "path", d: "M40 40 Q58 40 64 24", stroke: AC, strokeWidth: 5, strokeLinecap: "round", fill: "none" },
    { type: "rect", x: 11, y: 16, width: 6, height: 14, rx: 3, stroke: AC, strokeWidth: 4, fill: "none" },
    { type: "rect", x: 63, y: 16, width: 6, height: 14, rx: 3, stroke: AC, strokeWidth: 4, fill: "none" },
  ],

  // --------------------------------------------------------------------------
  // pulldown — Jalón al pecho
  // --------------------------------------------------------------------------
  "pulldown": [
    { type: "path", d: "M62 12 L62 68", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M52 68 L72 68", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M62 14 L40 14", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round" },
    { type: "path", d: "M30 16 L30 30", stroke: AC, strokeWidth: 4, strokeLinecap: "round" },
    { type: "path", d: "M14 32 L46 32", stroke: AC, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M18 32 L18 40", stroke: AC, strokeWidth: 4, strokeLinecap: "round" },
    { type: "path", d: "M42 32 L42 40", stroke: AC, strokeWidth: 4, strokeLinecap: "round" },
  ],

  // --------------------------------------------------------------------------
  // pullup — Dominadas
  // --------------------------------------------------------------------------
  "pullup": [
    { type: "path", d: "M16 20 L16 68", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M64 20 L64 68", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M8 68 L24 68", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M56 68 L72 68", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M16 18 L64 18", stroke: AC, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M32 20 L32 34", stroke: AC, strokeWidth: 4, strokeLinecap: "round" },
    { type: "path", d: "M48 20 L48 34", stroke: AC, strokeWidth: 4, strokeLinecap: "round" },
  ],

  // --------------------------------------------------------------------------
  // row — Remo
  // --------------------------------------------------------------------------
  "row": [
    { type: "path", d: "M66 22 L66 60", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M20 56 L48 56", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M14 48 L14 60", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round" },
    { type: "path", d: "M64 50 L30 50", stroke: AC, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M30 42 L30 58", stroke: AC, strokeWidth: 5, strokeLinecap: "round" },
  ],

  // --------------------------------------------------------------------------
  // deadlift — Peso muerto
  // --------------------------------------------------------------------------
  "deadlift": [
    { type: "path", d: "M8 66 L72 66", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M14 50 L66 50", stroke: AC, strokeWidth: 5, strokeLinecap: "round" },
    { type: "rect", x: 11, y: 36, width: 9, height: 28, rx: 4, stroke: AC, strokeWidth: 4.5, fill: "none" },
    { type: "rect", x: 60, y: 36, width: 9, height: 28, rx: 4, stroke: AC, strokeWidth: 4.5, fill: "none" },
  ],

  // --------------------------------------------------------------------------
  // squat — Sentadilla
  // --------------------------------------------------------------------------
  "squat": [
    { type: "path", d: "M20 16 L20 70", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M60 16 L60 70", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M12 70 L28 70", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M52 70 L68 70", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M8 32 L72 32", stroke: AC, strokeWidth: 5, strokeLinecap: "round" },
    { type: "rect", x: 9, y: 24, width: 6, height: 16, rx: 3, stroke: AC, strokeWidth: 4, fill: "none" },
    { type: "rect", x: 65, y: 24, width: 6, height: 16, rx: 3, stroke: AC, strokeWidth: 4, fill: "none" },
  ],

  // --------------------------------------------------------------------------
  // lunge — Zancada
  // --------------------------------------------------------------------------
  "lunge": [
    { type: "path", d: "M10 66 L70 66", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M20 22 L20 52", stroke: AC, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M14 26 L26 26", stroke: AC, strokeWidth: 4.5, strokeLinecap: "round" },
    { type: "path", d: "M14 48 L26 48", stroke: AC, strokeWidth: 4.5, strokeLinecap: "round" },
    { type: "path", d: "M60 22 L60 52", stroke: AC, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M54 26 L66 26", stroke: AC, strokeWidth: 4.5, strokeLinecap: "round" },
    { type: "path", d: "M54 48 L66 48", stroke: AC, strokeWidth: 4.5, strokeLinecap: "round" },
  ],

  // --------------------------------------------------------------------------
  // leg-extension — Extensión de cuádriceps en máquina
  // --------------------------------------------------------------------------
  "leg-extension": [
    { type: "path", d: "M18 26 L18 50", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M18 50 L46 50", stroke: GL, strokeWidth: 5, strokeLinecap: "round", strokeLinejoin: "round" },
    { type: "path", d: "M22 50 L22 64", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round" },
    { type: "path", d: "M46 50 L46 64", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round" },
    { type: "path", d: "M46 52 L58 64", stroke: AC, strokeWidth: 5, strokeLinecap: "round" },
    { type: "rect", x: 52, y: 62, width: 14, height: 10, rx: 5, stroke: AC, strokeWidth: 4.5, fill: "none" },
  ],

  // --------------------------------------------------------------------------
  // leg-curl — Curl femoral
  // --------------------------------------------------------------------------
  "leg-curl": [
    { type: "path", d: "M14 38 L62 38", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M18 38 L18 56", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round" },
    { type: "path", d: "M50 38 L50 56", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round" },
    { type: "path", d: "M60 40 L60 56", stroke: AC, strokeWidth: 5, strokeLinecap: "round" },
    { type: "rect", x: 53, y: 54, width: 14, height: 10, rx: 5, stroke: AC, strokeWidth: 4.5, fill: "none" },
  ],

  // --------------------------------------------------------------------------
  // hip-thrust — Empuje de cadera
  // --------------------------------------------------------------------------
  "hip-thrust": [
    { type: "path", d: "M14 50 L54 50", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M18 50 L18 64", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round" },
    { type: "path", d: "M50 50 L50 64", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round" },
    { type: "path", d: "M14 34 L66 34", stroke: AC, strokeWidth: 5, strokeLinecap: "round" },
    { type: "rect", x: 15, y: 26, width: 6, height: 16, rx: 3, stroke: AC, strokeWidth: 4, fill: "none" },
    { type: "rect", x: 59, y: 26, width: 6, height: 16, rx: 3, stroke: AC, strokeWidth: 4, fill: "none" },
  ],

  // --------------------------------------------------------------------------
  // biceps-curl — Curl de bíceps
  // --------------------------------------------------------------------------
  "biceps-curl": [
    { type: "path", d: "M30 40 L50 40", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "rect", x: 13, y: 28, width: 7, height: 24, rx: 3, stroke: AC, strokeWidth: 4.5, fill: "none" },
    { type: "rect", x: 23, y: 32, width: 5, height: 16, rx: 2.5, stroke: GL, strokeWidth: 4, fill: "none" },
    { type: "rect", x: 60, y: 28, width: 7, height: 24, rx: 3, stroke: AC, strokeWidth: 4.5, fill: "none" },
    { type: "rect", x: 52, y: 32, width: 5, height: 16, rx: 2.5, stroke: GL, strokeWidth: 4, fill: "none" },
  ],

  // --------------------------------------------------------------------------
  // triceps-ext — Extensión de tríceps
  // --------------------------------------------------------------------------
  "triceps-ext": [
    { type: "path", d: "M40 14 L40 68", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M30 68 L50 68", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M40 16 L22 16", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round" },
    { type: "path", d: "M22 18 L16 44", stroke: AC, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M22 18 L28 44", stroke: AC, strokeWidth: 5, strokeLinecap: "round" },
  ],

  // --------------------------------------------------------------------------
  // lateral-raise — Elevación lateral
  // --------------------------------------------------------------------------
  "lateral-raise": [
    { type: "circle", cx: 40, cy: 42, r: 6, stroke: GL, strokeWidth: 4.5, fill: "none" },
    { type: "path", d: "M40 48 L40 64", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M35 39 L20 32", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M45 39 L60 32", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M18 24 L18 40", stroke: AC, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M62 24 L62 40", stroke: AC, strokeWidth: 5, strokeLinecap: "round" },
  ],

  // --------------------------------------------------------------------------
  // cable — Cable / polea genérico
  // --------------------------------------------------------------------------
  "cable": [
    { type: "path", d: "M52 10 L52 70", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M44 70 L60 70", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "circle", cx: 52, cy: 20, r: 6, stroke: GL, strokeWidth: 4, fill: "none" },
    { type: "circle", cx: 52, cy: 52, r: 6, stroke: GL, strokeWidth: 4, fill: "none" },
    { type: "path", d: "M46 20 L26 32", stroke: AC, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M20 28 L20 40", stroke: AC, strokeWidth: 5, strokeLinecap: "round" },
  ],

  // --------------------------------------------------------------------------
  // core-plank — Plancha / core
  // --------------------------------------------------------------------------
  "core-plank": [
    { type: "rect", x: 29, y: 14, width: 22, height: 50, rx: 11, stroke: GL, strokeWidth: 5, fill: "none" },
    { type: "path", d: "M35 30 L45 30", stroke: AC, strokeWidth: 4, strokeLinecap: "round" },
    { type: "path", d: "M35 39 L45 39", stroke: AC, strokeWidth: 4, strokeLinecap: "round" },
    { type: "path", d: "M35 48 L45 48", stroke: AC, strokeWidth: 4, strokeLinecap: "round" },
  ],

  // --------------------------------------------------------------------------
  // cardio — Cardio / carrera
  // --------------------------------------------------------------------------
  "cardio": [
    { type: "path", d: "M10 60 L52 53", stroke: GL, strokeWidth: 5, strokeLinecap: "round", strokeLinejoin: "round" },
    { type: "path", d: "M12 60 L16 68", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round" },
    { type: "path", d: "M50 53 L54 68", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round" },
    { type: "path", d: "M52 53 L60 26", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "rect", x: 53, y: 14, width: 18, height: 13, rx: 3, stroke: AC, strokeWidth: 4, fill: "none" },
  ],

  // --------------------------------------------------------------------------
  // machine-generic — Máquina genérica (fallback)
  // --------------------------------------------------------------------------
  "machine-generic": [
    { type: "path", d: "M22 26 L22 50", stroke: GL, strokeWidth: 5, strokeLinecap: "round" },
    { type: "path", d: "M22 50 L44 50", stroke: GL, strokeWidth: 5, strokeLinecap: "round", strokeLinejoin: "round" },
    { type: "path", d: "M26 50 L26 66", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round" },
    { type: "path", d: "M40 50 L40 66", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round" },
    { type: "rect", x: 54, y: 20, width: 16, height: 40, rx: 3, stroke: AC, strokeWidth: 4, fill: "none" },
    { type: "path", d: "M54 32 L70 32", stroke: AC, strokeWidth: 4, strokeLinecap: "round" },
    { type: "path", d: "M54 44 L70 44", stroke: AC, strokeWidth: 4, strokeLinecap: "round" },
  ],
};

// Sentinel exportado para que los renderers sepan qué reemplazar
export const ACCENT_SENTINEL = AC;
