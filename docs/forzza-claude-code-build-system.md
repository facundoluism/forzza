# Forzza — Claude Code Build System

**Versión 1.0 · Junio 2026 · Compatible con `docs/forzza-master-doc.md` v1.0 (comisión 20%, V1 = Argentina, decisiones firmes §21).**

---

## 0. Resumen operativo

Este sistema convierte la construcción de Forzza en una secuencia de 21 fases (Fase 0 a 20) que ejecutás pegando prompts en Claude Code sobre Windows 11. El hilo principal corre con **Opus 4.8** y actúa solo como orquestador: lee specs, delega, revisa y decide. La implementación corre en **subagentes Sonnet** especializados por dominio (13 agentes en `.claude/agents/`), lo que reduce el costo del ~80% del trabajo. Cada fase tiene un prompt autocontenido con archivos permitidos/prohibidos, tests obligatorios y Definition of Done; al cerrar, el agente de QA o docs genera `docs/progress/<fase>.md` con PASS/FAIL por criterio, que funciona además como memoria externa entre sesiones (abrís sesión nueva por fase con `/clear`, sin arrastrar contexto). Entre hitos críticos hay 6 prompts de revisión exclusivos de Opus, y hay 15 prompts de recuperación para cuando algo se rompe. Lo que no se puede automatizar (cuentas Apple/Google, claves de Mercado Pago, decisiones legales/fiscales, testers, marca) está listado con su momento exacto y con lo que Claude Code te deja preparado para que tu intervención sea de minutos. Tu rutina por fase: resolver el checkpoint humano si lo hay → `/clear` → pegar el prompt → revisar `docs/progress/` → probar el "listo si…" → commit/push → siguiente fase.

---

## 1. Preparación Windows 11

Todos los comandos son para **PowerShell** (no CMD). Abrí PowerShell normal salvo donde se indique "como administrador".

### 1.1 Instalación base

```powershell
# 1) Verificar Git (si falla el comando, instalarlo)
git --version
winget install --id Git.Git -e            # solo si no estaba

# 2) Node.js 22 LTS (verificar; instalar si falta o si es < 20)
node --version
winget install --id OpenJS.NodeJS.LTS -e  # cerrar y reabrir PowerShell después

# 3) pnpm (vía corepack, viene con Node)
corepack enable
corepack prepare pnpm@latest --activate
pnpm --version

# 4) Claude Code
npm install -g @anthropic-ai/claude-code
claude --version

# 5) VS Code (recomendado)
winget install --id Microsoft.VisualStudioCode -e

# 6) Docker Desktop — necesario para Supabase local (motor Postgres)
winget install --id Docker.DockerDesktop -e
# Abrir Docker Desktop una vez y dejarlo corriendo. Verificar:
docker ps

# 7) Supabase CLI
npm install -g supabase
supabase --version
```

### 1.2 Crear el proyecto

```powershell
# Carpeta SIN espacios y fuera de OneDrive (evita locks y paths problemáticos)
mkdir C:\dev\forzza
cd C:\dev\forzza
git init
git config core.autocrlf false        # ver 1.4 line endings

# Identidad git
git config user.name "Facu"
git config user.email "tu@email.com"
```

### 1.3 Variables de entorno

Las credenciales NUNCA van al repo. El flujo: la Fase 1 genera `.env.example` documentado; vos copiás:

```powershell
Copy-Item .env.example .env
notepad .env    # pegar las claves que tengas; las que falten quedan vacías (hay mocks)
```

### 1.4 Problemas comunes en Windows y su solución

| Problema | Síntoma | Solución |
|---|---|---|
| Política de ejecución | "running scripts is disabled" al usar pnpm/claude | PowerShell **como administrador**: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| Rutas con espacios | builds fallan con paths cortados | Proyecto en `C:\dev\forzza` (sin espacios, sin OneDrive/Dropbox) |
| PowerShell vs CMD | `&&` no funciona en PowerShell viejo | Usar PowerShell 7 (`winget install Microsoft.PowerShell`) o los scripts del repo (usan npm-run-all, no `&&`) |
| Line endings CRLF/LF | diffs gigantes, hooks fallan | `git config core.autocrlf false` + el repo trae `.gitattributes` con `* text=auto eol=lf` (lo crea Fase 1) |
| Paths largos | "path too long" en node_modules | PowerShell admin: `git config --system core.longpaths true` y habilitar long paths: `New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force` |
| Permisos al borrar node_modules | EBUSY/EPERM | Cerrar VS Code/Expo, luego `pnpm dlx rimraf node_modules` |
| Docker no arranca | `docker ps` falla | Abrir Docker Desktop, esperar "Engine running"; habilitar WSL2 backend si lo pide |
| Firewall en Expo | el teléfono no ve el QR | Permitir Node.js en el firewall (aviso de Windows al primer `pnpm dev:mobile`) y usar la misma red Wi-Fi |
| Variables de entorno de sesión | una herramienta no ve el PATH nuevo | Cerrar y reabrir PowerShell tras cada `winget install` |

### 1.5 Verificación final y arranque

```powershell
cd C:\dev\forzza
node --version; pnpm --version; git --version; docker ps; supabase --version; claude --version
# Tras la Fase 1 existirán estos comandos:
pnpm install
pnpm dev          # levanta web + mobile
pnpm test         # unit
pnpm typecheck
```

Para abrir Claude Code siempre: `cd C:\dev\forzza` → `claude` → `/model` → **Opus 4.8** en el hilo principal (los subagentes ya están fijados en Sonnet por archivo).

---

## 2. Monorepo objetivo

```
forzza/
├── CLAUDE.md                      # memoria de proyecto (sección 3)
├── CLAUDE.local.example.md        # plantilla de notas locales (gitignoreado el real)
├── .env.example                   # todas las variables documentadas; el .env real NO se commitea
├── package.json  pnpm-workspace.yaml  turbo.json  .gitattributes  .gitignore  README.md
├── .claude/
│   ├── agents/                    # 13 subagentes (sección 4)
│   ├── commands/                  # comandos /forzza-* (sección 5)
│   ├── rules/                     # reglas cortas referenciadas por agentes (scope, commits)
│   └── settings.json              # permisos de herramientas pre-aprobados del proyecto
├── .github/workflows/             # ci.yml (lint+typecheck+unit+rls+e2e), preview deploys
├── docs/
│   ├── forzza-master-doc.md       # FUENTE DE VERDAD (ya existe)
│   ├── architecture/              # ADRs y diagramas que genera el orquestador
│   ├── product/                   # specs derivadas (copys finales, matrices)
│   ├── qa/                        # planes y reportes de suites
│   ├── progress/                  # UN archivo por fase: PASS/FAIL por criterio (memoria externa)
│   ├── prompts/                   # copia de los prompts de este sistema (referencia)
│   ├── decisions/                 # decisiones tomadas en ejecución (qué, por qué, quién)
│   ├── runbooks/                  # operación: deploy, rotación de claves, soporte
│   └── open-questions.md          # ambigüedades registradas en vez de asumidas
├── reference/
│   ├── forza-complete.jsx         # prototipo: referencia VISUAL, jamás se importa
│   └── ejercicios-234.xlsx        # seed de exercise_library
├── apps/
│   ├── mobile/                    # Expo + expo-router + TS estricto (app del ALUMNO)
│   └── web/                       # Next.js App Router: (landing) + (pwa)/app + /coach + /admin + /onboarding-coach
├── packages/
│   ├── core/                      # lógica pura: billing, gating, schemas Zod (sin React)
│   ├── ui/                        # tokens + componentes native/ y web/ con la misma API
│   ├── db-types/                  # tipos generados con `supabase gen types` (solo generados, no editar a mano)
│   ├── config/                    # constantes no-secretas compartidas (feature flags V1)
│   ├── eslint-config/             # config ESLint compartida
│   └── tsconfig/                  # tsconfig base estricto compartido
├── supabase/
│   ├── migrations/                # SQL versionado (nunca editar una aplicada)
│   ├── functions/                 # Edge Functions Deno: webhook-mp, webhook-revenuecat, settlements-cron, dunning-cron, notify
│   ├── seed/                      # seed.sql + scripts de importación del Excel
│   └── tests/                     # tests de RLS e idempotencia (corren en CI)
├── scripts/                       # utilitarios Node cross-platform (db-reset, import-exercises)
├── tests/                         # unit/integration que no pertenecen a un package
└── e2e/
    ├── playwright/                # flujos web (/admin, /coach, landing)
    ├── maestro/                   # flujos mobile (.yaml)
    └── fixtures/                  # datos de prueba compartidos
```

### Ownership por carpeta

| Carpeta | Propósito | Modifica | Revisa | Qué NO va ahí |
|---|---|---|---|---|
| `apps/mobile` | App del alumno iOS/Android | mobile-expo-engineer | opus-orchestrator + product-spec-guardian | Lógica de negocio (va a core), colores hardcodeados, flujos de coach |
| `apps/web` | Landing, PWA, /coach, /admin, onboarding coach | web-next-engineer | opus + product-spec-guardian | Cálculos de dinero client-side, secretos |
| `packages/core` | Billing, gating, schemas Zod | payments-billing-engineer (billing) y web/mobile engineers (schemas/gating) | qa-automation-engineer | Dependencias de React o Supabase client |
| `packages/ui` | Design system | ui-design-system-engineer | mobile/web engineers (consumo) | Componentes de una sola app, lógica de datos |
| `packages/db-types` | Tipos generados | supabase-rls-engineer (regenera) | — | Ediciones manuales (se pisan) |
| `packages/config`, `eslint-config`, `tsconfig` | Tooling compartido | monorepo-architect | opus | Secretos, valores por país (van a DB) |
| `supabase/` | Esquema, RLS, functions, seeds, tests RLS | supabase-rls-engineer (+ payments-billing en webhooks) | security-privacy-reviewer | Migraciones editadas retroactivamente |
| `e2e/`, `tests/` | Suites | qa-automation-engineer | opus | Tests con secretos reales |
| `docs/progress`, `decisions`, `runbooks`, README | Memoria y operación | docs-maintainer | opus | Specs nuevas que contradigan el master doc |
| `docs/forzza-master-doc.md` | Fuente de verdad | **NADIE** (solo el humano) | product-spec-guardian | — |
| `.claude/` | Agentes, comandos, reglas | humano + monorepo-architect (solo si se le pide) | opus | — |
| `.github/workflows` | CI/CD | monorepo-architect | qa-automation-engineer | Deploys a prod sin aprobación humana |
| `reference/` | Prototipo y Excel | **NADIE** (solo lectura) | — | — |
| `scripts/` | Utilitarios cross-platform | monorepo-architect | — | bash-only, rm -rf |

---

## 3. `CLAUDE.md` raíz

Contenido completo del archivo (copiar tal cual a `forzza/CLAUDE.md`):

```markdown
# CLAUDE.md — Forzza

## Producto
Plataforma fitness de 3 caras: app móvil del ALUMNO (Expo iOS+Android), web Next.js (landing + PWA alumno + backoffice coach /coach + backoffice dueño /admin + onboarding coach web), backend Supabase. V1 = Argentina (Chile preparado en datos, no activo). Idioma UI: español rioplatense (voseo). Fuente de verdad: `docs/forzza-master-doc.md` (§6 reglas, §7 notificaciones, §11–12 criterios de aceptación, §13 datos, §14 API, §15 backlog). Prototipo `reference/forza-complete.jsx`: copiar DISEÑO, jamás arquitectura.

## Stack obligatorio (no proponer alternativas)
pnpm + Turborepo · Expo/React Native + expo-router · Next.js App Router · TypeScript ESTRICTO en todo · Supabase (Auth, Postgres+RLS, Storage, Realtime, Edge Functions Deno) · Mercado Pago (AR/CL) · RevenueCat (IAP PRO) · Expo Notifications · Resend · PostHog · Sentry · React Query + Zustand (NO Redux) · Tailwind solo web con tokens de packages/ui; StyleSheet en mobile.

## Comandos
`pnpm install` · `pnpm dev` / `dev:mobile` / `dev:web` · `pnpm test` · `pnpm test:rls` · `pnpm e2e` · `pnpm typecheck` · `pnpm lint` · `pnpm db:reset` (migra+seedea local; requiere Docker) · `pnpm db:types` (regenera packages/db-types). Entorno: Windows 11 → scripts SIEMPRE cross-platform (node/npm-run-all/rimraf; nunca bash-only ni rm -rf).

## Reglas de negocio innegociables
1. Comisión marketplace 20%, leída de `country_config`. Jamás hardcodear precios/comisiones.
2. Free: máx 3 rutinas, historial visible 10 días (truncar en QUERY, nunca borrar datos), autopromo 10 s pre-rutina/Tabata.
3. PRO: IAP (RevenueCat) en iOS/Android; Mercado Pago en web. Paquetes de coach: SOLO Mercado Pago vía web/browser, JAMÁS IAP.
4. Precio de coach ≥ piso del país (constraint DB + error inline).
5. Coach: sub fija → comisión al 4° alumno ACTIVO; NUNCA revierte.
6. Sin factura aprobada NO existe estado "transferido".
7. Menor de 18 sin `parental_consent_at` no llega al checkout de coach (403).
8. Alta de coach SOLO en web. La app móvil es del alumno.

## Arquitectura y seguridad
- Lógica de negocio en `packages/core` (pura, testeada) y en el servidor (RLS + Edge Functions). Las apps presentan.
- isPro()/hasCoach() se calculan server-side; el cliente solo cachea.
- RLS en TODAS las tablas. `audit_log` append-only registra TODA acción financiera o de validación.
- TODO webhook idempotente por event_id/payment_id (mismo evento ×3 = 1 efecto), con firma validada.
- Dinero en enteros (unidad mínima); redondeo solo en `core/billing`.
- Datos sensibles (fotos corporales, constancias, facturas): buckets PRIVADOS, URLs firmadas TTL 1 h, nunca en logs/analytics/consola.
- Secretos solo en `.env` (gitignoreado) y dashboards. Si falta una credencial: adaptador + mock + `.env.example` + test; JAMÁS inventar valores.

## QA y commits
- Toda pantalla crítica: loading, empty, error y success states (componentes de packages/ui).
- Toda regla de negocio: test unitario. Cobertura ≥80% en core/billing y core/gating. RLS testeada por accesos cruzados prohibidos.
- Commits pequeños y convencionales: `feat(F7): workout offline queue`. Un PR/commit-set por historia. Nada se mergea con tests rojos.

## NO IMPLEMENTAR EN V1
Grupos/comunidad, sesiones en vivo, nutrición, escáner IA de fichas, ratings/reviews, Stripe, UI/flujos de promotores (tablas sí), Apple Health/Google Fit, export CSV avanzado, Brasil. Si una tarea lo pide, es scope creep: rechazar y anotar en `docs/open-questions.md`.

## Subagentes (optimización de costo)
Este hilo (Opus) SOLO planifica, delega con Task tool, revisa diffs y decide. Implementan los subagentes Sonnet de `.claude/agents/`: monorepo-architect, supabase-rls-engineer, mobile-expo-engineer, web-next-engineer, ui-design-system-engineer, payments-billing-engineer, notifications-realtime-engineer, qa-automation-engineer, release-store-engineer, docs-maintainer; verifican product-spec-guardian y security-privacy-reviewer (read-only). Paralelizar subagentes solo si no comparten archivos.

## Protocolo de avance y errores
- Cada fase termina actualizando `docs/progress/<fase>.md`: criterio por criterio PASS/FAIL con evidencia (output de test, ruta de screenshot). FAIL = la fase no cierra.
- Ambigüedad en specs → registrar en `docs/open-questions.md` y continuar con lo no bloqueado. NUNCA asumir en silencio.
- Error de entorno/credencial → documentar en progress, crear mock/adapter, marcar HUMAN_REQUIRED con instrucción exacta de qué debe hacer el humano. Pedir intervención humana SOLO si es bloqueante real (credencial, cuenta, decisión legal); todo lo demás se resuelve o se mockea.
```

También crear `CLAUDE.local.example.md` con: "Notas locales (no commiteadas): claves de prueba personales, dispositivos de test, atajos. Copiar a CLAUDE.local.md."

---

## 4. Subagents `.claude/agents/`

Cada bloque es un archivo completo. Herramientas: `tools` omitido = hereda todas; los read-only la restringen.

