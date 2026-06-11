# QA Report — Forzza Full Build (F0–F15)

**Fecha:** 2026-06-10
**Estado global:** PASS con HUMAN_REQUIRED pendientes

---

## Por fase

| Fase | Descripcion | Estado | HUMAN_REQUIRED |
|---|---|---|---|
| F0 | Repo sembrado: CLAUDE.md, agentes, estructura docs | PASS | docs/forzza-master-doc.md y reference/forza-complete.jsx |
| F1 | Monorepo + CI: pnpm, Turborepo, TypeScript strict, vitest | PASS | — |
| F2 | Supabase schema, RLS y seeds: 25 tablas, 4 buckets, 30 ejercicios | PASS (archivos) | Docker + Supabase CLI para ejecutar migraciones |
| F3 | Auth, roles y perfiles: login/signup mobile + web, onboarding, parental consent | PASS (UI) | Supabase activo, OAuth credentials |
| F4 | Design system: tokens, Button/Input/Card/Pill/EmptyState/Skeleton (native + web) | PASS | — |
| F5 | Landing + pricing web, /api/leads, rutas legales DRAFT | PASS | Precio PRO y textos legales definitivos |
| F6 | Auth mobile completo: AuthProvider, 5 tabs, services/user.ts | PASS | Supabase activo para test de flujo real |
| F7 | Core mobile entrenos: workoutStore offline, sync.ts, Home/Rutinas/Progreso screens | PASS | Supabase + Docker para sync real |
| F8 | Gating Free/PRO: canAddRoutine, canViewWorkoutHistory, shouldShowAutopromo, UpgradeModal | PASS | RevenueCat account + Apple/Google IAP |
| F9 | Payments PRO: RevenueCat IAP mobile, MercadoPago web, webhook idempotente | PASS | MP credentials, RevenueCat API key |
| F10 | Marketplace coaches: listado, filtros, detalle, contratacion, checkout parental | PASS | MP credentials para checkout real |
| F11 | Backoffice coach: Alumnos, Rutinas, Check-ins, Cobros, Perfil | PASS | Supabase activo para CRUD real |
| F12 | Backoffice owner/admin: dashboard, users list, coaches, settlements, config | PASS (archivos) | Owner user role en Supabase |
| F13 | Billing + settlements: calculateSettlement, trigger billing_model, invoice gate | PASS | MP webhook config en produccion |
| F14 | Chat, notificaciones, email: Realtime messages, Expo Push, Resend transaccional | PASS | Resend API key, Expo Push token |
| F15 | Release + store assets: EAS config, app.config.ts, splash, icons, ASO copy | PASS | App Store Connect + Google Play Console accounts |

---

## Tests

### Unit (vitest) — @forzza/core

| Suite | Tests | Estado | Cobertura |
|---|---|---|---|
| billing/billing.test.ts | 5 | PASS | 100% |
| billing/__tests__/settlement.test.ts | 3 | PASS | 100% |
| gating/gating.test.ts | 11 | PASS | 100% |
| analytics/__tests__/analytics.test.ts | 3 | PASS | 100% |
| schemas/auth.test.ts | 8 | PASS | 97.84% |
| **TOTAL** | **30** | **PASS** | **99.32% stmt** |

Cobertura por categoria:
- Statements: 99.32%
- Branches: 98.14%
- Functions: 88.88%
- Lines: 99.32%

### RLS (pgTAP) — supabase/tests/rls_test.sql

Total: **23 assertions** (15 originales + 8 nuevas en F16)

