-- =============================================================================
-- FORZZA — Políticas RLS (Row Level Security)
-- DEFAULT DENY: sin política explícita, no hay acceso.
-- =============================================================================

-- Habilitar RLS en TODAS las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE promoters ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE promoter_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE processed_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Helper: rol del usuario actual
CREATE OR REPLACE FUNCTION auth_role() RETURNS user_role AS $$
  SELECT role FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: si el coach tiene assignment activo con el alumno
CREATE OR REPLACE FUNCTION coach_has_active_assignment(p_coach_id UUID, p_student_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM coach_assignments
    WHERE coach_id = p_coach_id
      AND student_id = p_student_id
      AND status = 'active'
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: si el alumno tiene assignment con coach con paquete pro o elite
CREATE OR REPLACE FUNCTION student_has_pro_or_elite_package(p_student_id UUID, p_coach_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM coach_assignments ca
    JOIN coach_packages cp ON cp.id = ca.package_id
    WHERE ca.student_id = p_student_id
      AND ca.coach_id = p_coach_id
      AND ca.status = 'active'
      AND cp.tier IN ('pro', 'elite')
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =============================================================================
-- users
-- =============================================================================
CREATE POLICY "users_select_own" ON users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "users_select_owner" ON users FOR SELECT
  USING (auth_role() = 'owner');

CREATE POLICY "users_update_own" ON users FOR UPDATE
  USING (id = auth.uid());

-- =============================================================================
-- student_profiles
-- =============================================================================
CREATE POLICY "student_profiles_select_own" ON student_profiles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "student_profiles_select_coach" ON student_profiles FOR SELECT
  USING (
    auth_role() = 'coach'
    AND coach_has_active_assignment(auth.uid(), user_id)
  );

CREATE POLICY "student_profiles_select_owner" ON student_profiles FOR SELECT
  USING (auth_role() = 'owner');

CREATE POLICY "student_profiles_insert_own" ON student_profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "student_profiles_update_own" ON student_profiles FOR UPDATE
  USING (user_id = auth.uid());

-- =============================================================================
-- coach_profiles
-- =============================================================================
-- Alumnos y anónimos ven coaches aprobados (para marketplace)
CREATE POLICY "coach_profiles_select_approved" ON coach_profiles FOR SELECT
  USING (status = 'approved');

-- El propio coach ve su perfil completo
CREATE POLICY "coach_profiles_select_own" ON coach_profiles FOR SELECT
  USING (user_id = auth.uid());

-- Owner ve todos
CREATE POLICY "coach_profiles_select_owner" ON coach_profiles FOR SELECT
  USING (auth_role() = 'owner');

CREATE POLICY "coach_profiles_insert_own" ON coach_profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "coach_profiles_update_own" ON coach_profiles FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "coach_profiles_update_owner" ON coach_profiles FOR UPDATE
  USING (auth_role() = 'owner');

-- =============================================================================
-- coach_packages
-- =============================================================================
-- Todos ven paquetes de coaches aprobados
CREATE POLICY "coach_packages_select_approved_coach" ON coach_packages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM coach_profiles cp
      WHERE cp.id = coach_packages.coach_id AND cp.status = 'approved'
    )
  );

CREATE POLICY "coach_packages_select_own_coach" ON coach_packages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM coach_profiles cp
      WHERE cp.id = coach_packages.coach_id AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "coach_packages_insert_own" ON coach_packages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM coach_profiles cp
      WHERE cp.id = coach_packages.coach_id AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "coach_packages_update_own" ON coach_packages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM coach_profiles cp
      WHERE cp.id = coach_packages.coach_id AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "coach_packages_owner" ON coach_packages FOR ALL
  USING (auth_role() = 'owner');

-- =============================================================================
-- subscriptions
-- =============================================================================
CREATE POLICY "subscriptions_select_own" ON subscriptions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "subscriptions_owner" ON subscriptions FOR ALL
  USING (auth_role() = 'owner');