### 4.1 `opus-orchestrator.md`
```md
---
name: opus-orchestrator
description: Orquestador principal. Usar para planificar fases, descomponer trabajo, coordinar subagentes, resolver conflictos entre dominios, revisar arquitectura y aprobar cierres de fase. NO implementa código salvo emergencia explícita del humano.
model: opus
---
# Rol
Sos el tech lead y product architect de Forzza. Tu valor está en decidir y revisar, no en tipear código.
# Responsabilidades
Leer specs (CLAUDE.md, master doc §relevantes, progress de la fase anterior); descomponer la fase en tareas con dueño (subagente) y orden; lanzar subagentes (paralelo solo sin archivos compartidos); revisar diffs contra specs; resolver conflictos; decidir bloqueante vs no bloqueante; aprobar el cierre de fase.
# Archivos permitidos
docs/architecture/**, docs/decisions/** (escribir). Lectura: todo el repo.
# Archivos prohibidos
Código de apps/, packages/, supabase/ (salvo emergencia ordenada por el humano). docs/forzza-master-doc.md (nadie lo edita).
# Reglas
Delegá TODO lo implementable. Si un subagente devuelve trabajo fuera de spec, devolvelo con el criterio exacto incumplido. Ante ambigüedad: open-questions.md, no supuestos. Mantené tus mensajes cortos: referencias a secciones, no repetir specs completas.
# Definition of Done
La fase cierra solo cuando docs/progress/<fase>.md está todo en PASS y product-spec-guardian no reporta violaciones.
```

### 4.2 `product-spec-guardian.md`
```md
---
name: product-spec-guardian
description: Verificador de especificación (read-only). Usar al cierre de cada fase y ante cualquier duda de si un cambio respeta forzza-master-doc.md. No implementa código.
model: sonnet
tools: Read, Grep, Glob
---
# Rol
Auditor de fidelidad a la spec.
# Responsabilidades
Comparar lo implementado contra docs/forzza-master-doc.md (§6 reglas, §11–12 criterios, §13 datos, §15 backlog) y CLAUDE.md; detectar: features V2/V3 coladas, promesas eliminadas (Elite: "3 coaches", "análisis IA"), precios/comisiones hardcodeados, textos que contradigan §7/§10; emitir reporte con veredicto por ítem: CUMPLE / VIOLA(sección) / NO-VERIFICABLE.
# Archivos permitidos
Lectura de todo. Escritura: SOLO docs/progress/spec-review-<fase>.md.
# Archivos prohibidos
Cualquier archivo de código. No corrige: reporta.
# Reglas
Citá siempre la sección exacta del master doc que respalda cada objeción. Sin sección citada, no es objeción.
# Definition of Done
Reporte emitido con cero ítems VIOLA, o lista de violaciones entregada al orquestador.
```

### 4.3 `monorepo-architect.md`
```md
---
name: monorepo-architect
description: Arquitecto de monorepo y tooling. Usar para pnpm workspaces, Turborepo, TypeScript config, ESLint, scripts cross-platform Windows, CI GitHub Actions y estructura de carpetas.
model: sonnet
---
# Rol
Dueño del esqueleto del repo y la DX en Windows 11.
# Responsabilidades
Workspaces y pipeline turbo (lint/typecheck/test/build con caché); packages/tsconfig (strict true, noUncheckedIndexedAccess) y eslint-config (regla anti-hex fuera de tokens.ts); scripts package.json cross-platform; .github/workflows/ci.yml; .gitattributes eol=lf; .env.example exhaustivo comentado; .claude/settings.json con permisos del proyecto.
# Archivos permitidos
Raíz (package.json, turbo.json, pnpm-workspace.yaml, .gitattributes, .gitignore, README), packages/config|eslint-config|tsconfig, scripts/, .github/.
# Archivos prohibidos
apps/** (código de features), supabase/migrations, packages/core/billing.
# Reglas
Nunca bash-only ni `&&` en scripts npm (PowerShell). Nunca commitear .env. CI debe correr en ubuntu-latest aunque el dev sea Windows (paridad por scripts cross-platform).
# Definition of Done
pnpm install limpio en máquina nueva; pnpm typecheck/lint/test verdes; CI verde en PR de prueba.
```

### 4.4 `supabase-rls-engineer.md`
```md
---
name: supabase-rls-engineer
description: Ingeniero de base de datos y backend Supabase. Usar para migraciones SQL, políticas RLS, triggers, Storage buckets, Edge Functions base y regeneración de tipos. Usar PROACTIVAMENTE ante cualquier cambio de modelo de datos.
model: sonnet
---
# Rol
Dueño del esquema, la seguridad a nivel de fila y las funciones de servidor.
# Responsabilidades
Migraciones versionadas (NUNCA editar una aplicada; siempre nueva); RLS en TODA tabla según matriz §13 (student: lo propio; coach: alumnos solo con assignment activo, fotos solo paquetes pro/elite; owner: todo; promoter: agregados sin PII); constraints de negocio (precio≥piso por trigger contra country_config, unicidades de §13); audit_log append-only (REVOKE UPDATE/DELETE); buckets privados progress-photos/fiscal-docs/invoices/videos con políticas; seed/ con country_config AR+CL (commission_rate 0.20), exercise_library desde reference/ejercicios-234.xlsx (script en scripts/), cuentas demo; tras cada migración: `pnpm db:types`.
# Archivos permitidos
supabase/migrations, supabase/seed, supabase/functions (estructura base), supabase/tests, packages/db-types (generado), scripts/import-exercises.*.
# Archivos prohibidos
apps/**, packages/ui, packages/core/billing (eso es de payments-billing-engineer).
# Reglas
Toda política RLS nueva nace con su test de acceso cruzado en supabase/tests. Default DENY: sin política explícita no hay acceso.
# Definition of Done
pnpm db:reset sin errores; pnpm test:rls verde; tipos regenerados sin diff manual.
```

### 4.5 `mobile-expo-engineer.md`
```md
---
name: mobile-expo-engineer
description: Ingeniero mobile Expo/React Native. Usar para todo apps/mobile - pantallas, expo-router, offline-first, integración RevenueCat/push/deep links - y consumo de packages/ui native.
model: sonnet
---
# Rol
Dueño de la app del alumno.
# Responsabilidades
Pantallas según §11 y fichas §2.1 del master doc, con diseño del prototipo reference/forza-complete.jsx; expo-router con grupos (auth)/(tabs)/workout/marketplace/settings; bottom nav 5 tabs (Inicio·Rutinas·Progreso·Chat·Perfil); workout offline-first (Zustand persistido, sobrevive kill, cola sync idempotente por client_uuid); gating consumiendo entitlements server; RevenueCat para PRO; checkout de coach abre browser (jamás IAP); push tokens + deep links; eventos PostHog §17 sin PII.
# Archivos permitidos
apps/mobile/**, packages/ui/src/native (junto a ui-design-system-engineer), packages/core/src/gating y schemas (lectura/uso; cambios coordinados).
# Archivos prohibidos
apps/web, supabase/migrations, packages/core/billing, eas.json de producción (release-store-engineer).
# Reglas
StyleSheet con tokens EXCLUSIVAMENTE (cero hex). TS estricto. Toda pantalla: loading/empty/error/success. Textos voseo; faltantes = TODO_COPY. Nada de flujos de coach en la app.
# Definition of Done
Pantalla con sus 4 estados, navegable en Expo Go, criterios de §11.3 de su flujo en PASS, eventos analytics instrumentados.
```

### 4.6 `web-next-engineer.md`
```md
---
name: web-next-engineer
description: Ingeniero web Next.js. Usar para apps/web - landing, PWA del alumno, backoffice coach (/coach), backoffice dueño (/admin), onboarding coach web - y packages/ui web.
model: sonnet
---
# Rol
Dueño de toda la superficie web.
# Responsabilidades
Landing SSR con copy §10 y eventos §10.2; PWA (manifest, service worker network-first datos/cache-first assets, instalable, Lighthouse PWA≥90); /coach y /admin con middleware por rol server-side, sidebar 240px, tablas (orden/filtros en URL, paginación 25/50, dinero en Space Mono derecha), validación inline (precio<piso = borde rojo + mínimo), dirty-state warning, confirmación + audit_log en acciones de dinero; onboarding coach 4 pasos con upload de constancia a bucket privado; <1024px en backoffices: aviso "pantalla más grande".
# Archivos permitidos
apps/web/**, packages/ui/src/web (junto a ui-design-system-engineer), e2e/playwright (fixtures propias).
# Archivos prohibidos
apps/mobile, supabase/migrations, packages/core/billing.
# Reglas
Server Components por defecto; Tailwind solo con tokens; TS estricto; estados loading/empty/error/success en toda vista crítica; jamás cálculo de dinero en el cliente.
# Definition of Done
Vista con sus 4 estados, criterios §12 en PASS, protegida por rol, e2e Playwright del flujo crítico verde.
```

### 4.7 `ui-design-system-engineer.md`
```md
---
name: ui-design-system-engineer
description: Ingeniero de design system. Usar para packages/ui - tokens, componentes compartidos native y web con API idéntica, styleguide de desarrollo y consistencia visual con el prototipo.
model: sonnet
---
# Rol
Guardián de la identidad visual (§11.1: paleta #C8FF00/dark, Bebas Neue + DM Sans + Space Mono, escala 4px).
# Responsabilidades
tokens.ts única fuente; componentes con la MISMA API en src/native y src/web: Button, Input, NumInput, WeightInput, Pill, Card, Sheet, Toast, Tabs, EmptyState, ErrorState, Skeleton, UpgradeModal, LineChart, RestTimer(native), Confetti(native), CalendarMonth(web), PaymentSummary, NotificationRow; pantalla/ruta /styleguide de desarrollo en ambas apps; carga de fuentes en Expo y Next.
# Archivos permitidos
packages/ui/**, assets de fuentes en apps (solo registro).
# Archivos prohibidos
Pantallas de features, supabase/**, packages/core.
# Reglas
Cero colores/medidas fuera de tokens (la regla de lint anti-hex es tuya junto a monorepo-architect). Cada componente: props tipadas, estados disabled/error/loading donde aplique.
# Definition of Done
Styleguide native y web idénticos al StyleGuide del prototipo; componentes usados por las apps sin estilos locales duplicados.
```

### 4.8 `payments-billing-engineer.md`
```md
---
name: payments-billing-engineer
description: Ingeniero de pagos y facturación. Usar para Mercado Pago (preapproval, webhooks), RevenueCat (entitlements), suscripciones, dunning, liquidaciones quincenales, settlements y audit log financiero.
model: sonnet
---
# Rol
Dueño del dinero. La precisión es tu única estética.
# Responsabilidades
packages/core/billing: calculateSettlement (gross/commission/net con commission_rate de country_config), estados de suscripción, redondeos por moneda en enteros — todo con tests; Edge Functions: webhook-mp y webhook-revenuecat (firma validada, idempotencia por tabla processed_events, mismo evento ×3 = 1 efecto), settlements-cron quincenal, dunning-cron días 0/2/5 (past_due gracia 5 días → canceled); creación de preapproval MP para PRO web y paquetes de coach; refund automático si assignment pending >72 h; TODA mutación financiera escribe audit_log.
# Archivos permitidos
packages/core/src/billing, supabase/functions/webhook-*|settlements-cron|dunning-cron, supabase/migrations SOLO tablas payments/subscriptions/settlements/processed_events (coordinado con supabase-rls-engineer), .env.example (variables de pago).
# Archivos prohibidos
apps/** (UI de pagos la hacen mobile/web engineers consumiendo tus endpoints), docs/forzza-master-doc.md.
# Reglas
Sin credencial real: adaptador MockMercadoPago/MockRevenueCat detrás de interfaz + tests + HUMAN_REQUIRED en progress. Jamás floats para dinero. Jamás loguear payloads con datos de tarjeta.
# Definition of Done
Tests de idempotencia y de cálculo verdes (cobertura ≥80% billing); flujo sandbox end-to-end documentado en docs/runbooks/pagos.md.
```

### 4.9 `notifications-realtime-engineer.md`
```md
---
name: notifications-realtime-engineer
description: Ingeniero de notificaciones y realtime. Usar para push (Expo), emails (Resend), notificaciones in-app, preferencias, y chat con Supabase Realtime.
model: sonnet
---
# Rol
Dueño de la matriz §7 y del chat.
# Responsabilidades
Edge Function notify: único punto de despacho {type,user_id,payload} → canales según matriz (V1: N1–N15, N18, N22), preferencias del usuario, cap 3 push/día, quiet hours 22–08 local, colapso de chat 5 min, regla "dinero por ≥2 canales y email no opt-out-able"; tabla notifications + centro in-app; plantillas Resend; chat 1:1 por assignment activo (Realtime), texto en V1; permiso de push pedido tras el primer workout (no en onboarding); deep links por tipo.
# Archivos permitidos
supabase/functions/notify, supabase/migrations SOLO notifications/preferences (coordinado), packages/core/src/notifications (tipos de la matriz), integración en apps junto a mobile/web engineers.
# Archivos prohibidos
billing, packages/ui (pide componentes, no los crea).
# Reglas
Ningún evento crítico de dinero depende solo de push. Textos desde §7 (copywriting final lo pulen los engineers con TODO_COPY si falta).
# Definition of Done
Cada notificación V1 de la matriz: disparada por su evento real, respetando reglas anti-spam, con deep link verificado y test.
```

### 4.10 `qa-automation-engineer.md`
```md
---
name: qa-automation-engineer
description: Ingeniero de QA automation. Usar PROACTIVAMENTE al cierre de cada historia/fase - unit (Vitest), RLS, integración de webhooks, Playwright web, Maestro mobile, y reportes docs/progress con PASS/FAIL.
model: sonnet
---
# Rol
La fase no existe hasta que vos digas PASS.
# Responsabilidades
Unit: core/billing y core/gating ≥80% (redondeos, comisión 20%, sub→comisión 4° alumno sin reversión, truncado 10 días, límite 3 rutinas); RLS: accesos cruzados prohibidos; idempotencia: replay ×3 = 1 efecto; Playwright: validar constancia, aprobar factura→transferido, precio<piso; Maestro: signup, workout modo avión→sync, upgrade sandbox, checkout coach sandbox; reporte docs/progress/<fase>.md con CADA criterio PASS/FAIL + evidencia.
# Archivos permitidos
tests/, e2e/, supabase/tests, docs/progress, docs/qa, fixes triviales SOLO en archivos de test.
# Archivos prohibidos
Código de producción (reportás qué agente debe corregir; no corregís vos).
# Reglas
FAIL sin evidencia no es FAIL; PASS sin evidencia no es PASS. No bajás cobertura para aprobar.
# Definition of Done
Reporte emitido; si hay FAILs, lista accionable con agente responsable por ítem.
```

### 4.11 `security-privacy-reviewer.md`
```md
---
name: security-privacy-reviewer
description: Revisor de seguridad y privacidad (read-only). Usar tras cambios en RLS, Storage, webhooks, datos sensibles (fotos corporales, constancias, facturas, datos fiscales) y antes de cada release. Escalar a Opus si encuentra severidad alta.
model: sonnet
tools: Read, Grep, Glob, Bash
---
# Rol
Adversario interno: pensás como atacante y como regulador de datos.
# Responsabilidades
Revisar: RLS default-deny real (intentos de bypass), buckets privados y TTL de URLs firmadas, ausencia de PII/datos de salud en logs/analytics/consola, validación de firma en webhooks, secretos fuera del repo (grep de patrones), rate limiting en functions, soft-delete/anonimización, consentimiento parental aplicado server-side.
# Archivos permitidos
Lectura total + ejecutar tests. Escritura: SOLO docs/progress/security-review-<fase>.md.
# Archivos prohibidos
Todo lo demás. No corrige: reporta con severidad CRÍTICA/ALTA/MEDIA/BAJA.
# Reglas
CRÍTICA o ALTA = bloqueante: el orquestador no puede cerrar la fase. Si encontrás una CRÍTICA ambigua, recomendá explícitamente escalar el análisis a opus-orchestrator.
# Definition of Done
Reporte con veredicto APTO / NO-APTO y lista por severidad.
```

### 4.12 `release-store-engineer.md`
```md
---
name: release-store-engineer
description: Ingeniero de releases. Usar para builds EAS, configuración App Store/Play Store, productos IAP, metadata, screenshots, PWA deploy y checklists de publicación §9.
model: sonnet
---
# Rol
Dueño del camino a producción.
# Responsabilidades
eas.json (development/preview/production) y app.config.ts (bundle ids com.forzza.app, versionado automático); EAS Submit; docs/store-setup.md con CADA paso humano de App Store Connect y Play Console (apps, productos IAP con precios de country_config, Privacy labels, Data Safety pregunta por pregunta, IARC, nota al revisor Apple: paquetes de coach = servicio persona-a-persona 1:1, guideline 3.1.3(e), por eso se contratan vía web); cuenta demo para revisores poblada; ficha de store ES/EN; deploy Vercel de apps/web; checklist §9.1/9.2/9.3 punto por punto.
# Archivos permitidos
apps/mobile/eas.json|app.config.ts, .github/workflows (deploy), docs/store-setup.md, docs/runbooks/release.md, assets de store.
# Archivos prohibidos
Lógica de producto, supabase/**, packages/core.
# Reglas
Jamás subir a track público sin orden humana. Credenciales de stores: siempre HUMAN_REQUIRED con instrucción exacta.
# Definition of Done
Build preview en TestFlight + internal track Play instalable, y store-setup.md ejecutable por un humano sin conocimiento previo.
```

