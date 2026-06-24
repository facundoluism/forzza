-- =============================================================================
-- FORZZA — Agrega mp_fee_pct a country_config para Split Payments
-- Migración: 20260623000002_country_config_mp_fee_pct.sql
--
-- UNIDAD: basis points (bps) almacenados como INTEGER.
--   1 bps = 0,01% → 629 bps = 6,29%
--   Para convertir a tasa decimal: mp_fee_pct / 10000.0
--
-- RAZÓN DE USAR BPS:
--   Evita floats en la DB. La tasa 6,29% no puede representarse exactamente
--   como NUMERIC(5,4) sin riesgo de drift; como INTEGER (629 bps) es exacta.
--
-- VALOR PLACEHOLDER AR:
--   629 bps (~6,29%) es la tarifa pública de MP para débito inmediato en AR
--   al momento de la implementación (2026-06-23). La tarifa real depende del
--   plan/acuerdo comercial con MP.
--
-- TO-CONFIRM con ejecutivo comercial de MP:
--   1. ¿La tarifa de procesamiento exacta para el marketplace Forzza (AR)?
--      Varía según acuerdo, volumen y plazo de acreditación.
--   2. ¿La fee de MP se descuenta de los fondos del VENDEDOR (coach) PRIMERO,
--      antes de calcular el marketplace_fee de Forzza? (supuesto actual = SÍ,
--      que es el comportamiento documentado de MP Split para marketplaces).
--   3. ¿El IVA de la comisión de MP está incluido en el 6,29% o es adicional?
-- =============================================================================

ALTER TABLE public.country_config
  ADD COLUMN IF NOT EXISTS mp_fee_pct INTEGER NOT NULL DEFAULT 629;
-- DEFAULT 629 bps (6,29%) como placeholder. Actualizar cuando se confirme con MP.

COMMENT ON COLUMN public.country_config.mp_fee_pct IS
  'Comisión de procesamiento de Mercado Pago en basis points (bps). '
  '1 bps = 0,01%. Ej: 629 = 6,29%. '
  'Valor placeholder — confirmar con ejecutivo comercial de MP el valor exacto '
  'del acuerdo marketplace antes del go-live. '
  'Para convertir a decimal en código: mp_fee_pct / 10000.0. '
  'Esta fee la paga el vendedor (coach) y Forzza la reparte 50/50 por diseño '
  '(decisión del dueño 2026-06-23). Ver calculateSplitBreakdown() en core/billing.';

-- Actualizar el seed de AR con el placeholder confirmado
UPDATE public.country_config
  SET mp_fee_pct = 629
  WHERE country = 'AR';

UPDATE public.country_config
  SET mp_fee_pct = 629  -- placeholder CL igual; actualizar cuando se active CL
  WHERE country = 'CL';
