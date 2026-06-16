# Smoke test integral - 2026-06-16

## Alcance

Validacion enfocada en el flujo de negocio V1:

- Alumno: landing, upgrade PRO, marketplace publico.
- Coach: onboarding web, cobros, carga de factura con numero.
- Owner/admin: validacion de coaches, liquidaciones, aprobacion/rechazo de factura y cola de transferencia.
- Core: reglas puras de billing/gating.
- Web: build, typecheck, lint y Playwright.

## Cambios cubiertos

- Se agrego `admin/liquidaciones` para que owner vea facturas de coaches, apruebe/rechace y marque transferencia.
- Se agrego `api/admin/settlements/[id]` con acciones `approve`, `reject`, `transfer` y `audit_log`.
- Se corrigio `api/coach/settlements/[id]/invoice`: ahora resuelve `coach_profiles.id` antes de filtrar `settlements.coach_id`.
- La carga de factura de coach ahora exige `invoice_number`.
- Se agrego migracion `20260616000001_settlement_approval_flow.sql` con estados `approved/rejected`, motivo de rechazo y trigger que impide `transferred` sin estado previo `approved`.
- `canTransferSettlement()` ahora requiere `status === "approved"` ademas de numero y archivo de factura.
- `scripts/smoke-test.js` ahora ejecuta smoke narrativo con Playwright y marca dependencias externas como `MANUAL_REQUIRED`.
- `NEXT_STANDALONE=true` queda opt-in para evitar fallo de symlinks `EPERM` en builds locales Windows.
- En mobile/session se corrigio el avance y logueo de sets para rutinas con ejercicios manuales o mixtos: ahora navega por la definicion completa de la rutina y registra cada set con una clave estable.
- En mobile/alumno se agrego previsualizacion de ficha desde la biblioteca antes de agregar un ejercicio, para que un usuario pueda entender ejecucion, musculos e info sin salir del armado de rutina.
- En mobile/home la "Rutina de hoy" ahora muestra resumen accionable inspirado en `forza-complete.jsx`: ejercicios, series, minutos estimados, primeros ejercicios y CTA para ver la rutina y empezar, en vez de una tarjeta ciega.
- En mobile/session se agrego el plan visible del ejercicio actual (series, reps, descanso y notas) y aviso cuando se completan las series previstas.
- Se extrajo a `@forzza/core/workout` la logica pura de entrenamiento mobile: inicio de sesion, logueo de series, numeracion estable y payload offline para `workout_sessions`.
- `apps/mobile/stores/workoutStore.ts` ahora consume esa logica compartida y queda como wrapper de Zustand/AsyncStorage, reduciendo divergencia entre UI mobile y contrato Supabase.
- `apps/mobile/services/sync.ts` ahora usa `toWorkoutSessionUpsert()` de core para construir el upsert exacto de `workout_sessions`, incluyendo normalizacion de `routine_id` vacio a `null` para no perder entrenos libres o rutinas borradas.
- Se agrego `supabase/seed/smoke-flow.sql` con fixture integral: owner, coach aprobado, alumno, paquete PRO, pago Mercado Pago aprobado, assignment activo, rutina con ejercicios linkeados a biblioteca, sesion completada y liquidaciones en `pending_invoice`, `invoiced` y `approved`.
- El fixture smoke ahora guarda la sesion completada con los mismos `exercise_id` UUID de la rutina, para validar el flujo alumno rutina -> series -> historial sin IDs ficticios.
- `supabase/config.toml` ahora declara `db.seed.sql_paths` para cargar seeds base, ejercicios, descripciones y smoke fixture sin depender de `seed-demo.sql`.
- `scripts/smoke-test.js` valida por REST los datos del fixture cuando existen `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`; con `SMOKE_EXPECT_FIXTURES=1` o `--require-fixtures`, la ausencia de fixture pasa a FAIL.
- `scripts/smoke-test.js` ahora valida tambien `workout_sessions`: alumno correcto, rutina correcta, estado `completed`, `completed_at`, sets registrados y correspondencia entre `sets_data.exercise_id` y ejercicios linkeados de la rutina.
- Se agrego migracion `20260616000003_fix_coach_rls_profile_id.sql` para corregir policies que comparaban `coach_assignments.coach_id` contra `auth.uid()` en vez de `coach_profiles.id`.
- Se agregaron tests RLS para `auth_coach_profile_id()`, assignment activo coach-alumno y paquete pro/elite usando el fixture smoke.
- Se corrigio middleware web para redirigir rutas protegidas a `/login` o `/<locale>/login` en vez de `/auth/login`, compatible con route groups `(auth)` y `app/[locale]`.
- `scripts/smoke-test.js` ahora valida redirects de coach/admin a login cuando Supabase esta configurado; en dev placeholder lo reporta como `MANUAL_REQUIRED` porque el bypass es intencional.
- El login web real ahora redirige por rol: owner a `/admin/dashboard`, coach a `/coach`, evitando que un owner autenticado caiga en una ruta de coach bloqueada.
- El browser smoke ahora inicia sesion con `coach.smoke@forzza.app` y `owner.smoke@forzza.app` cuando Supabase esta configurado, y valida cobros/liquidaciones en contextos separados.
- Se agrego migracion `20260616000004_add_assignment_routine_link.sql` para que `coach_assignments.routine_id` represente la rutina asignada actualmente al alumno.
- El API `POST /api/coach/rutinas` ahora, despues de crear la rutina, vincula el assignment activo del alumno con `routine_id`, cerrando el flujo coach crea/asigna rutina -> ficha del alumno muestra rutina asignada.
- El fixture y smoke REST validan que el assignment pagado activo apunta a la rutina smoke.
- Se corrigio el redirect raiz de admin localizado para que `app/[locale]/admin/page.tsx` compile con `@/i18n/navigation`.
- Se corrigio middleware web para proteger `/coach` como segmento exacto sin bloquear `/coaches`, manteniendo marketplace publico.
- Se habilito Supabase local en CSP `connect-src` para smoke auth contra `127.0.0.1:54321`.
- El seed smoke completa tokens auth vacios para evitar 500 de GoTrue local en password login.
- El input de numero de factura en coach/cobros ahora tiene `aria-label`, y el smoke valida esa accesibilidad.
- El smoke ya no marca RLS como manual porque la suite se ejecuta aparte con `pnpm test:rls`.
- Se actualizo el smoke mobile Maestro `e2e/flows/03-workout-session.yaml` para usar el alumno fixture: login, rutina asignada, ficha del ejercicio, carga de series, descanso y finalizacion.
- Se agregaron `testID`/labels estables en mobile y UI native para que el flujo no dependa de textos visuales fragiles.
- `package.json` agrega `pnpm smoke-test:mobile`.

