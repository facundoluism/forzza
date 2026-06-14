# Fase 6 — Revisión UI/UX micro-detalle

Fecha: 2026-06-14
Ejecutor: ui-design-system-engineer

## Resultados por área

### TAREA 1: globals.css y tokens web
**PASS**
- Todos los colores están en `:root` como variables CSS. No hay hex hardcodeados fuera del `:root` ni de clases de utilidad.
- `.btn-lime` y `.bg-\[\#C8FF00\]` tienen `color: #000 !important` y hover/active definidos.
- Radios consistentes: 8px (`radius.md`) y 16px (`radius.lg`) usados en toda la UI.
- Hover/press/active definidos para `.btn-lime`, `.btn-outline`, `.card-hover`.
- Scrollbar estilizado con lime en thumb hover.

**Correcciones aplicadas:**
- Agregado `:focus-visible` global con outline `var(--color-lime)` para accesibilidad.
- Corregido `.nav-mobile a` para no reducir el botón CTA lime en mobile — ahora aplica solo a `a:not(.btn-lime)`.
- Agregado bloque `.ui-btn` / `.ui-btn--primary` / `.ui-btn--secondary` para los componentes web `Button` del design system (hover scale + glow).

### TAREA 2: Landing page (apps/web/app/page.tsx)
**PASS** con una corrección menor.

Verificado:
- Logo FORZZA: fontSize 24px, fontWeight 800, letterSpacing 6px, color var(--color-lime), fontFamily var(--font-display). CORRECTO.
- Nav mobile: links con `.hide-mobile`, solo el CTA lime visible. CORRECTO.
- Hero: `clamp(64px, 12vw, 120px)` en h1. CORRECTO.
- CTA buttons: usan `btn-lime` (texto negro inline) y `btn-outline`. Padding 16px 36px. CORRECTO.
- Feature cards: `card-hover` presente. CORRECTO.
- Pricing FREE: border `rgba(255,255,255,0.12)`. CORRECTO.
- Pricing PRO: borde lime + badge RECOMENDADO. CORRECTO. Precio dinámico desde country_config. CORRECTO.
- Footer logo: fontSize 20px, fontWeight 800, letterSpacing 6px, color lime. CORRECTO.
- Grids: `repeat(auto-fit, minmax(min(280px, 100%), 1fr))`. CORRECTO.

**Corrección:** Copyright en footer tenía `color: '#2A2A2A'` — relación de contraste ~1.5:1 sobre `#0A0A0A`, ilegible. Corregido a `#555555`.

### TAREA 3: Backoffice /coach
**PASS** con correcciones.

**Problemas encontrados y corregidos:**

1. **Sidebar sin active state**: Los nav items no resaltaban la página activa. Refactorizado a `CoachSideNav` (client component con `usePathname`). La ruta activa ahora tiene `bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20`.

2. **Logo "Forzza" mixed-case**: El sidebar mostraba "Forzza" en lugar de "FORZZA". Corregido a `FORZZA` con letterSpacing 5px, fontWeight 800, color lime. Idem en mobile header.

3. **Empty states sin icono**: Alumnos, Rutinas, Check-ins, Cobros mostraban solo texto. Agregado icono emoji + título prominente + descripción secundaria en todos.

4. **Rutinas cards sin CTA**: Los cards de rutinas no tenían link de acción. Agregado "Ver rutina →" en línea inferior con separador, y animación `hover:-translate-y-0.5 hover:shadow-lg`.

Verificado y CORRECTO:
- Tablas: headers en uppercase + tracking-wider. CORRECTO.
- Hover en filas: `hover:bg-[#161616] transition-colors`. CORRECTO.
- Status badges: Tailwind utility classes (yellow/green/red/orange) consistentes. CORRECTO.
- Botones CTA lime con `text-[#0A0A0A]`. CORRECTO.
- Mobile: mobile header sticky + bottom nav tabs. CORRECTO.

### TAREA 4: Backoffice /admin
**PASS** con correcciones.

**Correcciones aplicadas:**
1. **Logo "Forzza"**: Mismo problema. Corregido a "FORZZA" con mismo estilo que coach.
2. **Sidebar sin active state**: Igual que coach. Refactorizado a `AdminSideNav` client component.
3. **Empty states sin icono**: Dashboard, Coaches, Pagos, Tickets — todos corregidos con icono + título prominente.

Verificado y CORRECTO:
- Dashboard cards: MetricCard con `rounded-xl border border-[#1E1E1E] bg-[#111111]`. CORRECTO.
- Approve/Reject buttons visualmente distinguibles: verde lime para Aprobar, rojo para Rechazar. CORRECTO.
- Tablas responsive: columnas ocultas con `hidden sm:table-cell / hidden md:table-cell`. CORRECTO.
- Status badges con colores semánticos. CORRECTO.

### TAREA 5: Mobile — tokens y consistencia
**PASS**

