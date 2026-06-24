# Forzza — Plan de implementación del sistema de Motion

> Rollout del sistema de animación de Forzza en **web (coach/admin/landing/PWA)** y **mobile (app del alumno)**, sobre los tokens de `packages/ui` y la skill [`forzza-ui-motion`](../.claude/skills/forzza-ui-motion/SKILL.md).
> Criterio de craft: filosofía de Emil Kowalski (skills `emil-design-eng` / `review-animations`).

## Objetivo

Que toda animación de Forzza salga de tokens, se sienta **crisp y rápida** (identidad dark + lima), sea accesible (reduced-motion) y consistente entre web y mobile — eliminando el motion ad-hoc con valores hardcodeados que hoy está disperso.

## Estado actual (auditoría)

| Área | Hallazgo |
| --- | --- |
| Tokens de motion | ✅ Creados en `packages/ui/tokens.ts` (`easing`, `cssEasing`, `duration`, `spring`, `motion`). |
| Skill | ✅ `forzza-ui-motion` (construir) + `review-animations` (revisar). |
| Web (`globals.css`) | ⚠️ Motion ad-hoc con valores hardcodeados: `.card-hover`, `.btn-lime`, `.ui-btn` usan `200ms ease-out`, `translateY(-1px)` sueltos. Sin `prefers-reduced-motion`. |
| `native/Button` | ⚠️ Ya tiene press feedback (`scale 0.97` con RN `Animated`) pero **hardcodeado**. |
| Libs | ❌ Sin `framer-motion` (web) ni `react-native-reanimated`/`gesture-handler` (mobile). |
| Tokens web vs DS | ⚠️ `globals.css @theme` diverge de `tokens.ts` (bg `#0A0A0A` vs `#080810`, fuentes Barlow vs Bebas). Fuera de scope de motion, pero anotado. |

## Estrategia de librerías (decisión)

- **Web → CSS-first.** Transiciones CSS + `@starting-style` + WAAPI cubren ~90% de los casos (es lo que Emil mismo prefiere). **`framer-motion` queda DIFERIDO**: se evalúa solo si aparece una necesidad real de *layout animations* o springs complejos. No sumar la dep antes.
- **Mobile → RN `Animated` para lo simple, Reanimated para lo complejo.** El press feedback ya funciona con el `Animated` nativo (cero deps). **`react-native-reanimated` + `react-native-gesture-handler` se instalan recién en la Fase 3**, y solo para gestos/sheets fluidos (swipe-to-dismiss, drag de drawer). No son bloqueantes para las fases 0–2.

---

## Fase 0 — Fundaciones

Objetivo: que el sistema sea consumible y accesible por defecto.

- [x] **0.1** Tokens de motion en `tokens.ts`.
- [x] **0.2** Skill `forzza-ui-motion`.
- [x] **0.3** CSS vars de motion en `globals.css` (`--ease-out`, `--ease-in-out`, `--ease-drawer`, `--duration-*`, `--press-scale`) espejando `tokens.ts`. ✅
- [x] **0.4** `prefers-reduced-motion` global en `globals.css`. ✅
- [x] **0.5** Hook `useReducedMotion` para mobile (envuelve `AccessibilityInfo.isReduceMotionEnabled`) en `packages/ui/native`. ✅
- [ ] **0.6** (Opcional) Exponer `ease-*` / `duration-*` como utilities Tailwind para usarlas en JSX.

**Criterio de aceptación:** un componente web y uno mobile consumen los tokens; con reduced-motion activo no hay movimiento (se conservan opacity/color).

---

## Fase 1 — Primitivos del Design System (`packages/ui`)

Máximo apalancamiento: todo lo demás los reutiliza. Cada ítem = web + native, atado a tokens, con pasada de `review-animations`.

- [x] **1.1 Button** — web: `:active → scale(var(--press-scale))` + hover gateado; native: `0.97` atado a `motion.pressScale`. ✅ (componente de referencia)
- [ ] **1.2 Pressables** — `Card`, `Pill`, `NotificationRow`, `StatTile`: press feedback en los táctiles.
- [ ] **1.3 Inputs** — `Input`, `NumInput`, `WeightInput`: transición de foco (web ya tiene `:focus-visible`; mobile borde animado con `duration.press`).
- [ ] **1.4 Overlays** — `Sheet`, `UpgradeModal`: entrada `translateY` con `easing.drawer` + `duration.sheet`, backdrop fade; sheets origin-aware, **modales centrados**.
- [ ] **1.5 Toast** — entrada `translateY(100%)→0` **interrumpible** (transición, no keyframe); pausar timer en blur/tab oculta.
- [ ] **1.6 Tabs** — indicador activo animado (clip-path o translate del subrayado).
- [ ] **1.7 Skeleton** — shimmer suave; desactivar con reduced-motion.

