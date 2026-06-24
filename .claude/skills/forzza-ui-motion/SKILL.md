---
name: forzza-ui-motion
description: Sistema de motion/animación de Forzza para web (Next + CSS/Framer Motion) y mobile (Expo + Reanimated), atado a los tokens de packages/ui. Usar SIEMPRE al crear o revisar animaciones, transiciones, gestos, drawers, modales, toasts, micro-interacciones o feedback de presión en los repos de Forzza. Destila la filosofía de Emil Kowalski sobre los tokens del DS.
---

# Forzza UI Motion

Cómo animar en Forzza para que se sienta **crisp y rápido** (no lento, no de juguete), igual en web y mobile, sin romper el Design System. El criterio viene de la filosofía de Emil Kowalski (skills `emil-design-eng` y `review-animations`); acá está **atado a nuestros tokens** y extendido a mobile.

## Regla de oro: todo sale de tokens

Importá siempre de `@forzza/ui/tokens`. **NUNCA** hardcodees cubic-beziers, milisegundos ni colores en un componente.

```ts
import { easing, cssEasing, duration, spring, motion, colors } from "@forzza/ui/tokens";
```

| Necesitás | Web (CSS/Framer Motion) | Mobile (Reanimated) |
| --- | --- | --- |
| Curva | `cssEasing.out` → `cubic-bezier(...)` | `Easing.bezier(...easing.out)` |
| Duración | `duration.dropdown` (ms) | `withTiming(v, { duration: duration.dropdown })` |
| Spring | `transition={{ type: "spring", ...spring.gentle }}` | `withSpring(v, spring.gentle)` |
| Presión | `transform: scale(${motion.pressScale})` | `scale: motion.pressScale` |
| Color | `colors.lime` | `colors.lime` |

Si un valor no existe como token (p. ej. una curva nueva), **agregalo a `tokens.ts` primero**, no al componente.

## 1. ¿Debería animar?

Antes de escribir una animación, respondé "¿por qué anima esto?". Propósitos válidos: consistencia espacial, indicar estado, feedback, explicación, evitar un cambio brusco. "Queda lindo" en algo frecuente **no** es válido.

| Frecuencia | Decisión |
| --- | --- |
| 100+/día (atajos de teclado, toggles de uso constante) | **Sin animación. Nunca.** |
| Decenas/día (hover, navegación de listas) | Quitar o reducir drásticamente |
| Ocasional (modales, drawers, toasts) | Animación estándar |
| Rara / primera vez (onboarding, confetti de fin de rutina, celebración) | Se permite "delight" |

> En Forzza: el confetti al terminar un workout es "rara/celebración" → OK. El toggle de un Switch en perfil se ve decenas de veces → mínimo o nada.

## 2. Easing

- Entra o sale → **`easing.out`** (`cssEasing.out`). Es el default.
- Se mueve/morfea en pantalla → `easing.inOut`.
- Drawer / bottom sheet → `easing.drawer`.
- Hover / cambio de color → `ease` nativo.
- Movimiento constante (barra de progreso, marquee) → `linear`.

**Nunca `ease-in` en UI.** Arranca lento justo cuando el usuario más mira → se siente trabado.

## 3. Duración (UI < 300ms)

Usá los tokens `duration.*`: `press` 140 · `tooltip` 160 · `dropdown` 200 · `sheet` 320 (única > 300ms, justificada por ser drawer/modal). Un dropdown de 180ms se siente más responsivo que uno de 400ms.

## 4. Físicalidad

- **Jamás `scale(0)`.** Las entradas arrancan en `motion.enterScale` (0.95) + `opacity: 0`. Nada en el mundo real aparece de la nada.
- **Feedback de presión** en todo lo pulsable: `scale(motion.pressScale)` (0.97) con `duration.press`.
- **Popovers/dropdowns/tooltips escalan desde su trigger** (`transform-origin`), no desde el centro. **Los modales son la excepción** → quedan centrados.

## 5. Web (Next + CSS / Framer Motion)

```css
/* Botón: feedback de presión */
.button { transition: transform 140ms cubic-bezier(0.23, 1, 0.32, 1); } /* duration.press + cssEasing.out */
.button:active { transform: scale(0.97); }                              /* motion.pressScale */

/* Entrada moderna sin JS */
.toast {
  opacity: 1; transform: translateY(0);
  transition: opacity 320ms var(--ease-out), transform 320ms var(--ease-out);
  @starting-style { opacity: 0; transform: translateY(100%); }
}
```

