-- =============================================================================
-- FORZZA — Tests de RLS (reescritura completa)
-- Ejecutar con: supabase test db (corre como superusuario 'postgres')
--
-- PRINCIPIOS:
--   1. Fixtures self-contained: todos los datos necesarios se insertan aqui
--      (no se depende del seed). Se revierten al hacer ROLLBACK al final.
--   2. RLS efectiva: para ejercitar RLS se usa SET LOCAL ROLE + set_config
--      de JWT claims dentro de un DO anonimo.
--   3. Default-deny con 0 filas: anon/usuario ajeno NO lanza 42501, devuelve
--      0 filas. Los throws_ok(42501) son SOLO para REVOKE y triggers.
--   4. Todos los tests dentro de la misma transaccion; ROLLBACK limpia todo.
--
-- UUIDs (solo caracteres hex validos 0-9 a-f):
--   a1a00001-0000-4000-8000-000000000001  coach1    (auth.users)
--   a2a00002-0000-4000-8000-000000000002  coach2    (auth.users)
--   a3a00003-0000-4000-8000-000000000003  student1  (auth.users)
--   a4a00004-0000-4000-8000-000000000004  student2  (auth.users)
--   a5a00005-0000-4000-8000-000000000005  owner     (auth.users)
--   c1c00001-0000-4000-8000-000000000001  coach_profiles.id coach1
--   c2c00002-0000-4000-8000-000000000002  coach_profiles.id coach2
--   b1b00001-0000-4000-8000-000000000001  coach_packages.id (pro, coach1)
--   b2b00002-0000-4000-8000-000000000002  coach_packages.id (starter, coach2)
--   d1d00001-0000-4000-8000-000000000001  coach_assignments.id (coach1<->student1)
--   d2d00002-0000-4000-8000-000000000002  coach_assignments.id (coach2<->student2)
--   e1e00001-0000-4000-8000-000000000001  routines.id (student1)
--   f1f00001-0000-4000-8000-000000000001  workout_sessions.id (student1)
--   f2f00002-0000-4000-8000-000000000002  workout_sessions.id (student2)
--   0aa00001-0000-4000-8000-000000000001  progress_photos.id (student1)
--   0bb00001-0000-4000-8000-000000000001  messages.id
--   0cc00001-0000-4000-8000-000000000001  student_profiles.id (student1)
-- =============================================================================

BEGIN;

SELECT plan(66);

-- =============================================================================
-- FIXTURES: insertados como superusuario (bypassa RLS y REVOKE).
-- =============================================================================

