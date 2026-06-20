-- exercise_video_feedback — directivas de curación persitidas por el owner al descartar/ajustar
-- videos en /admin/videos. El pipeline scripts/build-exercise-videos.ts las lee en cada ejecución
-- para afinar búsquedas: bloquear canales/videos, anclar un video, ajustar query, aplicar filtros.
--
-- Tabla APPEND-ONLY: solo INSERT. No se updatea ni borra desde la app.
-- block_channel es global por defecto: exercise_id = NULL cuando aplica a todos los ejercicios.

CREATE TABLE exercise_video_feedback (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id   UUID REFERENCES exercise_library(id) ON DELETE CASCADE,
  lang          TEXT CHECK (lang IN ('es','en')),
  action        TEXT NOT NULL CHECK (action IN (
                  'block_video',
                  'block_channel',
                  'pin_video',
                  'adjust_query',
                  'set_filter'
                )),
  youtube_id    TEXT,
  channel_title TEXT,
  query_add     TEXT[],
  query_remove  TEXT[],
  filters       JSONB,
  note          TEXT,
  created_by    UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice primario de consulta del pipeline: "dame todo el feedback de este exercise_id O global,
-- para este lang O lang NULL". Cubre la búsqueda WHERE exercise_id = $1 OR exercise_id IS NULL
-- y WHERE lang = $2 OR lang IS NULL eficientemente al incluir ambas columnas.
CREATE INDEX exercise_video_feedback_exercise_lang_idx
  ON exercise_video_feedback (exercise_id, lang);

-- Índice parcial para las reglas globales de canal (block_channel sin ejercicio específico).
-- El pipeline puede obtener todos los canales bloqueados globalmente con un scan mínimo.
CREATE INDEX exercise_video_feedback_global_block_channel_idx
  ON exercise_video_feedback (action)
  WHERE exercise_id IS NULL AND action = 'block_channel';

-- Índice sobre action para que el pipeline filtre por tipo de directiva sin full scan.
CREATE INDEX exercise_video_feedback_action_idx
  ON exercise_video_feedback (action);

ALTER TABLE exercise_video_feedback ENABLE ROW LEVEL SECURITY;

-- Solo el owner (y service-role, que bypasea RLS) puede SELECT.
-- Usuarios autenticados normales: DENY por defecto (sin política explícita = sin acceso).
CREATE POLICY "exercise_video_feedback_owner_select" ON exercise_video_feedback FOR SELECT
  USING (auth_role() = 'owner');

-- Solo el owner puede INSERT (append-only desde la app).
CREATE POLICY "exercise_video_feedback_owner_insert" ON exercise_video_feedback FOR INSERT
  WITH CHECK (auth_role() = 'owner');
-- No hay UPDATE ni DELETE: append-only.
