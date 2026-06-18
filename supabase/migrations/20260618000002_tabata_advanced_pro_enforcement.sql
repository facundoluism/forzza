-- =============================================================================
-- FORZZA — Enforcement PRO server-side para tabata_plans.mode = 'advanced'
-- Migración: 20260618000002_tabata_advanced_pro_enforcement.sql
--
-- CONTEXTO:
--   La tabla tabata_plans ya tiene RLS de ownership (student_id = auth.uid()).
--   Sin embargo, el gating del modo avanzado (feature PRO) solo estaba en el
--   cliente. Esta migración cierra el gap: un usuario no-PRO no puede
--   insertar ni actualizar un plan con mode = 'advanced' aunque sortee el
--   cliente.
--
-- REGLA CANÓNICA DE PRO:
--   Un usuario es PRO si existe en subscriptions una fila con:
--     - user_id = <el usuario>
--     - status IN ('active', 'canceled')   -- 'canceled' con período vigente
--                                           --  sigue dando acceso (AC3)
--     - plan IN ('pro', 'elite')
--     - current_period_end >= now()
--
-- NUNCA editar una migración ya aplicada. Para cambios: nueva migración.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Función auxiliar public.is_pro(p_user_id uuid) → boolean
--
--    SECURITY DEFINER: evalúa el predicado contra subscriptions sin depender
--    de que el rol 'authenticated' tenga políticas RLS propias sobre esa
--    tabla (defensa en profundidad).
--    search_path fijado a 'public' para prevenir ataques de search-path.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_pro(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Devuelve true si el usuario tiene una suscripción PRO o ELITE vigente.
  -- 'canceled' con current_period_end futuro aún da acceso (regla AC3: el
  -- entitlement vive hasta el fin del ciclo pago, igual que en check-entitlements).
  SELECT EXISTS (
    SELECT 1
    FROM public.subscriptions
    WHERE user_id            = p_user_id
      AND status             IN ('active', 'canceled')
      AND plan               IN ('pro', 'elite')
      AND current_period_end >= now()
  );
$$;

COMMENT ON FUNCTION public.is_pro(uuid) IS
  'Devuelve true si el usuario tiene suscripción PRO o ELITE vigente '
  '(status active/canceled con current_period_end >= now()). '
  'SECURITY DEFINER para evaluar subscriptions sin depender de RLS del rol llamante.';

-- ---------------------------------------------------------------------------
-- 2. Reemplazar políticas INSERT y UPDATE de tabata_plans
--
--    Se agrega al WITH CHECK la condición PRO:
--      (mode = ''simple'' OR public.is_pro(auth.uid()))
--    Esto permite:
--      - Cualquier usuario autenticado insertar/actualizar planes simples.
--      - Solo usuarios PRO insertar/actualizar planes avanzados.
--    Se conserva la condición de ownership: student_id = auth.uid().
--
--    SELECT y DELETE NO se tocan: un usuario que perdió su suscripción PRO
--    puede seguir viendo y borrando sus planes avanzados viejos, pero no
--    puede crear ni modificar nuevos planes avanzados.
-- ---------------------------------------------------------------------------

-- Reemplazar política INSERT
DROP POLICY IF EXISTS "tabata_plans_insert_own" ON public.tabata_plans;

CREATE POLICY "tabata_plans_insert_own" ON public.tabata_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Ownership: solo el propio alumno puede insertar sus planes
    student_id = auth.uid()
    -- Enforcement PRO server-side: solo PRO puede insertar modo avanzado
    AND (mode = 'simple' OR public.is_pro(auth.uid()))
  );

COMMENT ON POLICY "tabata_plans_insert_own" ON public.tabata_plans IS
  'INSERT: el alumno solo puede insertar sus propios planes. '
  'El modo avanzado requiere suscripción PRO o ELITE vigente (is_pro()).';

-- Reemplazar política UPDATE
DROP POLICY IF EXISTS "tabata_plans_update_own" ON public.tabata_plans;

CREATE POLICY "tabata_plans_update_own" ON public.tabata_plans
  FOR UPDATE
  TO authenticated
  USING (
    -- USING: el alumno solo puede ver/tocar sus propias filas para UPDATE
    student_id = auth.uid()
  )
  WITH CHECK (
    -- WITH CHECK: ownership + enforcement PRO en el nuevo valor
    student_id = auth.uid()
    -- Enforcement PRO server-side: el nuevo estado del plan debe ser
    -- consistente con el entitlement actual del usuario
    AND (mode = 'simple' OR public.is_pro(auth.uid()))
  );

COMMENT ON POLICY "tabata_plans_update_own" ON public.tabata_plans IS
  'UPDATE: el alumno solo puede modificar sus propios planes. '
  'Si actualiza un plan avanzado (o intenta cambiar a avanzado), '
  'necesita suscripción PRO o ELITE vigente (is_pro()).';