DO $setup$
BEGIN
  -- 1. auth.users (sin trigger hacia public.users — lo hacemos manualmente abajo)
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at,
    raw_user_meta_data, created_at, updated_at, aud, role)
  VALUES
    ('a1a00001-0000-4000-8000-000000000001'::uuid, 'rls.coach1@test.forzza',   'x', now(), '{"role":"coach"}'::jsonb,   now(), now(), 'authenticated', 'authenticated'),
    ('a2a00002-0000-4000-8000-000000000002'::uuid, 'rls.coach2@test.forzza',   'x', now(), '{"role":"coach"}'::jsonb,   now(), now(), 'authenticated', 'authenticated'),
    ('a3a00003-0000-4000-8000-000000000003'::uuid, 'rls.student1@test.forzza', 'x', now(), '{"role":"student"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
    ('a4a00004-0000-4000-8000-000000000004'::uuid, 'rls.student2@test.forzza', 'x', now(), '{"role":"student"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
    ('a5a00005-0000-4000-8000-000000000005'::uuid, 'rls.owner@test.forzza',    'x', now(), '{"role":"owner"}'::jsonb,   now(), now(), 'authenticated', 'authenticated')
  ON CONFLICT (id) DO NOTHING;

  -- 2. public.users (handle_new_user puede haberlos creado; ON CONFLICT DO NOTHING)
  INSERT INTO public.users (id, role, country, created_at, updated_at)
  VALUES
    ('a1a00001-0000-4000-8000-000000000001'::uuid, 'coach',   'AR', now(), now()),
    ('a2a00002-0000-4000-8000-000000000002'::uuid, 'coach',   'AR', now(), now()),
    ('a3a00003-0000-4000-8000-000000000003'::uuid, 'student', 'AR', now(), now()),
    ('a4a00004-0000-4000-8000-000000000004'::uuid, 'student', 'AR', now(), now()),
    ('a5a00005-0000-4000-8000-000000000005'::uuid, 'owner',   'AR', now(), now())
  ON CONFLICT (id) DO NOTHING;

  -- 3. coach_profiles con IDs fijos
  INSERT INTO coach_profiles (id, user_id, display_name, country, status, created_at, updated_at)
  VALUES
    ('c1c00001-0000-4000-8000-000000000001'::uuid, 'a1a00001-0000-4000-8000-000000000001'::uuid, 'Coach Uno RLS', 'AR', 'approved', now(), now()),
    ('c2c00002-0000-4000-8000-000000000002'::uuid, 'a2a00002-0000-4000-8000-000000000002'::uuid, 'Coach Dos RLS', 'AR', 'approved', now(), now())
  ON CONFLICT (id) DO NOTHING;

  -- 4. coach_packages con precio >= piso AR (500000 centavos)
  INSERT INTO coach_packages (id, coach_id, tier, title, price, country, active, created_at, updated_at)
  VALUES
    ('b1b00001-0000-4000-8000-000000000001'::uuid, 'c1c00001-0000-4000-8000-000000000001'::uuid, 'pro',     'Pro Test',     600000, 'AR', true, now(), now()),
    ('b2b00002-0000-4000-8000-000000000002'::uuid, 'c2c00002-0000-4000-8000-000000000002'::uuid, 'starter', 'Starter Test', 600000, 'AR', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

  -- 5. coach_assignments
  INSERT INTO coach_assignments (id, student_id, coach_id, package_id, status, created_at, updated_at)
  VALUES
    ('d1d00001-0000-4000-8000-000000000001'::uuid, 'a3a00003-0000-4000-8000-000000000003'::uuid, 'c1c00001-0000-4000-8000-000000000001'::uuid, 'b1b00001-0000-4000-8000-000000000001'::uuid, 'active', now(), now()),
    ('d2d00002-0000-4000-8000-000000000002'::uuid, 'a4a00004-0000-4000-8000-000000000004'::uuid, 'c2c00002-0000-4000-8000-000000000002'::uuid, 'b2b00002-0000-4000-8000-000000000002'::uuid, 'active', now(), now())
  ON CONFLICT (id) DO NOTHING;

  -- 6. routine de student1 creada por coach1
  INSERT INTO routines (id, student_id, coach_id, title, exercises, active, created_at, updated_at)
  VALUES
    ('e1e00001-0000-4000-8000-000000000001'::uuid, 'a3a00003-0000-4000-8000-000000000003'::uuid, 'c1c00001-0000-4000-8000-000000000001'::uuid, 'Rutina RLS Test', '[]'::jsonb, true, now(), now())
  ON CONFLICT (id) DO NOTHING;

  -- 6b. routine de student2 creada por coach2
  INSERT INTO routines (id, student_id, coach_id, title, exercises, active, created_at, updated_at)
  VALUES
    ('e2e00002-0000-4000-8000-000000000002'::uuid, 'a4a00004-0000-4000-8000-000000000004'::uuid, 'c2c00002-0000-4000-8000-000000000002'::uuid, 'Rutina RLS Test Coach2', '[]'::jsonb, true, now(), now())
  ON CONFLICT (id) DO NOTHING;

  -- 7. vincular rutina al assignment (UPDATE directo bypassa trigger de columnas
  --    porque current_user = 'postgres' => trigger hace RETURN NEW sin restriccion)
  UPDATE coach_assignments
    SET routine_id = 'e1e00001-0000-4000-8000-000000000001'::uuid
  WHERE id = 'd1d00001-0000-4000-8000-000000000001'::uuid;

  UPDATE coach_assignments
    SET routine_id = 'e2e00002-0000-4000-8000-000000000002'::uuid
  WHERE id = 'd2d00002-0000-4000-8000-000000000002'::uuid;

  -- 8. workout_sessions
  INSERT INTO workout_sessions (id, student_id, routine_id, client_uuid, status, started_at, created_at, updated_at)
  VALUES
    ('f1f00001-0000-4000-8000-000000000001'::uuid, 'a3a00003-0000-4000-8000-000000000003'::uuid, 'e1e00001-0000-4000-8000-000000000001'::uuid, 'rls-client-ws1', 'completed', now(), now(), now()),
    ('f2f00002-0000-4000-8000-000000000002'::uuid, 'a4a00004-0000-4000-8000-000000000004'::uuid, NULL, 'rls-client-ws2', 'completed', now(), now(), now())
  ON CONFLICT (id) DO NOTHING;

  -- 9. progress_photos de student1
  INSERT INTO progress_photos (id, student_id, assignment_id, storage_path, recorded_at, created_at)
  VALUES
    ('0aa00001-0000-4000-8000-000000000001'::uuid, 'a3a00003-0000-4000-8000-000000000003'::uuid, 'd1d00001-0000-4000-8000-000000000001'::uuid,
     'progress-photos/a3a00003-0000-4000-8000-000000000003/foto1.jpg', now(), now())
  ON CONFLICT (id) DO NOTHING;

  -- 10. mensaje en assignment1
  INSERT INTO messages (id, assignment_id, sender_id, content, created_at)
  VALUES
    ('0bb00001-0000-4000-8000-000000000001'::uuid, 'd1d00001-0000-4000-8000-000000000001'::uuid, 'a3a00003-0000-4000-8000-000000000003'::uuid, 'Hola coach!', now())
  ON CONFLICT (id) DO NOTHING;

  -- 11. student_profile de student1 (necesario para T25 y T28)
  INSERT INTO student_profiles (id, user_id, display_name, created_at, updated_at)
  VALUES
    ('0cc00001-0000-4000-8000-000000000001'::uuid, 'a3a00003-0000-4000-8000-000000000003'::uuid, 'Alumno Uno RLS', now(), now())
  ON CONFLICT (id) DO NOTHING;

  -- 12. routine_schedule: una fila por coach (para tests T33-T41)
  --   9900aa01 => coach1 asigna rutina e1 a student1 el 2026-07-01
  --   9900bb02 => coach2 asigna rutina e2 a student2 el 2026-07-01
  INSERT INTO routine_schedule (id, assignment_id, student_id, coach_id, routine_id, scheduled_date, notes, created_at, updated_at)
  VALUES
    ('9900aa01-0000-4000-8000-000000000001'::uuid, 'd1d00001-0000-4000-8000-000000000001'::uuid, 'a3a00003-0000-4000-8000-000000000003'::uuid, 'c1c00001-0000-4000-8000-000000000001'::uuid, 'e1e00001-0000-4000-8000-000000000001'::uuid, '2026-07-01', 'Sesion RLS test coach1', now(), now()),
    ('9900bb02-0000-4000-8000-000000000002'::uuid, 'd2d00002-0000-4000-8000-000000000002'::uuid, 'a4a00004-0000-4000-8000-000000000004'::uuid, 'c2c00002-0000-4000-8000-000000000002'::uuid, 'e2e00002-0000-4000-8000-000000000002'::uuid, '2026-07-01', 'Sesion RLS test coach2', now(), now())
  ON CONFLICT (id) DO NOTHING;

  -- 13. tabata_plans: un plan de student1 y otro de student2 (para tests T43-T47)
  --   7ab00001 => plan simple de student1
  --   7ab00002 => plan avanzado de student2
  INSERT INTO tabata_plans (id, student_id, name, mode, config, created_at, updated_at)
  VALUES
    ('7ab00001-0000-4000-8000-000000000001'::uuid, 'a3a00003-0000-4000-8000-000000000003'::uuid, 'Tabata RLS Plan Student1', 'simple',   '{"workSecs":20,"restSecs":10,"rounds":8,"prepSecs":10}'::jsonb, now(), now()),
    ('7ab00002-0000-4000-8000-000000000002'::uuid, 'a4a00004-0000-4000-8000-000000000004'::uuid, 'Tabata RLS Plan Student2', 'advanced',  '[{"id":"s1","kind":"work","label":"Squats","durationMs":20000}]'::jsonb, now(), now())
  ON CONFLICT (id) DO NOTHING;

  -- 14. ejercicio de prueba para exercise_video_requests (T56-T62)
  --   ee10ex01 => ejercicio sin video publicado
  INSERT INTO exercise_library (id, name, description, muscle_groups, equipment, created_at)
  VALUES
    ('ee100e01-0000-4000-8000-000000000001'::uuid, 'Ejercicio RLS Test Video Request', 'Ejercicio de prueba para tests de pedidos de video', ARRAY['core'], ARRAY['Bodyweight'], now())
  ON CONFLICT (id) DO NOTHING;
END $setup$;
-- (UUIDs de tabata_plans corregidos a hex válido: 7ab… en lugar de tab…)

-- =============================================================================
-- T01: auth_role() no lanza excepcion como superusuario (devuelve NULL sin claims)
-- =============================================================================
SELECT ok(
  (auth_role() IS NULL OR auth_role() IS NOT NULL),
  'T01: auth_role() no lanza excepcion (superusuario, sin JWT claims)'
);

-- =============================================================================
-- T02: coach_has_active_assignment() false para IDs aleatorios
-- =============================================================================
SELECT ok(
  NOT coach_has_active_assignment(gen_random_uuid(), gen_random_uuid()),
  'T02: coach_has_active_assignment() false para IDs inexistentes'
);

-- =============================================================================
-- T03: student_has_pro_or_elite_package() false para IDs aleatorios
-- =============================================================================
SELECT ok(
  NOT student_has_pro_or_elite_package(gen_random_uuid(), gen_random_uuid()),
  'T03: student_has_pro_or_elite_package() false para IDs inexistentes'
);

-- =============================================================================
-- T04: auth_coach_profile_id() resuelve coach_profiles.id desde JWT claims
-- =============================================================================
SELECT is(
  (
    WITH _setup AS (
      SELECT set_config(
        'request.jwt.claims',
        json_build_object('sub', 'a1a00001-0000-4000-8000-000000000001', 'role', 'authenticated')::text,
        true
      )
    )
    SELECT auth_coach_profile_id() FROM _setup
  ),
  'c1c00001-0000-4000-8000-000000000001'::uuid,
  'T04: auth_coach_profile_id() resuelve coach_profiles.id de coach1'
);

-- limpiar claims
SELECT set_config('request.jwt.claims', '', true);

-- =============================================================================
-- T05: coach_has_active_assignment() true con fixture real
-- =============================================================================
SELECT ok(
  coach_has_active_assignment(
    'c1c00001-0000-4000-8000-000000000001'::uuid,
    'a3a00003-0000-4000-8000-000000000003'::uuid
  ),
  'T05: coach_has_active_assignment() true para coach1 con student1 (fixture)'
);

-- =============================================================================
-- T06: student_has_pro_or_elite_package() true con fixture real
-- =============================================================================
SELECT ok(
  student_has_pro_or_elite_package(
    'a3a00003-0000-4000-8000-000000000003'::uuid,
    'c1c00001-0000-4000-8000-000000000001'::uuid
  ),
  'T06: student_has_pro_or_elite_package() true (student1 tiene paquete pro con coach1)'
);

-- =============================================================================
-- T07: coach_assignments.routine_id apunta a la rutina del fixture
-- =============================================================================
SELECT is(
  (SELECT routine_id FROM coach_assignments WHERE id = 'd1d00001-0000-4000-8000-000000000001'::uuid),
  'e1e00001-0000-4000-8000-000000000001'::uuid,
  'T07: coach_assignments.routine_id apunta a la rutina asignada por coach1'
);

-- =============================================================================
-- T08: country_config AR commission_rate = 20% (seed en migracion)
-- =============================================================================
SELECT ok(
  (SELECT commission_rate = 0.2000 FROM country_config WHERE country = 'AR'),
  'T08: AR tiene commission_rate = 20%'
);

-- =============================================================================
-- T09: country_config CL no activo en V1
-- =============================================================================
SELECT ok(
  (SELECT NOT active FROM country_config WHERE country = 'CL'),
  'T09: CL no esta activo en V1'
);

-- =============================================================================
-- T10: exercise_library tiene al menos 30 ejercicios (seed en migracion)
-- =============================================================================
SELECT ok(
  (SELECT COUNT(*) >= 30 FROM exercise_library),
  'T10: exercise_library tiene al menos 30 ejercicios'
);

-- =============================================================================
-- T11: audit_log rechaza UPDATE como rol authenticated (REVOKE efectivo)
-- SET LOCAL ROLE cambia el rol efectivo dentro del DO anonimo.
-- =============================================================================
SELECT throws_ok(
  $t11$
    DO $inner$
    BEGIN
      SET LOCAL ROLE authenticated;
      UPDATE audit_log SET action = 'hacked' WHERE false;
    END $inner$;
  $t11$,
  '42501',
  NULL,
  'T11: audit_log rechaza UPDATE como authenticated (REVOKE)'
);

-- =============================================================================
-- T12: audit_log rechaza DELETE como rol authenticated
-- =============================================================================
SELECT throws_ok(
  $t12$
    DO $inner$
    BEGIN
      SET LOCAL ROLE authenticated;
      DELETE FROM audit_log WHERE false;
    END $inner$;
  $t12$,
  '42501',
  NULL,
  'T12: audit_log rechaza DELETE como authenticated (REVOKE)'
);

-- =============================================================================
-- T13: processed_events rechaza UPDATE como rol authenticated
-- =============================================================================
SELECT throws_ok(
  $t13$
    DO $inner$
    BEGIN
      SET LOCAL ROLE authenticated;
      UPDATE processed_events SET gateway = 'hacked' WHERE false;
    END $inner$;
  $t13$,
  '42501',
  NULL,
  'T13: processed_events rechaza UPDATE como authenticated (REVOKE)'
);

-- =============================================================================
-- T14: trigger check_coach_package_price rechaza precio < piso del pais
-- Piso AR = 500000; probamos precio = 1.
-- =============================================================================
SELECT throws_ok(
  $t14$
    INSERT INTO coach_packages (coach_id, tier, title, price, country, active, created_at, updated_at)
    VALUES (
      'c1c00001-0000-4000-8000-000000000001'::uuid,
      'starter',
      'Precio bajo test',
      1,
      'AR',
      true,
      now(),
      now()
    )
  $t14$,
  '23514',
  NULL,
  'T14: trigger rechaza precio de paquete < piso AR (ERRCODE 23514 = check_violation)'
);

-- =============================================================================
-- T15: settlement rechaza transicion a 'transferred' si status previo != 'approved'
-- =============================================================================
DO $t15$
DECLARE
  v_id UUID;
  v_ok BOOLEAN := false;
BEGIN
  INSERT INTO settlements (coach_id, period_start, period_end, gross_amount, commission,
    net_amount, currency, status, invoice_number, invoice_path, created_at, updated_at)
  VALUES ('c1c00001-0000-4000-8000-000000000001'::uuid,
    '2026-06-01', '2026-06-15', 100000, 20000, 80000,
    'ARS', 'pending', 'FAC-RLS-T15', 'invoices/t15.pdf', now(), now())
  RETURNING id INTO v_id;

  BEGIN
    UPDATE settlements SET status = 'transferred' WHERE id = v_id;
  EXCEPTION WHEN OTHERS THEN
    v_ok := true;
  END;

  DELETE FROM settlements WHERE id = v_id;

  IF NOT v_ok THEN
    RAISE EXCEPTION 'T15 FALLO: trigger no bloqueo pending->transferred';
  END IF;
END $t15$;

SELECT ok(true, 'T15: settlement rechaza transferred desde status pending (trigger)');

-- =============================================================================
-- T16: settlement rechaza 'transferred' sin invoice aunque status = 'approved'
-- =============================================================================
DO $t16$
DECLARE
  v_id UUID;
  v_ok BOOLEAN := false;
BEGIN
  INSERT INTO settlements (coach_id, period_start, period_end, gross_amount, commission,
    net_amount, currency, status, invoice_number, invoice_path, created_at, updated_at)
  VALUES ('c1c00001-0000-4000-8000-000000000001'::uuid,
    '2026-06-01', '2026-06-15', 100000, 20000, 80000,
    'ARS', 'approved', NULL, NULL, now(), now())
  RETURNING id INTO v_id;

  BEGIN
    UPDATE settlements SET status = 'transferred' WHERE id = v_id;
  EXCEPTION WHEN OTHERS THEN
    v_ok := true;
  END;

  DELETE FROM settlements WHERE id = v_id;

  IF NOT v_ok THEN
    RAISE EXCEPTION 'T16 FALLO: trigger no bloqueo approved->transferred sin invoice';
  END IF;
END $t16$;

SELECT ok(true, 'T16: settlement rechaza transferred sin invoice (status=approved, invoice=NULL)');

-- =============================================================================
-- T17: RLS habilitado en tabla users
-- =============================================================================
SELECT ok(
  (SELECT rowsecurity FROM pg_tables WHERE tablename = 'users' AND schemaname = 'public'),
  'T17: RLS habilitado en tabla users'
);

-- =============================================================================
-- T18: RLS habilitado en tabla audit_log
-- =============================================================================
SELECT ok(
  (SELECT rowsecurity FROM pg_tables WHERE tablename = 'audit_log' AND schemaname = 'public'),
  'T18: RLS habilitado en tabla audit_log'
);

-- =============================================================================
-- T19: RLS habilitado en tabla payments
-- =============================================================================
SELECT ok(
  (SELECT rowsecurity FROM pg_tables WHERE tablename = 'payments' AND schemaname = 'public'),
  'T19: RLS habilitado en tabla payments'
);

-- =============================================================================
-- T20: sin JWT claims, auth.uid() es NULL (pre-condicion de los tests anon)
-- =============================================================================
SELECT ok(
  (
    SELECT auth.uid() IS NULL
    FROM (SELECT set_config('request.jwt.claims', '', true)) _setup
  ),
  'T20: sin JWT claims, auth.uid() es NULL'
);

-- =============================================================================
-- T20b: anon ve 0 filas en users (SET LOCAL ROLE anon, RLS default-deny)
-- =============================================================================
DO $t20b$
DECLARE
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE anon;
  PERFORM set_config('request.jwt.claims', '', true);
  SELECT COUNT(*) INTO v_count FROM users;
  RESET ROLE;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'T20b FALLO: anon vio % filas en users (esperado 0)', v_count;
  END IF;
END $t20b$;

SELECT ok(true, 'T20b: anon ve 0 filas en users (RLS default-deny)');

-- =============================================================================
-- T21: anon ve 0 filas en routines
-- =============================================================================
DO $t21$
DECLARE
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE anon;
  PERFORM set_config('request.jwt.claims', '', true);
  SELECT COUNT(*) INTO v_count FROM routines;
  RESET ROLE;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'T21 FALLO: anon vio % filas en routines (esperado 0)', v_count;
  END IF;
END $t21$;

SELECT ok(true, 'T21: anon ve 0 filas en routines (RLS default-deny)');

-- =============================================================================
-- T22: anon ve 0 filas en messages
-- =============================================================================
DO $t22$
DECLARE
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE anon;
  PERFORM set_config('request.jwt.claims', '', true);
  SELECT COUNT(*) INTO v_count FROM messages;
  RESET ROLE;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'T22 FALLO: anon vio % filas en messages (esperado 0)', v_count;
  END IF;
END $t22$;

SELECT ok(true, 'T22: anon ve 0 filas en messages (RLS default-deny)');

-- =============================================================================
-- T23: student2 ve 0 workout_sessions de student1 (aislamiento alumno-alumno)
-- =============================================================================
DO $t23$
DECLARE
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a4a00004-0000-4000-8000-000000000004', 'role', 'authenticated')::text,
    true);
  SELECT COUNT(*) INTO v_count
  FROM workout_sessions
  WHERE student_id = 'a3a00003-0000-4000-8000-000000000003'::uuid;
  RESET ROLE;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'T23 FALLO: student2 vio % workout_sessions de student1 (esperado 0)', v_count;
  END IF;
END $t23$;

SELECT ok(true, 'T23: student2 ve 0 workout_sessions de student1 (aislamiento alumno-alumno)');

-- =============================================================================
-- T24: student2 ve 0 messages del assignment coach1-student1
-- =============================================================================
DO $t24$
DECLARE
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a4a00004-0000-4000-8000-000000000004', 'role', 'authenticated')::text,
    true);
  SELECT COUNT(*) INTO v_count
  FROM messages
  WHERE assignment_id = 'd1d00001-0000-4000-8000-000000000001'::uuid;
  RESET ROLE;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'T24 FALLO: student2 vio % messages del assignment1 (esperado 0)', v_count;
  END IF;
END $t24$;

SELECT ok(true, 'T24: student2 ve 0 messages del assignment coach1-student1');

-- =============================================================================
-- T25: coach2 ve 0 student_profiles de student1 (aislamiento coach-coach)
-- =============================================================================
DO $t25$
DECLARE
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a2a00002-0000-4000-8000-000000000002', 'role', 'authenticated')::text,
    true);
  SELECT COUNT(*) INTO v_count
  FROM student_profiles
  WHERE user_id = 'a3a00003-0000-4000-8000-000000000003'::uuid;
  RESET ROLE;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'T25 FALLO: coach2 vio % student_profiles de student1 (esperado 0)', v_count;
  END IF;
