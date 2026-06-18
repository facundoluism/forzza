/**
 * build-exercise-videos.ts — Pipeline de ranking de videos demostrativos de ejercicios.
 *
 * GENERADO POR: scripts/build-exercise-videos.ts
 * NO modifica packages/core/src/videos/** (pipeline puro ya implementado).
 *
 * Uso:
 *   pnpm videos:generate [flags]
 *   pnpm videos:generate:dry
 *
 * Flags:
 *   --limit N           Corre solo los primeros N ejercicios (por slug, ordenado).
 *   --slugs a,b,c       Corre solo los slugs indicados.
 *   --lang es|en|both   Idioma(s) a buscar. Default: both.
 *   --dry-run           Solo imprime el ranking elegido, no escribe seed.
 *   --confirm-full      Permite correr todos los ejercicios sin --limit ni --slugs.
 *
 * Costo de cuota YouTube: 101 unidades por (ejercicio × idioma).
 * Cuota diaria default: 10.000 unidades → ~99 búsquedas por día.
 * El script aborta si se superan 50 búsquedas sin --limit, --slugs o --confirm-full.
 *
 * Estrategia de merge: mantiene un JSON intermedio (supabase/seed/exercise_videos.json)
 * como fuente acumulada. Cada corrida agrega/actualiza entradas por (slug, lang).
 * El .sql se regenera completo desde el JSON en cada corrida.
 */

import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

import {
  buildSearchQuery,
  pickBest,
  type ExerciseContext,
} from "../packages/core/src/videos/index.js";
import { RealYouTubeClient } from "../packages/core/src/videos/youtube/index.js";
import {
  EXERCISE_VIDEO_CHANNEL_ALLOWLIST,
  EXERCISE_VIDEO_AUTOPUBLISH_THRESHOLD,
} from "../packages/config/src/index.js";
import type { ScoreBreakdown } from "../packages/core/src/videos/types.js";

// ─── Rutas ────────────────────────────────────────────────────────────────────

// fileURLToPath maneja correctamente las rutas en Windows (drive letter, backslashes)
// y POSIX; evita el bug de duplicar el drive al hacer path.join sobre /C:/...
const REPO_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const JSON_PATH = path.join(REPO_ROOT, "supabase", "seed", "exercise_videos.json");
const SQL_PATH = path.join(REPO_ROOT, "supabase", "seed", "exercise_videos.sql");

// ─── Tipos internos ───────────────────────────────────────────────────────────

interface VideoEntry {
  slug: string;
  lang: "es" | "en";
  youtubeId: string;
  title: string;
  channelId: string;
  channelTitle: string;
  durationSeconds: number;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  status: "published" | "needs_review";
}

// ─── Helpers SQL ──────────────────────────────────────────────────────────────

