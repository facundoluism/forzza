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
- En mobile/session se agrego el plan visible del ejercicio actual (series, reps, descanso y notas) y aviso cuando se completan las series previstas.

## Evidencia

| Check | Resultado | Evidencia |
|---|---:|---|
| `pnpm --filter @forzza/core test` | PASS | 5 files, 49 tests passed; billing/gating 100% coverage |
| `pnpm typecheck` | PASS | Turbo typecheck: 6 successful, 6 total |
| `pnpm --filter mobile typecheck` | PASS | 0 TypeScript errors |
| `pnpm --filter web typecheck` | PASS | 0 TypeScript errors |
| `pnpm --filter web lint` | PASS | No ESLint warnings or errors |
| `pnpm --filter web build` | PASS | Build completed with placeholders and `NEXT_STANDALONE=false` |
| `pnpm smoke-test -- --url http://127.0.0.1:3001` | PASS | 30 PASS, 0 FAIL, 7 MANUAL_REQUIRED |
| `BASE_URL=http://127.0.0.1:3001 pnpm e2e` | PASS | 80 passed, 1 skipped |

## Smoke narrativo

PASS:

- Landing carga, muestra marca y CTA de coach.
- Upgrade PRO carga y expone plan PRO.
- Onboarding coach avanza por Cuenta -> Fiscal -> Bancario -> Perfil publico.
- Coach/cobros carga resumen de este mes y mes anterior.
- Admin/coaches carga tabs Pendientes/Aprobados/Rechazados/Suspendidos.
- Admin/liquidaciones carga KPIs "Por aprobar" y "Listas para transferir".
- Marketplace publico carga.

MANUAL_REQUIRED:

- Interaccion real de carga de factura: falta fixture de settlement visible.
- Accion admin "Marcar transferido": falta fixture de settlement aprobado.
- Checkout marketplace: falta fixture de coach aprobado con paquete activo.
- RLS: requiere Docker + `supabase start` + `pnpm test:rls`.
- Mercado Pago sandbox end-to-end: requiere credenciales MP y webhook tunnel.
- RevenueCat restore purchases: requiere productos sandbox App Store/Play.
- Mobile device smoke: requiere Expo instalado en simulador/dispositivo para Maestro.

## Notas

- El servidor en `127.0.0.1:3000` no correspondia a esta app web durante la validacion; se uso Next en `127.0.0.1:3001`.
- El build mantiene una advertencia de Supabase en Edge Runtime desde middleware; no bloquea build.
- `NEXT_STANDALONE=true` queda reservado para entornos que permiten symlinks o despliegues Docker.