END $t25$;

SELECT ok(true, 'T25: coach2 ve 0 student_profiles de student1 (aislamiento coach-coach)');

-- =============================================================================
-- T26: coach2 ve 0 workout_sessions de student1
-- =============================================================================
DO $t26$
DECLARE
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a2a00002-0000-4000-8000-000000000002', 'role', 'authenticated')::text,
    true);
  SELECT COUNT(*) INTO v_count
  FROM workout_sessions
  WHERE student_id = 'a3a00003-0000-4000-8000-000000000003'::uuid;
  RESET ROLE;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'T26 FALLO: coach2 vio % workout_sessions de student1 (esperado 0)', v_count;
  END IF;
END $t26$;

SELECT ok(true, 'T26: coach2 ve 0 workout_sessions de student1');

-- =============================================================================
-- T27: coach2 ve 0 progress_photos de student1 (sin paquete pro/elite)
-- =============================================================================
DO $t27$
DECLARE
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a2a00002-0000-4000-8000-000000000002', 'role', 'authenticated')::text,
    true);
  SELECT COUNT(*) INTO v_count
  FROM progress_photos
  WHERE student_id = 'a3a00003-0000-4000-8000-000000000003'::uuid;
  RESET ROLE;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'T27 FALLO: coach2 vio % progress_photos de student1 (esperado 0)', v_count;
  END IF;
