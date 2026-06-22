# Auditoría general E2E — Forzza

**Fecha:** 2026-06-22
**Alcance:** documentación + spec→código + batería automatizada + smoke test por rol (web + mobile)
**Entorno de pruebas:** Supabase **local** (Docker, 26 migraciones aplicadas) — el cloud staging
está 18 migraciones atrás y no sirve para auditar el código actual (ver A0).
**Principio:** no se confía en los reportes de `docs/progress/`; todo se re-verifica de forma
independiente.

---

## Resumen ejecutivo

| Área | Estado real verificado |
|------|------------------------|
| Typecheck (8 paquetes) | ✅ PASS |
| Lint | ✅ PASS (web 0 warnings; **mobile 285 warnings, 0 errores**) |
| Unit tests (core) | ✅ 271 passed + 5 skipped (276) — cobertura billing 98.42%, gating 100% |
| Unit tests (ui) | ✅ 127 passed |
| RLS (pgTAP) | ✅ 63 tests PASS |
| E2E Playwright (web) | ⚠️ 45 pass / 35 fail — fallos del harness (dev-bypass), no de producto (M-TEST1) |
| Smoke test por rol (web) | ✅ admin 10/10, coach 7/7 (tras fix A6), público OK — verificado con driver propio |
| Smoke test (mobile) | ⏳ PARCIAL — emulador no completado esta corrida |

**Conclusión preliminar:** el código está genuinamente en verde y por encima de lo que dicen los
docs (que hablan de "48 tests / 23 RLS" — desactualizados). Los problemas reales **no son de
código roto**, sino de: (1) **drift entre documentación y realidad**, (2) **un par de violaciones
de reglas de negocio sin enforcement en DB**, (3) **scope creep no trazado (ratings)**, y
(4) **precios/pisos contradictorios entre spec y seed** que tocan plata.

---

## Hallazgos por severidad

### 🔴 ALTA

**A0 — Cloud staging 18 migraciones atrás del código (drift de deploy)**
El proyecto cloud `plrjiglohbygqivhjzgz` tiene solo 8 migraciones (hasta 15-jun); faltan 18,
incluidas las 3 tablas de videos. Cualquier deploy/push actual falla (`relation exercise_videos
does not exist`). Riesgo: la "fuente de verdad" productiva no refleja el código.
**Estado:** ✅ RESUELTO 2026-06-22 — el dueño autorizó; se ejecutó `supabase db push` (18 migraciones
aditivas aplicadas sin error). Remoto 26/26 sincronizado; 10 tablas nuevas verificadas vía PostgREST.
Pendiente aparte: seed de videos al cloud cuando termine la curación.

**A6 — Backoffice del coach roto contra el schema real (embed PGRST200)** ⬅ hallazgo de smoke
8 queries en 7 archivos del backoffice coach embeben `student_profiles` vía un FK que en realidad
apunta a `users` (`coach_assignments_student_id_fkey`, `routines_student_id_fkey`,
`routine_schedule_student_id_fkey`, `checkin_responses_student_id_fkey`). No existe FK directo
tabla↔`student_profiles` (ambas referencian `users`), así que PostgREST devuelve PGRST200 y las
páginas **alumnos, rutinas y calendario muestran ErrorState / vacío**. Nunca se ejercieron contra
el schema real: el e2e Playwright corría en dev-bypass con datos mock. Archivos:
`coach/alumnos/page.tsx:62`, `coach/rutinas/page.tsx:46`, `coach/rutinas/[routineId]/page.tsx:94`,
`coach/rutinas/nueva/page.tsx:73`, `coach/calendario/page.tsx:44,57`,
`api/coach/calendario/route.ts:47`, `coach/checkins/[templateId]/respuestas/page.tsx:85`.
**Estado:** ✅ ARREGLADO (commit `151004a`) — reemplazado el embed por query separada a
`student_profiles` con `.in('user_id', studentIds)` + mapeo en memoria, en los 7 archivos.
**Verificado por mí** (no por reporte del subagente): smoke re-ejecutado logueado como coach.smoke
→ /coach/alumnos, /coach/rutinas, /coach/calendario rinden con heading y **0 errores de consola**
(antes: PGRST200). Typecheck completo en verde.

