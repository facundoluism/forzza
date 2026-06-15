-- =============================================================================
-- FORZZA — Seed datos DEMO para cuenta facundoluism@gmail.com
-- Archivo: supabase/seed/seed-demo.sql
-- Idempotente: usa ON CONFLICT DO NOTHING / DO UPDATE donde corresponde.
--
-- PRECONDICIONES:
--   1. Las migraciones de supabase/migrations/ deben estar aplicadas.
--   2. La cuenta auth facundoluism@gmail.com debe existir en auth.users.
--      Si no existe: el usuario debe loguearse al menos una vez en la app,
--      o crearse manualmente via Supabase Dashboard > Authentication > Users.
--   3. El coach demo (coach.demo@forzza.app) debe existir en auth.users.
--      Si no existe: crear via Dashboard o Admin API antes de ejecutar este seed.
--
-- IDs FIJOS usados (cambiar si se recrea el entorno):
--   Student auth.users.id : fb2d8425-0e44-4aa1-b43e-2c4756a62fdd  (facundoluism@gmail.com)
--   Coach  auth.users.id  : 65a6539d-90b7-4db6-a665-e6ba5d1f22ec  (coach.demo@forzza.app)
--   coach_profiles.id     : 3d3b8593-3d9b-4840-8dc1-31d8458131f3
--   coach_packages ids    : (generados por uuid_generate_v4 en primer insert)
-- =============================================================================

-- Variables de referencia (sin DO $$ para compatibilidad directa con psql)
-- Sustituir manualmente si los IDs cambian.

-- ============================================================
-- PASO 1: Filas en public.users (extienden auth.users)
-- ============================================================

INSERT INTO users (id, role, country)
VALUES
  ('fb2d8425-0e44-4aa1-b43e-2c4756a62fdd', 'student', 'AR'),
  ('65a6539d-90b7-4db6-a665-e6ba5d1f22ec', 'coach',   'AR')
ON CONFLICT (id) DO UPDATE SET
  role    = EXCLUDED.role,
  country = EXCLUDED.country;

-- ============================================================
-- PASO 2: Perfiles
-- ============================================================

