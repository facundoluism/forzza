/**
 * secureStoreAdapter.ts
 *
 * Adaptador de expo-secure-store con chunking automático.
 *
 * Problema: iOS Keychain tiene un límite blando de ~2048 bytes por ítem.
 * La sesión de Supabase (JWT + refresh token + user JSON) puede superar ese límite,
 * provocando warnings y, en SDKs futuros, errores que borran la sesión del usuario.
 *
 * Solución: si el valor a guardar supera CHUNK_BYTE_LIMIT bytes UTF-8 reales,
 * se parte en chunks que se guardan como ítems separados en el Keychain:
 *
 *   <key>          → manifest en JSON: { chunks: <n> }
 *   <key>__chunk_0 → primer segmento
 *   <key>__chunk_1 → segundo segmento
 *   ...
 *
 * Compatibilidad hacia atrás: si en la clave base existe un valor que NO es un
 * manifest válido (sesión guardada por versiones anteriores sin chunking), getItem
 * lo devuelve tal cual. No se requiere migración explícita.
 *
 * NO se usan dependencias extra. Todo queda en el Keychain (sin AsyncStorage).
 */

import * as SecureStore from "expo-secure-store";

/** Margen conservador bajo el límite de 2048 bytes del Keychain de iOS. */
const CHUNK_BYTE_LIMIT = 1800;

/** Sufijo de clave para cada chunk. */
const CHUNK_KEY = (base: string, index: number) => `${base}__chunk_${index}`;

/** Formato del manifest almacenado en la clave base cuando se usa chunking. */
interface ChunkManifest {
  chunks: number;
}

/**
 * Calcula la longitud en bytes UTF-8 de un string.
 * TextEncoder.encode().byteLength es el método correcto; .length de JS cuenta
 * code units UTF-16, lo que subestima emojis y algunos caracteres especiales.
 *
 * TextEncoder está disponible globalmente en Hermes (React Native ≥ 0.64).
 */
function byteLength(str: string): number {
  // Hermes expone TextEncoder globalmente desde RN 0.64+.
  // Si por alguna razón no está disponible, caemos a una aproximación conservadora.
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(str).byteLength;
  }
  // Fallback: asumir hasta 4 bytes por carácter (sobre-estima, nunca sub-estima).
  return str.length * 4;
}

/**
 * Intenta parsear el manifest de la clave base.
 * Devuelve null si el valor es null/undefined, si no es JSON válido, o si no
 * tiene la forma { chunks: number } — en ese caso es un valor legacy sin chunking.
 */
function parseManifest(raw: string | null): ChunkManifest | null {
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "chunks" in parsed &&
      typeof (parsed as Record<string, unknown>)["chunks"] === "number"
    ) {
      return parsed as ChunkManifest;
    }
    return null;
  } catch {
    return null;
  }
}