-- =============================================================================
-- payments
-- =============================================================================
CREATE POLICY "payments_select_own_student" ON payments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "payments_select_own_coach" ON payments FOR SELECT
  USING (
    auth_role() = 'coach'
    AND coach_id = (SELECT id FROM coach_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "payments_owner" ON payments FOR ALL
  USING (auth_role() = 'owner');

-- =============================================================================
-- coach_assignments
-- =============================================================================
CREATE POLICY "assignments_select_student" ON coach_assignments FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "assignments_select_coach" ON coach_assignments FOR SELECT
  USING (
    auth_role() = 'coach'
    AND coach_id = (SELECT id FROM coach_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "assignments_owner" ON coach_assignments FOR ALL
  USING (auth_role() = 'owner');

-- =============================================================================
-- settlements
-- =============================================================================
CREATE POLICY "settlements_select_own_coach" ON settlements FOR SELECT
  USING (
    auth_role() = 'coach'
    AND coach_id = (SELECT id FROM coach_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "settlements_owner" ON settlements FOR ALL
  USING (auth_role() = 'owner');

-- =============================================================================
-- exercise_library (pública para usuarios autenticados)
-- =============================================================================
CREATE POLICY "exercise_library_select_authenticated" ON exercise_library FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "exercise_library_owner" ON exercise_library FOR ALL
  USING (auth_role() = 'owner');

-- =============================================================================
-- routines
-- =============================================================================
CREATE POLICY "routines_select_own" ON routines FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "routines_select_coach" ON routines FOR SELECT
  USING (
    auth_role() = 'coach'
    AND coach_id = (SELECT id FROM coach_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "routines_insert_own" ON routines FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "routines_insert_coach" ON routines FOR INSERT
  WITH CHECK (
    auth_role() = 'coach'
    AND coach_id = (SELECT id FROM coach_profiles WHERE user_id = auth.uid())
    AND coach_has_active_assignment(auth.uid(), student_id)
  );

CREATE POLICY "routines_update_own" ON routines FOR UPDATE
  USING (student_id = auth.uid());

CREATE POLICY "routines_update_coach" ON routines FOR UPDATE
  USING (
    auth_role() = 'coach'
    AND coach_id = (SELECT id FROM coach_profiles WHERE user_id = auth.uid())
    AND coach_has_active_assignment(auth.uid(), student_id)
  );

-- =============================================================================
-- workout_sessions
-- =============================================================================
CREATE POLICY "workout_sessions_own" ON workout_sessions FOR ALL
  USING (student_id = auth.uid());

CREATE POLICY "workout_sessions_coach" ON workout_sessions FOR SELECT
  USING (
    auth_role() = 'coach'
    AND coach_has_active_assignment(auth.uid(), student_id)
  );

-- =============================================================================
-- body_metrics
-- =============================================================================
CREATE POLICY "body_metrics_own" ON body_metrics FOR ALL
  USING (student_id = auth.uid());

CREATE POLICY "body_metrics_coach" ON body_metrics FOR SELECT
  USING (
    auth_role() = 'coach'
    AND coach_has_active_assignment(auth.uid(), student_id)
  );

-- =============================================================================
-- progress_photos (fotos corporales — MUY sensibles)
-- Solo paquetes pro/elite pueden ver el coach
-- =============================================================================
CREATE POLICY "progress_photos_own" ON progress_photos FOR ALL
  USING (student_id = auth.uid());

CREATE POLICY "progress_photos_coach_pro_elite" ON progress_photos FOR SELECT
  USING (
    auth_role() = 'coach'
    AND student_has_pro_or_elite_package(student_id, auth.uid())
  );

CREATE POLICY "progress_photos_owner" ON progress_photos FOR ALL
  USING (auth_role() = 'owner');

-- =============================================================================
-- checkin_templates
-- =============================================================================
CREATE POLICY "checkin_templates_coach_own" ON checkin_templates FOR ALL
  USING (
    coach_id = (SELECT id FROM coach_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "checkin_templates_student_assigned" ON checkin_templates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM coach_assignments ca
      WHERE ca.coach_id = checkin_templates.coach_id
        AND ca.student_id = auth.uid()
        AND ca.status = 'active'
    )
  );

-- =============================================================================
-- checkin_responses
-- =============================================================================
CREATE POLICY "checkin_responses_student_own" ON checkin_responses FOR ALL
  USING (student_id = auth.uid());

CREATE POLICY "checkin_responses_coach" ON checkin_responses FOR SELECT
  USING (
    auth_role() = 'coach'
    AND coach_has_active_assignment(auth.uid(), student_id)
  );

-- =============================================================================
-- messages (chat — solo por assignment activo)
-- =============================================================================
CREATE POLICY "messages_select_participants" ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM coach_assignments ca
      WHERE ca.id = messages.assignment_id
        AND (ca.student_id = auth.uid() OR
             ca.coach_id = (SELECT id FROM coach_profiles WHERE user_id = auth.uid()))
        AND ca.status = 'active'
    )
  );

CREATE POLICY "messages_insert_participants" ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM coach_assignments ca
      WHERE ca.id = messages.assignment_id
        AND (ca.student_id = auth.uid() OR
             ca.coach_id = (SELECT id FROM coach_profiles WHERE user_id = auth.uid()))
        AND ca.status = 'active'
    )
  );

-- =============================================================================
-- notifications
-- =============================================================================
CREATE POLICY "notifications_own" ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- =============================================================================
-- notification_preferences
-- =============================================================================
CREATE POLICY "notification_preferences_own" ON notification_preferences FOR ALL
  USING (user_id = auth.uid());

-- =============================================================================
-- country_config (solo lectura para autenticados; escritura solo owner via service_role)
-- =============================================================================
CREATE POLICY "country_config_select_authenticated" ON country_config FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- =============================================================================
-- promoters (NO UI en V1, acceso solo owner)
-- =============================================================================
CREATE POLICY "promoters_owner" ON promoters FOR ALL
  USING (auth_role() = 'owner');

CREATE POLICY "referrals_owner" ON referrals FOR ALL
  USING (auth_role() = 'owner');

CREATE POLICY "promoter_payouts_owner" ON promoter_payouts FOR ALL
  USING (auth_role() = 'owner');

-- =============================================================================
-- tickets
-- =============================================================================
CREATE POLICY "tickets_own" ON tickets FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "tickets_owner" ON tickets FOR ALL
  USING (auth_role() = 'owner');

-- =============================================================================
-- leads (solo insert anónimo + lectura owner)
-- =============================================================================
CREATE POLICY "leads_insert_anon" ON leads FOR INSERT
  WITH CHECK (true); -- cualquiera puede suscribirse al newsletter

CREATE POLICY "leads_owner" ON leads FOR ALL
  USING (auth_role() = 'owner');

-- =============================================================================
-- processed_events (solo service_role via Edge Functions)
-- =============================================================================
-- No policies = sin acceso desde el cliente (Edge Functions usan service_role)

-- =============================================================================
-- audit_log (solo lectura owner; escritura solo service_role)
-- =============================================================================
CREATE POLICY "audit_log_owner" ON audit_log FOR SELECT
  USING (auth_role() = 'owner');