**Criterio:** `review-animations` = Approve en cada componente; cero cubic-beziers/ms hardcodeados; reduced-motion respetado.

---

## Fase 2 — App de coach (web `/coach`)

Superficies: `CoachSideNav`, `alumnos`, `rutinas`, `calendario`, `checkins`, `cobros`, `perfil`.

- [ ] **2.1 `CoachSideNav`** — estado activo con transición (indicador deslizante), hover gateado tras `@media (hover:hover)`, foco visible.
- [ ] **2.2 Listas** (alumnos, rutinas, cobros) — `stagger` de `motion.stagger` (50ms) al montar; unificar `.card-hover` con las vars.
- [ ] **2.3 `/coach/perfil`** — feedback en uploads (avatar/galería/video) con progreso; entrada suave del banner de consentimiento (hoy aparece de golpe tapando la galería); modales de confirmación.
- [ ] **2.4 `calendario` / `checkins`** — micro-interacciones de selección.
- [ ] **2.5 Modales de confirmación** (eliminar cuenta, etc.) — entrada centrada + backdrop fade.
- [ ] **2.6 Migración** — reemplazar las clases ad-hoc (`.card-hover`, `.btn-*`) por las vars de motion; eliminar valores sueltos.

**Criterio:** sin regresiones visuales; todo el motion del backoffice coach usa vars; `review-animations` Approve.

---

## Fase 3 — App del alumno (mobile)

- [x] **3.0** Instalar y configurar `react-native-reanimated` (~4.1.7) + `react-native-gesture-handler` (~2.28.0) + `react-native-worklets` (babel plugin `react-native-worklets/plugin` último, `GestureHandlerRootView` en `_layout`). ✅
- [ ] **3.1 Tabs** de navegación — transición de tab.
- [ ] **3.2 Workout activo** — `RestTimer` (cuenta regresiva), transición entre sets, revisar `Confetti` (ya existe) contra el bar de craft.
- [ ] **3.3 Sheets** (preview de ejercicio), `AutopromoOverlay` — entrada/salida con `easing.drawer`.
- [ ] **3.4 Listas** (rutinas, marketplace de coaches, progreso) — `stagger`.
- [x] **3.5 Gestos** — swipe-to-dismiss en `Sheet` (drag de drawer hacia abajo) y `Toast` (swipe horizontal) con Gesture Handler + `withSpring(spring.gentle)` (momentum, interrumpible), `useReducedMotion`-aware. ✅ *Runtime pendiente de verificar en device/emulador.*

**Criterio:** probado en **dispositivo real** (gestos); `useReducedMotion` respetado; 60fps (solo `transform`/`opacity`).

---

## Fase 4 — Pulido, QA y gobernanza

- [ ] **4.1** Pasada `review-animations` por superficie.
- [ ] **4.2** Barrido: migrar todo valor de motion hardcodeado restante a tokens (`grep` de `cubic-bezier`, ms sueltos, `translateY` ad-hoc).
- [ ] **4.3** Cobertura total de `prefers-reduced-motion` / `useReducedMotion`.
- [ ] **4.4** Auditoría de performance (solo `transform`/`opacity`; sin animar layout).
- [x] **4.5** Regla de lint `no-restricted-syntax` que prohíbe `cubic-bezier(...)` en literales/templates, en `packages/eslint-config` (ui/mobile/core) y en `apps/web/.eslintrc.json`. `tokens.ts` exento vía override. ✅
- [x] **4.6** Página de **Motion** en el `styleguide` web (`MotionShowcase`): curvas animadas, duraciones, springs y press scale, todo desde tokens. ✅

---

## Orden recomendado y riesgos

1. **Fase 0 → 1** primero (fundaciones + primitivos): un cambio en `Button`/`Sheet` se propaga gratis a coach y alumno.
2. **Fase 2 (coach)** antes que la 3 (mobile), porque no requiere instalar libs nuevas.
3. **Fase 3 (mobile)** al final de las superficies, por la instalación de Reanimated.

