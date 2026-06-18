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

const S2 = colors.surface2;
const S3 = colors.surface3;
const S4 = colors.surface4;
const GL = colors.muted;

// ---------------------------------------------------------------------------
// Tipos de formas soportadas
// ---------------------------------------------------------------------------

export interface RectShape {
  type: "rect";
  x: number; y: number; width: number; height: number;
  rx?: number;
  fill: string;
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
    { type: "rect", x: 10, y: 46, width: 60, height: 8, rx: 4, fill: S3 },
    { type: "rect", x: 6, y: 52, width: 4, height: 20, rx: 2, fill: S3 },
    { type: "rect", x: 70, y: 52, width: 4, height: 20, rx: 2, fill: S3 },
    { type: "rect", x: 8, y: 26, width: 64, height: 5, rx: 2.5, fill: AC, opacity: 0.9 },
    { type: "rect", x: 4, y: 22, width: 12, height: 12, rx: 3, fill: AC, opacity: 0.55 },
    { type: "rect", x: 64, y: 22, width: 12, height: 12, rx: 3, fill: AC, opacity: 0.55 },
    { type: "ellipse", cx: 40, cy: 40, rx: 10, ry: 6, fill: GL, opacity: 0.65 },
    { type: "path", d: "M30 40 L18 28", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.8 },
    { type: "path", d: "M50 40 L62 28", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.8 },
    { type: "circle", cx: 40, cy: 48, r: 6, fill: GL, opacity: 0.65 },
  ],

  // --------------------------------------------------------------------------
  // incline-press — Press inclinado
  // --------------------------------------------------------------------------
  "incline-press": [
    { type: "rect", x: 8, y: 22, width: 64, height: 5, rx: 2.5, fill: AC, opacity: 0.9 },
    { type: "rect", x: 4, y: 18, width: 11, height: 11, rx: 3, fill: AC, opacity: 0.55 },
    { type: "rect", x: 65, y: 18, width: 11, height: 11, rx: 3, fill: AC, opacity: 0.55 },
    { type: "rect", x: 14, y: 50, width: 50, height: 7, rx: 3.5, fill: S3, transform: "rotate(-28 39 53)" },
    { type: "rect", x: 6, y: 56, width: 4, height: 18, rx: 2, fill: S3 },
    { type: "rect", x: 68, y: 44, width: 4, height: 18, rx: 2, fill: S3 },
    { type: "circle", cx: 32, cy: 44, r: 6, fill: GL, opacity: 0.65 },
    { type: "path", d: "M32 50 L28 68", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.6 },
    { type: "path", d: "M32 38 L50 26", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.8 },
    { type: "path", d: "M32 38 L14 30", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.8 },
  ],

  // --------------------------------------------------------------------------
  // decline-press — Press declinado
  // --------------------------------------------------------------------------
  "decline-press": [
    { type: "rect", x: 8, y: 28, width: 64, height: 5, rx: 2.5, fill: AC, opacity: 0.9 },
    { type: "rect", x: 4, y: 24, width: 11, height: 11, rx: 3, fill: AC, opacity: 0.55 },
    { type: "rect", x: 65, y: 24, width: 11, height: 11, rx: 3, fill: AC, opacity: 0.55 },
    { type: "rect", x: 14, y: 44, width: 50, height: 7, rx: 3.5, fill: S3, transform: "rotate(20 39 47)" },
    { type: "rect", x: 6, y: 44, width: 4, height: 22, rx: 2, fill: S3 },
    { type: "rect", x: 70, y: 38, width: 4, height: 22, rx: 2, fill: S3 },
    { type: "circle", cx: 48, cy: 42, r: 6, fill: GL, opacity: 0.65 },
    { type: "path", d: "M48 48 L52 65", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.6 },
    { type: "path", d: "M42 42 L28 34", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.8 },
    { type: "path", d: "M54 38 L62 32", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.8 },
  ],

  // --------------------------------------------------------------------------
  // overhead-press — Press militar / overhead
  // --------------------------------------------------------------------------
  "overhead-press": [
    { type: "rect", x: 8, y: 16, width: 64, height: 5, rx: 2.5, fill: AC, opacity: 0.9 },
    { type: "rect", x: 4, y: 12, width: 11, height: 11, rx: 3, fill: AC, opacity: 0.55 },
    { type: "rect", x: 65, y: 12, width: 11, height: 11, rx: 3, fill: AC, opacity: 0.55 },
    { type: "circle", cx: 40, cy: 30, r: 7, fill: GL, opacity: 0.75 },
    { type: "rect", x: 33, y: 38, width: 14, height: 16, rx: 6, fill: GL, opacity: 0.65 },
    { type: "path", d: "M33 40 L14 22", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.85 },
    { type: "path", d: "M47 40 L66 22", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.85 },
    { type: "path", d: "M36 54 L32 72", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.65 },
    { type: "path", d: "M44 54 L48 72", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.65 },
  ],

  // --------------------------------------------------------------------------
  // chest-fly — Aperturas
  // --------------------------------------------------------------------------
  "chest-fly": [
    { type: "rect", x: 30, y: 46, width: 20, height: 8, rx: 4, fill: S3 },
    { type: "rect", x: 30, y: 52, width: 4, height: 20, rx: 2, fill: S3 },
    { type: "rect", x: 46, y: 52, width: 4, height: 20, rx: 2, fill: S3 },
    { type: "rect", x: 4, y: 30, width: 14, height: 6, rx: 3, fill: AC, opacity: 0.85 },
    { type: "rect", x: 62, y: 30, width: 14, height: 6, rx: 3, fill: AC, opacity: 0.85 },
    { type: "circle", cx: 40, cy: 40, r: 7, fill: GL, opacity: 0.65 },
    { type: "path", d: "M33 40 Q18 36 14 33", stroke: GL, strokeWidth: 4, strokeLinecap: "round", fill: "none", opacity: 0.8 },
    { type: "path", d: "M47 40 Q62 36 66 33", stroke: GL, strokeWidth: 4, strokeLinecap: "round", fill: "none", opacity: 0.8 },
  ],

  // --------------------------------------------------------------------------
  // pulldown — Jalón al pecho
  // --------------------------------------------------------------------------
  "pulldown": [
    { type: "rect", x: 20, y: 8, width: 40, height: 5, rx: 2.5, fill: S4 },
    { type: "rect", x: 38, y: 13, width: 4, height: 10, rx: 2, fill: S4 },
    { type: "rect", x: 16, y: 23, width: 48, height: 5, rx: 2.5, fill: AC, opacity: 0.9 },
    { type: "circle", cx: 40, cy: 36, r: 7, fill: GL, opacity: 0.75 },
    { type: "rect", x: 33, y: 44, width: 14, height: 14, rx: 4, fill: GL, opacity: 0.65 },
    { type: "path", d: "M33 40 L22 26", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.85 },
    { type: "path", d: "M47 40 L58 26", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.85 },
    { type: "path", d: "M37 58 L28 72", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.65 },
    { type: "path", d: "M43 58 L52 72", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.65 },
  ],

  // --------------------------------------------------------------------------
  // pullup — Dominadas
  // --------------------------------------------------------------------------
  "pullup": [
    { type: "rect", x: 10, y: 10, width: 60, height: 6, rx: 3, fill: AC, opacity: 0.9 },
    { type: "rect", x: 10, y: 6, width: 4, height: 14, rx: 2, fill: S4 },
    { type: "rect", x: 66, y: 6, width: 4, height: 14, rx: 2, fill: S4 },
    { type: "circle", cx: 40, cy: 26, r: 7, fill: GL, opacity: 0.75 },
    { type: "rect", x: 33, y: 34, width: 14, height: 16, rx: 5, fill: GL, opacity: 0.65 },
    { type: "path", d: "M33 30 L26 16", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.85 },
    { type: "path", d: "M47 30 L54 16", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.85 },
    { type: "path", d: "M37 50 L34 70", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.65 },
    { type: "path", d: "M43 50 L46 70", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.65 },
  ],

  // --------------------------------------------------------------------------
  // row — Remo
  // --------------------------------------------------------------------------
  "row": [
    { type: "rect", x: 62, y: 10, width: 10, height: 60, rx: 4, fill: S3 },
    { type: "circle", cx: 67, cy: 24, r: 5, fill: S2, stroke: AC, strokeWidth: 1.8, opacity: 0.9 },
    { type: "path", d: "M63 24 Q44 24 36 30", stroke: AC, strokeWidth: 2, strokeLinecap: "round", fill: "none", opacity: 0.7 },
    { type: "path", d: "M63 24 Q44 26 36 38", stroke: AC, strokeWidth: 2, strokeLinecap: "round", fill: "none", opacity: 0.7 },
    { type: "circle", cx: 26, cy: 22, r: 7, fill: GL, opacity: 0.75 },
    { type: "rect", x: 20, y: 30, width: 12, height: 18, rx: 5, fill: GL, opacity: 0.65 },
    { type: "path", d: "M30 34 L36 30", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.85 },
    { type: "path", d: "M30 38 L36 38", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.85 },
    { type: "path", d: "M22 48 L18 68", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.65 },
    { type: "path", d: "M30 48 L32 68", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.65 },
  ],

  // --------------------------------------------------------------------------
  // deadlift — Peso muerto
  // --------------------------------------------------------------------------
  "deadlift": [
    { type: "rect", x: 8, y: 62, width: 64, height: 5, rx: 2.5, fill: AC, opacity: 0.9 },
    { type: "rect", x: 4, y: 55, width: 12, height: 16, rx: 4, fill: AC, opacity: 0.55 },
    { type: "rect", x: 64, y: 55, width: 12, height: 16, rx: 4, fill: AC, opacity: 0.55 },
    { type: "circle", cx: 40, cy: 20, r: 7, fill: GL, opacity: 0.75 },
    { type: "path", d: "M40 27 L40 50", stroke: GL, strokeWidth: 6, strokeLinecap: "round", opacity: 0.65 },
    { type: "path", d: "M37 42 L20 62", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.8 },
    { type: "path", d: "M43 42 L60 62", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.8 },
    { type: "path", d: "M37 50 L30 66", stroke: GL, strokeWidth: 5, strokeLinecap: "round", opacity: 0.7 },
    { type: "path", d: "M43 50 L50 66", stroke: GL, strokeWidth: 5, strokeLinecap: "round", opacity: 0.7 },
  ],

  // --------------------------------------------------------------------------
  // squat — Sentadilla
  // --------------------------------------------------------------------------
  "squat": [
    { type: "rect", x: 8, y: 24, width: 64, height: 5, rx: 2.5, fill: AC, opacity: 0.9 },
    { type: "rect", x: 4, y: 20, width: 11, height: 11, rx: 3, fill: AC, opacity: 0.55 },
    { type: "rect", x: 65, y: 20, width: 11, height: 11, rx: 3, fill: AC, opacity: 0.55 },
    { type: "circle", cx: 40, cy: 18, r: 7, fill: GL, opacity: 0.75 },
    { type: "path", d: "M40 25 L38 48", stroke: GL, strokeWidth: 6, strokeLinecap: "round", opacity: 0.65 },
    { type: "path", d: "M38 32 L22 30", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.8 },
    { type: "path", d: "M42 32 L58 30", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.8 },
    { type: "path", d: "M35 48 L22 62", stroke: GL, strokeWidth: 5.5, strokeLinecap: "round", opacity: 0.8 },
    { type: "path", d: "M41 48 L54 62", stroke: GL, strokeWidth: 5.5, strokeLinecap: "round", opacity: 0.8 },
    { type: "path", d: "M22 62 L24 76", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.7 },
    { type: "path", d: "M54 62 L52 76", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.7 },
  ],

  // --------------------------------------------------------------------------
  // lunge — Zancada
  // --------------------------------------------------------------------------
  "lunge": [
    { type: "rect", x: 4, y: 40, width: 14, height: 6, rx: 3, fill: AC, opacity: 0.85 },
    { type: "rect", x: 62, y: 40, width: 14, height: 6, rx: 3, fill: AC, opacity: 0.85 },
    { type: "circle", cx: 40, cy: 16, r: 7, fill: GL, opacity: 0.75 },
    { type: "path", d: "M40 23 L40 44", stroke: GL, strokeWidth: 6, strokeLinecap: "round", opacity: 0.65 },
    { type: "path", d: "M37 34 L18 42", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.8 },
    { type: "path", d: "M43 34 L62 42", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.8 },
    { type: "path", d: "M37 44 L26 60", stroke: GL, strokeWidth: 5.5, strokeLinecap: "round", opacity: 0.8 },
    { type: "path", d: "M26 60 L28 76", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.7 },
    { type: "path", d: "M43 44 L56 58", stroke: GL, strokeWidth: 5.5, strokeLinecap: "round", opacity: 0.8 },
    { type: "path", d: "M56 58 L58 74", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.7 },
  ],

  // --------------------------------------------------------------------------
  // leg-extension — Extensión de cuádriceps en máquina
  // --------------------------------------------------------------------------
  "leg-extension": [
    { type: "rect", x: 10, y: 38, width: 40, height: 8, rx: 4, fill: S3 },
    { type: "rect", x: 10, y: 46, width: 8, height: 28, rx: 4, fill: S3 },
    { type: "rect", x: 42, y: 46, width: 8, height: 28, rx: 4, fill: S3 },
    { type: "rect", x: 48, y: 20, width: 8, height: 26, rx: 4, fill: S3 },
    { type: "ellipse", cx: 30, cy: 32, rx: 9, ry: 6, fill: GL, opacity: 0.65 },
    { type: "circle", cx: 30, cy: 22, r: 6, fill: GL, opacity: 0.65 },
    { type: "path", d: "M22 40 Q20 52 55 52", stroke: GL, strokeWidth: 5, strokeLinecap: "round", fill: "none", opacity: 0.8 },
    { type: "rect", x: 52, y: 47, width: 14, height: 10, rx: 3, fill: AC, opacity: 0.85 },
  ],

  // --------------------------------------------------------------------------
  // leg-curl — Curl femoral
  // --------------------------------------------------------------------------
  "leg-curl": [
    { type: "rect", x: 10, y: 30, width: 60, height: 8, rx: 4, fill: S3 },
    { type: "rect", x: 10, y: 38, width: 8, height: 30, rx: 4, fill: S3 },
    { type: "rect", x: 62, y: 38, width: 8, height: 30, rx: 4, fill: S3 },
    { type: "ellipse", cx: 40, cy: 28, rx: 18, ry: 7, fill: GL, opacity: 0.65 },
    { type: "circle", cx: 22, cy: 22, r: 6, fill: GL, opacity: 0.65 },
    { type: "path", d: "M52 28 Q60 28 62 42", stroke: GL, strokeWidth: 5, strokeLinecap: "round", fill: "none", opacity: 0.8 },
    { type: "rect", x: 58, y: 38, width: 12, height: 10, rx: 3, fill: AC, opacity: 0.85 },
  ],

  // --------------------------------------------------------------------------
  // hip-thrust — Empuje de cadera
  // --------------------------------------------------------------------------
  "hip-thrust": [
    { type: "rect", x: 6, y: 50, width: 30, height: 8, rx: 4, fill: S3 },
    { type: "rect", x: 8, y: 34, width: 64, height: 5, rx: 2.5, fill: AC, opacity: 0.9 },
    { type: "rect", x: 4, y: 30, width: 11, height: 11, rx: 3, fill: AC, opacity: 0.55 },
    { type: "rect", x: 65, y: 30, width: 11, height: 11, rx: 3, fill: AC, opacity: 0.55 },
    { type: "circle", cx: 18, cy: 44, r: 6, fill: GL, opacity: 0.75 },
    { type: "path", d: "M18 50 L36 50", stroke: GL, strokeWidth: 6, strokeLinecap: "round", opacity: 0.65 },
    { type: "rect", x: 30, y: 30, width: 16, height: 20, rx: 6, fill: GL, opacity: 0.65 },
    { type: "path", d: "M46 44 L58 52", stroke: GL, strokeWidth: 5.5, strokeLinecap: "round", opacity: 0.8 },
    { type: "path", d: "M58 52 L60 68", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.7 },
    { type: "path", d: "M30 50 L24 66", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.65 },
  ],

  // --------------------------------------------------------------------------
  // biceps-curl — Curl de bíceps
  // --------------------------------------------------------------------------
  "biceps-curl": [
    { type: "circle", cx: 40, cy: 14, r: 7, fill: GL, opacity: 0.75 },
    { type: "rect", x: 32, y: 22, width: 16, height: 20, rx: 6, fill: GL, opacity: 0.65 },
    { type: "path", d: "M35 42 L32 70", stroke: GL, strokeWidth: 5, strokeLinecap: "round", opacity: 0.65 },
    { type: "path", d: "M45 42 L48 70", stroke: GL, strokeWidth: 5, strokeLinecap: "round", opacity: 0.65 },
    { type: "path", d: "M34 28 L20 34 L22 48", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", strokeLinejoin: "round", fill: "none", opacity: 0.85 },
    { type: "rect", x: 14, y: 45, width: 14, height: 6, rx: 3, fill: AC, opacity: 0.9 },
    { type: "rect", x: 12, y: 42, width: 5, height: 12, rx: 2.5, fill: AC, opacity: 0.65 },
    { type: "rect", x: 23, y: 42, width: 5, height: 12, rx: 2.5, fill: AC, opacity: 0.65 },
    { type: "path", d: "M46 28 L58 38", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.55 },
  ],

  // --------------------------------------------------------------------------
  // triceps-ext — Extensión de tríceps
  // --------------------------------------------------------------------------
  "triceps-ext": [
    { type: "rect", x: 62, y: 8, width: 10, height: 44, rx: 4, fill: S3 },
    { type: "circle", cx: 67, cy: 16, r: 4, fill: S2, stroke: AC, strokeWidth: 1.8, opacity: 0.9 },
    { type: "path", d: "M63 16 Q48 20 40 28", stroke: AC, strokeWidth: 2, strokeLinecap: "round", fill: "none", opacity: 0.75 },
    { type: "circle", cx: 30, cy: 18, r: 7, fill: GL, opacity: 0.75 },
    { type: "rect", x: 23, y: 26, width: 14, height: 18, rx: 5, fill: GL, opacity: 0.65 },
    { type: "path", d: "M34 30 L40 28", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.85 },
    { type: "path", d: "M34 36 L40 44", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.85 },
    { type: "path", d: "M38 40 L42 46 L44 44", stroke: AC, strokeWidth: 2.5, strokeLinecap: "round", strokeLinejoin: "round", fill: "none", opacity: 0.8 },
    { type: "path", d: "M26 44 L22 68", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.65 },
    { type: "path", d: "M34 44 L36 68", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.65 },
  ],

  // --------------------------------------------------------------------------
  // lateral-raise — Elevación lateral
  // --------------------------------------------------------------------------
  "lateral-raise": [
    { type: "circle", cx: 40, cy: 16, r: 7, fill: GL, opacity: 0.75 },
    { type: "rect", x: 33, y: 24, width: 14, height: 18, rx: 5, fill: GL, opacity: 0.65 },
    { type: "path", d: "M33 30 L12 26", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.85 },
    { type: "path", d: "M47 30 L68 26", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.85 },
    { type: "rect", x: 4, y: 22, width: 12, height: 6, rx: 3, fill: AC, opacity: 0.9 },
    { type: "rect", x: 64, y: 22, width: 12, height: 6, rx: 3, fill: AC, opacity: 0.9 },
    { type: "path", d: "M37 42 L33 68", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.65 },
    { type: "path", d: "M43 42 L47 68", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.65 },
  ],

  // --------------------------------------------------------------------------
  // cable — Cable / polea genérico
  // --------------------------------------------------------------------------
  "cable": [
    { type: "rect", x: 60, y: 8, width: 12, height: 64, rx: 4, fill: S3 },
    { type: "circle", cx: 66, cy: 18, r: 5, fill: S2, stroke: AC, strokeWidth: 1.8, opacity: 0.9 },
    { type: "circle", cx: 66, cy: 52, r: 5, fill: S2, stroke: AC, strokeWidth: 1.8, opacity: 0.75 },
    { type: "path", d: "M62 18 Q40 22 30 36", stroke: AC, strokeWidth: 2, strokeLinecap: "round", fill: "none", opacity: 0.8 },
    { type: "circle", cx: 24, cy: 26, r: 7, fill: GL, opacity: 0.75 },
    { type: "rect", x: 17, y: 34, width: 14, height: 18, rx: 5, fill: GL, opacity: 0.65 },
    { type: "path", d: "M27 36 L30 36", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.85 },
    { type: "path", d: "M20 44 L12 58", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.65 },
    { type: "path", d: "M28 44 L28 62", stroke: GL, strokeWidth: 4, strokeLinecap: "round", opacity: 0.65 },
  ],

  // --------------------------------------------------------------------------
  // core-plank — Plancha / core
  // --------------------------------------------------------------------------
  "core-plank": [
    { type: "rect", x: 8, y: 68, width: 64, height: 4, rx: 2, fill: S4, opacity: 0.6 },
    { type: "circle", cx: 18, cy: 44, r: 7, fill: GL, opacity: 0.75 },
    { type: "rect", x: 18, y: 48, width: 40, height: 10, rx: 5, fill: GL, opacity: 0.65 },
    { type: "path", d: "M18 52 L10 68", stroke: GL, strokeWidth: 5, strokeLinecap: "round", opacity: 0.8 },
    { type: "path", d: "M56 54 L60 68", stroke: GL, strokeWidth: 5, strokeLinecap: "round", opacity: 0.75 },
    { type: "path", d: "M50 56 L54 68", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.7 },
    { type: "path", d: "M24 52 L52 52", stroke: AC, strokeWidth: 1.8, strokeLinecap: "round", strokeDasharray: "4 3", fill: "none", opacity: 0.7 },
  ],

  // --------------------------------------------------------------------------
  // cardio — Cardio / carrera
  // --------------------------------------------------------------------------
  "cardio": [
    { type: "circle", cx: 40, cy: 14, r: 7, fill: GL, opacity: 0.75 },
    { type: "path", d: "M40 21 L36 42", stroke: GL, strokeWidth: 6, strokeLinecap: "round", opacity: 0.65 },
    { type: "path", d: "M38 28 L24 22", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.85 },
    { type: "path", d: "M38 34 L52 38", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.85 },
    { type: "path", d: "M34 42 L22 56", stroke: GL, strokeWidth: 5.5, strokeLinecap: "round", opacity: 0.8 },
    { type: "path", d: "M22 56 L18 68", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.7 },
    { type: "path", d: "M38 42 L52 50", stroke: GL, strokeWidth: 5.5, strokeLinecap: "round", opacity: 0.8 },
    { type: "path", d: "M52 50 L60 42", stroke: GL, strokeWidth: 4.5, strokeLinecap: "round", opacity: 0.7 },
    { type: "path", d: "M10 72 L70 72", stroke: AC, strokeWidth: 2, strokeLinecap: "round", fill: "none", opacity: 0.5 },
  ],

  // --------------------------------------------------------------------------
  // machine-generic — Máquina genérica (fallback)
  // --------------------------------------------------------------------------
  "machine-generic": [
    { type: "rect", x: 12, y: 10, width: 56, height: 60, rx: 6, fill: S3, opacity: 0.8 },
    { type: "rect", x: 18, y: 16, width: 44, height: 32, rx: 4, fill: S4, opacity: 0.7 },
    { type: "rect", x: 22, y: 20, width: 36, height: 22, rx: 3, fill: S2, opacity: 0.9 },
    { type: "circle", cx: 26, cy: 54, r: 3, fill: AC, opacity: 0.9 },
    { type: "circle", cx: 36, cy: 54, r: 3, fill: AC, opacity: 0.65 },
    { type: "circle", cx: 46, cy: 54, r: 3, fill: AC, opacity: 0.65 },
    { type: "circle", cx: 56, cy: 54, r: 3, fill: AC, opacity: 0.5 },
    { type: "rect", x: 16, y: 68, width: 8, height: 6, rx: 2, fill: S3 },
    { type: "rect", x: 56, y: 68, width: 8, height: 6, rx: 2, fill: S3 },
    { type: "path", d: "M36 24 L40 36 L44 24", stroke: AC, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", fill: "none", opacity: 0.9 },
  ],
};

// Sentinel exportado para que los renderers sepan qué reemplazar
export const ACCENT_SENTINEL = AC;