### 4.13 `docs-maintainer.md`
```md
---
name: docs-maintainer
description: Mantenedor de documentación. Usar al final de cada fase y cuando se toma una decisión - mantiene docs/progress, docs/decisions, README, runbooks y open-questions.
model: sonnet
tools: Read, Grep, Glob, Edit, Write
---
# Rol
La memoria externa del proyecto: lo que no documentás, en la próxima sesión no existe.
# Responsabilidades
docs/progress/<fase>.md (estructura: objetivo, criterios PASS/FAIL con evidencia, pendientes HUMAN_REQUIRED, próximos pasos, hash del último commit); docs/decisions/ una entrada por decisión (contexto, opciones, decisión, quién); README actualizado (setup, comandos); docs/runbooks (deploy, rotación de claves, soporte, restore de backup); consolidar open-questions.md sin duplicados.
# Archivos permitidos
docs/** EXCEPTO docs/forzza-master-doc.md (intocable).
# Archivos prohibidos
Todo código, .claude/, master doc.
# Reglas
progress es para la PRÓXIMA sesión: escribí para alguien sin contexto. Máximo 2 páginas por fase; detalles van linkeados.
# Definition of Done
Una sesión nueva puede retomar el proyecto leyendo solo CLAUDE.md + el último progress.
```

---

## 5. Commands `.claude/commands/`

Cada bloque es un archivo en `.claude/commands/`. Se invocan escribiendo `/forzza-...` en Claude Code; `$ARGUMENTS` es lo que escribas después del comando.

### 5.1 `forzza-plan-phase.md`
**Usa:** opus-orchestrator. **Input:** número de fase. **Output:** plan de tareas con dueños. **Cuándo:** al abrir cada fase. **Ejemplo:** `/forzza-plan-phase 7`
```md
Planificá la FASE $ARGUMENTS sin escribir código.
1. Leé CLAUDE.md, docs/progress/ de la fase anterior y las secciones del master doc citadas en el prompt de la fase (docs/prompts/).
2. Descomponé en tareas atómicas: cada una con subagente dueño, archivos que toca, criterio de aceptación y si puede paralelizarse (solo sin archivos compartidos).
3. Identificá checkpoints HUMAN_REQUIRED y verificá en .env si la credencial existe; si no, planificá el mock.
4. Emití el plan como tabla y esperá mi confirmación antes de delegar.
```

### 5.2 `forzza-build-story.md`
**Usa:** opus delega al subagente que corresponda. **Input:** ID de historia + agente. **Output:** implementación + tests. **Ejemplo:** `/forzza-build-story C-021 mobile-expo-engineer`
```md
Construí la historia $ARGUMENTS.
1. Delegá al subagente indicado (segundo argumento) con: la sección del master doc que la define, los archivos permitidos/prohibidos de su agente, y el criterio de aceptación textual.
2. El subagente implementa con TS estricto, estados loading/empty/error/success si es UI, y tests de su lógica.
3. Al terminar: delegá a qa-automation-engineer la verificación del criterio y a docs-maintainer la entrada en progress.
4. Commits convencionales pequeños: tipo(ID): descripción. No toques nada fuera del scope de la historia.
```

### 5.3 `forzza-review-story.md`
**Usa:** product-spec-guardian + opus. **Input:** ID. **Ejemplo:** `/forzza-review-story M-051`
```md
Revisá la historia $ARGUMENTS sin modificar código.
1. Delegá a product-spec-guardian: comparar el diff de la historia contra el master doc y CLAUDE.md; veredicto CUMPLE/VIOLA(sección) por criterio.
2. Si hay VIOLA: generá lista de fixes con agente responsable y bloqueá el cierre.
3. Si CUMPLE: registrá el veredicto en docs/progress y autorizá continuar.
```

### 5.4 `forzza-run-tests.md`
**Usa:** qa-automation-engineer. **Ejemplo:** `/forzza-run-tests rls`
```md
Corré la suite "$ARGUMENTS" (valores: all | unit | rls | e2e-web | e2e-mobile | idempotency).
Delegá a qa-automation-engineer: ejecutar los comandos pnpm correspondientes, capturar el output completo, y reportar: total/verde/rojo, los 5 fallos más informativos con stack resumido, y qué agente debería corregir cada uno. Sin tocar código de producción.
```

### 5.5 `forzza-fix-tests.md`
**Usa:** opus coordina al agente dueño del código roto. **Ejemplo:** `/forzza-fix-tests`
```md
Hay tests rojos. Protocolo:
1. qa-automation-engineer clasifica cada fallo: (a) test desactualizado vs (b) bug de producción vs (c) entorno/credencial.
2. (a) lo corrige qa SOLO en archivos de test, justificando por qué el test estaba mal. (b) lo corrige el agente DUEÑO del archivo (ver ownership en docs). (c) se documenta HUMAN_REQUIRED con instrucción exacta.
3. Prohibido: borrar tests, bajar cobertura, agregar skip sin entrada en open-questions.md.
4. Re-correr la suite y reportar.
```

### 5.6 `forzza-security-review.md`
**Usa:** security-privacy-reviewer (escala a opus). **Ejemplo:** `/forzza-security-review fase-2`
```md
Auditoría de seguridad del alcance "$ARGUMENTS".
Delegá a security-privacy-reviewer: RLS default-deny con intentos de bypass, buckets privados y TTL, PII/datos de salud en logs/analytics (grep), firmas de webhooks, secretos en el repo (grep de patrones token/key/secret), consentimiento parental server-side. Reporte docs/progress/security-review-$ARGUMENTS.md con severidades. CRÍTICA/ALTA = bloqueante: presentame el caso y recomendación antes de seguir.
```

### 5.7 `forzza-release-check.md`
**Usa:** release-store-engineer + qa. **Ejemplo:** `/forzza-release-check ios`
```md
Verificación de release para "$ARGUMENTS" (ios | android | pwa | web).
Delegá a release-store-engineer el checklist §9 correspondiente del master doc punto por punto (PASS/FAIL/HUMAN_REQUIRED), y a qa-automation-engineer el smoke e2e del target. Output: docs/progress/release-check-$ARGUMENTS.md + lista exacta de pasos humanos pendientes.
```

### 5.8 `forzza-update-docs.md`
**Usa:** docs-maintainer. **Ejemplo:** `/forzza-update-docs fase-7`
```md
Delegá a docs-maintainer: actualizar docs/progress/$ARGUMENTS.md (criterios PASS/FAIL con evidencia, HUMAN_REQUIRED, próximos pasos, hash del último commit), registrar decisiones nuevas en docs/decisions/, actualizar README si cambiaron comandos, y consolidar open-questions.md. Verificá que una sesión nueva podría retomar leyendo solo CLAUDE.md + ese progress.
```

### 5.9 `forzza-handoff-next-session.md`
**Usa:** opus + docs-maintainer. **Cuándo:** SIEMPRE antes de cerrar una sesión larga o cuando el contexto se está agotando. **Ejemplo:** `/forzza-handoff-next-session`
```md
Preparar el traspaso a una sesión nueva:
1. docs-maintainer escribe docs/progress/HANDOFF.md: fase actual, qué quedó hecho (commits), qué quedó a medias (archivo y línea), próximos 3 pasos exactos, HUMAN_REQUIRED pendientes, y qué prompt de fase retomar.
2. Verificar que no hay cambios sin commitear (git status); si los hay, commit WIP convencional.
3. Mensaje final para el humano: "Cerrá esta sesión. En la próxima: /clear, pegá el contenido de docs/progress/HANDOFF.md y continuá".
```

---

## 6. Plan maestro por fases

| Fase | Objetivo | Agente principal | Modelo | Subagentes | Output | Tests | Puede avanzar si... |
|---|---|---|---|---|---|---|---|
| 0 | Setup local y repo sembrado | humano + opus-orchestrator | Opus | docs-maintainer | Repo con kit, CLAUDE.md, agentes | — | `claude` arranca y `/agents` lista 13 |
| 1 | Monorepo, tooling, CI | opus | Opus | monorepo-architect, qa | Workspaces, scripts, CI verde | typecheck/lint smoke | progress/F1 PASS + CI verde |
| 2 | Schema, RLS, seeds | opus | Opus | supabase-rls-engineer, qa, security | Migraciones, RLS, seeds, tipos | test:rls completo | F2 PASS + security APTO |
| 3 | Auth, roles, perfiles | opus | Opus | supabase-rls, mobile, web, notifications(emails), qa | Login/signup/recovery/consent/delete | e2e signup, unit consent | F3 PASS + review Opus |
| 4 | Design system | opus | Opus | ui-design-system, mobile, web, qa | tokens + componentes + styleguides | lint anti-hex, snapshot | F4 PASS |
| 5 | Landing + pricing | opus | Opus | web-next, qa | Landing SSR + leads + legales DRAFT | Lighthouse, eventos | F5 PASS |
| 6 | Mobile foundation | opus | Opus | mobile-expo, qa | Router, providers, servicios, nav 5 tabs | smoke render | F6 PASS |
| 7 | Core mobile entrenos | opus | Opus | mobile-expo, supabase-rls, qa | Home, workout offline, rutinas, progreso | e2e modo avión, unit cola | F7 PASS + review Opus |
| 8 | Gating Free/PRO | opus | Opus | mobile-expo, supabase-rls, qa | Límites server + UpgradeModal + autopromo | unit gating, e2e 4ª rutina | F8 PASS |
| 9 | Pagos PRO | opus | Opus | payments-billing, mobile-expo, qa | RevenueCat + MP PRO + dunning | idempotencia, sandbox | F9 PASS |
| 10 | Marketplace coaches | opus | Opus | web/mobile, supabase-rls, qa | Listado/perfil/paquetes (solo approved) | RLS visibilidad | F10 PASS |
| 11 | Checkout coach + asignación | opus | Opus | payments-billing, mobile, web, qa | Preapproval, webhook, assignment, refund 72h | e2e AC1–AC5 §11.3 | F11 PASS |
| 12 | Backoffice coach | opus | Opus | web-next, mobile (check-in app), qa | /coach completo + check-ins | Playwright | F12 PASS |
| 13 | Backoffice dueño | opus | Opus | web-next, supabase-rls, qa | /admin completo + country_config editor | Playwright | F13 PASS |
| 14 | Cobros y liquidaciones | opus | Opus | payments-billing, web-next, qa, security | settlements-cron, facturas, audit log | unit cálculo + e2e factura | F14 PASS + review billing Opus |
| 15 | Chat, notifs, email | opus | Opus | notifications-realtime, mobile, web, qa | notify + matriz V1 + chat + centro | reglas anti-spam, deep links | F15 PASS |
| 16 | Analytics + Sentry | opus | Opus | monorepo-architect, qa | PostHog §17, Sentry, scrub PII | test payloads sin PII | F16 PASS |
| 17 | QA completo | opus | Opus | qa (lidera), todos corrigen | Auditoría estados + e2e maestro | suite completa | F17 PASS sin FAIL |
| 18 | PWA desktop | opus | Opus | web-next, qa | (pwa)/app instalable | Lighthouse PWA ≥90 | F18 PASS |
| 19 | Stores prep | opus | Opus | release-store, mobile, qa | EAS builds + store-setup.md + fichas | checklist §9 | F19 PASS + builds instalables |
| 20 | Hardening + RC | opus | Opus | todos + security | Prod envs, smoke, GO-LIVE.md | smoke prod | review RC Opus = APTO |

---

## 7. Prompts exactos por fase

Pegá cada uno en una sesión limpia (`/clear`). Donde dice "Subagentes a invocar", el orquestador los lanza con el Task tool — no los lanzás vos.

### FASE 0 — Setup local y repositorio

```
# FASE 0 — Setup local y repositorio

Agente principal recomendado: opus-orchestrator
Modelo recomendado: Opus 4.8 (hilo principal)
Subagentes a invocar: docs-maintainer
Modo de trabajo: verificación y documentación; CERO código de producto
Archivos obligatorios a leer antes de tocar código: CLAUDE.md, docs/forzza-master-doc.md (solo §15 backlog y §21 decisiones), docs/01... si existe
Archivos permitidos: docs/progress/F0.md, docs/open-questions.md, README.md, .gitignore
Archivos prohibidos: todo lo demás
Objetivo: dejar el repo sembrado y verificado para arrancar la Fase 1.
Contexto: el humano ya creó C:\dev\forzza, copió CLAUDE.md, .claude/agents (13 archivos), .claude/commands, docs/forzza-master-doc.md, reference/forza-complete.jsx y reference/ejercicios-234.xlsx (si lo tiene).
Tareas:
1. Verificar presencia y legibilidad de: CLAUDE.md, los 13 agentes, los 9 comandos, el master doc, reference/. Listar faltantes.
2. Crear .gitignore (node_modules, .env, .env.*, CLAUDE.local.md, .expo, .next, .turbo, dist, coverage, .vercel) y README.md mínimo (qué es Forzza + cómo arrancar tras Fase 1).
3. Crear docs/open-questions.md vacío con plantilla (fecha, pregunta, contexto, bloqueante S/N) y carpetas docs/{architecture,product,qa,progress,prompts,decisions,runbooks}.
4. Si falta ejercicios-234.xlsx, registrar en open-questions: "seed de ejercicios usará 30 base + TODO".
5. docs-maintainer escribe docs/progress/F0.md.
6. Commit: chore(F0): repo sembrado y verificado.
Tests obligatorios: ninguno (no hay código).
Comandos sugeridos: git status, git add -A, git commit
Definition of Done: F0.md con inventario PASS/FAIL de cada archivo del kit; cero faltantes bloqueantes.
Documentación a actualizar: docs/progress/F0.md
Restricciones: no instalar dependencias, no crear apps/, no tocar reference/.
Entrega esperada: repo commiteado + F0.md.
```

### FASE 1 — Monorepo, tooling y CI

```
# FASE 1 — Monorepo, tooling y CI

Agente principal recomendado: opus-orchestrator
Modelo recomendado: Opus 4.8 (orquesta), implementación en Sonnet
Subagentes a invocar: monorepo-architect (implementa), qa-automation-engineer (verifica), docs-maintainer
Modo de trabajo: una sola épica (F-001 del backlog), sin features de producto
Archivos obligatorios a leer antes de tocar código: CLAUDE.md, docs/forzza-master-doc.md §8 y §15 (F-001), sección 2 de este sistema (estructura objetivo, copiada en docs/prompts/)
Archivos permitidos: raíz (package.json, pnpm-workspace.yaml, turbo.json, .gitattributes), apps/* (solo scaffolding), packages/{config,eslint-config,tsconfig,core,ui,db-types} (esqueleto), scripts/, .github/workflows/, .env.example, .claude/settings.json, e2e/ y tests/ (config)
Archivos prohibidos: supabase/migrations, cualquier pantalla o lógica de negocio, reference/, docs/forzza-master-doc.md
Objetivo: monorepo instalable y con CI verde en Windows 11.
Contexto: repo sembrado en Fase 0.
Tareas (delegar a monorepo-architect):
1. pnpm-workspace.yaml (apps/*, packages/*) + turbo.json con pipeline lint/typecheck/test/build con caché.
2. apps/mobile: create-expo-app con TypeScript + expo-router; pantalla placeholder. apps/web: create-next-app App Router + TS + Tailwind; página placeholder.
3. packages/tsconfig (strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes) y packages/eslint-config con regla custom: prohibido /#[0-9a-fA-F]{3,8}/ fuera de packages/ui/src/tokens.ts.
4. packages/{core,ui,db-types,config} con package.json, src/index.ts y un test trivial cada uno.
5. Scripts raíz cross-platform (npm-run-all, rimraf, cross-env): dev, dev:mobile, dev:web, test, test:rls (placeholder), e2e (placeholder), typecheck, lint, db:reset (placeholder), db:types (placeholder).
6. .gitattributes (* text=auto eol=lf). .env.example con TODAS las variables de §8 del master doc, cada una comentada con dónde se obtiene y MOCK_OK=true/false.
7. .github/workflows/ci.yml: pnpm install con caché, lint, typecheck, test en cada PR.
8. .claude/settings.json: permitir Bash(pnpm *), Bash(git *), Edit/Write dentro del repo.
Tests obligatorios (qa-automation-engineer): pnpm install limpio, typecheck verde, lint verde, test verde, apps/web levanta en :3000, apps/mobile muestra QR.
Comandos sugeridos: pnpm install; pnpm typecheck; pnpm lint; pnpm test; pnpm dev:web
Definition of Done: todos los tests anteriores PASS + commit en main + CI verde en un PR de prueba.
Documentación a actualizar: docs/progress/F1.md, README (comandos reales).
Restricciones: cero dependencias de pagos/push/analytics todavía; scripts jamás bash-only.
Entrega esperada: monorepo funcional + F1.md.
```

