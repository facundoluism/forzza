# Fase 1 — Auditoría de schema y corrección de edge functions
Fecha: 2026-06-14
Agente: supabase-rls-engineer

## Resumen ejecutivo

Divergencia masiva entre db-types (escrito a mano) y las migraciones SQL reales. Se corrigieron
todos los archivos para que reflejen el schema real como fuente de verdad.

---

## TAREA 1: Nueva migración — PASS

Archivo: `supabase/migrations/20260615000001_add_missing_columns.sql`

Columnas agregadas:
- `country_config.pro_monthly_price_cents` INTEGER NOT NULL DEFAULT 999900
- `country_config.currency_code` TEXT NOT NULL DEFAULT 'ARS'
- `subscriptions.plan` TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','pro','elite'))
- `coach_profiles.cbu` TEXT
- `coach_profiles.alias_cbu` TEXT
- `coach_profiles.years_experience` INTEGER

Se actualizaron los valores por país (AR: 999900/ARS, CL: 9990000/CLP).

---

## TAREA 2: Reescritura de db-types — PASS

Archivo: `packages/db-types/src/index.ts`

### Tablas ELIMINADAS (fantasmas, no existen en migraciones):
- `conversations` — eliminada
- `routine_exercises` — eliminada (routines usa JSONB)
- `checkin_questions` — eliminada (checkin_templates usa JSONB)
- `ticket_messages` — eliminada

### Tablas AGREGADAS (existían en migraciones, faltaban en db-types):
- `body_metrics`
- `progress_photos`
- `leads`

### Correcciones por tabla:

| Tabla | Problema | Fix |
|---|---|---|
| `country_config` | PK era `country_code`, + faltaban `pro_monthly_price_cents`, `currency_code` | PK corregido a `country`; columnas agregadas |
| `coach_profiles` | Tenía `constancia_url` (no existe en DB), faltaban `cbu`, `alias_cbu`, `years_experience` | Eliminada `constancia_url`; agregadas 3 columnas nuevas |
| `coach_packages` | Tenía `name`, `price_cents`, `billing_type`, `features`, `is_active` (inexistentes) | Corregido a `tier`, `title`, `price`, `active`, `country` |
| `payments` | Tenía `payer_id`, `payee_id`, `amount_cents`, `currency_code`, `provider`, `provider_payment_id` | Corregido a `user_id`, `coach_id`, `amount`, `currency`, `gateway`, `gateway_payment_id`, `metadata` |
| `subscriptions` | Tenía `provider`, `provider_subscription_id`, `started_at`, `expires_at`; faltaban `platform`, `gateway`, `gateway_subscription_id`, `current_period_start`, `current_period_end`, `plan` | Completamente reescrita con columnas reales |
| `processed_events` | Tenía `provider`, `event_type`, `payload` | Corregido a `event_id`, `gateway`, `processed_at` |
| `routines` | Tenía `name` (no title), faltaban `description`, `exercises` JSONB, `active` | Corregido |
| `workout_sessions` | Tenía `finished_at`, `notes`; faltaban `client_uuid`, `completed_at`, `sets_data` | Corregido |
| `settlements` | Tenía `gross_amount_cents`, `commission_amount_cents`, `net_amount_cents` | Corregido a `gross_amount`, `commission`, `net_amount`, + `currency`, `invoice_number`, `invoice_path`, `transferred_at` |
| `notifications` | Tenía `metadata` | Corregido a `data` |
| `audit_log` | Tenía `metadata` adicional junto a `payload` | Eliminada `metadata`; solo `payload` |
| `messages` | Tenía `conversation_id`, `body` | Corregido a `assignment_id`, `content` |
| `promoters` | Tenía `code`, `total_referrals`, `updated_at` (no existen) | Corregido a `referral_code`; eliminados campos inexistentes |
| `coach_assignments` | Tenía `routine_id` (no existe en migración) | Eliminado `routine_id`; agregados `payment_id`, `refunded_at` |
| `exercise_library` | Tenía `muscle_group TEXT`, `equipment TEXT` (singular/string) | Corregido a `muscle_groups TEXT[]`, `equipment TEXT[]` |
| `checkin_templates` | Tenía `name` (no title), faltaban `questions JSONB`, `active` | Corregido a `title`; agregados campos reales |
| `checkin_responses` | Faltaba `assignment_id` (NOT NULL en migración) | Agregado |