INSERT INTO student_profiles (user_id, display_name, birth_date, goals, level)
VALUES (
  'fb2d8425-0e44-4aa1-b43e-2c4756a62fdd',
  'Facundo (Demo)',
  '1995-03-15',
  ARRAY['Ganar masa muscular', 'Mejorar resistencia'],
  'intermedio'
)
ON CONFLICT (user_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  goals        = EXCLUDED.goals,
  level        = EXCLUDED.level;

INSERT INTO coach_profiles (
  id,
  user_id,
  display_name,
  bio,
  specialties,
  status,
  country,
  years_experience,
  legal_entity_type,
  billing_model,
  active_student_count
)
VALUES (
  '3d3b8593-3d9b-4840-8dc1-31d8458131f3',
  '65a6539d-90b7-4db6-a665-e6ba5d1f22ec',
  'Martin Rodriguez',
  'Entrenador personal con 8 anios de experiencia en fuerza y acondicionamiento. Especializado en hipertrofia muscular, perdida de grasa y rendimiento deportivo. Mas de 200 alumnos transformados.',
  ARRAY['Hipertrofia', 'Fuerza', 'Perdida de grasa'],
  'approved',
  'AR',
  8,
  'monotributo',
  'fixed',
  1
)
ON CONFLICT (id) DO UPDATE SET
  display_name         = EXCLUDED.display_name,
  bio                  = EXCLUDED.bio,
  specialties          = EXCLUDED.specialties,
  status               = EXCLUDED.status,
  years_experience     = EXCLUDED.years_experience,
  active_student_count = EXCLUDED.active_student_count;

-- ============================================================
-- PASO 3: Paquetes del coach demo
-- price >= 500000 (min_coach_price AR, verificado via trigger)
-- Los IDs son fijos para idempotencia con ON CONFLICT
-- ============================================================

INSERT INTO coach_packages (id, coach_id, tier, title, description, price, country, active)
VALUES
  (
    '06994ee8-0b93-41ea-a929-741dd0fcb5c7',
    '3d3b8593-3d9b-4840-8dc1-31d8458131f3',
    'starter',
    'Plan Starter - 1 mes',
    'Rutinas personalizadas + seguimiento semanal por chat. Ideal para empezar con orden y estructura.',
    500000,
    'AR',
    true
  ),
  (
    'd546b53d-c4cd-40b9-89fb-6005eb40b41a',
    '3d3b8593-3d9b-4840-8dc1-31d8458131f3',
    'pro',
    'Plan Pro - 1 mes',
    'Todo lo del Starter mas ajuste de rutinas quincenal, check-in semanal con fotos y analisis de progreso detallado.',
    900000,
    'AR',
    true
  ),
  (
    'a22e364a-ea8d-45a5-9d0b-1e50e600f040',
    '3d3b8593-3d9b-4840-8dc1-31d8458131f3',
    'elite',
    'Plan Elite - 1 mes',
    'Atencion premium: rutinas 100% personalizadas, ajuste semanal, videollamada mensual de revision y acceso prioritario por chat.',
    1500000,
    'AR',
    true
  )
ON CONFLICT (id) DO UPDATE SET
  title       = EXCLUDED.title,
  description = EXCLUDED.description,
  price       = EXCLUDED.price,
  active      = EXCLUDED.active;

-- ============================================================
-- PASO 4: Rutinas del alumno demo
-- ============================================================

INSERT INTO routines (id, student_id, coach_id, title, description, exercises, active)
VALUES
  (
    'bc8a8d02-f709-48a8-a115-80bb7a4b9178',
    'fb2d8425-0e44-4aa1-b43e-2c4756a62fdd',
    '3d3b8593-3d9b-4840-8dc1-31d8458131f3',
    'Push dia 1 - Pecho y hombros',
    'Rutina de empuje para el dia 1. Foco en pecho superior e hombros. Tempo controlado en la fase excentrica.',
    '[
      {"name":"Press de banca con barra","sets":4,"reps":"6-8","rest_seconds":180,"notes":"Controla la bajada 3 segundos"},
      {"name":"Press inclinado con mancuernas","sets":3,"reps":"10-12","rest_seconds":120},
      {"name":"Press militar con barra","sets":3,"reps":"8-10","rest_seconds":120,"notes":"No bloquees los codos arriba"},
      {"name":"Elevaciones laterales","sets":4,"reps":"12-15","rest_seconds":60},
      {"name":"Triceps en polea alta","sets":3,"reps":"12-15","rest_seconds":60}
    ]'::jsonb,
    true
  ),
  (
    '745093dd-4115-4c24-ae64-cd7e12da1e87',
    'fb2d8425-0e44-4aa1-b43e-2c4756a62fdd',
    '3d3b8593-3d9b-4840-8dc1-31d8458131f3',
    'Pierna fuerza - Cuadriceps dominante',
    'Sesion de piernas con foco en fuerza. Sentadilla como movimiento principal. Descansa bien entre series pesadas.',
    '[
      {"name":"Sentadilla con barra","sets":5,"reps":"5","rest_seconds":240,"notes":"Profundidad paralela minima"},
      {"name":"Prensa de piernas","sets":3,"reps":"10-12","rest_seconds":150},
      {"name":"Extension de cuadriceps","sets":3,"reps":"15","rest_seconds":90},
      {"name":"Curl femoral acostado","sets":3,"reps":"12","rest_seconds":90},
      {"name":"Gemelos de pie","sets":4,"reps":"20","rest_seconds":60}
    ]'::jsonb,
    true
  ),
  (
    'eb391f4f-0662-4abc-aa5b-df8491acbf08',
    'fb2d8425-0e44-4aa1-b43e-2c4756a62fdd',
    null,
    'Full body - Principiante',
    'Rutina de cuerpo completo ideal para los dias que no tenes mucho tiempo. 45 minutos aproximadamente.',
    '[
      {"name":"Sentadilla con peso corporal","sets":3,"reps":"15","rest_seconds":60},
      {"name":"Flexiones","sets":3,"reps":"10-15","rest_seconds":60,"notes":"Si no podes hacer 10, apoya las rodillas"},
      {"name":"Remo con mancuerna","sets":3,"reps":"12","rest_seconds":60},
      {"name":"Plancha","sets":3,"reps":"30s","rest_seconds":45},
      {"name":"Peso muerto rumano","sets":3,"reps":"12","rest_seconds":90}
    ]'::jsonb,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  title       = EXCLUDED.title,
  description = EXCLUDED.description,
  exercises   = EXCLUDED.exercises,
  active      = EXCLUDED.active;

-- ============================================================
-- PASO 5: Sesiones de entrenamiento completadas
-- client_uuid es UNIQUE (idempotencia offline)
-- ============================================================

