// videos/scoring — función central de ranking de candidatos (§4.3).
// Pura y determinística: sin red, sin Supabase, sin React.
//
// El allowlist de canales vive en @forzza/config
// (EXERCISE_VIDEO_CHANNEL_ALLOWLIST). Para mantener packages/core libre de
// dependencias cruzadas, scoreCandidate lo recibe por opciones; el server
// inyecta la constante de config. Sin allowlist, la señal de canal vale 0.

import type {
  ExerciseContext,
  ScorableVideo,
  ScoreBreakdown,
  ScoredCandidate,
  ScoreWeights,
} from "./types";

/** Pesos default por señal. Suman 1.0 (§4.3). */
export const DEFAULT_SCORE_WEIGHTS: ScoreWeights = {
  text: 0.3,
  channel: 0.25,
  engagement: 0.2,
  duration: 0.1,
  language: 0.1,
  captionsRecency: 0.05,
};

/** Opciones de scoring. El allowlist de canales se inyecta desde config. */
export interface ScoreOptions {
  /** Nombres de canal normalizados (lowercase, sin acentos) habilitados. */
  channelAllowlist?: readonly string[];
}

const ZERO_BREAKDOWN: ScoreBreakdown = {
  text: 0,
  channel: 0,
  engagement: 0,
  duration: 0,
  language: 0,
  captionsRecency: 0,
};

// Stopwords básicas ES/EN para el matching de texto y la heurística de idioma.
const STOPWORDS_ES: ReadonlySet<string> = new Set([
  "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "al",
  "a", "ante", "con", "en", "para", "por", "que", "se", "su", "sus", "y", "o",
  "como", "hacer", "mas", "muy", "lo", "le", "es", "son", "tu", "te", "mi",
]);
const STOPWORDS_EN: ReadonlySet<string> = new Set([
  "the", "a", "an", "of", "to", "for", "in", "on", "at", "with", "and", "or",
  "how", "do", "does", "is", "are", "this", "that", "your", "you", "it", "by",
  "from", "as", "be",
]);
// Términos de equipamiento genéricos: aparecen en muchos nombres y títulos
// y no aportan a distinguir el ejercicio. Solo afectan el tokenizador,
// NO la heurística de idioma (no se agregan a STOPWORDS_ES/EN).
const EQUIPMENT_STOPWORDS: ReadonlySet<string> = new Set(["maquina", "machine"]);

const STOPWORDS: ReadonlySet<string> = new Set([
  ...STOPWORDS_ES,
  ...STOPWORDS_EN,
  ...EQUIPMENT_STOPWORDS,
]);

