# Forzza

Plataforma fitness de 3 caras: app móvil del alumno (Expo iOS+Android), web Next.js (landing + PWA + /coach + /admin), backend Supabase.

## Arranque rápido (después de Fase 1)

```bash
# Instalar dependencias
pnpm install

# Desarrollo (todo)
pnpm dev

# Solo web
pnpm dev:web

# Solo mobile
pnpm dev:mobile

# Tests
pnpm test
pnpm test:rls
pnpm typecheck
pnpm lint

# Base de datos local (requiere Docker)
pnpm db:reset
pnpm db:types
```

## Estructura

```
forzza/
├── apps/mobile/     # App del alumno (Expo)
├── apps/web/        # Landing, PWA, /coach, /admin (Next.js)
├── packages/        # Código compartido
├── supabase/        # Esquema, RLS, Edge Functions
├── docs/            # Documentación y progreso de fases
└── reference/       # Prototipo visual (solo referencia, no importar)
```

## Estado actual (2026-06-22)

Las fases F0–F20 están completas. El código compila y todos los tests pasan:

- TypeScript: 6/6 paquetes PASS (0 errores)
- Tests unitarios: 271 passed + 5 skipped en @forzza/core (14 archivos); 127 en @forzza/ui
- Cobertura @forzza/core: 96.29% global — billing 98.42%, gating 100%
- Tests RLS (pgTAP): 63 assertions PASS (`pnpm test:rls`, archivo `supabase/tests/rls_test.sql`)
- Lint: web 0 warnings; mobile 285 warnings (0 errores, no afectan runtime)
- Migraciones: 26 archivos en `supabase/migrations/`; ~36 tablas con RLS habilitado; 4 buckets privados

Las reglas de negocio innegociables están implementadas y verificadas. La firma HMAC de webhooks MP está implementada. El backoffice del dueño (/admin) y del coach (/coach) están funcionales.

Pendientes antes del go-live (fuera del código): credenciales reales de producción (Mercado Pago, RevenueCat, Resend, Sentry, MP_WEBHOOK_SECRET), sincronizar 18 migraciones pendientes al cloud (decisión del dueño), assets mobile finales de diseño, hardening de requireAdmin() y rate limiting. Ver `docs/GO-LIVE.md` para el checklist completo y `docs/open-questions.md` para decisiones pendientes del dueño.

Los textos legales en `/legales/terminos` y `/legales/privacidad` son DRAFT y requieren revisión de abogado antes del launch.

## Fases completadas

- [x] Fase 0 — Higiene: revert mobile, organizar archivos, .env
- [x] Fase 1 — Schema alignment: migración DB, db-types, 10 edge functions
- [x] Fase 2 — Mobile bootstrap: fuentes Google, splash screen, Sentry
- [x] Fase 3 — Web V1: checkout coach web, cobros, gráfico alumnos
- [x] Fase 4 — Reglas de negocio: 271 tests core + 127 ui, HMAC webhooks, idempotencia atómica
- [x] Fase 5 — RLS: 63 tests pgTAP PASS, tabata_plans, live_sessions, coach_ratings
- [x] Fase 6 — UI/UX: active state sidebars, logo, empty states, contraste
- [x] Fases 7–20 — Notificaciones, Tabata, backoffice admin/coach, videos, auditoria
- [ ] Smoke test — PENDING (requiere servidor activo con credenciales de producción)

## Docs clave

- `CLAUDE.md` — Instrucciones para Claude Code
- `docs/forzza-master-doc.md` — Fuente de verdad del producto (HUMAN_REQUIRED)
- `docs/progress/` — Reportes PASS/FAIL por fase
- `docs/open-questions.md` — Ambigüedades registradas