INSERT INTO workout_sessions (id, student_id, routine_id, client_uuid, status, started_at, completed_at, sets_data)
VALUES
  (
    '42e61f2a-dc62-43f8-9e9b-56bfeaaa7eba',
    'fb2d8425-0e44-4aa1-b43e-2c4756a62fdd',
    'bc8a8d02-f709-48a8-a115-80bb7a4b9178',
    'demo-session-push-20260612-001',
    'completed',
    '2026-06-12T18:05:00+00:00',
    '2026-06-12T19:10:00+00:00',
    '[
      {"exercise":"Press de banca con barra","sets":[{"set":1,"reps":7,"weight_kg":80},{"set":2,"reps":7,"weight_kg":80},{"set":3,"reps":6,"weight_kg":82.5},{"set":4,"reps":6,"weight_kg":82.5}]},
      {"exercise":"Press inclinado con mancuernas","sets":[{"set":1,"reps":12,"weight_kg":24},{"set":2,"reps":11,"weight_kg":24},{"set":3,"reps":10,"weight_kg":24}]}
    ]'::jsonb
  ),
  (
    'f21b81b5-74cf-4d8b-8a39-3a53afc220fe',
    'fb2d8425-0e44-4aa1-b43e-2c4756a62fdd',
    '745093dd-4115-4c24-ae64-cd7e12da1e87',
    'demo-session-pierna-20260610-001',
    'completed',
    '2026-06-10T17:30:00+00:00',
    '2026-06-10T18:45:00+00:00',
    '[
      {"exercise":"Sentadilla con barra","sets":[{"set":1,"reps":5,"weight_kg":100},{"set":2,"reps":5,"weight_kg":100},{"set":3,"reps":5,"weight_kg":102.5},{"set":4,"reps":5,"weight_kg":102.5},{"set":5,"reps":4,"weight_kg":105}]},
      {"exercise":"Prensa de piernas","sets":[{"set":1,"reps":12,"weight_kg":180},{"set":2,"reps":11,"weight_kg":180},{"set":3,"reps":10,"weight_kg":180}]}
    ]'::jsonb
  )
ON CONFLICT (client_uuid) DO NOTHING;

-- ============================================================
-- PASO 6: Notificaciones del alumno
-- ============================================================

INSERT INTO notifications (id, user_id, type, title, body, data, read_at)
VALUES
  (
    'a1000001-0000-4000-8000-000000000001',
    'fb2d8425-0e44-4aa1-b43e-2c4756a62fdd',
    'N1',
    'Bienvenido a Forzza',
    'Ya podes empezar a entrenar. Tu primera rutina te esta esperando.',
    '{"screen":"routines"}'::jsonb,
    '2026-06-10T10:05:00+00:00'
  ),
  (
    'a1000001-0000-4000-8000-000000000002',
    'fb2d8425-0e44-4aa1-b43e-2c4756a62fdd',
    'N7',
    'Sesion completada',
    'Excelente entreno de piernas hoy. Levantaste 102.5 kg en sentadilla.',
    '{"session_id":"f21b81b5-74cf-4d8b-8a39-3a53afc220fe"}'::jsonb,
    '2026-06-10T19:00:00+00:00'
  ),
  (
    'a1000001-0000-4000-8000-000000000003',
    'fb2d8425-0e44-4aa1-b43e-2c4756a62fdd',
    'N8',
    'Martin te mando una rutina nueva',
    'Tu coach Martin Rodriguez actualizo tu plan de entrenamiento para esta semana.',
    '{"screen":"routines"}'::jsonb,
    null
  ),
  (
    'a1000001-0000-4000-8000-000000000004',
    'fb2d8425-0e44-4aa1-b43e-2c4756a62fdd',
    'N3',
    'Recordatorio de entrenamiento',
    'Llevas 2 dias sin entrenar. No pierdas el ritmo que venis bien.',
    '{"screen":"home"}'::jsonb,
    null
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PASO 7: Coach assignment (alumno activo con coach demo)
-- ============================================================

INSERT INTO coach_assignments (id, student_id, coach_id, package_id, payment_id, status, started_at)
VALUES (
  '54106df3-26d8-4e08-bbb7-d5284805f650',
  'fb2d8425-0e44-4aa1-b43e-2c4756a62fdd',
  '3d3b8593-3d9b-4840-8dc1-31d8458131f3',
  '06994ee8-0b93-41ea-a929-741dd0fcb5c7',
  null,
  'active',
  '2026-06-01T10:00:00+00:00'
)
ON CONFLICT (id) DO NOTHING;
