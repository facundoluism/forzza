-- =============================================================================
-- FORZZA — Migración: extender exercise_library con columnas completas
-- Agrega: name_en, primary_group, primary_muscles, secondary_muscles,
--         movement_pattern, difficulty, tags, source, icon_id, slug
-- Mantiene columnas existentes: name, description, muscle_groups, equipment,
--         video_url, created_at
-- RLS ya definida en 20260610000003_rls_policies.sql:
--   "exercise_library_select_authenticated" → SELECT para auth.uid() IS NOT NULL
--   "exercise_library_owner"               → ALL para owner
-- No se agregan ni modifican políticas RLS aquí (ya son correctas).
-- =============================================================================

ALTER TABLE exercise_library
  ADD COLUMN IF NOT EXISTS name_en           TEXT,
  ADD COLUMN IF NOT EXISTS primary_group     TEXT,
  ADD COLUMN IF NOT EXISTS primary_muscles   TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS secondary_muscles TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS movement_pattern  TEXT,
  ADD COLUMN IF NOT EXISTS difficulty        TEXT,
  ADD COLUMN IF NOT EXISTS tags              TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS source            TEXT,
  ADD COLUMN IF NOT EXISTS icon_id           TEXT,
  ADD COLUMN IF NOT EXISTS slug              TEXT;

-- Índice único en slug (necesario para ON CONFLICT en el seed)
-- Ejercicios sin slug (los 30 placeholders de seed viejo) quedan con NULL,
-- y NULL no viola UNIQUE (Postgres: NULL != NULL).
CREATE UNIQUE INDEX IF NOT EXISTS exercise_library_slug_unique
  ON exercise_library (slug)
  WHERE slug IS NOT NULL;

-- Comentario de tabla actualizado
COMMENT ON TABLE exercise_library IS
  'Biblioteca de ejercicios compartida coach↔alumno. 234 ejercicios reales importados desde gym_exercise_database.xlsx. icon_id: chest | back | legs | shoulders | arms | core.';

COMMENT ON COLUMN exercise_library.name             IS 'Nombre en español (display principal)';
COMMENT ON COLUMN exercise_library.name_en           IS 'Nombre en inglés';
COMMENT ON COLUMN exercise_library.primary_group     IS 'Grupo muscular principal (Chest, Back, Legs, Shoulders, Arms, Core)';
COMMENT ON COLUMN exercise_library.primary_muscles   IS 'Músculos primarios específicos';
COMMENT ON COLUMN exercise_library.secondary_muscles IS 'Músculos secundarios / sinergistas';
COMMENT ON COLUMN exercise_library.muscle_groups     IS 'Derivado: [primary_group lowercase] ∪ primary_muscles — mantiene compatibilidad con coach builder';
COMMENT ON COLUMN exercise_library.movement_pattern  IS 'Patrón de movimiento (ej: Push – Horizontal, Pull – Vertical)';
COMMENT ON COLUMN exercise_library.difficulty        IS 'Dificultad: Beginner | Intermediate | Advanced';
COMMENT ON COLUMN exercise_library.tags              IS 'Etiquetas CSV parseadas para búsqueda/filtro';
COMMENT ON COLUMN exercise_library.source            IS 'Fuente del dato original';
COMMENT ON COLUMN exercise_library.icon_id           IS 'Clave de ícono UI: chest | back | legs | shoulders | arms | core';
COMMENT ON COLUMN exercise_library.slug              IS 'Slug estable basado en nombre EN, único (con índice parcial que excluye NULL)';
