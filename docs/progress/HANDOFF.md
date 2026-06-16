# Forzza handoff - 2026-06-16

## Fase actual

Smoke integral y cierre de brechas V1 entre mobile, web coach/admin, Supabase y flujo de negocio.

## Hecho en esta tanda

- Se agrego `packages/core/src/workout/index.ts` con logica pura para sesiones mobile: iniciar rutina, loguear series y finalizar con payload offline compatible con `workout_sessions`.
- Se agrego `packages/core/src/workout/workout.test.ts` con casos de inicio, sets incrementales, ejercicios manuales y payload final de sync.
- Se agrego `toWorkoutSessionUpsert()` para que mobile y core compartan el contrato exacto de `workout_sessions`, normalizando `routine_id` vacio a `null`.
- `packages/core/src/index.ts` exporta `workout`.
- `apps/mobile/stores/workoutStore.ts` usa las funciones de core y queda como wrapper Zustand/AsyncStorage.
- `apps/mobile/services/sync.ts` usa el helper de core para construir el upsert antes de llamar a Supabase.
- `apps/mobile/app/(tabs)/index.tsx` muestra la rutina de hoy como mini-plan: ejercicios, series, minutos estimados, primeros ejercicios y CTA para empezar.
- `supabase/seed/smoke-flow.sql` ahora crea `workout_sessions.sets_data` con los mismos UUID de ejercicios que la rutina smoke.
- `scripts/smoke-test.js` valida que la sesion completada del alumno corresponda a la rutina y tenga sets registrados.
- `supabase/migrations/20260616000004_add_assignment_routine_link.sql` agrega `coach_assignments.routine_id` para representar la rutina asignada actualmente.
- `POST /api/coach/rutinas` vincula el assignment activo con la rutina creada.
- `scripts/smoke-test.js` valida que el assignment smoke pagado y activo apunte a la rutina smoke.
- `apps/web/app/[locale]/admin/page.tsx` corrige redirect localizado para compilar con `@/i18n/navigation`.
- `docs/progress/smoke-test-integral-2026-06-16.md` registra la nueva cobertura mobile/core.

## Validacion ejecutada

- `pnpm --filter @forzza/core test`: PASS, 6 files, 55 tests.
- `pnpm --filter mobile typecheck`: PASS.
- mobile locales JSON parse: PASS.
- `pnpm --filter @forzza/core typecheck`: PASS.
- `pnpm --filter @forzza/db-types typecheck`: PASS.
- `pnpm --filter web typecheck`: PASS.
- `node --check scripts/smoke-test.js`: PASS.
- `git diff --check` sobre archivos tocados: PASS.
- `pnpm test:rls`: BLOCKED_ENV, Postgres local `127.0.0.1:54322` rechazo conexion.

## A medias / pendiente

- No se corrio `supabase test db`: requiere Docker/Supabase local.
- No se corrio `pnpm smoke-test:fixtures`: requiere `supabase db reset` o seed local con credenciales.
- No se hizo smoke mobile en dispositivo/simulador Expo; el flujo queda cubierto por core test y typecheck, pero falta validacion interactiva.
- No se hizo commit WIP porque el worktree tiene cambios mezclados y algunos parecen previos/no relacionados.

## Proximos 3 pasos exactos

1. Levantar Supabase local y correr `pnpm test:rls` / `supabase test db` para validar policies con fixture smoke.
2. Correr `pnpm smoke-test:fixtures` con `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` contra la instancia seed.
3. Ejecutar smoke mobile manual/Expo: alumno entra, ve rutina, abre ficha de ejercicio, carga sets, completa sesion y verifica que queda en cola/sync.

## HUMAN_REQUIRED

- Docker/Supabase local o credenciales de staging para fixtures.
- Credenciales sandbox Mercado Pago y webhook tunnel para checkout real.
- Entorno Expo/simulador o dispositivo para smoke mobile interactivo.

## Prompt para retomar

Continuar el objetivo activo de Forzza desde `docs/progress/HANDOFF.md`: validar Supabase/RLS con fixture smoke, correr smoke fixtures y cerrar smoke mobile interactivo.
