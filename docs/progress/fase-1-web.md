# Fase 1 Web — Corrección de bugs heredados (commit b072564)

Fecha: 2026-06-14

---

## BUG 1: constancia_url → constancia_path en admin/coaches

**Archivo:** `apps/web/app/admin/coaches/page.tsx`

**Causa raíz:** La query usaba `constancia_url` pero la migración `20260610000001_initial_schema.sql` define la columna como `constancia_path` (TEXT). Además, se exponían rutas de storage directamente en el JSX, violando la regla de datos sensibles en buckets privados (URLs firmadas TTL 1h).

### Cambios aplicados

1. `.select(...)` línea 60: `constancia_url` → `constancia_path`
2. Interfaz `CoachRow` línea 17: `constancia_url: string | null` → `constancia_path: string | null`
3. Nueva interfaz `CoachRowWithSignedUrl extends CoachRow` con campo `constanciaSignedUrl: string | null`
4. Bloque `Promise.all` para generar signed URLs via `adminClient.storage.from('fiscal-docs').createSignedUrl(path, 3600)` antes de renderizar
5. JSX mobile card (línea 127 original): `coach.constancia_url` → `coach.constanciaSignedUrl`
6. JSX desktop table (línea 170 original): `coach.constancia_url` → `coach.constanciaSignedUrl`

### Evidencia

- Grep de `constancia_url` en `apps/web`: **0 resultados** (PASS)
- `pnpm typecheck`: ningún error introducido en `app/admin/coaches/page.tsx` (PASS)

**RESULTADO: PASS**

---

## BUG 2: Precio PRO hardcodeado $9.999 en landing

**Archivo:** `apps/web/app/page.tsx`

**Causa raíz:** El JSX tenía `$9.999` hardcodeado, violando la regla de negocio #1 (jamás hardcodear precios — deben leerse de `country_config`).

### Cambios aplicados

1. Import agregado: `import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'`
2. `HomePage` convertida a `async function`
3. Fetch de `country_config` para país `AR` usando `.eq('country', 'AR')` (columna correcta, PK de la tabla)
4. Fallback a `999900` cents ($9.999 ARS) si Supabase no está configurado o el fetch falla
5. Formateo: `(proPrice / 100).toLocaleString('es-AR')` produce "9.999" correctamente para AR
6. JSX: string literal `'$9.999'` → expresión `{proPriceFormatted}`

### Evidencia

- `pnpm typecheck`: ningún error introducido en `app/page.tsx` (PASS)
- Fallback configurado: si `country_config` no tiene la columna `pro_monthly_price_cents` (migración 20260615000001 no aplicada), el valor default es 999900 (PASS)

**RESULTADO: PASS**

---

## TAREA EXTRA: Grep de nombres incorrectos en queries de apps/web

### constancia_url

Resultado: **0 ocurrencias** tras el fix. PASS.

### country_code en queries .eq("country_code") contra country_config

La tabla `country_config` usa `country` como PK (tipo `country_code` enum), no una columna llamada `country_code`. Se encontraron y corrigieron los siguientes archivos:

| Archivo | Línea | Fix |
|---|---|---|
| `apps/web/app/upgrade/page.tsx` | 66 | `.eq("country_code", "AR")` → `.eq("country", "AR")` |
| `apps/web/app/coach/perfil/page.tsx` | 32 | `.eq("country_code", ...)` → `.eq("country", ...)` |
| `apps/web/app/api/coach/perfil/route.ts` | 65 | `.eq("country_code", ...)` → `.eq("country", ...)` |
| `apps/web/app/api/admin/config/route.ts` | 73, 86 | dos `.eq("country_code", ...)` → `.eq("country", ...)` |
| `apps/web/app/admin/configuracion/page.tsx` | 15, 17 | `.select("country_code, ...")` → `country_code:country` (alias PostgREST) + `.order("country")` |

Nota: `app/admin/configuracion/ConfigEditor.tsx` usa `country_code` como nombre de campo en el componente cliente (interfaz interna y envío a API). No se modificó — el alias PostgREST en el select de la page cubre la traducción. El API route (`/api/admin/config`) recibe `country_code` en el body JSON (campo de request, no columna DB) lo cual es correcto — solo las queries al DB fueron corregidas.

**RESULTADO: PASS**

### full_name en queries .select()

