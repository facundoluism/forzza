-- =============================================================================
-- FORZZA — coach_feedback: feedback de coach a métricas/fotos del alumno
-- Migración: 20260617200002_coach_feedback.sql
-- NUNCA editar una migración aplicada. Para cambios: nueva migración.
-- =============================================================================

-- =============================================================================
-- TABLA: coach_feedback
-- El coach deja comentarios sobre una métrica o foto de progreso de su alumno.
-- Solo disponible para alumnos con paquete PRO o elite activo.
-- =============================================================================

CREATE TABLE coach_feedback (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id      UUID NOT NULL REFERENCES coach_profiles(id) ON DELETE CASCADE,
  student_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type   TEXT NOT NULL CHECK (target_type IN ('metric', 'photo')),
  target_id     UUID NOT NULL,
  feedback_text TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_coach_feedback_coach_id   ON coach_feedback (coach_id);
CREATE INDEX idx_coach_feedback_student_id ON coach_feedback (student_id);
CREATE INDEX idx_coach_feedback_target     ON coach_feedback (target_type, target_id);

-- =============================================================================
-- RLS
-- =============================================================================

ALTER TABLE coach_feedback ENABLE ROW LEVEL SECURITY;

-- El coach ve el feedback que él escribió.
CREATE POLICY "coach_feedback_select_coach" ON coach_feedback
  FOR SELECT
  USING (
    auth_role() = 'coach'
    AND coach_id = auth_coach_profile_id()
  );

-- El alumno ve el feedback que le escribieron a él.
CREATE POLICY "coach_feedback_select_student" ON coach_feedback
  FOR SELECT
  USING (student_id = auth.uid());

-- El coach inserta feedback solo si:
--   1. Es coach.
--   2. El alumno tiene un assignment activo con él.
--   3. El alumno tiene paquete PRO o elite activo con ese coach.
CREATE POLICY "coach_feedback_insert_coach" ON coach_feedback
  FOR INSERT
  WITH CHECK (
    auth_role() = 'coach'
    AND coach_id = auth_coach_profile_id()
    AND coach_has_active_assignment(auth_coach_profile_id(), student_id)
    AND student_has_pro_or_elite_package(student_id, auth_coach_profile_id())
  );

-- Nadie actualiza ni borra feedback (inmutable; control de calidad).
-- El owner puede intervenir via service_role si es necesario.

-- =============================================================================
-- Trigger: notificación in-app N20 al alumno tras nuevo feedback
-- Sin PII sensible: el payload lleva coach_id + target_type + target_id, no texto.
-- =============================================================================

CREATE OR REPLACE FUNCTION trg_notify_student_new_feedback()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_coach_name TEXT;
BEGIN
  -- Nombre del coach para el título de la notificación (no es PII sensible)
  SELECT display_name INTO v_coach_name
  FROM coach_profiles
  WHERE id = NEW.coach_id;

  INSERT INTO notifications (user_id, type, title, body, data)
  VALUES (
    NEW.student_id,
    'N20_coach_feedback',
    'Tu coach dejó un comentario',
    COALESCE(v_coach_name, 'Tu coach') || ' dejó feedback en tu ' ||
      CASE NEW.target_type
        WHEN 'metric' THEN 'métrica'
        WHEN 'photo'  THEN 'foto de progreso'
        ELSE 'registro'
      END || '.',
    jsonb_build_object(
      'coach_id',    NEW.coach_id,
      'target_type', NEW.target_type,
      'target_id',   NEW.target_id,
      'feedback_id', NEW.id
      -- Sin feedback_text: no exponer texto completo en payload de notificación
    )
  );

  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_coach_feedback_notify
  AFTER INSERT ON coach_feedback
  FOR EACH ROW EXECUTE FUNCTION trg_notify_student_new_feedback();
