// videos/query — construcción de la query de búsqueda de YouTube (§4.2).
// Pura: a partir del ejercicio arma el string de búsqueda. Sin red.

import type { ExerciseContext } from "./types";

/** Colapsa runs de whitespace y recorta extremos. */
function normalizeSpaces(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/**
 * Construye la query de búsqueda para encontrar videos demostrativos.
 *
 * - ES: `"{name} {equipment...} cómo hacer técnica correcta"`
 * - EN: `"{nameEn ?? name} {equipment...} how to proper form"`
 *
 * El equipment vacío (o entradas en blanco) se omite. El resultado tiene
 * los espacios normalizados.
 */
export function buildSearchQuery(exercise: ExerciseContext): string {
  const isEn = exercise.lang === "en";
  const baseName = isEn
    ? (exercise.nameEn ?? exercise.name)
    : exercise.name;

  const equipment = exercise.equipment
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  const suffix = isEn
    ? "how to proper form"
    : "cómo hacer técnica correcta";

  const parts = [baseName, ...equipment, suffix];
  return normalizeSpaces(parts.join(" "));
}
