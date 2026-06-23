# Forzza HANDOFF — 2026-06-22

## Fase actual

Compliance legal/privacidad. P0 + P1 CERRADOS (PASS). P2 planificado y DIFERIDO.

---

## Hecho (commits en main)

| Commit | Contenido |
|--------|-----------|
| `f523560` | P0: data-map, drafts legales ES/EN (`/legales/{terminos,privacidad,ia,disclaimer-salud}`), componente `HealthNotice` en `packages/ui`, `ios.privacyManifests` en `app.config.ts`, migración `20260622150000_terms_acceptance.sql` (RPC `accept_terms` + checkbox bloqueante), `store-privacy-labels.md` (Health App declarada) |
| `de8b70e` | P1: borrado de cuenta web, migración `20260622170000_sensitive_data_consent.sql` (RPC `record_sensitive_consent`), `ugc-takedown.md` |
| `7c411af` | P1: consent analytics (banner + opt-out web/mobile), UI consentimiento sensible mobile, Edge Functions `export-user-data` + `submit-content-report` |
| `f32026d` | P1 UI: botón "descargar mis datos" + botones "reportar" (mobile/web), deps `expo-file-system` / `expo-sharing` |
| `a906a9d` | fix: banner analytics reserva `padding-bottom` para no tapar contenido al pie |

Toda la documentación viva está en `docs/compliance/`:
`backlog.md`, `data-map.md`, `store-privacy-labels.md`, `ugc-takedown.md`, `ai-policy.md`, `p2-plan.md`.
Progress de la fase: `docs/progress/compliance.md`.

## Verificación ejecutada

Contra schema LOCAL real (no dev-bypass):
- RLS pgTAP T64-69: PASS
- RPCs persisten + `audit_log` + trigger bloquea UPDATE directo: PASS
- Edge Functions `export-user-data` + `submit-content-report`: PASS
- UI Playwright (login real, no dev-bypass): banner analytics, checkbox bloqueante de ToS, opt-out / export / borrado en `/coach/perfil`, botón reportar: PASS
- Usuarios smoke: `alumno/coach/owner.smoke@forzza.app` / `ForzzaSmoke123!`

Para servir Edge Functions local:
```
supabase functions serve --env-file supabase/functions/.env
```

## A medias

Nada de compliance. P0 + P1 completos y verificados.

NOTA: hay cambios sin commitear en el working tree que pertenecen a OTRA sesion concurrente:
- `apps/mobile/components/ExercisePreviewSheet.tsx`
- `apps/mobile/locales/*.json`

No son de compliance. No tocarlos ni incluirlos en commits de esta rama.

## Proximos 3 pasos exactos

1. **Reconciliar desvio de otra sesion:** la migración `20260622120000_no_price_floor.sql` (generada por otra sesión) elimina el piso de precio del coach y ROMPE el test T14, contradiciendo la regla 4 de `CLAUDE.md`. Decidir con el dueño: actualizar regla 4 + arreglar/retirar T14 + cerrar la open-question de pisos de precio.

2. **HUMAN_REQUIRED de stores antes de submission:** transcribir las labels usando `docs/compliance/store-privacy-labels.md` en App Store Connect + Play Console Data Safety + Health Apps declaration; marcar Health/Fitness/Photos como sensibles; configurar variable de entorno `LEGAL_REPORTS_EMAIL` en Supabase.

3. **Textos legales a abogado:** los drafts en `/legales/*` están marcados `[PENDIENTE — validación legal]`. Enviar Términos / Privacidad / Política IA / Disclaimer de salud para revisión; completar razón social, CUIT, inscripción AAIP y cláusula de transferencia internacional.

## HUMAN_REQUIRED pendientes

- Validación de abogado de los cuatro textos legales (Términos, Privacidad, IA, Disclaimer de salud).
- Transcripción de labels de privacidad en App Store Connect y Play Console (usar `docs/compliance/store-privacy-labels.md`).
- Declaración "Health App" en App Store Connect.
- Configurar `LEGAL_REPORTS_EMAIL` en variables de entorno de Supabase (producción y staging).
- Verificación de pods RevenueCat tras el primer build EAS (no se puede testear sin build nativo real).
- Gap i18n: 22 claves `admin.videos.discardModal.*` ausentes en locale EN (ajeno a compliance, pero bloquea typecheck si se activa strict i18n).

## Prompt para retomar

La sesión nueva arranca leyendo `CLAUDE.md` + este archivo. Dos puntos de entrada posibles:

- **Si el objetivo es reconciliar la arquitectura:** arrancar por el paso 1 (migración `no_price_floor` vs. regla 4 + T14). Abrir `docs/open-questions.md`, localizar la pregunta de pisos de precio y resolverla con el dueño antes de tocar código.
- **Si el objetivo es submission a stores:** arrancar por el paso 2 (labels) y paso 3 (abogado). P2 de compliance (GDPR/COPPA) está DIFERIDO; ver `docs/compliance/p2-plan.md` para detalle. No arrancar P2 salvo decisión explícita de lanzar en US/UE.