### Enums corregidos:
- Eliminados: `BillingType`, `PaymentProvider`, `QuestionType`, `TicketStatus` (no son enums de DB)
- Agregados: `LegalEntityType`, `NotificationChannel` (sí están en CREATE TYPE)
- `SubscriptionStatus`: removidos valores inventados (`pending`, `suspended`, `expired`, `cancelled`)
- `PaymentStatus`: removido valor inventado (`completed`)

---

## TAREA 3: Corrección de edge functions con queries rotos — PASS

### A) `supabase/functions/notify/index.ts`
| Bug | Fix |
|---|---|
| `.from("users").select("email, full_name")` — email y full_name no existen en users | Usa `supabase.auth.admin.getUserById()` para el email |
| Nombre del usuario hardcodeado de users | Busca en `student_profiles.display_name` y `coach_profiles.display_name` en paralelo |
| `notifications.insert({ metadata: ... })` | Cambiado a `data:` |

### B) `supabase/functions/coach-checkout/index.ts`
| Bug | Fix |
|---|---|
| `.select("id, name, price_cents, billing_type, ...")` | Cambiado a `id, title, price, active, country, coach:coach_profiles(...)` |
| `.eq("is_active", true)` | Cambiado a `.eq("active", true)` |
| `coachPackage.price_cents / 100` (doble división) | Usa `coachPackage.price` como cents; divide solo al pasar a MP |
| `.eq("country_code", countryCode)` en country_config | Cambiado a `.eq("country", countryCode)` |
| `mpBody.reason` usaba `coachPackage.name` | Cambiado a `coachPackage.title` |
| `payments.insert({ payer_id, payee_id, amount_cents, currency_code, provider, provider_payment_id })` | Cambiado a `user_id, coach_id, amount, currency, gateway, gateway_payment_id` |
| `audit_log.insert({ metadata: ... })` | Cambiado a `payload:` |

### C) `supabase/functions/mp-create-preapproval/index.ts`
| Bug | Fix |
|---|---|
| `.select("email, country_code")` de users | Cambiado a `.select("country")`; email se lee de `user.email` (auth) |
| `.eq("country_code", ...)` en country_config | Cambiado a `.eq("country", ...)` |
| `subscriptions.upsert({ plan, provider, provider_subscription_id, started_at, expires_at })` | Cambiado a `plan, platform, gateway, gateway_subscription_id, current_period_start, current_period_end` |

---

## TAREA 4: Verificación y corrección de las otras 7 edge functions — PASS

### check-entitlements
| Bug | Fix |
|---|---|
| `.select("email, country_code")` de users (no existe) | Eliminado — esta función no necesita ese dato |
| `.eq("country_code", ...)` en country_config | Eliminado — esta función no consulta country_config |
| `.gte("expires_at", ...)` en subscriptions | Cambiado a `.gte("current_period_end", ...)` |
| `.select("plan, status, expires_at")` | Cambiado a `plan, status, current_period_end` |

### checkin-reminder
| Bug | Fix |
|---|---|
| Llamada a notify con campo `metadata:` | Cambiado a `data:` |
| Tablas accedidas (checkin_templates, checkin_responses, coach_assignments) | OK, nombres correctos |

### coach-refund
| Bug | Fix |
|---|---|
| `.select("id, provider_payment_id")` de payments | Cambiado a `id, gateway_payment_id` |
| `.eq("payer_id", ...)`, `.eq("payee_id", ...)` | Cambiado a `.eq("user_id", ...)`, `.eq("coach_id", ...)` |
| `.eq("status", "completed")` | Cambiado a `.eq("status", "approved")` (valor del enum real) |
| `status: "cancelled"` en coach_assignments | Cambiado a `"canceled"` (valor del enum real) |
| `notifications.insert({ metadata: ... })` (x2) | Cambiado a `data:` |
| `audit_log.insert({ metadata: ... })` | Cambiado a `payload:` |