/** lowercase + saca acentos/diacríticos. */
function stripAccents(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Tokeniza: normaliza, separa por no-alfanuméricos, saca stopwords y vacíos. */
function tokenize(value: string): Set<string> {
  const normalized = stripAccents(value);
  const raw = normalized.split(/[^a-z0-9]+/);
  const tokens = new Set<string>();
  for (const token of raw) {
    if (token.length === 0) continue;
    if (STOPWORDS.has(token)) continue;
    tokens.add(token);
  }
  return tokens;
}

/** Acota un número al rango [0, 1]. */
function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

// ─── Señales ────────────────────────────────────────────────────────────────

/**
 * text: recall del nombre del ejercicio en el TÍTULO del video.
 *   coverage = |nameTokens ∩ titleTokens| / nameTokens.size
 * Se usa solo el título (no la descripción) para evitar inflar la unión
 * con cientos de tokens irrelevantes de las descripciones de YouTube.
 */
function scoreText(video: ScorableVideo, exercise: ExerciseContext): number {
  const targetName =
    exercise.lang === "en" ? (exercise.nameEn ?? exercise.name) : exercise.name;
  const nameTokens = tokenize(targetName);
  if (nameTokens.size === 0) return 0;
  const titleTokens = tokenize(video.title);
  let intersection = 0;
  for (const token of nameTokens) {
    if (titleTokens.has(token)) intersection += 1;
  }
  return clamp01(intersection / nameTokens.size);
}

/**
 * Normalización robusta de nombre de canal: lowercase, sin acentos,
 * y elimina todo carácter no alfanumérico (espacios, guiones, ™, etc.).
 * Así "ATHLEAN-X™" → "athleanx", "Scott Herman Fitness" → "scotthermanfitness".
 */
function normalizeChannel(s: string): string {
  return stripAccents(s).replace(/[^a-z0-9]/g, "");
}

/**
 * channel: 1 si channelId o channelTitle (normalizados) son iguales a, o
 * contienen, alguna entrada normalizada del allowlist.
 * Ejemplo: allowlist "athleanx" matchea "ATHLEAN-X™" y "ATHLEAN-X Español".
 */
function scoreChannel(
  video: ScorableVideo,
  allowlist: readonly string[]
): number {
  if (allowlist.length === 0) return 0;
  const normalizedAllowlist = allowlist.map(normalizeChannel);
  const normalizedId = normalizeChannel(video.channelId);
  const normalizedTitle = normalizeChannel(video.channelTitle);
  for (const entry of normalizedAllowlist) {
    if (entry.length === 0) continue;
    if (normalizedId === entry || normalizedId.includes(entry)) return 1;
    if (normalizedTitle === entry || normalizedTitle.includes(entry)) return 1;
  }
  return 0;
}

/**
 * engagement: combina popularidad (log10 de views, normalizado a 1M views),
 * ratio likes/views (saturado a 5%) y presencia de comentarios. Acotada [0,1].
 *
 * Fórmula: 0.5·popularidad + 0.4·likeRatio + 0.1·tieneComentarios
 *   - popularidad = log10(views+1) / log10(1_000_000+1)  (1M views ≈ 1.0)
 *   - likeRatio   = min(likes/views, 0.05) / 0.05         (5% likes ≈ 1.0)
 *   - comentarios = 1 si commentCount > 0, si no 0
 */
function scoreEngagement(video: ScorableVideo): number {
  const views = Math.max(0, video.viewCount);
  const likes = Math.max(0, video.likeCount);

  const POPULARITY_REF = Math.log10(1_000_000 + 1);
  const popularity = clamp01(Math.log10(views + 1) / POPULARITY_REF);

  const LIKE_RATIO_CAP = 0.05;
  const likeRatio =
    views > 0 ? clamp01(Math.min(likes / views, LIKE_RATIO_CAP) / LIKE_RATIO_CAP) : 0;

  const comments = video.commentCount > 0 ? 1 : 0;

  return clamp01(0.5 * popularity + 0.4 * likeRatio + 0.1 * comments);
}

/**
 * duration: premia 30s–6min (=1), penaliza linealmente por fuera, llega a 0
 * en <15s y en >12min. Acotada [0, 1].
 */
function scoreDuration(video: ScorableVideo): number {
  const d = video.durationSeconds;
  const MIN_HARD = 15; // 0 por debajo
  const MIN_OK = 30; // sweet-spot inicio
  const MAX_OK = 360; // 6 min — sweet-spot fin
  const MAX_HARD = 720; // 12 min — 0 por encima

  if (d <= MIN_HARD || d >= MAX_HARD) return 0;
  if (d >= MIN_OK && d <= MAX_OK) return 1;
  if (d < MIN_OK) {
    // rampa de subida entre 15s y 30s
    return clamp01((d - MIN_HARD) / (MIN_OK - MIN_HARD));
  }
  // rampa de bajada entre 6min y 12min
  return clamp01((MAX_HARD - d) / (MAX_HARD - MAX_OK));
}

/**
 * language: 1 si defaultAudioLanguage empieza con el lang esperado; si es null,
 * heurística de stopwords sobre el título; si no hay señal, 0.5 (neutro).
 */
function scoreLanguage(video: ScorableVideo, exercise: ExerciseContext): number {
  const expected = exercise.lang;
  const declared = video.defaultAudioLanguage;
  if (declared !== null && declared.trim().length > 0) {
    return stripAccents(declared).startsWith(expected) ? 1 : 0;
  }

  // Heurística: contar stopwords del idioma esperado vs el otro en el título.
  const titleTokens = stripAccents(video.title).split(/[^a-z0-9]+/);
  let esHits = 0;
  let enHits = 0;
  for (const token of titleTokens) {
    if (token.length === 0) continue;
    if (STOPWORDS_ES.has(token)) esHits += 1;
    if (STOPWORDS_EN.has(token)) enHits += 1;
  }
  const expectedHits = expected === "es" ? esHits : enHits;
  const otherHits = expected === "es" ? enHits : esHits;
  if (expectedHits === 0 && otherHits === 0) return 0.5; // sin señal → neutro
  return expectedHits >= otherHits ? 1 : 0;
}

/** captionsRecency: hasCaptions ? 1 : 0 (sin fecha disponible aún). */
function scoreCaptionsRecency(video: ScorableVideo): number {
  return video.hasCaptions ? 1 : 0;
}

/** Redondea a 4 decimales. */
function round4(value: number): number {
  return Math.round(value * 1e4) / 1e4;
}

/**
 * Puntúa un candidato contra un ejercicio. Devuelve score [0,1] y breakdown.
 * Si el video no es embebible → descartado con score 0.
 */
export function scoreCandidate(
  video: ScorableVideo,
  exercise: ExerciseContext,
  weights: ScoreWeights = DEFAULT_SCORE_WEIGHTS,
  options: ScoreOptions = {}
): ScoredCandidate {
  if (video.embeddable === false) {
    return {
      score: 0,
      breakdown: { ...ZERO_BREAKDOWN },
      discarded: true,
      discardReason: "not_embeddable",
    };
  }

  const allowlist = options.channelAllowlist ?? [];

  // Calcular text score una sola vez para reusarlo en el descarte y el breakdown.
  const textScore = scoreText(video, exercise);

  // Hard filter: si ningún token del nombre del ejercicio aparece en el título,
  // el video es irrelevante (ej: un video de abdominales para "fondos en cable").
  if (textScore === 0) {
    return {
      score: 0,
      breakdown: { ...ZERO_BREAKDOWN, text: 0 },
      discarded: true,
      discardReason: "irrelevant_title",
    };
  }

  const breakdown: ScoreBreakdown = {
    text: textScore,
    channel: scoreChannel(video, allowlist),
    engagement: scoreEngagement(video),
    duration: scoreDuration(video),
    language: scoreLanguage(video, exercise),
    captionsRecency: scoreCaptionsRecency(video),
  };

  const score =
    weights.text * breakdown.text +
    weights.channel * breakdown.channel +
    weights.engagement * breakdown.engagement +
    weights.duration * breakdown.duration +
    weights.language * breakdown.language +
    weights.captionsRecency * breakdown.captionsRecency;

  return {
    score: round4(clamp01(score)),
    breakdown,
    discarded: false,
    discardReason: null,
  };
}

/** Item de la lista puntuada devuelta por pickBest. */
export interface ScoredItem {
  video: ScorableVideo;
  result: ScoredCandidate;
}

/** Resultado de pickBest: ganador (o null) + todos los candidatos puntuados. */
export interface PickBestResult {
  winner: ScorableVideo | null;
  scored: ScoredItem[];
}

/**
 * Puntúa todos los candidatos, descarta los `discarded`, ordena por score desc
 * y devuelve el mejor (o null si todos quedan descartados).
 *
 * `scored` incluye TODOS los candidatos (descartados también) ordenados por
 * score descendente, para trazabilidad.
 */
export function pickBest(
  videos: ScorableVideo[],
  exercise: ExerciseContext,
  weights: ScoreWeights = DEFAULT_SCORE_WEIGHTS,
  options: ScoreOptions = {}
): PickBestResult {
  const scored: ScoredItem[] = videos.map((video) => ({
    video,
    result: scoreCandidate(video, exercise, weights, options),
  }));

  scored.sort((a, b) => b.result.score - a.result.score);

  const best = scored.find((item) => !item.result.discarded);
  return {
    winner: best ? best.video : null,
    scored,
  };
}
