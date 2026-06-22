-- =============================================================================
-- FORZZA — Eliminar piso de precio de coach
-- Migración: 20260622120000_no_price_floor.sql
--
-- El dueño decidió que el coach puede cobrar cualquier precio > 0.
-- Forzza igual cobra su comisión del 20% (leída de country_config.commission_rate).
-- Se elimina el concepto de piso mínimo: min_coach_price pasa a 0 en todos los países.
-- La función check_coach_package_price() ahora solo exige precio > 0 Y que exista
-- configuración para el país (mantiene el error de país desconocido).
-- =============================================================================

-- 1. Poner min_coach_price en 0 para todos los países existentes
UPDATE country_config SET min_coach_price = 0;

-- 2. Reemplazar la función de validación: solo exige precio > 0
CREATE OR REPLACE FUNCTION check_coach_package_price()
RETURNS TRIGGER AS $$
DECLARE
  v_country country_code;
  v_config_exists BOOLEAN;
BEGIN
  -- Obtener el país del coach
  SELECT cp.country INTO v_country
  FROM coach_profiles cp
  WHERE cp.id = NEW.coach_id;

  -- Verificar que existe configuración para el país (mantiene error de país desconocido)
  SELECT EXISTS (
    SELECT 1 FROM country_config cc WHERE cc.country = v_country
  ) INTO v_config_exists;

  IF NOT v_config_exists THEN
    RAISE EXCEPTION 'No existe configuración de país para %', v_country;
  END IF;

  -- Solo exige precio estrictamente positivo (sin piso)
  IF NEW.price <= 0 THEN
    RAISE EXCEPTION 'El precio del paquete debe ser mayor a 0 (recibido: %)', NEW.price
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- El trigger coach_package_price_check ya existe; la función reemplazada
-- lo recoge automáticamente en el próximo disparo.