### FASE 2 — Supabase schema, RLS y seeds

```
# FASE 2 — Supabase schema, RLS y seeds

Agente principal recomendado: opus-orchestrator
Modelo recomendado: Opus orquesta; Sonnet implementa
Subagentes a invocar: supabase-rls-engineer (implementa), qa-automation-engineer (tests RLS), security-privacy-reviewer (auditoría), docs-maintainer
Modo de trabajo: épica F-002 completa, en 3 tandas: (1) tablas+constraints, (2) RLS+buckets, (3) seeds+tipos
Archivos obligatorios a leer antes de tocar código: CLAUDE.md, master doc §13 COMPLETO, §6 (reglas por módulo), §5 (precios para seeds)
Archivos permitidos: supabase/migrations, supabase/seed, supabase/tests, packages/db-types, scripts/import-exercises.ts, package.json (solo scripts db:*)
Archivos prohibidos: apps/**, packages/ui, packages/core (salvo re-export de tipos), supabase/functions (Fase 9+)
Objetivo: base de datos completa, segura y seedeada, local y reproducible.
Contexto: el humano creó el proyecto en supabase.com y tiene Docker corriendo; si las claves no están en .env, trabajar 100% local y marcar HUMAN_REQUIRED el link al cloud.
Tareas:
1. Migraciones para TODAS las entidades de §13: users(+roles), student_profiles, coach_profiles, country_config, coach_packages, subscriptions, payments, coach_assignments, settlements, routines, exercise_library, workout_sessions, body_metrics, progress_photos, checkin_templates, checkin_responses, messages, notifications, notification_preferences, promoters, referrals, promoter_payouts (tablas SÍ, sin UI: NO IMPLEMENTAR EN V1 sus flujos), tickets, audit_log, processed_events, leads.
2. Constraints de negocio: gateway_payment_id UNIQUE; invoice_number UNIQUE por coach; referral.referred_user_id UNIQUE; trigger precio>=piso contra country_config; audit_log y processed_events append-only (REVOKE UPDATE/DELETE); CHECKs de estados (enums).
3. RLS default-deny en TODAS, según matriz §13 (coach ve alumno solo con assignment activo; progress_photos solo paquetes pro/elite; owner todo; promoter agregados sin PII).
4. Buckets privados: progress-photos, fiscal-docs, invoices, videos, con políticas por rol.
5. Seeds: country_config AR y CL (commission_rate 0.20, precios y pisos del §5 con pisos +6%; CL active=false), exercise_library importando reference/ejercicios-234.xlsx con scripts/import-exercises.ts (xlsx→sql) o 30 base con TODO, demo: 1 owner, 2 coaches (approved y pending), 5 alumnos (2 free, 2 pro, 1 con assignment activo).
6. Scripts reales db:reset y db:types; regenerar packages/db-types.
Tests obligatorios: supabase/tests con accesos cruzados prohibidos (≥12 casos: alumno→otro alumno, coach→alumno sin assignment, coach→fotos en paquete starter, promoter→PII, anon→todo), audit_log rechaza UPDATE/DELETE, trigger de piso rechaza precio menor.
Comandos sugeridos: supabase start; pnpm db:reset; pnpm test:rls; pnpm db:types
Definition of Done: db:reset y test:rls verdes; tipos generados; security-review-F2 = APTO.
Documentación a actualizar: docs/progress/F2.md, docs/runbooks/database.md (cómo migrar/seedear/linkear cloud).
Restricciones: nunca editar una migración aplicada; nada de datos reales en seeds.
Entrega esperada: esquema completo + reportes F2 y security-review-F2.
```

### FASE 3 — Auth, roles y perfiles

```
# FASE 3 — Auth, roles y perfiles

Agente principal recomendado: opus-orchestrator
Modelo recomendado: Opus orquesta; Sonnet implementa
Subagentes a invocar: supabase-rls-engineer (server), mobile-expo-engineer (app), web-next-engineer (web), notifications-realtime-engineer (emails de auth vía Resend), qa-automation-engineer, docs-maintainer
Modo de trabajo: historias A-010, A-011, A-012; mobile y web en PARALELO tras definir el contrato server
Archivos obligatorios a leer antes de tocar código: CLAUDE.md, master doc §6.1–6.4, §11.3 (cancelación), fichas §2.1.2–2.1.4
Archivos permitidos: apps/mobile/app/(auth) y settings, apps/web/app/(auth)|onboarding-coach|middleware.ts, supabase/migrations (solo si falta algo de auth), supabase/functions/delete-account, packages/core/src/schemas/auth*, e2e/
Archivos prohibidos: pantallas de entreno/marketplace (fases 7+), packages/core/billing, supabase/functions de pagos
Objetivo: registro, acceso y ciclo de vida de cuenta completos para alumno y coach.
Contexto: DB lista (F2). Resend: si RESEND_API_KEY falta, adaptador MockEmail que loguea a consola + HUMAN_REQUIRED.
Tareas:
1. server: flujo Supabase Auth email+password con verificación obligatoria; recuperación de contraseña; bloqueo 5 intentos (rate limit); Sign in with Apple y Google (si faltan las credenciales OAuth: dejar botones detrás de feature flag OFF en packages/config + HUMAN_REQUIRED con guía exacta para crearlas).
2. mobile: Splash (SOLO alumno, sin rama coach — §21.5), Login (+recuperación), Onboarding alumno 3 pasos replicando diseño del prototipo (barra progreso, chips OBJETIVOS y NIVELES), captura de birth_date; en settings: Eliminar cuenta (confirmación con password → soft delete + cancelación de subs + email).
3. web: login para /coach y /admin con middleware por rol server-side; /onboarding-coach 4 pasos: cuenta → fiscal (figura por país AR/CL con hints del prototipo + upload constancia PDF/JPG ≤10MB a fiscal-docs) → bancario (CBU/alias AR; cuenta+RUT CL) → perfil público; final: estado "pendiente de aprobación (48 h hábiles)".
4. Consentimiento parental: si birth_date < 18 años, registrar email del adulto + aceptación → parental_consent_at; SIN esto el (futuro) checkout devuelve 403 — implementar la verificación en packages/core/gating ya.
5. notifications: emails de verificación, recuperación y bienvenida con plantillas Resend (o mock).
Tests obligatorios: unit de schemas y de la regla <18; e2e Maestro: signup→verificación→home; e2e Playwright: onboarding coach completo con upload; RLS: el coach pending no aparece en queries de marketplace.
Comandos sugeridos: pnpm test; pnpm e2e; pnpm dev
Definition of Done: criterios de §6.1 en PASS; un coach demo nuevo queda pending con su PDF en bucket privado; eliminar cuenta deja deleted_at y subs canceladas.
Documentación a actualizar: docs/progress/F3.md
Restricciones: NO construir validación de constancia por el owner (Fase 13); no marketplace.
Entrega esperada: auth end-to-end + F3.md. Luego ejecutar el prompt de revisión Opus R3.
```

### FASE 4 — Design system compartido

```
# FASE 4 — Design system compartido

Agente principal recomendado: opus-orchestrator
Modelo recomendado: Opus orquesta; Sonnet implementa
Subagentes a invocar: ui-design-system-engineer (lidera), mobile-expo-engineer y web-next-engineer (integración), qa-automation-engineer, docs-maintainer
Modo de trabajo: tokens primero (secuencial), componentes native/web después (paralelo)
Archivos obligatorios a leer antes de tocar código: CLAUDE.md, master doc §11.1, reference/forza-complete.jsx (constante C, CSS, componentes Pill/NumInput/SvgIcon/LineChart/Confetti/RestTimer, StyleGuide)
Archivos permitidos: packages/ui/**, apps/mobile (carga de fuentes + ruta dev /styleguide), apps/web (ídem), packages/eslint-config (activar regla anti-hex)
Archivos prohibidos: pantallas de features, supabase/**, packages/core/billing
Objetivo: un solo design system consumible idéntico desde mobile y web.
Contexto: paleta y componentes ya existen en el prototipo; esto es portarlos con API tipada.
Tareas:
1. packages/ui/src/tokens.ts: paleta exacta (accent #C8FF00, accentD, bg #080810, s0–s3, gray/grayL/white, red/blue/orange) + TIPO_COLORS por tipo de rutina + tipografías (Bebas Neue, DM Sans 300–700, Space Mono) + escala 4px + radios + duraciones de animación.
2. Carga de fuentes en Expo (expo-font) y Next (next/font o local).
3. Componentes con MISMA API en src/native y src/web: Button(primary/secondary/ghost/danger, loading, disabled), Input, NumInput, WeightInput(kg/lb), Pill, Card, Sheet, Toast, Tabs, EmptyState(ilustración+título+CTA), ErrorState(retry), Skeleton, UpgradeModal, LineChart, PaymentSummary, NotificationRow; solo native: RestTimer, Confetti; solo web: CalendarMonth, DataTable(orden+paginación).
4. Rutas/pantallas /styleguide (solo desarrollo) en ambas apps mostrando todos los componentes en todos sus estados.
5. Activar la regla lint anti-hex y corregir cualquier violación existente.
Tests obligatorios: lint verde con la regla activa en todo el repo; snapshot tests de Button/Input/EmptyState en ambas plataformas; typecheck.
Comandos sugeridos: pnpm lint; pnpm test; pnpm dev
Definition of Done: styleguide native y web visualmente equivalentes al StyleGuide del prototipo; cero hex fuera de tokens.ts.
Documentación a actualizar: docs/progress/F4.md, docs/product/design-system.md (catálogo de componentes y props)
Restricciones: no crear componentes de features (los pide cada fase); no SVG de ejercicios todavía (Fase 7).
Entrega esperada: packages/ui v1 + F4.md.
```

### FASE 5 — Landing pública y pricing

```
# FASE 5 — Landing pública y pricing

Agente principal recomendado: opus-orchestrator
Modelo recomendado: Opus orquesta; Sonnet implementa
Subagentes a invocar: web-next-engineer (implementa), qa-automation-engineer, docs-maintainer
Modo de trabajo: una pasada completa; el copy sale del master doc, no se inventa
Archivos obligatorios a leer antes de tocar código: CLAUDE.md, master doc §10 COMPLETO (estructura y copy V1) y §10.2 (eventos)
Archivos permitidos: apps/web/app/(landing)/**, apps/web/src/components/landing*, supabase (solo tabla leads si no existe), e2e/playwright/landing*
Archivos prohibidos: /admin, /coach, (pwa), apps/mobile
Objetivo: landing publicable con captura de leads y pricing real desde country_config.
Contexto: aún sin dominio productivo es válido (preview Vercel). PostHog llega en Fase 16: instrumentar eventos detrás de una interfaz analytics() de packages/core que por ahora loguea.
Tareas:
1. Secciones en el orden EXACTO de §10.1: hero con switch Soy alumno/Soy coach (H1 "Entrená con método. Progresá con datos."), problema, solución (3 bloques), cómo funciona (4 pasos), sección coaches (copy §10.1.5, CTA → /onboarding-coach), pricing con selector AR/CL leyendo country_config vía ISR (CL marcado "Próximamente" si active=false), prueba social "Coaches fundadores" (lista coaches approved; fallback "Próximamente" si <3), FAQ (los 8 ítems), footer con legales como páginas DRAFT-LEGAL, captura de leads "Avisame cuando llegue a mi país" → tabla leads.
2. SEO: metadata, OG image, sitemap.xml, robots.txt.
3. Eventos §10.2: landing_view, cta_download_click, cta_coach_click, pricing_view, plan_card_click, faq_open, lead_submitted.
4. Sección promotores: NO IMPLEMENTAR EN V1 (ni oculta).
Tests obligatorios: e2e Playwright (lead se persiste; CTAs navegan; pricing muestra valores de la DB, no hardcodeados — test que cambia country_config y verifica reflejo); Lighthouse: Performance ≥85, SEO ≥95; responsive 360→1536.
Comandos sugeridos: pnpm dev:web; pnpm e2e
Definition of Done: criterios anteriores PASS + textos = §10 literal (diferencias solo por TODO_COPY listados).
Documentación a actualizar: docs/progress/F5.md
Restricciones: cero precios hardcodeados; sin testimonios inventados.
Entrega esperada: landing desplegable + F5.md.
```

### FASE 6 — Mobile foundation

```
# FASE 6 — Mobile foundation

Agente principal recomendado: opus-orchestrator
Modelo recomendado: Opus orquesta; Sonnet implementa
Subagentes a invocar: mobile-expo-engineer (implementa), qa-automation-engineer, docs-maintainer
Modo de trabajo: infraestructura de la app, sin pantallas de negocio nuevas
Archivos obligatorios a leer antes de tocar código: CLAUDE.md, master doc §11.2 (navegación, breakpoints, accesibilidad)
Archivos permitidos: apps/mobile/** (estructura, providers, servicios), packages/core/src/api-client
Archivos prohibidos: pantallas de entreno/marketplace (Fase 7/10), supabase/**
Objetivo: esqueleto sólido sobre el que las fases 7–11 solo agregan pantallas.
Contexto: auth ya funciona (F3); design system listo (F4).
Tareas:
1. expo-router definitivo: grupos (auth), (tabs) con los 5 tabs Inicio·Rutinas·Progreso·Chat·Perfil (placeholders con EmptyState), stacks workout/, marketplace/, settings/.
2. Providers raíz: QueryClientProvider (React Query con retry/backoff), AuthProvider (sesión Supabase + entitlements cacheados con revalidación), ThemeProvider (tokens), ErrorBoundary global con ErrorState.
3. Servicios en src/services: supabase client, api wrapper tipado con packages/db-types, analytics() (interfaz, log local hasta F16), notifications stub (token registration en F15).
4. Manejo offline base: detector de red + cola genérica persistida (AsyncStorage/MMKV) idempotente por client_uuid, que la Fase 7 especializa para workouts.
5. Deep linking configurado (scheme forzza://) con mapa de rutas para §7.
6. Safe areas, targets ≥44px, soporte 360×640 mínimo.
Tests obligatorios: smoke de render de cada tab; unit de la cola offline (encolar sin red, drenar al volver, no duplicar); typecheck.
Comandos sugeridos: pnpm dev:mobile; pnpm test
Definition of Done: app navegable en Expo Go con 5 tabs y sesión persistida tras reinicio.
Documentación a actualizar: docs/progress/F6.md
Restricciones: sin lógica de negocio; sin pedir permisos de push aún.
Entrega esperada: foundation + F6.md.
```

### FASE 7 — Core mobile: entrenos, rutinas, progreso

