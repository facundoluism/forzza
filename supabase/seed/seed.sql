-- =============================================================================
-- FORZZA — Seed datos iniciales
-- =============================================================================

-- country_config: Argentina (activo) y Chile (preparado, no activo)
-- min_coach_price = 0: el dueño eliminó el piso de precio (decisión 2026-06-22).
-- El coach puede cobrar cualquier precio > 0; Forzza igual cobra 20% de comisión.
INSERT INTO country_config (country, commission_rate, currency, currency_symbol, min_coach_price, active)
VALUES
  ('AR', 0.2000, 'ARS', '$', 0, true),
  ('CL', 0.2000, 'CLP', '$', 0, false)  -- CL no activo en V1
ON CONFLICT (country) DO NOTHING;

-- exercise_library: REEMPLAZADO por supabase/seed/exercises.sql
-- Los 30 ejercicios placeholder han sido eliminados y reemplazados por
-- los 234 ejercicios reales importados desde gym_exercise_database.xlsx.
-- El archivo exercises.sql es idempotente: ON CONFLICT (slug) DO UPDATE.
-- Ver migracion 20260615000004_extend_exercise_library.sql para el esquema completo.
--
-- En local: pnpm db:reset carga exercises.sql automaticamente (Supabase CLI
-- carga todos los *.sql en supabase/seed/ en orden alfabetico).
-- En remoto: psql $DATABASE_URL -f supabase/seed/exercises.sql
