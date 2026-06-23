-- =============================================================================
-- FORZZA — Vinculación OAuth de Mercado Pago para coaches (Split Payments)
-- Migración: 20260623000001_coach_mp_accounts.sql
--
-- Decisión de arquitectura (docs/open-questions.md 2026-06-23):
--   Forzza adopta Split Payments de Mercado Pago Marketplace. Cada coach debe
--   vincular su cuenta de MP vía OAuth para que la parte del coach vaya DIRECTO
--   a su cuenta y la comisión (marketplace_fee) quede en Forzza automáticamente.
--
-- Seguridad:
--   - access_token y refresh_token son secretos de alta sensibilidad.
--   - RLS: el coach solo puede leer su propio STATUS de conexión (NOT los tokens).
--     Los tokens son accesibles SOLO por service-role (Edge Functions server-side).
--   - NUNCA exponer tokens al cliente.
--   - NUNCA loguear payloads con tokens.
-- =============================================================================

CREATE TABLE public.coach_mp_accounts (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Referencia al coach (PK de coach_profiles, NO auth.users)
  coach_id          UUID        NOT NULL UNIQUE REFERENCES public.coach_profiles(id) ON DELETE CASCADE,
  -- ID de la cuenta de Mercado Pago del coach (retornado en el OAuth callback)
  mp_user_id        TEXT        NOT NULL,
  -- Tokens OAuth — almacenados server-side, NUNCA expuestos al cliente
  access_token      TEXT        NOT NULL,
  refresh_token     TEXT        NOT NULL,
  -- Tiempo de expiración del access_token (para refresh proactivo)
  token_expires_at  TIMESTAMPTZ NOT NULL,
  -- Scopes autorizados por el coach
  scope             TEXT        NOT NULL DEFAULT '',
  -- Estado de la vinculación
  status            TEXT        NOT NULL DEFAULT 'connected'
                    CHECK (status IN ('connected', 'disconnected', 'error')),
  connected_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice para lookup por coach_id (el UNIQUE ya crea uno, pero explicitamos)
CREATE INDEX IF NOT EXISTS idx_coach_mp_accounts_coach_id
  ON public.coach_mp_accounts (coach_id);

-- Trigger para updated_at automático (reutiliza la función existente)
CREATE TRIGGER coach_mp_accounts_updated_at
  BEFORE UPDATE ON public.coach_mp_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- RLS — DEFAULT DENY
-- El coach solo lee su propio STATUS (conectado sí/no) — NUNCA los tokens.
-- Los tokens son accesibles SOLO a través del service-role (Edge Functions).
-- =============================================================================

ALTER TABLE public.coach_mp_accounts ENABLE ROW LEVEL SECURITY;

-- El coach puede ver su propia fila (RLS limita FILAS, no columnas).
CREATE POLICY "coach_mp_accounts_coach_select_own"
  ON public.coach_mp_accounts
  FOR SELECT
  USING (
    coach_id = (
      SELECT id FROM public.coach_profiles WHERE user_id = auth.uid()
    )
  );

-- El coach no puede INSERT/UPDATE/DELETE directamente (solo service-role puede).
-- El upsert lo hace la Edge Function con service-role key.

-- =============================================================================
-- SEGURIDAD A NIVEL DE COLUMNA (defensa real contra fuga de tokens)
-- La RLS filtra filas pero NO columnas: sin esto, un coach con su propia sesión
-- podría hacer `select=access_token,refresh_token` vía PostgREST y robar sus
-- tokens. Revocamos el SELECT amplio y concedemos SOLO las columnas seguras a
-- `authenticated`/`anon`. `service_role` (Edge Functions) conserva acceso total
-- y es el único que lee/escribe los tokens.
-- =============================================================================

REVOKE SELECT ON public.coach_mp_accounts FROM anon, authenticated;

GRANT SELECT (id, coach_id, mp_user_id, status, connected_at, updated_at)
  ON public.coach_mp_accounts TO authenticated;

-- `anon` no necesita ninguna columna (la página del coach requiere sesión).
-- No se conceden access_token, refresh_token, token_expires_at ni scope a roles
-- de cliente: cualquier intento de seleccionarlos → "permission denied for column".

-- =============================================================================
-- COMENTARIOS para documentar sensibilidad de columnas
-- =============================================================================

COMMENT ON TABLE public.coach_mp_accounts IS
  'Vinculación OAuth de Mercado Pago por coach. access_token y refresh_token son secretos de alta sensibilidad: solo service-role puede leer/escribir; el cliente web NUNCA los ve.';

COMMENT ON COLUMN public.coach_mp_accounts.access_token IS
  'Token OAuth de acceso — SECRETO. Solo accessible via service-role. NUNCA exponer al cliente ni loguear.';

COMMENT ON COLUMN public.coach_mp_accounts.refresh_token IS
  'Token OAuth de refresh — SECRETO. Solo accessible via service-role. NUNCA exponer al cliente ni loguear.';
