-- =============================================================================
-- FORZZA — Seed: backfill exercise_library.svg_icon
-- Asigna la key del ícono SVG a los 234 ejercicios usando la misma lógica
-- determinística de resolveExerciseIconKey (packages/ui/src/exerciseIconMap.ts).
-- Idempotente: UPDATE ... WHERE slug = '...' OR movement_pattern = '...'
-- Orden de prioridad: movimiento exacto → prefijo de movimiento → fallback grupo.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Push – Horizontal → bench-press
-- ---------------------------------------------------------------------------
UPDATE exercise_library
SET svg_icon = 'bench-press'
WHERE movement_pattern IN (
  'Push – Horizontal',
  'Push – Horizontal (Guided)',
  'Push – Lower Body (Horizontal)'
);

-- ---------------------------------------------------------------------------
-- 2. Push – Incline → incline-press
-- ---------------------------------------------------------------------------
UPDATE exercise_library
SET svg_icon = 'incline-press'
WHERE movement_pattern IN (
  'Push – Incline',
  'Push – Incline (Guided)',
  'Push – Lower Body (Incline)'
);

-- ---------------------------------------------------------------------------
-- 3. Push – Decline → decline-press
-- ---------------------------------------------------------------------------
UPDATE exercise_library
SET svg_icon = 'decline-press'
WHERE movement_pattern = 'Push – Decline';

-- ---------------------------------------------------------------------------
-- 4. Push – Vertical / Rotacional → overhead-press
-- ---------------------------------------------------------------------------
UPDATE exercise_library
SET svg_icon = 'overhead-press'
WHERE movement_pattern IN (
  'Push – Vertical',
  'Push – Vertical (Guided)',
  'Push – Rotational Vertical'
);

-- ---------------------------------------------------------------------------
-- 5. Push – Close Grip / Push – Standing → triceps-ext
-- ---------------------------------------------------------------------------
UPDATE exercise_library
SET svg_icon = 'triceps-ext'
WHERE movement_pattern IN (
  'Push – Close Grip',
  'Push – Standing'
);

-- ---------------------------------------------------------------------------
-- 6. Fly (todas las variantes de apertura) → chest-fly
-- ---------------------------------------------------------------------------
UPDATE exercise_library
SET svg_icon = 'chest-fly'
WHERE movement_pattern IN (
  'Fly – Horizontal',
  'Fly – Incline',
  'Fly – Decline',
  'Fly – Guided',
  'Fly – High Pulley',
  'Fly – Low Pulley',
  'Pull – Arc'
);

-- ---------------------------------------------------------------------------
-- 7. Fly – Reverse → lateral-raise (deltoides posterior)
-- ---------------------------------------------------------------------------
UPDATE exercise_library
SET svg_icon = 'lateral-raise'
WHERE movement_pattern IN (
  'Fly – Reverse',
  'Fly – Reverse (Guided)'
);

-- ---------------------------------------------------------------------------
-- 8. Pull – Vertical → pulldown
-- ---------------------------------------------------------------------------
UPDATE exercise_library
SET svg_icon = 'pulldown'
WHERE movement_pattern IN (
  'Pull – Vertical',
  'Pull – Vertical (Assisted)',
  'Pull – Vertical (Guided)',
  'Pull – Vertical (Narrow)',
  'Pull – Vertical (Reverse)',
  'Pull – Vertical (Wide)',
  'Pull – Straight Arm'
);

-- Pull-Ups específico → pullup
UPDATE exercise_library
SET svg_icon = 'pullup'
WHERE slug = 'pull-ups-chin-ups'
   OR name_en ILIKE '%pull-up%'
   OR name_en ILIKE '%chin-up%';

-- ---------------------------------------------------------------------------
-- 9. Pull – Horizontal → row
-- ---------------------------------------------------------------------------
UPDATE exercise_library
SET svg_icon = 'row'
WHERE movement_pattern IN (
  'Pull – Horizontal',
  'Pull – Horizontal (Guided)',
  'Pull – Inclined Horizontal',
  'Pull – Unilateral Horizontal',
  'Pull – Face'
);

-- ---------------------------------------------------------------------------
-- 10. Hinge → deadlift
-- ---------------------------------------------------------------------------
UPDATE exercise_library
SET svg_icon = 'deadlift'
WHERE movement_pattern IN (
  'Hinge',
  'Hinge – Full',
  'Extension – Spinal'
);

-- ---------------------------------------------------------------------------
-- 11. Squat → squat
-- ---------------------------------------------------------------------------
UPDATE exercise_library
SET svg_icon = 'squat'
WHERE movement_pattern IN (
  'Squat',
  'Squat – Guided',
  'Squat – Wide'
);

-- ---------------------------------------------------------------------------
-- 12. Lunge / Step-Up / Calf Raise / Split Squat → lunge
-- ---------------------------------------------------------------------------
UPDATE exercise_library
SET svg_icon = 'lunge'
WHERE movement_pattern IN (
  'Lunge – Guided',
  'Lunge – Reverse',
  'Lunge – Unilateral',
  'Lunge – Walking',
  'Step-Up – Unilateral',
  'Calf Raise',
  'Calf Raise – Guided',
  'Calf Raise – Seated',
  'Calf Raise – Standing',
  'Split Squat – Elevated Rear Foot'
);

-- ---------------------------------------------------------------------------
-- 13. Extension – Knee → leg-extension
-- ---------------------------------------------------------------------------
UPDATE exercise_library
SET svg_icon = 'leg-extension'
WHERE movement_pattern IN (
  'Extension – Knee (Sitting)'
);

