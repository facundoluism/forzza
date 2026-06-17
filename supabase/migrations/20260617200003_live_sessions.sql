-- =============================================================================
-- FORZZA — live_sessions: sesiones programadas con link externo (Zoom/Meet)
-- Migración: 20260617200003_live_sessions.sql
-- NUNCA editar una migración aplicada. Para cambios: nueva migración.
--
-- DESVÍO APROBADO: CLAUDE.md marca "sesiones en vivo" como NO-V1.
-- Owner aprobó versión liviana: sin video propio, solo link externo (Zoom/Meet).
-- Registrado en docs/open-questions.md (ver entrada 2026-06-17).
--
-- HUMAN_REQUIRED — N21 reminder:
--   El recordatorio N21 ("sesión en 30 min") requiere un cron job que corra
--   cada ~5 minutos y ejecute una Edge Function (ej. live-session-reminder).
--   La Edge Function debe:
--     1. SELECT id, student_id, coach_id, title, scheduled_at, room_url
--        FROM live_sessions
--        WHERE status = 'scheduled'
--          AND scheduled_at BETWEEN now() + INTERVAL '28 min'
--                               AND now() + INTERVAL '32 min';
--     2. INSERT INTO notifications para cada par (student_id, coach_user_id).
--     3. Marcar processed para evitar duplicados (p.ej. columna reminded_at).
--   Agendar en Supabase Dashboard > Edge Functions > Schedules
--   o via supabase functions deploy + pg_cron.
-- =============================================================================

CREATE TABLE live_sessions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id      UUID NOT NULL REFERENCES coach_profiles(id) ON DELETE CASCADE,
  student_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES coach_assignments(id) ON DELETE SET NULL,
  title         TEXT NOT NULL,
  scheduled_at  TIMESTAMPTZ NOT NULL,
  room_url      TEXT NOT NULL,  -- link externo Zoom/Meet; obligatorio
  status        TEXT NOT NULL DEFAULT 'scheduled'
                  CHECK (status IN ('scheduled', 'completed', 'canceled')),
  -- reminded_at: seteado por el cron de N21 para idempotencia
  reminded_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_live_sessions_coach_id    ON live_sessions (coach_id);
CREATE INDEX idx_live_sessions_student_id  ON live_sessions (student_id);
-- Índice parcial para el cron de N21: solo filas pendientes y próximas
CREATE INDEX idx_live_sessions_reminder    ON live_sessions (scheduled_at)
  WHERE status = 'scheduled' AND reminded_at IS NULL;

-- =============================================================================
-- RLS
-- =============================================================================

ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;

-- El coach gestiona sus propias sesiones (SELECT/INSERT/UPDATE/DELETE).
CREATE POLICY "live_sessions_coach_manage" ON live_sessions
  FOR ALL
  USING (
    auth_role() = 'coach'
    AND coach_id = auth_coach_profile_id()
  )
  WITH CHECK (
    auth_role() = 'coach'
    AND coach_id = auth_coach_profile_id()
  );

-- El alumno solo puede leer sus sesiones.
CREATE POLICY "live_sessions_student_select" ON live_sessions
  FOR SELECT
  USING (student_id = auth.uid());

-- Owner tiene acceso total.
CREATE POLICY "live_sessions_owner" ON live_sessions
  FOR ALL
  USING (auth_role() = 'owner');
