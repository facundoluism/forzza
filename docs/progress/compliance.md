# Progress — Compliance legal/privacidad (2026-06-22)

Auditoría legal/privacidad de las 4 caras (landing, app alumno, /coach, /admin) y ejecución del backlog. Alcance: **AR bloqueante + US/EU diferido**. Backlog: `docs/compliance/backlog.md`. Plan P2: `docs/compliance/p2-plan.md`.

Commits en `main`: `f523560` (P0), `de8b70e` + `7c411af` + `f32026d` (P1), `a906a9d` (fix banner), + commit de docs de cierre.

## P0 — Bloqueante beta/stores

| Criterio | Estado | Evidencia |
|---|---|---|
| P0.1 Mapa de datos | PASS | `docs/compliance/data-map.md` (8 categorías + buckets + terceros) |
| P0.2 Drafts legales (Términos, Privacidad, IA, Disclaimer) | PASS | `/legales/{terminos,privacidad,ia,disclaimer-salud}` ES/EN, marcados HUMAN_REQUIRED; typecheck verde |
| P0.3 Disclaimer visible | PASS | `HealthNotice` (packages/ui) en onboarding, rutina, footer web |
| P0.4 iOS Privacy Manifest | PASS | `ios.privacyManifests` en `app.config.ts`; 9 data types, 4 required-reason API |
| P0.5 Insumo labels store | PASS | `docs/compliance/store-privacy-labels.md` (Apple + Google + Health App declarada) |
| P0.6 Checkbox de aceptación | PASS | Migración `20260622150000` (RPC `accept_terms`) + checkbox bloqueante mobile/web |

## P1 — Pre-lanzamiento

| Criterio | Estado | Evidencia |
|---|---|---|
| P1.1 Consent analytics (banner + opt-out) | PASS | web (`AnalyticsBanner`/`AnalyticsOptOut`) + mobile (Zustand + Modal); PostHog no carga hasta aceptar |
| P1.2 Borrado de cuenta web | PASS | `/coach/perfil` Danger zone → Edge Fn `delete-account` |
| P1.3 Export de datos | PASS | Edge Fn `export-user-data` + botón web/mobile |
| P1.4 Consentimiento datos sensibles | PASS | Migración `20260622170000` (RPC `record_sensitive_consent`) + modal mobile pre-subida de fotos |
| P1.5 UGC/takedown | PASS | `docs/compliance/ugc-takedown.md` + Edge Fn `submit-content-report` + botones reportar (chat/video/perfil) |

## Verificación runtime (logueado contra schema local real, no dev-bypass)

| Check | Estado | Evidencia |
|---|---|---|
| RLS pgTAP (T64-69) | PASS | `pnpm test:rls` — accept_terms + record_sensitive_consent + protección de columnas |
| RPCs logueado (alumno smoke) | PASS | `accept_terms`/`record_sensitive_consent` persisten + audit_log + UPDATE directo bloqueado por trigger |
| Edge Functions logueado | PASS | `export-user-data` devuelve datos propios + `data.exported`; `submit-content-report` → `content.reported` + notif owner |
| UI en browser (Playwright, login real) | PASS | banner analytics, checkbox bloqueante (submit disabled→enabled), opt-out + export + borrado en /coach/perfil, botón reportar en perfil público |
| Fix overlap banner | PASS | `body padding-bottom: 160px` con banner visible; botón eliminar queda por encima (verificado por screenshot + boundingBox) |

## Pendiente (no bloquea el cierre de esta fase)

- **HUMAN_REQUIRED:** validación de abogado de los `[PENDIENTE]` legales; transcripción de labels en App Store Connect / Play Console; marcar Health/Fitness/Photos como sensibles; confirmar casilla `LEGAL_REPORTS_EMAIL`; verificar pods de RevenueCat tras 1er build EAS.
- **P2 (US/EU prep):** DIFERIDO — ver `docs/compliance/p2-plan.md`.
- **Ajeno a compliance (reconciliar):** test T14 roto por `20260622120000_no_price_floor.sql` (contradice regla 4 de CLAUDE.md); gap i18n `admin.videos.discardModal.*` (22 claves, locale EN).

## Resultado: P0 + P1 CERRADOS (PASS). P2 planificado y diferido.
