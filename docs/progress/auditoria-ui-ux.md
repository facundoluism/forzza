# Auditoría UI/UX — Forzza (2026-06-15)

Auditoría exhaustiva de UI/UX sobre **landing, backoffice coach (/coach), backoffice admin (/admin)** y **app mobile**, en viewports mobile (390px) y desktop (1440px).

## Método
- **Web (landing/coach/admin):** render real con Next.js dev + captura con Playwright a 390px y 1440px. 46 screenshots en `.audit/screens/`. Revisión visual al detalle + cross-ref de código por 3 subagentes (uno por superficie).
- **Mobile:** revisión **a nivel código** (no hay Android SDK/emulador en el entorno → captura automática **bloqueada**, ver HUMAN_REQUIRED abajo).
- Modo dev-mock: las páginas autenticadas rinden con data vacía → el foco web fue layout/estados/responsive, no densidad de datos.

## HUMAN_REQUIRED
- **Emulador Android no disponible:** no hay Android SDK ni Android Studio instalados (`ANDROID_HOME` unset, sin `adb`/`emulator`/AVDs). Para captura visual automática de la app mobile hace falta instalar Android Studio + SDK + crear un AVD. Alternativa sin instalar: el humano envía screenshots de las pantallas clave.

---

## ✅ Fixes aplicados (TRIVIAL-SAFE) — typecheck + lint verde

### Flujo "Nueva rutina" (mobile) — bug reportado por el usuario
- `routine/new` pasa de `presentation: modal` → `card` (sin bleed-through de la pantalla anterior; elimina el modal-sobre-modal con la biblioteca).
- `ExerciseLibraryPicker`: sheet con `height: 85%` → la lista se expande (antes colapsaba a `minHeight: 200`).
- Re-elegir ejercicio ya no resetea series/reps/descanso ya ajustados.
- Steppers Series/Descanso en fila propia + Repeticiones a lo ancho → fin de los `−`/`+` cortados y divisores torcidos.

### Web — correctness (rutas rotas)
- `/auth/login` → `/login` en `upgrade/page.tsx`, `upgrade/ActivateProButton.tsx`, `(auth)/forgot-password/page.tsx` (×2). Los route groups `(auth)` no agregan segmento; `/auth/login` daba 404.