### dunning-cron
| Bug | Fix |
|---|---|
| `.lt("expires_at", now)` | Cambiado a `.lt("current_period_end", now)` |
| `status: "expired"` (no existe en enum) | Cambiado a `"canceled"` |
| `.eq("status", "suspended")` (no existe en enum) | Cambiado a `"past_due"` |
| `status: "cancelled"` (no existe en enum) | Cambiado a `"canceled"` |
| `audit_log.insert({ metadata: ... })` | Cambiado a `payload:` |

### generate-settlements
| Bug | Fix |
|---|---|
| `.select("payee_id, amount_cents, ...")` | Cambiado a `coach_id, amount` |
| `.not("payee_id", "is", null)` | Cambiado a `.not("coach_id", "is", null)` |
| `acc[key].total += p.amount_cents` | Cambiado a `p.amount` |
| `.eq("country_code", ...)` en country_config | Cambiado a `.eq("country", ...)` |
| `settlements.insert({ gross_amount_cents, commission_amount_cents, net_amount_cents })` | Cambiado a `gross_amount, commission, net_amount, currency` |
| `audit_log.insert({ metadata: ... })` | Cambiado a `payload:` |
| `status: "completed"` en payments filter | Cambiado a `"approved"` |
| period_start/end como ISO timestamps (incompatibles con DATE column) | Cambiado a formato DATE `YYYY-MM-DD` |

### mp-assignment-webhook
| Bug | Fix |
|---|---|
| `processed_events.insert({ provider: "mercadopago_assignment", event_type, payload })` | Cambiado a `gateway: "mercadopago_assignment"` (solo event_id y gateway) |
| `.eq("provider", ...)` en processed_events | Cambiado a `.eq("gateway", ...)` |
| `.select("id, payer_id, payee_id, metadata")` de payments | Cambiado a `id, user_id, coach_id, metadata` |
| `.eq("provider_payment_id", ...)` en payments | Cambiado a `.eq("gateway_payment_id", ...)` |
| `coach_id: payment.payee_id`, `student_id: payment.payer_id` | Cambiado a `coach_id: payment.coach_id`, `student_id: payment.user_id` |
| `status: "completed"` en payment | Cambiado a `"approved"` |
| `notifications.insert({ metadata: ... })` | Cambiado a `data:` |
| `audit_log.insert({ metadata: ... })` | Cambiado a `payload:` |

### mp-webhook
| Bug | Fix |
|---|---|
| `processed_events.insert({ provider: ..., event_type, payload })` | Cambiado a `gateway:` (solo event_id y gateway) |
| `.eq("provider", ...)` en processed_events | Cambiado a `.eq("gateway", ...)` |
| `.eq("provider_subscription_id", ...)` en subscriptions | Cambiado a `.eq("gateway_subscription_id", ...)` |
| `subscriptions.update({ started_at, expires_at })` | Cambiado a `current_period_start, current_period_end` |
| `statusMap: "cancelled" → "cancelled"` (valor inválido) | Cambiado a `"canceled"` |
| `statusMap: "paused" → "suspended"` (valor inválido) | Cambiado a `"past_due"` |
| `statusMap: "pending" → "pending"` (valor inválido) | Cambiado a `"trialing"` |
| `audit_log.insert({ metadata: ... })` | Cambiado a `payload:` |

---

## TAREA 5: Typecheck

PENDIENTE — requiere Docker + Supabase local corriendo para `pnpm db:types`.
Los tipos están sincronizados manualmente con las migraciones.
Para verificar: `pnpm typecheck` (requiere entorno activo).

---

## Pendientes / HUMAN_REQUIRED

1. Correr `pnpm db:reset` y `pnpm db:types` con Docker activo para regenerar tipos desde la DB real.
2. Correr `pnpm typecheck` y `pnpm test:rls` para confirmar verde.
3. Verificar que el código en apps/web y apps/mobile que use los tipos de db-types compile sin errores
   (especialmente referencias a columnas renombradas como `expires_at` → `current_period_end`,
   `payer_id` → `user_id`, `name` → `title` en coach_packages, `metadata` → `data` en notifications).
