/**
 * backfill-svg-icons.ts — Backfill de svg_icon para exercise_library.
 *
 * Lee todos los ejercicios de la DB local, corre resolveExerciseIconKey
 * (importado del resolver real de packages/ui), y genera:
 *   - supabase/seed/exercises_svg_icons.sql  (UPDATEs idempotentes por slug)
 *   - docs/progress/iconos-sin-resolver.md    (ejercicios que quedaron en
 *                                              "machine-generic" para revisión manual)
 *
 * Uso:
 *   pnpm icons:backfill
 *   pnpm icons:backfill --dry-run   (imprime reporte, no escribe archivos)
 *
 * Decisión de diseño (IMPORTANTE):
 *   El resolver resolveExerciseIconKey() está optimizado para movement_pattern en inglés.
 *   En la DB existen ~80 ejercicios con patrones en español o mixtos ("Jalón / Pull",
 *   "Empuje / Push", "Bisagra de cadera / Hinge") que el EXACT_PATTERN_MAP y PREFIX_MAP
 *   del resolver no cubren → el resolver cae en el hint de equipment (nivel 3).
 *
 *   Problema: equipment como "Dumbbell" → "biceps-curl" aunque sea un remo,
 *   o "Smith Machine" → "machine-generic" aunque sea una sentadilla.
 *
 *   Solución en este script (post-proceso, sin reimplementar el resolver):
 *   Cuando el resolver devuelve una key "genérica" (biceps-curl por equipment-hint,
 *   cable, machine-generic) Y el movement_pattern contiene una keyword en español que
 *   indica un movimiento específico, se aplica un override semántico basado en esa
 *   keyword + primary_group. Esto NO reemplaza al resolver: el resolver corre primero
 *   y su resultado se acepta si es específico (bench-press, squat, deadlift, etc.).
 *
 *   El listado de machine-generic en el reporte refleja los ejercicios donde ni el
 *   resolver ni el override pudieron asignar una key semánticamente correcta.
 */

import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

// Importar el resolver REAL — no reimplementar
import { resolveExerciseIconKey } from "../packages/ui/src/exerciseIconMap.js";
import type { ExerciseIconKey } from "../packages/ui/src/exerciseIconTypes.js";

// ─── Rutas ────────────────────────────────────────────────────────────────────

const REPO_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SQL_PATH = path.join(REPO_ROOT, "supabase", "seed", "exercises_svg_icons.sql");
const REPORT_PATH = path.join(REPO_ROOT, "docs", "progress", "iconos-sin-resolver.md");

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface ExerciseRow {
  slug: string;
  name: string;
  movement_pattern: string | null;
  equipment: string[] | null;
  primary_group: string | null;
}

type IconAssignment = {
  slug: string;
  name: string;
  movement_pattern: string | null;
  primary_group: string | null;
  icon: ExerciseIconKey;
  resolved_by: "resolver" | "spanish-override" | "group-fallback";
};

// ─── Keys que el resolver devuelve cuando "no supo" (cayó en equipment hint genérico)
// Estas keys son válidas cuando el resolver las asignó por patrón de movimiento real,
// pero problemáticas cuando las asignó solo por el tipo de equipo.
// La heurística: si el movement_pattern contiene texto en español, el resolver
// probablemente cayó en equipment-hint en lugar de movement-pattern.
const GENERIC_RESOLVER_KEYS = new Set<ExerciseIconKey>([
  "biceps-curl",   // equipment dumbbell/barbell → a veces asignado a no-curls
  "cable",         // equipment cable → a veces asignado a no-cable-exercises
  "machine-generic", // equipment machine/smith → siempre problemático con español
  "bench-press",   // equipment barbell → asignado a ejercicios de espalda/pierna
]);

// ─── Detectar si el movement_pattern es en español o mixto ───────────────────

/**
 * Retorna true si el movement_pattern parece ser en español (o mixto ES/EN).
 * Criterio: contiene "/" bilinge, o contiene palabras españolas exclusivas.
 */
function isSpanishPattern(pattern: string | null): boolean {
  if (!pattern) return false;
  const p = pattern.toLowerCase();
  // Patrones bilínges con "/"
  if (p.includes(" / ")) return true;
  // Palabras exclusivamente españolas en patrones de la DB
  const spanishKeywords = [
    "jalón", "empuje", "sentadilla", "bisagra", "extensión",
    "elevación", "apertura", "compuesto", "contracción", "rotación",
    "aducción", "abducción", "flexión", "talones",
  ];
  return spanishKeywords.some((kw) => p.includes(kw));
}

