-- =============================================================================
-- FORZZA — Límite de 3 rutinas propias para usuarios Free (Regla de negocio #2)
-- Migración: 20260622120002_free_routine_limit.sql
--
-- Un alumno con plan 'free' no puede crear más de 3 rutinas PROPIAS.
-- "Propia" = creada por el propio alumno: coach_id IS NULL.
-- Las rutinas asignadas por un coach (coach_id IS NOT NULL) no cuentan contra
-- este límite, ya que el coach las crea en nombre del alumno.
--
-- El plan se determina desde subscriptions: si el usuario no tiene ninguna
-- suscripción activa (status='active') con plan != 'free', se considera free.
-- Esto es consistente con el modelo de datos: la tabla users no tiene columna plan;
-- el gating client-side lee de subscriptions.
-- =============================================================================

CREATE OR REPLACE FUNCTION check_free_routine_limit()
RETURNS TRIGGER AS $$
DECLARE
  v_plan TEXT;
  v_own_routine_count INTEGER;
BEGIN
  -- Solo aplica a rutinas propias del alumno (no asignadas por coach)
  IF NEW.coach_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- Determinar el plan activo del alumno
  -- Si no tiene suscripción activa con plan pro/elite, es free
  SELECT COALESCE(
    (
      SELECT s.plan
      FROM subscriptions s
      WHERE s.user_id = NEW.student_id
        AND s.status = 'active'
        AND s.plan IN ('pro', 'elite')
      ORDER BY s.created_at DESC
      LIMIT 1
    ),
    'free'
  ) INTO v_plan;

  IF v_plan = 'free' THEN
    -- Contar rutinas propias existentes (coach_id IS NULL)
    SELECT COUNT(*) INTO v_own_routine_count
    FROM routines r
    WHERE r.student_id = NEW.student_id
      AND r.coach_id IS NULL;

    IF v_own_routine_count >= 3 THEN
      RAISE EXCEPTION 'Los usuarios con plan free no pueden crear más de 3 rutinas propias (límite: 3, actuales: %)', v_own_routine_count
        USING ERRCODE = 'check_violation';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER routines_free_limit_check
  BEFORE INSERT ON routines
  FOR EACH ROW EXECUTE FUNCTION check_free_routine_limit();