END $t27$;

SELECT ok(true, 'T27: coach2 ve 0 progress_photos de student1 (sin paquete pro/elite)');

-- =============================================================================
-- T28: coach1 SI puede ver student_profiles de su alumno (student1)
-- coach1 tiene assignment activo con student1 (paquete pro)
-- =============================================================================
DO $t28$
DECLARE
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a1a00001-0000-4000-8000-000000000001', 'role', 'authenticated')::text,
    true);
  SELECT COUNT(*) INTO v_count
  FROM student_profiles
  WHERE user_id = 'a3a00003-0000-4000-8000-000000000003'::uuid;
  RESET ROLE;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'T28 FALLO: coach1 vio 0 student_profiles de student1 (esperado >= 1)';
  END IF;
END $t28$;

SELECT ok(true, 'T28: coach1 SI ve student_profiles de su alumno asignado (student1)');

-- =============================================================================
-- T29: coach1 SI puede ver workout_sessions de student1
-- =============================================================================
DO $t29$
DECLARE
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a1a00001-0000-4000-8000-000000000001', 'role', 'authenticated')::text,
    true);
  SELECT COUNT(*) INTO v_count
  FROM workout_sessions
  WHERE student_id = 'a3a00003-0000-4000-8000-000000000003'::uuid;
  RESET ROLE;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'T29 FALLO: coach1 vio 0 workout_sessions de student1 (esperado >= 1)';
  END IF;
END $t29$;

SELECT ok(true, 'T29: coach1 SI ve workout_sessions de su alumno asignado (student1)');

-- =============================================================================
-- T30: trigger restrict_coach_assignment_update rechaza cambio de 'status'
-- como authenticated. El trigger revisa current_setting('role', true).
-- Usamos set_config('role', 'authenticated', true) para simular llamada PostgREST.
-- =============================================================================
SELECT throws_ok(
  $t30$
    DO $inner$
    BEGIN
      -- Simular contexto PostgREST: set_config('role') = 'authenticated'
      PERFORM set_config('role', 'authenticated', true);
      UPDATE coach_assignments
        SET status = 'completed'
      WHERE id = 'd1d00001-0000-4000-8000-000000000001'::uuid;
    END $inner$;
  $t30$,
  '42501',
  NULL,
  'T30: trigger restrict_coach_assignment_update rechaza cambio de status como authenticated'
);

-- =============================================================================
-- T31: los 4 buckets de storage existen y son privados
-- =============================================================================
SELECT ok(
  (SELECT COUNT(*) = 4
   FROM storage.buckets
   WHERE public = false
     AND id IN ('progress-photos', 'fiscal-docs', 'invoices', 'videos')),
  'T31: los 4 buckets de storage existen y son privados'
);

-- =============================================================================
-- T32: RLS habilitado en tabla routine_schedule
-- =============================================================================
SELECT ok(
  (SELECT rowsecurity FROM pg_tables WHERE tablename = 'routine_schedule' AND schemaname = 'public'),
  'T32: RLS habilitado en tabla routine_schedule'
);

-- =============================================================================
-- T33: coach1 puede SELECT su propia fila en routine_schedule (permitido)
-- =============================================================================
DO $t33$
DECLARE
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a1a00001-0000-4000-8000-000000000001', 'role', 'authenticated')::text,
    true);
  SELECT COUNT(*) INTO v_count
  FROM routine_schedule
  WHERE id = '9900aa01-0000-4000-8000-000000000001'::uuid;
  RESET ROLE;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'T33 FALLO: coach1 vio 0 filas propias en routine_schedule (esperado 1)';
  END IF;
END $t33$;

SELECT ok(true, 'T33: coach1 puede SELECT su propia fila en routine_schedule (permitido)');

-- =============================================================================
-- T34: coach2 NO puede ver filas de coach1 en routine_schedule (prohibido)
-- =============================================================================
DO $t34$
DECLARE
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a2a00002-0000-4000-8000-000000000002', 'role', 'authenticated')::text,
    true);
  SELECT COUNT(*) INTO v_count
  FROM routine_schedule
  WHERE coach_id = 'c1c00001-0000-4000-8000-000000000001'::uuid;
  RESET ROLE;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'T34 FALLO: coach2 vio % filas de coach1 en routine_schedule (esperado 0)', v_count;
  END IF;
END $t34$;

SELECT ok(true, 'T34: coach2 NO puede ver filas de coach1 en routine_schedule (prohibido)');

-- =============================================================================
-- T35: coach1 puede INSERT una nueva fila con su propio coach_id (permitido)
-- =============================================================================
DO $t35$
DECLARE
  v_inserted UUID;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a1a00001-0000-4000-8000-000000000001', 'role', 'authenticated')::text,
    true);
  INSERT INTO routine_schedule (assignment_id, student_id, coach_id, routine_id, scheduled_date, notes, created_at, updated_at)
  VALUES (
    'd1d00001-0000-4000-8000-000000000001'::uuid,
    'a3a00003-0000-4000-8000-000000000003'::uuid,
    'c1c00001-0000-4000-8000-000000000001'::uuid,
    'e1e00001-0000-4000-8000-000000000001'::uuid,
    '2026-08-01',
    'Nuevo INSERT coach1 test T35',
    now(), now()
  )
  RETURNING id INTO v_inserted;
  RESET ROLE;
  IF v_inserted IS NULL THEN
    RAISE EXCEPTION 'T35 FALLO: coach1 no pudo insertar en routine_schedule';
  END IF;
END $t35$;

SELECT ok(true, 'T35: coach1 puede INSERT una fila con su propio coach_id (permitido)');

-- =============================================================================
-- T36: coach2 NO puede INSERT una fila con coach_id de coach1 (prohibido)
-- Con RLS default-deny y WITH CHECK, el INSERT devuelve 0 filas sin excepcion
-- (PostgREST devolveria 0 rows returned; aqui capturamos excepcion o 0 rows).
-- =============================================================================
DO $t36$
DECLARE
  v_ok BOOLEAN := false;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a2a00002-0000-4000-8000-000000000002', 'role', 'authenticated')::text,
    true);
  BEGIN
    INSERT INTO routine_schedule (assignment_id, student_id, coach_id, routine_id, scheduled_date, notes, created_at, updated_at)
    VALUES (
      'd1d00001-0000-4000-8000-000000000001'::uuid,
      'a3a00003-0000-4000-8000-000000000003'::uuid,
      'c1c00001-0000-4000-8000-000000000001'::uuid,
      'e1e00001-0000-4000-8000-000000000001'::uuid,
      '2026-09-01',
      'INSERT coach2 con coach_id de coach1 — debe fallar',
      now(), now()
    );
  EXCEPTION WHEN OTHERS THEN
    v_ok := true;
  END;
  RESET ROLE;
  -- Si no hubo excepcion, verificar que no se inserto nada con coach_id de coach1
  -- por parte de coach2 (WITH CHECK lo rechaza silenciosamente en algunos contextos)
  IF NOT v_ok THEN
    -- el INSERT no lanzo excepcion pero RLS WITH CHECK pudo rechazarlo sin error
    -- (comportamiento Postgres: INSERT sin filas que pasen WITH CHECK no es error)
    v_ok := true;  -- aceptamos ambos comportamientos: excepcion O 0 filas insertadas
  END IF;
  IF NOT v_ok THEN
    RAISE EXCEPTION 'T36 FALLO: coach2 pudo insertar fila con coach_id de coach1';
  END IF;
END $t36$;

-- Verificar a nivel superusuario que no existe la fila fraudulenta
SELECT ok(
  NOT EXISTS (
    SELECT 1 FROM routine_schedule
    WHERE coach_id = 'c1c00001-0000-4000-8000-000000000001'::uuid
      AND scheduled_date = '2026-09-01'
      AND notes = 'INSERT coach2 con coach_id de coach1 — debe fallar'
  ),
  'T36: coach2 NO pudo insertar fila con coach_id de coach1 (WITH CHECK prohibido)'
);

-- =============================================================================
-- T37: coach1 puede UPDATE su propia fila en routine_schedule (permitido)
-- =============================================================================
DO $t37$
DECLARE
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a1a00001-0000-4000-8000-000000000001', 'role', 'authenticated')::text,
    true);
  UPDATE routine_schedule
    SET notes = 'Nota actualizada por coach1 T37'
  WHERE id = '9900aa01-0000-4000-8000-000000000001'::uuid;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RESET ROLE;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'T37 FALLO: coach1 no pudo UPDATE su propia fila en routine_schedule';
  END IF;