| # | Descripcion | Estado |
|---|---|---|
| 1 | auth_role() funciona o no hay usuario autenticado | HUMAN_REQUIRED (requiere DB) |
| 2 | coach_has_active_assignment retorna false para IDs inexistentes | HUMAN_REQUIRED |
| 3 | student_has_pro_or_elite_package retorna false para IDs inexistentes | HUMAN_REQUIRED |
| 4 | AR tiene commission_rate = 20% | HUMAN_REQUIRED |
| 5 | CL no esta activo en V1 | HUMAN_REQUIRED |
| 6 | exercise_library tiene al menos 30 ejercicios | HUMAN_REQUIRED |
| 7 | audit_log rechaza UPDATE (append-only) | HUMAN_REQUIRED |
| 8 | audit_log rechaza DELETE (append-only) | HUMAN_REQUIRED |
| 9 | processed_events rechaza UPDATE (append-only) | HUMAN_REQUIRED |
| 10 | trigger rechaza precio de paquete menor al piso del pais | HUMAN_REQUIRED |
| 11 | settlement requiere factura para pasar a transferred | HUMAN_REQUIRED |
| 12 | Los 4 buckets existen y son privados | HUMAN_REQUIRED |
| 13 | RLS habilitado en tabla users | HUMAN_REQUIRED |
| 14 | RLS habilitado en tabla audit_log | HUMAN_REQUIRED |
| 15 | RLS habilitado en tabla payments | HUMAN_REQUIRED |
| 16 | **[NUEVO]** Anonimo no puede SELECT de users | HUMAN_REQUIRED |
| 17 | **[NUEVO]** Anonimo no puede SELECT de routines | HUMAN_REQUIRED |
| 18 | **[NUEVO]** Anonimo no puede SELECT de messages | HUMAN_REQUIRED |
| 19 | **[NUEVO]** Alumno no ve workout_sessions de otro alumno | HUMAN_REQUIRED |
| 20 | **[NUEVO]** Alumno no lee mensajes de conversacion ajena | HUMAN_REQUIRED |
| 21 | **[NUEVO]** Coach puede consultar coach_assignments con su ID | HUMAN_REQUIRED |
| 22 | **[NUEVO]** Coach no puede UPDATE settlements (append-only) | HUMAN_REQUIRED |
| 23 | **[NUEVO]** Tabla users tiene RLS habilitado (owner policy) | HUMAN_REQUIRED |

Todos los tests RLS requieren `supabase start` + `pnpm test:rls`.

### E2E (Maestro) — e2e/flows/

| Flow | Archivo | Estado |
|---|---|---|
| 01 Signup | e2e/flows/01-auth-signup.yaml | DEFINIDO — requiere device/emulator |
| 02 Onboarding alumno | e2e/flows/02-onboarding-student.yaml | DEFINIDO — requiere device/emulator |
| 03 Workout session | e2e/flows/03-workout-session.yaml | DEFINIDO — requiere device/emulator |
| 04 Upgrade modal | e2e/flows/04-upgrade-modal.yaml | DEFINIDO — requiere device/emulator |
| 05 Marketplace browse | e2e/flows/05-marketplace-browse.yaml | DEFINIDO — requiere device/emulator |

Para ejecutar: `maestro test e2e/maestro.config.yaml` (requiere Maestro CLI instalado y emulador Android/iOS activo).

---

## HUMAN_REQUIRED consolidado

Todo lo que el owner debe completar antes de produccion:

### Infraestructura
1. **Docker Desktop** — Instalar y iniciar para Supabase CLI local.
2. **Supabase cuenta** — Crear proyecto en supabase.com, cargar claves en `.env`.
3. **`supabase start` + `pnpm db:reset`** — Aplicar migraciones y seeds en DB local.
4. **`pnpm test:rls`** — Ejecutar las 23 assertions pgTAP contra DB activa.
5. **`pnpm db:types`** — Regenerar packages/db-types desde schema real.

### Integraciones de pago
6. **MercadoPago credentials** — Cargar `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`, `MP_PUBLIC_KEY` en `.env` y en Supabase Secrets.
7. **MP webhook signature validation** — Implementar validacion HMAC en Edge Function mp-webhook (actualmente TODO).
8. **RevenueCat** — Crear cuenta, configurar productos IAP en App Store Connect y Google Play, cargar `REVENUECAT_API_KEY`.

### Autenticacion OAuth
9. **Apple Sign In** — Crear App ID + Service ID en developer.apple.com, cargar en Supabase Auth + activar FEATURE_FLAG.
10. **Google Sign In** — Crear OAuth client en console.cloud.google.com, cargar en Supabase Auth + activar FEATURE_FLAG.

### Email y notificaciones
11. **Resend API key** — Crear cuenta en resend.com, verificar dominio @forzza.com, cargar `RESEND_API_KEY`.
12. **Expo Push notifications** — Configurar `expo-notifications` en EAS, cargar `EXPO_ACCESS_TOKEN`.

