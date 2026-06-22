-- =============================================================================
-- FORZZA — Consentimiento explícito de datos sensibles de salud (P1.4)
-- Migración: 20260622170000_sensitive_data_consent.sql
--
-- CONTEXTO:
--   Compliance P1.4: Ley 25.326 art. 2/7 (AR) + restricciones Apple/Google sobre
--   datos de salud. Los datos sensibles (fotos de progreso, métricas corporales)
--   requieren consentimiento expreso e informado antes de capturarlos.
--   Esta migración provee la capa de datos:
--     - Columna en student_profiles para registrar cuándo se otorgó el consentimiento.
--     - RPC SECURITY DEFINER que es el ÚNICO canal de escritura (evita que el
--       cliente falsee el timestamp vía UPDATE directo).
--     - Trigger BEFORE UPDATE que protege esa columna de modificación directa
--       por roles no privilegiados.
--     - Entrada en audit_log por cada consentimiento (append-only, historial completo).
--
-- REGLAS:
--   - La escritura de sensitive_data_consent_at va EXCLUSIVAMENTE por RPC.
--   - El cliente autenticado no puede setear esta columna por UPDATE directo.
--   - Si se llama record_sensitive_consent() de nuevo, se actualiza el timestamp
--     Y se agrega otra entrada de audit (historial de re-consentimientos).
--   - Si auth.uid() es NULL, el RPC lanza excepción (no hay usuario autenticado).
--
-- FOLLOW-UP (NO incluido en esta migración):
--   El enforcement duro mediante políticas RLS que bloqueen el INSERT en
--   progress_photos / body_metrics para alumnos sin consentimiento queda como
--   tarea separada. Razón: agregar esa restricción ahora rompería usuarios
--   existentes y los tests actuales que insertan esas tablas sin consentimiento.
--   Cuando se implemente, deberá migrar datos existentes (setear consent_at
--   retroactivamente para usuarios con fotos/métricas previas, o mostrar UI
--   de consentimiento al próximo login).
--
-- NUNCA editar una migración ya aplicada. Para cambios: nueva migración.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Columna en student_profiles
-- ---------------------------------------------------------------------------
ALTER TABLE public.student_profiles
  ADD COLUMN IF NOT EXISTS sensitive_data_consent_at TIMESTAMPTZ;

COMMENT ON COLUMN public.student_profiles.sensitive_data_consent_at IS
  'Timestamp del consentimiento explícito del alumno para tratar datos sensibles '
  'de salud (fotos de progreso, métricas corporales). '
  'NULL = nunca consintió. Escrito SOLO por el RPC record_sensitive_consent(). '
  'Ley 25.326 art. 2/7 (AR) + políticas Apple/Google sobre datos de salud.';

