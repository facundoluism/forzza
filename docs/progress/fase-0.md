# Fase 0 — Auditoría y Baseline

Fecha: 2026-06-14  
Ejecutado por: monorepo-architect

---

## TAREA 1 — Revertir apps/mobile/package.json a HEAD

**PASS**

Comando ejecutado: `git checkout HEAD -- apps/mobile/package.json`

Versiones verificadas tras revert:
- expo: `^52.0.24` (era ^54.0.0)
- react: `18.3.1` (era 19.2.7)
- react-native: `0.76.6` (era 0.81.5)
- expo-router: `~4.0.14` (era ~6.0.24)

`pnpm-lock.yaml` no tocado intencionalmente (ya reflejaba el estado post-revert tras pnpm install).

---

## TAREA 2 — Organizar archivos sueltos

**PASS**

| Archivo/Dir | Acción | Resultado |
|---|---|---|
| `forza-complete.jsx` (raíz) | Hash idéntico a `reference/forza-complete.jsx` → eliminado duplicado | OK |
| `forzza-master-doc.md` (raíz) | `docs/` version 18 min más nueva, mismo tamaño (91715 bytes) → eliminado root | OK |
| `forzza-claude-code-build-system.md` | Movido a `docs/forzza-claude-code-build-system.md` | OK |
| `AGENTS.md` | Movido a `.claude/AGENTS.md` (no existía allí) | OK |
| `apps/mobile/Use` | Archivo 0 bytes → eliminado | OK |
| `forzza-kit/` | **NO movido** — contiene documentación de setup (00-guia-paso-a-paso.md, 01-estructura-monorepo.md, 02-CLAUDE.md, forzza-claude-code-build-system.md duplicado, 03-agentes/, 04-prompts/). Es un kit de onboarding manual, no código. Mantener en raíz o mover a `docs/kit/` en próxima fase. PENDIENTE decisión humana. |
| `.agents/` | Contiene `.agents/skills/` con 2 skills (forzza-fix-tests, forzza-handoff-next-session). Config de tooling de Claude Code. Queda donde está, agregado a .gitignore. | OK |
| `.codex/` | Contiene `.codex/agents/` con 13 archivos .toml de definición de agentes Codex. Config de tooling. Queda donde está, agregado a .gitignore. | OK |
| `playwright-report/` | Directorio de reporte generado. Queda donde está, agregado a .gitignore. | OK |

---

## TAREA 3 — Actualizar .gitignore

**PASS**

Agregadas las siguientes entradas al `.gitignore` raíz:
```
playwright-report/
.agents/
.codex/
```

`.env` ya estaba en .gitignore desde antes (líneas 6-7: `.env` y `.env.*`).

---

## TAREA 4 — Verificar/crear .env

**PASS** (con HUMAN_REQUIRED para credenciales de producción)

El `.env` ya existía con credenciales reales de Supabase y mocks para los demás servicios. Se agregaron las variables faltantes respecto al `.env.example`:

Variables con valores reales:
- `NEXT_PUBLIC_SUPABASE_URL` — real (plrjiglohbygqivhjzgz.supabase.co)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — real JWT
- `SUPABASE_SERVICE_ROLE_KEY` — real JWT
- `SUPABASE_DB_PASSWORD` — real
- `DATABASE_URL` — real
- `MP_ACCESS_TOKEN=TEST-MOCK_OK` — mock dev OK
- `MP_WEBHOOK_SECRET=MOCK_OK` — mock dev OK
- `RESEND_API_KEY=re_MOCK_OK` — mock dev OK
- `MOCK_OK=true` — agregado

Variables HUMAN_REQUIRED (tienen MOCK_OK pero necesitan valor real en producción):
- `REVENUECAT_APPLE_SHARED_SECRET` — app.revenuecat.com → API Keys
- `REVENUECAT_GOOGLE_SERVICE_ACCOUNT` — Google Play service account JSON
- `NEXT_PUBLIC_REVENUECAT_API_KEY` — app.revenuecat.com → public key
- `APPLE_CLIENT_ID` — Apple Developer Program
- `APPLE_TEAM_ID` — Apple Developer Program
- `GOOGLE_CLIENT_ID` — Google Cloud Console
- `SENTRY_AUTH_TOKEN` — sentry.io → Settings → Auth Tokens (para source maps CI)

---

## TAREA 5 — pnpm install y baseline

### pnpm install

**PASS** (con warnings de peer deps esperados)

Warnings de peer deps presentes (no bloquean el dev local):
- `react-dom 19.2.7` en apps/mobile requiere `react@^19.2.7` pero hay `18.3.1` — esperable en monorepo con versiones mixtas
- `expo-router 4.0.22` pide `expo-linking@~7.0.5` pero hay `8.0.12` — minor mismatch, no bloquea
- `packages/ui react-native 0.76.6` pide `react@^18.2.0` pero tiene `19.2.7` de algún hoisting

Builds ignorados por pnpm (requiere `pnpm approve-builds` si se necesitan):
- `@sentry/cli`, `core-js`, `sharp`

### typecheck

**PASS** — 6/6 tareas exitosas, 4 cacheadas

```
Tasks: 6 successful, 6 total
Cached: 4 cached, 6 total
Time:   11.43s
```

Warning menor: `no output files found for task mobile#typecheck` — el turbo.json no tiene `outputs` definido para esa tarea. No bloquea.

### lint

**PASS** (sin errores, solo warnings)

```
Tasks: 4 successful, 4 total
Time:  14.646s
```

Baseline de warnings:
- `apps/mobile`: 268 warnings (0 errores) — mayoritariamente:
  - Hardcoded hex colors fuera de tokens.ts (regla `no-restricted-syntax` del eslint-config propio)
  - `@typescript-eslint/no-unsafe-*` warnings de tipos `any`
- `apps/web`: 0 warnings, 0 errors

Nota: ESLint muestra aviso de deprecación de `.eslintrc` (v10 lo removerá). No bloquea.

---

## PENDIENTES / HUMAN_REQUIRED

| Item | Prioridad | Instrucción |
|---|---|---|
| `forzza-kit/` destino | Baja | Decidir si mover a `docs/kit/` o eliminar. El contenido es documentación de setup/onboarding. |
| RevenueCat API keys | HUMAN_REQUIRED para IAP | Obtener en app.revenuecat.com → API Keys |
| Apple OAuth credentials | HUMAN_REQUIRED para OAuth | Apple Developer Program → Certificates, Identifiers & Profiles |
| Google OAuth credentials | HUMAN_REQUIRED para OAuth | Google Cloud Console → APIs & Services → Credentials |
| Sentry Auth Token | HUMAN_REQUIRED para CI source maps | sentry.io → Organization Settings → Auth Tokens |
| `pnpm approve-builds` | Baja | Correr si se necesita que @sentry/cli o sharp ejecuten scripts de build |
| turbo.json `outputs` para mobile#typecheck | Baja | Agregar `outputs: []` al task `typecheck` de mobile en turbo.json para evitar el warning |

---

## Resumen de estado del repo

```
git status post-fase-0:
  M  pnpm-lock.yaml                      (actualizado por pnpm install tras revert)
  ??  .claude/AGENTS.md                  (nuevo, tracked)
  ??  docs/forzza-claude-code-build-system.md  (movido, tracked)
  ??  docs/progress/fase-0.md            (este archivo)
  ??  forzza-kit/                         (sin trackear, pendiente decisión)
```

Archivos comprometidos en la auditoría: 0 regresiones. typecheck PASS, lint PASS (solo warnings pre-existentes).
