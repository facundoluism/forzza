-- =============================================================================
-- FORZZA — coach_ratings: reseñas de alumnos a coaches
-- Migración: 20260617200001_coach_ratings.sql
-- NUNCA editar una migración aplicada. Para cambios: nueva migración.
-- =============================================================================

-- =============================================================================
-- TABLA: coach_ratings
-- Un alumno puede calificar a un coach con quien tuvo (o tiene) un assignment.
-- UNIQUE(coach_id, student_id): una reseña por par alumno-coach.
-- =============================================================================

CREATE TABLE coach_ratings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id    UUID NOT NULL REFERENCES coach_profiles(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT coach_ratings_unique_pair UNIQUE (coach_id, student_id)
);

CREATE INDEX idx_coach_ratings_coach_id ON coach_ratings (coach_id);
CREATE INDEX idx_coach_ratings_student_id ON coach_ratings (student_id);

-- =============================================================================
-- Columnas de agregado en coach_profiles
-- =============================================================================

ALTER TABLE coach_profiles
  ADD COLUMN IF NOT EXISTS avg_rating    NUMERIC(3,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating_count  INTEGER      NOT NULL DEFAULT 0;

-- =============================================================================
-- Trigger: recalcula avg_rating + rating_count tras INSERT/UPDATE/DELETE
-- SECURITY DEFINER no necesario aquí: el trigger corre como el dueño de la tabla
-- via superuser. Usamos SECURITY INVOKER (default).
-- =============================================================================

CREATE OR REPLACE FUNCTION trg_recalculate_coach_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
  v_coach_id UUID;
BEGIN
  -- Determinar qué coach_id referenciar según la operación
  IF TG_OP = 'DELETE' THEN
    v_coach_id := OLD.coach_id;
  ELSE
    v_coach_id := NEW.coach_id;
  END IF;

  UPDATE coach_profiles
  SET
    avg_rating   = COALESCE((
      SELECT ROUND(AVG(rating)::NUMERIC, 2)
      FROM coach_ratings
      WHERE coach_id = v_coach_id
    ), 0),
    rating_count = (
      SELECT COUNT(*)
      FROM coach_ratings
      WHERE coach_id = v_coach_id
    ),
    updated_at   = now()
  WHERE id = v_coach_id;

  RETURN NULL; -- AFTER trigger; valor de retorno ignorado
END;
$$;

CREATE TRIGGER trg_coach_ratings_recalculate
  AFTER INSERT OR UPDATE OR DELETE ON coach_ratings
  FOR EACH ROW EXECUTE FUNCTION trg_recalculate_coach_rating();

-- =============================================================================
-- RLS
-- DEFAULT DENY: sin política explícita no hay acceso.
-- =============================================================================

ALTER TABLE coach_ratings ENABLE ROW LEVEL SECURITY;

-- Cualquier usuario autenticado puede leer reseñas (marketplace público).
CREATE POLICY "coach_ratings_select_authenticated" ON coach_ratings
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Un alumno solo puede insertar su propia reseña si tuvo (o tiene) un assignment
-- con ese coach (cualquier status). Previene reseñas falsas.
CREATE POLICY "coach_ratings_insert_own_student" ON coach_ratings
  FOR INSERT
  WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM coach_assignments ca
      WHERE ca.coach_id  = coach_ratings.coach_id
        AND ca.student_id = auth.uid()
    )
  );

-- El alumno puede editar su propia reseña.
CREATE POLICY "coach_ratings_update_own_student" ON coach_ratings
  FOR UPDATE
  USING (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM coach_assignments ca
      WHERE ca.coach_id  = coach_ratings.coach_id
        AND ca.student_id = auth.uid()
    )
  );

-- DELETE solo owner (moderación). Ni el alumno ni el coach pueden borrar.
CREATE POLICY "coach_ratings_delete_owner" ON coach_ratings
  FOR DELETE
  USING (auth_role() = 'owner');
