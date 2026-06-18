-- =============================================================================
-- FORZZA — Migración: normalizar primary_group y backfill svg_icon por slug
--
-- Motivos:
--   1. primary_group tenía capitalización inconsistente (Arms/arms, Legs/legs,
--      etc.) porque el seed original usaba "Chest"/"Back"/etc. y el resolver
--      resolveExerciseIconKey normaliza internamente a lowercase, pero la DB
--      guardaba en mixed case. Esta migración normaliza la fuente.
--   2. Agrega CHECK constraint con el set de valores permitidos.
--   3. Backfill idempotente de svg_icon por slug (234 ejercicios).
--
-- Decisión de diseño — svg_icon en migración (no solo en seed):
--   Los seeds de Supabase CLI (supabase/seed/*.sql) se ejecutan SOLO en local
--   durante `pnpm db:reset` (supabase db reset). NO se aplican en producción.
--   `supabase db push` aplica únicamente las migraciones pendientes.
--   Para que producción tenga svg_icon correctamente poblado, el backfill DEBE
--   estar en una migración de datos idempotente. El seed existe para uso local
--   y como fuente de verdad legible en code review; esta migración es la que
--   lleva los datos a prod.
--
--   Generado con: pnpm icons:backfill (scripts/backfill-svg-icons.ts)
--
-- NUNCA editar una migración ya aplicada. Para cambios: nueva migración.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. Normalizar primary_group → lowercase sin espacios leading/trailing
--    Solo actualiza filas que NO están ya en lowercase.
-- -----------------------------------------------------------------------------
UPDATE public.exercise_library
SET primary_group = lower(trim(primary_group))
WHERE primary_group IS NOT NULL
  AND primary_group != lower(trim(primary_group));

-- -----------------------------------------------------------------------------
-- 2. Trigger de normalización automática de primary_group
--    Convierte primary_group a lower(trim(...)) en CADA INSERT/UPDATE.
--    Esto garantiza que el valor en la DB siempre sea lowercase, incluso
--    cuando el seed exercises.sql inserta 'Chest'/'Back'/etc. con ON CONFLICT
--    DO UPDATE (el trigger actúa antes de la constraint check).
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_normalize_exercise_primary_group()
  RETURNS trigger
  LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.primary_group IS NOT NULL THEN
    NEW.primary_group := lower(trim(NEW.primary_group));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_normalize_exercise_primary_group
  BEFORE INSERT OR UPDATE OF primary_group
  ON public.exercise_library
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_normalize_exercise_primary_group();

-- -----------------------------------------------------------------------------
-- 3. CHECK constraint de valores permitidos
--    El trigger normaliza antes de que llegue el CHECK, por lo que el CHECK
--    solo necesita validar valores ya en lowercase.
--    Filas con primary_group NULL quedan permitidas (columna es NULLABLE).
-- -----------------------------------------------------------------------------
ALTER TABLE public.exercise_library
  ADD CONSTRAINT exercise_library_primary_group_check
  CHECK (
    primary_group IS NULL
    OR primary_group IN (
      'chest', 'back', 'legs', 'shoulders', 'arms',
      'core', 'glutes', 'cardio', 'full_body'
    )
  );

-- -----------------------------------------------------------------------------
-- 4. Backfill idempotente de svg_icon por slug
--    Generado por: scripts/backfill-svg-icons.ts
--    Lógica: resolveExerciseIconKey() + override semántico para patrones en español.
--    Cada UPDATE es idempotente (puede correr N veces sin efecto secundario).
--    Los slugs son únicos (UNIQUE INDEX exercise_library_slug_unique).
-- -----------------------------------------------------------------------------

-- ── core-plank ──────────────────────────────────────────────────────────────
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'ab-crunch-machine';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'ab-crunch-machine-2';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'back-extension-incline-bench';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'barbell-twists-russian-twist-with-bar';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'bench-press-barbell';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'bent-over-rear-delt-fly';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'cable-crunch';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'cable-crunch-kneeling';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'cable-internal-rotation';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'cable-pallof-press';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'cable-wood-chop';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'close-grip-bench-press';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'crunch-floor';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'decline-sit-up';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'dips-2';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'dumbbell-external-rotation';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'dumbbell-renegade-row';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'dumbbell-russian-twist';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'dumbbell-shrug-2';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'dumbbell-side-bend';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'dumbbell-wood-chop';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'elevaciones-laterales-a-una-mano';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'floor-ab-variations';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'floor-shoulder-rotation';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'glute-kickback';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'hanging-leg-raise';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'lying-leg-raise';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'push-ups';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'push-ups-2';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'resistance-band-lateral-raise';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'rope-wrist-roll';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'rotary-torso-machine';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'rotary-torso-machine-2';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'side-leg-raise';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'side-lying-oblique-crunch';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'side-lying-rear-delt-raise';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'standing-calf-raise';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'standing-hip-adduction';
UPDATE public.exercise_library SET svg_icon = 'core-plank' WHERE slug = 'step-up';

-- ── row ─────────────────────────────────────────────────────────────────────
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'assisted-pull-up-machine-2';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'barbell-bent-over-row';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'barbell-upright-row';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'cable-face-pull';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'cable-straight-arm-pulldown-2';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'cable-t-bar-row';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'cable-upright-row-2';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'dumbbell-bent-over-row';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'dumbbell-pullover-2';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'dumbbell-pullover-3';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'dumbbell-single-arm-row';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'dumbbell-single-arm-row-2';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'floor-dumbbell-pullover';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'inverted-t-bar-row';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'lat-pulldown';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'machine-row';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'máquina-de-dorsal-jalón-en-máquina';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'neutral-grip-lat-pulldown';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'pull-ups-chin-ups';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'remo-en-polea-gironda';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'seated-back-extension-machine';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'seated-cable-row';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'seated-row-machine';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'single-arm-cable-pulldown';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'smith-machine-bent-over-row';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'smith-machine-row';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 'standing-low-cable-row';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 't-bar-row';
UPDATE public.exercise_library SET svg_icon = 'row' WHERE slug = 't-bar-row-machine';

-- ── biceps-curl ──────────────────────────────────────────────────────────────
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'barbell-bicep-curl';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'barbell-side-bend';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'bicep-curl-machine';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'cable-bicep-curl';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'cable-bicep-curl-ez-bar';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'cable-bicep-curl-straight-bar';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'cable-hammer-curl';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'cable-hip-flexion';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'cable-overhead-bicep-curl';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'concentration-curl';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'dumbbell-bicep-curl';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'dumbbell-concentration-curl';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'dumbbell-front-raise-2';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'dumbbell-hammer-curl';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'dumbbell-incline-curl';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'dumbbell-preacher-curl';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'dumbbell-supination-curl';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'dumbbell-zottman-curl';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'ez-bar-curl';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'high-cable-curl-single-arm';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'incline-dumbbell-curl';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'lying-leg-curl-machine-2';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'preacher-curl-machine-bicep-machine';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'preacher-curl-scott-bench';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'reverse-curl-pronated';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'standing-cable-hamstring-curl';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'wrist-curl-barbell';
UPDATE public.exercise_library SET svg_icon = 'biceps-curl' WHERE slug = 'wrist-radial-flexion';

-- ── triceps-ext ──────────────────────────────────────────────────────────────
UPDATE public.exercise_library SET svg_icon = 'triceps-ext' WHERE slug = 'cable-chest-press';
UPDATE public.exercise_library SET svg_icon = 'triceps-ext' WHERE slug = 'cable-overhead-tricep-extension';
UPDATE public.exercise_library SET svg_icon = 'triceps-ext' WHERE slug = 'cable-tricep-kickback';
UPDATE public.exercise_library SET svg_icon = 'triceps-ext' WHERE slug = 'cable-tricep-pushdown-bar';
UPDATE public.exercise_library SET svg_icon = 'triceps-ext' WHERE slug = 'cable-tricep-pushdown-rope';
UPDATE public.exercise_library SET svg_icon = 'triceps-ext' WHERE slug = 'cable-tricep-pushdown-rope-2';
UPDATE public.exercise_library SET svg_icon = 'triceps-ext' WHERE slug = 'cable-tricep-pushdown-straight-bar';
UPDATE public.exercise_library SET svg_icon = 'triceps-ext' WHERE slug = 'dumbbell-close-grip-press';
UPDATE public.exercise_library SET svg_icon = 'triceps-ext' WHERE slug = 'dumbbell-overhead-tricep-extension';
UPDATE public.exercise_library SET svg_icon = 'triceps-ext' WHERE slug = 'dumbbell-skull-crusher';
UPDATE public.exercise_library SET svg_icon = 'triceps-ext' WHERE slug = 'dumbbell-tricep-kickback';
UPDATE public.exercise_library SET svg_icon = 'triceps-ext' WHERE slug = 'french-press-skull-crusher-bar';
UPDATE public.exercise_library SET svg_icon = 'triceps-ext' WHERE slug = 'french-press-skull-crusher-dumbbell';
UPDATE public.exercise_library SET svg_icon = 'triceps-ext' WHERE slug = 'overhead-cable-tricep-extension';
UPDATE public.exercise_library SET svg_icon = 'triceps-ext' WHERE slug = 'overhead-tricep-extension-dumbbell';
UPDATE public.exercise_library SET svg_icon = 'triceps-ext' WHERE slug = 'reverse-wrist-curl';
UPDATE public.exercise_library SET svg_icon = 'triceps-ext' WHERE slug = 'tricep-extension-machine';
UPDATE public.exercise_library SET svg_icon = 'triceps-ext' WHERE slug = 'tricep-extension-machine-2';
UPDATE public.exercise_library SET svg_icon = 'triceps-ext' WHERE slug = 'tricep-press-machine';

-- ── lateral-raise ────────────────────────────────────────────────────────────
UPDATE public.exercise_library SET svg_icon = 'lateral-raise' WHERE slug = 'cable-front-raise';
UPDATE public.exercise_library SET svg_icon = 'lateral-raise' WHERE slug = 'cable-front-raise-2';
UPDATE public.exercise_library SET svg_icon = 'lateral-raise' WHERE slug = 'cable-lateral-raise';
UPDATE public.exercise_library SET svg_icon = 'lateral-raise' WHERE slug = 'cable-lateral-raise-single';
UPDATE public.exercise_library SET svg_icon = 'lateral-raise' WHERE slug = 'cable-rear-delt-fly';
UPDATE public.exercise_library SET svg_icon = 'lateral-raise' WHERE slug = 'cable-shrug';
UPDATE public.exercise_library SET svg_icon = 'lateral-raise' WHERE slug = 'captains-chair-leg-raise';
UPDATE public.exercise_library SET svg_icon = 'lateral-raise' WHERE slug = 'dumbbell-front-raise';
UPDATE public.exercise_library SET svg_icon = 'lateral-raise' WHERE slug = 'dumbbell-lateral-raise';
UPDATE public.exercise_library SET svg_icon = 'lateral-raise' WHERE slug = 'dumbbell-lateral-raise-2';
UPDATE public.exercise_library SET svg_icon = 'lateral-raise' WHERE slug = 'dumbbell-rear-delt-fly';
UPDATE public.exercise_library SET svg_icon = 'lateral-raise' WHERE slug = 'dumbbell-shrug';
UPDATE public.exercise_library SET svg_icon = 'lateral-raise' WHERE slug = 'lateral-raise-machine';
UPDATE public.exercise_library SET svg_icon = 'lateral-raise' WHERE slug = 'machine-lateral-raise';
UPDATE public.exercise_library SET svg_icon = 'lateral-raise' WHERE slug = 'rear-delt-reverse-fly-machine';
UPDATE public.exercise_library SET svg_icon = 'lateral-raise' WHERE slug = 'shoulder-shrug';
UPDATE public.exercise_library SET svg_icon = 'lateral-raise' WHERE slug = 'shoulder-shrug-2';

-- ── bench-press ──────────────────────────────────────────────────────────────
UPDATE public.exercise_library SET svg_icon = 'bench-press' WHERE slug = 'assisted-dips-cable';
UPDATE public.exercise_library SET svg_icon = 'bench-press' WHERE slug = 'chest-press-machine';
UPDATE public.exercise_library SET svg_icon = 'bench-press' WHERE slug = 'close-grip-barbell-bench-press';
UPDATE public.exercise_library SET svg_icon = 'bench-press' WHERE slug = 'decline-bench-press';
UPDATE public.exercise_library SET svg_icon = 'bench-press' WHERE slug = 'dips';
UPDATE public.exercise_library SET svg_icon = 'bench-press' WHERE slug = 'dumbbell-flat-bench-press';
UPDATE public.exercise_library SET svg_icon = 'bench-press' WHERE slug = 'dumbbell-press';
UPDATE public.exercise_library SET svg_icon = 'bench-press' WHERE slug = 'hanging-leg-raise-bar';
UPDATE public.exercise_library SET svg_icon = 'bench-press' WHERE slug = 'incline-bench-press';
UPDATE public.exercise_library SET svg_icon = 'bench-press' WHERE slug = 'leg-press-machine-horizontalseated';
UPDATE public.exercise_library SET svg_icon = 'bench-press' WHERE slug = 'machine-chest-press';
UPDATE public.exercise_library SET svg_icon = 'bench-press' WHERE slug = 'pec-deck-machine';
UPDATE public.exercise_library SET svg_icon = 'bench-press' WHERE slug = 'smith-machine-bench-press';
UPDATE public.exercise_library SET svg_icon = 'bench-press' WHERE slug = 'smith-machine-bench-press-2';
UPDATE public.exercise_library SET svg_icon = 'bench-press' WHERE slug = 'standing-cable-ab-rollout';

-- ── lunge ────────────────────────────────────────────────────────────────────
UPDATE public.exercise_library SET svg_icon = 'lunge' WHERE slug = 'calf-press-on-leg-press';
UPDATE public.exercise_library SET svg_icon = 'lunge' WHERE slug = 'dumbbell-bulgarian-split-squat';
UPDATE public.exercise_library SET svg_icon = 'lunge' WHERE slug = 'dumbbell-lunge';
UPDATE public.exercise_library SET svg_icon = 'lunge' WHERE slug = 'dumbbell-reverse-lunge';
UPDATE public.exercise_library SET svg_icon = 'lunge' WHERE slug = 'dumbbell-standing-calf-raise';
UPDATE public.exercise_library SET svg_icon = 'lunge' WHERE slug = 'dumbbell-step-up';
UPDATE public.exercise_library SET svg_icon = 'lunge' WHERE slug = 'dumbbell-walking-lunge';
UPDATE public.exercise_library SET svg_icon = 'lunge' WHERE slug = 'seated-calf-raise-bar';
UPDATE public.exercise_library SET svg_icon = 'lunge' WHERE slug = 'seated-calf-raise-machine';
UPDATE public.exercise_library SET svg_icon = 'lunge' WHERE slug = 'seated-calf-raise-machine-2';
UPDATE public.exercise_library SET svg_icon = 'lunge' WHERE slug = 'smith-machine-calf-raise';
UPDATE public.exercise_library SET svg_icon = 'lunge' WHERE slug = 'smith-machine-lunge';
UPDATE public.exercise_library SET svg_icon = 'lunge' WHERE slug = 'standing-calf-raise-machine';
UPDATE public.exercise_library SET svg_icon = 'lunge' WHERE slug = 'standing-calf-raise-machine-2';

-- ── chest-fly ────────────────────────────────────────────────────────────────
UPDATE public.exercise_library SET svg_icon = 'chest-fly' WHERE slug = 'cable-chest-fly-low-pulley';
UPDATE public.exercise_library SET svg_icon = 'chest-fly' WHERE slug = 'cable-crossover';
UPDATE public.exercise_library SET svg_icon = 'chest-fly' WHERE slug = 'cable-crossover-high-to-low';
UPDATE public.exercise_library SET svg_icon = 'chest-fly' WHERE slug = 'dumbbell-decline-fly';
UPDATE public.exercise_library SET svg_icon = 'chest-fly' WHERE slug = 'dumbbell-flat-fly';
UPDATE public.exercise_library SET svg_icon = 'chest-fly' WHERE slug = 'dumbbell-fly';
UPDATE public.exercise_library SET svg_icon = 'chest-fly' WHERE slug = 'dumbbell-incline-fly';
UPDATE public.exercise_library SET svg_icon = 'chest-fly' WHERE slug = 'dumbbell-pullover';
UPDATE public.exercise_library SET svg_icon = 'chest-fly' WHERE slug = 'dumbbell-pullover-back-focus';
UPDATE public.exercise_library SET svg_icon = 'chest-fly' WHERE slug = 'incline-dumbbell-fly';
UPDATE public.exercise_library SET svg_icon = 'chest-fly' WHERE slug = 'low-cable-chest-fly';
UPDATE public.exercise_library SET svg_icon = 'chest-fly' WHERE slug = 'pec-deck-butterfly-machine';

-- ── overhead-press ───────────────────────────────────────────────────────────
UPDATE public.exercise_library SET svg_icon = 'overhead-press' WHERE slug = 'cable-rear-delt-fly-single';
UPDATE public.exercise_library SET svg_icon = 'overhead-press' WHERE slug = 'dumbbell-arnold-press';
UPDATE public.exercise_library SET svg_icon = 'overhead-press' WHERE slug = 'dumbbell-arnold-press-2';
UPDATE public.exercise_library SET svg_icon = 'overhead-press' WHERE slug = 'dumbbell-overhead-press';
UPDATE public.exercise_library SET svg_icon = 'overhead-press' WHERE slug = 'dumbbell-press-2';
UPDATE public.exercise_library SET svg_icon = 'overhead-press' WHERE slug = 'machine-shoulder-press';
UPDATE public.exercise_library SET svg_icon = 'overhead-press' WHERE slug = 'military-press-barbell';
UPDATE public.exercise_library SET svg_icon = 'overhead-press' WHERE slug = 'rear-delt-machine-fly';
UPDATE public.exercise_library SET svg_icon = 'overhead-press' WHERE slug = 'shoulder-press-machine';
UPDATE public.exercise_library SET svg_icon = 'overhead-press' WHERE slug = 'smith-machine-shoulder-press';
UPDATE public.exercise_library SET svg_icon = 'overhead-press' WHERE slug = 'smith-machine-shoulder-press-2';
UPDATE public.exercise_library SET svg_icon = 'overhead-press' WHERE slug = 'unilateral-dumbbell-shoulder-press';

-- ── squat ────────────────────────────────────────────────────────────────────
UPDATE public.exercise_library SET svg_icon = 'squat' WHERE slug = 'barbell-squat';
UPDATE public.exercise_library SET svg_icon = 'squat' WHERE slug = 'cable-hack-squat';
UPDATE public.exercise_library SET svg_icon = 'squat' WHERE slug = 'dumbbell-goblet-squat';
UPDATE public.exercise_library SET svg_icon = 'squat' WHERE slug = 'dumbbell-squat';
UPDATE public.exercise_library SET svg_icon = 'squat' WHERE slug = 'dumbbell-sumo-squat';
UPDATE public.exercise_library SET svg_icon = 'squat' WHERE slug = 'hack-squat-machine';
UPDATE public.exercise_library SET svg_icon = 'squat' WHERE slug = 'leg-press-machine';
UPDATE public.exercise_library SET svg_icon = 'squat' WHERE slug = 'lunges';
UPDATE public.exercise_library SET svg_icon = 'squat' WHERE slug = 'smith-machine-squat';
UPDATE public.exercise_library SET svg_icon = 'squat' WHERE slug = 'smith-machine-squat-2';

-- ── pulldown ─────────────────────────────────────────────────────────────────
UPDATE public.exercise_library SET svg_icon = 'pulldown' WHERE slug = 'assisted-pull-up-machine';
UPDATE public.exercise_library SET svg_icon = 'pulldown' WHERE slug = 'cable-straight-arm-pulldown';
UPDATE public.exercise_library SET svg_icon = 'pulldown' WHERE slug = 'cable-upright-row';
UPDATE public.exercise_library SET svg_icon = 'pulldown' WHERE slug = 'dumbbell-upright-row';
UPDATE public.exercise_library SET svg_icon = 'pulldown' WHERE slug = 'lat-pulldown-machine';
UPDATE public.exercise_library SET svg_icon = 'pulldown' WHERE slug = 'lat-pulldown-narrowneutral-grip';
UPDATE public.exercise_library SET svg_icon = 'pulldown' WHERE slug = 'lat-pulldown-reverseunderhand-grip';
UPDATE public.exercise_library SET svg_icon = 'pulldown' WHERE slug = 'lat-pulldown-wide-grip';

-- ── hip-thrust ───────────────────────────────────────────────────────────────
UPDATE public.exercise_library SET svg_icon = 'hip-thrust' WHERE slug = 'cable-hip-abduction';
UPDATE public.exercise_library SET svg_icon = 'hip-thrust' WHERE slug = 'cable-hip-adduction';
UPDATE public.exercise_library SET svg_icon = 'hip-thrust' WHERE slug = 'dumbbell-hip-thrust';
UPDATE public.exercise_library SET svg_icon = 'hip-thrust' WHERE slug = 'hip-abductor-machine';
UPDATE public.exercise_library SET svg_icon = 'hip-thrust' WHERE slug = 'hip-abductor-machine-2';
UPDATE public.exercise_library SET svg_icon = 'hip-thrust' WHERE slug = 'hip-adductor-machine';
UPDATE public.exercise_library SET svg_icon = 'hip-thrust' WHERE slug = 'hip-adductor-machine-2';
UPDATE public.exercise_library SET svg_icon = 'hip-thrust' WHERE slug = 'smith-machine-hip-thrust';

-- ── deadlift ─────────────────────────────────────────────────────────────────
UPDATE public.exercise_library SET svg_icon = 'deadlift' WHERE slug = 'back-extension-machine';
UPDATE public.exercise_library SET svg_icon = 'deadlift' WHERE slug = 'cable-pull-through';
UPDATE public.exercise_library SET svg_icon = 'deadlift' WHERE slug = 'deadlift';
UPDATE public.exercise_library SET svg_icon = 'deadlift' WHERE slug = 'dumbbell-deadlift';
UPDATE public.exercise_library SET svg_icon = 'deadlift' WHERE slug = 'dumbbell-romanian-deadlift';
UPDATE public.exercise_library SET svg_icon = 'deadlift' WHERE slug = 'roman-chair-back-extension';
UPDATE public.exercise_library SET svg_icon = 'deadlift' WHERE slug = 'smith-machine-romanian-deadlift';

-- ── leg-curl ─────────────────────────────────────────────────────────────────
UPDATE public.exercise_library SET svg_icon = 'leg-curl' WHERE slug = 'cable-glute-kickback';
UPDATE public.exercise_library SET svg_icon = 'leg-curl' WHERE slug = 'cable-glute-kickback-2';
UPDATE public.exercise_library SET svg_icon = 'leg-curl' WHERE slug = 'glute-ham-developer-ghd';
UPDATE public.exercise_library SET svg_icon = 'leg-curl' WHERE slug = 'lying-leg-curl-machine';
UPDATE public.exercise_library SET svg_icon = 'leg-curl' WHERE slug = 'seated-leg-curl-machine';
UPDATE public.exercise_library SET svg_icon = 'leg-curl' WHERE slug = 'standing-cable-glute-extension';
UPDATE public.exercise_library SET svg_icon = 'leg-curl' WHERE slug = 'tricep-kickback';

-- ── incline-press ────────────────────────────────────────────────────────────
UPDATE public.exercise_library SET svg_icon = 'incline-press' WHERE slug = 'cable-incline-press';
UPDATE public.exercise_library SET svg_icon = 'incline-press' WHERE slug = 'dumbbell-incline-bench-press';
UPDATE public.exercise_library SET svg_icon = 'incline-press' WHERE slug = 'incline-chest-press-machine';
UPDATE public.exercise_library SET svg_icon = 'incline-press' WHERE slug = 'leg-press-machine-45';
UPDATE public.exercise_library SET svg_icon = 'incline-press' WHERE slug = 'smith-machine-incline-press';

-- ── leg-extension ────────────────────────────────────────────────────────────
UPDATE public.exercise_library SET svg_icon = 'leg-extension' WHERE slug = 'cable-hip-extension';
UPDATE public.exercise_library SET svg_icon = 'leg-extension' WHERE slug = 'leg-extension-machine';
UPDATE public.exercise_library SET svg_icon = 'leg-extension' WHERE slug = 'leg-extension-machine-2';

-- ── decline-press ────────────────────────────────────────────────────────────
UPDATE public.exercise_library SET svg_icon = 'decline-press' WHERE slug = 'dumbbell-decline-bench-press';

COMMIT;
