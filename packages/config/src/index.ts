// Feature flags V1 — NO activar en V1 lo que está en false
export const FEATURE_FLAGS = {
  // Autenticación social
  APPLE_SIGN_IN: false, // HUMAN_REQUIRED: credenciales OAuth Apple
  GOOGLE_SIGN_IN: false, // HUMAN_REQUIRED: credenciales OAuth Google

  // Pagos in-app (IAP) — V1: false, pagos van por Mercado Pago web
  APPLE_PAYMENTS: false, // HUMAN_REQUIRED: App Store IAP (react-native-purchases)
  GOOGLE_PAYMENTS: false, // HUMAN_REQUIRED: Google Play IAP (react-native-purchases)

  // Países
  CHILE_ACTIVE: false, // preparado en DB, no activo en V1

  // V2+
  GROUPS_COMMUNITY: false,
  LIVE_SESSIONS: false,
  NUTRITION: false,
  AI_BODY_SCAN: false,
  RATINGS_REVIEWS: false,
  STRIPE: false,
  PROMOTERS_UI: false, // tablas SÍ, UI NO en V1
  APPLE_HEALTH: false,
  GOOGLE_FIT: false,
  BRAZIL: false,
} as const;

// Constantes de negocio (valores NO-secretos)
export const BUSINESS_RULES = {
  FREE_MAX_ROUTINES: 3,
  FREE_HISTORY_DAYS: 10,
  AUTOPROMO_SECONDS: 10,
  COMMISSION_THRESHOLD_STUDENTS: 4, // alumno 4 → billing_model pasa a comision
  COACH_ASSIGNMENT_REFUND_HOURS: 72, // refund auto si pending >72h
  COACH_PENDING_APPROVAL_HOURS: 48, // "48 h hábiles" para aprobar
  PUSH_DAILY_CAP: 3,
  QUIET_HOURS_START: 22, // 22:00 local
  QUIET_HOURS_END: 8,   // 08:00 local
  CHAT_COLLAPSE_MINUTES: 5,
} as const;

// ─── Videos demostrativos de ejercicios (Paso B — ranking) ───────────────────

/**
 * Allowlist de canales fitness reconocidos para la señal `channel` del scoring.
 * Son NOMBRES DE CANAL NORMALIZADOS: lowercase, sin acentos. El scoring compara
 * tanto channelId como channelTitle (normalizados) contra esta lista. Mezcla
 * canales EN y ES de técnica de ejercicio bien valorados.
 */
export const EXERCISE_VIDEO_CHANNEL_ALLOWLIST: readonly string[] = [
  // EN
  "athleanx",
  "jeff nippard",
  "scott herman fitness",
  "fitnessblender",
  "jeremy ethier",
  "renaissance periodization",
  "buff dudes",
  "calisthenicmovement",
  "the bioneer",
  "squat university",
  // ES
  "powerexplosive",
  "gymvirtual",
  "sergio peinado",
  "fitness real",
  "entrena con sergio",
  "patry jordan",
  "ictiofitness",
  "fersfit",
  "mmigueltraining",
  "saludablemente",
] as const;

/**
 * Umbral de confianza del gate de autopublicación (§4.2): si el score del mejor
 * candidato es ≥ este valor, el video se puede autopublicar; si no, queda para
 * revisión manual.
 */
export const EXERCISE_VIDEO_AUTOPUBLISH_THRESHOLD = 0.7;
