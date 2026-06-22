-- =============================================================================
-- FORZZA — Anti-reversión de billing_model (Regla de negocio #5)
-- Migración: 20260622120001_billing_model_anti_reversion.sql
--
-- Una vez que un coach pasa a billing_model = 'comision', jamás puede
-- volver a 'fixed'. Esto complementa update_billing_model_on_assignment()
-- que ya setea el paso a comision: este trigger previene cualquier UPDATE
-- manual o programático que intente revertirlo.
-- =============================================================================

CREATE OR REPLACE FUNCTION prevent_billing_model_reversion()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.billing_model = 'comision' AND NEW.billing_model = 'fixed' THEN
    RAISE EXCEPTION 'El modelo de facturación no puede revertir de comisión a fijo (coach_id: %)', OLD.id
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER coach_billing_model_anti_reversion
  BEFORE UPDATE ON coach_profiles
  FOR EACH ROW EXECUTE FUNCTION prevent_billing_model_reversion();
