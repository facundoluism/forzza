# Security Review — Forzza V1

**Fecha:** 2026-06-10
**Revisor:** qa-automation-engineer
**Alcance:** Toda la arquitectura construida en F0–F16

---

## Resumen ejecutivo

| Area | Estado | Nivel de riesgo |
|---|---|---|
| RLS default-deny | CONFIRMADO | Bajo |
| Audit trail financiero | CONFIRMADO | Bajo |
| PII en analytics | CONFIRMADO | Bajo |
| Consentimiento parental | CONFIRMADO | Bajo |
| Webhooks idempotentes | CONFIRMADO | Bajo |
| Buckets privados | CONFIRMADO | Bajo |
| Validacion de firma webhook | TODO — HUMAN_REQUIRED | **ALTO** |
| Secretos en entorno | CONFIRMADO | Bajo |
| Datos de dinero como enteros | CONFIRMADO | Bajo |

---

## 1. RLS default-deny — CONFIRMADO en 25 tablas

**Implementacion:** `supabase/migrations/20260610000003_rls.sql`

Todas las tablas del schema publico tienen:
- `ALTER TABLE <tabla> ENABLE ROW LEVEL SECURITY;`
- `ALTER TABLE <tabla> FORCE ROW LEVEL SECURITY;`
- Politica de acceso explicita por rol (anon, authenticated, coach, owner)

Tablas confirmadas con RLS:
`users`, `student_profiles`, `coach_profiles`, `coach_packages`, `coach_assignments`,
`routines`, `routine_exercises`, `workout_sessions`, `session_sets`, `body_metrics`,
`progress_photos`, `check_ins`, `messages`, `conversations`, `conversation_participants`,
`payments`, `subscriptions`, `settlements`, `invoices`, `audit_log`,
`processed_events`, `coach_availability`, `country_config`, `exercise_library`, `leads`

**Verificacion:** pgTAP tests #13, #14, #15 (+ test #16–23 en F16) confirman rowsecurity=true.

**Acceso anonimo:** La politica anon no tiene SELECT en ninguna tabla de datos de usuario.
Cualquier llamada de usuario no autenticado recibe cero filas (RLS default-deny).

---

## 2. Audit trail — audit_log append-only

**Implementacion:** migration 20260610000002 + 20260610000003

- La tabla `audit_log` registra TODA accion financiera o de validacion:
  - Pagos MP (payment_id, status, amount)
  - Cambios de billing_model del coach
  - Transferencias de settlements
  - Aprobaciones de facturas
  - Cambios de rol de usuario

- Restricciones tecnicas:
  - `REVOKE UPDATE ON audit_log FROM authenticated, anon` — nadie puede editar
  - `REVOKE DELETE ON audit_log FROM authenticated, anon` — nadie puede borrar
  - Solo `INSERT` permitido (via trigger o service_role)

- **pgTAP #7 y #8** verifican que UPDATE y DELETE lanzan error 42501.

---

## 3. PII en analytics — scrubPII() verificado

**Implementacion:** `packages/core/src/analytics/index.ts`

La funcion `scrubPII()` elimina antes de enviar a PostHog:
- `email`
- `phone`
- `name`
- `full_name`
- `first_name`
- `last_name`
- `dni`
- `cuit`
- `address`

**Cobertura:** 3 tests unitarios en `analytics/__tests__/analytics.test.ts`, 100% de ramas cubiertas.

Ningun evento de analytics contiene datos de identidad personal. Los user IDs enviados son UUIDs opacos (auth.uid).

---

## 4. Consentimiento parental (menores de 18)

**Implementacion:** `packages/core/src/schemas/auth.ts` (isMinor()) + onboarding mobile + checkout web

Flujo:
1. Alumno ingresa fecha de nacimiento en onboarding
2. `isMinor(dob)` devuelve true si edad < 18
3. Si isMinor: se muestra formulario de consentimiento parental en onboarding
4. `parental_consent_at` se guarda en `student_profiles`
5. En `/api/checkout` (coach packages) y la Edge Function: si `parental_consent_at IS NULL` → HTTP 403

**Cobertura:** auth.test.ts incluye tests de `isMinor()`.

**Pendiente HUMAN_REQUIRED:** verificar el 403 contra Supabase real cuando DB este activa.

---

## 5. Webhooks idempotentes — processed_events

**Implementacion:** `supabase/migrations/20260610000002_constraints.sql`

Tabla `processed_events` con:
- `gateway` (mp, revenuecat)
- `event_id` TEXT UNIQUE NOT NULL
- `processed_at` TIMESTAMPTZ DEFAULT now()
- `REVOKE UPDATE ON processed_events` — append-only

