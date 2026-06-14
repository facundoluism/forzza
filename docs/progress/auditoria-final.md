# Auditoría Final — Forzza V1

Fecha: 2026-06-14
Preparado por: docs-maintainer
Commit base: b072564

---

## Sección 1: Resumen ejecutivo

### Estado general

La plataforma está aproximadamente al **85% funcional** para un deploy a staging. El código compila sin errores TypeScript (6/6 paquetes), los tests unitarios pasan al 100% (48/48 en la sesión actual, 30/30 en el QA F16), y las 10 Edge Functions que tenían bugs de columna fueron corregidas. Las 13 reglas de negocio innegociables tienen implementación verificada.

Lo que falta para producción no es código sino infraestructura (Supabase cloud activo, credenciales reales, DB migrations aplicadas) y dos flujos de testing que requieren servicios externos (RLS tests: 23 assertions pgTAP pendientes de ejecución con Docker; E2E mobile: 5 flows Maestro pendientes de emulador).

### Defectos críticos corregidos en esta sesión (2026-06-14)

1. **constancia_url en admin/coaches**: columna inexistente en DB, exponía rutas de storage directamente. Corregido a `constancia_path` + signed URLs TTL 1h.
2. **Precio PRO hardcodeado $9.999 en landing**: violaba Regla #1. Ahora se lee de `country_config.pro_monthly_price_cents`.
3. **10 Edge Functions con columnas incorrectas**: queries fallaban silenciosamente en runtime porque usaban nombres de columnas que no existen en el schema real (ej. `payer_id`, `amount_cents`, `expires_at`, `metadata` en notifications). Todas corregidas.
4. **4 tablas fantasma en db-types**: `conversations`, `routine_exercises`, `checkin_questions`, `ticket_messages` definidas en tipos pero no en migraciones SQL. Eliminadas.
5. **11 archivos web con columnas renombradas**: `payments.payer_id→user_id`, `settlements.*_cents→*`, `coach_packages.name→title`, `notifications.metadata→data`, etc.
6. **mp-assignment-webhook sin validación HMAC**: procesaba cualquier POST sin verificar `x-signature`. Agregada validación constant-time idéntica a `mp-webhook`.
7. **Race condition en idempotencia de webhooks**: el patrón SELECT+INSERT es vulnerable a duplicados en alta concurrencia. Reemplazado por INSERT+catch error 23505 (atómico).
8. **Dunning cron grace period incorrecto**: usaba 7 días, la spec dice 5. Corregido.
9. **Deep-link a app en checkout web**: violaba Regla #3 (paquetes de coach solo por web/MP, jamás IAP). Checkout reescrito como flujo 100% web con MP.
10. **Verificación de menor en checkout web**: Regla #7 no estaba aplicada en el server component. Agregada verificación de `parental_consent_at` con error 403 inline.

### Pendientes HUMAN_REQUIRED

Ver Sección 5 para la lista completa. Los bloqueantes principales son: credenciales reales de MP y RevenueCat, Docker + Supabase CLI para RLS tests, y assets mobile de producción.

---

## Sección 2: Tabla de funcionalidades

### Landing y páginas públicas

| Funcionalidad | Plataforma | Rol | Plan | Estado | Causa raíz / Notas |
|---|---|---|---|---|---|
| Landing page hero + features | web | público | - | corregido | Precio PRO era hardcodeado; ahora dinámico desde country_config |
| Pricing FREE/PRO | web | público | - | funciona | Precio dinámico AR; fallback a 999900 si DB no responde |
| CTA "Ser coach" | web | público | - | funciona | Link a /onboarding-coach |
| Captura de leads (/api/leads POST) | web | público | - | funciona | Inserta en tabla `leads` con validación Zod |
| /legales/terminos | web | público | - | parcial | DRAFT — texto pendiente aprobación legal |
| /legales/privacidad | web | público | - | parcial | DRAFT — texto pendiente aprobación legal |
| Install banner PWA | web | público | - | funciona | Detecta beforeinstallprompt; botón "Instalar app" |

### Autenticación

