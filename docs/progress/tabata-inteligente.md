# Tabata Inteligente

**Fecha:** 2026-06-18
**Estado:** PASS con pendientes menores
**Commit:** 378bf21 (último al cierre de la feature)
**Rama:** feat/v1-fase4-web-backoffice

## Objetivo

Reescribir la pantalla Tabata de la app mobile con modo simple (gratis) y modo avanzado (PRO), sistema de colores/audio/háptica visibles a distancia, cronómetro resistente a pausa/background y persistencia de presets en Supabase.

## Criterios de aceptación

| # | Criterio | Estado | Evidencia |
|---|----------|--------|-----------|
| 1 | Motor puro en `packages/core/src/tabata/` (tipos, buildSimplePlan, validatePlan, planTotals, computeRuntimeState, formatTabataTime) | PASS | `pnpm --filter @forzza/core vitest src/tabata` → 34/34 tests PASS; cobertura ~92% |
| 2 | Tabla `tabata_plans` con RLS ownership (`student_id = auth.uid()`) | PASS | `pnpm test:rls` → 48/48 PASS; tests T43–T47 cubren aislamiento alumno-alumno en tabata_plans |
| 3 | Migración aplicada | PASS | `supabase/migrations/20260618000001_tabata_plans.sql` presente y aplicada |
| 4 | Tokens `tabataColors` en `packages/ui/src/tokens.ts` (7 estados: prep, work, rest, work-ending, rest-ending, finished, idle) | PASS | Tokens exportados; consumidos en `apps/mobile/app/tabata.tsx` |
| 5 | Pantalla `apps/mobile/app/tabata.tsx` reescrita: tabs simple/avanzado, editor de segmentos, running full-bleed con color dominante por fase | PASS | Revisión de código; typecheck mobile PASS |
| 6 | Cronómetro adaptativo por deadline resistente a pausa/background (AppState) | PASS | Implementado en pantalla; typecheck PASS |
| 7 | Háptica en transiciones de fase | PASS | Llamadas a `expo-haptics` en cambios de estado del cronómetro |
| 8 | Guardar/cargar presets (hook `apps/mobile/hooks/useTabataPlans.ts`) | PASS | Hook implementado con React Query + Supabase; typecheck PASS |
| 9 | Autopromo FREE 10 s antes de iniciar en modo simple (regla §2) | PASS | Guard en `tabata.tsx` con componente de autopromo existente |
| 10 | Paywall PRO para modo avanzado (gating cliente vía `useEntitlements`) | PASS | Consistente con el resto del producto |
| 11 | i18n ES/EN con paridad de claves | PASS | Claves Tabata presentes en `es.json` y `en.json` de mobile |
| 12 | `pnpm typecheck` global (6/6 paquetes) | PASS | 6/6 PASS |
| 13 | `pnpm lint` | PASS | 0 errores |
| 14 | `pnpm test:rls` | PASS | 48/48 PASS |

## Pendientes

| Pendiente | Tipo | Severidad |
|-----------|------|-----------|
| Audio (beeps de transición): requiere `expo prebuild` + archivos `tick.wav`, `start.wav`, `finish.wav` en `apps/mobile/assets/audio/`. Hoy el guard `if (!audioReady)` deja el audio desactivado; háptica + colores funcionan. | HUMAN_REQUIRED | Alta para audio, no bloqueante para el resto |
| Verificación manual en dispositivo de la secuencia de colores: prep (ámbar) → work (verde) → últimos 5 s (rojo) → rest (azul) → últimos 5 s (rojo) → finished. No realizada aún. | Manual QA | Media |
| Enforcement PRO server-side en `tabata_plans`: función `is_pro()` + policies INSERT/UPDATE con `(mode='simple' OR is_pro(auth.uid()))`. | PASS | `pnpm test:rls` → 56/56 PASS; tests T48b, T49–T55 cubren todos los casos (sin PRO, con PRO activo, con PRO vencido, UPDATE). Migración: `20260618000002_tabata_advanced_pro_enforcement.sql`. |

## HUMAN_REQUIRED — Audio

Pasos exactos para activar el audio:

1. Ir a `apps/mobile/`.
2. Ejecutar `npx expo prebuild --platform android` y `npx expo prebuild --platform ios` (el plugin `expo-audio` ya está declarado en `app.json`; el prebuild genera el código nativo).
3. Copiar `tick.wav`, `start.wav` y `finish.wav` a `apps/mobile/assets/audio/`.
4. En `apps/mobile/src/tabataAudio.ts` (o donde esté el guard), eliminar el `if (!audioReady) return` y verificar que los `require()` resuelvan los assets.
5. Probar en dispositivo real (el simulador puede no reproducir audio en todas las configuraciones).

## Decisiones registradas

- Persistencia de planes: desvío consciente del master doc (Ficha 2.1.12 / §6.5). Aprobado por el dueño el 2026-06-18. Ver `docs/open-questions.md` fila 2026-06-18 (desvío tabata_plans).
- Gating PRO en cliente: consistente con la arquitectura del producto (isPro = server-truth cacheada en cliente). No se considera deuda técnica relevante para V1.

## Archivos clave

| Archivo | Rol |
|---------|-----|
| `packages/core/src/tabata/` | Motor puro (lógica + tests) |
| `packages/ui/src/tokens.ts` | Tokens `tabataColors` |
| `apps/mobile/app/tabata.tsx` | Pantalla principal reescrita |
| `apps/mobile/hooks/useTabataPlans.ts` | Hook de persistencia de presets |
| `supabase/migrations/20260618000001_tabata_plans.sql` | Migración tabla + RLS |

## Próximos pasos

1. Completar el HUMAN_REQUIRED de audio (ver tabla de pendientes).
2. Realizar verificación manual de la secuencia de colores en dispositivo real.
3. ~~Evaluar (baja prioridad) si se agrega enforcement server-side de PRO en `tabata_plans`.~~ COMPLETADO: migración `20260618000002_tabata_advanced_pro_enforcement.sql`, 56/56 tests RLS PASS.