### Web — contraste / color / spacing
- Grises ilegibles (#444/#4A4A4A/#555) → `#9898C0` (token `muted`) en `page.tsx`, `admin/dashboard`, `admin/pagos`.
- Rojo de error unificado a `#FF4466` (token `error`) en `forgot-password` y `onboarding-coach`.
- `coach/layout.tsx`: `pb-20` → `pb-28` (el bottom nav tapaba contenido en /coach/perfil).
- `admin/usuarios`: UUID truncado a `slice(0,8)…` (consistencia con dashboard/pagos).
- `admin/AdminSideNav`: `pb-[env(safe-area-inset-bottom)]` en bottom nav + label de marca unificado a "OWNER".
- `upgrade`: gap vertical entre cards en mobile (`gap-10 md:gap-6`).

### Mobile — tokens / tap targets / listas / tipografía
- Hex hardcodeados → tokens en `_layout.tsx` (headers), `(tabs)/_layout.tsx` (`tabBarInactiveTintColor`), `chat.tsx` (fondo → `colors.bg`).
- `paddingBottom` suficiente para tab bar / home indicator en `notifications`, `chat`, `(tabs)/index`.
- Tap targets ≥44px + hitSlop en "Marcar todas" (notifications), "Contratar" (coach marketplace), "‹ Volver" (routine/[id]).
- `keyboardShouldPersistTaps="handled"` en FlatList de rutinas.
- Quitado `fontWeight: "900"` sobre BebasNeue (peso único, no aplica).
- Empty/Error states custom → componentes `EmptyState`/`ErrorState` de `packages/ui/native` (chat, notifications, checkout).

---

## ✅ Críticos resueltos (2026-06-15, segunda tanda)
1. **`coach/rutinas/nueva` crasheaba client-side** en dev-mock → `lib/supabase/client.ts` ahora devuelve un mock cuando falta env (mismo criterio que el server). Verificado visual: la página rinde el form completo sin overlay de error.
2. **Flujo reset-password:** creada `app/(auth)/reset-password/page.tsx` (PKCE: `exchangeCodeForSession` + `updateUser`), `resetPasswordSchema` agregado a `@forzza/core`, y corregido el `redirectTo` de forgot-password (`/auth/reset-password` → `/reset-password`). Verificado visual.
3. **Safe areas mobile:** instalado `react-native-safe-area-context ~5.6.2` + `SafeAreaProvider` en el root. Pantallas con header propio (4 tabs + routine/[id] + session) usan `insets.top`; las de header nativo (notifications, marketplace) bajaron el padding redundante. Pendiente de validación visual (sin emulador).

## ✅ Backlog resuelto (2026-06-15, tercera tanda) — items 4-12 cerrados

### Consistencia / design system
4. **Migración a tokens** ✅ — `globals.css`: `:root` → `@theme` (Tailwind v4 expone `bg-surface`/`text-muted`/`border-border`/`text-lime`); hex hardcodeados → tokens en todas las páginas coach/admin/auth/landing. Commit `0b6727e`.
5. **Íconos emoji → SVG** ✅ — `lucide-react` añadido; `CoachSideNav`/`AdminSideNav` usan íconos monocromáticos que heredan el color activo. Commit `0b6727e`.
6. **Fondo inconsistente** ✅ — landing unificada a `var(--color-bg)`. Commit `0b6727e`.
7. **Features PRO no coinciden** ✅ — extraídas a `lib/plans.ts` (fuente única); `/` y `/upgrade` la consumen. Commit `0b6727e`.
8. **Inputs auth distintos** ✅ — login/forgot/reset normalizados. Commit `0b6727e`.
9. **Jerarquía tipográfica** ✅ — token `fontSize.screenTitle: 32` en `packages/ui/tokens`; aplicado a títulos de pantalla de lista (tabs index/routines/progress/chat, notifications, marketplace/index, routine/[id]). `upgrade` (hero paywall) y `marketplace/[coachId]` (hero de detalle) se dejaron deliberadamente más grandes.

### Layout / responsive
10. **max-width desktop** ✅ — `max-w-6xl mx-auto` en layouts /coach y /admin. Commit `0b6727e`.
11. **Admin layout** ✅ — chips de filtro (pagos/tickets) a scroll horizontal una fila (`scrollbar-none`); KPI cards con valor alineado a línea base via `mt-auto` aunque el label tenga 2 líneas; grid de 3 cards a `grid-cols-3` (sin huérfana).
12. **Estados faltantes** ✅ — mobile: `(tabs)/index` (error), `chat` (error con retry), `progress` (loading por hidratación de zustand persist). Web: `upgrade` (Suspense + `PriceSkeleton` + fallback de precio con aviso si la query falla), `admin/configuracion` (empty state con ícono Lucide + banner de error).

> Verificación: `pnpm --filter web typecheck/lint` y `pnpm --filter mobile typecheck/lint` verdes (los 283 warnings de lint mobile son pre-existentes del cast `supabase as any`). Captura visual mobile sigue bloqueada (sin emulador, ver HUMAN_REQUIRED).

> Evidencia visual web: `.audit/screens/{landing,coach,admin}/*--{mobile,desktop}.png`. Script de captura: `.audit/capture.js`.

---

## 🏁 Estado final auditoría UI/UX — CERRADA (2026-06-15)
- **Críticos:** 100% resueltos (rutas rotas, crash rutinas/nueva, reset-password, safe areas mobile).
- **Backlog (items 4-12):** 100% resuelto.
- **Único pendiente:** HUMAN_REQUIRED — captura visual mobile con emulador Android (validación de los fixes de tap-targets/padding/screenTitle/estados sobre pantalla real). Todo lo demás está verificado por código + typecheck + lint.

### Trazabilidad de commits (pusheados a `origin/main`)
- `4684987` — críticos web (rutas, crash rutinas/nueva, reset-password).
- `4996862` — safe areas mobile reales.
- `0b6727e` — migración a design system (items 4-8, 10).
- `84ad9b6` — cierre backlog (items 9, 11, 12).

La auditoría UI/UX queda **cerrada**. La próxima acción es exclusivamente la validación visual mobile sobre emulador/dispositivo (HUMAN_REQUIRED), no implica más cambios de código pendientes.