```
# FASE 7 — Core mobile: entrenos, rutinas, progreso

Agente principal recomendado: opus-orchestrator
Modelo recomendado: Opus orquesta; Sonnet implementa
Subagentes a invocar: mobile-expo-engineer (lidera), supabase-rls-engineer (endpoints/queries), qa-automation-engineer, docs-maintainer
Modo de trabajo: 3 tandas estrictas (C-020 → C-021 → C-022); ninguna tanda arranca con la anterior en rojo
Archivos obligatorios a leer antes de tocar código: CLAUDE.md, master doc §6.6, §11.3 (flujo Workout AC1–AC3), fichas §2.1.5–2.1.10; prototipo: HomeScreen, RutinaDelDia, ActiveWorkout, RestTimer, EditRoutine, CrearRutinaScreen (SIN escáner), PlanSemanalScreen, ProgresoScreen, RegistrarEntrenoScreen, LineChart, ExSVG
Archivos permitidos: apps/mobile/app/(tabs)|workout, apps/mobile/src/**, packages/core/src/{gating,schemas}, packages/ui (solo SVGs de ejercicios), supabase (solo RPC/vistas de progreso), e2e/maestro
Archivos prohibidos: marketplace, chat, pagos, supabase/functions de dinero
Objetivo: el corazón de uso diario, offline-first.
Contexto: foundation lista (F6); exercise_library seedeada (F2).
Tareas:
TANDA 1 (C-020): Home (saludo, próxima rutina, racha, accesos rápidos a Tabata/registrar/crear; estado de coach llega en F11 — dejar slot); Rutina del día con selector y preview de ejercicio (sheet con SVG anatómico portado de ExSVG); Workout activo por bloques con sets, WeightInput, RestTimer con próximo ejercicio, resumen final con Confetti; persistencia local del workout (sobrevive kill, ofrece retomar) + sync por cola idempotente (server: endpoint /workouts con client_uuid, conflicto = el más completo gana); Registrar Entreno manual post-workout; Tabata timer básico fijo.
TANDA 2 (C-021): Crear Rutina wizard 4 pasos (config→ejercicios con búsqueda y filtro por grupo→biseries→resumen); el escáner IA de fichas: NO IMPLEMENTAR EN V1; Plan Semanal con TIPO_COLORS; regla: rutina asignada por coach no editable, ejecución usa snapshot (campo routine_snapshot).
TANDA 3 (C-022): Progreso con LineCharts (peso, grasa, fuerza estimada), stats (racha, sesiones), alta de peso corporal (body_metrics); server: query de progreso preparada para truncado Free 10 días (la regla se ACTIVA en F8, la query ya la soporta por parámetro de plan).
Tests obligatorios: unit cola offline y snapshot; e2e Maestro "modo avión: entrenar→matar app→retomar→terminar→activar red→ver progreso sincronizado"; unit cálculo de racha.
Comandos sugeridos: pnpm dev:mobile; pnpm test; pnpm e2e
Definition of Done: AC1–AC3 del flujo Workout (§11.3) en PASS; las 3 tandas con sus 4 estados de UI.
Documentación a actualizar: docs/progress/F7.md (una sección por tanda)
Restricciones: nada de gating visible aún (F8); nada de fotos de progreso (V1.5: NO IMPLEMENTAR EN V1 la timeline; la tabla ya existe).
Entrega esperada: core de entreno completo + F7.md. Luego ejecutar revisión Opus R7.
```

### FASE 8 — Gating Free/PRO

```
# FASE 8 — Gating Free/PRO

Agente principal recomendado: opus-orchestrator
Modelo recomendado: Opus orquesta; Sonnet implementa
Subagentes a invocar: supabase-rls-engineer (enforcement server), mobile-expo-engineer (UI), qa-automation-engineer, product-spec-guardian (verificación final), docs-maintainer
Modo de trabajo: server primero, UI después
Archivos obligatorios a leer antes de tocar código: CLAUDE.md, master doc §6.5 y criterios Sprint 1 (ratificados en §15 G-030)
Archivos permitidos: packages/core/src/gating, supabase (RPC entitlements + enforcement en endpoints existentes), apps/mobile (UpgradeModal triggers, AdScreen, Mi Plan parcial), e2e/
Archivos prohibidos: pagos reales (F9), apps/web
Objetivo: que Free tenga límites reales y PRO valga la pena.
Contexto: el selector de plan del prototipo era un toggle; acá el plan vive en subscriptions/users.
Tareas:
1. Server: /me devuelve entitlements {isPro, hasCoach, limits} calculados server-side; POST /routines → 403 UPGRADE_REQUIRED en la 4ª rutina Free; /progress trunca a 10 días si Free (activar el parámetro de F7); downgrade marca rutinas excedentes en solo-lectura (flag, nunca borrar).
2. Mobile: UpgradeModal (diseño del prototipo) disparado por: 4ª rutina, día 11 de historial, intento de quitar autopromo; AdScreen de autopromo PRO de 10 s antes de rutina y Tabata para Free, botón Saltar deshabilitado los primeros 10 s (NO SDK de ads de terceros — §21.8); pantalla Mi Plan con comparativa Free/PRO/PRO+COACH y precios desde country_config (CTA de compra queda disabled con "disponible pronto" hasta F9); badge "Sin publicidad" para PRO.
3. ELIMINADO de Elite en toda la UI: "Acceso a hasta 3 coaches" y "Análisis IA semanal" (§21.7) — verificar con grep que no existan.
Tests obligatorios: unit de gating (límite 3, truncado, downgrade no destructivo); e2e: Free crea 3 rutinas, la 4ª muestra modal; Free inicia rutina y ve 10 s; cuenta demo PRO no ve autopromo en ninguna parte.
Comandos sugeridos: pnpm test; pnpm e2e
Definition of Done: los 4 criterios del Sprint 1 en PASS literal + product-spec-guardian CUMPLE.
Documentación a actualizar: docs/progress/F8.md
Restricciones: sin checkout funcional todavía.
Entrega esperada: gating real + F8.md.
```

### FASE 9 — Pagos PRO con RevenueCat / Mercado Pago

```
# FASE 9 — Pagos PRO con RevenueCat / Mercado Pago

Agente principal recomendado: opus-orchestrator
Modelo recomendado: Opus orquesta; Sonnet implementa
Subagentes a invocar: payments-billing-engineer (lidera), mobile-expo-engineer (UI compra), qa-automation-engineer, security-privacy-reviewer, docs-maintainer
Modo de trabajo: contratos e interfaces primero (con mocks), integración sandbox después
Archivos obligatorios a leer antes de tocar código: CLAUDE.md, master doc §6.8, §8.1 (IAP vs web), §13 (subscriptions/payments/processed_events)
Archivos permitidos: packages/core/src/billing, supabase/functions/{webhook-mp,webhook-revenuecat,dunning-cron}, apps/mobile (Mi Plan compra + gestión), .env.example, docs/runbooks/pagos.md
Archivos prohibidos: checkout de paquetes de coach (F11), apps/web, settlements (F14)
Objetivo: PRO comprable, renovable, cancelable y recuperable.
Contexto: HUMAN_REQUIRED previo: REVENUECAT_API_KEY y MP_ACCESS_TOKEN de TEST en .env. Si faltan: adaptadores MockRevenueCat/MockMercadoPago detrás de interfaz PaymentGateway + tests + HUMAN_REQUIRED en progress; jamás inventar claves.
Tareas:
1. core/billing: máquina de estados de suscripción (active/past_due/canceled) + helpers testeados; dinero en enteros.
2. webhook-revenuecat: valida auth header, idempotencia por event_id (processed_events), actualiza entitlement PRO. webhook-mp: firma validada, idempotencia por payment_id, escribe payments y subscriptions, todo a audit_log.
3. Creación de suscripción PRO por Mercado Pago preapproval (web/fallback Android) con precio de country_config.
4. dunning-cron: reintentos día 0/2/5, past_due con gracia 5 días → canceled; eventos para N10 (la notificación real llega en F15: dejar emisión por la interfaz notify()).
5. Mobile: react-native-purchases; compra PRO por IAP con restore purchases; "Gestionar suscripción" → gestión nativa del store o link MP según canal; cancelación en ≤3 taps con encuesta opcional 1 pregunta; entitlement refleja en ≤10 s.
Tests obligatorios: replay de cada webhook ×3 = 1 efecto (automatizado); transición de estados completa; sandbox: compra→isPro true; reinstalación→restore→sigue PRO; downgrade no borra datos.
Comandos sugeridos: pnpm test; supabase functions serve; pnpm e2e
Definition of Done: flujo sandbox end-to-end documentado en runbooks/pagos.md y reproducible; security-review APTO (sin PII de tarjetas en logs).
Documentación a actualizar: docs/progress/F9.md, docs/runbooks/pagos.md
Restricciones: nada de claves productivas; nada de paquetes de coach.
Entrega esperada: PRO monetizado en sandbox + F9.md.
```

### FASE 10 — Marketplace de coaches

```
# FASE 10 — Marketplace de coaches

Agente principal recomendado: opus-orchestrator
Modelo recomendado: Opus orquesta; Sonnet implementa
Subagentes a invocar: mobile-expo-engineer (app), supabase-rls-engineer (queries/visibilidad), qa-automation-engineer, docs-maintainer
Modo de trabajo: una pasada; checkout NO va acá (F11)
Archivos obligatorios a leer antes de tocar código: CLAUDE.md, master doc ficha §2.1.14 (decisión sin ratings) y §6.4
Archivos permitidos: apps/mobile/app/marketplace, supabase (vista marketplace_coaches), packages/core/src/schemas/coach*, e2e/maestro
Archivos prohibidos: checkout/pagos, apps/web (la bandeja del coach llega en F12)
Objetivo: descubrir y elegir coach desde la app.
Contexto: hay 1 coach approved en seeds.
Tareas:
1. Server: vista/función marketplace_coaches: SOLO fiscal_status='approved' AND marketplace_visible, con paquetes y precios (≥ piso garantizado por trigger).
2. Mobile: listado (card: nombre, especialidad, tags, badge "Nuevo en Forzza" — NO ratings: NO IMPLEMENTAR EN V1), filtro por tag, perfil de coach (bio, certificaciones, paquetes Starter/Pro/Elite con features desde DB, SIN las 2 promesas eliminadas de Elite), CTA "Contratar" que por ahora navega a una pantalla "checkout disponible en breve" (placeholder claro, se reemplaza en F11).
3. Free puede navegar todo el marketplace (decisión §3.4): sin gating acá.
Tests obligatorios: RLS/vista: coach pending o rejected NUNCA aparece (test que cambia estado y verifica); render de perfil con paquetes desde DB; e2e Maestro de navegación.
Comandos sugeridos: pnpm e2e; pnpm test:rls
Definition of Done: marketplace navegable con datos reales de DB; coach pending invisible.
Documentación a actualizar: docs/progress/F10.md
Restricciones: cero ratings, cero reviews, cero checkout real.
Entrega esperada: marketplace + F10.md.
```

### FASE 11 — Checkout paquete coach + asignación

```
# FASE 11 — Checkout paquete coach + asignación

Agente principal recomendado: opus-orchestrator
Modelo recomendado: Opus orquesta; Sonnet implementa (ESTA ES LA FASE CORAZÓN: revisión humana obligatoria al cierre)
Subagentes a invocar: payments-billing-engineer (lidera), mobile-expo-engineer, web-next-engineer (bandeja mínima del coach), notifications-realtime-engineer (eventos N2–N5 por interfaz), qa-automation-engineer, security-privacy-reviewer, docs-maintainer
Modo de trabajo: server→mobile→web; e2e antes de cerrar
Archivos obligatorios a leer antes de tocar código: CLAUDE.md, master doc §11.3 (flujo Compra AC1–AC5), §6.8–6.9, §13 (coach_assignments), ficha §2.1.15
Archivos permitidos: supabase/functions (checkout-coach, extensión webhook-mp), packages/core/billing y schemas, apps/mobile (checkout, estados Home, datos fiscales), apps/web/coach (SOLO bandeja Solicitudes), e2e/
Archivos prohibidos: resto del backoffice coach (F12), settlements (F14)
Objetivo: que un alumno pague un paquete y termine con coach asignado y chat habilitado.
Contexto: pagos sandbox funcionando (F9).
Tareas:
1. Server: POST /checkout/coach: exige email verificado; pide datos fiscales del alumno si faltan (dni/teléfono/dirección → student_profiles); <18 sin parental_consent_at → 403; crea preapproval MP al precio del coach; webhook payment.approved → assignment 'pending' + subscription activa + eventos N2 (alumno) y N3 (coach) vía notify() (stub hasta F15: in-app + email mock).
2. Reglas de tiempo: pending >24 h → evento N5 al owner; >72 h → ofrecer reasignación o REFUND AUTOMÁTICO vía API MP (con audit_log).
3. accept/reject del coach: accept → status active, habilita chat (las RLS de messages ya lo exigen), evento N4; reject con motivo → reembolso y fin.
4. Mobile: pantalla de checkout (paquete, coach, precio, datos fiscales si faltan), browser/webview a MP, retorno con polling del estado; Home: "Pendiente de asignación" → "Tu coach: {nombre}" (≤5 s tras webhook, AC2).
5. Web: en /coach UNA vista mínima "Solicitudes" con aceptar/rechazar (el resto del backoffice es F12).
Tests obligatorios: e2e completo sandbox AC1–AC5 de §11.3; doble webhook no duplica (×3=1); pago rechazado no crea assignment; <18 bloqueado server-side; refund a las 72 h (reloj simulado).
Comandos sugeridos: pnpm e2e; pnpm test; supabase functions serve
Definition of Done: AC1–AC5 PASS + security APTO + EL HUMANO ejecutó el flujo completo en sandbox y lo confirmó.
Documentación a actualizar: docs/progress/F11.md
Restricciones: comisión y precios SIEMPRE desde country_config; nada de liquidaciones aún.
Entrega esperada: el corazón del negocio funcionando + F11.md.
```

### FASE 12 — Backoffice coach

```
# FASE 12 — Backoffice coach

Agente principal recomendado: opus-orchestrator
Modelo recomendado: Opus orquesta; Sonnet implementa
Subagentes a invocar: web-next-engineer (lidera), mobile-expo-engineer (pantalla check-in en app), supabase-rls-engineer (queries), qa-automation-engineer, docs-maintainer
Modo de trabajo: 2 tandas: (1) núcleo BC-060, (2) check-ins BC-062. Cobros NO va acá (F14)
Archivos obligatorios a leer antes de tocar código: CLAUDE.md, master doc §12 (criterios BO coach), §6.7, tabla §2.3; prototipo: BackofficeCoach (sidebar, calendario calPick, alumnosData)
Archivos permitidos: apps/web/app/coach/**, apps/mobile (solo pantalla responder check-in), supabase (checkin_templates/responses ya existen; RPC si falta), e2e/playwright
Archivos prohibidos: /coach/cobros (F14), /admin (F13), grupos (NO IMPLEMENTAR EN V1)
Objetivo: el coach gestiona alumnos, calendario, rutinas y check-ins.
Contexto: ya existe la bandeja Solicitudes (F11).
Tareas:
TANDA 1: sidebar definitivo (Dashboard, Mi Perfil, Mis Alumnos, Calendario, Rutinas, Cobros[disabled "próximamente"], Mensajes[disabled hasta F15]) — SIN Grupos; Dashboard con métricas reales (alumnos activos, adherencia % sesiones completadas, solicitudes pendientes); Mi Perfil editable (bio, tags, certificaciones upload; "resultados de clientes" deshabilitado con tooltip "requiere consentimiento — próximamente": NO IMPLEMENTAR EN V1); Mis Alumnos: lista + detalle (peso/grasa desde body_metrics con LineChart, sesiones, racha, notas privadas del coach); Calendario mensual: asignar rutina por alumno/día en ≤2 clics (patrón calPick del prototipo), cambios <12 h emiten evento para N7-variante; Rutinas: builder reutilizando packages/core schemas y biblioteca compartida.
TANDA 2: Check-ins — crear/editar plantilla (preguntas base del prototipo: sesiones completadas, energía, sueño, campo libre), día/hora por alumno; tabla de respuestas semana a semana con comentario del coach; mobile: pantalla de respuesta (formulario, guarda borrador, 1 respuesta/semana por assignment) disparada por evento N8 (notificación real en F15; mientras: badge in-app).
Tests obligatorios: Playwright: asignar rutina en calendario, crear plantilla, ver respuesta; RLS: coach NO ve alumnos de otro coach (test cruzado); unit regla 1 respuesta/semana.
Comandos sugeridos: pnpm e2e; pnpm test:rls
Definition of Done: criterios §12 de coach (AC1, AC4 parcial) PASS; un alumno demo responde y el coach lo ve.
Documentación a actualizar: docs/progress/F12.md
Restricciones: nada de dinero (F14); nada de fotos del alumno (V1.5).
Entrega esperada: /coach operativo + F12.md.
```

### FASE 13 — Backoffice dueño

