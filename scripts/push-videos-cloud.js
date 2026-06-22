#!/usr/bin/env node
// push-videos-cloud — sube supabase/seed/exercise_videos.sql al Supabase CLOUD.
//
// El seed es idempotente (ON CONFLICT (exercise_id, lang) DO UPDATE): re-correrlo
// no duplica ni borra, solo upsertea. No toca ninguna otra tabla.
//
// Uso:
//   pnpm videos:push-cloud            -> DRY RUN: muestra host, conteo en cloud y qué subiría
//   pnpm videos:push-cloud --confirm  -> APLICA el seed al cloud y reverifica el conteo
//
// Conecta directo con DATABASE_URL del .env (no usa el container Docker; la conexión
// directa de Supabase es IPv6-only y el container no rutea IPv6, el host de Windows sí).
require("dotenv/config");
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const SEED = path.join(__dirname, "..", "supabase", "seed", "exercise_videos.sql");
const confirm = process.argv.includes("--confirm");

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("ERROR: falta DATABASE_URL en .env");
  process.exit(1);
}

// Guardarraíl: jamás correr esto contra el Postgres local por error.
const masked = dbUrl.replace(/postgres(ql)?:\/\/[^@]+@/, "postgres://***@");
if (/127\.0\.0\.1|localhost|@db:|:54322/.test(dbUrl)) {
  console.error(`ERROR: DATABASE_URL apunta a un Postgres LOCAL (${masked}).`);
  console.error("Este script es solo para el CLOUD. Abortando.");
  process.exit(1);
}
if (!/\.supabase\.(co|com)/.test(dbUrl)) {
  console.error(`ERROR: DATABASE_URL no parece un host de Supabase cloud (${masked}). Abortando por seguridad.`);
  process.exit(1);
}

const COUNTS_SQL = `
  select count(*) total,
         count(*) filter (where exists (select 1 from public.exercise_videos v where v.exercise_id = e.id)) con_video,
         coalesce((select count(*) from public.exercise_videos where status = 'needs_review'), 0) needs_review
  from public.exercise_library e;`;

async function main() {
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  console.log(`Cloud:  ${masked}`);
  try {
    await client.connect();
  } catch (e) {
    console.error(`\nERROR conectando al cloud: ${e.message}`);
    process.exit(1);
  }

  try {
    const before = (await client.query(COUNTS_SQL)).rows[0];
    console.log(`Estado actual en cloud: ${before.con_video}/${before.total} con video, ${before.needs_review} en needs_review`);

    if (!confirm) {
      const seedSql = fs.readFileSync(SEED, "utf8");
      const inserts = (seedSql.match(/INSERT INTO/g) || []).length;
      console.log(`\nDRY RUN. El seed local tiene ${inserts} upserts (idempotentes).`);
      console.log("Para aplicarlo de verdad:  pnpm videos:push-cloud --confirm");
      return;
    }

    console.log("\nAplicando seed al cloud...");
    await client.query(fs.readFileSync(SEED, "utf8")); // el seed ya envuelve todo en BEGIN/COMMIT
    const after = (await client.query(COUNTS_SQL)).rows[0];
    console.log(`Listo. Cloud ahora: ${after.con_video}/${after.total} con video, ${after.needs_review} en needs_review`);
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(`ERROR: ${e.message}`);
  process.exit(1);
});
