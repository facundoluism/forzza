# Runbook — Observabilidad (Sentry + PostHog)

## Variables de entorno requeridas

```
# Sentry
SENTRY_DSN=https://...@o<org>.ingest.sentry.io/<project>
SENTRY_AUTH_TOKEN=...               # Para source maps en CI
NEXT_PUBLIC_SENTRY_DSN=...          # Expuesto al cliente Next.js
SENTRY_ORG=forzza
SENTRY_PROJECT=forzza-web           # o forzza-mobile

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com   # EU para GDPR
```

---

## 1. Sentry — configuración mobile (Expo)

### 1.1 Setup inicial

Sentry ya está integrado en `apps/mobile` vía `@sentry/react-native`. Verificar que el DSN está en `.env`:

```bash
# En app.config.ts o en el init de Sentry:
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.APP_ENV ?? 'development',
  tracesSampleRate: 0.2,  // 20% de transacciones
  _experiments: { profilesSampleRate: 0.1 },
});
```

### 1.2 Source maps (builds EAS)

Los source maps se suben automáticamente si `SENTRY_AUTH_TOKEN` está configurado en EAS Secrets:

```bash
eas secret:create --scope project --name SENTRY_AUTH_TOKEN --value <token>
```

Sin source maps, los stack traces en Sentry mostrarán código minificado. Configurar antes del primer build de producción.

### 1.3 Captura de errores no manejados

Sentry captura automáticamente los crashes no manejados. Para errores de negocio esperados:

```typescript
import * as Sentry from '@sentry/react-native';

// Capturar con contexto adicional
Sentry.captureException(error, {
  tags: { feature: 'checkout', plan: 'coach_package' },
  extra: { coachId, packageType },
  user: { id: userId },  // sin PII adicional
});
```

**Nunca loguear a Sentry**: fotos corporales, números de factura, datos bancarios, tokens de pago.

---

## 2. Sentry — configuración web (Next.js)

### 2.1 Archivos de configuración

- `apps/web/sentry.client.config.ts` — configuración del lado cliente.
- `apps/web/sentry.server.config.ts` — configuración del lado servidor.
- `apps/web/sentry.edge.config.ts` — configuración para Edge Runtime (middleware).
- `apps/web/next.config.js` — Sentry webpack plugin para source maps.

### 2.2 Verificar que Sentry está activo

Luego del deploy, ejecutar:

```bash
# Crear un error de prueba (solo en staging)
curl https://forzza.com/api/sentry-test
```

Verificar en el dashboard de Sentry que el evento llegó en <2 minutos.

### 2.3 Alertas configuradas

En Sentry > Alerts configurar al menos:

| Condición | Umbral | Acción |
|-----------|--------|--------|
| Error rate en `/api/webhooks/mp` | >5% en 5 min | Email al dueño |
| Error rate en `/api/checkout` | >1% en 5 min | Email al dueño + Slack |
| Crash free rate mobile | <99% en 1h | Email al dueño |
| Nuevo error no visto antes | cualquiera | Email al dueño |

---

## 3. PostHog — eventos de producto

### 3.1 Eventos que se capturan (definidos en `packages/core/analytics/`)

Los eventos pasan por `track()` de `@forzza/core/analytics` que aplica `scrubPII()` antes de enviar a PostHog.
Nunca enviar datos sensibles (peso, fotos, datos financieros) a PostHog.

| Evento | Propiedades | Dónde |
|--------|-------------|-------|
| `signup_completed` | `{ plan: 'free', country: 'AR' }` | Onboarding |
| `upgrade_modal_shown` | `{ trigger: 'routine_limit' \| 'history' \| 'tabata' }` | Gating |
| `upgrade_started` | `{ plan: 'pro', channel: 'web' \| 'ios' \| 'android' }` | Upgrade flow |
| `payment_succeeded` | `{ plan: 'pro' \| 'coach_package', amount_cents: N }` | Post-pago |
| `coach_assigned` | `{ package_type: 'starter' \| 'pro' \| 'elite' }` | Asignación |
| `workout_completed` | `{ duration_min: N, exercises_count: N }` | Sesión |
| `churn_detected` | `{ plan: 'pro', months_active: N }` | Cancelación |

### 3.2 Funnels configurados en PostHog

Crear en PostHog > Funnels:

- **Funnel PRO**: `signup_completed → upgrade_modal_shown → upgrade_started → payment_succeeded`
- **Funnel Coach**: `marketplace_viewed → coach_profile_viewed → checkout_started → payment_succeeded → coach_assigned`
- **Retención**: cohort semanal por `workout_completed`

### 3.3 Feature flags

Los feature flags viven en `packages/config/feature-flags.ts` como constantes, no en PostHog en V1. Cuando se requiera rollout gradual, migrar a PostHog Feature Flags:

```typescript
// Ejemplo de uso futuro
const showNewCheckout = await posthog.isFeatureEnabled('new-checkout-flow', userId);
```

---

## 4. Workflow de investigación de errores

### 4.1 Error reportado por usuario

1. Buscar en Sentry por `user.id` o por el endpoint afectado.
2. Revisar el stack trace con source maps.
3. Revisar el replay de sesión en Sentry (si está habilitado) o en PostHog Session Replay.
4. Buscar eventos PostHog del usuario en las últimas 24h para entender el flujo previo al error.
5. Si el error involucra un pago: revisar `audit_log` en Supabase para trazabilidad completa.

### 4.2 Error de pago (alta urgencia)

1. Sentry alert dispara → revisar el error en `supabase/functions/mp-webhook` logs.
2. Verificar en `processed_events` que el `event_id` no fue procesado parcialmente.
3. Si el pago llegó a MP pero no se reflejó en la DB: el evento puede re-procesarse manualmente (la idempotencia lo protege de duplicados).
4. Registrar el incidente en `audit_log` con `actor_id = system` y `metadata.incident_id`.

### 4.3 Performance monitoring

En Sentry > Performance verificar:

- **P95 de `/api/checkout`** < 2s (objetivo).
- **P95 de `/api/webhooks/mp`** < 500ms (objetivo).
- **Mobile startup time** < 3s en Android mid-range (objetivo).

---

## 5. Logs de Supabase Edge Functions

```bash
# Ver logs en tiempo real (requiere supabase link activo)
supabase functions logs mp-webhook --tail
supabase functions logs create-settlement --tail
supabase functions logs send-notification --tail
```

En producción, los logs están disponibles en Supabase Dashboard > Edge Functions > Logs.
Retención: 7 días en el plan Pro de Supabase.

---

## 6. Privacidad y GDPR

- PostHog está configurado en el servidor EU (`eu.posthog.com`) para cumplir GDPR desde V1.
- Los datos de salud (peso, fotos corporales) nunca se envían a PostHog ni a Sentry.
- `scrubPII()` en `@forzza/core/analytics` elimina emails, nombres y cualquier dato identificable antes de trackear.
- Al recibir una solicitud de eliminación de datos (`DELETE /api/user`): además del soft-delete en Supabase, enviar request de eliminación a PostHog: `DELETE /api/projects/<id>/persons` con el `distinct_id` del usuario.