```
# FASE 13 — Backoffice dueño

Agente principal recomendado: opus-orchestrator
Modelo recomendado: Opus orquesta; Sonnet implementa
Subagentes a invocar: web-next-engineer (lidera), supabase-rls-engineer (reglas server), qa-automation-engineer, security-privacy-reviewer, docs-maintainer
Modo de trabajo: 2 tandas: (1) BO-070 usuarios+entrenadores, (2) BO-072 configuración + regla 4° alumno. Finanzas NO va acá (F14)
Archivos obligatorios a leer antes de tocar código: CLAUDE.md, master doc §12 (AC1–AC4 dashboard dueño), §6.9 (regla sub→comisión), tabla §2.2; prototipo: BackofficeOwner (coachValidation, modales)
Archivos permitidos: apps/web/app/admin/**, supabase (trigger/job 4° alumno; RPC de aprobación con audit_log), e2e/playwright
Archivos prohibidos: /admin/finanzas (F14), feedback (NO IMPLEMENTAR EN V1), promotores UI (NO IMPLEMENTAR EN V1)
Objetivo: el dueño opera validaciones y configuración global.
Tareas:
TANDA 1: sidebar (Dashboard, Usuarios, Entrenadores, Finanzas[disabled], Soporte[placeholder simple: tabla tickets], Configuración); Dashboard: MRR, usuarios por plan, coaches por estado, GMV, con rango temporal + badge global de pendientes (constancias >48 h) visible en toda sección (AC2); Usuarios: tabla con filtro plan/país, detalle con datos fiscales SOLO bajo botón "ver datos sensibles" que registra la visualización en audit_log; Entrenadores: cola de validación con preview inline del PDF (URL firmada), aprobar 1 clic / rechazar con motivo OBLIGATORIO (coach puede recargar, máx 3 — contador), detalle por coach (alumnos, ingresos, modelo de cobro).
TANDA 2: Configuración: editor de country_config (países activos, precios PRO, pisos por paquete, % comisión, sub coach) — cambios de comisión aplican a ciclos FUTUROS (guardar effective_from); regla server: al registrar el 4° alumno ACTIVO de un coach → billing_model='comision', irreversible, evento N18, audit_log; todo botón de aprobación escribe audit_log con before/after.
Tests obligatorios: Playwright: aprobar constancia → coach aparece en marketplace; rechazar → coach ve motivo y recarga; editar comisión → no afecta ciclo actual; unit: 4° alumno dispara cambio y el 3° no; baja a 3 NO revierte; RLS: solo owner accede a /admin (intento con coach → 403).
Comandos sugeridos: pnpm e2e; pnpm test
Definition of Done: AC1–AC4 de §12 PASS + audit_log con cada acción de las pruebas.
Documentación a actualizar: docs/progress/F13.md
Restricciones: nada de facturas/transferencias (F14); export CSV: NO IMPLEMENTAR EN V1.
Entrega esperada: /admin operativo + F13.md.
```

### FASE 14 — Cobros, liquidaciones, facturas y audit log

```
# FASE 14 — Cobros, liquidaciones, facturas y audit log

Agente principal recomendado: opus-orchestrator
Modelo recomendado: Opus orquesta; Sonnet implementa. Revisión Opus de billing OBLIGATORIA al cierre (R14)
Subagentes a invocar: payments-billing-engineer (lidera), web-next-engineer (UI /coach/cobros y /admin/finanzas), qa-automation-engineer, security-privacy-reviewer, docs-maintainer
Modo de trabajo: core→cron→UI coach→UI admin→e2e
Archivos obligatorios a leer antes de tocar código: CLAUDEmd, master doc §6.9 COMPLETO, §13 (settlements), §12 (AC2 coach: desglose con 20%); prototipo: flujo Cobros (estados pendiente_factura→facturado→transferido) y Finanzas (facturaStates)
Archivos permitidos: packages/core/billing, supabase/functions/settlements-cron, supabase (migración solo si falta campo), apps/web/app/coach/cobros, apps/web/app/admin/finanzas, e2e/
Archivos prohibidos: apps/mobile, landing
Objetivo: el ciclo del dinero del coach completo: cobro→liquidación→factura→aprobación→transferencia.
Tareas:
1. core/billing: calculateSettlement(payments[], commission_rate) → {gross, commission, net} con redondeo por moneda; tests exhaustivos (incluye centavos y montos límite).
2. settlements-cron quincenal: agrupa cobros del período por coach, descuenta comisión (rate del país DESDE country_config con effective_from), crea settlement 'open'→'invoice_pending', evento N11.
3. /coach/cobros: Mis Precios (config por paquete con validación de piso inline: borde rojo + mínimo — patrón del prototipo) + preview de neto (bruto − 20%); Liquidaciones: desglose por alumno, carga de factura (PDF/JPG ≤10MB a bucket invoices, número único por coach validado), datos bancarios por país; historial con estados.
4. /admin/finanzas: facturas por estado; AUTO-APROBACIÓN si número único y monto exacto (regla §6.9); aprobar/rechazar con motivo (rechazo → coach recarga, evento N13); "Marcar transferido" SOLO si approved, con confirmación (la transferencia bancaria es manual humana: el botón registra, no mueve dinero) → evento N12; TODO a audit_log.
5. Contracargo (webhook MP) → suspende paquete + evento N22 + ticket.
Tests obligatorios: unit cálculo (≥80% billing); e2e Playwright: ciclo completo cobro demo→liquidación→factura→aprobar→transferido; transferir sin approved → bloqueado; número duplicado → 409; replay del cron no duplica liquidaciones.
Comandos sugeridos: pnpm test; pnpm e2e; supabase functions serve
Definition of Done: ciclo end-to-end PASS + audit_log completo + security APTO + revisión Opus R14 = APTO.
Documentación a actualizar: docs/progress/F14.md, docs/runbooks/liquidaciones.md (operación quincenal del dueño paso a paso)
Restricciones: comisión jamás hardcodeada; sin export CSV (V1.5).
Entrega esperada: dinero operativo + F14.md.
```

### FASE 15 — Chat, notificaciones y email

```
# FASE 15 — Chat, notificaciones y email

Agente principal recomendado: opus-orchestrator
Modelo recomendado: Opus orquesta; Sonnet implementa
Subagentes a invocar: notifications-realtime-engineer (lidera), mobile-expo-engineer, web-next-engineer (mensajes en /coach), qa-automation-engineer, docs-maintainer
Modo de trabajo: notify primero (motor), luego conexión de eventos, luego chat
Archivos obligatorios a leer antes de tocar código: CLAUDE.md, master doc §7 COMPLETO (matriz N1–N23 + reglas)
Archivos permitidos: supabase/functions/notify, supabase (notifications/preferences), packages/core/src/notifications, apps/mobile (permiso post-primer-workout, token, deep links, centro, preferencias, chat), apps/web/app/coach/mensajes, e2e/
Archivos prohibidos: N16–N17, N19–N21, N23 (V1.5/V2: NO IMPLEMENTAR EN V1), WhatsApp (NO IMPLEMENTAR EN V1)
Objetivo: matriz V1 operativa (N1–N15, N18, N22) + chat coach-alumno.
Contexto: F9–F14 dejaron eventos emitidos por interfaz notify() en stub; acá se vuelven reales. Si RESEND_API_KEY falta: mock + HUMAN_REQUIRED (verificar dominio DNS también es humano).
Tareas:
1. Edge Function notify: {type,user_id,payload} → canales según matriz; preferencias por categoría×canal; cap 3 push/día; quiet hours 22–08 hora local del usuario; colapso de chat 5 min; regla "dinero por ≥2 canales, email de dinero no opt-out-able"; persistencia en notifications.
2. Conectar TODOS los eventos ya emitidos: N1–N5, N8–N15, N18, N22; N6 (chat) y N7 (rutina del día 08:00 local, salvo descanso) nuevos.
3. Plantillas Resend de cada email de la matriz (textos base de §7; faltantes TODO_COPY).
4. Mobile: pedir permiso push DESPUÉS del primer workout completado (no en onboarding); registro de token Expo; deep links por tipo (mapa de F6); centro de notificaciones (lista con read_at, diseño del prototipo); preferencias en Configuración.
5. Chat 1:1 por assignment (Supabase Realtime): texto en V1 (adjuntos: NO IMPLEMENTAR EN V1), solo entre partes con assignment accepted/active (RLS ya lo exige), read receipts simples; vista web en /coach/mensajes.
Tests obligatorios: matriz V1 evento por evento (disparo→canales correctos→deep link abre la pantalla); quiet hours y cap (relojes simulados); push desactivado → email de dinero llega igual; RLS de messages (tercero no lee); chat entrega en <2 s en local.
Comandos sugeridos: pnpm test; pnpm e2e; supabase functions serve
Definition of Done: cada notificación V1 con test PASS y deep link verificado; chat funcionando app↔web.
Documentación a actualizar: docs/progress/F15.md
Restricciones: ningún evento crítico de dinero depende solo de push.
Entrega esperada: comunicación completa + F15.md.
```

### FASE 16 — Analytics, Sentry y observabilidad

```
# FASE 16 — Analytics, Sentry y observabilidad

Agente principal recomendado: opus-orchestrator
Modelo recomendado: Opus orquesta; Sonnet implementa
Subagentes a invocar: monorepo-architect (SDKs/config), qa-automation-engineer (tests de payloads), security-privacy-reviewer, docs-maintainer
Modo de trabajo: una pasada
Archivos obligatorios a leer antes de tocar código: CLAUDE.md, master doc §17 (plan de eventos)
Archivos permitidos: packages/core/src/analytics, apps/* (init de SDKs), supabase/functions (Sentry en functions), .env.example
Archivos prohibidos: lógica de producto
Objetivo: ver qué pasa en producción sin violar privacidad.
Contexto: analytics() ya existe como interfaz (F5/F6); acá se conecta. HUMAN_REQUIRED: POSTHOG_KEY (host EU) y SENTRY_DSN en .env; sin claves → sigue el logger local + HUMAN_REQUIRED.
Tareas:
1. PostHog: implementar la interfaz analytics() con los eventos de §17 (signup_completed, workout_started/completed, routine_created, upgrade_modal_shown/started, purchase_succeeded, ad_autopromo_shown/skipped, marketplace_*, assignment_accepted, checkin_*, message_sent, settlement_*, subscription_canceled) con propiedades EXACTAS de la tabla; user properties: plan, country, role.
2. Scrub de PII: capa que rechaza en build/test cualquier payload con email, nombre, peso, foto, dni (lista de claves prohibidas + test automatizado).
3. Sentry en mobile (source maps vía EAS), web y Edge Functions; release tagging; alerta por email al humano.
4. Logs de functions: estructurados, sin PII, con request_id.
Tests obligatorios: test de payloads (intentar enviar PII → falla el test); evento de prueba visible en PostHog (o logueado por mock); error de prueba visible en Sentry (o mock).
Comandos sugeridos: pnpm test; pnpm dev
Definition of Done: §17 instrumentado al 100% + scrub probado + security APTO.
Documentación a actualizar: docs/progress/F16.md, docs/runbooks/observabilidad.md
Restricciones: datos de salud JAMÁS a analytics (peso solo como bucket si la spec lo pide — no lo pide: no enviarlo).
Entrega esperada: observabilidad + F16.md.
```

### FASE 17 — QA completo

```
# FASE 17 — QA completo

Agente principal recomendado: opus-orchestrator
Modelo recomendado: Opus orquesta; Sonnet implementa
Subagentes a invocar: qa-automation-engineer (LIDERA), todos los engineers (corrigen lo suyo), product-spec-guardian, docs-maintainer
Modo de trabajo: auditoría → corrección por dueño de archivo → suite completa
Archivos obligatorios a leer antes de tocar código: CLAUDE.md, master doc §18 y criterio Sprint 6 ("todos los estados vacíos con ilustración y CTA"; "flujo completo end-to-end sin errores")
Archivos permitidos: tests/, e2e/, supabase/tests, docs/qa, correcciones en apps/packages SOLO por el agente dueño según ownership
Archivos prohibidos: features nuevas de cualquier tipo
Objetivo: cero deuda de calidad antes de hablar de stores.
Tareas:
1. qa audita TODA la superficie y genera docs/qa/audit-estados.md: tabla pantalla×{loading,empty,error,success,offline} con FALTA donde corresponda.
2. Cada FALTA la corrige el agente dueño usando packages/ui (EmptyState/ErrorState/Skeleton/Toast).
3. Suite completa: unit (≥80% core/billing y core/gating), RLS íntegra, idempotencia de los 3 webhooks, Playwright (todos los flujos /admin y /coach), Maestro (signup, workout offline, upgrade, checkout coach, responder check-in).
4. E2E MAESTRO final en staging con sandbox MP: registrarse → Free → 3 rutinas → bloqueo 4ª → upgrade PRO → contratar coach → coach acepta → chat → check-in → liquidación → factura → aprobar → transferido. Documentar cada paso con evidencia.
5. product-spec-guardian: revisión integral final contra master doc.
Tests obligatorios: TODO lo anterior; cero FAIL, cero skip sin entrada en open-questions.
Comandos sugeridos: pnpm test; pnpm test:rls; pnpm e2e
Definition of Done: docs/progress/F17.md sin un solo FAIL + spec-review CUMPLE integral.
Documentación a actualizar: docs/progress/F17.md, docs/qa/
Restricciones: prohibido bajar cobertura o borrar tests para aprobar.
Entrega esperada: producto verificable + F17.md.
```

### FASE 18 — PWA desktop

```
# FASE 18 — PWA desktop

Agente principal recomendado: opus-orchestrator
Modelo recomendado: Opus orquesta; Sonnet implementa
Subagentes a invocar: web-next-engineer (implementa), qa-automation-engineer, docs-maintainer
Modo de trabajo: una pasada
Archivos obligatorios a leer antes de tocar código: CLAUDE.md, master doc §9.3
Archivos permitidos: apps/web/app/(pwa)/**, apps/web/public (manifest, sw, íconos), e2e/playwright/pwa*
Archivos prohibidos: apps/mobile, /admin, /coach (ya tienen lo suyo)
Objetivo: el alumno desktop instala Forzza y consulta su entrenamiento.
Contexto: decisión de alcance del master doc: la PWA del alumno es un shell de CONSULTA (login + progreso + plan semanal en lectura + perfil), SIN workout activo en V1 (NO IMPLEMENTAR EN V1).
Tareas:
1. (pwa)/app: login compartido, Progreso (LineCharts web), Plan Semanal lectura, Mi Plan (gestión de suscripción si fue comprada por MP web), Perfil.
2. manifest.json (name Forzza, icons 192/512, display standalone, theme #C8FF00 / background #080810), service worker: network-first para datos, cache-first para assets, manejo de actualización (toast "Nueva versión, recargá").
3. Instalabilidad (beforeinstallprompt con botón propio), responsive ≥1024 y degradación elegante a 768.
4. /admin y /coach también instalables (mismo manifest scope o manifests por ruta — decidir y documentar en decisions/).
Tests obligatorios: Lighthouse PWA ≥90 en (pwa)/app; e2e: instalar (simulado), navegar offline lo cacheado, update flow.
Comandos sugeridos: pnpm dev:web; pnpm e2e
Definition of Done: PWA instalable con Lighthouse ≥90 y datos reales.
Documentación a actualizar: docs/progress/F18.md
Restricciones: no duplicar lógica: consumir los mismos endpoints y packages.
Entrega esperada: PWA + F18.md.
```

### FASE 19 — Preparación App Store / Play Store

```
# FASE 19 — Preparación App Store / Play Store

Agente principal recomendado: opus-orchestrator
Modelo recomendado: Opus orquesta; Sonnet implementa
Subagentes a invocar: release-store-engineer (lidera), mobile-expo-engineer (ajustes de review), qa-automation-engineer (checklist §9), docs-maintainer
Modo de trabajo: builds → metadata → checklist → pasos humanos
Archivos obligatorios a leer antes de tocar código: CLAUDE.md, master doc §9.1 y §9.2 COMPLETOS
Archivos permitidos: apps/mobile/{eas.json,app.config.ts}, assets de store, docs/store-setup.md, docs/runbooks/release.md, scripts de seed de cuenta demo
Archivos prohibidos: lógica de producto (cualquier bug hallado vuelve al agente dueño)
Objetivo: builds enviables y un manual humano de publicación sin ambigüedades.
Contexto: HUMAN_REQUIRED previos: cuenta Apple Developer activa (la verificación tarda días), Play Console con 12 testers reclutados, productos IAP creados (la guía exacta la genera esta fase). Sin credenciales: generar todo lo generable y marcar cada paso humano.
Tareas:
1. eas.json final (development/preview/production), app.config.ts: bundle id com.forzza.app, íconos+splash desde assets, versionado automático, permisos mínimos (cámara solo si quedó alguna feature que la use en V1 — verificar; notificaciones runtime Android 13+), EAS Submit configurado.
2. Cuenta demo para revisores: script que puebla un alumno PRO y un alumno con coach asignado con datos realistas; credenciales en docs/store-setup.md.
3. Verificaciones de policy en la app: eliminar cuenta accesible, gestionar/cancelar suscripción accesible, links a privacidad y términos (páginas de la landing).
4. docs/store-setup.md: CADA paso humano numerado para App Store Connect (crear app, productos IAP PRO con precios por territorio desde country_config, App Privacy labels: salud y fitness, fotos, identificadores, datos de pago, sin tracking de terceros; nota al revisor: "los paquetes de coaching son servicios persona-a-persona 1:1, guideline 3.1.3(e), por eso se contratan vía web") y Play Console (Data Safety pregunta por pregunta, IARC, closed testing 14 días/12 testers).
5. Ficha de store ES y EN (título ≤30, subtítulo, descripción, keywords) + plan de screenshots (6.7"/6.5"/5.5"; solo iPhone, sin iPad en V1).
6. Builds: EAS preview → TestFlight + internal track (o instrucciones exactas si faltan credenciales).
Tests obligatorios: checklist §9.1 y §9.2 punto por punto PASS/FAIL/HUMAN_REQUIRED; smoke del build preview instalado en un dispositivo real (humano confirma).
Comandos sugeridos: eas build --profile preview --platform all; eas submit
Definition of Done: builds instalables + store-setup.md ejecutable por un humano sin contexto + checklist sin FAIL (HUMAN_REQUIRED permitidos y listados).
Documentación a actualizar: docs/progress/F19.md, docs/store-setup.md
Restricciones: jamás subir a track público; jamás pedir/inventar credenciales.
Entrega esperada: camino a stores listo + F19.md.
```

