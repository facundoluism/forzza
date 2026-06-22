-- =============================================================================
-- FORZZA — Bucket público para avatares de coach
-- Migración: 20260622120003_coach_avatars_bucket.sql
--
-- Los avatares de coach se muestran en el marketplace: lectura pública sin auth.
-- Escritura/actualización/borrado: solo el usuario autenticado dueño del archivo,
-- scoping por carpeta = auth.uid() (path: {uid}/avatar.jpg o similar).
-- =============================================================================

-- Crear bucket público
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'coach-avatars',
  'coach-avatars',
  true,
  5242880, -- 5MB: suficiente para foto de perfil
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Lectura pública (cualquiera, sin autenticación)
CREATE POLICY "coach_avatars_public_select" ON storage.objects FOR SELECT
  USING (bucket_id = 'coach-avatars');

-- INSERT: solo el dueño del archivo, scoping por carpeta = auth.uid()
CREATE POLICY "coach_avatars_owner_insert" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'coach-avatars'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- UPDATE: solo el dueño del archivo
CREATE POLICY "coach_avatars_owner_update" ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'coach-avatars'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- DELETE: solo el dueño del archivo
CREATE POLICY "coach_avatars_owner_delete" ON storage.objects FOR DELETE
  USING (
    bucket_id = 'coach-avatars'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
