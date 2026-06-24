# Forzza — Overview de producto, arquitectura y negocio

> Documento de orientación (onboarding). Resume **qué es Forzza, cómo está estructurada y cuál es el modelo de negocio**.
> Fuente de verdad detallada: [`docs/forzza-master-doc.md`](./forzza-master-doc.md) (relevamiento, specs, unit economics) y [`CLAUDE.md`](../CLAUDE.md) (reglas innegociables para el desarrollo).

---

## 1. Qué es Forzza

Forzza es una **plataforma fitness de tres caras** que conecta a alumnos de gimnasio con coaches online, sobre un backend único.

Resuelve dos dolores reales del mercado LatAm:

- **Alumno (embudo de adquisición):** entrena sin estructura ni registro — hoy usa papel, notas del celular o nada.
- **Coach online (lo que sostiene el negocio):** gestiona a sus alumnos con WhatsApp + Excel + transferencias manuales, sin una herramienta unificada de cobro, agenda y seguimiento.

La estrategia: captar alumnos gratis con una app de entrenamiento sólida y monetizar vía suscripción PRO + un **marketplace de coaching** donde Forzza cobra al alumno y retiene comisión.

### Las tres caras

| Cara | Para quién | Plataforma | Dónde vive |
|---|---|---|---|
| **App del alumno** | Alumno | Móvil (Expo iOS + Android) | `apps/mobile` |
| **Backoffice del coach** + landing + PWA del alumno + onboarding coach | Coach / público | Web (Next.js) | `apps/web` (rutas `/coach`, `/coaches`, landing) |
| **Backoffice del dueño** | Dueño/Admin | Web (Next.js) | `apps/web` (ruta `/admin`) |
| **Backend** | — | Supabase (Postgres + Auth + Storage + Realtime + Edge Functions) | `supabase/` |

> Regla de oro de producto: **el alta y la operación del coach son SOLO web. La app móvil es exclusivamente del alumno.**

---

## 2. Roles y usuarios

- **Alumno:** usa la app móvil. Registra entrenos, sigue rutinas, ve progreso, hace Tabata, y opcionalmente contrata un coach.
- **Coach:** opera 100% en la web (`/coach`). Gestiona alumnos, rutinas, calendario, chat, cobros y su perfil público del marketplace. Se da de alta desde la landing ("Quiero ser coach") con validación fiscal.
- **Dueño / Admin:** backoffice web (`/admin`). Aprueba coaches y constancias fiscales, valida facturas, gestiona finanzas y payouts.

---

## 3. Modelo de negocio

Modelo **híbrido** (B2C freemium + marketplace):

### 3.1 B2C freemium (alumno)
- **Free:** con publicidad y límites. Autopromo de 10 s antes de rutina/Tabata. Máx. 3 rutinas. Historial visible 10 días (se trunca en la query, **nunca** se borran datos).
- **PRO (de pago):** ~**ARS 9.999 / CLP 4.990**. Sin ads, rutinas/historial sin límite, fotos de progreso, videos, Tabata avanzado.
  - iOS/Android: vía **IAP (RevenueCat)**.
  - Web: vía **Mercado Pago**.

### 3.2 Marketplace coach–alumno (el corazón del negocio)
- Forzza le cobra al alumno el **paquete completo** del coach y retiene **comisión del 20%** (leída de `country_config`, **nunca** hardcodeada). El 20% cubre pasarela + IIBB; al 15% el marketplace no pagaba su operación.
- Paquetes del coach en tres tiers: **Starter / Pro / Elite**.
- **Los paquetes de coach se pagan SOLO por Mercado Pago vía web/browser — JAMÁS por IAP.**
- Flujo post-pago: alumno queda "pendiente de asignación" → notificación al coach → coach acepta → home actualizado + chat habilitado.

### 3.3 Suscripción del coach
- El coach paga una **suscripción fija** (~ARS 9.900) **hasta su 3er alumno activo**.
- A partir del **4° alumno activo**, pasa a modelo de **comisión** — y **nunca revierte** (anti-reversión garantizada en DB).

### 3.4 Reglas financieras innegociables
- Comisión 20% leída de `country_config`; jamás hardcodear precios/comisiones.
- Dinero en **enteros** (unidad mínima); redondeo solo en `core/billing`.
- **Sin factura aprobada NO existe el estado "transferido"** (payout manual contra factura, aprobado por el dueño).
- Todo webhook de pago es **idempotente** por `event_id`/`payment_id` y valida firma.
- Menor de 18 sin `parental_consent_at` **no llega** al checkout de coach (403).

---

## 4. Mercados y roadmap comercial

| Fase | Mercado | Estado |
|---|---|---|
| **V1 (ahora)** | 🇦🇷 Argentina | Activo. Mercado natural del dueño, Mercado Pago, pricing definido. |
| **+3–6 meses** | 🇨🇱 Chile | Preparado en datos, no activo. Mismo idioma, MP disponible. |
| **Test** | 🇪🇸 España | Vía promotor; único mercado EU donde la app en español funciona sin localizar. |
| **V2+** | 🇬🇧 UK / 🇩🇪 DE / 🇩🇰 DK | Requieren localización, entidad/Merchant of Record para IVA. |

> Riesgos principales del negocio: margen del marketplace, comisión de Apple IAP sobre PRO en iOS, escalabilidad del payout manual contra factura, e IVA digital en EU/UK.

---

## 5. Arquitectura técnica