export const ExpoSecureStoreAdapter = {
  /**
   * Lee el valor asociado a `key`.
   *
   * - Si no existe nada: devuelve null.
   * - Si existe un manifest { chunks: n }: lee y ensambla los n chunks.
   *   Si falta algún chunk (corrupción), devuelve null → Supabase hará re-login limpio.
   * - Si existe un valor sin formato manifest (legacy): lo devuelve directamente.
   */
  getItem: async (key: string): Promise<string | null> => {
    const raw = await SecureStore.getItemAsync(key);

    if (raw === null) return null;

    const manifest = parseManifest(raw);

    // Valor legacy (sin chunking) o valor que cabe en un solo chunk.
    if (manifest === null) return raw;

    // Reconstruir desde chunks.
    const parts: string[] = [];
    for (let i = 0; i < manifest.chunks; i++) {
      const chunk = await SecureStore.getItemAsync(CHUNK_KEY(key, i));
      if (chunk === null) {
        // Chunk faltante → sesión corrupta. Devolvemos null para forzar re-login.
        console.warn(
          `[SecureStoreAdapter] Falta el chunk ${i} de la clave de auth. ` +
            "La sesión se considerará inválida y el usuario deberá iniciar sesión nuevamente."
        );
        return null;
      }
      parts.push(chunk);
    }

    return parts.join("");
  },

  /**
   * Guarda `value` bajo `key`.
   *
   * - Si el valor entra en CHUNK_BYTE_LIMIT bytes: lo guarda directamente en la
   *   clave base (sin overhead, compatible con lecturas legacy).
   * - Si supera el límite: lo parte en chunks, guarda cada uno con clave derivada
   *   y guarda el manifest en la clave base.
   */
  setItem: async (key: string, value: string): Promise<void> => {
    if (byteLength(value) <= CHUNK_BYTE_LIMIT) {
      // Valor pequeño — guardar directo en la clave base.
      // IMPORTANTE: limpiar PRIMERO los chunks de una escritura anterior más grande,
      // mientras el manifest viejo todavía es legible. Si sobrescribiéramos la clave
      // base antes, parseManifest leería el valor chico (sin manifest) y los chunks
      // huérfanos quedarían para siempre en el Keychain.
      await _deleteChunksIfExist(key);
      await SecureStore.setItemAsync(key, value);
      return;
    }

    // Partir en chunks de CHUNK_BYTE_LIMIT bytes UTF-8.
    const chunks = _splitIntoChunks(value, CHUNK_BYTE_LIMIT);

    // Primero eliminar chunks viejos que puedan haber quedado de escrituras anteriores
    // con un número mayor de chunks (lee el manifest viejo, que todavía es legible aquí).
    await _deleteChunksIfExist(key);

    // Write-ahead: escribir el manifest ANTES que los chunks. Si el proceso se
    // interrumpe a mitad de escritura, el manifest siempre referencia el total de
    // chunks → getItem detecta los faltantes y devuelve null (re-login limpio) y
    // removeItem puede limpiarlos. El orden inverso dejaría chunks huérfanos sin
    // manifest (con parte del refresh token) imposibles de barrer en el Keychain.
    const manifest: ChunkManifest = { chunks: chunks.length };
    await SecureStore.setItemAsync(key, JSON.stringify(manifest));

    // Guardar chunks nuevos.
    for (let i = 0; i < chunks.length; i++) {
      await SecureStore.setItemAsync(CHUNK_KEY(key, i), chunks[i]!);
    }
  },

  /**
   * Elimina `key` y TODOS sus chunks asociados del Keychain.
   * Sin esto quedaría basura indefinida en el Keychain del usuario.
   */
  removeItem: async (key: string): Promise<void> => {
    // Leer el manifest para saber cuántos chunks eliminar.
    const raw = await SecureStore.getItemAsync(key);
    const manifest = parseManifest(raw);

    // Eliminar la clave base.
    await SecureStore.deleteItemAsync(key);

    if (manifest !== null) {
      for (let i = 0; i < manifest.chunks; i++) {
        await SecureStore.deleteItemAsync(CHUNK_KEY(key, i));
      }
    }
  },
};

// ---------------------------------------------------------------------------
// Helpers privados
// ---------------------------------------------------------------------------

/**
 * Parte un string en segmentos de máximo `maxBytes` bytes UTF-8 cada uno.
 * Corta respetando límites de code point (nunca corta un surrogate pair).
 */
function _splitIntoChunks(value: string, maxBytes: number): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < value.length) {
    let end = start;
    let currentBytes = 0;

    // Avanzar code point a code point para respetar surrogate pairs.
    while (end < value.length) {
      const cp = value.codePointAt(end);
      if (cp === undefined) break;

      // Calcular bytes UTF-8 que ocupa este code point.
      let cpBytes: number;
      if (cp <= 0x7f) cpBytes = 1;
      else if (cp <= 0x7ff) cpBytes = 2;
      else if (cp <= 0xffff) cpBytes = 3;
      else cpBytes = 4; // suplementario (emoji, etc.)

      if (currentBytes + cpBytes > maxBytes) break;

      currentBytes += cpBytes;
      // Un code point suplementario (> U+FFFF) ocupa 2 code units en UTF-16.
      end += cp > 0xffff ? 2 : 1;
    }

    // Protección: si no avanzamos nada (code point individual > maxBytes, imposible
    // con maxBytes=1800 porque el máximo UTF-8 es 4 bytes), forzar avance de 1 char.
    if (end === start) {
      end = start + 1;
    }

    chunks.push(value.slice(start, end));
    start = end;
  }

  return chunks;
}

/**
 * Intenta borrar los chunks de una clave leyendo primero su manifest.
 * Si no hay manifest (valor legacy o sin chunks) no hace nada.
 * Llamado antes de escribir nuevos chunks para evitar basura.
 */
async function _deleteChunksIfExist(key: string): Promise<void> {
  const raw = await SecureStore.getItemAsync(key);
  const manifest = parseManifest(raw);
  if (manifest !== null) {
    for (let i = 0; i < manifest.chunks; i++) {
      await SecureStore.deleteItemAsync(CHUNK_KEY(key, i));
    }
  }
}
