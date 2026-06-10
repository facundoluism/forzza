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

## Fases completadas

- [x] Fase 0 — Setup del repo
- [ ] Fase 1 — Monorepo, tooling y CI
- [ ] Fase 2 — Supabase schema, RLS y seeds
- [ ] Fases 3-20 — Ver docs/progress/

## Docs clave

- `CLAUDE.md` — Instrucciones para Claude Code
- `docs/forzza-master-doc.md` — Fuente de verdad del producto (HUMAN_REQUIRED)
- `docs/progress/` — Reportes PASS/FAIL por fase
- `docs/open-questions.md` — Ambigüedades registradas
