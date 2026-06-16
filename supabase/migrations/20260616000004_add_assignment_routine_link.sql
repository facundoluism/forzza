-- =============================================================================
-- FORZZA - Vinculo de rutina asignada al assignment
--
-- El coach crea rutinas para alumnos con un assignment activo. La ficha del
-- alumno en backoffice necesita saber cual es la rutina asignada actualmente
-- sin inferirla desde la ultima rutina creada.
-- =============================================================================

ALTER TABLE coach_assignments
  ADD COLUMN IF NOT EXISTS routine_id UUID REFERENCES routines(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS coach_assignments_routine_id_idx
  ON coach_assignments(routine_id)
  WHERE routine_id IS NOT NULL;

DROP POLICY IF EXISTS "assignments_update_coach_routine" ON coach_assignments;

CREATE POLICY "assignments_update_coach_routine" ON coach_assignments FOR UPDATE
  USING (
    auth_role() = 'coach'
    AND coach_id = auth_coach_profile_id()
    AND status = 'active'
  )
  WITH CHECK (
    auth_role() = 'coach'
    AND coach_id = auth_coach_profile_id()
    AND status = 'active'
    AND (
      coach_assignments.routine_id IS NULL
      OR EXISTS (
        SELECT 1
        FROM routines r
        WHERE r.id = coach_assignments.routine_id
          AND r.coach_id = auth_coach_profile_id()
          AND r.student_id = coach_assignments.student_id
      )
    )
  );

-- -----------------------------------------------------------------------------
-- TRIGGER: restrict_coach_assignment_update_columns
--
-- Problema: RLS no puede restringir qué columnas se actualizan, solo si la fila
-- es accesible. La policy assignments_update_coach_routine autoriza al coach a
-- hacer UPDATE sobre sus assignments activos, pero sin restricción de columnas
-- podría mutar coach_id, status, package_id, etc.
--
-- Solución: trigger BEFORE UPDATE que rechaza cualquier cambio en columnas
-- protegidas cuando el rol actual NO es service_role.
--
-- Detección de service_role: se compara current_setting('request.jwt.claims', true)
-- con el rol de sesión. En Supabase, las llamadas de service_role no pasan por
-- PostgREST/auth, por lo que current_user es 'postgres' o el rol del conexión
-- directa. La forma canónica es verificar que current_setting('role') no sea
-- 'authenticated' ni 'anon'; alternativamente, si el rol de sesión DB es
-- 'service_role' (lo que Supabase establece para la service key). Usamos
-- current_user = 'postgres' OR current_setting('role', true) = 'service_role'
-- para cubrir ambos casos (migración + service key runtime).
--
-- Seguridad:
--   - SECURITY DEFINER + search_path fijo: mismo patrón que handle_new_user y
--     auth_coach_profile_id.
--   - REVOKE ALL FROM PUBLIC / GRANT EXECUTE TO authenticated: el trigger invoca
--     la función internamente; authenticated necesita EXECUTE para que el trigger
--     dispare en contexto RLS.
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION restrict_coach_assignment_update_columns()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Permitir cambios irrestrictos desde service_role o conexión directa (postgres/supabase_admin).
  -- current_setting('role', true) devuelve el rol de sesión PostgREST ('authenticated', 'anon',
  -- 'service_role'). current_user cubre conexiones directas que omiten PostgREST.
  IF current_setting('role', true) = 'service_role'
     OR current_user IN ('postgres', 'supabase_admin')
  THEN
    RETURN NEW;
  END IF;

  -- Para cualquier otro rol (authenticated via PostgREST), solo routine_id puede cambiar.
  IF (OLD.coach_id    IS DISTINCT FROM NEW.coach_id)    OR
     (OLD.student_id  IS DISTINCT FROM NEW.student_id)  OR
     (OLD.status      IS DISTINCT FROM NEW.status)      OR
     (OLD.package_id  IS DISTINCT FROM NEW.package_id)  OR
     (OLD.payment_id  IS DISTINCT FROM NEW.payment_id)  OR
     (OLD.started_at  IS DISTINCT FROM NEW.started_at)  OR
     (OLD.ended_at    IS DISTINCT FROM NEW.ended_at)    OR
     (OLD.created_at  IS DISTINCT FROM NEW.created_at)
  THEN
    RAISE EXCEPTION
      'coach_assignments: solo se permite modificar routine_id (columna protegida modificada por rol %)',
      current_setting('role', true)
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION restrict_coach_assignment_update_columns() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION restrict_coach_assignment_update_columns() TO authenticated;

DROP TRIGGER IF EXISTS trg_restrict_coach_assignment_update ON coach_assignments;

CREATE TRIGGER trg_restrict_coach_assignment_update
  BEFORE UPDATE ON coach_assignments
  FOR EACH ROW
  EXECUTE FUNCTION restrict_coach_assignment_update_columns();
