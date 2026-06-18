// videos/query — construcción de la query de búsqueda de YouTube (§4.2).
// Pura: a partir del ejercicio arma el string de búsqueda. Sin red.

import type { ExerciseContext } from "./types";

/** Colapsa runs de whitespace y recorta extremos. */
function normalizeSpaces(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/**
 * Elimina fragmentos entre paréntesis del nombre (ej: "Fondos en paralelas asistidos (polea)"
 * → "Fondos en paralelas asistidos") y normaliza espacios.
 */
function cleanName(name: string): string {
  return normalizeSpaces(name.replace(/\([^)]*\)/g, ""));
}

/**
 * Construye la query de búsqueda para encontrar videos demostrativos.
 *
 * - ES: `"{nombreLimpio} cómo hacer técnica correcta"`
 * - EN: `"{nombreEnLimpio ?? nombreLimpio} how to proper form"`
 *
 * El equipment NO se incluye en la query (es ruido verboso/bilingüe que
 * desvía la búsqueda). El tipo ExerciseContext mantiene el campo equipment
 * porque el scoring lo usa para su señal de texto.
 * El resultado tiene los espacios normalizados.
 */
export function buildSearchQuery(exercise: ExerciseContext): string {
  const isEn = exercise.lang === "en";
  const rawName = isEn
    ? (exercise.nameEn ?? exercise.name)
    : exercise.name;

  const baseName = cleanName(rawName);

  const suffix = isEn
    ? "how to proper form"
    : "cómo hacer técnica correcta";

  return normalizeSpaces(`${baseName} ${suffix}`);
}