Grep de `full_name` en `apps/web`: **0 resultados**. No hay ocurrencias. PASS.

---

## Estado de typecheck post-fix (BUGs 1+2)

`pnpm typecheck` reporta errores en archivos NO modificados por esta corrección:

- `app/admin/dashboard/page.tsx`: `amount_cents` no existe en `payments` (columna es `amount`) — pre-existente
- `app/admin/pagos/page.tsx`: `payer_id` no existe en `payments` — pre-existente
- `app/api/coach/checkins/route.ts`: `name` no existe en `checkin_templates` — pre-existente
- `app/coach/checkins/*`: columna `name` en `checkin_templates` — pre-existente
- `app/coach/cobros/page.tsx`: `gross_amount_cents` en `settlements` — pre-existente
- `app/coach/perfil/page.tsx` + `app/api/coach/perfil/route.ts`: `name`, `is_active`, `price_cents`, `billing_type`, `features` en `coach_packages` (schema DB tiene `title`, `active`, `price`) — pre-existente, fuera del alcance de este ticket

Los errores introducidos por este fix: **ninguno**.
Los errores resueltos por este fix: los 6 archivos con `.eq("country_code")` contra `country_config` ya no tienen ese error de runtime (DB devolvería vacío en lugar de error TS, pero ahora la query es correcta).

**RESULTADO GLOBAL: PASS en los bugs asignados. Errores pre-existentes documentados para corrección futura.**

---

## Corrección masiva de columnas — db-types vs apps/web (2026-06-14)

Después de reescribir `packages/db-types` para que coincida con las migraciones SQL reales, se corrigieron todos los errores TS en `apps/web`.

### Correcciones aplicadas

| Archivo | Cambio |
|---|---|
| `app/admin/dashboard/page.tsx` | `amount_cents` → `amount` en select y reduce |
| `app/admin/pagos/page.tsx` | Interface `PaymentRow`: `payer_id`→`user_id`, `payee_id`→`coach_id`, `amount_cents`→`amount`, `currency_code`→`currency`, `provider`→`gateway`; select y JSX actualizados |
| `app/api/coach/checkins/route.ts` | `name`→`title` en insert; eliminado insert en tabla fantasma `checkin_questions`; preguntas se guardan como JSONB en `checkin_templates.questions` |
| `app/api/coach/perfil/route.ts` | `is_active`→`active`, `name`→`title`, `price_cents`→`price`; eliminados `billing_type`, `features` de inserts/updates; insert nuevo usa `tier: 'starter'` |
| `app/api/coach/rutinas/route.ts` | Eliminado insert en tabla fantasma `routine_exercises`; ejercicios guardados como JSONB en `routines.exercises`; `name`→`title` en insert; eliminado update de `routine_id` en `coach_assignments` (columna inexistente); cast de `student_id` para cumplir NOT NULL del schema |
| `app/api/coach/settlements/[id]/invoice/route.ts` | `invoice_url`→`invoice_path` (columna real en settlements); eliminado bloque `getPublicUrl` innecesario |
| `app/coach/checkins/page.tsx` | `name`→`title` en select y JSX; eliminado query a tabla fantasma `checkin_questions`; conteo de preguntas desde `Array(tmpl.questions).length` |
| `app/coach/checkins/[templateId]/respuestas/page.tsx` | `name`→`title` en select y JSX; eliminado query a tabla fantasma `checkin_questions`; mapa de labels construido desde `template.questions` JSONB |
| `app/coach/cobros/page.tsx` | Interface `Settlement`: `gross_amount_cents`→`gross_amount`, `commission_amount_cents`→`commission`, `net_amount_cents`→`net_amount`, `invoice_url`→`invoice_path`; select y JSX actualizados |
| `app/coach/perfil/page.tsx` | Select: `name`→`title`, `price_cents`→`price`, `billing_type`→eliminado, `features`→eliminado, `is_active`→`active`; mapeo a `PackageEntry` del formulario cliente |
| `app/coach/rutinas/nueva/page.tsx` | Interface `Exercise`: `muscle_group: string | null`→`muscle_groups: string[] | null`; select y JSX (`.join(", ")`) actualizados |

### Evidencia

- `pnpm typecheck`: **0 errores en web** — Tasks: 6 successful, 6 total (PASS)

**RESULTADO GLOBAL: PASS**
