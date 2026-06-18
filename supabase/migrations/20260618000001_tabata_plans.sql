-- =============================================================================
-- FORZZA — Tabata Plans
-- Migración: 20260618000001_tabata_plans.sql
-- Persistencia de planes Tabata del alumno. Cada plan pertenece a UN alumno;
-- solo él puede verlo/editarlo (ownership completo).
-- Gating PRO del modo avanzado: responsabilidad del cliente, NO de esta migración.
-- NUNCA editar una migración aplicada. Para cambios: nueva migración.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.tabata_plans (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name        text        NOT NULL,
  mode        text        NOT NULL CHECK (mode IN ('simple', 'advanced')),
  -- simple:   { workSecs, restSecs, rounds, prepSecs }
  -- advanced: [{ id, kind: 'work'|'rest', label?, durationMs }]
  config      jsonb       NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Índice de acceso frecuente por alumno
CREATE INDEX IF NOT EXISTS idx_tabata_plans_student_id
  ON public.tabata_plans (student_id);

-- Reutilizar set_updated_at() definida en 20260617210001_routine_schedule.sql
CREATE TRIGGER tabata_plans_updated_at
  BEFORE UPDATE ON public.tabata_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS: default-deny — sin política explícita no hay acceso
ALTER TABLE public.tabata_plans ENABLE ROW LEVEL SECURITY;

-- SELECT: solo el propio alumno
CREATE POLICY "tabata_plans_select_own" ON public.tabata_plans
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

-- INSERT: solo el propio alumno
CREATE POLICY "tabata_plans_insert_own" ON public.tabata_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

-- UPDATE: solo el propio alumno
CREATE POLICY "tabata_plans_update_own" ON public.tabata_plans
  FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- DELETE: solo el propio alumno
CREATE POLICY "tabata_plans_delete_own" ON public.tabata_plans
  FOR DELETE
  TO authenticated
  USING (student_id = auth.uid());
