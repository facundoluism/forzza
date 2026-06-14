-- =============================================================================
-- FORZZA — Migración de columnas faltantes
-- Migración: 20260615000001_add_missing_columns.sql
-- NUNCA editar una migración aplicada. Para cambios: nueva migración.
-- =============================================================================

-- =============================================================================
-- country_config: agregar columnas de precio PRO y código de moneda
-- Requeridas por check-entitlements, mp-create-preapproval y coach-checkout
-- =============================================================================

ALTER TABLE country_config
  ADD COLUMN IF NOT EXISTS pro_monthly_price_cents INTEGER NOT NULL DEFAULT 999900,
  ADD COLUMN IF NOT EXISTS currency_code TEXT NOT NULL DEFAULT 'ARS';

UPDATE country_config SET
  pro_monthly_price_cents = 999900,
  currency_code = 'ARS'
WHERE country = 'AR';

UPDATE country_config SET
  pro_monthly_price_cents = 9990000,
  currency_code = 'CLP'
WHERE country = 'CL';

-- =============================================================================
-- subscriptions: agregar columna plan — crítico para gating PRO/elite
-- =============================================================================

ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free'
  CHECK (plan IN ('free', 'pro', 'elite'));

-- =============================================================================
-- coach_profiles: columnas usadas en onboarding web y formularios de alta
-- =============================================================================

ALTER TABLE coach_profiles
  ADD COLUMN IF NOT EXISTS cbu TEXT,
  ADD COLUMN IF NOT EXISTS alias_cbu TEXT,
  ADD COLUMN IF NOT EXISTS years_experience INTEGER;
