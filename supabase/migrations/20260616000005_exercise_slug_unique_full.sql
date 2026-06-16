-- =============================================================================
-- FORZZA - exercise_library.slug: índice único COMPLETO (no parcial)
-- =============================================================================
-- Contexto:
--   La migración 20260615000004 creó un índice único PARCIAL
--   (`... ON exercise_library (slug) WHERE slug IS NOT NULL`).
--   PostgreSQL NO acepta un índice único parcial como árbitro de
--   `ON CONFLICT (slug)` salvo que la sentencia repita el mismo predicado,
--   por lo que el seed `exercises.sql` (38× `ON CONFLICT (slug) DO UPDATE`)
--   fallaba con SQLSTATE 42P10 ("no unique or exclusion constraint matching
--   the ON CONFLICT specification"), abortando `supabase db reset`/`start`.
--
--   Un índice único COMPLETO sobre slug preserva la intención original:
--   los NULL siguen permitiéndose en múltiples filas (en un índice único de
--   Postgres los NULL son distintos entre sí), y los slugs no-NULL quedan
--   únicos. Además sí funciona como árbitro de ON CONFLICT (slug).
-- =============================================================================

DROP INDEX IF EXISTS exercise_library_slug_unique;

CREATE UNIQUE INDEX IF NOT EXISTS exercise_library_slug_unique
  ON exercise_library (slug);

COMMENT ON INDEX exercise_library_slug_unique IS
  'Slug único (índice completo; múltiples NULL permitidos por semántica de NULL en índices únicos). Árbitro de ON CONFLICT (slug) en el seed.';
