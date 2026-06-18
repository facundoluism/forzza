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
 * El resolver resolveExerciseIconKey() maneja tanto patrones en inglés como en
 * español / bilingüe ("Jalón / Pull", "Empuje / Push", "Bisagra de cadera / Hinge").
 * La resolución de español vive en packages/ui/src/exerciseIconMap.ts — no aquí.
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
  resolved_by: "resolver" | "machine-generic";
};

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
  total: number
): string {
  const lines: string[] = [
    "# Iconos de ejercicio sin resolver (machine-generic)",
    "",
    `Generado: ${new Date().toISOString()}  `,
    `Total ejercicios: ${total}  `,
    `Resueltos por resolver: ${total - machineGeneric.length}  `,
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
      "Estos ejercicios no tienen un patrón de movimiento reconocido por el resolver.",
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

  // 3) Resolver cada ejercicio con el resolver unificado
  const assignments: IconAssignment[] = [];
  const distribution = new Map<ExerciseIconKey, number>();

  for (const ex of exercises as ExerciseRow[]) {
    const icon = resolveExerciseIconKey(
      ex.movement_pattern,
      ex.equipment,
      ex.primary_group
    );
    const resolved_by: "resolver" | "machine-generic" =
      icon === "machine-generic" ? "machine-generic" : "resolver";

    assignments.push({
      slug: ex.slug,
      name: ex.name,
      movement_pattern: ex.movement_pattern,
      primary_group: ex.primary_group,
      icon,
      resolved_by,
    });

    distribution.set(icon, (distribution.get(icon) ?? 0) + 1);
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
  console.log(`  Total ejercicios:  ${exercises.length}`);
  console.log(`  Resueltos:         ${exercises.length - machineGeneric.length}`);
  console.log(`  machine-generic:   ${machineGeneric.length}`);

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
  const report = generateReport(machineGeneric, distribution, exercises.length);
  fs.writeFileSync(REPORT_PATH, report, "utf8");
  console.log(`Escrito: ${REPORT_PATH}`);
}

main().catch((err) => {
  console.error("ERROR fatal:", err instanceof Error ? err.stack : String(err));
  process.exit(1);
});
