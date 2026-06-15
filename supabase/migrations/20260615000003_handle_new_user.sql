-- =============================================================================
-- FORZZA — Trigger: crear fila en public.users al registrarse en auth.users
-- Migración: 20260615000003_handle_new_user.sql
-- NUNCA editar una migración aplicada. Para cambios: nueva migración.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- FUNCIÓN: public.handle_new_user
-- Crea automáticamente la fila en public.users cuando se inserta un usuario
-- en auth.users (por cualquier método: email/password, OAuth, magic link, etc.)
--
-- Seguridad:
--   - SECURITY DEFINER: necesario para escribir en public.users desde el
--     contexto de auth, que de otro modo no tendría permisos.
--   - search_path fijo: protege contra ataques de sustitución de search_path
--     en funciones SECURITY DEFINER (recomendación oficial Supabase/Postgres).
--   - ON CONFLICT (id) DO NOTHING: idempotente; si la fila ya existe (ej. backfill
--     previo o llamada duplicada) no falla ni sobreescribe.
--
-- Lectura de metadatos (raw_user_meta_data):
--   - 'role': si está presente y es un valor válido de user_role, se usa.
--     De lo contrario cae al default 'student'.
--   - 'country': si está presente y es 'AR' o 'CL', se usa.
--     De lo contrario cae al default 'AR'.
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_role    public.user_role    := 'student';
  v_country public.country_code := 'AR';
  v_raw     TEXT;
BEGIN
  -- Intentar leer 'role' desde raw_user_meta_data
  v_raw := NEW.raw_user_meta_data->>'role';
  IF v_raw IS NOT NULL THEN
    BEGIN
      v_role := v_raw::public.user_role;
    EXCEPTION WHEN invalid_text_representation THEN
      -- Valor inválido para el enum → ignorar y usar default
      v_role := 'student';
    END;
  END IF;

  -- Intentar leer 'country' desde raw_user_meta_data
  v_raw := NEW.raw_user_meta_data->>'country';
  IF v_raw IS NOT NULL THEN
    BEGIN
      v_country := v_raw::public.country_code;
    EXCEPTION WHEN invalid_text_representation THEN
      -- Valor inválido para el enum → ignorar y usar default
      v_country := 'AR';
    END;
  END IF;

  INSERT INTO public.users (id, role, country, created_at, updated_at)
  VALUES (
    NEW.id,
    v_role,
    v_country,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Asegurar que solo el owner del esquema pueda invocarla directamente
-- (el trigger la llama internamente bajo SECURITY DEFINER)
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- -----------------------------------------------------------------------------
-- TRIGGER: on_auth_user_created
-- Se dispara DESPUÉS de cada INSERT en auth.users, una vez por fila.
-- DROP IF EXISTS permite que la migración sea re-ejecutable (idempotencia).
-- -----------------------------------------------------------------------------

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
