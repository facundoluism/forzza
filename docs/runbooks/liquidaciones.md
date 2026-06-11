# Runbook — Liquidaciones quincenales a coaches

## Contexto

Forzza actúa como merchant of record: cobra el paquete completo al alumno y retiene la comisión (20%, leída de `country_config`). El neto se transfiere al coach contra factura aprobada. El ciclo es quincenal: días 1 y 16 de cada mes (o siguiente día hábil si cae en fin de semana).

---

## 1. Proceso de liquidación quincenal

### 1.1 Generación automática

El Edge Function `create-settlement` se ejecuta automáticamente en el cierre del período. Si falla, ejecutar manualmente:

```bash
# Invocar el Edge Function directamente (requiere Supabase activo)
supabase functions invoke create-settlement --body '{"period":"2026-06-01/2026-06-15"}'
```

El Edge Function:
1. Suma todos los `payments` del período con `status = succeeded` por coach.
2. Calcula `gross_amount`, `commission_amount` (20%), `net_amount`.
3. Inserta en `settlements` con `status = pending_invoice`.
4. Envía notificación N11 a cada coach afectado.

### 1.2 Verificar las liquidaciones generadas

En el backoffice del dueño (`/admin/finanzas`) o directamente en la DB:

```sql
SELECT
  s.id,
  u.email AS coach_email,
  s.gross_amount,
  s.commission_amount,
  s.net_amount,
  s.status,
  s.period_start,
  s.period_end
FROM settlements s
JOIN users u ON u.id = s.coach_id
WHERE s.period_start = '2026-06-01'
ORDER BY s.net_amount DESC;
```

---

## 2. Validación de facturas

### 2.1 El coach carga la factura

El coach sube el PDF de la factura y el número desde el backoffice (`/coach/cobros`). El sistema valida:
- Número de factura único (no registrado anteriormente).
- Monto de la factura coincide con el `net_amount` de la liquidación.

Si el monto no coincide, el coach recibe error inline. No se puede cargar una factura con monto diferente al neto.

### 2.2 Aprobación por el dueño

En `/admin/finanzas`:

1. Revisar la factura PDF (preview en modal; URL firmada con TTL 1h).
2. Verificar que el número de comprobante sea válido y el monto correcto.
3. Aprobar o rechazar con motivo (obligatorio si se rechaza).

Al aprobar, el sistema:
- Cambia `settlements.status` a `approved`.
- Envía notificación N12 al coach.

Al rechazar:
- `settlements.status` pasa a `invoice_rejected`.
- Envía notificación N13 con el motivo.
- El coach puede volver a cargar una factura corregida.

**Regla innegociable**: sin `invoice_approved_at` no puede existir `status = transferred`. El trigger DB rechaza cualquier UPDATE directo.

---

## 3. Ejecución de la transferencia

La transferencia en V1 es **manual** (el dueño transfiere desde su banco o billetera). El proceso es:

1. Exportar el listado de liquidaciones aprobadas del período desde `/admin/finanzas`.
2. Ejecutar las transferencias bancarias al alias/CBU de cada coach (datos en `coach_bank_accounts`).
3. Una vez confirmada cada transferencia, marcar como transferida en el sistema:

```bash
# Desde el backoffice: clic en "Marcar como transferido" en cada liquidación
# O manualmente si el backoffice falla:
supabase sql --query "
  UPDATE settlements
  SET status = 'transferred', transferred_at = NOW()
  WHERE id = '<settlement_id>'
  AND status = 'approved'
  AND invoice_approved_at IS NOT NULL;
"
```

El trigger verifica que `invoice_approved_at IS NOT NULL` antes de aceptar el UPDATE a `transferred`.

4. El sistema envía notificación N12 (transferencia confirmada) al coach automáticamente vía trigger.

---

## 4. Registro de auditoría

Toda acción financiera queda en `audit_log` (append-only). Para consultar el historial de una liquidación:

```sql
SELECT action, actor_id, metadata, created_at
FROM audit_log
WHERE metadata->>'settlement_id' = '<settlement_id>'
ORDER BY created_at ASC;
```

---

## 5. Disputas y correcciones

### 5.1 El coach disputa el monto de una liquidación

1. El coach abre un ticket de soporte desde el backoffice (`/coach/soporte`).
2. El dueño revisa los `payments` del período en `/admin/finanzas`.
3. Si hay un error (pago no incluido, pago duplicado), corregir manualmente:

```sql
-- Solo en casos excepcionales, con aprobación del dueño y registro en audit_log
-- Nunca actualizar settlements directamente; crear un settlement de ajuste:
INSERT INTO settlements (coach_id, gross_amount, commission_amount, net_amount, period_start, period_end, status, notes)
VALUES ('<coach_id>', <ajuste>, <comisión>, <neto>, '<fecha>', '<fecha>', 'pending_invoice', 'Ajuste por disputa ticket #<id>');
```

4. Notificar al coach del ajuste y solicitar nueva factura.

### 5.2 Contracargo (chargeback)

Al recibir notificación N22 (contracargo):

1. El pago en disputa aparece en `/admin/finanzas` marcado como `chargeback`.
2. Suspender temporalmente el paquete del alumno hasta resolución.
3. Si MP falla la disputa (pierde Forzza): descontar el monto del próximo ciclo de liquidación del coach involucrado.
4. Si MP gana la disputa: restaurar el paquete y la liquidación.

---

## 6. Coaches con constancia vencida

Si el `fiscal_status` de un coach pasa a `expired` durante el ciclo, sus liquidaciones se bloquean:
- Los pagos del período quedan acumulados pero no se genera el settlement.
- El coach recibe aviso para renovar su constancia.
- Una vez reaprobada (`fiscal_status = approved`), ejecutar manualmente `create-settlement` para el período bloqueado.

---

## 7. Objetivo de tiempos

| Hito | Objetivo V1 |
|------|-------------|
| Generación de settlement | Automático en el día de cierre del período |
| Coach carga factura | ≤3 días hábiles post-notificación |
| Dueño aprueba factura | ≤2 días hábiles |
| Transferencia ejecutada | ≤2 días hábiles post-aprobación |
| **Total liquidación→transferencia** | **≤7 días** |