**A1 — Precio PRO contradictorio: master-doc ARS 4.500 vs seed/código ARS 9.999**
`forzza-master-doc.md` §4.2/§10.1 decía PRO = **ARS 4.500/mes**; el seed siembra `999900` = **ARS 9.999**.
**Estado:** ✅ RESUELTO 2026-06-22 — el dueño confirmó **ARS 9.999**; master-doc corregido (§0, §4.2,
§10). El seed ya estaba en 9.999.

**A2 — Pisos de coach (`min_coach_price`) no coinciden con la spec**
Spec §5/§13: piso paquete coach AR ≈ **$29.900**; seed AR = `500000` = **$5.000** (un orden de
magnitud menos). Rompe en la práctica la regla innegociable #4 (precio coach ≥ piso del país).
**Estado:** REQUIERE_DECISIÓN — definir pisos canónicos por país/tier.

**A3 — Scope creep no trazado: ratings/reviews de coach implementados**
`CLAUDE.md` ("NO IMPLEMENTAR EN V1") y master-doc §15/§21 marcan ratings como V2. Pero existen
`20260617200001_coach_ratings.sql` + `20260617200002_coach_feedback.sql` y UI real (mobile
`marketplace/[coachId].tsx`, web `admin/coaches/[id]/page.tsx`). A diferencia de i18n/tabata/
live_sessions, **no hay entrada de aprobación en `open-questions.md`**.
**Estado:** REQUIERE_DECISIÓN — aprobar y registrar el desvío, o remover de V1.

**A4 — `docs/security-review.md` obsoleto y contradice el estado real**
Fechado 2026-06-10: marca la firma HMAC del webhook como TODO/RIESGO ALTO (ya implementada y
verificada según HANDOFF + runbooks) y lista "25 tablas RLS" con nombres que **no existen** en el
schema real (`conversations`, `check_ins`, `session_sets`, `invoices`…) omitiendo ~15 que sí
existen. Un lector lo tomaría como bloqueante abierto.
**Estado:** ARREGLABLE (doc) — reescribir o marcar como histórico.

**A5 — `docs/GO-LIVE.md` desactualizado: "4 migraciones / 4 buckets" vs 26 reales**
El checklist de go-live aplicaría una fracción del schema. Relacionado con A0.
**Estado:** ARREGLABLE (doc).

### 🟠 MEDIA

**M-SEC1 — `supabase/functions/.env` con credenciales reales en disco**
Contiene `MP_ACCESS_TOKEN` (TEST), `MP_WEBHOOK_SECRET` (64 hex), `MP_PUBLIC_KEY`. NO está
trackeado en git (cubierto por `.gitignore`), riesgo de leak por commit = nulo hoy, pero es
higiene: rotar y mover el secret a Supabase secrets; usar solo `.env` raíz para dev.
**Estado:** REQUIERE_DECISIÓN (rotación de credenciales la hace Facu).

**M-SEC2 — `requireAdmin()` dev-bypass frágil**
`apps/web/lib/auth/admin.ts:38-47` y `middleware.ts:57`: el bypass se activa si la URL de Supabase
está vacía o contiene "placeholder". Frágil: una URL real con "placeholder" en el nombre activaría
el bypass. Cambiar a `NODE_ENV==='development'` o flag explícito `NEXT_PUBLIC_DEV_MODE`.
**Estado:** ARREGLABLE (bien-definido).

**M-SEC3 — `/api/mp-preapproval` usa `getSession()` en vez de `getUser()`**
`apps/web/app/api/mp-preapproval/route.ts:22`: `getSession()` no verifica firma del JWT server-side.
La Edge Function re-valida con `getUser()` (defensa en profundidad), pero el primer gate debería ser
robusto.
**Estado:** ARREGLABLE (bien-definido).

