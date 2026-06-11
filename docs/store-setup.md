# Store Setup Guide — Forzza

## Apple App Store

### Prerequisitos (HUMAN_REQUIRED)
- [ ] Apple Developer Program activo (99 USD/año)
- [ ] Entidad legal definida (persona física o SAS)
- [ ] App creada en App Store Connect: bundle ID `com.forzza.app`
- [ ] Productos IAP creados (cuando FEATURE_FLAGS.APPLE_PAYMENTS = true)
- [ ] 12 testers internos reclutados para TestFlight

### Metadata de la app
**Nombre:** Forzza
**Subtítulo:** Entrenás con propósito
**Descripción corta (30 chars):** Coach en tu bolsillo
**Descripción larga:**
Forzza es la plataforma que conecta a alumnos comprometidos con coaches certificados.

- Entrená con rutinas personalizadas creadas por tu coach
- Registrá cada sesión y seguí tu progreso
- Hacé check-ins semanales para que tu coach te ajuste el plan
- Accedé al marketplace de coaches verificados de Argentina

**Palabras clave:** fitness, entrenamiento, coach, rutinas, ejercicio, gym, personal trainer, Argentina

**Categoría primaria:** Health & Fitness
**Categoría secundaria:** Sports

**Clasificación de edad:** 4+ (con advertencia de contenido fitness)

**Capturas de pantalla:** 6.7", 5.5" requeridas (iPhone 15 Pro Max, iPhone 8 Plus)

### Configurar EAS Submit
```bash
cd apps/mobile
eas credentials  # Configurar certificados iOS
eas build --platform ios --profile production
eas submit --platform ios --profile production
```

## Google Play Store

### Prerequisitos (HUMAN_REQUIRED)
- [ ] Cuenta Google Play Console (25 USD pago único)
- [ ] 12 testers reclutados para internal testing track
- [ ] Service account key JSON en `apps/mobile/google-play-service-account.json` (gitignored)

### Metadata
**Nombre:** Forzza
**Descripción corta (80 chars):** Conectate con tu coach y entrenás con rutinas personalizadas
**Categoría:** Health & Fitness
**Clasificación de contenido:** Todo público

### Build y submit
```bash
eas build --platform android --profile production
eas submit --platform android --profile production
```

## Variables de entorno para producción
Ver `.env.example` — reemplazar todos los valores MOCK_OK con credenciales reales.

## Checklist pre-launch
- [ ] Supabase: migrar de proyecto local a proyecto cloud (prod)
- [ ] Dominio forzza.app comprado y DNS configurado en Vercel
- [ ] MP en modo producción (verificar tarifa de suscripciones en el panel)
- [ ] Resend: dominio verificado, From address = hola@forzza.app
- [ ] PostHog: proyecto EU creado, key en producción
- [ ] Sentry: proyectos creados para web y mobile
- [ ] Reemplazar assets placeholder (icon, splash)
- [ ] RevenueCat: configurar cuando FEATURE_FLAGS.APPLE_PAYMENTS/GOOGLE_PAYMENTS = true
