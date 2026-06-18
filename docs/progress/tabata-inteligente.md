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
| ~~Audio (beeps de transición)~~ **COMPLETADO**: `expo-audio` cableado en `tabata.tsx` (`start.wav` al entrar a trabajo/descanso, `tick.wav` en la cuenta regresiva, `finish.wav` al completar), assets generados con `scripts/build-tabata-audio.mjs`, plugin en `app.config.ts`, `expo prebuild` corrido. typecheck/lint PASS. Commit `c458df1`. | PASS | — |
| **Permiso `RECORD_AUDIO` (Android)**: el módulo nativo de `expo-audio` declara `RECORD_AUDIO` aunque la app solo REPRODUCE (no graba). Se configuró `['expo-audio', { microphonePermission: false }]` (suprime el permiso de micrófono en iOS — `NSMicrophoneUsageDescription`). En Android el permiso se mergea desde el manifest del módulo durante el build de gradle, y NO pudo verificarse su remoción local (el `prebuild` no ejecuta el manifest merger). Ver detalle abajo. | Release hardening | Media |
| Verificación manual en dispositivo de la secuencia de colores: prep (ámbar) → work (verde) → últimos 5 s (rojo) → rest (azul) → últimos 5 s (rojo) → finished. No realizada aún. | Manual QA | Media |
| Enforcement PRO server-side en `tabata_plans`: función `is_pro()` + policies INSERT/UPDATE con `(mode='simple' OR is_pro(auth.uid()))`. | PASS | `pnpm test:rls` → 56/56 PASS; tests T48b, T49–T55 cubren todos los casos (sin PRO, con PRO activo, con PRO vencido, UPDATE). Migración: `20260618000002_tabata_advanced_pro_enforcement.sql`. |

## Audio — implementado (commit `c458df1`)

El audio quedó cableado: `useAudioPlayer` ×3 en `apps/mobile/app/tabata.tsx`, `setAudioModeAsync({ playsInSilentMode: true })` para sonar con el teléfono en silencio, y reproducción tolerante a fallos (si el audio falla, el timer y la háptica siguen). Assets en `apps/mobile/assets/audio/` regenerables con `node scripts/build-tabata-audio.mjs`. Falta solo la verificación en dispositivo real (el simulador puede no reproducir audio en todas las configuraciones).

## CAVEAT — `RECORD_AUDIO` en Android (pendiente de hardening de release)

`expo-audio` agrega el permiso `android.permission.RECORD_AUDIO` desde su módulo nativo, aunque el Tabata **solo reproduce** sonido y nunca graba. Se dejó `['expo-audio', { microphonePermission: false }]` en `app.config.ts`, lo que evita el permiso de micrófono en **iOS** (`NSMicrophoneUsageDescription`). En **Android** el permiso se mergea desde el manifest del módulo durante el build de gradle/EAS — el `expo prebuild` local NO ejecuta el manifest merger, así que no se pudo confirmar su remoción de forma verificable.

Pasos pendientes (release-store-engineer):
1. Hacer un build EAS de Android y revisar el `AndroidManifest.xml` final / la sección de permisos en Play Console.
2. Si `RECORD_AUDIO` persiste, agregar un config plugin custom (`withAndroidManifest`) que marque el permiso con `tools:node="remove"`, y volver a verificar en build.
3. Confirmar en iOS que el build no incluya `NSMicrophoneUsageDescription`.

Impacto si no se resuelve: Google Play preguntará por el uso de micrófono y puede generar fricción en la review; no afecta la funcionalidad (no se muestra prompt en runtime porque no se invoca la API de grabación).

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

1. ~~Completar el audio~~ COMPLETADO (commit `c458df1`). Pendiente: verificar el caveat de `RECORD_AUDIO` en un build EAS de Android (ver sección CAVEAT).
2. Realizar verificación manual de la secuencia de colores y del audio en dispositivo real.
3. ~~Evaluar (baja prioridad) si se agrega enforcement server-side de PRO en `tabata_plans`.~~ COMPLETADO: migración `20260618000002_tabata_advanced_pro_enforcement.sql`, 56/56 tests RLS PASS.
