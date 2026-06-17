-- =============================================================================
-- FORZZA — Account deletion queue + RLS
-- Migración: 20260617165329_account_deletion.sql
-- NUNCA editar una migración aplicada. Para cambios: nueva migración.
-- =============================================================================

-- =============================================================================
-- TABLA: deletion_queue
-- Cola de anonimización de cuentas (soft-delete → anonimización 30 días después)
-- =============================================================================

CREATE TABLE deletion_queue (
  user_id        UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  requested_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  anonymize_at   TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  processed_at   TIMESTAMPTZ
);

-- Índice para el cron: filas pendientes con anonymize_at vencido
CREATE INDEX idx_deletion_queue_pending
  ON deletion_queue (anonymize_at)
  WHERE processed_at IS NULL;

-- =============================================================================
-- RLS: deletion_queue — DENY a todos los usuarios (solo service_role accede)
-- =============================================================================

ALTER TABLE deletion_queue ENABLE ROW LEVEL SECURITY;

-- Sin política explícita = DENY. Declaramos las negaciones explícitamente
-- para que quede documentado y pase el lint de "all tables have RLS".
-- service_role bypasea RLS por diseño de Supabase; no requiere política propia.

CREATE POLICY "deletion_queue_no_anon_access" ON deletion_queue
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

CREATE POLICY "deletion_queue_no_authenticated_access" ON deletion_queue
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

-- =============================================================================
-- audit_log ya es append-only (REVOKE UPDATE/DELETE en migración inicial).
-- No tocar.
-- =============================================================================