**M-BIZ1 — Comisión: fallback hardcodeado `?? 0.20`**
`supabase/functions/generate-settlements/index.ts:78`: si falta `country_config` cae a `0.20`
hardcodeado en vez de fallar. Viola "jamás hardcodeada" (regla #1). Debe lanzar error/saltar y
loguear, como hace el trigger `check_coach_package_price()`.
**Estado:** ARREGLABLE (bien-definido).

**M-BIZ2 — "Comisión NUNCA revierte" sin enforcement en DB (regla #5)**
La transición fixed→comision tiene trigger, pero no hay guarda que impida `UPDATE coach_profiles
SET billing_model='fixed'`. Un owner podría revertir vía backoffice. Falta trigger BEFORE UPDATE
en `coach_profiles`.
**Estado:** ARREGLABLE (bien-definido).

**M-BIZ3 — Free: límite de 3 rutinas sin constraint server-side (regla #2)**
`apps/mobile/app/(tabs)/routines.tsx:114` tiene guard de UI, pero `routine/new.tsx` inserta sin
chequear; un usuario que saltee la app por API crea rutinas ilimitadas. Falta trigger/RLS
WITH CHECK.
**Estado:** ARREGLABLE (bien-definido).

**M-BIZ4 — Free: historial 10 días truncado client-side, no en QUERY (regla #2)**
`apps/mobile/services/workoutHistory.ts:39-45`: usa `.limit(30)` sin `.gte("started_at", hace10d)`;
el filtro de 10 días se aplica en JS tras traer datos. Spec dice "truncar en QUERY". Dato no se
borra (ok), pero cruza la red de más.
**Estado:** ARREGLABLE (bien-definido).

**M-DOC1 — Conteos de tests inconsistentes entre docs**
RLS: 23 / 32 / 48 / 56 según el doc (real: **63**). Unit: 30 / 48 / 55 (real: **271 core + 127 ui**).
README anclado en cifras viejas.
**Estado:** ARREGLABLE (doc) — congelar números reales.

**M-DOC2 — Conteo de entidades de datos contradictorio**
master-doc "26", security-review "25" (nombres erróneos), fase-1-audit "22"; real ~36 `CREATE TABLE`.
**Estado:** ARREGLABLE (doc).

**M-DOC3 — Pendientes de seguridad de open-questions no escalados a GO-LIVE**
dev-bypass de `requireAdmin()` y rate limiting `/api/admin/*` ("antes del go-live") no figuran en
`GO-LIVE.md`.
**Estado:** ARREGLABLE (doc).

**M-DOC4 — Tabata persiste datos: master-doc (fuente de verdad) sigue diciendo lo contrario**
§6.5/Ficha 2.1.12 dice "no persiste"; ahora persiste por decisión del dueño (registrado en
open-questions, pero el master-doc no se actualizó). Un `product-spec-guardian` marcaría FAIL.
**Estado:** ARREGLABLE (doc).

**M-TEST1 — E2E Playwright de backoffice solo "pasa" en dev-bypass; roto contra auth real**
Los specs `coach-backoffice.spec.ts` / `admin-backoffice.spec.ts` están diseñados para correr en
modo dev-bypass (URL Supabase con "placeholder", sin auth gate). Contra Supabase local real:
(1) el helper `fillLoginForm` navega a `/auth/login` — **ruta inexistente** (el login está en
`/login`); (2) el probe `isDevMode` chequea `/auth/login` mientras la app redirige a `/login`, así
que no skipea y busca elementos en la página de login → 35 FAIL; (3) los selectores usan
`getByRole('textbox', {name:/contrase/i})` pero el input es `type=password` (sin rol textbox) y los
`<label>` no están asociados al input (sin `htmlFor`/`id`). Resultado: el "E2E PASS" de los docs
provenía de corridas en dev-bypass, no validó la app autenticada real.
**Estado:** ARREGLABLE (harness) — corregir ruta de login, probe y selectores; usar los usuarios
smoke reales. (El smoke real por rol de esta auditoría se hizo con un driver propio — ver Fase 4.)
Sub-hallazgo accesibilidad: los `<label>` del login sin `htmlFor` → BAJA (a11y).

**M-DOC5 — Live sessions (V2) implementadas en V1 con cron N21 sin terminar**
Desvío aprobado en open-questions, pero N21 (cron "sesión en 30 min") sigue HUMAN_REQUIRED →
feature a medias. `auditoria-final.md` aún dice "no implementar".
**Estado:** REQUIERE_DECISIÓN (cron N21) + ARREGLABLE (doc).

### 🟡 BAJA

**B-LINT — mobile: 285 warnings de ESLint** (0 errores). Mayormente `no-unsafe-*` por el cliente
Supabase tipado como `any` y `no-unnecessary-type-assertion`. Higiene; no bloquea.
**Estado:** ARREGLABLE (parcial, mecánico).

**B-SEC1 — Rate limiting ausente** en `/api/leads` y `/api/mp-preapproval` (TODO documentado).
**Estado:** REQUIERE_DECISIÓN (hardening pre-prod).

**B-SEC2 — CORS `Allow-Origin: *`** en `coach-checkout`, `cancel-coach-plan`, `delete-account`
(requieren Authorization, riesgo bajo). Restringir al dominio de prod.
**Estado:** ARREGLABLE.

**B-DOC1 — Carpetas `docs/` huérfanas** (`architecture`, `decisions`, `product`, `qa`, `prompts`)
solo con `.gitkeep`; el subagente `docs-maintainer` apunta a `docs/decisions` que está vacío.
**Estado:** ARREGLABLE (doc).

**B-DOC2 — README "Estado actual" congelado en 2026-06-14**, se detiene en Fase 6 / "smoke PENDING"
mientras existen F7–F20.
**Estado:** ARREGLABLE (doc).

**B-DOC3 — `country_config`: spec §13 modela `coach_floor jsonb` por tier; DB usa un único
`min_coach_price INTEGER`** (sin desglose por tier).
**Estado:** REQUIERE_DECISIÓN (si se quiere piso por tier).

**B-BIZ1 — Display fallback "$ 9.999"** hardcodeado en `upgrade/PriceBlock.tsx:19,34` para estados
de error (no entra en cálculos). Cosmético, pero puede confundir.
**Estado:** ARREGLABLE.

---

## Lo que está BIEN (verificado)

- Comisión **20%** consistente en master-doc, CLAUDE.md, seed (`commission_rate=0.2000`), runbooks y
  tests. No aparece 15% en ningún lado operativo.
- RLS habilitado en **todas** las tablas (~36); `audit_log` y `processed_events` genuinamente
  append-only (`REVOKE UPDATE, DELETE`).
- Webhooks (MP + RevenueCat) con firma HMAC/Bearer en tiempo constante + idempotencia atómica
  (`INSERT ON CONFLICT` sobre `processed_events.event_id`).
- Buckets `progress-photos`, `fiscal-docs`, `invoices`, `videos` **privados** + signed URLs TTL 3600s.
- Parental consent <18 → 403 en checkout coach: enforcement en 3 capas (Edge Function, SSR, core).
- Sin factura aprobada no hay "transferido": trigger DB + `canTransferSettlement` en core (6 tests).
- Dinero en enteros (todas las columnas monetarias INTEGER); redondeo solo en core/billing.
- PRO IAP mobile / MP web; paquetes de coach SOLO MP (sin path IAP).
- Secretos no commiteados; sin datos sensibles en logs.

---

## Fase 3 — Re-verificación automatizada (evidencia)

- `pnpm typecheck` → 6 tasks successful (8 paquetes), exit 0.
- `pnpm lint` → web "No ESLint warnings or errors"; mobile 285 warnings / 0 errors; exit 0.
- `pnpm test` → core 14 files / 271 pass + 5 skip; ui 127 pass; cobertura All files 96.29%
  (billing 98.42%, gating 100%); exit 0.
- `pnpm test:rls` → `Files=1, Tests=63, Result: PASS`; exit 0.
- `pnpm e2e` (Playwright) → **45 passed, 35 failed, 1 skipped** (exit 1). Ver M-TEST1: los 35
  fallos son del harness, no de producto.

## Fase 4 — Smoke test por rol

Hecho con un driver Playwright propio (`scripts/_audit-smoke.mjs`, temporal) logueado con cada
usuario fixture real (`*.smoke@forzza.app` / `ForzzaSmoke123!`) contra el web local (localhost:3000
→ Supabase local). Se eligió este camino porque el e2e oficial solo corre en dev-bypass (ver
M-TEST1). Resultados:

**Admin (owner.smoke)** — login OK → `/admin/dashboard`. 10/10 páginas cargan (dashboard, coaches,
usuarios, auditoría, pagos, liquidaciones, configuración, tickets, videos). Hallazgos:
- `/admin/videos`: **146 errores CSP** — thumbnails `img.youtube.com` bloqueados por `img-src`.
  → ARREGLADO (CSP en `next.config.ts`).
- `/admin/tickets`: `FORMATTING_ERROR` de i18n — el string `tickets.subtitle` (es.json) usaba
  `{openPlural}` no provisto. → ARREGLADO (ICU plural en `es.json`).

**Coach (coach.smoke)** — login OK → `/coach/alumnos`. checkins, perfil, cobros cargan OK; pero
alumnos, rutinas y calendario rotas por A6 (PGRST200). → ARREGLÁNDOSE.

**Alumno (alumno.smoke)** — páginas públicas (/, /coaches, /upgrade) OK. Pero el **login web manda
al alumno a `/coach`** (login/page.tsx:79 redirige a `/coach` si el rol no es owner), que rechaza
al student → rebota a `/login`. El alumno no tiene destino propio en web (la app del alumno es
mobile, por diseño), pero el redirect debería mandarlo a una landing/PWA válida, no a `/coach`.
**Estado:** REQUIERE_DECISIÓN (destino del alumno en web) — BAJA/MEDIA UX.

**Mobile (Expo):** AVD `forzza_pixel` disponible pero no se completó el arranque del emulador en
esta corrida (pesado/frágil por RAM, riesgo anticipado en el plan). La batería de unit/typecheck de
`apps/mobile` SÍ corrió (typecheck PASS; 285 warnings de lint). Smoke en emulador queda como
seguimiento. **Estado:** PARCIAL.

---

## Acciones tomadas en esta auditoría (Fase 5)

Hechas por mí (código, verificado):
- **CSP YouTube** (`apps/web/next.config.ts`): `img-src` ahora permite `https://img.youtube.com` y
  `https://i.ytimg.com`. Arregla los 146 errores de `/admin/videos`.
- **i18n tickets** (`apps/web/messages/es.json`): `tickets.subtitle` reescrito con ICU plural;
  elimina el `FORMATTING_ERROR`. JSON revalidado OK.
- **M-SEC3** (`apps/web/app/api/mp-preapproval/route.ts`): `getSession()` → `getUser()` (verifica
  firma del JWT) en el gate de checkout PRO.
- **M-BIZ1** (`supabase/functions/generate-settlements/index.ts`): eliminado el fallback
  hardcodeado `?? 0.20`; ahora omite la liquidación y loguea si falta `country_config` (regla #1).

Delegadas y verificadas por mí:
- **A6** (web-next-engineer, commit `151004a`): fix del embed `student_profiles` en los 7 archivos
  del backoffice coach. Verificado: páginas rinden con 0 errores; typecheck verde.
- **Drift de documentación** (docs-maintainer, commit `6399363`): security-review, GO-LIVE, README,
  master-doc (Tabata), y +5 entradas en open-questions (precios, pisos, ratings, cloud sync, N21).

Commits de esta auditoría:
- `151004a` fix(coach): embed student_profiles roto (PGRST200)
- `6399363` docs: conciliar documentación con estado real
- `fe9e019` fix(web,billing): CSP YouTube, i18n tickets, getUser checkout PRO, comisión sin hardcode

Estado final de la batería tras los fixes: typecheck 6/6 PASS, unit 271+127 PASS, RLS 63 PASS.

Pendientes para Facu (REQUIERE_DECISIÓN / migraciones — no tocados):
- A0 cloud sync (db push de 18 migraciones), A1 precio PRO, A2 pisos coach, A3 ratings, M-SEC1
  rotación de credenciales, M-SEC2 mecanismo dev-bypass, M-BIZ2/M-BIZ3 (nuevos triggers/migraciones
  para "no revierte comisión" y límite de 3 rutinas server-side — conviene batchearlos con A0),
  destino del alumno en login web.
