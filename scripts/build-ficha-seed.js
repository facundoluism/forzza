// build-ficha-seed.js — Convierte los JSON de contenido de fichas (supabase/seed/ficha/*.json)
// en un seed SQL idempotente (supabase/seed/exercises_ficha.sql) con UPDATE por slug.
// El contenido queda content_verified=false (gate de validación humana de seguridad).
//
// Uso: node scripts/build-ficha-seed.js
const fs = require("fs");
const path = require("path");

const FICHA_DIR = path.join(__dirname, "..", "supabase", "seed", "ficha");
const OUT = path.join(__dirname, "..", "supabase", "seed", "exercises_ficha.sql");

function sqlStr(s) {
  // Escapa para string SQL entre comillas simples.
  return "'" + String(s).replace(/'/g, "''") + "'";
}
function jsonbArr(arr) {
  // Array de strings → literal JSONB escapado.
  return sqlStr(JSON.stringify(arr ?? [])) + "::jsonb";
}
function textArr(arr) {
  // TEXT[] → ARRAY['a','b'] (o '{}' vacío).
  if (!arr || arr.length === 0) return "'{}'::text[]";
  return "ARRAY[" + arr.map(sqlStr).join(",") + "]::text[]";
}

const files = fs.readdirSync(FICHA_DIR).filter((f) => f.endsWith(".json")).sort();
let rows = [];
const seenSlugs = new Set();
for (const f of files) {
  const arr = JSON.parse(fs.readFileSync(path.join(FICHA_DIR, f), "utf8"));
  for (const o of arr) {
    if (seenSlugs.has(o.slug)) { console.error("SLUG DUPLICADO:", o.slug, "en", f); process.exit(1); }
    seenSlugs.add(o.slug);
    // Validación mínima de forma
    const reqArr = ["execution_steps_es", "execution_steps_en", "common_errors_es", "common_errors_en"];
    for (const k of reqArr) if (!Array.isArray(o[k])) { console.error("CAMPO NO-ARRAY:", k, o.slug); process.exit(1); }
    if (o.execution_steps_es.length !== o.execution_steps_en.length) { console.error("PARIDAD pasos:", o.slug); process.exit(1); }
    if (o.common_errors_es.length !== o.common_errors_en.length) { console.error("PARIDAD errores:", o.slug); process.exit(1); }
    rows.push(o);
  }
}

let sql = `-- exercises_ficha.sql — GENERADO por scripts/build-ficha-seed.js (no editar a mano)
-- Contenido de fichas de ejercicio (pasos/errores/pro_tip/terciarios) ES+EN.
-- content_verified queda en false: requiere validación de entrenador antes de prod.
-- Fuente: supabase/seed/ficha/*.json
BEGIN;
`;
for (const o of rows) {
  sql += `UPDATE public.exercise_library SET
  execution_steps_es = ${jsonbArr(o.execution_steps_es)},
  execution_steps_en = ${jsonbArr(o.execution_steps_en)},
  common_errors_es = ${jsonbArr(o.common_errors_es)},
  common_errors_en = ${jsonbArr(o.common_errors_en)},
  pro_tip_es = ${o.pro_tip_es == null ? "NULL" : sqlStr(o.pro_tip_es)},
  pro_tip_en = ${o.pro_tip_en == null ? "NULL" : sqlStr(o.pro_tip_en)},
  tertiary_muscles = ${textArr(o.tertiary_muscles)}
WHERE slug = ${sqlStr(o.slug)};
`;
}
sql += "COMMIT;\n";

fs.writeFileSync(OUT, sql, "utf8");
console.log(`OK: ${rows.length} ejercicios → ${path.relative(path.join(__dirname, ".."), OUT)} (${files.length} bloques: ${files.join(", ")})`);
