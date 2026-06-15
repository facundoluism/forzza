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

## ⏳ Backlog (NECESITA-DECISIÓN) — pendiente de tu criterio

### Consistencia / design system
4. **Migración a tokens:** /coach y /admin usan hex hardcodeados (#0A0A0A, #111111, #C8FF00…) que no coinciden con `packages/ui/tokens` (bg real #080810). CLAUDE.md exige tokens.
5. **Íconos emoji en navegación** (coach + admin): no heredan el color activo y varían por OS. Reemplazar por SVG monocromáticos (lucide/heroicons).
6. **Fondo inconsistente:** público mezcla `#0A0A0A` (home/coaches/upgrade/legales) vs `#080810` (auth/onboarding).
7. **Features PRO no coinciden** entre `/` (home) y `/upgrade`.
8. **Inputs auth distintos** entre login y forgot-password (extraer a componente compartido).
9. **Jerarquía tipográfica:** sin token `fontSize.screenTitle`; títulos oscilan 32/36/40px entre pantallas mobile.

### Layout / responsive (menor)
10. /coach y /admin sin `max-width` en desktop → cards estiradas a ~1140px.
11. Admin: chips de filtro (pagos/tickets) hacen wrap a 2 filas (considerar scroll horizontal); KPI cards con label de 2 líneas descuadran el valor; 3 cards en grid-cols-2 dejan una huérfana.
12. Estados faltantes: `(tabs)/index` (sin error), `chat` (sin error), `progress` (sin loading), `upgrade` (sin error/skeleton de precio), `admin/configuracion` (empty pobre).

> Evidencia visual: `.audit/screens/{landing,coach,admin}/*--{mobile,desktop}.png`. Script de captura: `.audit/capture.js`.
