-- =============================================================================
-- FORZZA — Migración: columnas de ficha de ejercicio enriquecida
-- Agrega contenido pedagógico a exercise_library (pasos, errores, tips,
-- músculos terciarios, gate de validación humana, ícono SVG).
-- Todas las columnas son NULLABLE / tienen DEFAULT seguro → no rompe seed ni RLS.
-- RLS existente cubre estas columnas automáticamente:
--   "exercise_library_select_authenticated" → SELECT auth.uid() IS NOT NULL
--   "exercise_library_owner"               → ALL para owner
-- No se agregan políticas de escritura: el contenido se carga vía seed o
-- service-role (fuera de RLS de usuario).
-- =============================================================================

ALTER TABLE exercise_library
  -- Pasos de ejecución (array de strings). DEFAULT '[]' permite array vacío
  -- sin necesitar NULL en código cliente.
  ADD COLUMN IF NOT EXISTS execution_steps_es JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS execution_steps_en JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Errores comunes (array de strings).
  ADD COLUMN IF NOT EXISTS common_errors_es   JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS common_errors_en   JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Consejo profesional (texto libre). NULL = sin consejo todavía.
  ADD COLUMN IF NOT EXISTS pro_tip_es         TEXT,
  ADD COLUMN IF NOT EXISTS pro_tip_en         TEXT,

  -- Músculos terciarios / estabilizadores. DEFAULT '{}' coherente con
  -- primary_muscles y secondary_muscles.
  ADD COLUMN IF NOT EXISTS tertiary_muscles   TEXT[] NOT NULL DEFAULT '{}',

  -- Gate de validación humana de seguridad del contenido.
  -- NOT NULL DEFAULT false → sin validar por defecto.
  ADD COLUMN IF NOT EXISTS content_verified   BOOLEAN NOT NULL DEFAULT false,

  -- Clave del ícono SVG por patrón de movimiento.
  -- NULL → el cliente usa icon_id como fallback.
  ADD COLUMN IF NOT EXISTS svg_icon           TEXT;

-- ---------------------------------------------------------------------------
-- Comentarios de columna (fuente de verdad para herramientas y generadores)
-- ---------------------------------------------------------------------------

COMMENT ON COLUMN exercise_library.execution_steps_es IS
  'Array JSON de strings con los pasos de ejecución del ejercicio en español rioplatense. Vacío ([]) si aún no fue redactado.';

COMMENT ON COLUMN exercise_library.execution_steps_en IS
  'JSON array of strings with exercise execution steps in English. Empty ([]) if not yet authored.';

COMMENT ON COLUMN exercise_library.common_errors_es IS
  'Array JSON de strings con los errores de técnica más frecuentes, en español. Vacío ([]) si aún no fue redactado.';

COMMENT ON COLUMN exercise_library.common_errors_en IS
  'JSON array of strings with the most common technique mistakes, in English. Empty ([]) if not yet authored.';

COMMENT ON COLUMN exercise_library.pro_tip_es IS
  'Consejo profesional breve para mejorar la ejecución del ejercicio, en español rioplatense. NULL = sin consejo todavía.';

COMMENT ON COLUMN exercise_library.pro_tip_en IS
  'Short professional tip to improve exercise execution, in English. NULL = not yet authored.';

COMMENT ON COLUMN exercise_library.tertiary_muscles IS
  'Músculos terciarios / estabilizadores que intervienen en el ejercicio. Coherente con primary_muscles y secondary_muscles. Vacío ({}) si no aplica.';

COMMENT ON COLUMN exercise_library.content_verified IS
  'Gate de validación humana: true = un revisor aprobó la seguridad y corrección del contenido pedagógico de esta ficha. DEFAULT false.';

COMMENT ON COLUMN exercise_library.svg_icon IS
  'Clave del set de íconos SVG agrupados por patrón de movimiento (ej: push-horizontal, pull-vertical, hinge). NULL → el cliente usa icon_id como fallback.';