function sqlStr(s: string): string {
  return "'" + s.replace(/'/g, "''") + "'";
}

function buildInsertRow(entry: VideoEntry): string {
  const breakdownJson = JSON.stringify(entry.scoreBreakdown).replace(/'/g, "''");
  return (
    `INSERT INTO public.exercise_videos ` +
    `(exercise_id, lang, youtube_id, title, channel_id, channel_title, duration_seconds, score, score_breakdown, status)\n` +
    `SELECT id, ${sqlStr(entry.lang)}, ${sqlStr(entry.youtubeId)}, ${sqlStr(entry.title)}, ` +
    `${sqlStr(entry.channelId)}, ${sqlStr(entry.channelTitle)}, ` +
    `${entry.durationSeconds}, ${entry.score}, '${breakdownJson}'::jsonb, ${sqlStr(entry.status)}\n` +
    `FROM public.exercise_library WHERE slug = ${sqlStr(entry.slug)}\n` +
    `ON CONFLICT (exercise_id, lang) DO UPDATE SET\n` +
    `  youtube_id = EXCLUDED.youtube_id,\n` +
    `  title = EXCLUDED.title,\n` +
    `  channel_id = EXCLUDED.channel_id,\n` +
    `  channel_title = EXCLUDED.channel_title,\n` +
    `  duration_seconds = EXCLUDED.duration_seconds,\n` +
    `  score = EXCLUDED.score,\n` +
    `  score_breakdown = EXCLUDED.score_breakdown,\n` +
    `  status = EXCLUDED.status,\n` +
    `  updated_at = now();`
  );
}

function generateSql(entries: VideoEntry[]): string {
  const header =
    `-- exercise_videos.sql — GENERADO por scripts/build-exercise-videos.ts\n` +
    `-- NO editar a mano. Fuente acumulada: supabase/seed/exercise_videos.json\n` +
    `-- Regenerar con: pnpm videos:generate\n`;

  const rows = entries.map(buildInsertRow).join("\n\n");
  return `${header}\nBEGIN;\n\n${rows}\n\nCOMMIT;\n`;
}

// ─── CLI args ─────────────────────────────────────────────────────────────────

function parseArgs(): {
  limit: number | null;
  slugs: string[] | null;
  lang: "es" | "en" | "both";
  dryRun: boolean;
  confirmFull: boolean;
} {
  const argv = process.argv.slice(2);

  const limitIdx = argv.indexOf("--limit");
  const limit = limitIdx >= 0 ? parseInt(argv[limitIdx + 1] ?? "", 10) : null;

  const slugsIdx = argv.indexOf("--slugs");
  const slugsRaw = slugsIdx >= 0 ? (argv[slugsIdx + 1] ?? "") : null;
  const slugs = slugsRaw ? slugsRaw.split(",").map((s) => s.trim()).filter(Boolean) : null;

  const langIdx = argv.indexOf("--lang");
  const langRaw = langIdx >= 0 ? argv[langIdx + 1] : null;
  const lang: "es" | "en" | "both" =
    langRaw === "es" || langRaw === "en" || langRaw === "both" ? langRaw : "both";

  const dryRun = argv.includes("--dry-run");
  const confirmFull = argv.includes("--confirm-full");

  if (limit !== null && (isNaN(limit) || limit <= 0)) {
    console.error("ERROR: --limit debe ser un entero positivo.");
    process.exit(1);
  }

  return { limit, slugs, lang, dryRun, confirmFull };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const { limit, slugs, lang, dryRun, confirmFull } = parseArgs();

  // 1) Validar variables de entorno
  const apiKey = process.env["YOUTUBE_API_KEY"];
  if (!apiKey) {
    console.error(
      "ERROR: YOUTUBE_API_KEY no está definido en .env.\n" +
        "Obtener en: console.cloud.google.com → APIs & Services → Credentials\n" +
        "(habilitar YouTube Data API v3 en la librería de APIs del proyecto)."
    );
    process.exit(1);
  }

  const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!supabaseUrl || supabaseUrl.includes("placeholder") || !serviceRoleKey) {
    console.error(
      "ERROR: NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no están definidos en .env.\n" +
        "Necesitás la DB local corriendo (supabase start) y las vars seteadas."
    );
    process.exit(1);
  }

  // 2) Leer ejercicios desde Postgres
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: exercises, error: dbError } = await supabase
    .from("exercise_library")
    .select("id, slug, name, name_en, equipment")
    .order("slug", { ascending: true });

  if (dbError) {
    console.error("ERROR al leer exercise_library:", dbError.message);
    process.exit(1);
  }
  if (!exercises || exercises.length === 0) {
    console.error("ERROR: exercise_library está vacía. ¿Corriste supabase start y db:reset?");
    process.exit(1);
  }

  // 3) Filtrar por --slugs o --limit
  let filtered = exercises as Array<{
    id: string;
    slug: string;
    name: string;
    name_en: string | null;
    equipment: string[] | null;
  }>;

  if (slugs !== null) {
    const slugSet = new Set(slugs);
    filtered = filtered.filter((e) => slugSet.has(e.slug));
    if (filtered.length === 0) {
      console.error(`ERROR: Ningún ejercicio encontrado para los slugs: ${slugs.join(", ")}`);
      process.exit(1);
    }
    const notFound = slugs.filter((s) => !filtered.some((e) => e.slug === s));
    if (notFound.length > 0) {
      console.warn(`ADVERTENCIA: slugs no encontrados en DB: ${notFound.join(", ")}`);
    }
  } else if (limit !== null) {
    filtered = filtered.slice(0, limit);
  }

  // 4) Calcular cantidad de búsquedas y verificar guardarraíl de cuota
  const langs: Array<"es" | "en"> =
    lang === "both" ? ["es", "en"] : [lang];
  const totalSearches = filtered.length * langs.length;

  const QUOTA_GUARDRAIL = 50;
  if (slugs === null && limit === null && !confirmFull && totalSearches > QUOTA_GUARDRAIL) {
    console.error(
      `ERROR: Esta corrida ejecutaría ${totalSearches} búsquedas (${filtered.length} ejercicios × ${langs.length} idiomas).\n` +
        `Eso supera el límite de seguridad de ${QUOTA_GUARDRAIL} búsquedas.\n` +
        `Opciones:\n` +
        `  --limit N         Corre solo los primeros N ejercicios\n` +
        `  --slugs a,b,c     Corre solo esos slugs\n` +
        `  --confirm-full    Corre todos (${exercises.length} ejercicios × ${langs.length} = ${exercises.length * langs.length} búsquedas, costo ~${exercises.length * langs.length * 101} unidades de cuota)`
    );
    process.exit(1);
  }

  console.log(
    `\nPipeline de videos: ${filtered.length} ejercicios × ${langs.length} idioma(s) = ${totalSearches} búsquedas` +
      (dryRun ? " [DRY RUN]" : "")
  );
  console.log(`${"─".repeat(80)}`);

  // 5) Inicializar cliente YouTube
  const ytClient = new RealYouTubeClient({ apiKey });

  // 6) Cargar JSON acumulado previo
  const accumulatedMap = new Map<string, VideoEntry>(); // key: "slug|lang"
  if (fs.existsSync(JSON_PATH)) {
    try {
      const prevEntries = JSON.parse(fs.readFileSync(JSON_PATH, "utf8")) as VideoEntry[];
      for (const entry of prevEntries) {
        accumulatedMap.set(`${entry.slug}|${entry.lang}`, entry);
      }
      console.log(`Cargadas ${accumulatedMap.size} entradas previas desde exercise_videos.json`);
    } catch (err) {
      console.warn(`ADVERTENCIA: No se pudo leer exercise_videos.json previo: ${String(err)}`);
    }
  }

  // 7) Procesar cada (ejercicio, idioma)
  let processed = 0;
  let sinCandidato = 0;

  for (const exercise of filtered) {
    for (const langCode of langs) {
      processed++;
      const ctx: ExerciseContext = {
        name: exercise.name,
        nameEn: exercise.name_en,
        description: null,
        equipment: exercise.equipment ?? [],
        lang: langCode,
      };

      const query = buildSearchQuery(ctx);

      let videos;
      try {
        videos = await ytClient.searchVideos(query, {
          maxResults: 10,
          relevanceLanguage: langCode,
        });
      } catch (err) {
        console.error(`  ERROR buscando ${exercise.slug}/${langCode}: ${String(err)}`);
        continue;
      }

      const { winner, scored } = pickBest(videos, ctx, undefined, {
        channelAllowlist: EXERCISE_VIDEO_CHANNEL_ALLOWLIST,
      });

      if (winner === null) {
        console.log(
          `  SIN_CANDIDATO  ${exercise.slug}/${langCode} (${videos.length} videos, todos descartados)`
        );
        sinCandidato++;
        continue;
      }

      // Obtener score y breakdown del ganador: es el primer item no-descartado en scored[]
      const winnerScoredItem = scored.find((item) => !item.result.discarded);
      const score = winnerScoredItem?.result.score ?? 0;
      const breakdown = winnerScoredItem?.result.breakdown ?? {
        text: 0,
        channel: 0,
        engagement: 0,
        duration: 0,
        language: 0,
        captionsRecency: 0,
      };

      // YouTubeVideoDetails es superset de ScorableVideo: tiene youtubeId en runtime
      const youtubeId = (winner as { youtubeId?: string }).youtubeId ?? "";
      const status: "published" | "needs_review" =
        score >= EXERCISE_VIDEO_AUTOPUBLISH_THRESHOLD ? "published" : "needs_review";

      console.log(
        `  ${exercise.slug} | ${langCode} | score=${score.toFixed(4)} | ${status} | ${youtubeId} | ${winner.channelTitle} | ${winner.title}`
      );

      const entry: VideoEntry = {
        slug: exercise.slug,
        lang: langCode,
        youtubeId,
        title: winner.title,
        channelId: winner.channelId,
        channelTitle: winner.channelTitle,
        durationSeconds: winner.durationSeconds,
        score,
        scoreBreakdown: breakdown,
        status,
      };

      accumulatedMap.set(`${exercise.slug}|${langCode}`, entry);
    }
  }

  console.log(`${"─".repeat(80)}`);
  console.log(
    `Completado: ${processed} búsquedas, ${sinCandidato} sin candidato, ${accumulatedMap.size} entradas totales en JSON.`
  );

  if (dryRun) {
    console.log("\n[DRY RUN] No se escribió ningún archivo.");
    return;
  }

  // 8) Escribir JSON acumulado
  const allEntries = Array.from(accumulatedMap.values()).sort((a, b) => {
    const slugCmp = a.slug.localeCompare(b.slug);
    if (slugCmp !== 0) return slugCmp;
    return a.lang.localeCompare(b.lang);
  });

  fs.writeFileSync(JSON_PATH, JSON.stringify(allEntries, null, 2) + "\n", "utf8");
  console.log(`\nEscrito: ${JSON_PATH} (${allEntries.length} entradas)`);

  // 9) Regenerar SQL desde JSON completo
  const sql = generateSql(allEntries);
  fs.writeFileSync(SQL_PATH, sql, "utf8");
  console.log(`Escrito: ${SQL_PATH}`);
}

main().catch((err) => {
  console.error("ERROR fatal:", err instanceof Error ? err.stack : String(err));
  process.exit(1);
});
