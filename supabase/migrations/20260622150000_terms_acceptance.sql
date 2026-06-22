-- =============================================================================
-- FORZZA — Aceptación explícita de Términos y Política de Privacidad (P0.6)
-- Migración: 20260622150000_terms_acceptance.sql
--
-- CONTEXTO:
--   Compliance P0.6: se requiere checkbox bloqueante de aceptación legal en
--   signup/onboarding. Esta migración provee la capa de datos:
--     - Dos columnas en users para registrar cuándo y qué versión se aceptó.
--     - RPC SECURITY DEFINER que es el ÚNICO canal de escritura (evita que el
--       cliente falsee el timestamp vía UPDATE directo).
--     - Trigger BEFORE UPDATE que protege esas columnas de modificación directa
--       por roles no privilegiados.
--     - Entrada en audit_log por cada aceptación (append-only, historial completo).
--
-- REGLAS:
--   - La escritura de terms_accepted_at / terms_version va EXCLUSIVAMENTE por RPC.
--   - El cliente autenticado no puede setear estas columnas por UPDATE directo.
--   - Si se llama accept_terms() de nuevo (re-aceptación), se actualiza el
--     timestamp/versión Y se agrega otra entrada de audit (historial intencional).
--   - Si auth.uid() es NULL, el RPC lanza excepción (no hay usuario autenticado).
--
-- NUNCA editar una migración ya aplicada. Para cambios: nueva migración.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Columnas en users
-- ---------------------------------------------------------------------------
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS terms_version     TEXT;

COMMENT ON COLUMN public.users.terms_accepted_at IS
  'Timestamp de la última aceptación explícita de Términos y Política de Privacidad. '
  'NULL = nunca aceptó. Escrito SOLO por el RPC accept_terms().';

COMMENT ON COLUMN public.users.terms_version IS
  'Versión del documento legal aceptado (ej: ''2026-06-22''). '
  'Escrito SOLO por el RPC accept_terms(). Debe coincidir con LEGAL_DOCS_VERSION.';

-- ---------------------------------------------------------------------------
-- 2. Trigger BEFORE UPDATE: protege terms_accepted_at y terms_version
--    de modificación directa por el rol authenticated (y anon).
--
--    Patrón idéntico a restrict_coach_assignment_update_columns:
--      - service_role y conexiones directas (postgres/supabase_admin) pasan.
--      - authenticated vía PostgREST: RAISE si intenta modificar esas columnas.
--
--    Nota: el RPC accept_terms() corre como SECURITY DEFINER bajo current_user
--    'postgres' cuando es invocado desde authenticated, pero en Supabase el
--    search_path y el SECURITY DEFINER hacen que current_user sea el owner
--    del schema (postgres/supabase_admin), así que el trigger los deja pasar.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_terms_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
-- SECURITY INVOKER (default): el trigger corre bajo el rol que hace el UPDATE.
-- Cuando un cliente autenticado hace UPDATE directo (PostgREST), current_user
-- = 'authenticated' → el trigger lo detecta y bloquea.
-- Cuando accept_terms() SECURITY DEFINER hace el UPDATE, current_user = 'postgres'
-- → el trigger lo deja pasar.
-- NO usar SECURITY DEFINER aquí: ese flag haría que el trigger corra siempre
-- como 'postgres', ocultando la identidad real del invocador.
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

  -- Para current_user = authenticated / anon: proteger columnas legales.
  -- La escritura válida va exclusivamente por el RPC accept_terms().
  IF (OLD.terms_accepted_at IS DISTINCT FROM NEW.terms_accepted_at) OR
     (OLD.terms_version     IS DISTINCT FROM NEW.terms_version)
  THEN
    RAISE EXCEPTION
      'users: terms_accepted_at y terms_version solo pueden modificarse vía RPC accept_terms() (current_user: %, role: %)',
      current_user,
      current_setting('role', true)
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.protect_terms_columns() IS
  'Trigger BEFORE UPDATE en users (SECURITY INVOKER): impide que roles '
  'authenticated/anon vía PostgREST modifiquen terms_accepted_at y '
  'terms_version directamente. SECURITY INVOKER es intencional: el trigger '
  'debe ver el current_user real del invocador, no el del owner del schema. '
  'El RPC accept_terms() (SECURITY DEFINER) corre con current_user=postgres → '
  'el trigger lo deja pasar. Clientes directos tienen current_user=authenticated → '
  'el trigger bloquea. La escritura válida va exclusivamente por accept_terms().';

REVOKE ALL ON FUNCTION public.protect_terms_columns() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.protect_terms_columns() TO authenticated;

DROP TRIGGER IF EXISTS trg_protect_terms_columns ON public.users;

CREATE TRIGGER trg_protect_terms_columns
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_terms_columns();

-- ---------------------------------------------------------------------------
-- 3. RPC: public.accept_terms(p_version text)
--
--    SECURITY DEFINER: ejecuta con privilegios del owner del schema (postgres),
--    por lo que el trigger protect_terms_columns() lo deja pasar.
--    search_path fijado a 'public' para prevenir ataques de search-path.
--
--    Idempotente-friendly: llamadas repetidas actualizan el timestamp/versión
--    y agregan otra entrada de audit (historial completo de re-aceptaciones).
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.accept_terms(p_version text)
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
    RAISE EXCEPTION 'accept_terms: usuario no autenticado (auth.uid() es NULL)'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  -- Actualizar columnas legales en users (el trigger protect_terms_columns
  -- permite el cambio porque current_user = 'postgres' en SECURITY DEFINER).
  UPDATE public.users
  SET
    terms_accepted_at = now(),
    terms_version     = p_version
  WHERE id = v_uid;

  -- Registrar en audit_log (append-only).
  -- Re-aceptaciones también se registran: historial completo intencional.
  INSERT INTO public.audit_log (
    actor_id,
    action,
    entity_type,
    entity_id,
    payload
  ) VALUES (
    v_uid,
    'terms.accepted',
    'user',
    v_uid,
    jsonb_build_object('version', p_version)
  );
END;
$$;

COMMENT ON FUNCTION public.accept_terms(text) IS
  'Registra la aceptación explícita de Términos y Política de Privacidad. '
  'Setea users.terms_accepted_at = now() y users.terms_version = p_version, '
  'e inserta en audit_log con action=''terms.accepted''. '
  'SECURITY DEFINER: única vía para escribir las columnas legales. '
  'Idempotente-friendly: re-aceptaciones agregan nueva entrada de audit. '
  'Lanza insufficient_privilege si auth.uid() es NULL.';

-- Solo usuarios autenticados pueden llamar este RPC.
REVOKE ALL ON FUNCTION public.accept_terms(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.accept_terms(text) TO authenticated;