## Evidencia

| Check | Resultado | Evidencia |
|---|---:|---|
| `pnpm --filter @forzza/core test` | PASS | 6 files, 55 tests passed; incluye workout mobile start/log/finish y upsert sync |
| `pnpm typecheck` | PASS | Turbo typecheck: 6 successful, 6 total |
| `pnpm --filter mobile typecheck` | PASS | 0 TypeScript errors |
| mobile locales JSON parse | PASS | `es.json` y `en.json` parsean con `ConvertFrom-Json` |
| `pnpm --filter @forzza/core typecheck` | PASS | 0 TypeScript errors |
| `pnpm --filter web typecheck` | PASS | 0 TypeScript errors |
| `pnpm --filter @forzza/db-types typecheck` | PASS | 0 TypeScript errors |
| `pnpm --filter web lint` | PASS | No ESLint warnings or errors |
| `pnpm --filter web build` | PASS | Build completed with placeholders and `NEXT_STANDALONE=false` |
| `pnpm smoke-test -- --url http://127.0.0.1:3001` | PASS | 30 PASS, 0 FAIL, 7 MANUAL_REQUIRED |
| `BASE_URL=http://127.0.0.1:3001 pnpm e2e` | PASS | 80 passed, 1 skipped |
| `supabase db reset` | PASS | Aplica migraciones y seeds base + `smoke-flow.sql` |
| `pnpm smoke-test:fixtures -- --url http://localhost:3105` | PASS | 45 PASS, 0 FAIL, 3 MANUAL_REQUIRED |
| `node --check scripts/smoke-test.js` | PASS | Sintaxis JS valida |
| `git diff --check` smoke/fixture files | PASS | Sin whitespace errors |
| `pnpm typecheck` | PASS | Turbo typecheck: 6 successful, 6 total |
| `pnpm test:rls` | PASS | Supabase local: 1 file, 32 RLS tests passed |
| `supabase test db` | PASS | Ejecutado via `pnpm test:rls`; cubre `supabase/tests/rls_test.sql` |
| `supabase db lint` | PASS | No schema errors found |
| `pnpm --filter web typecheck` | PASS | 0 TypeScript errors; corrido fuera del sandbox por EPERM en node_modules |
| `node --check scripts/smoke-test.js` | PASS | Browser smoke autenticado tiene sintaxis valida |
| `pnpm --filter mobile typecheck` | PASS | 0 TypeScript errors despues de IDs/accessibility mobile |
| `pnpm --filter @forzza/ui typecheck` | PASS | 0 TypeScript errors despues de `Card`/`Sheet` testID |
| `pnpm smoke-test:mobile` | PENDING_ENV | Maestro no esta instalado en esta maquina; requiere simulador/dispositivo Expo |

## Smoke narrativo

PASS:

- Landing carga, muestra marca y CTA de coach.
- Upgrade PRO carga y expone plan PRO.
- Onboarding coach avanza por Cuenta -> Fiscal -> Bancario -> Perfil publico.
- Coach/cobros carga resumen de este mes y mes anterior.
- Coach/cobros muestra numero de factura accesible antes de subir factura.
- Admin/coaches carga tabs Pendientes/Aprobados/Rechazados/Suspendidos.
- Admin/liquidaciones carga KPIs "Por aprobar" y "Listas para transferir".
- Admin/liquidaciones permite marcar una factura aprobada como transferida con fixture local.
- Marketplace publico carga.
- Marketplace publico muestra al menos un coach aprobado del fixture.

MANUAL_REQUIRED:

- Mercado Pago sandbox end-to-end: requiere credenciales MP y webhook tunnel.
- RevenueCat restore purchases: requiere productos sandbox App Store/Play.
- Mobile device smoke: requiere Expo instalado en simulador/dispositivo para Maestro.

## Notas

- El servidor en `127.0.0.1:3000` no correspondia a esta app web durante la validacion; se uso Next en `127.0.0.1:3001`.
- Una corrida posterior de `pnpm smoke-test` sin `--url` termino por timeout y no se toma como evidencia; repetir con web levantada y URL explicita.
- La corrida verde final uso Supabase local reseteado y Next en `http://localhost:3105`.
- El build mantiene una advertencia de Supabase en Edge Runtime desde middleware; no bloquea build.
- `NEXT_STANDALONE=true` queda reservado para entornos que permiten symlinks o despliegues Docker.