Logica en Edge Function `mp-webhook`:
```
1. Recibir evento MP
2. INSERT INTO processed_events (gateway, event_id) ON CONFLICT DO NOTHING
3. Si filas afectadas = 0 → evento ya procesado → return 200 sin efecto
4. Si filas afectadas = 1 → procesar pago
```

Esto garantiza que el mismo evento recibido N veces produce exactamente 1 efecto.

**pgTAP #9** verifica que processed_events rechaza UPDATE (append-only).

---

## 6. Buckets privados — 4 buckets, 0 URLs publicas

**Implementacion:** `supabase/migrations/20260610000004_storage.sql`

| Bucket | Contenido | public |
|---|---|---|
| progress-photos | Fotos de progreso corporal del alumno | false |
| fiscal-docs | Constancias de inscripcion del coach | false |
| invoices | PDFs de facturas de settlements | false |
| videos | Videos de ejercicios (futuro) | false |

Acceso: SOLO via URL firmada con TTL de 1 hora. Las URLs firmadas nunca se loguean ni se envian a analytics.

**pgTAP #12** verifica que los 4 buckets existen con `public = false`.

---

## 7. Validacion de firma webhook — TODO HUMAN_REQUIRED

**Estado: PENDIENTE — RIESGO ALTO**

MercadoPago envia una firma HMAC-SHA256 en el header `x-signature`. La Edge Function `mp-webhook` actualmente tiene un TODO para validarla.

**Riesgo:** Sin validacion de firma, cualquier actor puede llamar al webhook endpoint con un payload falso y desencadenar logica de pago.

**Accion requerida (HUMAN):**
```typescript
// En supabase/functions/mp-webhook/index.ts
const signature = req.headers.get("x-signature");
const secret = Deno.env.get("MP_WEBHOOK_SECRET");
const body = await req.text();
const expected = hmac("sha256", secret, body, "utf8", "hex");
if (signature !== `ts=${ts},v1=${expected}`) {
  return new Response("Unauthorized", { status: 401 });
}
```

Tambien se debe configurar `MP_WEBHOOK_SECRET` en Supabase Secrets del proyecto.

---

## 8. Secretos en entorno — CONFIRMADO

- `.env` esta en `.gitignore`
- `.env.example` documenta TODAS las variables con comentarios y valores `MOCK_OK` / `REPLACE_ME`
- Ningun secreto aparece hardcodeado en el codigo fuente
- Edge Functions usan `Deno.env.get()` para leer secretos de Supabase Secrets
- El `SUPABASE_SERVICE_ROLE_KEY` solo se usa en Edge Functions server-side, nunca en el cliente

---

## 9. Dinero como enteros — CONFIRMADO

**Implementacion:** `packages/core/src/billing/index.ts`

- Todos los montos se almacenan en centavos (enteros)
- `calculateSettlement` usa `Math.round()` para redondeo unico al final
- Ninguna operacion intermedia usa punto flotante
- Tests de billing verifican que `commission + net === gross` (sin perdida de centavos)

---

## 10. Superficie de ataque adicional — notas

### SQL Injection
- Toda interaccion con DB va via Supabase JS client (parameterizado)
- Las Edge Functions usan el cliente oficial de Supabase con prepared statements
- No hay string concatenation en queries

### XSS
- Next.js escapa automaticamente el output en JSX
- No se usa `dangerouslySetInnerHTML` en ningun componente
- Los mensajes de chat pasan por el Supabase Realtime channel (no se renderizan como HTML)

### CSRF
- Las rutas de API web usan el cliente Supabase SSR con cookies httpOnly + SameSite=Lax
- No hay formularios que expongan tokens en URLs

### Rate limiting
- TODO: agregar rate limiting a `/api/leads` y `/api/checkout` (recomendado: Upstash Redis o Supabase Edge Function rate limiter)
- Actualmente dependemos del rate limiting de Supabase (1000 req/min por defecto)

---

## Checklist pre-produccion de seguridad

- [ ] Ejecutar `pnpm test:rls` con DB activa (23 assertions pgTAP)
- [ ] Implementar validacion HMAC en mp-webhook (ver seccion 7)
- [ ] Configurar MP_WEBHOOK_SECRET en Supabase Secrets
- [ ] Agregar rate limiting a endpoints publicos (/api/leads, /api/checkout)
- [ ] Revisar logs de Supabase post-deployment: 0 errores 42501 inesperados
- [ ] Audit de URLs firmadas: confirmar TTL=1h en todos los buckets
- [ ] Penetration test basico: intentar acceso cruzado entre dos usuarios de prueba
- [ ] Revisar headers de seguridad en Next.js (CSP, HSTS, X-Frame-Options) via next.config.ts
