-- =============================================================================
-- FORZZA - Smoke fixture integral
-- Idempotente. Pensado para Supabase local via `supabase db reset` o
-- `supabase seed --local`.
--
-- Credenciales auth locales:
--   owner.smoke@forzza.app  / ForzzaSmoke123!
--   coach.smoke@forzza.app  / ForzzaSmoke123!
--   alumno.smoke@forzza.app / ForzzaSmoke123!
--
-- Cubre:
--   owner -> admin
--   coach aprobado -> marketplace + cobros
--   alumno -> rutina + sesion completada
--   pago aprobado -> assignment activo -> settlement con factura
-- =============================================================================

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    '10000000-0000-4000-8000-000000000001',
    'authenticated',
    'authenticated',
    'owner.smoke@forzza.app',
    crypt('ForzzaSmoke123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"role":"owner","country":"AR"}'::jsonb,
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '10000000-0000-4000-8000-000000000002',
    'authenticated',
    'authenticated',
    'coach.smoke@forzza.app',
    crypt('ForzzaSmoke123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"role":"coach","country":"AR"}'::jsonb,
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '10000000-0000-4000-8000-000000000003',
    'authenticated',
    'authenticated',
    'alumno.smoke@forzza.app',
    crypt('ForzzaSmoke123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"role":"student","country":"AR"}'::jsonb,
    now(),
    now()
  )
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  updated_at = now();

INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
VALUES
  (
    '10000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    '{"sub":"10000000-0000-4000-8000-000000000001","email":"owner.smoke@forzza.app","email_verified":true,"phone_verified":false}'::jsonb,
    'email',
    now(),
    now(),
    now()
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000002',
    '{"sub":"10000000-0000-4000-8000-000000000002","email":"coach.smoke@forzza.app","email_verified":true,"phone_verified":false}'::jsonb,
    'email',
    now(),
    now(),
    now()
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-8000-000000000003',
    '{"sub":"10000000-0000-4000-8000-000000000003","email":"alumno.smoke@forzza.app","email_verified":true,"phone_verified":false}'::jsonb,
    'email',
    now(),
    now(),
    now()
  )
ON CONFLICT DO NOTHING;

INSERT INTO users (id, role, country)
VALUES
  ('10000000-0000-4000-8000-000000000001', 'owner', 'AR'),
  ('10000000-0000-4000-8000-000000000002', 'coach', 'AR'),
  ('10000000-0000-4000-8000-000000000003', 'student', 'AR')
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  country = EXCLUDED.country;

INSERT INTO student_profiles (
  id,
  user_id,
  display_name,
  birth_date,
  goals,
  level
)
VALUES (
  '21000000-0000-4000-8000-000000000003',
  '10000000-0000-4000-8000-000000000003',
  'Valen Smoke',
  '2001-04-12',
  ARRAY['Ganar masa muscular','Aprender tecnica'],
  'principiante'
)
ON CONFLICT (user_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  birth_date = EXCLUDED.birth_date,
  goals = EXCLUDED.goals,
  level = EXCLUDED.level;

INSERT INTO coach_profiles (
  id,
  user_id,
  display_name,
  bio,
  specialties,
  status,
  country,
  legal_entity_type,
  fiscal_id,
  bank_account,
  cbu,
  alias_cbu,
  years_experience,
  billing_model,
  active_student_count
)
VALUES (
  '20000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000002',
  'Sofia Smoke Coach',
  'Coach de fuerza e hipertrofia. Acompana alumnos que quieren entrenar mejor sin perderse entre maquinas.',
  ARRAY['Hipertrofia','Fuerza','Tecnica'],
  'approved',
  'AR',
  'monotributo',
  '20-12345678-9',
  'SMOKE.FORZZA',
  '0000003100012345678901',
  'SMOKE.FORZZA',
  7,
  'fixed',
  0
)
ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio,
  specialties = EXCLUDED.specialties,
  status = EXCLUDED.status,
  legal_entity_type = EXCLUDED.legal_entity_type,
  fiscal_id = EXCLUDED.fiscal_id,
  bank_account = EXCLUDED.bank_account,
  cbu = EXCLUDED.cbu,
  alias_cbu = EXCLUDED.alias_cbu,
  years_experience = EXCLUDED.years_experience;

INSERT INTO coach_packages (
  id,
  coach_id,
  tier,
  title,
  description,
  price,
  country,
  active
)
VALUES (
  '30000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000002',
  'pro',
  'Plan Smoke Pro',
  'Rutina mensual, correcciones por chat y ajustes semanales. Fixture para smoke integral.',
  900000,
  'AR',
  true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  active = EXCLUDED.active;

INSERT INTO coach_assignments (
  id,
  student_id,
  coach_id,
  package_id,
  payment_id,
  status,
  started_at
)
VALUES (
  '40000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000003',
  '20000000-0000-4000-8000-000000000002',
  '30000000-0000-4000-8000-000000000001',
  null,
  'active',
  '2026-06-01T10:00:00+00:00'
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  started_at = EXCLUDED.started_at;

INSERT INTO payments (
  id,
  user_id,
  coach_id,
  assignment_id,
  amount,
  currency,
  status,
  gateway,
  gateway_payment_id,
  metadata
)
VALUES (
  '50000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000003',
  '20000000-0000-4000-8000-000000000002',
  '40000000-0000-4000-8000-000000000001',
  900000,
  'ARS',
  'approved',
  'mercadopago',
  'smoke-mp-payment-0001',
  '{"fixture":"smoke-flow","package_id":"30000000-0000-4000-8000-000000000001"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  amount = EXCLUDED.amount,
  metadata = EXCLUDED.metadata;

UPDATE coach_assignments
SET payment_id = '50000000-0000-4000-8000-000000000001'
WHERE id = '40000000-0000-4000-8000-000000000001';

DO $$
DECLARE
  v_bench UUID;
  v_incline UUID;
  v_lateral UUID;
BEGIN
  SELECT id INTO v_bench FROM exercise_library WHERE slug = 'dumbbell-flat-bench-press';
  SELECT id INTO v_incline FROM exercise_library WHERE slug = 'dumbbell-incline-bench-press';
  SELECT id INTO v_lateral FROM exercise_library WHERE slug = 'dumbbell-lateral-raise';

  INSERT INTO routines (
    id,
    student_id,
    coach_id,
    title,
    description,
    exercises,
    active
  )
  VALUES (
    '60000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000003',
    '20000000-0000-4000-8000-000000000002',
    'Smoke Push guiado',
    'Rutina fixture para validar alumno free: entiende ejercicios, registra series y puede abrir ficha.',
    jsonb_build_array(
      jsonb_build_object('exercise_id', v_bench, 'name', 'Press de Banca Plano con Mancuernas', 'sets', 3, 'reps', '8-10', 'rest_seconds', 120, 'notes', 'Baja controlado y no rebotes.'),
      jsonb_build_object('exercise_id', v_incline, 'name', 'Press de Banca Inclinado con Mancuernas', 'sets', 3, 'reps', '10-12', 'rest_seconds', 90, 'notes', 'Banco a 30-45 grados.'),
      jsonb_build_object('exercise_id', v_lateral, 'name', 'Elevaciones Laterales', 'sets', 3, 'reps', '12-15', 'rest_seconds', 60, 'notes', 'Subi hasta la linea del hombro.')
    ),
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    exercises = EXCLUDED.exercises,
    active = EXCLUDED.active;

  UPDATE coach_assignments
  SET routine_id = '60000000-0000-4000-8000-000000000001'
  WHERE id = '40000000-0000-4000-8000-000000000001';

  INSERT INTO workout_sessions (
    id,
    student_id,
    routine_id,
    client_uuid,
    status,
    started_at,
    completed_at,
    sets_data
  )
  VALUES (
    '70000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000003',
    '60000000-0000-4000-8000-000000000001',
    'smoke-session-20260616-0001',
    'completed',
    '2026-06-16T18:00:00+00:00',
    '2026-06-16T19:05:00+00:00',
    jsonb_build_array(
      jsonb_build_object(
        'exercise_id', v_bench,
        'sets', jsonb_build_array(
          jsonb_build_object('set_number', 1, 'reps', 10, 'weight_kg', 24),
          jsonb_build_object('set_number', 2, 'reps', 9, 'weight_kg', 24),
          jsonb_build_object('set_number', 3, 'reps', 8, 'weight_kg', 24)
        )
      ),
      jsonb_build_object(
        'exercise_id', v_incline,
        'sets', jsonb_build_array(
          jsonb_build_object('set_number', 1, 'reps', 12, 'weight_kg', 20),
          jsonb_build_object('set_number', 2, 'reps', 11, 'weight_kg', 20),
          jsonb_build_object('set_number', 3, 'reps', 10, 'weight_kg', 20)
        )
      )
    )
  )
  ON CONFLICT (client_uuid) DO UPDATE SET
    student_id = EXCLUDED.student_id,
    routine_id = EXCLUDED.routine_id,
    status = EXCLUDED.status,
    started_at = EXCLUDED.started_at,
    completed_at = EXCLUDED.completed_at,
    sets_data = EXCLUDED.sets_data;
END $$;

INSERT INTO settlements (
  id,
  coach_id,
  period_start,
  period_end,
  gross_amount,
  commission,
  net_amount,
  currency,
  status,
  invoice_number,
  invoice_path,
  invoice_rejection_reason,
  transferred_at
)
VALUES
  (
    '80000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000002',
    '2026-06-01',
    '2026-06-15',
    900000,
    180000,
    720000,
    'ARS',
    'pending_invoice',
    null,
    null,
    null,
    null
  ),
  (
    '80000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000002',
    '2026-05-16',
    '2026-05-31',
    900000,
    180000,
    720000,
    'ARS',
    'invoiced',
    'SMOKE-A-0001',
    'smoke/SMOKE-A-0001.pdf',
    null,
    null
  ),
  (
    '80000000-0000-4000-8000-000000000003',
    '20000000-0000-4000-8000-000000000002',
    '2026-05-01',
    '2026-05-15',
    900000,
    180000,
    720000,
    'ARS',
    'approved',
    'SMOKE-A-0002',
    'smoke/SMOKE-A-0002.pdf',
    null,
    null
  )
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  invoice_number = EXCLUDED.invoice_number,
  invoice_path = EXCLUDED.invoice_path,
  invoice_rejection_reason = EXCLUDED.invoice_rejection_reason,
  transferred_at = EXCLUDED.transferred_at;

INSERT INTO audit_log (actor_id, action, entity_type, entity_id, payload)
VALUES
  (
    '10000000-0000-4000-8000-000000000001',
    'smoke.fixture.loaded',
    'settlement',
    '80000000-0000-4000-8000-000000000002',
    '{"fixture":"smoke-flow","state":"invoiced"}'::jsonb
  ),
  (
    '10000000-0000-4000-8000-000000000001',
    'smoke.fixture.loaded',
    'settlement',
    '80000000-0000-4000-8000-000000000003',
    '{"fixture":"smoke-flow","state":"approved"}'::jsonb
  )
ON CONFLICT DO NOTHING;
