# Fase 2 — Bootstrap: Fuentes, Splash, Sentry

Fecha: 2026-06-14

## Resumen

Fase de infraestructura: la app mobile ahora arranca en Expo Go con fuentes Google cargadas antes de mostrar UI, splash screen correctamente controlado, y Sentry instrumentado.

## Criterios de Aceptación — PASS/FAIL

### TAREA 1 — Instalar paquetes faltantes: PASS
- `expo-font` instalado en `apps/mobile/node_modules/expo-font/`
- `expo-splash-screen` instalado en `apps/mobile/node_modules/expo-splash-screen/`
- `@expo-google-fonts/bebas-neue` instalado
- `@expo-google-fonts/dm-sans` instalado
- `@expo-google-fonts/space-mono` instalado
- Comando: `pnpm add --filter mobile expo-font expo-splash-screen @expo-google-fonts/bebas-neue @expo-google-fonts/dm-sans @expo-google-fonts/space-mono`

### TAREA 2 — Assets placeholder funcionales: PASS
- `apps/mobile/assets/splash.png` creado (69 bytes, PNG 1x1px #0A0A0A válido)
- `apps/mobile/assets/adaptive-icon.png` creado (69 bytes, PNG 1x1px #0A0A0A válido)
- Script generador: `scripts/generate-mobile-assets.js`
- Assets existentes (`icon.png`, `favicon.png`) sin modificar

### TAREA 3 — app.config.ts actualizado: PASS
- `ios.splash` agregado con `image: './assets/splash.png'`, `resizeMode: 'contain'`, `backgroundColor: '#0A0A0A'`
- `android.splash` agregado con misma configuración
- `android.adaptiveIcon.foregroundImage` corregido a `'./assets/adaptive-icon.png'`
- Plugin `expo-notifications` agregado con `icon`, `color: '#C8FF00'`, `defaultChannel: 'default'`
- Plugin `@sentry/react-native/expo` agregado con `url` y `project: 'forzza-mobile'`

### TAREA 4 — `_layout.tsx` con fuentes, splash y Sentry: PASS
- `SplashScreen.preventAutoHideAsync()` llamado en el módulo (antes de cualquier render)
- `useFonts({ BebasNeue_400Regular, DMSans_400Regular, DMSans_500Medium, DMSans_700Bold, SpaceMono_400Regular })` en `RootLayout`
- `initSentry()` llamado en `useEffect` con state `sentryReady`
- `SplashScreen.hideAsync()` llamado solo cuando `fontsLoaded && sentryReady`
- Todos los `fontFamily: "BebasNeue"` reemplazados por `"BebasNeue_400Regular"` (6 ocurrencias en headers de Stack.Screen)
- Imports: `expo-font`, `expo-splash-screen`, `@expo-google-fonts/bebas-neue`, `@expo-google-fonts/dm-sans`, `@expo-google-fonts/space-mono`, `@/lib/sentry`

### TAREA 5 — pnpm typecheck --filter mobile: PASS
- 0 errores TypeScript
- Evidencia: `Tasks: 1 successful, 1 total / Time: 3.003s`
- Fixes adicionales aplicados:
  - `apps/mobile/app/marketplace/[coachId].tsx`: `.eq("country_code", "AR")` → `.eq("country", "AR")` (columna PK es `country` según DB types)
  - `apps/mobile/app/marketplace/checkout.tsx`: mismo fix
  - `apps/mobile/app/marketplace/index.tsx`: mismo fix
  - `apps/mobile/app/notifications.tsx`: `Notification.metadata` → `Notification.data` (alinea con DB schema `data: Json`); cast `as unknown as Notification[]`

### TAREA 6 — packages/ui/src/tokens.ts tipografía: PASS
- `typography.heading` actualizado: `"BebasNeue"` → `"BebasNeue_400Regular"`
- `typography.body` actualizado: `"DMSans"` → `"DMSans_400Regular"`
- `typography.mono` actualizado: `"SpaceMono"` → `"SpaceMono_400Regular"`
- Componentes nativos en `packages/ui/src/native/` usan `typography.*` indirectamente → se actualizan automáticamente

## Bugs corregidos (pre-existentes)

| Archivo | Error | Fix |
|---|---|---|
| `marketplace/[coachId].tsx` | `.eq("country_code", "AR")` no existe en tipo | Cambiado a `.eq("country", "AR")` |
| `marketplace/checkout.tsx` | ídem | ídem |
| `marketplace/index.tsx` | ídem | ídem |
| `notifications.tsx` | `Notification.metadata` no en DB | Renombrado a `data`, alineado con schema |

## Archivos modificados

- `apps/mobile/app/_layout.tsx` — fuentes, splash, Sentry
- `apps/mobile/app.config.ts` — plugins y splash config
- `apps/mobile/app/marketplace/[coachId].tsx` — fix country filter
- `apps/mobile/app/marketplace/checkout.tsx` — fix country filter
- `apps/mobile/app/marketplace/index.tsx` — fix country filter
- `apps/mobile/app/notifications.tsx` — fix Notification interface
- `apps/mobile/assets/splash.png` — nuevo (placeholder)
- `apps/mobile/assets/adaptive-icon.png` — nuevo (placeholder)
- `packages/ui/src/tokens.ts` — font names con sufijo correcto
- `scripts/generate-mobile-assets.js` — nuevo script

## Notas

- El DSN de Sentry se lee de `EXPO_PUBLIC_SENTRY_DSN`. Si no está en `.env.local`, `initSentry()` sale silenciosamente (comportamiento correcto para desarrollo).
- Los assets `splash.png` y `adaptive-icon.png` son placeholders 1×1px. Para producción se requieren assets reales (HUMAN_REQUIRED: diseñador debe proveer PNGs finales).
- Los peer warnings de pnpm (react-dom versión) son pre-existentes y no afectan la app mobile.