- `Button` native: primary usa `colors.lime`, label `colors.black`. Outline con `colors.border`. Loading con `ActivityIndicator` correcto. Disabled opacity 0.4. Spring animation en press. CORRECTO.
- `Card` native: background `colors.surface`, `borderWidth: 1`, `borderColor: colors.border`. CORRECTO.
- `Input` native: background `colors.gray900`, border `colors.gray700`, color `colors.white`, error `colors.error`, success `colors.success`. CORRECTO.
- `EmptyState`: icon + title + description + action button. CORRECTO.
- `ErrorState`: icon + title + description + retry button. CORRECTO.
- Todos los componentes importan desde `../tokens`. CORRECTO.
- `(tabs)/_layout.tsx`: `tabBarActiveTintColor: colors.lime`, inactive `#4A4A4A`. Notification badge usa `colors.lime` + `colors.black`. CORRECTO.

### TAREA 6: Responsive web
**PASS (análisis estático)**

- Landing: nav mobile oculta links con `.hide-mobile`. Hero clamp. Stats strip con flexWrap. Grids auto-fit minmax. CORRECTO.
- Backoffice: sidebar oculta en mobile (`hidden lg:flex`), bottom nav tabs en mobile. CORRECTO.
- Coach/Admin: `lg:ml-60` / `lg:ml-64` para main content. CORRECTO.
- Tablas: columnas opcionales `hidden sm:table-cell` / `hidden md:table-cell`. CORRECTO.
- Formulario onboarding: `maxWidth: 600px` auto-centrado. CORRECTO.

### TAREA 7: Colores y contraste
**PASS** — ningún texto blanco sobre lime detectado en web ni mobile.

- Web: no existe `text-white` sobre fondo lime en ningún archivo tsx. Los botones lime tienen `color: #000` inline y `color: #000 !important` en CSS.
- Mobile: `colors.white` sobre fondo lime solo aparece en el badge de notificaciones donde el texto es `color: colors.black` (correcto). Los usos de `colors.white` en screens son sobre fondos oscuros. CORRECTO.
- Mobile auth screens (`login.tsx`, `signup.tsx`, `onboarding.tsx`, `forgot-password.tsx`): usan `#FAFAFA` hardcodeado (no desde tokens) pero sobre fondos oscuros. Esto es una deuda técnica de feature screens, fuera del scope de este agente (packages/ui/**).

### TAREA 8: Correcciones aplicadas — resumen
| Archivo | Problema | Fix |
|---|---|---|
| `apps/web/app/globals.css` | Sin focus ring, nav mobile aplica a CTA | Agregado `:focus-visible`, corregido selector |
| `apps/web/app/globals.css` | Sin hover para web Button component | Agregado `.ui-btn` / `.ui-btn--primary` / `.ui-btn--secondary` |
| `apps/web/app/page.tsx` | Copyright `#2A2A2A` ilegible | Cambiado a `#555555` |
| `apps/web/app/coach/layout.tsx` | Logo "Forzza" mixcase, sin active state, sin mobile header FORZZA | Refactorizado a `CoachSideNav` client component |
| `apps/web/app/coach/CoachSideNav.tsx` | No existía | Creado: active state lime, logo FORZZA, mobile tabs |
| `apps/web/app/admin/layout.tsx` | Logo "Forzza" mixcase, sin active state | Refactorizado a `AdminSideNav` client component |
| `apps/web/app/admin/AdminSideNav.tsx` | No existía | Creado: active state lime, logo FORZZA, mobile tabs |
| `apps/web/app/coach/alumnos/page.tsx` | Empty state sin icono | Icono + título prominente |
| `apps/web/app/coach/rutinas/page.tsx` | Empty state sin icono, cards sin CTA | Icono, CTA "Ver rutina →", hover animation |
| `apps/web/app/coach/checkins/page.tsx` | Empty state sin icono | Icono + título prominente |
| `apps/web/app/coach/cobros/page.tsx` | Empty state sin icono | Icono + título prominente |
| `apps/web/app/admin/dashboard/page.tsx` | Empty state sin icono | Icono 👥 |
| `apps/web/app/admin/coaches/page.tsx` | Empty state sin icono | Icono + título + descripción |
| `apps/web/app/admin/pagos/page.tsx` | Empty state sin icono | Icono + título + descripción |
| `apps/web/app/admin/tickets/page.tsx` | Empty state sin icono | Icono + título + descripción |
| `apps/web/app/onboarding-coach/page.tsx` | Sin logo FORZZA en header | Agregado logo + CSS vars en lugar de hex raw |
| `packages/ui/src/web/Button.tsx` | Sin hover/active visual en web | Clases `ui-btn ui-btn--{variant}` para CSS hooks |

### TAREA 9: Logo FORZZA — consistencia
**PASS** tras correcciones.

- Web nav: `fontSize 24px, fontWeight 800, letterSpacing 6px, color var(--color-lime), fontFamily var(--font-display)`. CORRECTO.
- Web footer: `fontSize 20px, fontWeight 800, letterSpacing 6px, color var(--color-lime)`. CORRECTO.
- Coach sidebar: `fontSize 20px, fontWeight 800, letterSpacing 5px, color #C8FF00`. CORREGIDO (era "Forzza").
- Admin sidebar: `fontSize 20px, fontWeight 800, letterSpacing 5px, color #C8FF00`. CORREGIDO (era "Forzza").
- Onboarding coach: `fontSize 24px, fontWeight 800, letterSpacing 6px, color var(--color-lime)`. AGREGADO.
- Mobile tabs: no hay título en header (headerShown: false), el logo aparece en screens individuales.

### Typecheck final
**PASS** — `pnpm typecheck` 6/6 tasks exitosas, 0 errores de TypeScript.
