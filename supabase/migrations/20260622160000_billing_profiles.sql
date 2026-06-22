-- Migration: billing_profiles
-- Tabla de datos fiscales de facturación (Modelo A: coach factura al alumno).
-- El alumno gestiona su propio perfil; el coach puede ver el de sus alumnos activos.

-- ─────────────────────────────────────────────
-- 1. TABLA
-- ─────────────────────────────────────────────
CREATE TABLE public.billing_profiles (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid        NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  legal_name     text        NOT NULL,
  tax_condition  text        NOT NULL CHECK (tax_condition IN ('consumidor_final','monotributo','responsable_inscripto','exento')),
  doc_type       text        NOT NULL CHECK (doc_type IN ('DNI','CUIT','CUIL')),
  doc_number     text        NOT NULL,
  address        text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 2. TRIGGER updated_at (mismo patrón que el resto del schema)
-- ─────────────────────────────────────────────
CREATE TRIGGER billing_profiles_updated_at
  BEFORE UPDATE ON public.billing_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────
-- 3. RLS — DEFAULT DENY
-- ─────────────────────────────────────────────
ALTER TABLE public.billing_profiles ENABLE ROW LEVEL SECURITY;

-- 3a. El dueño del perfil gestiona el suyo (SELECT / INSERT / UPDATE)
CREATE POLICY "billing_profiles_select_own"
  ON public.billing_profiles
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "billing_profiles_insert_own"
  ON public.billing_profiles
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "billing_profiles_update_own"
  ON public.billing_profiles
  FOR UPDATE
  USING (user_id = auth.uid());

-- 3b. El coach puede SELECT el perfil fiscal de sus alumnos con assignment activo.
--     coach_assignments.coach_id → coach_profiles.id → coach_profiles.user_id = auth.uid()
CREATE POLICY "billing_profiles_select_coach"
  ON public.billing_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.coach_assignments ca
      JOIN public.coach_profiles cp ON cp.id = ca.coach_id
      WHERE ca.student_id = billing_profiles.user_id
        AND ca.status     = 'active'::assignment_status
        AND cp.user_id    = auth.uid()
    )
  );

-- 3c. El owner (rol 'owner') puede SELECT todo.
CREATE POLICY "billing_profiles_select_owner"
  ON public.billing_profiles
  FOR SELECT
  USING (auth_role() = 'owner'::user_role);