### 5.1 Stack obligatorio
- **Monorepo:** pnpm + Turborepo.
- **Mobile:** Expo / React Native + expo-router. Estilos con `StyleSheet`.
- **Web:** Next.js App Router. Tailwind **solo en web**, con tokens de `packages/ui`.
- **Lenguaje:** TypeScript estricto en todo.
- **Backend:** Supabase — Auth, Postgres + **RLS**, Storage, Realtime, Edge Functions (Deno).
- **Pagos:** Mercado Pago (AR/CL) · RevenueCat (IAP PRO).
- **Infra de producto:** Expo Notifications · Resend (email) · PostHog (analytics) · Sentry (errores).
- **Estado:** React Query + Zustand (NO Redux).

### 5.2 Principios de arquitectura
- La **lógica de negocio** vive en `packages/core` (pura, testeada) y en el servidor (RLS + Edge Functions). **Las apps solo presentan.**
- `isPro()` / `hasCoach()` se calculan **server-side**; el cliente solo cachea.
- **RLS en TODAS las tablas.** `audit_log` append-only registra toda acción financiera o de validación.
- Datos sensibles (fotos corporales, constancias, facturas): **buckets privados**, URLs firmadas con TTL 1 h, nunca en logs/analytics.
- Secretos solo en `.env` (gitignoreado) y dashboards.

---

## 6. Estructura del repositorio

```
forzza/
├── apps/
│   ├── mobile/          # App del alumno (Expo / React Native)
│   │   └── app/(tabs)/   # index, routines, progress, chat, profile
│   └── web/             # Next.js: landing + PWA alumno + /coach + /admin + onboarding coach
│       └── app/[locale]/ # (auth), admin, coach, coaches, onboarding-coach, legales, styleguide…
├── packages/
│   ├── core/            # Lógica de negocio pura (billing, gating) — testeada
│   ├── ui/              # Design System: /native (RN), /web (React), /tokens (compartidos)
│   ├── db-types/        # Tipos generados de la DB (pnpm db:types)
│   ├── config/          # Config compartida
│   ├── eslint-config/   # ESLint compartido
│   └── tsconfig/        # tsconfig compartido
├── supabase/
│   ├── migrations/      # Esquema, constraints, RLS, storage buckets, features
│   └── seed/            # seed.sql, seed-demo.sql, smoke-flow.sql (fixtures de prueba)
├── docs/                # Documentación, progreso de fases, decisiones, runbooks
├── e2e/                 # Playwright (coach/admin/landing specs)
└── reference/           # Prototipo visual forza-complete.jsx (copiar DISEÑO, jamás arquitectura)
```

### Design System (`packages/ui`)
- Tres entradas: `@forzza/ui/native` (componentes RN con `StyleSheet`), `@forzza/ui/web` (componentes React con estilos tipados + Tailwind en páginas) y `@forzza/ui/tokens` (colores, spacing, radius, typography, fontSize — **compartidos** entre web y mobile).
- **Estética:** dark con acento **lima `#C8FF00`**. Tipografías: Bebas Neue (títulos), DM Sans (texto), Space Mono (números).
- Toda pantalla crítica debe tener estados **loading / empty / error / success** (componentes de `packages/ui`).

---

## 7. Funcionalidades principales

**App del alumno (mobile):** home/resumen del día, plan semanal, crear rutina (wizard), rutina del día / workout activo (con RestTimer y confetti), registrar entreno manual, Mi Progreso (gráficos), fotos de progreso (PRO), Tabata (persiste; modo avanzado PRO), chat con coach, marketplace de coaches, checkout de coach, Mi Plan/upgrade, pagos, notificaciones, perfil (gestión de suscripción, export de datos, eliminar cuenta).

**Web del coach (`/coach`):** alumnos, rutinas, calendario, check-ins, chat, cobros (carga de factura), y **perfil público** (`/coach/perfil`: avatar, galería, video de presentación, bio, especialidades, intereses, paquetes, privacidad, eliminar cuenta).

**Web pública:** landing con pricing, marketplace de coaches (`/coaches`), perfil público del coach (`/coaches/[coachId]`, solo coaches `approved`), checkout, onboarding de coach.

**Web del dueño (`/admin`):** aprobación de coaches y constancias, validación de facturas, finanzas/payouts.

---

## 8. Qué NO se implementa en V1 (scope creep a rechazar)

Grupos/comunidad · sesiones en vivo · nutrición · escáner IA de fichas · ratings/reviews (en V1 se muestra "Nuevo en Forzza") · Stripe · UI/flujos de promotores (las tablas sí existen) · Apple Health/Google Fit · export CSV avanzado · Brasil.

> Si una tarea pide algo de esta lista, se rechaza y se anota en `docs/open-questions.md`.

---

## 9. Comandos clave

```bash
pnpm install
pnpm dev            # todo
pnpm dev:web        # solo web (Next.js)
pnpm dev:mobile     # solo app (Expo)
pnpm test           # unit
pnpm test:rls       # RLS por accesos cruzados prohibidos
pnpm e2e            # Playwright
pnpm typecheck
pnpm lint
pnpm db:reset       # migra + seedea local (requiere Docker)
pnpm db:types       # regenera packages/db-types
```

---

## 10. Notas y ambigüedades conocidas

- **Marca:** el prototipo usa "FORZA"; la plataforma futura es "Forzza". Unificación pendiente del dueño antes de registrar dominios/cuentas/entidad legal.
- **Piso de precio del coach:** `CLAUDE.md` lo lista como regla (≥ piso del país), pero la migración `20260622120000_no_price_floor.sql` lo removió — **verificar la regla vigente** antes de tocar pricing de coach.
- **Tabata persiste en V1** (desvío aprobado por el dueño el 2026-06-18), contrario a la idea original de no persistir.
- El protocolo de avance exige cerrar cada fase actualizando `docs/progress/<fase>.md` con PASS/FAIL por criterio y evidencia.