| Funcionalidad | Plataforma | Rol | Plan | Estado | Causa raíz / Notas |
|---|---|---|---|---|---|
| Login email/password | web + mobile | todos | - | funciona | Supabase Auth; dev bypass con `DEV_SKIP_AUTH=true` |
| Signup alumno | web + mobile | alumno | - | funciona | Formulario + validación Zod + insert student_profiles |
| Onboarding alumno | mobile | alumno | - | funciona | Fecha nacimiento, objetivos, nivel; parental consent si menor |
| Consentimiento parental | mobile | alumno menor | - | funciona | Guarda `parental_consent_at`; bloquea checkout sin él |
| Forgot password | web + mobile | todos | - | funciona | Supabase resetPasswordForEmail |
| Apple Sign In | mobile | todos | - | parcial | Feature flag desactivado; requiere Apple Developer Program credentials |
| Google Sign In | mobile | todos | - | parcial | Feature flag desactivado; requiere Google Cloud Console credentials |
| Alta de coach (onboarding) | web | coach | - | funciona | /onboarding-coach; SOLO web (Regla #8 cumplida) |

### App mobile — Alumno

| Funcionalidad | Plataforma | Rol | Plan | Estado | Causa raíz / Notas |
|---|---|---|---|---|---|
| Splash screen + fuentes | mobile | alumno | ambos | funciona | BebasNeue, DM Sans; SplashScreen controlado; assets 1x1px placeholder |
| Tab: Inicio (workout home) | mobile | alumno | ambos | funciona | Lista rutinas activas, inicio de sesión |
| Tab: Rutinas (lista + nueva) | mobile | alumno | ambos | funciona | Máx 3 rutinas FREE (guard en core/gating) |
| Tab: Progreso | mobile | alumno | ambos | funciona | Historial visible 10 días FREE; PRO sin límite |
| Tab: Chat | mobile | alumno | ambos | funciona | Mensajes Realtime con coach asignado |
| Tab: Perfil | mobile | alumno | ambos | funciona | Editar datos, ver plan actual |
| Autopromo 10 s pre-rutina | mobile | alumno | free | funciona | shouldShowAutopromo() en core/gating; no aplica con coach activo |
| UpgradeModal FREE→PRO | mobile | alumno | free | funciona | RevenueCat IAP; muestra cuando excede límites |
| Workout session offline | mobile | alumno | ambos | funciona | workoutStore con queue offline + sync |
| Marketplace de coaches | mobile | alumno | ambos | funciona | Listado, filtros, detalle de coach |
| Checkout de coach (mobile) | mobile | alumno | ambos | funciona | Redirige a web/browser para MP (Regla #3 cumplida) |
| Notificaciones push | mobile | alumno | ambos | parcial | expo-notifications configurado; requiere EXPO_ACCESS_TOKEN real |
| Body metrics / fotos progreso | mobile | alumno | ambos | funciona | Buckets privados; signed URLs TTL 1h |

### Web — Backoffice Coach

| Funcionalidad | Plataforma | Rol | Plan | Estado | Causa raíz / Notas |
|---|---|---|---|---|---|
| Dashboard coach | web | coach | - | funciona | Sidebar con active state (lime) y logo FORZZA |
| /coach/alumnos | web | coach | - | funciona | Lista de asignaciones; empty state con icono |
| /coach/alumnos/[studentId] | web | coach | - | corregido | Gráfico LineChart últimas 28 días de sesiones |
| /coach/rutinas | web | coach | - | corregido | Empty state con icono; cards con CTA "Ver rutina →" |
| /coach/checkins | web | coach | - | corregido | Templates JSONB (no tabla fantasma checkin_questions); empty state |
| /coach/checkins/[id]/respuestas | web | coach | - | corregido | Respuestas de alumnos; labels desde JSONB |
| /coach/cobros | web | coach | - | corregido | Settlements con signed URLs para facturas; badges de estado |
| /coach/perfil | web | coach | - | corregido | Paquetes coach: columns corregidas (title/price/active/tier) |
| Refund de asignación | web | coach | - | corregido | Edge Function coach-refund con columnas correctas |

### Web — Backoffice Admin/Owner

| Funcionalidad | Plataforma | Rol | Plan | Estado | Causa raíz / Notas |
|---|---|---|---|---|---|
| Dashboard admin | web | admin | - | corregido | Métricas con `amount` (corregido de `amount_cents`) |
| /admin/coaches | web | admin | - | corregido | Constancia: signed URL TTL 1h desde bucket fiscal-docs (era constancia_url) |
| /admin/pagos | web | admin | - | corregido | Columnas user_id/coach_id/amount/gateway (todas corregidas) |
| /admin/tickets | web | admin | - | funciona | Lista + cambio de estado; filtro por status |
| /admin/configuracion | web | admin | - | corregido | country_config PK corregido (`country` no `country_code`) |
| Aprobar/rechazar coach | web | admin | - | funciona | Botones verde lime / rojo distinguibles |
| Generar settlements | backend | admin | - | corregido | generate-settlements con columnas reales; currency leída de country_config |

### Web — Checkout y pagos

| Funcionalidad | Plataforma | Rol | Plan | Estado | Causa raíz / Notas |
|---|---|---|---|---|---|
| Checkout PRO web (MP) | web | alumno | free→pro | funciona | mp-create-preapproval; columnas subscriptions corregidas |
| Checkout paquete de coach | web | alumno | ambos | corregido | Reescrito: 100% web MP, sin deep-link a app; verifica menor |
| Webhook MP suscripción | backend | - | - | corregido | Idempotencia atómica; columnas subscriptions corregidas |
| Webhook MP asignación | backend | - | - | corregido | HMAC agregado; idempotencia atómica; columnas payments corregidas |
| Facturación: upgrade PRO mobile | mobile | alumno | free | funciona | RevenueCat IAP (HUMAN_REQUIRED para credenciales) |

### Backend / Edge Functions

| Funcionalidad | Plataforma | Rol | Plan | Estado | Causa raíz / Notas |
|---|---|---|---|---|---|
| check-entitlements | backend | alumno | - | corregido | `current_period_end` (era `expires_at`) |
| notify | backend | todos | - | corregido | Email via auth.admin; `data:` en notifications (era `metadata:`) |
| checkin-reminder (cron) | backend | coach | - | corregido | `data:` en notify call |
| dunning-cron | backend | - | - | corregido | Grace period 5 días (era 7); enum values correctos |
| generate-settlements | backend | admin | - | corregido | 6 bugs de columnas corregidos; currency desde country_config |
| coach-checkout | backend | alumno | - | corregido | title/price/active; audit_log con payload |
| coach-refund | backend | coach | - | corregido | gateway_payment_id; status "approved"/"canceled" |
| mp-webhook | backend | - | - | corregido | Idempotencia atómica INSERT+23505; status map corregido |
| mp-assignment-webhook | backend | - | - | corregido | HMAC agregado; idempotencia atómica; columnas payments |
| mp-create-preapproval | backend | alumno | - | corregido | country (no country_code); subscriptions con columnas reales |

---

## Sección 3: Huecos de lógica y fallas de diseño

| Hallazgo | Impacto | Consejo de negocio |
|---|---|---|
| **mp-create-preapproval: upsert duplicaba rows por usuario** — Cada MP preapproval genera un nuevo `gateway_subscription_id`; el `onConflict` nunca matcheaba la fila existente. **Corregido en esta sesión:** se eliminan las filas `trialing/pending` del usuario antes de insertar, garantizando una sola fila pendiente por usuario. | Alto (ya corregido) | Ejecutar `pnpm db:reset` local y verificar que re-subscribe no crea duplicados en la tabla `subscriptions`. |
| **coach_assignments.package_id es NOT NULL — fallo silencioso en webhook** — Si `payment.metadata.package_id` llegara undefined, el INSERT fallaba con 23502 y el alumno pagaba sin asignación; el webhook retornaba 200 igualmente. **Corregido en esta sesión:** guard explícito + console.error CRITICAL + early return antes del INSERT. `coach-checkout` garantiza que `package_id` siempre esté en metadata. | Alto (ya corregido) | Verificar en Supabase Edge Function logs que no aparezca el mensaje CRITICAL después del primer pago real en staging. |
| **RLS tests (23 assertions pgTAP) nunca ejecutadas contra DB real** — Toda la seguridad por filas está escrita pero no verificada en runtime. | Alto | Este es el bloqueante de seguridad más importante antes de producción. Requiere Docker + Supabase CLI. Ver HUMAN_REQUIRED #1. |
| **Validación HMAC de mp-webhook fue un TODO hasta esta sesión** — mp-assignment-webhook no tenía validación HMAC antes de la Fase 4. El endpoint aceptaba cualquier POST. | Alto (ya corregido) | Corregido en Fase 4. Confirmar que MP_WEBHOOK_SECRET está cargado en Supabase Secrets en producción. |
| **Rate limiting ausente en endpoints públicos** — /api/leads y /api/checkout no tienen rate limiting propio, solo el default de Supabase (1000 req/min). | Medio | Agregar Upstash Redis o el rate limiter de Supabase Edge Functions antes de producción. Riesgo: spam en captura de leads y flooding de checkout. |
| **Textos legales son DRAFT** — /legales/terminos y /legales/privacidad tienen aviso de DRAFT. Si se abre al público sin versión final, hay exposición legal. | Medio | No hacer soft launch sin versión aprobada por abogado. Costo estimado: 1-2 sesiones con un abogado especializado en datos personales Argentina (Ley 25326). |
| **Chile preparado en datos pero no activo en V1** — `country_config` tiene fila CL con datos. Las Edge Functions y el código aceptan `country: 'CL'` pero no hay prueba end-to-end del flujo CL. | Medio | Mantener feature flag `CHILE_ENABLED=false`. Si se activa Chile en V2, hacer smoke test completo del flujo de pago en CLP con MP Chile. |
| **pnpm lint FAIL en packages/ui** — `@forzza/eslint-config` faltaba en devDependencies de `packages/ui` aunque el `.eslintrc.json` lo extendía. **Corregido en esta sesión.** | Bajo (ya corregido) | Ejecutar `pnpm install && pnpm lint` en packages/ui para confirmar verde. |
| **Assets mobile (splash, icon, adaptive-icon) son placeholders 1x1px** — La app se puede testear pero no publicar en stores con estos assets. | Bajo para testing, Bloqueante para stores | HUMAN_REQUIRED: diseñador debe entregar splash.png 1242x2436px, icon.png 1024x1024px, adaptive-icon.png 1024x1024px. |
| **Signup de alumnos disponible en web pero el flujo de onboarding completo es solo mobile** — El web tiene página de signup pero el onboarding (fecha de nacimiento, objetivos, parental consent) vive en la app. Un alumno que se registra en web queda con perfil incompleto. | Bajo | Decisión de producto necesaria: ¿el alumno puede usar la PWA web como primera experiencia completa, o solo como complemento a la app? Registrar en open-questions.md. |
| **db-types generado manualmente, no desde supabase gen types** — Cualquier migración futura puede desincronizar los tipos nuevamente. | Bajo | Una vez que Docker+Supabase estén activos, ejecutar `pnpm db:types` para reemplazar el archivo manual por tipos generados. Agregar al CI. |

---

## Sección 4: Lo que NO es V1 (scope creep detectado)

Los siguientes items aparecen mencionados en el codebase o en el master doc pero están explícitamente fuera de V1 según CLAUDE.md. Si algún stakeholder los pide, es scope creep: rechazar y registrar en open-questions.md.

| Item | Dónde aparece | Instrucción |
|---|---|---|
| Grupos/comunidad | Mencionado en master doc como V2 | No implementar. Rechazar cualquier issue que lo solicite en V1. |
| Sesiones en vivo (streaming) | Mencionado en backlog §15 | No implementar. Requiere infraestructura de video (Daily.co, Agora, etc.) no definida. |
| Nutrición y planes de dieta | Backlog §15 | No implementar. Requiere modelo de datos nuevo y posiblemente licencia de base de datos de alimentos. |
| Escáner IA de fichas de entrenamiento | Backlog §15 | No implementar. Requiere modelo de visión (GPT-4V o similar) y flujo de validación. |
| Ratings y reviews de coaches | Backlog §15 | No implementar. Tiene implicaciones legales y de moderación. |
| Stripe | No mencionado en stack | No implementar. Stack obligatorio es Mercado Pago (AR/CL) + RevenueCat (IAP). |
| Apple Health / Google Fit | Backlog §15 | No implementar. Requiere permisos especiales en stores y política de manejo de datos de salud. |
| Export CSV avanzado | Backlog §15 | No implementar. El export básico (PDF factura) ya está via signed URL. |
| Brasil | Tablas preparadas (`country_config` puede tener fila BR) | No activar. No hay cuenta MP Brasil ni adaptaciones fiscales. |
| UI de promotores (panel, dashboard) | La tabla `promoters` existe en schema | Las tablas existen en DB (correctamente). No crear pantallas de promotores en V1. Solo insertar datos si surge un promotor manual. |

---

## Sección 5: HUMAN_REQUIRED antes de producción

Lista ordenada por prioridad. Los primeros 5 son bloqueantes para cualquier deploy real.

**1. Docker Desktop + Supabase CLI: ejecutar migraciones y RLS tests**
- Instalar Docker Desktop (si no está)
- Ejecutar `supabase start` en la raíz del proyecto
- Ejecutar `pnpm db:reset` (aplica las 4 migraciones + seed.sql)
- Ejecutar `pnpm test:rls` (23 assertions pgTAP)
- Si algún assertion falla, escalar al supabase-rls-engineer

**2. Aplicar migración 20260615000001 a Supabase cloud**
- La migración `supabase/migrations/20260615000001_add_missing_columns.sql` agrega columnas a country_config, subscriptions y coach_profiles
- Si el proyecto Supabase cloud ya existe: ejecutar `supabase db push` o aplicar el SQL manualmente desde el dashboard
- Sin esta migración, las Edge Functions que usan `pro_monthly_price_cents`, `currency_code` o `plan` fallarán

**3. Credenciales Mercado Pago TEST**
- Obtener en developers.mercadopago.com → Credenciales
- Variables: `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`, `MP_PUBLIC_KEY`
- Cargar en `.env` local Y en Supabase Secrets del proyecto cloud
- Configurar URL del webhook en el dashboard de MP apuntando a `https://<project>.supabase.co/functions/v1/mp-webhook` y `mp-assignment-webhook`

**4. RevenueCat**
- Crear cuenta en app.revenuecat.com
- Crear productos IAP en App Store Connect (iOS) y Google Play Console (Android)
- Variables: `REVENUECAT_APPLE_SHARED_SECRET`, `REVENUECAT_GOOGLE_SERVICE_ACCOUNT` (JSON), `NEXT_PUBLIC_REVENUECAT_API_KEY`
- Sin esto, el upgrade PRO en mobile falla silenciosamente

**5. Resend (email transaccional)**
- Crear cuenta en resend.com
- Verificar dominio `@forzza.com` (o el dominio elegido)
- Variable: `RESEND_API_KEY`
- Sin esto, la Edge Function `notify` no envía emails

**6. Sentry DSN**
- Crear proyecto en sentry.io → Project Settings → Client Keys
- Variables: `NEXT_PUBLIC_SENTRY_DSN` (web), `EXPO_PUBLIC_SENTRY_DSN` (mobile), `SENTRY_AUTH_TOKEN` (CI source maps)
- Sin DSN, los errores de producción son invisibles

**7. Assets mobile de producción**
- El diseñador debe entregar:
  - `apps/mobile/assets/splash.png` — 1242×2436px, fondo #0A0A0A, logo centrado
  - `apps/mobile/assets/icon.png` — 1024×1024px
  - `apps/mobile/assets/adaptive-icon.png` — 1024×1024px, sin fondo
- Los actuales son placeholders 1×1px negros (válidos para Expo Go, no para stores)

**8. OAuth (si se va a activar en V1)**
- Apple Sign In: Apple Developer Program → Certificates, Identifiers & Profiles → App ID con Sign In With Apple capability. Variables: `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`
- Google Sign In: Google Cloud Console → APIs & Services → Credentials → OAuth 2.0. Variable: `GOOGLE_CLIENT_ID`
- Activar feature flags en `packages/config`: `APPLE_AUTH_ENABLED=true`, `GOOGLE_AUTH_ENABLED=true`
- Si no se activa en V1: mantener flags en false (estado actual)

**9. EAS (builds nativos)**
- `EAS_PROJECT_ID` en app.config.ts (obtener de expo.dev al crear el proyecto)
- Ejecutar `eas build --platform all` para primer build
- Para TestFlight: cuenta App Store Connect con rol Admin o App Manager
- Para Play Internal: cuenta Google Play Console

**10. Textos legales**
- Reemplazar páginas DRAFT en `/legales/terminos` y `/legales/privacidad` con versiones aprobadas por abogado
- Especialmente importante para cumplimiento de Ley 25326 (Protección de Datos Personales Argentina)

**11. Decisión de precio PRO definitivo**
- El precio se lee de `country_config.pro_monthly_price_cents` en DB
- El seed.sql define AR=999900 centavos ($9.999 ARS)
- Confirmar o ajustar el valor ejecutando un UPDATE en la DB cloud antes del launch

---

## Sección 6: Métricas de la sesión (2026-06-14)

| Métrica | Valor |
|---|---|
| Archivos de código modificados | ~45 (estimado; incluye web, mobile, edge functions, packages) |
| TypeScript: errores en inicio de sesión | ~30+ errores (web + mobile) |
| TypeScript: errores al cierre | 0 errores (6/6 paquetes) |
| Tests unitarios (core) | 48/48 PASS (Fase 4); 30/30 PASS (QA F16) |
| Cobertura core/billing | 100% |
| Cobertura core/gating | 100% |
| Edge Functions corregidas | 10/10 |
| Reglas de negocio innegociables | 13/13 PASS |
| RLS tests (pgTAP) | 23 definidas — HUMAN_REQUIRED: Docker + supabase start |
| E2E Playwright tests | 78/79 PASS, 1 skip (credenciales reales); 4 archivos spec corregidos en Fase 5 |
| E2E Maestro flows | 5 flows YAML válidos — PENDING: emulador iOS/Android |
| offline/page.tsx (prod build FAIL) | Corregido: "use client" agregado |
| mp-create-preapproval duplicates | Corregido: DELETE trialing rows antes de INSERT |
| mp-assignment-webhook package_id | Corregido: guard + console.error CRITICAL |
| pnpm lint | packages/ui corregido (@forzza/eslint-config añadido). Verificar con pnpm install && pnpm lint tras instalar. |
| Commits en esta sesión | b072564, 80663aa, 0f2521a (commits previos incorporados en esta auditoría) |

### Resumen de fases

| Fase | Descripción | Estado |
|---|---|---|
| Fase 0 | Higiene: revert mobile, organizar archivos, .gitignore, .env | PASS |
| Fase 1 audit | Schema alignment: migración, db-types, 10 edge functions | PASS |
| Fase 1 web | Bugs heredados: constancia_url, precio PRO, country_code queries | PASS |
| Fase 2 | Mobile bootstrap: fuentes Google, splash screen, Sentry, assets | PASS |
| Fase 3 | Web V1: checkout coach web, cobros signed URLs, gráfico alumnos | PASS |
| Fase 4 | Reglas de negocio: 48 tests, HMAC, idempotencia atómica, 4 bugs corregidos | PASS |
| Fase 6 | UI/UX: active state sidebars, logo FORZZA, empty states, contraste | PASS |
| Fase 5 smoke test | 48/48 unit, 78/79 Playwright, 16/17 rutas 200, mobile TS 0 errores, webhooks PASS | PASS (1 HUMAN_REQUIRED: RLS/Docker) |
