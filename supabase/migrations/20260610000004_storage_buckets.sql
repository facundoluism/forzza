-- =============================================================================
-- FORZZA — Storage buckets privados
-- Migración: 20260610000004_storage_buckets.sql
-- =============================================================================

-- Crear buckets privados
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('progress-photos', 'progress-photos', false, 10485760, -- 10MB
   ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('fiscal-docs', 'fiscal-docs', false, 10485760,
   ARRAY['application/pdf', 'image/jpeg', 'image/png']),
  ('invoices', 'invoices', false, 10485760,
   ARRAY['application/pdf']),
  ('videos', 'videos', false, 524288000, -- 500MB
   ARRAY['video/mp4', 'video/quicktime', 'video/webm'])
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Políticas de storage
-- =============================================================================

-- progress-photos: alumno sube/ve las propias; coach con assignment activo y paquete pro/elite
CREATE POLICY "progress_photos_student_insert" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'progress-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "progress_photos_student_select" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'progress-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "progress_photos_coach_select" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'progress-photos'
    AND student_has_pro_or_elite_package(
      ((storage.foldername(name))[1])::uuid,
      auth.uid()
    )
  );

-- fiscal-docs: solo el coach sube su propia constancia; owner lee todas
CREATE POLICY "fiscal_docs_coach_insert" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'fiscal-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "fiscal_docs_owner_select" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'fiscal-docs'
    AND auth_role() = 'owner'
  );

-- invoices: coach ve sus propias; owner ve todas
CREATE POLICY "invoices_coach_select" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'invoices'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "invoices_owner_select" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'invoices'
    AND auth_role() = 'owner'
  );

-- videos: coach sube; autenticados ven (ejercicios de la librería)
CREATE POLICY "videos_coach_insert" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'videos'
    AND auth_role() = 'coach'
  );

CREATE POLICY "videos_authenticated_select" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'videos'
    AND auth.uid() IS NOT NULL
  );
