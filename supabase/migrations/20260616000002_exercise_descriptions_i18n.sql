-- =============================================================================
-- Migración: Internacionalización de descripciones en exercise_library
-- Agrega description_es (español) y description_en (inglés) como columnas
-- separadas. La columna description original NO se elimina (compatibilidad).
-- Backfill idempotente: mueve la descripción inglesa existente a description_en.
-- =============================================================================

-- Columna en español
ALTER TABLE exercise_library
  ADD COLUMN IF NOT EXISTS description_es TEXT;

-- Columna en inglés
ALTER TABLE exercise_library
  ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Comentarios de columna
COMMENT ON COLUMN exercise_library.description_es IS
  'Descripción del ejercicio en español rioplatense. Fuente: seed/exercise_descriptions_es.sql';

COMMENT ON COLUMN exercise_library.description_en IS
  'Exercise description in English. Backfilled from legacy "description" column (which contained English text for exercises 1-110).';

-- Backfill idempotente: los ejercicios 1-110 tienen description en inglés.
-- Solo copia donde description_en aún está vacío y description no lo está.
UPDATE exercise_library
  SET description_en = description
  WHERE description_en IS NULL
    AND description IS NOT NULL;