// ─── Override semántico para patrones en español ─────────────────────────────

// Mapa: keyword en español (lowercase, en el pattern) → icon key base
// Orden de preferencia: de más específico a más general dentro del override.
const SPANISH_PATTERN_OVERRIDES: Array<[string, ExerciseIconKey]> = [
  // Jalón / Pull → row (remo) o pulldown según contexto de grupo
  ["jalón / pull", "row"],
  ["jalón", "row"],
  // Bisagra de cadera / Hinge → deadlift
  ["bisagra de cadera", "deadlift"],
  ["bisagra", "deadlift"],
  // Sentadilla / Squat → squat
  ["sentadilla", "squat"],
  // Empuje / Push → bench-press genérico (se refina con primary_group abajo)
  ["empuje / push", "bench-press"],
  ["empuje", "bench-press"],
  // Apertura / Fly → chest-fly
  ["apertura / fly", "chest-fly"],
  ["apertura", "chest-fly"],
  // Elevación de talones / Calf Raise → lunge
  ["elevación de talones", "lunge"],
  // Elevación / Raise (hombros) → lateral-raise
  ["elevación / raise", "lateral-raise"],
  ["elevación", "lateral-raise"],
  // Contracción / Crunch → core-plank
  ["contracción / crunch", "core-plank"],
  ["contracción", "core-plank"],
  // Rotación / Twist → core-plank
  ["rotación / twist", "core-plank"],
  ["rotación", "core-plank"],
  // Extensión de cadera → leg-curl (hip extension)
  ["extensión de cadera", "leg-curl"],
  // Extensión (genérica) — refined por group abajo
  ["extensión", "triceps-ext"],
  // Flexión (genérica)
  ["flexión", "biceps-curl"],
  // Compuesto / Compound — refined por group
  ["compuesto / compound", "bench-press"],
  ["compuesto", "bench-press"],
  // Aducción / Abducción → hip-thrust
  ["aducción / abducción", "hip-thrust"],
  ["aducción", "hip-thrust"],
  ["abducción", "hip-thrust"],
];

// Refinamiento adicional por primary_group cuando el override base es demasiado genérico
// Se aplica SOLO cuando el override base es bench-press/row/triceps-ext/biceps-curl/lateral-raise
const GROUP_REFINEMENTS: Record<string, Partial<Record<ExerciseIconKey, ExerciseIconKey>>> = {
  // Para "empuje" (bench-press base): Shoulders → overhead-press; Arms → triceps-ext
  shoulders: { "bench-press": "overhead-press" },
  arms: { "bench-press": "triceps-ext" },
  legs: { "bench-press": "squat", "lateral-raise": "lunge", "triceps-ext": "leg-extension" },
  back: { "bench-press": "row", "row": "row" },
  core: { "lateral-raise": "core-plank" },
  // Para "extensión" (triceps-ext base): Legs → leg-extension; Back → deadlift
  // se maneja arriba con keys específicas
};

/**
 * Override semántico para ejercicios donde el resolver cayó en equipment hint.
 * Solo se aplica si:
 *  (a) el resolver devolvió una key "genérica" (GENERIC_RESOLVER_KEYS), Y
 *  (b) el movement_pattern es en español o mixto.
 */
function applySpanishOverride(
  ex: ExerciseRow,
  resolverKey: ExerciseIconKey
): { icon: ExerciseIconKey; resolved_by: "resolver" | "spanish-override" | "group-fallback" } {
  // Si el resolver ya asignó una key específica y el patrón es en inglés → aceptar
  if (!GENERIC_RESOLVER_KEYS.has(resolverKey) || !isSpanishPattern(ex.movement_pattern)) {
    return { icon: resolverKey, resolved_by: "resolver" };
  }

  const pattern = (ex.movement_pattern ?? "").toLowerCase();
  const group = (ex.primary_group ?? "").toLowerCase();

  // Buscar override de patrón en español
  for (const [keyword, baseKey] of SPANISH_PATTERN_OVERRIDES) {
    if (pattern.includes(keyword)) {
      // Aplicar refinamiento por grupo
      const refinement = GROUP_REFINEMENTS[group];
      const refined = refinement?.[baseKey] ?? baseKey;
      return { icon: refined, resolved_by: "spanish-override" };
    }
  }

  // Sin override de patrón → usar fallback de primary_group
  const GROUP_FALLBACK: Record<string, ExerciseIconKey> = {
    chest: "bench-press",
    back: "row",
    legs: "squat",
    shoulders: "overhead-press",
    arms: "biceps-curl",
    core: "core-plank",
    glutes: "hip-thrust",
    cardio: "cardio",
    full_body: "deadlift",
  };
  const fallbackKey = group ? GROUP_FALLBACK[group] : undefined;
  if (fallbackKey) {
    return { icon: fallbackKey, resolved_by: "group-fallback" };
  }

  // Sin fallback posible → aceptar lo que dijo el resolver
  return { icon: resolverKey, resolved_by: "resolver" };
}