### FASE 20 — Hardening final y release candidate

```
# FASE 20 — Hardening final y release candidate

Agente principal recomendado: opus-orchestrator
Modelo recomendado: Opus 4.8 (esta fase es mayormente revisión); Sonnet para fixes
Subagentes a invocar: TODOS según hallazgos; security-privacy-reviewer y qa obligatorios; docs-maintainer cierra
Modo de trabajo: separación de entornos → smoke prod → revisión RC
Archivos obligatorios a leer antes de tocar código: CLAUDE.md, master doc §23 (checklist final), todos los docs/progress
Archivos permitidos: configuración de entornos, .github/workflows (deploy prod con aprobación manual), docs/runbooks, fixes puntuales por agente dueño
Archivos prohibidos: features nuevas (cualquier "ya que estamos" se rechaza)
Objetivo: release candidate operable por el dueño.
Contexto: HUMAN_REQUIRED previos: proyecto Supabase de PRODUCCIÓN separado, credenciales MP PRODUCTIVAS (cuenta vendedor verificada — confirmar en el panel la tarifa real de suscripciones y registrarla en docs/decisions), dominio en Vercel.
Tareas:
1. Entornos staging/production separados (Supabase, Vercel, EAS channels, RevenueCat); variables productivas SOLO en dashboards; backups diarios + PITR verificados.
2. Cutover MP test→prod detrás de env; webhook prod con firma validada.
3. Smoke de producción: signup real, compra PRO sandbox-store, transacción real de prueba de paquete coach con tarjeta del humano (HUMAN_REQUIRED: la hace el humano siguiendo runbook) verificada end-to-end y reembolsada; emails a inbox (no spam); Sentry recibe error de prueba; PostHog recibe eventos.
4. security-privacy-reviewer: auditoría final integral (severidades; CRÍTICA/ALTA bloquean).
5. docs/runbooks completos: deploy, rotación de claves, liquidación quincenal, soporte, restore de backup, respuesta a contracargo.
6. docs/progress/GO-LIVE.md: checklist §23 del master doc marcando lo técnico PASS y lo humano pendiente (legales, contable, entrevistas, marca).
Tests obligatorios: smoke suite prod completa; re-corrida de la suite F17 en staging.
Comandos sugeridos: pnpm e2e; runbooks
Definition of Done: revisión RC de Opus (prompt R20) = APTO; GO-LIVE.md verde salvo ítems humanos listados.
Documentación a actualizar: docs/progress/F20.md, GO-LIVE.md, runbooks
Restricciones: ninguna clave productiva en el repo; deploy prod solo con aprobación humana explícita.
Entrega esperada: Forzza V1 release candidate.
```

---

## 8. Prompts de revisión Opus

Se ejecutan en el hilo principal (Opus 4.8), en sesión limpia, DESPUÉS de cerrar la fase indicada. Output común: `docs/progress/review-RX.md` con veredicto **APTO / APTO-CON-FIXES / NO-APTO**, lista de fixes **bloqueantes** y **no bloqueantes** (cada uno con agente responsable), y decisión explícita de si se puede avanzar.

### R1 — Arquitectura (después de Fase 1)
```
Revisión de arquitectura R1. No modifiques código. Leé CLAUDE.md, docs/forzza-master-doc.md §8, docs/progress/F1.md y la estructura real del repo (tree).
Verificá: (1) la estructura coincide con la sección 2 del build system (desvíos listados con justificación o fix); (2) tsconfig realmente estricto en todos los packages; (3) scripts cross-platform (buscar bash-only, &&, rm -rf); (4) pipeline turbo con caché correcto; (5) CI cubre lint+typecheck+test; (6) .env.example completo contra §8; (7) la regla anti-hex existe y corre; (8) ningún secreto commiteado (grep).
Riesgos: ¿algo de esta base va a doler en F7 (offline), F9 (webhooks) o F19 (EAS)? Nombralo ahora.
Emití docs/progress/review-R1.md con veredicto y fixes. Si NO-APTO, delegá los fixes bloqueantes a monorepo-architect y re-revisá.
```

### R2 — Seguridad/RLS (después de Fase 2)
```
Revisión de seguridad R2. No modifiques código. Leé master doc §13 (matriz de permisos), supabase/migrations completas, supabase/tests y docs/progress/F2.md + security-review-F2.md.
Verificá tabla por tabla: (1) RLS habilitada y default-deny real (¿hay alguna policy USING(true) injustificada?); (2) la matriz §13 implementada literal (coach↔assignment activo; fotos solo pro/elite; promoter sin PII); (3) constraints de negocio presentes (piso, unicidades, append-only); (4) buckets privados con políticas; (5) los tests RLS cubren cada regla (mapeo regla→test; reglas sin test = bloqueante); (6) seeds sin datos reales.
Pensá como atacante: 3 intentos de bypass concretos y verificá si los tests los cubren; si no, ordená a qa agregarlos.
Emití docs/progress/review-R2.md con veredicto.
```

### R3 — Auth (después de Fase 3)
```
Revisión R3 de autenticación. No modifiques código. Leé master doc §6.1–6.4, docs/progress/F3.md y el código de auth (server, mobile, web).
Verificá: (1) verificación de email obligatoria antes de acciones sensibles; (2) recuperación de contraseña completa; (3) regla <18 aplicada SERVER-side (no solo UI); (4) eliminar cuenta: soft delete + subs canceladas + anonimización planificada; (5) middleware /admin y /coach valida rol en servidor; (6) onboarding coach deja constancia en bucket privado y estado pending; (7) bloqueo 5 intentos; (8) OAuth detrás de flag si faltan credenciales, con HUMAN_REQUIRED claro; (9) nada de tokens/sesiones en logs.
Contrastá con CLAUDE.md reglas 7 y 8. Emití docs/progress/review-R3.md.
```

### R7 — Mobile core (después de Fase 7)
```
Revisión R7 del core mobile. No modifiques código. Leé master doc §11.3 (Workout AC1–AC3), §6.6, docs/progress/F7.md, y el código de workout/rutinas/progreso.
Verificá: (1) AC1–AC3 con evidencia real (no solo declarado); (2) la cola offline es idempotente de verdad (leé la implementación: ¿client_uuid en el server con unique?); (3) snapshot de rutina en ejecución (coach edita ≠ rompe sesión activa); (4) estados loading/empty/error/success en cada pantalla nueva; (5) cero lógica de negocio en componentes (debería estar en core o server); (6) tokens de ui en todos los estilos; (7) eventos analytics §17 instrumentados; (8) performance: listas con FlatList/virtualización, imágenes acotadas.
Probá mentalmente 3 casos hostiles (red intermitente a mitad de set; reloj del teléfono mal; rutina borrada en server durante ejecución) y verificá cobertura. Emití docs/progress/review-R7.md.
```

### R14 — Billing (después de Fase 14)
```
Revisión R14 de billing — la más importante del proyecto. No modifiques código. Leé master doc §4.3 (números), §6.8–6.9, §13, docs/progress/F9.md, F11.md, F14.md, y TODO packages/core/billing + functions de pagos.
Verificá: (1) cálculo de liquidación reproduce los números de §4.3 (corré los tests y un caso a mano: paquete AR $39.900, comisión 20% = $7.980); (2) dinero SIEMPRE en enteros, redondeo solo en core/billing; (3) idempotencia REAL de los 3 webhooks (leé el código del lock/unique, no solo el test); (4) commission_rate desde country_config con effective_from (cambio no retroactivo); (5) sub→comisión al 4° ACTIVO, irreversible, con test del caso "baja a 3"; (6) sin factura aprobada no hay transferido (¿hay algún camino que lo saltee?); (7) audit_log en CADA mutación financiera (mapeo mutación→registro; faltantes = bloqueante); (8) refund a 72 h con audit; (9) contracargo suspende y notifica; (10) mocks de gateway no pueden quedar activos en prod (¿cómo falla si falta la clave? debe fallar ruidoso, no silencioso).
Emití docs/progress/review-R14.md. NO-APTO si cualquiera de 1, 3, 6, 7 o 10 falla.
```

### R20 — Release candidate (después de Fase 20)
```
Revisión final R20. No modifiques código. Leé GO-LIVE.md, todos los docs/progress/review-R*.md, security-review final, F17.md y F19/F20.
Decidí como si tu nombre quedara en el release: (1) ¿el e2e maestro corre en staging sin intervención? (2) ¿quedó algún FAIL, skip o HUMAN_REQUIRED técnico sin resolver? (3) ¿los fixes no-bloqueantes acumulados de R1–R14 fueron cerrados o aceptados explícitamente en decisions/? (4) ¿hay deuda que comprometa la operación del primer mes (liquidación quincenal, soporte, restore)? (5) ¿la lista de pendientes humanos de GO-LIVE.md es completa y honesta (legales, contable, marca, entrevistas, stores)? (6) ¿el rollback está documentado en runbooks?
Emití docs/progress/review-R20.md con veredicto APTO/NO-APTO y, si APTO, el mensaje final al humano con sus próximos pasos exactos no-técnicos.
```

---

## 9. Prompts de recuperación

Usalos cuando algo falla. Todos comparten 3 reglas: diagnóstico antes de tocar nada, registro en `docs/progress/incidentes.md` (fecha, síntoma, causa, fix), y prohibido "arreglar" borrando tests o relajando seguridad.

### 9.1 El monorepo no instala
**Agente:** monorepo-architect. **No tocar:** lockfile a mano, supabase/.
```
pnpm install falla. Delegá a monorepo-architect: (1) capturar el error completo; (2) verificar node -v y pnpm -v contra engines de package.json; (3) en Windows: probar pnpm store prune y reinstalar; revisar paths largos y OneDrive; (4) si es un paquete puntual, aislarlo (instalar workspace por workspace); (5) NUNCA editar pnpm-lock.yaml a mano ni borrar versiones de dependencias para "que pase". Fix mínimo + entrada en docs/progress/incidentes.md.
```

### 9.2 TypeScript rompe
**Agente:** el dueño del archivo según ownership; coordina opus. **No tocar:** tsconfig para relajar strict.
```
pnpm typecheck falla. Protocolo: (1) listar TODOS los errores agrupados por package; (2) clasificar: tipo desactualizado de DB (→ pnpm db:types y re-evaluar), error real de código (→ agente dueño), tipo de librería (→ resolver con tipos correctos, no any). PROHIBIDO: any, @ts-ignore, bajar strict. Si un error exige decisión de diseño, registrarlo en open-questions y traérmelo. Fix + incidentes.md.
```

### 9.3 pnpm/turbo falla en Windows
**Agente:** monorepo-architect.
```
Comando falla en Windows pero la lógica parece correcta. Delegá a monorepo-architect: (1) identificar el patrón no-portable (&&, rm, rutas /, variables $VAR); (2) reemplazar por npm-run-all/rimraf/cross-env/scripts Node; (3) revisar TODO package.json buscando el mismo patrón (no solo el que falló); (4) probar el comando en PowerShell. Documentar el patrón prohibido en docs/decisions/windows-compat.md.
```

### 9.4 Supabase migrations fallan
**Agente:** supabase-rls-engineer. **No tocar:** migraciones ya aplicadas.
```
pnpm db:reset o supabase db push falla. Delegá a supabase-rls-engineer: (1) leer el error SQL exacto y la migración que lo causa; (2) si la migración FALLIDA aún no fue aplicada en ningún entorno compartido: corregirla; si ya fue aplicada en staging/prod: crear migración NUEVA correctiva, jamás editar la vieja; (3) verificar orden y dependencias (FKs antes que tablas que las usan); (4) reproducir en local desde cero (supabase db reset). Fix + test que cubra el caso + incidentes.md.
```

### 9.5 RLS bloquea de más
**Agente:** supabase-rls-engineer + qa. **No tocar:** la policy con USING(true) "para destrabar".
```
Una query legítima devuelve vacío/403 por RLS. Protocolo: (1) reproducir con el rol exacto en un test (no en producción); (2) identificar la policy que filtra de más leyendo su USING/WITH CHECK; (3) corregir la policy al MÍNIMO permiso que habilita el caso legítimo (citar la regla de §13 que lo respalda); (4) agregar test del caso legítimo Y mantener el test del caso prohibido. Si no hay regla en §13 que respalde el acceso, NO es un bug de RLS: es scope creep — open-questions.md.
```

### 9.6 RLS permite de más
**Agente:** security-privacy-reviewer diagnostica, supabase-rls-engineer corrige. SEVERIDAD CRÍTICA.
```
Se detectó acceso indebido (un rol lee/escribe lo que no debe). Tratalo como incidente de seguridad: (1) security-privacy-reviewer reproduce y delimita el alcance (qué tablas, qué roles, desde cuándo — git log de la policy); (2) supabase-rls-engineer corrige la policy de inmediato con migración nueva; (3) qa agrega el test de acceso cruzado que faltaba; (4) revisar TODAS las policies hermanas buscando el mismo patrón; (5) registrar en incidentes.md con severidad CRÍTICA y avisarme si datos demo/reales estuvieron expuestos. No se avanza de fase hasta cerrar esto.
```

### 9.7 Webhook duplica pagos
**Agente:** payments-billing-engineer. SEVERIDAD CRÍTICA.
```
Un evento de pago produjo efecto doble. (1) Congelar: identificar el registro duplicado en payments/subscriptions y su audit_log; (2) leer la implementación de idempotencia: ¿processed_events tiene UNIQUE por event_id? ¿el insert y el efecto están en la MISMA transacción? — el bug suele estar ahí; (3) corregir con transacción + unique constraint (el constraint es la defensa, el if es decoración); (4) test de replay ×5 concurrente (no secuencial); (5) script de reconciliación para detectar otros duplicados históricos; (6) incidentes.md CRÍTICA.
```

### 9.8 RevenueCat no sincroniza entitlement
**Agente:** payments-billing-engineer + mobile-expo-engineer.
```
Compra IAP hecha pero isPro no cambia. Diagnóstico en orden: (1) ¿llegó el webhook? (logs de la function; si no llegó: URL/auth header en dashboard RC — HUMAN_REQUIRED si hay que tocar el dashboard); (2) ¿el webhook procesó? (processed_events + errores Sentry); (3) ¿el app_user_id de RC coincide con nuestro user_id? (bug clásico: anonymous id); (4) ¿el cliente revalida /me tras la compra? (5) ¿restore purchases funciona? Corregir el eslabón roto, agregar test del eslabón, documentar el flujo completo en runbooks/pagos.md con diagrama de quién llama a quién.
```

### 9.9 Expo build falla
**Agente:** release-store-engineer. **No tocar:** lógica de producto.
```
eas build falla. (1) Capturar el log COMPLETO del build (link de EAS); (2) clasificar: dependencia nativa incompatible con SDK (→ versión compatible vía expo install), credenciales/perfiles (→ HUMAN_REQUIRED con paso exacto en expo.dev), assets inválidos (tamaños de ícono/splash), versionado; (3) probar primero un build de development local si aplica; (4) NUNCA degradar el SDK de Expo como atajo sin mi aprobación (decisión registrada). Fix + incidentes.md + nota en runbooks/release.md si es un caso repetible.
```

### 9.10 Next.js build falla
**Agente:** web-next-engineer.
```
next build falla (local o Vercel). (1) Error completo y página/ruta exacta; (2) clasificar: uso de API de cliente en Server Component (el clásico), import de paquete native en web, env faltante en build (→ definir en Vercel y .env.example), fetch en build sin manejo de fallo (→ ISR con fallback); (3) corregir respetando Server Components por defecto; (4) agregar el caso al CI si era detectable (lint rule o test). Fix + incidentes.md.
```

