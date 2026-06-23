-- =============================================================================
-- FORZZA — Personalizaciones de ejercicio por coach
-- Migración: 20260622180000_coach_exercise_personalizations.sql
--
-- Permite al coach asociar tips propios y/o un video propio a cualquier ejercicio
-- de la librería, GLOBAL por (coach, ejercicio). Sus alumnos activos pueden leer.
-- =============================================================================

-- ─────────────────────────────────────────────
-- 1. TABLA
-- ─────────────────────────────────────────────
CREATE TABLE public.coach_exercise_personalizations (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id    uuid        NOT NULL REFERENCES public.coach_profiles(id) ON DELETE CASCADE,
  exercise_id uuid        NOT NULL REFERENCES public.exercise_library(id) ON DELETE CASCADE,
  tips        text,
  video_path  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (coach_id, exercise_id)
);

-- ─────────────────────────────────────────────
-- 2. TRIGGER updated_at
-- ─────────────────────────────────────────────
CREATE TRIGGER coach_exercise_personalizations_updated_at
  BEFORE UPDATE ON public.coach_exercise_personalizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────
-- 3. RLS — DEFAULT DENY
-- ─────────────────────────────────────────────
ALTER TABLE public.coach_exercise_personalizations ENABLE ROW LEVEL SECURITY;

-- 3a. El coach gestiona sus propias personalizaciones (SELECT/INSERT/UPDATE/DELETE).
CREATE POLICY "cep_coach_select"
  ON public.coach_exercise_personalizations
  FOR SELECT
  USING (
    coach_id = (
      SELECT id FROM public.coach_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "cep_coach_insert"
  ON public.coach_exercise_personalizations
  FOR INSERT
  WITH CHECK (
    coach_id = (
      SELECT id FROM public.coach_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "cep_coach_update"
  ON public.coach_exercise_personalizations
  FOR UPDATE
  USING (
    coach_id = (
      SELECT id FROM public.coach_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "cep_coach_delete"
  ON public.coach_exercise_personalizations
  FOR DELETE
  USING (
    coach_id = (
      SELECT id FROM public.coach_profiles WHERE user_id = auth.uid()
    )
  );

-- 3b. Los alumnos del coach pueden SELECT (solo si tienen assignment activo).
CREATE POLICY "cep_student_select"
  ON public.coach_exercise_personalizations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.coach_assignments ca
      WHERE ca.coach_id   = coach_exercise_personalizations.coach_id
        AND ca.student_id = auth.uid()
        AND ca.status     = 'active'::assignment_status
    )
  );

-- 3c. El owner ve todo.
CREATE POLICY "cep_owner_select"
  ON public.coach_exercise_personalizations
  FOR SELECT
  USING (auth_role() = 'owner'::user_role);

-- =============================================================================
-- 4. BUCKET DE STORAGE: coach-exercise-videos (PRIVADO)
-- Path convention: {coach_user_id}/{exercise_id}.{ext}
-- folder[1] = auth.uid() del coach
-- =============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'coach-exercise-videos',
  'coach-exercise-videos',
  false,
  209715200,  -- 200MB
  ARRAY['video/mp4', 'video/quicktime', 'video/webm']
)
ON CONFLICT (id) DO NOTHING;

-- 4a. El coach sube/actualiza/borra archivos en SU carpeta (folder[1] = auth.uid()).
CREATE POLICY "cev_coach_insert" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'coach-exercise-videos'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "cev_coach_update" ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'coach-exercise-videos'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'coach-exercise-videos'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "cev_coach_delete" ON storage.objects FOR DELETE
  USING (
    bucket_id = 'coach-exercise-videos'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4b. El coach dueño puede leer sus propios archivos.
CREATE POLICY "cev_coach_select" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'coach-exercise-videos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4c. Los alumnos activos del coach pueden leer los videos de ese coach.
--     folder[1] = user_id del coach → joineamos coach_profiles para obtener el coach_id.
CREATE POLICY "cev_student_select" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'coach-exercise-videos'
    AND EXISTS (
      SELECT 1
      FROM public.coach_assignments ca
      JOIN public.coach_profiles cp ON cp.id = ca.coach_id
      WHERE cp.user_id::text = (storage.foldername(name))[1]
        AND ca.student_id    = auth.uid()
        AND ca.status        = 'active'::assignment_status
    )
  );
