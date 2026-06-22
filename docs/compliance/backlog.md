# Compliance Backlog — Forzza

> Auditoría legal/privacidad de las 4 caras (landing, app alumno, /coach, /admin).
> Origen: pedido del dueño (2026-06-22) a partir de un checklist en video US-centric.
> Alcance acordado: **Argentina bloqueante + US/EU como backlog activable**.
> Los textos legales se entregan como **drafts marcados `HUMAN_REQUIRED: validación legal`** — NO son consejo legal; los valida un abogado.

## Calibración de riesgo

El video razona sobre EE. UU. (FTC, CCPA, DMCA y sus USD 150k). `CLAUDE.md` define **V1 = Argentina**. En V1 mandan:
- **Ley 25.326 de Protección de Datos Personales** (autoridad de aplicación: AAIP) → derechos de acceso, rectificación, supresión; registro de bases; datos sensibles (salud) con consentimiento.
- **Ley 24.240 de Defensa del Consumidor** → cláusulas abusivas (las de arbitraje de consumo son discutibles/anulables en AR), información clara de precio/renovación/cancelación.

**Obligatorio sí o sí (stores son globales):** Apple Privacy Nutrition Label + iOS Privacy Manifest, Google Play Data Safety. No dependen del país objetivo.

## Estado actual (ya cubierto — no rehacer)

| Área | Implementado | Ubicación |
|---|---|---|
| Términos + Privacidad (DRAFT) | Sí, con banner de advertencia | `apps/web/app/[locale]/legales/{terminos,privacidad}/page.tsx`; textos en `apps/web/messages/{es,en}.json` ns `legal` |
| Borrado de cuenta (mobile) + anonimización 30 d | Sí | `apps/mobile/app/(tabs)/profile.tsx` → Edge Fns `supabase/functions/{delete-account,anonymize-accounts}` |
| Consentimiento parental <18 | Sí (gate 403 en checkout) | `apps/mobile/app/(auth)/onboarding.tsx`, `apps/web/app/api/mp-preapproval/route.ts`, `packages/core/src/{schemas/auth.ts,gating/index.ts}` |
| Scrubbing de PII en analytics/errores | Sí | `packages/core/src/analytics/index.ts` (`scrubPII()`), `apps/{web,mobile}/lib/{analytics,sentry}.ts` |
| Buckets privados con RLS | Sí (`progress-photos`, `fiscal-docs`, `invoices`, `videos` privados; `coach-avatars` público) | `supabase/migrations/20260610000004_storage_buckets.sql` |
| `audit_log` append-only | Sí (UPDATE/DELETE revocados) | `supabase/migrations/20260610000001_initial_schema.sql` |
| Permisos Expo mínimos | Sí (cámara+galería; sin micrófono/ubicación/Health) | `apps/mobile/app.config.ts` |
| Sin IA en producción | Correcto (solo flag `AI_BODY_SCAN: false`) | `packages/config/src/index.ts` |

## Gaps y backlog priorizado

### P0 — Bloqueante de beta pública / submission a stores

| ID | Gap | Acción | Agente(s) |
|---|---|---|---|
| P0.1 | Mapa de datos formal (RoPA) | Crear `docs/compliance/data-map.md`: por categoría → tabla/columna, finalidad, base legal, retención, tercero, sensible. Insumo de P0.2/P0.5 y toda la Privacidad | `docs-maintainer` + `security-privacy-reviewer` |
| P0.2 | ✅ **HECHO 2026-06-22** — drafts completos entregados (HUMAN_REQUIRED) | Privacidad (11 secciones, alimentada por data-map), Términos (10 secciones, incluye UGC/derechos + takedown + arbitraje placeholder), Política de IA (`/legales/ia`), Disclaimer salud (`/legales/disclaimer-salud`). ES+EN paritarios, typecheck verde. Páginas refactorizadas a array de secciones. Falta: validación de abogado + completar `[PENDIENTE]` | `web-next-engineer` |
| P0.3 | ✅ **HECHO 2026-06-22** — disclaimer visible | Componente `HealthNotice` (native+web) en `packages/ui`; render en onboarding alumno, detalle de rutina (`routine/[id].tsx`) y footer web (link a `/legales/disclaimer-salud`). ES+EN paritarios, typecheck verde | `ui-design-system-engineer` |
| P0.4 | ✅ **HECHO 2026-06-22** — iOS Privacy Manifest | Vía `ios.privacyManifests` en `app.config.ts` (no `.xcprivacy` manual: el repo usa CNG/EAS sin `ios/`). NSPrivacyTracking=false, 9 data types (Health/Fitness/Photos linked), 4 required-reason API verificadas en node_modules. HUMAN_REQUIRED: marcar Health/Fitness/Photos como "sensitive" en App Store Connect (P0.5) y verificar pods de RevenueCat tras 1er build EAS | `release-store-engineer` |
| P0.5 | ✅ **HECHO 2026-06-22** — insumo de labels | `docs/compliance/store-privacy-labels.md`: §1 Apple Nutrition Label (coherente con el privacy manifest; Health/Fitness/Photos = confidenciales), §2 Google Data Safety (17 datos + terceros + eliminación), §3 Google Health Apps declaration (**se declara**, decisión del dueño), §4 checklist pre-submission. Transcripción en consola = HUMAN_REQUIRED | `release-store-engineer` |
| P0.6 | ✅ **HECHO 2026-06-22** — checkbox de aceptación | Migración `20260622150000_terms_acceptance.sql`: columnas `users.terms_accepted_at/terms_version`, RPC `accept_terms()` SECURITY DEFINER (escribe audit_log) + trigger que bloquea UPDATE directo. Checkbox bloqueante en onboarding alumno (mobile) y signup alumno + onboarding coach (web), versión desde `@forzza/config` `LEGAL_DOCS_VERSION`. RLS tests T64-66. Typechecks verdes. Pendiente: smoke logueado contra schema real (no dev-bypass) | `supabase-rls-engineer` + apps |