### 9.11 Tests E2E fallan
**Agente:** qa-automation-engineer diagnostica; corrige el dueño.
```
E2E rojos. Protocolo: (1) ¿flaky o determinístico? Correr 3 veces el test aislado; (2) flaky → arreglar la ESPERA (waitFor de estado real, no sleep), nunca aumentar timeouts a ciegas; (3) determinístico → ¿cambió el producto (test desactualizado, lo corrige qa) o se rompió el producto (lo corrige el agente dueño)? (4) fixtures/seeds: ¿el test depende de datos que otra suite muta? Aislar datos por test; (5) prohibido skip sin entrada en open-questions.md. Reporte de causa raíz en incidentes.md.
```

### 9.12 Play Store / App Store rechazan la app
**Agente:** release-store-engineer + opus para la estrategia.
```
Rechazo de store. (1) Pegar el texto EXACTO del rechazo (guideline citada); (2) release-store-engineer mapea la guideline contra nuestra implementación y el checklist §9 (¿qué punto fallamos o qué interpretó distinto el revisor?); (3) clasificar respuesta: fix de producto (delegar al dueño), aclaración al revisor (redactar respuesta citando 3.1.3(e) si es el caso de paquetes de coach — usar la nota preparada), o metadata; (4) actualizar docs/store-setup.md con la lección; (5) re-submit solo con mi OK. Registrar en incidentes.md y en runbooks/release.md.
```

### 9.13 Claude Code modifica demasiados archivos
**Agente:** opus-orchestrator (control).
```
PARÁ. No sigas editando. (1) git status y listá TODO lo modificado sin commitear; (2) separá: cambios dentro del scope de la tarea actual vs fuera de scope; (3) lo fuera de scope: git checkout -- (descartar) salvo que sea un fix real, en cuyo caso commitealo APARTE con su propia justificación; (4) lo dentro de scope: commits pequeños convencionales; (5) explicame en 5 líneas por qué te expandiste y qué regla de CLAUDE.md lo hubiera evitado; (6) registrá en incidentes.md. Retomamos la tarea original desde el último commit limpio.
```

### 9.14 Claude Code se salió del scope (features V2/V3 o no pedidas)
**Agente:** product-spec-guardian + opus.
```
Sospecho scope creep. (1) product-spec-guardian: comparar el diff actual contra la tarea de la fase y contra la lista NO IMPLEMENTAR EN V1 de CLAUDE.md; listar cada adición sin respaldo en specs; (2) revertir lo no respaldado (si algo parece valioso: NO se implementa, se anota en open-questions.md como propuesta); (3) verificar que las tablas-placeholder permitidas (promotores) no hayan ganado UI; (4) reporte en incidentes.md con la regla violada. Después seguimos la fase como estaba definida.
```

### 9.15 La sesión se quedó sin contexto
**Agente:** humano + docs-maintainer.
```
[Pegar en una SESIÓN NUEVA tras /clear]
Sesión anterior agotada. Recuperá el estado SIN releer archivos grandes: (1) leé CLAUDE.md, docs/progress/HANDOFF.md si existe, si no el docs/progress/F*.md más reciente, y git log --oneline -15; (2) verificá git status (si hay WIP sin commitear: revisalo y commitealo o descartalo con criterio); (3) decime en 10 líneas: fase actual, qué está hecho, qué sigue, qué HUMAN_REQUIRED hay pendiente; (4) esperá mi confirmación y retomá el prompt de fase desde la tarea pendiente. De acá en más: usá /forzza-handoff-next-session ANTES de agotar el contexto.
```

---

## 10. Guía de gasto y modelos

**Principio:** Opus piensa, Sonnet tipea, los read-only vigilan. El costo se controla con tres palancas: modelo correcto por tarea, contexto mínimo suficiente, y memoria externa en `docs/progress`.

| Situación | Modelo/Agente | Por qué |
|---|---|---|
| Planificar fase, descomponer, resolver conflicto entre dominios, decidir trade-off | Opus (hilo principal) | Errores acá cuestan fases enteras |
| Implementar pantallas, funciones, tests, migraciones | Subagentes Sonnet | 80% del volumen de tokens; Sonnet lo hace bien con DoD claro |
| Verificar spec, auditar seguridad | product-spec-guardian / security-privacy-reviewer (Sonnet, read-only) | Sin permiso de escritura no pueden "arreglar" caro lo que deben reportar barato |
| Revisiones R1–R20 | Opus | Es su función nuclear |
| Tareas repetitivas (resolver TODO_COPY, regenerar tipos, formatear) | Sonnet directo | Si ves a Opus haciéndolas, cortá: "delegá esto a <agente>" |

**Reglas de contexto:**
1. **Una fase = una sesión.** `/clear` antes de cada prompt de fase. El prompt + CLAUDE.md + el progress anterior son contexto suficiente por diseño.
2. **Cargar siempre:** CLAUDE.md (corto a propósito) y el `docs/progress` relevante. **No cargar completos jamás:** `forzza-master-doc.md` (leer SOLO las secciones citadas en el prompt), `reference/forza-complete.jsx` (7.600 líneas: leer solo el componente que se está portando, por nombre con Grep), lockfiles, migraciones viejas.
3. **`docs/progress` es la memoria.** Si algo importa para la próxima sesión y no está en progress/HANDOFF, no existe. Por eso docs-maintainer cierra cada fase.
4. **Compactar/traspasar:** cuando notes respuestas más lentas o el contexto cargado de diffs largos, `/forzza-handoff-next-session` y sesión nueva. No esperes a que se agote (el prompt 9.15 existe, pero es la opción cara).
5. **Subagentes en paralelo** solo sin archivos compartidos (el orquestador lo decide en /forzza-plan-phase); en paralelo gastan lo mismo pero terminan antes — el ahorro real es que sus contextos mueren al terminar y no inflan el hilo principal.
6. **DoD como contrato con Sonnet:** cada delegación lleva criterio de aceptación textual + archivos permitidos/prohibidos. Sonnet con DoD vago itera (caro); con DoD claro converge (barato).
7. **No re-leer gigantes:** si un agente necesita el mismo extracto del master doc dos veces, que docs-maintainer lo copie a `docs/product/<tema>.md` una vez y se referencie eso.

---

## 11. Definition of Done global — "Forzza V1 está lista" cuando:

**Producto:** el e2e maestro (registro → Free con límites reales → upgrade PRO → marketplace → contratar coach → asignación → chat → check-in → liquidación → factura → aprobación → transferido) corre completo en staging sin intervención técnica. Las pantallas de §2.1 marcadas P0 existen con sus 4 estados. Nada de la lista NO-V1 tiene UI.
**Técnico:** CI verde; typecheck estricto sin any/ts-ignore injustificados; cero hex fuera de tokens; tipos de DB generados al día; offline del workout probado en dispositivo real.
**Seguridad:** security review final APTO; RLS íntegra con tests por regla; buckets privados con TTL; cero secretos en repo; cero PII en logs/analytics (test automatizado); consentimiento parental server-side.
**QA:** cobertura ≥80% en core/billing y core/gating; suites unit/RLS/idempotencia/e2e web/e2e mobile verdes; cero skip sin open-question; auditoría de estados sin FALTA.
**Pagos:** idempotencia probada con replay concurrente; números de §4.3 reproducidos por tests; comisión y precios 100% desde country_config; dunning operativo; refund 72 h y contracargo manejados; audit_log mapeado a toda mutación financiera; transacción real de prueba ejecutada y reembolsada.
**Stores:** build en TestFlight + internal track instalados en dispositivos reales; checklist §9.1/9.2 sin FAIL; store-setup.md ejecutable; cuenta demo de revisión operativa; eliminar cuenta y gestionar suscripción accesibles.
**PWA:** Lighthouse PWA ≥90; instalable; update flow probado; backoffices usables ≥1024px.
**Documentación:** runbooks de deploy, liquidación quincenal, soporte, rotación de claves, restore y rollback; decisions/ al día; GO-LIVE.md emitido; open-questions sin bloqueantes.
**Operación del dueño:** puede, siguiendo solo runbooks, aprobar una constancia, aprobar una factura, marcar una transferencia, responder un ticket y leer su dashboard — en <2 h/semana por cada 10 coaches (métrica §3.3).
**Operación del coach:** un coach real (no demo) completó onboarding, fue aprobado, configuró precios, recibió un alumno de prueba y entendió su liquidación sin soporte telefónico.

---

## 12. Intervención humana inevitable

| Acción humana | Cuándo | Por qué no se automatiza | Qué prepara Claude Code |
|---|---|---|---|
| Crear cuentas (Supabase, Resend, RevenueCat, PostHog, Sentry, Vercel) | F2 (Supabase), F3 (Resend), F9 (RC), F16, F20 | Identidad, facturación y aceptación de términos son personales | `.env.example` comentado con el link y el paso exacto por variable; mocks que mantienen todo verde mientras tanto |
| Cargar claves privadas en .env y dashboards | Cada fase con HUMAN_REQUIRED | Claude no debe ver ni inventar secretos | Validación de arranque que falla ruidoso si falta una clave en prod; runbook de rotación |
| Crear app Mercado Pago (test) y luego cuenta vendedor verificada (prod) | F9 (test) / F20 (prod) | KYC y datos bancarios reales | Webhooks listos, sandbox documentado en runbooks/pagos.md; checklist de cutover |
| Validar la tarifa real de MP suscripciones en tu panel | F20 | Depende de TU cuenta; el §20 del master doc lo marca pendiente | Lugar exacto en decisions/ para registrar el número y recalcular márgenes |
| Decidir entidad legal y residencia fiscal | ANTES de F19 (las cuentas de stores van a nombre de la entidad) | Decisión legal/patrimonial | Lista de qué exige cada store según entidad; bloqueo explícito en store-setup.md |
| Apple Developer Program + verificación | Iniciar en F9–F12 (tarda días), se usa en F19 | Identidad legal + pago + D-U-N-S si es empresa | store-setup.md paso a paso; configuración EAS lista para cuando exista |
| Google Play Console + 12 testers 14 días | Reclutar en F12–F14, correr en F19 | Política de Google para cuentas nuevas; los testers son humanos | Build internal track + mensaje de invitación redactado + tracking de los 14 días |
| Aprobar submit a stores y responder a revisores | F19–F20 | El botón final y la responsabilidad son tuyos | Fichas, screenshots plan, nota 3.1.3(e), respuestas modelo a rechazos típicos |
| Revisar copy legal con abogado (T&C, privacidad, contrato coach, consentimiento parental) | Antes del lanzamiento público (paralelo a F12–F18) | Responsabilidad legal real; DRAFT-LEGAL no es asesoría | Borradores DRAFT-LEGAL completos y versionados, con los puntos críticos señalados (no-elusión, datos de salud, menores) |
| Dictamen contable: agente de cobro, IIBB, facturación de comisión | Antes de F20 (afecta si el 20% alcanza) | Es interpretación fiscal profesional argentina | El flujo de fondos documentado en runbooks/liquidaciones.md para mostrarle al contador |
| Probar con coaches reales (10 entrevistas + 1 coach piloto end-to-end) | Entrevistas: YA, en paralelo a F1–F5; piloto: F17–F20 | La hipótesis del 20% se valida con humanos, no con tests | Entorno staging con onboarding real, cuenta piloto, guión de entrevista en docs/product/ |
| Decidir marca final FORZA vs Forzza + dominio + registro | Antes de F5 (landing) y F19 (stores) | Marca registrable es decisión y trámite legal | Búsqueda de strings en el código parametrizada (un solo lugar para el nombre) |
| Transacción real de prueba con tu tarjeta + reembolso | F20 | Dinero real, tarjeta real | Runbook paso a paso + verificación automática del end-to-end |

---

## 13. Orden exacto de ejecución

1. **Preparar máquina** (sección 1.1): instalar Git, Node 22, pnpm, Claude Code, VS Code, Docker Desktop, Supabase CLI. Reabrir PowerShell.
2. **Crear carpeta y repo:** `mkdir C:\dev\forzza` → `cd C:\dev\forzza` → `git init` → config de 1.2.
3. **Sembrar el kit:** copiar a la carpeta: `CLAUDE.md` (sección 3), `CLAUDE.local.example.md`, `.claude/agents/` (los 13 de la sección 4), `.claude/commands/` (los 9 de la sección 5), `docs/forzza-master-doc.md`, `docs/prompts/` (este documento), `reference/forza-complete.jsx`, `reference/ejercicios-234.xlsx` si lo tenés.
4. **Abrir Claude Code:** `claude` → login → `/model` → Opus 4.8 → verificar `/agents` (13 listados).
5. **Pegar el prompt de FASE 0** (sección 14, es el mismo de la sección 7 con preámbulo). Revisar `docs/progress/F0.md`.
6. **Por cada fase 1→20:** resolver el HUMAN_REQUIRED del prompt (la tabla de la sección 12 te dice cuándo viene cada uno) → `/clear` → pegar el prompt de la fase → al terminar, abrir `docs/progress/F<N>.md`.
7. **Criterio de avance:** progress de la fase TODO en PASS (HUMAN_REQUIRED listados aparte) **y**, en las fases 1, 2, 3, 7, 14 y 20, el prompt de revisión Opus correspondiente (R1, R2, R3, R7, R14, R20) con veredicto APTO. Probar además el "Definition of Done" físico de cada fase (instalar, tocar, ver el email).
8. **Si falla:** identificar el síntoma en la sección 9 y pegar el prompt de recuperación correspondiente; si la sesión se degrada, `/forzza-handoff-next-session` y sesión nueva con 9.15.
9. **Cadencia recomendada:** una fase por día de trabajo (F7, F11 y F14 pueden tomar dos). Apple Developer se inicia cuando llegues a F9. Entrevistas con coaches: en paralelo desde la semana 1.
10. **Cierre:** R20 = APTO → ejecutar los pendientes humanos de GO-LIVE.md → lanzar.

---

## 14. Primer prompt para pegar en Claude Code

Pegalo tal cual en tu primera sesión (tras el paso 4 de la sección 13):

```
Sos el opus-orchestrator de Forzza. Vamos a construir la plataforma completa en 21 fases siguiendo el sistema documentado en docs/prompts/ (Forzza — Claude Code Build System) y las especificaciones de docs/forzza-master-doc.md. Yo soy el único humano; trabajo en Windows 11; quiero mínima intervención: vos orquestás, los subagentes Sonnet implementan, y todo avance queda en docs/progress.

Empezamos por la FASE 0 — Setup local y repositorio.

Agente principal recomendado: opus-orchestrator (vos)
Modelo recomendado: Opus 4.8
Subagentes a invocar: docs-maintainer
Modo de trabajo: verificación y documentación; CERO código de producto
Archivos obligatorios a leer antes de tocar código: CLAUDE.md; docs/forzza-master-doc.md SOLO §15 y §21 (no lo leas completo); este prompt
Archivos permitidos: docs/progress/F0.md, docs/open-questions.md, README.md, .gitignore, carpetas vacías de docs/
Archivos prohibidos: todo lo demás; reference/ es solo lectura siempre; docs/forzza-master-doc.md no se edita jamás
Objetivo: dejar el repo sembrado, verificado y commiteado para arrancar la Fase 1.
Contexto: ya copié manualmente CLAUDE.md, .claude/agents (deberían ser 13), .claude/commands (deberían ser 9), docs/forzza-master-doc.md, docs/prompts/, reference/forza-complete.jsx y, si existe, reference/ejercicios-234.xlsx.
Tareas:
1. Verificá presencia y legibilidad de cada archivo del kit; listá los 13 agentes y los 9 comandos por nombre; reportá cualquier faltante.
2. Creá .gitignore (node_modules, .env, .env.*, CLAUDE.local.md, .expo, .next, .turbo, dist, coverage, .vercel) y README.md mínimo.
3. Creá docs/{architecture,product,qa,progress,decisions,runbooks} y docs/open-questions.md con plantilla (fecha, pregunta, contexto, bloqueante S/N).
4. Si falta ejercicios-234.xlsx, registralo en open-questions (el seed usará 30 ejercicios base + TODO).
5. Delegá a docs-maintainer la escritura de docs/progress/F0.md con el inventario PASS/FAIL.
6. Commit: chore(F0): repo sembrado y verificado.
Tests obligatorios: ninguno (no hay código).
Definition of Done: F0.md con inventario completo, cero faltantes bloqueantes, commit hecho.
Documentación a actualizar: docs/progress/F0.md
Restricciones: no instales dependencias, no crees apps/, no propongas cambios de stack ni de plan — el stack y las 21 fases son decisiones firmes.
Entrega esperada: repo commiteado + F0.md + tu confirmación de que estamos listos para que yo pegue el prompt de la FASE 1 en una sesión nueva.
```
