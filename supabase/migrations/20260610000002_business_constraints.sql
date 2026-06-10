-- =============================================================================
-- FORZZA — Constraints de negocio
-- Migración: 20260610000002_business_constraints.sql
-- =============================================================================

-- =============================================================================
-- TRIGGER: precio de coach >= piso del país
-- =============================================================================

CREATE OR REPLACE FUNCTION check_coach_package_price()
RETURNS TRIGGER AS $$
DECLARE
  v_min_price INTEGER;
  v_country country_code;
BEGIN
  -- Obtener el país del coach
  SELECT cp.country INTO v_country
  FROM coach_profiles cp
  WHERE cp.id = NEW.coach_id;

  -- Obtener el piso del país
  SELECT cc.min_coach_price INTO v_min_price
  FROM country_config cc
  WHERE cc.country = v_country;

  IF v_min_price IS NULL THEN
    RAISE EXCEPTION 'No existe configuración de país para %', v_country;
  END IF;

  IF NEW.price < v_min_price THEN
    RAISE EXCEPTION 'El precio del paquete (%) es menor al piso del país % (%)',
      NEW.price, v_country, v_min_price
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER coach_package_price_check
  BEFORE INSERT OR UPDATE ON coach_packages
  FOR EACH ROW EXECUTE FUNCTION check_coach_package_price();

-- =============================================================================
-- TRIGGER: billing_model pasa a 'comision' al 4° alumno activo, NUNCA revierte
-- =============================================================================

CREATE OR REPLACE FUNCTION update_billing_model_on_assignment()
RETURNS TRIGGER AS $$
DECLARE
  v_active_count INTEGER;
BEGIN
  -- Contar assignments activos del coach
  SELECT COUNT(*) INTO v_active_count
  FROM coach_assignments ca
  WHERE ca.coach_id = NEW.coach_id
    AND ca.status = 'active';

  -- Si llega a 4 activos y el billing_model es 'fixed', cambiarlo a 'comision' (NUNCA revierte)
  IF v_active_count >= 4 THEN
    UPDATE coach_profiles
    SET billing_model = 'comision', updated_at = now()
    WHERE id = NEW.coach_id
      AND billing_model = 'fixed'; -- solo si aún es fixed
  END IF;

  -- Actualizar contador
  UPDATE coach_profiles
  SET active_student_count = v_active_count, updated_at = now()
  WHERE id = NEW.coach_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assignment_billing_model_update
  AFTER INSERT OR UPDATE ON coach_assignments
  FOR EACH ROW EXECUTE FUNCTION update_billing_model_on_assignment();

-- =============================================================================
-- TRIGGER: settlement no puede pasar a 'transferred' sin invoice_number
-- =============================================================================

CREATE OR REPLACE FUNCTION check_settlement_invoice()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'transferred' AND (NEW.invoice_number IS NULL OR NEW.invoice_path IS NULL) THEN
    RAISE EXCEPTION 'No se puede transferir sin factura aprobada (invoice_number e invoice_path son requeridos)'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER settlement_invoice_check
  BEFORE UPDATE ON settlements
  FOR EACH ROW EXECUTE FUNCTION check_settlement_invoice();

-- =============================================================================
-- Timestamps automáticos
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER student_profiles_updated_at BEFORE UPDATE ON student_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER coach_profiles_updated_at BEFORE UPDATE ON coach_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER coach_packages_updated_at BEFORE UPDATE ON coach_packages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER coach_assignments_updated_at BEFORE UPDATE ON coach_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER settlements_updated_at BEFORE UPDATE ON settlements FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER routines_updated_at BEFORE UPDATE ON routines FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER workout_sessions_updated_at BEFORE UPDATE ON workout_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tickets_updated_at BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER country_config_updated_at BEFORE UPDATE ON country_config FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER notification_preferences_updated_at BEFORE UPDATE ON notification_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at();
