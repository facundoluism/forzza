-- routine_schedule: permite al coach asignar una rutina a un alumno por fecha.
-- Modelo mínimo: cada fila vincula un assignment activo + una rutina + una fecha.
-- El alumno puede leer sus propias filas; el coach gestiona las de sus alumnos.

CREATE TABLE IF NOT EXISTS public.routine_schedule (
  id             uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id  uuid         NOT NULL REFERENCES public.coach_assignments(id) ON DELETE CASCADE,
  student_id     uuid         NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  coach_id       uuid         NOT NULL REFERENCES public.coach_profiles(id) ON DELETE CASCADE,
  routine_id     uuid         NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
  scheduled_date date         NOT NULL,
  notes          text,
  created_at     timestamptz  NOT NULL DEFAULT now(),
  updated_at     timestamptz  NOT NULL DEFAULT now(),
  UNIQUE (assignment_id, scheduled_date)
);

-- Updated-at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER routine_schedule_updated_at
  BEFORE UPDATE ON public.routine_schedule
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Índices de acceso frecuente
CREATE INDEX IF NOT EXISTS idx_routine_schedule_coach_date
  ON public.routine_schedule(coach_id, scheduled_date);

CREATE INDEX IF NOT EXISTS idx_routine_schedule_student_date
  ON public.routine_schedule(student_id, scheduled_date);

-- RLS
ALTER TABLE public.routine_schedule ENABLE ROW LEVEL SECURITY;

-- Coach: gestiona las filas cuyo coach_id coincide con su coach_profiles.id
CREATE POLICY "coach_manage_own" ON public.routine_schedule
  AS PERMISSIVE FOR ALL
  TO authenticated
  USING (
    coach_id IN (
      SELECT id FROM public.coach_profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    coach_id IN (
      SELECT id FROM public.coach_profiles WHERE user_id = auth.uid()
    )
  );

-- Alumno: solo lectura de sus propias filas
CREATE POLICY "student_read_own" ON public.routine_schedule
  AS PERMISSIVE FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());
