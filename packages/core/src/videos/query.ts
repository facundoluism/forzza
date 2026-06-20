// videos/query — construcción de la query de búsqueda de YouTube (§4.2).
// Pura: a partir del ejercicio arma el string de búsqueda. Sin red.

import type { ExerciseContext } from "./types";

/** Colapsa runs de whitespace y recorta extremos. */
function normalizeSpaces(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/** lowercase + saca acentos/diacríticos (mismo criterio que el scoring). */
function stripAccents(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Overrides de query provenientes del feedback de curación del owner. */
export interface BuildSearchQueryOptions {
  /** Términos a sumar al final de la query. */
  queryAdd?: string[];
  /**
   * Términos a quitar de la query resultante (match case/acentos-insensitive,
   * por palabra completa).
   */
  queryRemove?: string[];
}

/**
 * Quita de `query` los tokens que matcheen (case/acentos-insensitive) algún
 * término de `queryRemove`. El match es por palabra (token separado por espacios);
 * un término multi-palabra remueve esa secuencia contigua. Normaliza espacios al final.
 */
function applyQueryRemove(query: string, queryRemove: string[]): string {
  let result = query;
  for (const rawTerm of queryRemove) {
    const term = rawTerm.trim();
    if (term.length === 0) continue;
    const words = result.split(/\s+/);
    const removeWords = stripAccents(term).split(/\s+/).filter(Boolean);
    if (removeWords.length === 0) continue;

    const kept: string[] = [];
    let i = 0;
    while (i < words.length) {
      // ¿Coincide la secuencia [i .. i+removeWords.length) con removeWords?
      let matches = i + removeWords.length <= words.length;
      if (matches) {
        for (let j = 0; j < removeWords.length; j++) {
          const word = words[i + j];
          if (word === undefined || stripAccents(word) !== removeWords[j]) {
            matches = false;
            break;
          }
        }
      }
      if (matches) {
        i += removeWords.length; // saltea la secuencia removida
      } else {
        kept.push(words[i] as string);
        i += 1;
      }
    }
    result = kept.join(" ");
  }
  return normalizeSpaces(result);
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
 *
 * Con `options` (overrides de feedback): primero se quitan los `queryRemove`
 * (case/acentos-insensitive, por palabra), luego se concatenan los `queryAdd`
 * al final. Sin options, el comportamiento es idéntico al original.
 */
export function buildSearchQuery(
  exercise: ExerciseContext,
  options: BuildSearchQueryOptions = {}
): string {
  const isEn = exercise.lang === "en";
  const rawName = isEn
    ? (exercise.nameEn ?? exercise.name)
    : exercise.name;

  const baseName = cleanName(rawName);

  const suffix = isEn
    ? "how to proper form"
    : "cómo hacer técnica correcta";

  let query = normalizeSpaces(`${baseName} ${suffix}`);

  const queryRemove = options.queryRemove ?? [];
  if (queryRemove.length > 0) {
    query = applyQueryRemove(query, queryRemove);
  }

  const queryAdd = (options.queryAdd ?? []).map((t) => t.trim()).filter(Boolean);
  if (queryAdd.length > 0) {
    query = normalizeSpaces(`${query} ${queryAdd.join(" ")}`);
  }

  return query;
}
