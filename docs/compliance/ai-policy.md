# Política de Inteligencia Artificial — Forzza

> **BORRADOR — Documento preliminar.**  
> Este documento es la copia canónica de la Política de IA de Forzza, para edición por parte del equipo de producto y revisión legal.  
> **HUMAN_REQUIRED — validación legal:** Los textos aquí incluidos no constituyen consejo legal y deben ser revisados y formalizados por un abogado matriculado antes del go-live público.  
> El contenido de este archivo es la fuente de verdad; se replica en `apps/web/messages/{es,en}.json` bajo el namespace `legal.aiPolicy`.  
> Última actualización: 22 de junio de 2026.

---

## 1. Estado actual: sin IA en producción

A la fecha de actualización de este documento, Forzza **no utiliza** sistemas de inteligencia artificial ni de aprendizaje automático en producción para analizar, procesar ni generar contenido relacionado con datos de salud, fotos corporales ni información personal de los usuarios.

El flag de escáner corporal por IA (`AI_BODY_SCAN`) se encuentra **desactivado** en la configuración de la plataforma (`packages/config/src/index.ts`).

---

## 2. Uso futuro planificado

Cuando se activen funcionalidades de IA (lo que se comunicará con aviso previo y actualización de esta política), estas serán de carácter **asistivo y orientativo**:

- **Escáner corporal por IA:** análisis de fotos de progreso corporal para estimar métricas automáticamente (composición corporal, evolución visual).
- Toda salida de IA estará sujeta a **revisión humana del coach** antes de ser comunicada al alumno.
- Las sugerencias de IA se presentarán como estimaciones orientativas, **no como diagnósticos médicos**.

**Antes de activar cualquier funcionalidad de IA que procese datos de salud:**
- Se actualizará esta política y su reflejo en i18n.
- Se solicitará **consentimiento expreso adicional** del usuario.
- Se realizará una **evaluación de impacto en la privacidad (PIA/DPIA)**.
- Se listará el proveedor de IA externo (si aplica) en la Política de Privacidad.

[PENDIENTE — validación legal: verificar si la PIA es requerida bajo Ley 25.326 o resoluciones AAIP vigentes. Para GDPR art. 35, el procesamiento de datos biométricos o de salud a gran escala requiere DPIA obligatoria.]

---

## 3. Lo que la IA de Forzza nunca hará

Con o sin activación de IA, Forzza se compromete a que sus sistemas de inteligencia artificial nunca:

- Diagnosticarán, tratarán, curarán ni prescribirán tratamientos médicos, nutricionales ni de salud mental.
- Reemplazarán el juicio de un profesional de la salud habilitado.
- Garantizarán resultados físicos o deportivos.
- Usarán fotos corporales, métricas de salud ni datos personales para **entrenar modelos de IA** de Forzza ni de terceros.
- **Venderán ni compartirán** datos de usuarios con fines de entrenamiento de IA externo.

---

## 4. Datos que procesaría la IA (cuando se active)

| Dato | Finalidad IA | Almacenamiento | Tercero |
|---|---|---|---|
| `progress_photos` (bucket privado) | Estimar composición corporal | Bucket privado con URL firmada TTL 1h | Por definir [PENDIENTE] |
| `body_metrics.weight_g`, `.height_mm`, `.body_fat_pct` | Calibrar estimaciones | Solo lectura, sin copia a terceros | Por definir [PENDIENTE] |

**Principios de minimización de datos aplicados:**
- Solo se procesarán los datos estrictamente necesarios para la función específica.
- El acceso estará limitado al alumno titular y a su coach contratado activo.
- No se transferirán datos a proveedores de IA sin consentimiento expreso adicional del usuario.

---

## 5. Sin garantía de resultados

Las estimaciones y sugerencias generadas por IA son orientativas y se basan en modelos estadísticos. Pueden contener errores. No son un sustituto del criterio de un profesional de la salud.

Forzza no se responsabiliza por decisiones tomadas en base exclusiva a salidas de IA sin supervisión profesional.

---

## 6. Base legal para el procesamiento por IA

Cuando se active la IA, la base legal para el procesamiento de datos de salud será:

- **Consentimiento expreso e informado** del titular (Ley 25.326, art. 5 inc. b para datos sensibles).
- Para usuarios EU: **consentimiento explícito** (GDPR art. 9.2.a) para el procesamiento de datos biométricos/salud.

[PENDIENTE — validación legal: confirmar base legal antes de activar. Considerar si el "interés legítimo" puede aplicar a datos de salud — generalmente NO bajo Ley 25.326 para datos sensibles.]

---

## 7. Contacto y reclamos

Para consultas sobre el uso de IA en Forzza: **privacidad@forzza.app**

---

## Historial de cambios

| Fecha | Versión | Cambio | Autor |
|---|---|---|---|
| 2026-06-22 | 0.1 | Versión inicial DRAFT | Forzza Team |

---

> **Nota de sincronización:** Cualquier cambio a este documento debe replicarse en:  
> - `apps/web/messages/es.json` → `legal.aiPolicy.sections`  
> - `apps/web/messages/en.json` → `legal.aiPolicy.sections`  
> La página web `/legales/ia` toma el contenido directamente del i18n.
