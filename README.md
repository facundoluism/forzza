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

## Estado actual (2026-06-14)

La plataforma está al 85% funcional para staging. TypeScript compila en 0 errores (6/6 paquetes). Los 48 tests unitarios de reglas de negocio pasan al 100%. Las 10 Edge Functions de Supabase tenían bugs de columnas que fueron corregidos. Las 13 reglas de negocio innegociables están implementadas y verificadas.

Lo que falta son acciones de infraestructura fuera del código: credenciales reales (Mercado Pago, RevenueCat, Resend, Sentry), Docker + Supabase CLI para ejecutar los 23 tests de RLS (Row Level Security), y assets mobile finales de diseño. Ver `docs/progress/auditoria-final.md` para la tabla completa de funcionalidades y la lista HUMAN_REQUIRED.

Problemas pendientes menores: `pnpm lint` falla en `packages/ui` y `packages/core` por ausencia de `eslint` en devDependencies (no afecta runtime ni builds). Los textos legales en `/legales/terminos` y `/legales/privacidad` son DRAFT y requieren revisión de abogado antes del launch.

## Fases completadas

- [x] Fase 0 — Higiene: revert mobile, organizar archivos, .env
- [x] Fase 1 — Schema alignment: migración DB, db-types, 10 edge functions
- [x] Fase 2 — Mobile bootstrap: fuentes Google, splash screen, Sentry
- [x] Fase 3 — Web V1: checkout coach web, cobros, gráfico alumnos
- [x] Fase 4 — Reglas de negocio: 48 tests, HMAC webhooks, idempotencia atómica
- [x] Fase 6 — UI/UX: active state sidebars, logo, empty states, contraste
- [ ] Smoke test — PENDING (requiere servidor activo)

## Docs clave

- `CLAUDE.md` — Instrucciones para Claude Code
- `docs/forzza-master-doc.md` — Fuente de verdad del producto (HUMAN_REQUIRED)
- `docs/progress/` — Reportes PASS/FAIL por fase
- `docs/open-questions.md` — Ambigüedades registradas
