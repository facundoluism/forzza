-- =============================================================================
-- FORZZA — Perfil rico del coach
-- Migración: 20260622190000_coach_rich_profile.sql
--
-- 1. Columna interests en coach_profiles (intereses personales, distinto de specialties).
-- 2. Columna presentation_video_path en coach_profiles (path en bucket coach-gallery).
-- 3. Tabla coach_gallery: carrusel de imágenes/video de presentación.
--    - RLS: coach gestiona las suyas; SELECT público (anon + authenticated) para paths.
-- 4. Bucket coach-gallery (privado): imágenes + video; signed URLs via service-role en web.
--    - Escritura/borrado: coach en su carpeta (folder[1] = auth.uid()).
--    - Lectura: cualquier usuario authenticated (para generar signed URLs desde la app).
-- =============================================================================

-- ─────────────────────────────────────────────
-- 1. ALTER TABLE coach_profiles
-- ─────────────────────────────────────────────

ALTER TABLE public.coach_profiles
  ADD COLUMN IF NOT EXISTS interests text[] NOT NULL DEFAULT '{}'::text[];

ALTER TABLE public.coach_profiles
  ADD COLUMN IF NOT EXISTS presentation_video_path text;

-- ─────────────────────────────────────────────
-- 2. TABLA coach_gallery
-- ─────────────────────────────────────────────

CREATE TABLE public.coach_gallery (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id      uuid        NOT NULL REFERENCES public.coach_profiles(id) ON DELETE CASCADE,
  file_path     text        NOT NULL,
  display_order int         NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_coach_gallery_coach_order
  ON public.coach_gallery (coach_id, display_order);

-- Trigger updated_at (reutiliza la función existente update_updated_at)
CREATE TRIGGER coach_gallery_updated_at
  BEFORE UPDATE ON public.coach_gallery
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────
-- 3. RLS en coach_gallery — DEFAULT DENY
-- ─────────────────────────────────────────────

ALTER TABLE public.coach_gallery ENABLE ROW LEVEL SECURITY;

-- 3a. SELECT público: las filas solo contienen paths (sin PII);
--     el media real está protegido por signed URLs del bucket privado.
CREATE POLICY "coach_gallery_public_select"
  ON public.coach_gallery
  FOR SELECT
  USING (true);

-- 3b. El coach gestiona sus propias entradas.
CREATE POLICY "coach_gallery_coach_insert"
  ON public.coach_gallery
  FOR INSERT
  WITH CHECK (
    coach_id = (
      SELECT id FROM public.coach_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "coach_gallery_coach_update"
  ON public.coach_gallery
  FOR UPDATE
  USING (
    coach_id = (
      SELECT id FROM public.coach_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "coach_gallery_coach_delete"
  ON public.coach_gallery
  FOR DELETE
  USING (
    coach_id = (
      SELECT id FROM public.coach_profiles WHERE user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────
-- 4. BUCKET coach-gallery (PRIVADO)
--    100MB, imágenes + video
--    Path convention: {auth.uid()}/...
-- ─────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'coach-gallery',
  'coach-gallery',
  false,
  104857600,  -- 100 MB
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'video/webm'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- 4a. El coach sube archivos en su propia carpeta (folder[1] = auth.uid()).
CREATE POLICY "cg_coach_insert" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'coach-gallery'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4b. El coach puede actualizar archivos en su carpeta.
CREATE POLICY "cg_coach_update" ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'coach-gallery'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'coach-gallery'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4c. El coach puede borrar archivos en su carpeta.
CREATE POLICY "cg_coach_delete" ON storage.objects FOR DELETE
  USING (
    bucket_id = 'coach-gallery'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4d. Cualquier usuario authenticated puede leer (para generar signed URLs en la app).
--     El perfil web usa service-role server-side, por lo que anon no necesita política aquí.
CREATE POLICY "cg_authenticated_select" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'coach-gallery'
    AND auth.role() = 'authenticated'
  );
