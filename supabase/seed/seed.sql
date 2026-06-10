-- =============================================================================
-- FORZZA — Seed datos iniciales
-- =============================================================================

-- country_config: Argentina (activo) y Chile (preparado, no activo)
INSERT INTO country_config (country, commission_rate, currency, currency_symbol, min_coach_price, active)
VALUES
  ('AR', 0.2000, 'ARS', '$', 500000, true),   -- AR: piso $5000 ARS (en centavos)
  ('CL', 0.2000, 'CLP', '$', 2000000, false)   -- CL: piso $20000 CLP, no activo en V1
ON CONFLICT (country) DO NOTHING;

-- exercise_library: 30 ejercicios base (seed hasta que llegue ejercicios-234.xlsx)
INSERT INTO exercise_library (name, description, muscle_groups, equipment) VALUES
  ('Sentadilla', 'Sentadilla con peso corporal', ARRAY['cuádriceps', 'glúteos', 'isquiotibiales'], ARRAY['ninguno']),
  ('Sentadilla con barra', 'Sentadilla con barra en espalda', ARRAY['cuádriceps', 'glúteos', 'core'], ARRAY['barra', 'rack']),
  ('Prensa de piernas', 'Prensa horizontal o inclinada', ARRAY['cuádriceps', 'glúteos'], ARRAY['máquina']),
  ('Estocada', 'Estocada con paso adelante', ARRAY['cuádriceps', 'glúteos', 'isquiotibiales'], ARRAY['ninguno']),
  ('Peso muerto', 'Peso muerto convencional', ARRAY['isquiotibiales', 'glúteos', 'lumbar', 'trapecio'], ARRAY['barra']),
  ('Peso muerto rumano', 'Peso muerto con rodillas semiflexionadas', ARRAY['isquiotibiales', 'glúteos'], ARRAY['barra']),
  ('Hip thrust', 'Empuje de cadera con barra', ARRAY['glúteos'], ARRAY['banco', 'barra']),
  ('Press de banca', 'Press de banca con barra', ARRAY['pectoral', 'tríceps', 'deltoides anterior'], ARRAY['banca', 'barra']),
  ('Press inclinado con mancuernas', 'Press con mancuernas en banco inclinado', ARRAY['pectoral superior', 'tríceps'], ARRAY['banco', 'mancuernas']),
  ('Flexiones', 'Push-ups con peso corporal', ARRAY['pectoral', 'tríceps', 'deltoides'], ARRAY['ninguno']),
  ('Pull-up', 'Dominadas con agarre prono', ARRAY['dorsal', 'bíceps', 'core'], ARRAY['barra de dominadas']),
  ('Chin-up', 'Dominadas con agarre supino', ARRAY['dorsal', 'bíceps'], ARRAY['barra de dominadas']),
  ('Remo con barra', 'Remo inclinado con barra', ARRAY['dorsal', 'trapecio', 'bíceps'], ARRAY['barra']),
  ('Remo con mancuerna', 'Remo unilateral con mancuerna', ARRAY['dorsal', 'trapecio', 'bíceps'], ARRAY['banco', 'mancuerna']),
  ('Press militar', 'Press de hombros con barra', ARRAY['deltoides', 'tríceps', 'trapecio'], ARRAY['barra']),
  ('Press Arnold', 'Press de hombros con rotación', ARRAY['deltoides', 'tríceps'], ARRAY['mancuernas']),
  ('Elevación lateral', 'Elevación de mancuernas al costado', ARRAY['deltoides medio'], ARRAY['mancuernas']),
  ('Face pull', 'Jalón a la cara con polea', ARRAY['deltoides posterior', 'trapecio'], ARRAY['polea', 'cuerda']),
  ('Curl de bíceps', 'Curl con barra o mancuernas', ARRAY['bíceps'], ARRAY['barra o mancuernas']),
  ('Curl martillo', 'Curl con agarre neutro', ARRAY['bíceps', 'braquiorradial'], ARRAY['mancuernas']),
  ('Extensión de tríceps', 'Jalón al pecho con polea alta', ARRAY['tríceps'], ARRAY['polea']),
  ('Fondos en paralelas', 'Dips con peso corporal o adicional', ARRAY['tríceps', 'pectoral'], ARRAY['paralelas']),
  ('Plancha', 'Plancha isométrica', ARRAY['core', 'lumbar', 'hombros'], ARRAY['ninguno']),
  ('Abdominales', 'Crunch abdominal', ARRAY['recto abdominal'], ARRAY['ninguno']),
  ('Elevación de piernas', 'Leg raise colgado o en suelo', ARRAY['core', 'flexores de cadera'], ARRAY['ninguno o barra']),
  ('Remo en máquina', 'Remo sentado en máquina', ARRAY['dorsal', 'bíceps'], ARRAY['máquina']),
  ('Jalón al pecho', 'Polea alta con agarre ancho', ARRAY['dorsal', 'bíceps'], ARRAY['polea alta']),
  ('Extensión de cuádriceps', 'Máquina extensora de piernas', ARRAY['cuádriceps'], ARRAY['máquina']),
  ('Curl de isquiotibiales', 'Máquina flexora de piernas', ARRAY['isquiotibiales'], ARRAY['máquina']),
  ('Gemelos de pie', 'Elevación de talones de pie', ARRAY['gemelos'], ARRAY['ninguno o máquina']);
