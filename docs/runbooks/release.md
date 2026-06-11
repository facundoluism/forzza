# Runbook — Release: builds, stores y deploy web

## Prerrequisitos

- EAS CLI instalado: `npm install -g eas-cli`
- Cuenta Expo: `eas login`
- App Store Connect: cuenta activa con app `com.forzza.app` creada.
- Google Play Console: cuenta activa con app creada.
- `EXPO_ACCESS_TOKEN` cargado en variables de entorno.

---

## 1. Builds con EAS

Los perfiles de build están en `apps/mobile/eas.json`.

### 1.1 Build de desarrollo (simulador)

```bash
cd apps/mobile
eas build --platform ios --profile development
eas build --platform android --profile development
```

El build de desarrollo incluye el dev client de Expo. Útil para probar módulos nativos en simulador/emulador.

### 1.2 Build de preview (dispositivo físico, ad-hoc)

```bash
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

El APK de Android se puede instalar directamente. El IPA de iOS requiere dispositivos registrados en el perfil de distribución.

### 1.3 Build de producción (store)

```bash
eas build --platform all --profile production
```

Para iOS genera un `.ipa` firmado para App Store. Para Android genera un `.aab` para Play Store.

### 1.4 Submit directo a las tiendas

```bash
# Subir el último build de producción a las tiendas
eas submit --platform ios --latest
eas submit --platform android --latest
```

Requiere credenciales de App Store Connect y Google Play configuradas en EAS.

### 1.5 OTA updates (sin pasar por tienda)

Para cambios que no tocan código nativo (solo JS/assets):

```bash
eas update --branch production --message "Fix: texto del botón de pago"
```

Los usuarios con la app instalada reciben la actualización en el siguiente arranque.
**No usar para cambios en lógica de pagos o permisos nativos.**

---

## 2. Checklist App Store (iOS)

Completar antes de enviar a revisión:

- [ ] Bundle ID `com.forzza.app` creado en App Store Connect.
- [ ] Certificados de distribución y provisioning profiles configurados en EAS.
- [ ] Suscripción PRO creada como IAP auto-renovable con ID `com.forzza.pro.monthly`.
- [ ] Precios por territorio configurados en App Store Connect (AR, CL).
- [ ] Screenshots subidos: 6.7", 6.5", 5.5" (mínimo 6.7" + 5.5").
- [ ] Ícono 1024×1024 PNG sin transparencia.
- [ ] Descripción en español (<4000 chars) + keywords.
- [ ] Privacy Policy URL: `https://forzza.com/legales/privacidad` (debe ser accesible).
- [ ] Support URL: `https://forzza.com/soporte`.
- [ ] Texto legales finales (no DRAFT) en la URL de privacidad.
- [ ] App Privacy labels completados: salud, fotos, identificadores, datos de pago.
- [ ] Age rating: 12+ (configurar en App Store Connect).
- [ ] Demo account: usuario PRO con coach asignado y datos de prueba. Incluir en "Notes for Reviewer":
  ```
  Demo student (PRO + coach): demo-alumno@forzza.com / Demo1234!
  Demo coach: demo-coach@forzza.com / Demo1234!
  ```
- [ ] "Gestionar suscripción" accesible desde Mi Plan → Settings.
- [ ] "Eliminar cuenta" accesible desde Perfil → Configuración.
- [ ] IAP de paquetes de coach NO existe (la compra es por web). Incluir nota al revisor explicando el modelo 1:1 y la Guideline 3.1.3(e).
- [ ] Paid Apps Agreement firmado en App Store Connect.

---

## 3. Checklist Google Play (Android)

- [ ] App creada en Play Console con el mismo `applicationId: com.forzza.app`.
- [ ] Suscripción PRO creada con ID `pro_monthly` en el catálogo de productos de Play.
- [ ] Data Safety form completado: salud, fotos, datos financieros; opción "compartición: no".
- [ ] Content rating IARC completado (categoría: Fitness).
- [ ] Families: "No dirigida a niños" seleccionado.
- [ ] Screenshots teléfono (mínimo 2, recomendado 8) + tablet 7" (recomendado).
- [ ] Ícono adaptativo configurado en `app.config.ts`.
- [ ] Permisos justificados: cámara (fotos de progreso), notificaciones (Android 13+), sin ubicación.
- [ ] 12 testers internos durante 14 días en closed testing (para cuentas nuevas). **Planificar con 3 semanas de anticipación.**
- [ ] Política de privacidad URL cargada en Play Console.
- [ ] Eliminar cuenta accesible in-app y documentado en Play Console.

---

## 4. Deploy web (Vercel)

### 4.1 Deploy automático (CI)

Cada push a `main` dispara un deploy en Vercel vía integración con GitHub.

### 4.2 Deploy manual

```bash
# Desde la raíz del monorepo
pnpm deploy:web
# O directamente con Vercel CLI
vercel --prod
```

### 4.3 Variables de entorno en Vercel

Cargar en Vercel Dashboard > Settings > Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
MP_ACCESS_TOKEN
MP_WEBHOOK_SECRET
MP_PUBLIC_KEY
RESEND_API_KEY
SENTRY_DSN
NEXT_PUBLIC_POSTHOG_KEY
```

### 4.4 Verificar el deploy

```bash
# Verificar que las rutas críticas devuelven 200
curl -I https://forzza.com
curl -I https://forzza.com/coach
curl -I https://forzza.com/admin
curl -I https://forzza.com/legales/privacidad
```

---

## 5. Verificación PWA post-deploy

```bash
# Lighthouse en la landing (debe dar PWA ≥ 90)
npx lighthouse https://forzza.com --only-categories=pwa --view

# Verificar que el manifest es accesible
curl https://forzza.com/manifest.json

# Verificar el service worker
curl https://forzza.com/sw.js
```

---

## 6. Versionado semántico

El versionado sigue `semver` (MAJOR.MINOR.PATCH):

- **PATCH** (1.0.X): correcciones de bugs, OTA updates.
- **MINOR** (1.X.0): nuevas features sin cambios de API. Requiere nuevo build en tiendas.
- **MAJOR** (X.0.0): cambios de arquitectura, migración de DB, cambio de bundle ID.

Actualizar en `apps/mobile/app.config.ts`:
```ts
version: "1.0.1",     // semver
android: { versionCode: 2 },  // siempre incrementar
ios: { buildNumber: "2" },
```

---

## 7. Rollback

### App móvil

No se puede hacer rollback de builds publicados en tienda. Publicar hotfix cuanto antes.
Para revertir en usuarios que ya tienen la app, usar OTA update si el bug es solo JS:

```bash
eas update --branch production --message "Hotfix: revert payment flow" --rollback-to-channel production
```

### Web

En Vercel, hacer rollback al deploy anterior desde el dashboard: Deployments > seleccionar deploy anterior > "Promote to Production".