// ─── Helpers SQL ──────────────────────────────────────────────────────────────

function sqlStr(s: string): string {
  return "'" + s.replace(/'/g, "''") + "'";
}

function generateSql(assignments: IconAssignment[]): string {
  const header = [
    "-- =============================================================================",
    "-- FORZZA — Seed: backfill exercise_library.svg_icon",
    "-- GENERADO por scripts/backfill-svg-icons.ts",
    "-- NO editar a mano. Regenerar con: pnpm icons:backfill",
    "--",
    "-- UPDATEs idempotentes por slug (UNIQUE). Cada UPDATE puede correr N veces",
    "-- sin efecto secundario. El WHERE slug no encuentra nada si el slug no existe.",
    "-- =============================================================================",
    "",
    "BEGIN;",
    "",
  ].join("\n");

  // Agrupar por icon key para legibilidad
  const byKey = new Map<ExerciseIconKey, IconAssignment[]>();
  for (const a of assignments) {
    const list = byKey.get(a.icon) ?? [];
    list.push(a);
    byKey.set(a.icon, list);
  }

  // Orden de keys por volumen descendente
  const sortedKeys = [...byKey.entries()].sort(
    (a, b) => b[1].length - a[1].length
  );

  const blocks: string[] = [];
  for (const [key, items] of sortedKeys) {
    blocks.push(`-- ── ${key} ${"─".repeat(Math.max(0, 60 - key.length))}`);
    for (const item of items.sort((a, b) => a.slug.localeCompare(b.slug))) {
      blocks.push(
        `UPDATE public.exercise_library SET svg_icon = ${sqlStr(key)} WHERE slug = ${sqlStr(item.slug)};`
      );
    }
    blocks.push("");
  }

  return header + blocks.join("\n") + "\nCOMMIT;\n";
}

// ─── Reporte markdown ─────────────────────────────────────────────────────────

function generateReport(
  machineGeneric: IconAssignment[],
  distribution: Map<ExerciseIconKey, number>,
  total: number,
  byResolution: { resolver: number; spanish: number; fallback: number }
): string {
  const lines: string[] = [
    "# Iconos de ejercicio sin resolver (machine-generic)",
    "",
    `Generado: ${new Date().toISOString()}  `,
    `Total ejercicios: ${total}  `,
    `Resueltos por resolver: ${byResolution.resolver}  `,
    `Resueltos por override español: ${byResolution.spanish}  `,
    `Resueltos por fallback de grupo: ${byResolution.fallback}  `,
    `Sin resolver (machine-generic): ${machineGeneric.length}  `,
    "",
    "## Distribución por key",
    "",
    "| Key | Cantidad |",
    "| --- | -------- |",
  ];

  const sorted = [...distribution.entries()].sort((a, b) => b[1] - a[1]);
  for (const [key, count] of sorted) {
    lines.push(`| ${key} | ${count} |`);
  }

  lines.push("");
  lines.push("## Ejercicios machine-generic (revisión manual)");
  lines.push("");
  if (machineGeneric.length === 0) {
    lines.push("_Todos los ejercicios tienen una key resuelta._");
  } else {
    lines.push(
      "Estos ejercicios no tienen un patrón de movimiento reconocido por el resolver",
      "ni un override semántico aplicable.",
      "Acción: editar `packages/ui/src/exerciseIconMap.ts` con el patrón/equipo",
      "y luego regenerar con `pnpm icons:backfill`.",
      "",
      "| Slug | Nombre | movement_pattern | primary_group |",
      "| ---- | ------ | ---------------- | ------------- |"
    );
    for (const item of machineGeneric.sort((a, b) => a.slug.localeCompare(b.slug))) {
      const escape = (s: string | null) => (s ?? "").replace(/\|/g, "\\|");
      lines.push(
        `| ${escape(item.slug)} | ${escape(item.name)} | ${escape(item.movement_pattern)} | ${escape(item.primary_group)} |`
      );
    }
  }

  return lines.join("\n") + "\n";
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");

  // 1) Validar variables de entorno
  const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!supabaseUrl || supabaseUrl.includes("placeholder") || !serviceRoleKey) {
    console.error(
      "ERROR: NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no definidos.\n" +
        "Necesitás la DB local corriendo (supabase start) y .env cargado."
    );
    process.exit(1);
  }

  // 2) Leer ejercicios desde Postgres
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  console.log("Leyendo ejercicios desde exercise_library...");
  const { data: exercises, error } = await supabase
    .from("exercise_library")
    .select("slug, name, movement_pattern, equipment, primary_group")
    .order("slug", { ascending: true });

  if (error) {
    console.error("ERROR al leer exercise_library:", error.message);
    process.exit(1);
  }
  if (!exercises || exercises.length === 0) {
    console.error("ERROR: exercise_library está vacía. ¿Corriste db:reset?");
    process.exit(1);
  }

  console.log(`Total ejercicios: ${exercises.length}`);

  // 3) Correr el resolver + override sobre cada ejercicio
  const assignments: IconAssignment[] = [];
  const distribution = new Map<ExerciseIconKey, number>();
  const byResolution = { resolver: 0, spanish: 0, fallback: 0 };

  for (const ex of exercises as ExerciseRow[]) {
    // 3a. Resolver real
    const resolverKey = resolveExerciseIconKey(
      ex.movement_pattern,
      ex.equipment,
      ex.primary_group
    );

    // 3b. Override para patrones en español
    const { icon, resolved_by } = applySpanishOverride(ex, resolverKey);

    assignments.push({
      slug: ex.slug,
      name: ex.name,
      movement_pattern: ex.movement_pattern,
      primary_group: ex.primary_group,
      icon,
      resolved_by,
    });

    distribution.set(icon, (distribution.get(icon) ?? 0) + 1);
    if (resolved_by === "resolver") byResolution.resolver++;
    else if (resolved_by === "spanish-override") byResolution.spanish++;
    else byResolution.fallback++;
  }

  // 4) Separar los machine-generic
  const machineGeneric = assignments.filter((a) => a.icon === "machine-generic");

  // 5) Imprimir reporte
  console.log("\n=== DISTRIBUCIÓN POR KEY ===");
  const sorted = [...distribution.entries()].sort((a, b) => b[1] - a[1]);
  for (const [key, count] of sorted) {
    const pct = ((count / exercises.length) * 100).toFixed(1);
    const marker = key === "machine-generic" ? " ← REVISAR" : "";
    console.log(`  ${key.padEnd(20)} ${String(count).padStart(3)} (${pct}%)${marker}`);
  }

  console.log(`\n=== TOTALES ===`);
  console.log(`  Total ejercicios:        ${exercises.length}`);
  console.log(`  Por resolver (inglés):   ${byResolution.resolver}`);
  console.log(`  Por override español:    ${byResolution.spanish}`);
  console.log(`  Por fallback de grupo:   ${byResolution.fallback}`);
  console.log(`  machine-generic:         ${machineGeneric.length}`);

  if (machineGeneric.length > 0) {
    console.log("\n=== EJERCICIOS machine-generic ===");
    for (const item of machineGeneric) {
      console.log(
        `  ${item.slug.padEnd(45)} pattern="${item.movement_pattern ?? "NULL"}" group="${item.primary_group ?? "NULL"}"`
      );
    }
  }

  if (dryRun) {
    console.log("\n[DRY RUN] No se escribió ningún archivo.");
    return;
  }

  // 6) Escribir SQL
  const sql = generateSql(assignments);
  fs.writeFileSync(SQL_PATH, sql, "utf8");
  console.log(`\nEscrito: ${SQL_PATH}`);

  // 7) Escribir reporte markdown
  const reportDir = path.dirname(REPORT_PATH);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  const report = generateReport(machineGeneric, distribution, exercises.length, byResolution);
  fs.writeFileSync(REPORT_PATH, report, "utf8");
  console.log(`Escrito: ${REPORT_PATH}`);
}

main().catch((err) => {
  console.error("ERROR fatal:", err instanceof Error ? err.stack : String(err));
  process.exit(1);
});