-- ---------------------------------------------------------------------------
-- 2. Trigger BEFORE UPDATE: protege sensitive_data_consent_at de modificación
--    directa por el rol authenticated (y anon).
--
--    Patrón idéntico a protect_terms_columns:
--      - service_role y conexiones directas (postgres/supabase_admin) pasan.
--      - authenticated vía PostgREST: RAISE si intenta modificar esa columna.
--
--    SECURITY INVOKER (default): el trigger corre bajo el rol que hace el UPDATE.
--    Cuando un cliente autenticado hace UPDATE directo, current_user = 'authenticated'
--    → el trigger lo detecta y bloquea.
--    Cuando record_sensitive_consent() SECURITY DEFINER hace el UPDATE,
--    current_user = 'postgres' → el trigger lo deja pasar.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_sensitive_consent_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Permitir cambios desde service_role o conexiones privilegiadas directas.
  -- En SECURITY INVOKER, current_user refleja quien ejecuta el UPDATE:
  --   - postgres / supabase_admin: migraciones, RPC SECURITY DEFINER → pasa
  --   - authenticated / anon: cliente PostgREST directo → llega al IF abajo
  IF current_setting('role', true) = 'service_role'
     OR current_user IN ('postgres', 'supabase_admin')
  THEN
    RETURN NEW;
  END IF;

  -- Para current_user = authenticated / anon: proteger columna de consentimiento.
  -- La escritura válida va exclusivamente por el RPC record_sensitive_consent().
  IF (OLD.sensitive_data_consent_at IS DISTINCT FROM NEW.sensitive_data_consent_at) THEN
    RAISE EXCEPTION
      'student_profiles: sensitive_data_consent_at solo puede modificarse vía RPC record_sensitive_consent() (current_user: %, role: %)',
      current_user,
      current_setting('role', true)
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.protect_sensitive_consent_column() IS
  'Trigger BEFORE UPDATE en student_profiles (SECURITY INVOKER): impide que roles '
  'authenticated/anon vía PostgREST modifiquen sensitive_data_consent_at '
  'directamente. SECURITY INVOKER es intencional: el trigger debe ver el '
  'current_user real del invocador, no el del owner del schema. '
  'El RPC record_sensitive_consent() (SECURITY DEFINER) corre con '
  'current_user=postgres → el trigger lo deja pasar. '
  'La escritura válida va exclusivamente por record_sensitive_consent().';

REVOKE ALL ON FUNCTION public.protect_sensitive_consent_column() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.protect_sensitive_consent_column() TO authenticated;

DROP TRIGGER IF EXISTS trg_protect_sensitive_consent_column ON public.student_profiles;

CREATE TRIGGER trg_protect_sensitive_consent_column
  BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_sensitive_consent_column();

-- ---------------------------------------------------------------------------
-- 3. RPC: public.record_sensitive_consent()
--
--    SECURITY DEFINER: ejecuta con privilegios del owner del schema (postgres),
--    por lo que el trigger protect_sensitive_consent_column() lo deja pasar.
--    search_path fijado a 'public' para prevenir ataques de search-path.
--
--    Idempotente-friendly: llamadas repetidas actualizan el timestamp
--    y agregan otra entrada de audit (historial completo de re-consentimientos).
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.record_sensitive_consent()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID;
BEGIN
  v_uid := auth.uid();

  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'record_sensitive_consent: usuario no autenticado (auth.uid() es NULL)'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  -- Actualizar columna de consentimiento en student_profiles
  -- (el trigger protect_sensitive_consent_column permite el cambio porque
  --  current_user = 'postgres' en SECURITY DEFINER).
  UPDATE public.student_profiles
  SET sensitive_data_consent_at = now()
  WHERE user_id = v_uid;

  -- Registrar en audit_log (append-only).
  -- Re-consentimientos también se registran: historial completo intencional.
  INSERT INTO public.audit_log (
    actor_id,
    action,
    entity_type,
    entity_id
  ) VALUES (
    v_uid,
    'sensitive_data.consented',
    'student_profile',
    v_uid
  );
END;
$$;

COMMENT ON FUNCTION public.record_sensitive_consent() IS
  'Registra el consentimiento explícito del alumno para tratar datos sensibles '
  'de salud (fotos de progreso, métricas corporales). '
  'Setea student_profiles.sensitive_data_consent_at = now() para el student_profile '
  'del usuario autenticado (auth.uid()), e inserta en audit_log con '
  'action=''sensitive_data.consented'', entity_type=''student_profile''. '
  'SECURITY DEFINER: única vía para escribir la columna de consentimiento. '
  'Idempotente-friendly: re-consentimientos agregan nueva entrada de audit. '
  'Lanza insufficient_privilege si auth.uid() es NULL. '
  'Ley 25.326 art. 2/7 (AR) + políticas Apple/Google sobre datos de salud.';

-- Solo usuarios autenticados pueden llamar este RPC.
REVOKE ALL ON FUNCTION public.record_sensitive_consent() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_sensitive_consent() TO authenticated;