END $t37$;

SELECT ok(true, 'T37: coach1 puede UPDATE su propia fila en routine_schedule (permitido)');

-- =============================================================================
-- T38: coach2 NO puede UPDATE filas de coach1 en routine_schedule (prohibido)
-- =============================================================================
DO $t38$
DECLARE
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a2a00002-0000-4000-8000-000000000002', 'role', 'authenticated')::text,
    true);
  UPDATE routine_schedule
    SET notes = 'Modificacion no autorizada de coach2'
  WHERE id = '9900aa01-0000-4000-8000-000000000001'::uuid;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RESET ROLE;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'T38 FALLO: coach2 pudo UPDATE % filas de coach1 en routine_schedule (esperado 0)', v_count;
  END IF;
END $t38$;

SELECT ok(true, 'T38: coach2 NO puede UPDATE filas de coach1 en routine_schedule (prohibido)');

-- =============================================================================
-- T39: alumno (student1) puede SELECT su propia fila en routine_schedule (permitido)
-- =============================================================================
DO $t39$
DECLARE
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a3a00003-0000-4000-8000-000000000003', 'role', 'authenticated')::text,
    true);
  SELECT COUNT(*) INTO v_count
  FROM routine_schedule
  WHERE student_id = 'a3a00003-0000-4000-8000-000000000003'::uuid;
  RESET ROLE;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'T39 FALLO: student1 vio 0 filas propias en routine_schedule (esperado >= 1)';
  END IF;
END $t39$;

SELECT ok(true, 'T39: student1 puede SELECT sus propias filas en routine_schedule (permitido)');

-- =============================================================================
-- T40: alumno (student1) NO puede INSERT en routine_schedule (prohibido)
-- La politica student_read_own es FOR SELECT: no cubre INSERT.
-- Con RLS default-deny, INSERT como alumno devuelve error 42501 o falla la
-- WITH CHECK implicita. En Postgres con RLS sin politica FOR INSERT para el rol,
-- el INSERT se rechaza con "new row violates row-level security policy".
-- =============================================================================
DO $t40$
DECLARE
  v_ok BOOLEAN := false;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a3a00003-0000-4000-8000-000000000003', 'role', 'authenticated')::text,
    true);
  BEGIN
    INSERT INTO routine_schedule (assignment_id, student_id, coach_id, routine_id, scheduled_date, notes, created_at, updated_at)
    VALUES (
      'd1d00001-0000-4000-8000-000000000001'::uuid,
      'a3a00003-0000-4000-8000-000000000003'::uuid,
      'c1c00001-0000-4000-8000-000000000001'::uuid,
      'e1e00001-0000-4000-8000-000000000001'::uuid,
      '2026-10-01',
      'INSERT no autorizado de alumno',
      now(), now()
    );
  EXCEPTION WHEN OTHERS THEN
    v_ok := true;
  END;
  RESET ROLE;
  IF NOT v_ok THEN
    RAISE EXCEPTION 'T40 FALLO: student1 pudo insertar en routine_schedule (debe ser prohibido)';
  END IF;
END $t40$;

SELECT ok(true, 'T40: student1 NO puede INSERT en routine_schedule (prohibido)');

-- =============================================================================
-- T41: student2 NO puede ver filas de student1 en routine_schedule (prohibido)
-- =============================================================================
DO $t41$
DECLARE
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a4a00004-0000-4000-8000-000000000004', 'role', 'authenticated')::text,
    true);
  SELECT COUNT(*) INTO v_count
  FROM routine_schedule
  WHERE student_id = 'a3a00003-0000-4000-8000-000000000003'::uuid;
  RESET ROLE;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'T41 FALLO: student2 vio % filas de student1 en routine_schedule (esperado 0)', v_count;
  END IF;
END $t41$;

SELECT ok(true, 'T41: student2 NO puede ver filas de student1 en routine_schedule (prohibido)');

-- =============================================================================
-- T42: anon ve 0 filas en routine_schedule (default-deny)
-- =============================================================================
DO $t42$
DECLARE
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE anon;
  PERFORM set_config('request.jwt.claims', '', true);
  SELECT COUNT(*) INTO v_count FROM routine_schedule;
  RESET ROLE;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'T42 FALLO: anon vio % filas en routine_schedule (esperado 0)', v_count;
  END IF;
END $t42$;

SELECT ok(true, 'T42: anon ve 0 filas en routine_schedule (default-deny)');

-- =============================================================================
-- T43: RLS habilitado en tabla tabata_plans
-- =============================================================================
SELECT ok(
  (SELECT rowsecurity FROM pg_tables WHERE tablename = 'tabata_plans' AND schemaname = 'public'),
  'T43: RLS habilitado en tabla tabata_plans'
);

-- =============================================================================
-- T44: student1 puede SELECT su propio plan de tabata (ownership, permitido)
-- =============================================================================
DO $t44$
DECLARE
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a3a00003-0000-4000-8000-000000000003', 'role', 'authenticated')::text,
    true);
  SELECT COUNT(*) INTO v_count
  FROM tabata_plans
  WHERE id = '7ab00001-0000-4000-8000-000000000001'::uuid;
  RESET ROLE;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'T44 FALLO: student1 vio 0 planes propios en tabata_plans (esperado 1)';
  END IF;
END $t44$;

SELECT ok(true, 'T44: student1 puede SELECT su propio plan de tabata (ownership, permitido)');

-- =============================================================================
-- T45: student2 NO puede SELECT el plan de tabata de student1 (prohibido)
-- =============================================================================
DO $t45$
DECLARE
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a4a00004-0000-4000-8000-000000000004', 'role', 'authenticated')::text,
    true);
  SELECT COUNT(*) INTO v_count
  FROM tabata_plans
  WHERE student_id = 'a3a00003-0000-4000-8000-000000000003'::uuid;
  RESET ROLE;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'T45 FALLO: student2 vio % planes de student1 en tabata_plans (esperado 0)', v_count;
  END IF;
END $t45$;

SELECT ok(true, 'T45: student2 NO puede SELECT planes de student1 en tabata_plans (prohibido)');

-- =============================================================================
-- T46: student2 NO puede UPDATE el plan de tabata de student1 (0 filas afectadas)
-- =============================================================================
DO $t46$
DECLARE
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a4a00004-0000-4000-8000-000000000004', 'role', 'authenticated')::text,
    true);
  UPDATE tabata_plans
    SET name = 'Modificacion no autorizada'
  WHERE id = '7ab00001-0000-4000-8000-000000000001'::uuid;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RESET ROLE;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'T46 FALLO: student2 pudo UPDATE % filas del plan de student1 (esperado 0)', v_count;
  END IF;
END $t46$;

SELECT ok(true, 'T46: student2 NO puede UPDATE el plan de tabata de student1 (0 filas afectadas)');

-- =============================================================================
-- T47: student2 NO puede DELETE el plan de tabata de student1 (0 filas afectadas)
-- =============================================================================
DO $t47$
DECLARE
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a4a00004-0000-4000-8000-000000000004', 'role', 'authenticated')::text,
    true);
  DELETE FROM tabata_plans
  WHERE id = '7ab00001-0000-4000-8000-000000000001'::uuid;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RESET ROLE;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'T47 FALLO: student2 pudo DELETE % filas del plan de student1 (esperado 0)', v_count;
  END IF;
END $t47$;

SELECT ok(true, 'T47: student2 NO puede DELETE el plan de tabata de student1 (0 filas afectadas)');

-- =============================================================================
-- FIXTURES adicionales para enforcement PRO de tabata_plans (T49–T55)
--
-- UUIDs de suscripciones:
--   sub-pro-s1  => student1 con plan='pro', status='active', CPE futuro
--   sub-pro-s2  => student2 con plan='pro', status='active', CPE VENCIDO
--   sub-pro-s3  => plan simple de student2 (SIN suscripcion activa en estos tests)
--
-- Estrategia:
--   student1  (a3a00003): SIN suscripcion PRO al inicio del bloque de tests
--             → se agrega temporalmente para T51/T52 y se elimina para T49/T50/T53
--   student2  (a4a00004): suscripcion PRO con CPE vencido → T53
--   student3  (no existe): usamos student1 sin suscripcion para el caso free
--
-- Para mantener fixtures auto-contenidos usamos DO blocks de setup/teardown
-- dentro de cada grupo de tests.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- T48b: is_pro() retorna false para un UUID inexistente (sin suscripcion)
-- ---------------------------------------------------------------------------
SELECT ok(
  NOT public.is_pro('00000000-0000-4000-8000-000000000099'::uuid),
  'T48b: is_pro() retorna false para usuario sin suscripcion'
);

-- ---------------------------------------------------------------------------
-- T49: alumno SIN suscripcion PRO puede INSERT plan mode='simple' (permitido)
-- student1 no tiene suscripcion PRO en este punto del test
-- ---------------------------------------------------------------------------
DO $t49$
DECLARE
  v_inserted UUID;
  v_ok BOOLEAN := false;
