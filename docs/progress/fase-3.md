# Fase 3 — Web V1 completion

Fecha: 2026-06-14

## TAREA 1: Checkout de paquetes de coach vía Mercado Pago en web

**PASS**

- Archivo reemplazado: `apps/web/app/coaches/[coachId]/checkout/page.tsx`
- Nuevo archivo: `apps/web/app/coaches/[coachId]/checkout/CheckoutClient.tsx`
- El deep-link a la app móvil fue eliminado (violaba Regla #3).
- Server Component verifica:
  - Autenticación: si no hay sesión, redirige a `/login?redirect=...`
  - Regla #7 (menor sin `parental_consent_at`): flag `isMinorWithoutConsent` → error 403 inline en UI
  - Coach aprobado: si `status !== "approved"`, error inline
  - Paquete activo: si `active = false` o no existe, error inline
- Client Component (`CheckoutClient`) hace POST a `${NEXT_PUBLIC_SUPABASE_URL}/functions/v1/coach-checkout` con `Authorization: Bearer token`
- Si la edge function devuelve `{init_point}` → `window.location.href = init_point` (redirige a Mercado Pago)
- Estados: loading ("Redirigiendo a Mercado Pago..."), error inline (border rojo), success (redirect externo)
- Regla #3 cumplida: 100% web, sin deeplink a app.

## TAREA 2: `/coach/cobros` — Ver factura con signed URL

**PASS**

- Archivo modificado: `apps/web/app/coaches/../cobros/page.tsx`
- Nuevo archivo: `apps/web/app/coach/cobros/InvoiceViewButton.tsx`
- La tabla ahora:
  - Para `invoiced` / `transferred` con `invoice_path`: genera signed URL TTL 1h via `supabase.storage.from("invoices").createSignedUrl(path, 3600)` server-side
  - Muestra botón "Ver factura" (`InvoiceViewButton`) que abre la URL firmada en nueva pestaña
  - Si no hay signed URL: muestra "Factura pendiente"
  - Si `transferred_at` existe: muestra fecha de transferencia
- Empty state: "Todavía no hay liquidaciones." — PASS
- Error state: `console.error` + rows vacíos — PASS
- Regla #6 (sin factura no hay "transferido") aplicada en backend; UI solo muestra estado.
- Datos sensibles (facturas): bucket privado "invoices", signed URL TTL 1h, nunca en logs.

## TAREA 3: `/admin/pagos`

**PASS (ya estaba implementado)**

- Tabla completa con columnas: ID, Pagador, Beneficiario, Monto, Estado, Proveedor, Fecha
- Filtro por status en URL (`?status=`)
- Summary cards: Revenue total, Este mes, Transacciones
- Estados loading/empty/error presentes
- Filtros en URL — PASS criterio §12

## TAREA 4: `/admin/tickets`

**PASS (ya estaba implementado)**

- Lista de tickets con badge de estado, body truncado, fecha
- Filtro por status en URL
- Botón de cambio de estado via `TicketResolveButton` (client component con server action)
- Estados loading/empty presentes

## TAREA 5: Gráfico en `/coach/alumnos/[studentId]`

**PASS**

- Archivo modificado: `apps/web/app/coach/alumnos/[studentId]/page.tsx`
- TODO_CHART eliminado
- Query adicional: últimas 28 días de `workout_sessions` agrupadas por día (array de 28 valores)
- `LineChart` de `@forzza/ui/web` renderizado con `data={sessionCountsByDay}`, `width=600`, `height=80`, `showDots`
- Eje visual: etiquetas "Hace 4 semanas" y "Hoy"
- Empty state: si `hasChartData = false` → div con texto "Sin sesiones registradas en los últimos 28 días"

## Typecheck final

**PASS** — `pnpm typecheck` termina con 0 errores, 6 tasks successful.

```
Tasks:    6 successful, 6 total
Cached:    3 cached, 6 total
Time:    4.223s
```
