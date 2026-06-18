-- exercise_videos — video demostrativo de YouTube elegido por idioma para cada ejercicio.
-- Generado por scripts/build-exercise-videos.ts (pipeline de ranking en packages/core/src/videos).
-- status='needs_review' por defecto: el video solo se muestra al usuario cuando un humano lo publica
-- o cuando el score supera el umbral de autopublicación (gate en el script, no en la DB).

CREATE TABLE exercise_videos (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id      UUID NOT NULL REFERENCES exercise_library(id) ON DELETE CASCADE,
  lang             TEXT NOT NULL CHECK (lang IN ('es','en')),
  youtube_id       TEXT NOT NULL,
  title            TEXT NOT NULL,
  channel_id       TEXT,
  channel_title    TEXT NOT NULL,
  duration_seconds INTEGER,
  score            NUMERIC(5,4) NOT NULL,
  score_breakdown  JSONB,
  status           TEXT NOT NULL DEFAULT 'needs_review' CHECK (status IN ('published','needs_review')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (exercise_id, lang)
);

CREATE INDEX exercise_videos_exercise_idx ON exercise_videos (exercise_id);

ALTER TABLE exercise_videos ENABLE ROW LEVEL SECURITY;

-- Autenticados ven SOLO los publicados (mismo patrón de catálogo que exercise_library).
CREATE POLICY "exercise_videos_select_published" ON exercise_videos FOR SELECT
  USING (auth.uid() IS NOT NULL AND status = 'published');

-- Owner gestiona todo (cola de revisión incluida).
CREATE POLICY "exercise_videos_owner" ON exercise_videos FOR ALL
  USING (auth_role() = 'owner');