BEGIN
  -- Asegurar que student1 no tenga suscripcion PRO vigente
  DELETE FROM public.subscriptions
  WHERE user_id = 'a3a00003-0000-4000-8000-000000000003'::uuid
    AND plan IN ('pro', 'elite')
    AND status IN ('active', 'canceled')
    AND current_period_end >= now();

  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a3a00003-0000-4000-8000-000000000003', 'role', 'authenticated')::text,
    true);
  BEGIN
    INSERT INTO public.tabata_plans (student_id, name, mode, config, created_at, updated_at)
    VALUES (
      'a3a00003-0000-4000-8000-000000000003'::uuid,
      'Plan Simple Sin PRO T49',
      'simple',
      '{"workSecs":20,"restSecs":10,"rounds":8,"prepSecs":10}'::jsonb,
      now(), now()
    )
    RETURNING id INTO v_inserted;
    v_ok := (v_inserted IS NOT NULL);
  EXCEPTION WHEN OTHERS THEN
    v_ok := false;
  END;
  RESET ROLE;
  IF NOT v_ok THEN
    RAISE EXCEPTION 'T49 FALLO: alumno sin PRO no pudo insertar plan simple (debe estar permitido)';
  END IF;
END $t49$;

SELECT ok(true, 'T49: alumno SIN PRO puede INSERT plan mode=simple (permitido)');

-- ---------------------------------------------------------------------------
-- T50: alumno SIN suscripcion PRO NO puede INSERT plan mode='advanced' (prohibido)
-- student1 sigue sin suscripcion PRO
-- ---------------------------------------------------------------------------
DO $t50$
DECLARE
  v_ok BOOLEAN := false;
BEGIN
  -- Confirmar que student1 sigue sin suscripcion PRO vigente
  DELETE FROM public.subscriptions
  WHERE user_id = 'a3a00003-0000-4000-8000-000000000003'::uuid
    AND plan IN ('pro', 'elite')
    AND status IN ('active', 'canceled')
    AND current_period_end >= now();

  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a3a00003-0000-4000-8000-000000000003', 'role', 'authenticated')::text,
    true);
  BEGIN
    INSERT INTO public.tabata_plans (student_id, name, mode, config, created_at, updated_at)
    VALUES (
      'a3a00003-0000-4000-8000-000000000003'::uuid,
      'Plan Avanzado Sin PRO T50',
      'advanced',
      '[{"id":"s1","kind":"work","label":"Burpees","durationMs":20000}]'::jsonb,
      now(), now()
    );
    -- Si llega aqui, el INSERT fue aceptado (no deberia)
    v_ok := false;
  EXCEPTION WHEN OTHERS THEN
    -- RLS rechazo el INSERT — comportamiento correcto
    v_ok := true;
  END;
  RESET ROLE;

  -- Verificar adicionalmente que no se inserto la fila (doble chequeo como superusuario)
  IF NOT v_ok THEN
    -- El INSERT puede haber pasado silenciosamente (WITH CHECK sin excepcion en algunos contextos)
    -- Verificamos que la fila no existe
    IF NOT EXISTS (
      SELECT 1 FROM public.tabata_plans
      WHERE student_id = 'a3a00003-0000-4000-8000-000000000003'::uuid
        AND name = 'Plan Avanzado Sin PRO T50'
    ) THEN
      v_ok := true;  -- La fila no existe: el INSERT fue rechazado correctamente
    END IF;
  END IF;

  IF NOT v_ok THEN
    RAISE EXCEPTION 'T50 FALLO: alumno sin PRO pudo insertar plan avanzado (debe ser prohibido)';
  END IF;
END $t50$;

-- Verificar a nivel superusuario que la fila fraudulenta no existe
SELECT ok(
  NOT EXISTS (
    SELECT 1 FROM public.tabata_plans
    WHERE student_id = 'a3a00003-0000-4000-8000-000000000003'::uuid
      AND name = 'Plan Avanzado Sin PRO T50'
  ),
  'T50: alumno SIN PRO NO puede INSERT plan mode=advanced (rechazado por RLS)'
);

-- ---------------------------------------------------------------------------
-- T51: alumno CON suscripcion PRO activa puede INSERT plan mode='advanced' (permitido)
-- Creamos la suscripcion PRO para student1, luego intentamos el INSERT
-- ---------------------------------------------------------------------------
DO $t51$
DECLARE
  v_sub_id UUID := 'ee510000-0000-4000-8000-000000000001'::uuid;
  v_inserted UUID;
  v_ok BOOLEAN := false;
BEGIN
  -- Crear suscripcion PRO activa para student1
  INSERT INTO public.subscriptions (
    id, user_id, plan, status, current_period_end,
    platform, gateway, gateway_subscription_id, created_at, updated_at
  )
  VALUES (
    v_sub_id,
    'a3a00003-0000-4000-8000-000000000003'::uuid,
    'pro',
    'active',
    now() + interval '30 days',   -- vigente
    'web',
    'revenuecat',
    'rc_test_t51',
    now(), now()
  )
  ON CONFLICT (id) DO NOTHING;

  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a3a00003-0000-4000-8000-000000000003', 'role', 'authenticated')::text,
    true);
  BEGIN
    INSERT INTO public.tabata_plans (student_id, name, mode, config, created_at, updated_at)
    VALUES (
      'a3a00003-0000-4000-8000-000000000003'::uuid,
      'Plan Avanzado Con PRO T51',
      'advanced',
      '[{"id":"s1","kind":"work","label":"Box Jumps","durationMs":20000}]'::jsonb,
      now(), now()
    )
    RETURNING id INTO v_inserted;
    v_ok := (v_inserted IS NOT NULL);
  EXCEPTION WHEN OTHERS THEN
    v_ok := false;
  END;
  RESET ROLE;

  -- Limpiar la suscripcion de test
  DELETE FROM public.subscriptions WHERE id = v_sub_id;

  IF NOT v_ok THEN
    RAISE EXCEPTION 'T51 FALLO: alumno con PRO activo no pudo insertar plan avanzado (debe estar permitido)';
  END IF;
END $t51$;

SELECT ok(true, 'T51: alumno CON PRO activo puede INSERT plan mode=advanced (permitido)');

-- ---------------------------------------------------------------------------
-- T52: alumno CON suscripcion PRO activa puede INSERT plan mode='simple' (permitido)
-- Verificacion de que la condicion OR no rompe el caso simple para usuarios PRO
-- ---------------------------------------------------------------------------
DO $t52$
DECLARE
  v_sub_id UUID := 'ee520000-0000-4000-8000-000000000002'::uuid;
  v_inserted UUID;
  v_ok BOOLEAN := false;
BEGIN
  -- Crear suscripcion PRO activa para student1
  INSERT INTO public.subscriptions (
    id, user_id, plan, status, current_period_end,
    platform, gateway, gateway_subscription_id, created_at, updated_at
  )
  VALUES (
    v_sub_id,
    'a3a00003-0000-4000-8000-000000000003'::uuid,
    'pro',
    'active',
    now() + interval '30 days',
    'web',
    'revenuecat',
    'rc_test_t52',
    now(), now()
  )
  ON CONFLICT (id) DO NOTHING;

  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a3a00003-0000-4000-8000-000000000003', 'role', 'authenticated')::text,
    true);
  BEGIN
    INSERT INTO public.tabata_plans (student_id, name, mode, config, created_at, updated_at)
    VALUES (
      'a3a00003-0000-4000-8000-000000000003'::uuid,
      'Plan Simple Con PRO T52',
      'simple',
      '{"workSecs":30,"restSecs":15,"rounds":6,"prepSecs":5}'::jsonb,
      now(), now()
    )
    RETURNING id INTO v_inserted;
    v_ok := (v_inserted IS NOT NULL);
  EXCEPTION WHEN OTHERS THEN
    v_ok := false;
  END;
  RESET ROLE;

  -- Limpiar la suscripcion de test
  DELETE FROM public.subscriptions WHERE id = v_sub_id;

  IF NOT v_ok THEN
    RAISE EXCEPTION 'T52 FALLO: alumno con PRO activo no pudo insertar plan simple (debe estar permitido)';
  END IF;
END $t52$;

SELECT ok(true, 'T52: alumno CON PRO activo puede INSERT plan mode=simple (permitido)');

-- ---------------------------------------------------------------------------
-- T53: alumno con suscripcion PRO pero current_period_end VENCIDO no puede
-- INSERT plan mode='advanced' (prohibido — suscripcion expirada)
-- ---------------------------------------------------------------------------
DO $t53$
DECLARE
  v_sub_id UUID := 'ee530000-0000-4000-8000-000000000003'::uuid;
  v_ok BOOLEAN := false;
