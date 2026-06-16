-- =============================================================================
-- FORZZA - RLS: resolver coach_profiles.id desde auth.uid()
-- =============================================================================
-- Contexto:
--   coach_assignments.coach_id referencia coach_profiles(id), no auth.users(id).
--   Varias policies usaban auth.uid() al llamar helpers que esperan coach_id,
--   bloqueando acceso legitimo del coach a alumnos, rutinas, sesiones y fotos.
-- =============================================================================

-- Seguridad:
--   - SECURITY DEFINER + search_path fijo: protege contra ataques de sustitución
--     de search_path en funciones SECURITY DEFINER (mismo patrón que handle_new_user).
--   - REVOKE ALL FROM PUBLIC / GRANT EXECUTE TO authenticated: principle of
--     least privilege; solo usuarios autenticados pueden resolver su coach_id.
CREATE OR REPLACE FUNCTION auth_coach_profile_id()
RETURNS UUID
LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public, pg_temp
AS $$
  SELECT id FROM coach_profiles WHERE user_id = auth.uid()
$$;

REVOKE ALL ON FUNCTION auth_coach_profile_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION auth_coach_profile_id() TO authenticated;

-- student_profiles: coach con assignment activo puede ver perfil del alumno.
DROP POLICY IF EXISTS "student_profiles_select_coach" ON student_profiles;
CREATE POLICY "student_profiles_select_coach" ON student_profiles FOR SELECT
  USING (
    auth_role() = 'coach'
    AND coach_has_active_assignment(auth_coach_profile_id(), user_id)
  );

-- routines: coach asignado puede crear/editar rutinas del alumno.
DROP POLICY IF EXISTS "routines_insert_coach" ON routines;
CREATE POLICY "routines_insert_coach" ON routines FOR INSERT
  WITH CHECK (
    auth_role() = 'coach'
    AND coach_id = auth_coach_profile_id()
    AND coach_has_active_assignment(auth_coach_profile_id(), student_id)
  );

DROP POLICY IF EXISTS "routines_update_coach" ON routines;
CREATE POLICY "routines_update_coach" ON routines FOR UPDATE
  USING (
    auth_role() = 'coach'
    AND coach_id = auth_coach_profile_id()
    AND coach_has_active_assignment(auth_coach_profile_id(), student_id)
  );

-- workout_sessions/body_metrics: coach asignado puede leer progreso del alumno.
DROP POLICY IF EXISTS "workout_sessions_coach" ON workout_sessions;
CREATE POLICY "workout_sessions_coach" ON workout_sessions FOR SELECT
  USING (
    auth_role() = 'coach'
    AND coach_has_active_assignment(auth_coach_profile_id(), student_id)
  );

DROP POLICY IF EXISTS "body_metrics_coach" ON body_metrics;
CREATE POLICY "body_metrics_coach" ON body_metrics FOR SELECT
  USING (
    auth_role() = 'coach'
    AND coach_has_active_assignment(auth_coach_profile_id(), student_id)
  );

-- progress_photos: solo coach con paquete pro/elite activo.
DROP POLICY IF EXISTS "progress_photos_coach_pro_elite" ON progress_photos;
CREATE POLICY "progress_photos_coach_pro_elite" ON progress_photos FOR SELECT
  USING (
    auth_role() = 'coach'
    AND student_has_pro_or_elite_package(student_id, auth_coach_profile_id())
  );

-- checkin_responses: coach asignado puede leer respuestas de sus alumnos.
DROP POLICY IF EXISTS "checkin_responses_coach" ON checkin_responses;
CREATE POLICY "checkin_responses_coach" ON checkin_responses FOR SELECT
  USING (
    auth_role() = 'coach'
    AND coach_has_active_assignment(auth_coach_profile_id(), student_id)
  );

-- Storage progress photos: el primer segmento del path es el auth user id del alumno.
-- El guard auth_role() = 'coach' se agrega como primer término (igual que la policy
-- de la tabla progress_photos) para que el plan de ejecución pueda cortocircuitar
-- sin evaluar student_has_pro_or_elite_package() para no-coaches.
DROP POLICY IF EXISTS "progress_photos_coach_select" ON storage.objects;
CREATE POLICY "progress_photos_coach_select" ON storage.objects FOR SELECT
  USING (
    auth_role() = 'coach'
    AND bucket_id = 'progress-photos'
    AND student_has_pro_or_elite_package(
      ((storage.foldername(name))[1])::uuid,
      auth_coach_profile_id()
    )
  );
