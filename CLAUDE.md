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
