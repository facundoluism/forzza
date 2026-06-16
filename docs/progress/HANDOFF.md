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
- `apps/web/middleware.ts` protege `/coach` como segmento exacto y deja publico `/coaches` marketplace.
- `apps/web/next.config.ts` permite Supabase local en CSP `connect-src` para smoke auth local.
- `supabase/seed/smoke-flow.sql` completa tokens auth vacios para que GoTrue local pueda autenticar usuarios smoke.
- `apps/web/app/[locale]/coach/cobros/InvoiceUploadButton.tsx` agrega label accesible al numero de factura.
- `scripts/smoke-test.js` valida fixtures REST, login coach/owner, cobros, liquidaciones admin y marketplace con 0 FAIL.
- `e2e/flows/03-workout-session.yaml` queda convertido en smoke mobile real con alumno fixture: login, rutina de hoy, ficha de ejercicio, inicio de entreno, carga de series, descanso y finalizacion.
- `apps/mobile` agrega IDs/accesibilidad para login, rutina de hoy, detalle de rutina y sesion de entrenamiento.
- `packages/ui/native` propaga `testID` en `Card` clickeable y `Sheet`, para que Maestro pueda tocar tarjetas y validar fichas.
- `package.json` agrega `pnpm smoke-test:mobile`.
- Android local quedo instalado: Java 17, Maestro 2.6.1, Android SDK, AVD `forzza_pixel`, app debug instalada y Metro sirviendo bundle.
- `e2e/flows/03-workout-session.yaml` ahora abre Expo dev-client con deep link `forzza://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A8081`.
- `apps/mobile/metro.config.js` fue ajustado para Windows/pnpm: watch folders acotados, blocklist de `android/build` y fallback de imports `.js`.
- `apps/mobile/app/_layout.tsx` y `providers/AuthProvider.tsx` tienen guardas para no quedarse en splash/pantalla negra durante bootstrap.
- `apps/mobile/app/routine/[id].tsx` usa `routine.student_id` como fallback para iniciar entrenamiento si `AuthContext.user` todavia no hidrato.

## Validacion ejecutada

- `pnpm --filter @forzza/core test`: PASS, 6 files, 55 tests.
- `pnpm --filter mobile typecheck`: PASS.
- mobile locales JSON parse: PASS.
- `pnpm --filter @forzza/core typecheck`: PASS.
- `pnpm --filter @forzza/db-types typecheck`: PASS.
- `pnpm --filter web typecheck`: PASS.
- `node --check scripts/smoke-test.js`: PASS.
- `git diff --check` sobre archivos tocados: PASS.
- `pnpm test:rls`: PASS, 32 tests RLS.
- `supabase db lint`: PASS, no schema errors.
- `supabase db reset`: PASS, aplica migraciones y seeds incluyendo `smoke-flow.sql`.
- `pnpm smoke-test:fixtures -- --url http://localhost:3105`: PASS, 45 PASS, 0 FAIL, 3 MANUAL_REQUIRED.
- `pnpm --filter mobile typecheck`: PASS despues de IDs mobile.
- `pnpm --filter @forzza/ui typecheck`: PASS.
- `package.json` parse: PASS.
- `pnpm --filter mobile typecheck`: PASS despues de fixes de bootstrap/routine.
- `maestro check-syntax e2e/flows/03-workout-session.yaml`: PASS.
- `git diff --check`: PASS.
- `pnpm smoke-test:mobile`: PARTIAL/BLOCKED_ENV. Maestro llego a pasar login, rutina de hoy, detalle de rutina y ficha de ejercicio. La ejecucion completa queda bloqueada por inestabilidad local de Maestro (`gRPC UNAVAILABLE`/lock en `C:\Users\Facu\.maestro\sessions`) y por corrida posterior que volvio a fallar al primer render cuando el lock reaparecio.

## A medias / pendiente

- `pnpm smoke-test:mobile` no queda verde aun por ENTORNO, no por la app. Verificado por el orquestador (Opus):
  - La cadena login → rutina de hoy → detalle de rutina → ficha de ejercicio → iniciar entreno PASA de verdad contra Supabase local (Metro con env override a http://localhost:54321 via `adb reverse tcp:54321`).
  - Bug REAL del flow encontrado y corregido: los `inputText` no tapeaban el campo destino → email+password caian ambos en el campo email (login "Invalido"). Fix: `tapOn` explícito por campo en `e2e/flows/03-workout-session.yaml`.
  - Causa raíz de la intermitencia: el HOST queda con ~1-2 GB libres (qemu + Docker/WSL + Metro + Edge + tooling) y el emulador llega a ANR ("Pixel Launcher isn't responding"), tirando el driver de Maestro (gRPC UNAVAILABLE / lock en `.maestro/sessions`). Para pase verde estable: liberar RAM del host o dar más RAM al AVD, luego repetir.
  - Pendiente puntual: tras "iniciar entreno" el assert `reps-input` no se pudo aislar por la inestabilidad del emulador (revisar autopromo/entitlements en `session.tsx` en una corrida estable).
- Mercado Pago sandbox end-to-end y RevenueCat sandbox siguen fuera del entorno local automatizado.
- BLOQUEANTE PUBLICACION (§3): `apps/mobile/app/upgrade.tsx` activa PRO abriendo el checkout web de Mercado Pago (`mp-create-preapproval` + `Linking.openURL`) en vez de IAP RevenueCat. `services/revenuecat.ts` es un stub (SDK no instalado). Apple/Google rechazan apps que cobran suscripciones digitales fuera de su IAP. Debe migrarse a RevenueCat antes de subir a tiendas.

## Proximos 3 pasos exactos

1. Reiniciar emulador/host Maestro, verificar que no haya locks en `C:\Users\Facu\.maestro\sessions`, calentar Metro y repetir `pnpm smoke-test:mobile`.
2. Probar Mercado Pago sandbox end-to-end con credenciales y webhook tunnel.
3. Probar RevenueCat restore purchases con productos sandbox App Store/Play.

## HUMAN_REQUIRED

- Credenciales sandbox Mercado Pago y webhook tunnel para checkout real.
- Estabilizar entorno Maestro local: el AVD y app ya estan, pero el driver queda con lock/gRPC unavailable tras corridas largas.
- Productos sandbox App Store/Play para RevenueCat.

## Prompt para retomar

Continuar el objetivo activo de Forzza desde `docs/progress/HANDOFF.md`: estabilizar y cerrar `pnpm smoke-test:mobile` (Maestro/AVD ya instalado; revisar lock `C:\Users\Facu\.maestro\sessions`), luego Mercado Pago sandbox y RevenueCat sandbox; smoke web/fixture/RLS local ya estan verdes.
