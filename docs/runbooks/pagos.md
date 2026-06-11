# Runbook — Pagos (Mercado Pago + RevenueCat)

## Variables de entorno requeridas

```
MP_ACCESS_TOKEN=TEST-...          # Token de acceso MP sandbox
MP_PUBLIC_KEY=TEST-...            # Clave pública MP (frontend)
MP_WEBHOOK_SECRET=...             # Secret para validar firmas HMAC
REVENUECAT_API_KEY=...            # API key de RevenueCat
REVENUECAT_WEBHOOK_SECRET=...     # Secret para webhooks de RevenueCat
```

Cargar en `.env` (desarrollo local) y en Supabase Secrets (staging/producción):

```bash
supabase secrets set MP_ACCESS_TOKEN=TEST-... MP_WEBHOOK_SECRET=...
```

---

## 1. Configuración de sandbox Mercado Pago

### 1.1 Crear usuarios de prueba

Desde el panel de MP (cuenta real, no sandbox):

1. Ir a `developers.mercadopago.com` > Tu aplicación > Credenciales.
2. En la sección "Usuarios de prueba" crear dos usuarios:
   - **Vendedor** (merchant): usará las credenciales de la aplicación.
   - **Comprador** (payer): usará tarjetas de prueba.

El vendedor es quien recibe los pagos (Forzza). El comprador simula el alumno.

### 1.2 Tarjetas de prueba

Usar las tarjetas de prueba oficiales de MP:

| Tarjeta | Número | CVV | Vencimiento | Resultado |
|---------|--------|-----|-------------|-----------|
| Visa (aprobada) | 4509 9535 6623 3704 | 123 | 11/25 | APROBADO |
| Mastercard (aprobada) | 5031 7557 3453 0604 | 123 | 11/25 | APROBADO |
| Visa (rechazada) | 4000 0000 0000 0002 | 123 | 11/25 | RECHAZADO |

Fuente actualizada: `https://www.mercadopago.com.ar/developers/es/docs/checkout-api/testing`

### 1.3 Credenciales

Las credenciales de sandbox tienen prefijo `TEST-`. Las de producción tienen prefijo numérico.
Nunca mezclar credenciales de sandbox con producción.

---

## 2. Configuración de RevenueCat sandbox

### 2.1 iOS (StoreKit)

1. En App Store Connect: crear el producto IAP de suscripción auto-renovable con ID `com.forzza.pro.monthly`.
2. En Xcode: activar StoreKit testing con el archivo `StoreKit/Forzza.storekit` (si existe) o agregar el producto localmente.
3. En RevenueCat dashboard: crear Offering con el package `pro_monthly` mapeado al product ID.
4. Cargar `REVENUECAT_API_KEY` con la clave pública de la app iOS.

Probar en simulador con StoreKit sandbox (no requiere cuenta de desarrollador activa para tests locales con Xcode).

### 2.2 Android (Google Play)

1. En Google Play Console: crear producto de suscripción con ID `pro_monthly`.
2. Agregar cuenta de tester interno en la lista de testers del track interno.
3. La cuenta de tester debe tener habilitada la opción "License Testing" en Google Play Console > Setup > License Testing.
4. RevenueCat detecta automáticamente el entorno de sandbox por el tipo de token.

### 2.3 Entitlements en RevenueCat

Crear entitlement `pro` mapeado a los productos IAP de iOS y Android.
La función `isPro()` del servidor verifica el entitlement contra la API de RevenueCat (`GET /v1/subscribers/{app_user_id}`).

---

## 3. Probar el flujo de webhook end-to-end (local)

Para probar webhooks de MP localmente se necesita exponer `localhost` a internet:

```bash
# Opción 1: ngrok
ngrok http 54321
# La URL ngrok se usa como webhook URL en MP dashboard

# Opción 2: Supabase CLI tunnel (si está disponible)
supabase functions serve mp-webhook --env-file .env
```

### 3.1 Configurar el webhook en MP

En `developers.mercadopago.com` > Tu app > Webhooks:
- URL: `https://<ngrok-url>/functions/v1/mp-webhook`
- Eventos: `payment` y `subscription_authorized_payment`

### 3.2 Flujo completo a probar

1. Iniciar un pago en sandbox desde la web.
2. MP envía el webhook al Edge Function `mp-webhook`.
3. El Edge Function valida la firma HMAC con `MP_WEBHOOK_SECRET`.
4. Verifica idempotencia contra tabla `processed_events`.
5. Inserta en `payments` y actualiza `subscriptions`.
6. Dispara notificación N2 (pago confirmado) via `send-notification`.

### 3.3 Verificar idempotencia

```bash
# Enviar el mismo evento 3 veces y verificar que solo hay 1 registro en payments
curl -X POST https://<url>/functions/v1/mp-webhook \
  -H "Content-Type: application/json" \
  -d '{"id":"test-event-001","type":"payment","data":{"id":"123"}}'
# Repetir 3 veces → esperar 1 solo INSERT en payments
```

---

## 4. Problemas comunes

| Problema | Causa probable | Solución |
|----------|---------------|----------|
| Webhook devuelve 400 "invalid signature" | `MP_WEBHOOK_SECRET` incorrecto | Verificar en panel MP que el secret coincide con `.env` |
| Webhook devuelve 200 pero no hay INSERT en `payments` | Idempotencia bloqueó el evento (ya procesado) | Normal si el evento fue procesado antes; revisar `processed_events` |
| RevenueCat devuelve "user not found" | `app_user_id` no coincide con el UID de Supabase | Verificar que se envía `supabase.auth.user().id` como customer ID en RC |
| IAP en iOS no aparece | Producto no aprobado en App Store Connect | Crear y aprobar el producto IAP antes de testear (puede tardar horas) |
| Suscripción MP queda en `pending` | Datos de tarjeta incompletos en sandbox | Usar las tarjetas de prueba oficiales con todos los campos |

---

## 5. Pasar a producción

1. Cambiar `MP_ACCESS_TOKEN` al token de producción (sin prefijo `TEST-`).
2. Cambiar `MP_PUBLIC_KEY` a la clave pública de producción.
3. Actualizar la URL del webhook en MP dashboard a la URL de producción.
4. Verificar que `REVENUECAT_API_KEY` es la clave de producción (no la de sandbox).
5. Ejecutar una transacción real de prueba por el importe mínimo antes del lanzamiento.