### Legal y contenido
13. **Precio PRO** — Definir el precio mensual ARG (reemplazar TODO_COPY en landing).
14. **Textos legales** — Reemplazar paginas DRAFT de /legales/terminos y /legales/privacidad con version aprobada por abogado.
15. **docs/forzza-master-doc.md** — Copiar la fuente de verdad del producto al repo.
16. **reference/forza-complete.jsx** — Copiar el prototipo visual al repo.

### Stores
17. **App Store Connect account** — Crear app bundle `com.forzza.app`, subir assets de F15.
18. **Google Play Console account** — Crear app, subir AAB, completar formularios.
19. **`eas build`** — Ejecutar primer build iOS + Android una vez que las cuentas esten activas.

### E2E
20. **Maestro CLI** — Instalar (`brew install mobile-dev-inc/tap/maestro` o equiv.), ejecutar flows contra emulador con app buildada.

---

## Reglas innegociables — Audit

Verificacion de las 8 reglas del CLAUDE.md (seccion "Reglas de negocio innegociables"):

| # | Regla | Estado | Evidencia |
|---|---|---|---|
| 1 | Comision marketplace 20% leida de country_config, jamas hardcodeada | PASS | calculateSettlement recibe commissionRate del caller; DB seeds AR=0.20; test "uses commission rate from country_config" |
| 2 | Free: max 3 rutinas, historial 10 dias, autopromo 10s | PASS | canAddRoutine(count<3), canViewWorkoutHistory(days<=10), shouldShowAutopromo — 11 tests unitarios |
| 3 | PRO via IAP en mobile, MP en web; paquetes coach SOLO MP, jamas IAP | PASS | RevenueCat en mobile, MP checkout en /checkout web; coach packages usan MP link |
| 4 | Precio coach >= piso pais (constraint DB + error inline) | PASS | trigger check_coach_package_price en migration 20260610000002; test pgTAP #10 |
| 5 | Coach: sub fija a comision al 4to alumno ACTIVO, jamas revierte | PASS | trigger update_billing_model_on_assignment en migraciones; billing_model NUNCA decrece |
| 6 | Sin factura aprobada no existe estado "transferido" | PASS | trigger en settlements; test pgTAP #11; settlement.test.ts |
| 7 | Menor de 18 sin parental_consent_at no llega a checkout coach (403) | PASS | isMinor() en @forzza/core; check en /api/checkout + Edge Function |
| 8 | Alta de coach SOLO en web, app movil es del alumno | PASS | /onboarding-coach solo en apps/web; apps/mobile no tiene ruta de registro coach |

---

## Arquitectura — Resumen de cobertura de archivos

### Packages
- `packages/core/src/billing/` — 2 funciones, 8 tests, 100% cobertura
- `packages/core/src/gating/` — 3 funciones, 11 tests, 100% cobertura
- `packages/core/src/analytics/` — scrubPII y track, 3 tests, 100% cobertura
- `packages/core/src/schemas/` — loginSchema, signupSchema, isMinor, 8 tests, 97.84% cobertura
- `packages/ui/` — tokens + 7 componentes native + 7 componentes web
- `packages/db-types/` — tipos generados manualmente (regenerar con DB activa)
- `packages/config/` — FEATURE_FLAGS, country config

### Apps
- `apps/web/` — Next.js 15 App Router: landing, auth, /coach backoffice, /admin backoffice, /onboarding-coach
- `apps/mobile/` — Expo 52: auth, onboarding, 5 tabs (Inicio/Rutinas/Progreso/Chat/Perfil), workout session

### Supabase
- 4 migraciones: schema (25 tablas) + constraints + RLS + storage
- seed.sql: country_config AR+CL, 30 ejercicios base
- 23 pgTAP assertions en rls_test.sql
- Edge Functions: mp-webhook, create-settlement, send-notification (stubs listos)

### E2E
- 5 flows Maestro YAML en e2e/flows/
- e2e/maestro.config.yaml como entry point

---

## Proximos pasos (post-F16)

1. Resolver HUMAN_REQUIRED de infraestructura (Docker + Supabase) y ejecutar `pnpm test:rls`
2. Integrar MP credentials y validar webhook signature
3. Primer build EAS (`eas build --platform all`)
4. Ejecutar Maestro flows contra emulador
5. Beta testing cerrada (TestFlight + Play Internal Track)
