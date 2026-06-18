-- =============================================================================
-- FORZZA — Tabla: exercise_video_requests
-- Pedidos de video demostrativo por parte de alumnos.
-- Cuando un ejercicio no tiene video publicado, el alumno puede solicitar uno.
-- El admin usa la vista exercise_video_request_counts (via service-role) para
-- priorizar qué videos grabar según demanda.
--
-- NUNCA editar una migración ya aplicada. Para cambios: nueva migración.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Tabla principal
-- -----------------------------------------------------------------------------
CREATE TABLE public.exercise_video_requests (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id uuid        NOT NULL REFERENCES public.exercise_library(id) ON DELETE CASCADE,
  user_id     uuid        NOT NULL REFERENCES public.users(id)            ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  -- Dedup: un alumno solo puede pedir video una vez por ejercicio.
  -- Un segundo tap idempotente → la app chequea 409 / 0 rows inserted.
  CONSTRAINT exercise_video_requests_uq UNIQUE (exercise_id, user_id)
);

COMMENT ON TABLE  public.exercise_video_requests
  IS 'Pedidos de video demostrativo hechos por alumnos. Un pedido por alumno/ejercicio (UNIQUE). El admin lee los agregados via service-role a través de la vista exercise_video_request_counts.';

COMMENT ON COLUMN public.exercise_video_requests.exercise_id
  IS 'Ejercicio para el que se solicita el video.';

COMMENT ON COLUMN public.exercise_video_requests.user_id
  IS 'Alumno que realiza el pedido. Debe coincidir con auth.uid() (enforced por RLS WITH CHECK).';

COMMENT ON COLUMN public.exercise_video_requests.created_at
  IS 'Momento en que se registró el pedido.';

-- Índice para las agregaciones de ranking (GROUP BY exercise_id en la vista).
CREATE INDEX exercise_video_requests_exercise_idx
  ON public.exercise_video_requests (exercise_id);

-- -----------------------------------------------------------------------------
-- 2. RLS — DEFAULT DENY
-- Sin política explícita no hay acceso.
-- -----------------------------------------------------------------------------
ALTER TABLE public.exercise_video_requests ENABLE ROW LEVEL SECURITY;

-- INSERT: solo pedís en tu nombre (user_id = auth.uid()).
-- El alumno no puede suplantar a otro.
CREATE POLICY "exercise_video_requests_insert_own"
  ON public.exercise_video_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- SELECT: el alumno ve solo sus propios pedidos (para el estado "ya solicitado ✓" en UI).
CREATE POLICY "exercise_video_requests_select_own"
  ON public.exercise_video_requests
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- UPDATE / DELETE: no habilitados para authenticated.
-- Los pedidos son append-only desde el cliente.
-- La lectura admin (ranking, gestión) se realiza por service-role desde Edge Functions
-- o el backoffice Next.js con la clave service_role, que bypasea RLS por completo.
-- No se necesita policy de rol 'owner' en esta tabla porque las otras tablas de
-- gestión admin (audit_log, settlements) siguen el mismo patrón: service-role
-- bypasea RLS, y owner solo tiene policy cuando lee datos de alumnos directamente
-- desde el cliente autenticado (ej: coach_profiles, student_profiles).

-- -----------------------------------------------------------------------------
-- 3. Vista de ranking para el admin
--    Consumida exclusivamente por service-role (Edge Function o backoffice).
--    SECURITY INVOKER (default en PG15+): cuando se llama con service-role
--    el invoker bypasea RLS de todas las tablas base, por lo que la vista
--    devuelve todos los pedidos sin restricción.
--    NO se expone a authenticated: el alumno no necesita ver el ranking global.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.exercise_video_request_counts AS
SELECT
  r.exercise_id,
  e.name                                          AS exercise_name,
  COUNT(r.id)                                     AS request_count,
  EXISTS (
    SELECT 1
    FROM public.exercise_videos v
    WHERE v.exercise_id = r.exercise_id
      AND v.status = 'published'
  )                                               AS has_published_video
FROM public.exercise_video_requests r
JOIN public.exercise_library         e ON e.id = r.exercise_id
GROUP BY r.exercise_id, e.name
ORDER BY request_count DESC;

COMMENT ON VIEW public.exercise_video_request_counts
  IS 'Ranking de ejercicios más pedidos sin video. Solo admin via service-role. Columnas: exercise_id, exercise_name, request_count, has_published_video.';
