-- =============================================================================
-- FORZZA — Seed inicial de country_config
-- Migración: 20260615000002_seed_country_config.sql
-- Idempotente: ON CONFLICT DO UPDATE para que sea re-aplicable.
-- =============================================================================

INSERT INTO country_config (
  country,
  commission_rate,
  currency,
  currency_symbol,
  min_coach_price,
  active,
  pro_monthly_price_cents,
  currency_code
) VALUES
  ('AR', 0.2000, 'ARS', '$', 500000, true,  999900,  'ARS'),
  ('CL', 0.2000, 'CLP', '$', 2000000, false, 9990000, 'CLP')
ON CONFLICT (country) DO UPDATE SET
  commission_rate        = EXCLUDED.commission_rate,
  currency               = EXCLUDED.currency,
  currency_symbol        = EXCLUDED.currency_symbol,
  min_coach_price        = EXCLUDED.min_coach_price,
  active                 = EXCLUDED.active,
  pro_monthly_price_cents = EXCLUDED.pro_monthly_price_cents,
  currency_code          = EXCLUDED.currency_code;