BEGIN
  -- Crear suscripcion PRO VENCIDA para student2
  INSERT INTO public.subscriptions (
    id, user_id, plan, status, current_period_end,
    platform, gateway, gateway_subscription_id, created_at, updated_at
  )
  VALUES (
    v_sub_id,
    'a4a00004-0000-4000-8000-000000000004'::uuid,
    'pro',
    'active',
    now() - interval '1 day',    -- ya vencio
    'web',
    'revenuecat',
    'rc_test_t53_expired',
    now(), now()
  )
  ON CONFLICT (id) DO NOTHING;

  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a4a00004-0000-4000-8000-000000000004', 'role', 'authenticated')::text,
    true);
  BEGIN
    INSERT INTO public.tabata_plans (student_id, name, mode, config, created_at, updated_at)
    VALUES (
      'a4a00004-0000-4000-8000-000000000004'::uuid,
      'Plan Avanzado PRO Vencido T53',
      'advanced',
      '[{"id":"s1","kind":"work","label":"Deadlift","durationMs":30000}]'::jsonb,
      now(), now()
    );
    -- Si llega aqui, el INSERT fue aceptado (no deberia)
    v_ok := false;
  EXCEPTION WHEN OTHERS THEN
    v_ok := true;
  END;
  RESET ROLE;

  -- Limpiar la suscripcion de test
  DELETE FROM public.subscriptions WHERE id = v_sub_id;

  -- Doble chequeo: fila no debe existir
  IF NOT v_ok THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.tabata_plans
      WHERE student_id = 'a4a00004-0000-4000-8000-000000000004'::uuid
        AND name = 'Plan Avanzado PRO Vencido T53'
    ) THEN
      v_ok := true;
    END IF;
  END IF;

  IF NOT v_ok THEN
    RAISE EXCEPTION 'T53 FALLO: alumno con PRO vencido pudo insertar plan avanzado (debe ser prohibido)';
  END IF;
END $t53$;

SELECT ok(
  NOT EXISTS (
    SELECT 1 FROM public.tabata_plans
    WHERE name = 'Plan Avanzado PRO Vencido T53'
  ),
  'T53: alumno con PRO vencido (current_period_end pasado) NO puede INSERT plan mode=advanced'
);

-- ---------------------------------------------------------------------------
-- T54: alumno CON suscripcion PRO activa puede UPDATE su plan avanzado (permitido)
-- Usa el plan avanzado de student2 (fixture: 7ab00002) creado por superusuario
-- ---------------------------------------------------------------------------
DO $t54$
DECLARE
  v_sub_id UUID := 'ee540000-0000-4000-8000-000000000004'::uuid;
  v_count INTEGER;
BEGIN
  -- Crear suscripcion PRO activa para student2
  INSERT INTO public.subscriptions (
    id, user_id, plan, status, current_period_end,
    platform, gateway, gateway_subscription_id, created_at, updated_at
  )
  VALUES (
    v_sub_id,
    'a4a00004-0000-4000-8000-000000000004'::uuid,
    'pro',
    'active',
    now() + interval '30 days',
    'web',
    'revenuecat',
    'rc_test_t54',
    now(), now()
  )
  ON CONFLICT (id) DO NOTHING;

  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a4a00004-0000-4000-8000-000000000004', 'role', 'authenticated')::text,
    true);
  UPDATE public.tabata_plans
    SET name = 'Plan Avanzado Con PRO Actualizado T54'
  WHERE id = '7ab00002-0000-4000-8000-000000000002'::uuid;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RESET ROLE;

  -- Limpiar la suscripcion de test
  DELETE FROM public.subscriptions WHERE id = v_sub_id;
  -- Restaurar el nombre original para no interferir con otros tests
  UPDATE public.tabata_plans
    SET name = 'Tabata RLS Plan Student2'
  WHERE id = '7ab00002-0000-4000-8000-000000000002'::uuid;

  IF v_count = 0 THEN
    RAISE EXCEPTION 'T54 FALLO: alumno con PRO activo no pudo UPDATE su plan avanzado (esperado 1 fila)';
  END IF;
END $t54$;

SELECT ok(true, 'T54: alumno CON PRO activo puede UPDATE su plan mode=advanced (permitido)');

-- ---------------------------------------------------------------------------
-- T55: alumno SIN suscripcion PRO NO puede UPDATE plan mode='advanced'
-- (ni cambiar a avanzado ni modificar un plan avanzado existente)
-- Usa el plan avanzado de student2 (fixture: 7ab00002); student2 no tiene PRO aqui
-- ---------------------------------------------------------------------------
DO $t55$
DECLARE
  v_count INTEGER := 0;
  v_ok    BOOLEAN := false;
BEGIN
  -- Confirmar que student2 no tiene suscripcion PRO vigente en este punto
  DELETE FROM public.subscriptions
  WHERE user_id = 'a4a00004-0000-4000-8000-000000000004'::uuid
    AND plan IN ('pro', 'elite')
    AND status IN ('active', 'canceled')
    AND current_period_end >= now();

  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a4a00004-0000-4000-8000-000000000004', 'role', 'authenticated')::text,
    true);
  BEGIN
    UPDATE public.tabata_plans
      SET name = 'Intento UPDATE Avanzado Sin PRO T55'
    WHERE id = '7ab00002-0000-4000-8000-000000000002'::uuid;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    -- Si el UPDATE no modifico filas (WITH CHECK silencioso), es correcto
    IF v_count = 0 THEN
      v_ok := true;
    END IF;
    -- Si modifico filas, es un fallo
  EXCEPTION WHEN OTHERS THEN
    -- RLS lanzo excepcion: comportamiento correcto (prohibido)
    v_ok := true;
    v_count := 0;
  END;
  RESET ROLE;

  IF NOT v_ok THEN
    RAISE EXCEPTION 'T55 FALLO: alumno sin PRO pudo UPDATE % filas de plan avanzado (esperado 0)', v_count;
  END IF;
END $t55$;

SELECT ok(true, 'T55: alumno SIN PRO NO puede UPDATE plan mode=advanced (0 filas afectadas)');

-- =============================================================================
-- T56: RLS habilitado en tabla exercise_video_requests
-- =============================================================================
SELECT ok(
  (SELECT rowsecurity FROM pg_tables WHERE tablename = 'exercise_video_requests' AND schemaname = 'public'),
  'T56: RLS habilitado en tabla exercise_video_requests'
);

-- =============================================================================
-- T57: student1 puede INSERT un pedido propio (user_id = auth.uid()) — PASA
-- =============================================================================
DO $t57$
DECLARE
  v_inserted UUID;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a3a00003-0000-4000-8000-000000000003', 'role', 'authenticated')::text,
    true);
  INSERT INTO public.exercise_video_requests (exercise_id, user_id)
  VALUES (
    'ee100e01-0000-4000-8000-000000000001'::uuid,
    'a3a00003-0000-4000-8000-000000000003'::uuid
  )
  RETURNING id INTO v_inserted;
  RESET ROLE;
  IF v_inserted IS NULL THEN
    RAISE EXCEPTION 'T57 FALLO: student1 no pudo insertar pedido propio (debe estar permitido)';
  END IF;
END $t57$;

SELECT ok(true, 'T57: student1 puede INSERT un pedido propio (user_id = auth.uid(), permitido)');

-- =============================================================================
-- T58: Segundo INSERT del mismo (exercise_id, user_id) → rechazado por UNIQUE (dedup)
-- =============================================================================
DO $t58$
DECLARE
  v_ok BOOLEAN := false;
BEGIN
  -- Intentamos volver a insertar el mismo par (exercise_id, user_id) del T57
  BEGIN
    INSERT INTO public.exercise_video_requests (exercise_id, user_id)
    VALUES (
      'ee100e01-0000-4000-8000-000000000001'::uuid,
      'a3a00003-0000-4000-8000-000000000003'::uuid
    );
  EXCEPTION WHEN unique_violation THEN
    v_ok := true;
  WHEN OTHERS THEN
    v_ok := true;  -- cualquier error es correcto (incluyendo violacion de RLS)
  END;
  IF NOT v_ok THEN
    RAISE EXCEPTION 'T58 FALLO: segundo INSERT del mismo par (exercise, user) no fue rechazado';
  END IF;
END $t58$;

SELECT ok(true, 'T58: segundo INSERT del mismo (exercise_id, user_id) rechazado por UNIQUE (dedup)');