-- ---------------------------------------------------------------------------
-- 14. Curl femoral / flexión de rodilla / hip ext-knee flex → leg-curl
-- ---------------------------------------------------------------------------
UPDATE exercise_library
SET svg_icon = 'leg-curl'
WHERE movement_pattern IN (
  'Hip Extension – Knee Flexion',
  'Flexion – Knee (Prone)',
  'Flexion – Knee (Sitting)',
  'Extension – Hip'
);

-- ---------------------------------------------------------------------------
-- 15. Hip Thrust / Abducción / Aducción → hip-thrust
-- ---------------------------------------------------------------------------
UPDATE exercise_library
SET svg_icon = 'hip-thrust'
WHERE movement_pattern IN (
  'Hip Thrust',
  'Hip Thrust – Guided',
  'Abduction',
  'Abduction – Hip',
  'Adduction',
  'Adduction – Hip'
);

-- ---------------------------------------------------------------------------
-- 16. Curl (bíceps) → biceps-curl
-- ---------------------------------------------------------------------------
UPDATE exercise_library
SET svg_icon = 'biceps-curl'
WHERE movement_pattern IN (
  'Curl',
  'Curl – Braced',
  'Curl – EZ Bar',
  'Curl – Guided',
  'Curl – Isolation',
  'Curl – Neutral Grip',
  'Curl – Overhead Stretch',
  'Curl – Rotational',
  'Curl – Stretch'
);

-- ---------------------------------------------------------------------------
-- 17. Extension de tríceps → triceps-ext
--     (incluye Push – Standing y Dips si no asignados aún)
-- ---------------------------------------------------------------------------
UPDATE exercise_library
SET svg_icon = 'triceps-ext'
WHERE movement_pattern IN (
  'Extension – Guided',
  'Extension – Kickback',
  'Extension – Overhead',
  'Extension – Pushdown',
  'Extension – Supine'
) AND (svg_icon IS NULL);

-- ---------------------------------------------------------------------------
-- 18. Elevaciones → lateral-raise
-- ---------------------------------------------------------------------------
UPDATE exercise_library
SET svg_icon = 'lateral-raise'
WHERE movement_pattern IN (
  'Raise – Lateral',
  'Raise – Lateral (Guided)',
  'Raise – Frontal',
  'Raise – Hanging',
  'Shrug'
);

-- ---------------------------------------------------------------------------
-- 19. Core / Rotación / Flexión lateral → core-plank
-- ---------------------------------------------------------------------------
UPDATE exercise_library
SET svg_icon = 'core-plank'
WHERE movement_pattern IN (
  'Pull – Anti-Rotation',
  'Anti-Rotation – Press',
  'Rotation',
  'Rotation – Diagonal',
  'Rotation – Torso (Guided)',
  'Diagonal Chop',
  'Lateral Flexion',
  'Flexion – Kneeling',
  'Flexion – Spinal (Guided)'
);

-- ---------------------------------------------------------------------------
-- 20. Cable genérico — ejercicios de polea sin patrón asignado
--     Aplica SOLO a los que no tienen svg_icon aún y tienen Cable en equipment
-- ---------------------------------------------------------------------------
UPDATE exercise_library
SET svg_icon = 'cable'
WHERE svg_icon IS NULL
  AND equipment && ARRAY['Cable']::text[];

-- ---------------------------------------------------------------------------
-- 21. Máquina genérica — ejercicios de máquina sin patrón asignado
-- ---------------------------------------------------------------------------
UPDATE exercise_library
SET svg_icon = 'machine-generic'
WHERE svg_icon IS NULL
  AND equipment && ARRAY['Machine', 'Selectorized']::text[];

-- ---------------------------------------------------------------------------
-- 22. Fallback por primary_group — cubre cualquier rezagado
-- ---------------------------------------------------------------------------
UPDATE exercise_library SET svg_icon = 'bench-press'    WHERE svg_icon IS NULL AND primary_group = 'Chest';
UPDATE exercise_library SET svg_icon = 'row'            WHERE svg_icon IS NULL AND primary_group = 'Back';
UPDATE exercise_library SET svg_icon = 'squat'          WHERE svg_icon IS NULL AND primary_group = 'Legs';
UPDATE exercise_library SET svg_icon = 'overhead-press' WHERE svg_icon IS NULL AND primary_group = 'Shoulders';
UPDATE exercise_library SET svg_icon = 'biceps-curl'    WHERE svg_icon IS NULL AND primary_group = 'Arms';
UPDATE exercise_library SET svg_icon = 'core-plank'     WHERE svg_icon IS NULL AND primary_group = 'Core';

-- ---------------------------------------------------------------------------
-- 23. Fallback final absoluto para ejercicios sin primary_group
-- ---------------------------------------------------------------------------
UPDATE exercise_library
SET svg_icon = 'machine-generic'
WHERE svg_icon IS NULL;

-- ---------------------------------------------------------------------------
-- Verificación: mostrar distribución de svg_icon y ejercicios sin asignar
-- ---------------------------------------------------------------------------
SELECT
  svg_icon,
  COUNT(*) AS total
FROM exercise_library
WHERE svg_icon IS NOT NULL
GROUP BY svg_icon
ORDER BY total DESC;

SELECT COUNT(*) AS sin_svg_icon
FROM exercise_library
WHERE svg_icon IS NULL;