- **Solo animá `transform` y `opacity`** (corren en GPU). Nunca `width/height/margin/padding/top/left`.
- **Transiciones, no keyframes**, para lo que se dispara rápido (toasts, toggles) → son interrumpibles.
- En Framer Motion usá el string completo `transform: "translateX(100px)"`, **no** los shorthands `x`/`y`/`scale` (no están acelerados por hardware y dropean frames bajo carga).
- Exponé los tokens como CSS vars en `globals.css` (`--ease-out`, etc.) para usarlos en Tailwind/CSS.

## 6. Mobile (Expo + Reanimated + Gesture Handler)

Los **mismos principios**, distinto motor. No hay CSS: usás `react-native-reanimated`.

```tsx
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing } from "react-native-reanimated";
import { easing, duration, spring, motion } from "@forzza/ui/tokens";

// Feedback de presión (equivalente a scale(0.97) on :active)
const scale = useSharedValue(1);
const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
const onPressIn  = () => { scale.value = withTiming(motion.pressScale, { duration: duration.press, easing: Easing.bezier(...easing.out) }); };
const onPressOut = () => { scale.value = withSpring(1, spring.gentle); };
```

- Animá solo `transform` y `opacity` (en RN: `transform`, `opacity`) — corren en el thread de UI con Reanimated.
- Para gestos (swipe-to-dismiss en sheets/toasts, drag de drawer) usá `react-native-gesture-handler` + `withSpring` (mantiene velocidad si el usuario interrumpe).
- Sheets/drawers: `easing.drawer` con `duration.sheet`.
- **Reduced motion**: `import { useReducedMotion } from "react-native-reanimated"` → si está activo, dejá opacity, sacá el movimiento.

## 7. Gestos (web y mobile)

- **Dismiss por momentum**: no exijas cruzar un umbral de distancia; calculá velocidad (`|distancia| / msTranscurridos`) y descartá si supera ~0.11. Un flick rápido alcanza.
- **Damping en los bordes**: arrastrar más allá del límite mueve cada vez menos.
- **Multi-touch**: ignorá toques extra una vez iniciado el drag (`if (isDragging) return`).

## 8. Stagger e interrumpibilidad

- Entradas en grupo (listas, tarjetas de coach, menú de perfil): escaloná con `motion.stagger` (50ms) entre items. Delays largos se sienten lentos. El stagger es decorativo → nunca bloquees interacción.
- Timing asimétrico: lento donde el usuario decide (hold-to-delete), rápido donde el sistema responde (release snappy).

## 9. Accesibilidad

- Respetá reduced-motion en ambos lados (menos y más suave, **no** cero: mantené opacity/color, sacá movimiento).
- Web: gate del hover con `@media (hover: hover) and (pointer: fine)` (en touch, el tap dispara hover falso).

## 10. Personalidad Forzza

La estética es **dark + lima `#C8FF00`, crisp y rápida** (no un dashboard lento ni algo bouncy). Por defecto: `easing.out`, duraciones cortas, bounce solo en drag-to-dismiss o celebraciones. El motion tiene que matchear esa identidad — cuando dudes si una animación suma, **borrala**.

## Revisar animaciones

Para auditar motion (propio o en un diff), usá el skill `review-animations` (formato tabla Before/After, veredicto Block/Approve). Este skill (`forzza-ui-motion`) es para **construir**; aquél para **revisar**.

## Checklist anti-slop (rápido)

- [ ] Valores desde tokens, cero hardcode.
- [ ] Cada animación tiene un "por qué"; nada anima en acciones de teclado/100+día.
- [ ] `easing.out` al entrar; nunca `ease-in`.
- [ ] UI < 300ms.
- [ ] Nunca `scale(0)`; presión con `motion.pressScale`.
- [ ] Solo `transform`/`opacity`.
- [ ] Transiciones (no keyframes) para lo que se dispara rápido.
- [ ] Origin-aware en popovers; modales centrados.
- [ ] Reduced-motion respetado (web y mobile).
- [ ] Stagger 30–80ms en grupos.