**Riesgos:**
- *Scope*: respetar la regla del repo — **un componente/superficie por PR**, commits convencionales (`feat(motion): button press feedback`), nada se mergea con tests rojos.
- *Divergencia de tokens web*: `globals.css @theme` no coincide con `tokens.ts`; reconciliar es un trabajo aparte (no motion) pero conviene agendarlo.
- *No meter `framer-motion`* salvo necesidad real (peso de bundle).

## Definición de "hecho" (global)

Toda animación: (a) sale de tokens, (b) pasa `review-animations`, (c) respeta reduced-motion, (d) anima solo `transform`/`opacity`, (e) tiene un "por qué" y dura < 300ms (salvo sheets/drawers justificados).

---

## Estado de ejecución (2026-06-24)

**Fases 0–5 ejecutadas (rollout completo).** Verificación: `typecheck` verde en `@forzza/ui`, `web` y `mobile`; `lint @forzza/ui` y lint del styleguide sin errores; `cubic-bezier` solo en `tokens.ts` + las CSS vars de `globals.css` (cero hardcodes en componentes, ahora también garantizado por lint rule); `prefers-reduced-motion` global (web) + hook `useReducedMotion` (mobile).

| Fase | Hecho |
| --- | --- |
| 0 | Tokens de motion, CSS vars + reduced-motion global (web), hook `useReducedMotion` (mobile), skill `forzza-ui-motion`. |
| 1 | DS web+native: `Button`, `Card`, `NotificationRow` (press), `Sheet`/`UpgradeModal`/`Toast` (entrada/salida), `Tabs`, `Skeleton` (arreglado un keyframe roto preexistente), `Input`/`NumInput`/`WeightInput` (foco). `Pill`/`StatTile` sin cambios (display puro). |
| 2 | `CoachSideNav` (activo/hover gateado/press), **migración de `.card-hover`/`.btn-*`/`.ui-btn` a CSS vars**, `/coach/perfil` (uploads, banner de consent suave, botones), listas de coach con `StaggerList`. |
| 3 | Mobile con RN `Animated`: tabs, home, listas con stagger (routines/progress/marketplace), `session` (transición de set + delight), `tabata` (solo crossfade de fase, timers intactos), `routine/[id]`, `register-workout`. |
| 4 | Typecheck+lint, barrido de hardcodes, cobertura reduced-motion. |

### Diferidos resueltos (2026-06-24)
- **Reanimated + Gesture Handler (3.0):** ✅ instalados (`react-native-reanimated@~4.1.7`, `react-native-gesture-handler@~2.28.0`, `react-native-worklets@0.5.1`), babel plugin `react-native-worklets/plugin` (último), `GestureHandlerRootView` como contenedor raíz en `_layout`. Agregados también como peer+devDep en `@forzza/ui`.
- **Gestos swipe-to-dismiss (3.5):** ✅ `Sheet` migrado a `useSharedValue`/`Gesture.Pan` con drag hacia abajo + `withSpring(spring.gentle)`; `Toast` con swipe horizontal opcional (`onDismiss`). Ambos reduced-motion-aware. **Runtime aún sin verificar en device/emulador** (no disponible); typecheck y lint verdes.
- **Lint rule anti-hardcode (4.5)** y **página de Motion en styleguide (4.6):** ✅ ejecutadas.

### Pendiente real
- **Verificar gestos en device/emulador:** correr `expo run:android`/`run:ios` y confirmar que Reanimated arranca (babel worklet OK) y que el swipe-to-dismiss se siente fluido a 60fps.

### Deuda preexistente — RESUELTA (2026-06-24)
- Los errores de lint previos al trabajo de motion ya se limpiaron: `(auth)/signup` (`router`), `coach/checkins/[templateId]/respuestas` (`Answer`), `coach/perfil/MpConnectButton` (`<a>` → `eslint-disable`, es ruta `/api/`), `coach/perfil/PerfilForm` (`minCoachPrice`), `marketplace/[coachId]` (dead code de gating de menores: `isMinor`/`studentProfile`/`StudentProfile`), y las constantes de íconos `S2/S3/S4`.
- **Estado de lint:** `@forzza/ui` y `web` lint-verde total; `mobile` con 0 errores (quedan warnings preexistentes de `no-unsafe-*` por las llamadas any-typed de supabase — fuera de scope).
- `globals.css @theme` diverge de `tokens.ts` (bg `#0A0A0A` vs `#080810`, fuentes Barlow vs Bebas) — reconciliar el DS web.
