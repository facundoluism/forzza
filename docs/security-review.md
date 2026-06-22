# Security Review — Forzza V1

> **Actualizado 2026-06-22 — reemplaza la version obsoleta del 2026-06-10.**
> Esta revision refleja el estado real tras la auditoria e2e de las fases F0–F20.

**Fecha original:** 2026-06-10  
**Actualizacion:** 2026-06-22  
**Revisor:** qa-automation-engineer / docs-maintainer  
**Alcance:** Toda la arquitectura construida en F0–F20

---

## Resumen ejecutivo

| Area | Estado | Nivel de riesgo |
|---|---|---|
| RLS default-deny | CONFIRMADO — 63 tests pgTAP PASS | Bajo |
| Audit trail financiero | CONFIRMADO | Bajo |
| PII en analytics | CONFIRMADO | Bajo |
| Consentimiento parental | CONFIRMADO | Bajo |
| Webhooks idempotentes | CONFIRMADO | Bajo |
| Buckets privados (4) | CONFIRMADO | Bajo |
| Validacion de firma webhook MP (HMAC-SHA256) | IMPLEMENTADA Y VERIFICADA | Bajo |
| Secretos en entorno | CONFIRMADO | Bajo |
| Datos de dinero como enteros | CONFIRMADO | Bajo |
| Dev-bypass de requireAdmin() | PENDIENTE hardening | **MEDIO** |
| Rate limiting /api/admin/* y endpoints publicos | PENDIENTE | **MEDIO** |

---

## 1. RLS default-deny — CONFIRMADO en ~36 tablas

**Verificacion:** `pnpm test:rls` — **63 assertions pgTAP PASS** (archivo `supabase/tests/rls_test.sql`).

Las migraciones de RLS estan distribuidas a lo largo de las 26 migraciones en `supabase/migrations/`. Todas las tablas del schema publico tienen:
- `ALTER TABLE <tabla> ENABLE ROW LEVEL SECURITY;`
- `ALTER TABLE <tabla> FORCE ROW LEVEL SECURITY;`
- Politica de acceso explicita por rol (anon, authenticated, coach, owner)

Tablas confirmadas con RLS habilitado (~36 tablas reales al 2026-06-22):
`users`, `student_profiles`, `coach_profiles`, `coach_packages`, `coach_assignments`,
`routines`, `workout_sessions`, `body_metrics`, `progress_photos`, `messages`,
`payments`, `subscriptions`, `settlements`, `audit_log`, `processed_events`,
`country_config`, `exercise_library`, `leads`, `tabata_plans`, `live_sessions`,
`coach_ratings`, `coach_feedback`, y demas tablas creadas en las 26 migraciones.

> Nota: la lista de 25 tablas del review del 2026-06-10 incluia nombres que NO existen en el schema real
> (conversations, conversation_participants, check_ins, session_sets, routine_exercises,
> coach_availability, invoices) y omitia ~15 tablas que si existen. Usar `supabase db diff` o
> `pnpm db:types` para obtener la lista canonica actualizada.

**Acceso anonimo:** La politica anon no tiene SELECT en ninguna tabla de datos de usuario.
Cualquier llamada de usuario no autenticado recibe cero filas (RLS default-deny).

---

## 2. Audit trail — audit_log append-only

**Implementacion:** migraciones en `supabase/migrations/`

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

- Tabla `processed_events` tambien append-only (idempotencia de webhooks).

- **pgTAP** verifica que UPDATE y DELETE en audit_log y processed_events lanzan error 42501.

---

## 3. PII en analytics — scrubPII() verificado

**Implementacion:** `packages/core/src/analytics/index.ts`

La funcion `scrubPII()` elimina antes de enviar a PostHog:
- `email`, `phone`, `name`, `full_name`, `first_name`, `last_name`, `dni`, `cuit`, `address`

**Cobertura:** tests unitarios en `analytics/__tests__/analytics.test.ts`, 100% de ramas cubiertas.

Ningun evento de analytics contiene datos de identidad personal. Los user IDs enviados son UUIDs opacos (auth.uid).

---

## 4. Consentimiento parental (menores de 18)

**Implementacion:** `packages/core/src/schemas/auth.ts` (isMinor(), isMinorWithoutConsent()) + onboarding mobile + checkout web

Flujo:
1. Alumno ingresa fecha de nacimiento en onboarding
2. `isMinor(dob)` devuelve true si edad < 18
3. Si isMinor: se muestra formulario de consentimiento parental en onboarding
4. `parental_consent_at` se guarda en `student_profiles`
5. En `/api/checkout` (coach packages) y la Edge Function: si `parental_consent_at IS NULL` → HTTP 403
6. Desvio aprobado por el owner (2026-06-16): la misma restriccion aplica a la compra PRO

**Cobertura:** auth.test.ts incluye tests de `isMinor()` e `isMinorWithoutConsent()`.

**Pendiente HUMAN_REQUIRED:** verificar el 403 contra Supabase cloud cuando la DB este sincronizada (ver GO-LIVE.md).

---

## 5. Webhooks idempotentes — processed_events

**Implementacion:** migraciones en `supabase/migrations/`

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

---

## 6. Buckets privados — 4 buckets, 0 URLs publicas

**Implementacion:** migracion de storage en `supabase/migrations/`

| Bucket | Contenido | public |
|---|---|---|
| progress-photos | Fotos de progreso corporal del alumno | false |
| fiscal-docs | Constancias de inscripcion del coach | false |
| invoices | PDFs de facturas de settlements | false |
| videos | Videos de ejercicios | false |

Acceso: SOLO via URL firmada con TTL de 1 hora. Las URLs firmadas nunca se loguean ni se envian a analytics.

**pgTAP** verifica que los 4 buckets existen con `public = false`.

---

## 7. Validacion de firma webhook MP — IMPLEMENTADA

**Estado: IMPLEMENTADA Y VERIFICADA** (correccion del review del 2026-06-10 que la marcaba como TODO/RIESGO ALTO)

La firma HMAC-SHA256 en el header `x-signature` de MercadoPago esta validada en la Edge Function `mp-webhook`.
Ver evidencia en `docs/progress/HANDOFF.md` y `docs/runbooks/pagos.md`.

La variable `MP_WEBHOOK_SECRET` debe configurarse en Supabase Secrets del proyecto cloud (pendiente de deploy — ver GO-LIVE.md).

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
- Tests de billing: cobertura 98.42%; verifican que `commission + net === gross` (sin perdida de centavos)

---

## 10. Hardenings pendientes — RIESGO MEDIO

### 10.1 Dev-bypass de requireAdmin() demasiado permisivo

`apps/web/lib/auth/admin.ts`: si `NEXT_PUBLIC_SUPABASE_URL` falta o contiene "placeholder", entra en modo
mock SIN auth real (devuelve user ficticio `dev-admin-000` y client vacio). En staging/prod, una env
ausente o mal copiada activaria el bypass silenciosamente.

**Accion requerida (antes del go-live):** restringir el mock a `NODE_ENV === "development"` ademas del
check de URL; hacer `throw` si falta la var en prod/staging. Ver `docs/open-questions.md` entrada 2026-06-18.

### 10.2 Rate limiting faltante

El `middleware.ts` excluye todo `/api/` y la unica proteccion es `requireAdmin()` dentro de cada handler.
Sin rate limit, un owner autenticado puede disparar acciones financieras/legales en bucle.

**Rutas afectadas:** `/api/admin/*`, `/api/leads`, `/api/mp-preapproval`  
**Accion requerida (antes del go-live):** implementar rate limiter (Upstash Redis o Supabase Edge Function
rate limiter) y aplicarlo a todas las rutas listadas. Ver `docs/open-questions.md` entrada 2026-06-18.

---

## 11. Superficie de ataque adicional — notas

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

---

## Checklist pre-produccion de seguridad

- [x] Validacion HMAC en mp-webhook (implementada — verificar con MP_WEBHOOK_SECRET en Supabase Secrets)
- [x] Webhooks idempotentes (processed_events — 63 tests pgTAP PASS)
- [x] RLS en todas las tablas (~36 tablas — 63 assertions pgTAP PASS)
- [x] Buckets privados (4 buckets, public=false verificado)
- [x] PII fuera de analytics (scrubPII verificado)
- [ ] Configurar MP_WEBHOOK_SECRET en Supabase Secrets del proyecto cloud
- [ ] Endurecer dev-bypass de requireAdmin() (ver seccion 10.1)
- [ ] Implementar rate limiting en /api/admin/*, /api/leads, /api/mp-preapproval (ver seccion 10.2)
- [ ] Ejecutar `pnpm test:rls` contra DB cloud post-sync (actualmente 63 PASS en local)
- [ ] Audit de URLs firmadas: confirmar TTL=1h en todos los buckets
- [ ] Penetration test basico: intentar acceso cruzado entre dos usuarios de prueba
- [ ] Revisar headers de seguridad en Next.js (CSP, HSTS, X-Frame-Options) via next.config.ts
- [ ] Revisar logs de Supabase post-deployment: 0 errores 42501 inesperados