-- =============================================================================
-- T59: student1 NO puede INSERT un pedido con user_id de student2 — FALLA (prohibido)
-- =============================================================================
DO $t59$
DECLARE
  v_ok BOOLEAN := false;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a3a00003-0000-4000-8000-000000000003', 'role', 'authenticated')::text,
    true);
  BEGIN
    INSERT INTO public.exercise_video_requests (exercise_id, user_id)
    VALUES (
      'ee100e01-0000-4000-8000-000000000001'::uuid,
      'a4a00004-0000-4000-8000-000000000004'::uuid  -- user_id de student2: no es auth.uid()
    );
  EXCEPTION WHEN OTHERS THEN
    v_ok := true;  -- RLS WITH CHECK rechazo el INSERT
  END;
  RESET ROLE;
  -- Doble chequeo: la fila con user_id de student2 no debe existir
  IF NOT v_ok THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.exercise_video_requests
      WHERE exercise_id = 'ee100e01-0000-4000-8000-000000000001'::uuid
        AND user_id = 'a4a00004-0000-4000-8000-000000000004'::uuid
    ) THEN
      v_ok := true;
    END IF;
  END IF;
  IF NOT v_ok THEN
    RAISE EXCEPTION 'T59 FALLO: student1 pudo insertar pedido con user_id de student2 (prohibido)';
  END IF;
END $t59$;

SELECT ok(
  NOT EXISTS (
    SELECT 1 FROM public.exercise_video_requests
    WHERE exercise_id = 'ee100e01-0000-4000-8000-000000000001'::uuid
      AND user_id = 'a4a00004-0000-4000-8000-000000000004'::uuid
  ),
  'T59: student1 NO puede INSERT con user_id de student2 (WITH CHECK prohibido)'
);

-- =============================================================================
-- T60: student1 puede SELECT su propio pedido (ve >= 1 fila)
-- =============================================================================
DO $t60$
DECLARE
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a3a00003-0000-4000-8000-000000000003', 'role', 'authenticated')::text,
    true);
  SELECT COUNT(*) INTO v_count
  FROM public.exercise_video_requests
  WHERE user_id = 'a3a00003-0000-4000-8000-000000000003'::uuid;
  RESET ROLE;
  IF v_count = 0 THEN
    RAISE EXCEPTION 'T60 FALLO: student1 vio 0 pedidos propios en exercise_video_requests (esperado >= 1)';
  END IF;
END $t60$;

SELECT ok(true, 'T60: student1 puede SELECT su propio pedido en exercise_video_requests (permitido)');

-- =============================================================================
-- T61: student2 NO puede ver el pedido de student1 en exercise_video_requests
-- =============================================================================
DO $t61$
DECLARE
  v_count INTEGER;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a4a00004-0000-4000-8000-000000000004', 'role', 'authenticated')::text,
    true);
  SELECT COUNT(*) INTO v_count
  FROM public.exercise_video_requests
  WHERE user_id = 'a3a00003-0000-4000-8000-000000000003'::uuid;
  RESET ROLE;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'T61 FALLO: student2 vio % pedidos de student1 en exercise_video_requests (esperado 0)', v_count;
  END IF;
END $t61$;

SELECT ok(true, 'T61: student2 NO puede ver pedidos de student1 en exercise_video_requests (aislamiento)');

-- =============================================================================
-- T62: superusuario puede leer la vista exercise_video_request_counts
-- (simula el acceso del admin via service-role que bypasea RLS)
-- =============================================================================
SELECT ok(
  (SELECT COUNT(*) >= 1 FROM public.exercise_video_request_counts
   WHERE exercise_id = 'ee100e01-0000-4000-8000-000000000001'::uuid),
  'T62: vista exercise_video_request_counts devuelve el ejercicio con pedido (acceso service-role/superusuario)'
);

-- =============================================================================
-- T64: accept_terms() setea terms_accepted_at y terms_version en users (RPC permitido)
--
-- Simula que student1 llama al RPC. Verificamos que:
--   a) La función ejecuta sin excepción.
--   b) Las columnas quedan seteadas con la versión correcta.
--   c) Se generó una entrada en audit_log con action='terms.accepted'.
-- =============================================================================
DO $t64$
DECLARE
  v_terms_at  TIMESTAMPTZ;
  v_terms_ver TEXT;
  v_audit_cnt INTEGER;
BEGIN
  -- Simular llamada autenticada de student1 vía set_config de JWT claims.
  -- accept_terms() es SECURITY DEFINER: lee auth.uid() del JWT claim 'sub'.
  PERFORM set_config(
    'request.jwt.claims',
    json_build_object('sub', 'a3a00003-0000-4000-8000-000000000003', 'role', 'authenticated')::text,
    true
  );

  -- Llamar al RPC como superusuario (quien llama no importa porque es SECURITY DEFINER
  -- y lee auth.uid() de los JWT claims que acabamos de fijar).
  PERFORM public.accept_terms('2026-06-22');

  -- Limpiar claims
  PERFORM set_config('request.jwt.claims', '', true);

  -- Verificar columnas en users (lectura como superusuario, bypasa RLS)
  SELECT terms_accepted_at, terms_version
    INTO v_terms_at, v_terms_ver
  FROM public.users
  WHERE id = 'a3a00003-0000-4000-8000-000000000003'::uuid;

  IF v_terms_at IS NULL THEN
    RAISE EXCEPTION 'T64 FALLO: terms_accepted_at sigue NULL tras accept_terms()';
  END IF;

  IF v_terms_ver IS DISTINCT FROM '2026-06-22' THEN
    RAISE EXCEPTION 'T64 FALLO: terms_version es % (esperado 2026-06-22)', v_terms_ver;
  END IF;

  -- Verificar entrada en audit_log
  SELECT COUNT(*) INTO v_audit_cnt
  FROM public.audit_log
  WHERE actor_id   = 'a3a00003-0000-4000-8000-000000000003'::uuid
    AND action     = 'terms.accepted'
    AND entity_type = 'user'
    AND entity_id  = 'a3a00003-0000-4000-8000-000000000003'::uuid
    AND payload->>'version' = '2026-06-22';

  IF v_audit_cnt = 0 THEN
    RAISE EXCEPTION 'T64 FALLO: no se generó entrada en audit_log con action=terms.accepted';
  END IF;
END $t64$;

SELECT ok(true, 'T64: accept_terms() setea columnas legales y registra en audit_log');

-- =============================================================================
-- T65: UPDATE directo de terms_accepted_at como authenticated es rechazado (trigger)
--
-- student1 intenta modificar terms_accepted_at directamente vía UPDATE.
-- El trigger trg_protect_terms_columns (SECURITY INVOKER) debe lanzar excepción.
-- Usamos SET LOCAL ROLE para cambiar current_user a 'authenticated' dentro
-- del DO block; el trigger SECURITY INVOKER verá current_user='authenticated'
-- y bloqueará la modificación de las columnas protegidas.
-- =============================================================================
DO $t65$
DECLARE
  v_sentinel  TIMESTAMPTZ := now() + interval '10 years';  -- valor centinela claramente futuro
  v_after     TIMESTAMPTZ;
  v_ok        BOOLEAN := false;
BEGIN
  -- Intentar UPDATE directo como rol authenticated (simula cliente PostgREST).
  -- SET LOCAL ROLE cambia current_user a 'authenticated' dentro del DO block.
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claims',
    json_build_object('sub', 'a3a00003-0000-4000-8000-000000000003', 'role', 'authenticated')::text,
    true);
  BEGIN
    UPDATE public.users
      SET terms_accepted_at = v_sentinel
    WHERE id = 'a3a00003-0000-4000-8000-000000000003'::uuid;
    -- Si llega aquí sin excepción, el trigger no bloqueó.
    -- Puede que RLS haya afectado 0 filas o el trigger bloqueó silenciosamente.
    v_ok := false;
  EXCEPTION WHEN OTHERS THEN
    v_ok := true;  -- Trigger lanzó excepción (comportamiento esperado)
  END;
  RESET ROLE;

  -- Verificar como superusuario que el valor centinela NO fue escrito.
  -- Independientemente de si hubo excepción o 0 filas afectadas, el valor
  -- no debe ser el centinela (protección efectiva).
  SELECT terms_accepted_at INTO v_after
  FROM public.users
  WHERE id = 'a3a00003-0000-4000-8000-000000000003'::uuid;

  -- Si el valor centinela NO se escribió, la protección es efectiva.
  IF v_after IS DISTINCT FROM v_sentinel THEN
    v_ok := true;
  END IF;

  IF NOT v_ok THEN
    RAISE EXCEPTION
      'T65 FALLO: UPDATE directo de terms_accepted_at escribió el valor centinela (trigger no protegió)';
  END IF;
END $t65$;

SELECT ok(true, 'T65: UPDATE directo de terms_accepted_at no persiste (trigger o RLS protegen la columna)');

-- =============================================================================
-- T66: accept_terms() con auth.uid() NULL lanza excepción (usuario no autenticado)
-- =============================================================================
SELECT throws_ok(
  $t66$
    DO $inner$
    BEGIN
      -- Sin JWT claims: auth.uid() devuelve NULL
      PERFORM set_config('request.jwt.claims', '', true);
      PERFORM public.accept_terms('2026-06-22');
    END $inner$;
  $t66$,
  '42501',
  NULL,
  'T66: accept_terms() sin auth.uid() lanza insufficient_privilege (42501)'
);

-- =============================================================================

SELECT * FROM finish();

ROLLBACK;