### P1 — Pre-lanzamiento general

| ID | Gap | Acción | Agente(s) |
|---|---|---|---|
| P1.1 | ✅ **HECHO 2026-06-22** | Banner de primer uso + opt-out (decisión del dueño). Web: `AnalyticsBanner`/`AnalyticsOptOut`, PostHog no carga hasta aceptar (localStorage). Mobile: store Zustand persistido + banner + toggle en perfil. Sobre `scrubPII()`. Typechecks verdes | apps ✅ |
| P1.2 | ✅ **HECHO 2026-06-22** | UI de borrado en `/coach/perfil` (Danger zone, doble confirmación) reutilizando Edge Fn `delete-account`. ES/EN paritarios, typecheck verde | `web-next-engineer` |
| P1.3 | 🟡 **BACKEND HECHO 2026-06-22** | Edge Fn `export-user-data` (JSON descargable con datos propios; audit_log; fotos = metadata + URL firmada 1h). **PENDIENTE**: botón "descargar mis datos" en UI mobile+web | `supabase-rls-engineer` ✅ + apps ⏳ |
| P1.4 | ✅ **HECHO 2026-06-22** | Capa de datos (RPC `record_sensitive_consent`) + UI mobile: modal de consentimiento antes de subir fotos de progreso, gateado por `sensitive_data_consent_at`. Enforcement duro RLS = follow-up opcional | `supabase-rls-engineer` ✅ + `mobile-expo-engineer` ✅ |
| P1.5 | 🟡 **DOC + BACKEND HECHO 2026-06-22** | `docs/compliance/ugc-takedown.md` + Edge Fn `submit-content-report` (canal mínimo: audit_log + notifica owners + email opcional `LEGAL_REPORTS_EMAIL`; sin tabla nueva, decisión del dueño). **PENDIENTE**: botones "reportar" en chat/video/perfil (mobile+web) | `docs-maintainer` ✅ + apps ⏳ |

### P2 — US/EU prep (activable al internacionalizar)

| ID | Acción | Nota |
|---|---|---|
| P2.1 | Agente DMCA en copyright.gov | Solo al operar en EE. UU. HUMAN_REQUIRED (~USD 6 / 3 años + publicar datos del agente + política de reincidentes) |
| P2.2 | Cláusula de arbitraje revisada por abogado (US) | HUMAN_REQUIRED. No copiar genérica; conflictiva en AR consumo |
| P2.3 | CCPA/CPRA | Aviso de recolección + "Do Not Sell/Share" |
| P2.4 | GDPR | Base legal por finalidad, DPAs con procesadores (PostHog/Sentry/Supabase/Resend), transferencia internacional |

## Superficies de contenido subido por el coach (UGC — aclaración del dueño 2026-06-22)

El coach es el principal generador de UGC y el de mayor exposición a copyright. Superficies:

| Contenido | Bucket | Privacidad | Estado |
|---|---|---|---|
| Facturas / PDFs fiscales | `invoices`, `fiscal-docs` | Privado + RLS (coach dueño + owner) | Existe |
| Imagen de perfil | `coach-avatars` | **Público** | Existe |
| Videos de ejercicios | `videos` | Privado + RLS | Existe |
| **Imágenes adicionales del coach ("más imágenes")** | (a crear) | **Privado + RLS** (decisión del dueño 2026-06-22) | **A diseñar** |

Implicancias para el backlog:
- **P1.5 (UGC/takedown) sube de prioridad**: cualquier imagen/PDF/video del coach puede infringir derechos de terceros → necesita cláusula de "el coach declara tener derechos sobre lo que sube", canal de takedown y política de reincidentes. Es exactamente el punto 4 del video (copyright/DMCA).
- **Nueva superficie "más imágenes"**: requiere decisión de producto (bucket nuevo, **público vs privado**, RLS, límites de tipo/tamaño) antes de implementarla. Registrado como duda abierta. El avatar de coach ya es público; si las imágenes nuevas también lo son, son indexables/cacheables por terceros → tenerlo presente en Privacidad y en moderación.
- **P0.1 (mapa de datos)** debe incluir las 4 superficies y marcar la última como "planeada".
- **P0.5 (labels de store)**: declarar "User Content" (fotos/otros archivos) en Apple Nutrition Label y Google Data Safety.

## Reutilización clave (no reinventar)
- Edge Fns `delete-account` / `anonymize-accounts` → web solo agrega UI (P1.2).
- `scrubPII()` + `beforeSend()` de Sentry ya filtran PII → el banner (P1.1) se monta encima.
- Patrón `isMinor()` / `parentalConsentSchema` (`packages/core/src/schemas/auth.ts`) → replicar para `terms_accepted_at` (P0.6) y consentimiento sensible (P1.4).
- `audit_log` append-only → registrar nuevos consentimientos y takedowns.

## Verificación de cierre
- `docs/compliance/data-map.md` cubre el 100% de tablas con PII.
- `pnpm typecheck` + `pnpm lint` verdes (verificar manualmente — subagentes reportaron verde en falso antes).
- e2e Playwright: submit de signup bloqueado sin checkbox; smoke logueado con usuarios reales contra local (no dev-bypass) para que `terms_accepted_at` persista en el schema real.
- `pnpm test:rls`: export/borrado/consentimiento respetan accesos cruzados.
- `security-privacy-reviewer`: ningún dato sensible a logs/analytics; URLs firmadas con TTL 1 h.
- Cierre por criterio PASS/FAIL en `docs/progress/<fase-compliance>.md`.
