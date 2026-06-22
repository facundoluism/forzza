# Política UGC y Procedimiento de Takedown / Copyright — Forzza

> **Documento vivo.** Versión inicial: 2026-06-22. Actualizar ante cambios en superficies UGC, plazos o canales operativos.
> **HUMAN_REQUIRED — validación legal:** Este documento es un procedimiento operativo de soporte a los Términos de Servicio (`legal.terms` §5 y §6). No es consejo legal. Debe ser revisado por un abogado matriculado antes del go-live público.
> **Marco contractual:** Las obligaciones del usuario están en `legal.terms §5` (declaraciones de derechos) y `§6` (copyright/takedown). Este doc detalla el procedimiento operativo que las acompaña.

---

## 1. Superficies UGC — Mapa de contenido

Todas las superficies activas y planificadas donde un usuario puede subir contenido propio.

| Superficie | Bucket / Columna | Quién sube | Visibilidad | Estado |
|---|---|---|---|---|
| Imagen de perfil del coach | `coach-avatars` | Coach | **Público** — indexable por CDN y motores de búsqueda | Activo |
| Videos de ejercicios | `videos` | Coach | Privado — alumnos asignados al coach con assignment activo | Activo |
| Constancia fiscal (AFIP/SII) | `fiscal-docs` | Coach | Privado — solo coach dueño + owner | Activo |
| Facturas / PDFs fiscales | `invoices` | Coach | Privado — solo coach dueño + owner | Activo |
| Fotos de progreso corporal | `progress-photos` | Alumno | Privado — alumno + coach PRO/elite con assignment activo | Activo |
| Chat coach↔alumno | `messages.content` | Coach y alumno | Privado — solo las dos partes del assignment | Activo |
| Imágenes adicionales del coach ("más imágenes") | `[coach-gallery]` (sin definir) | Coach | **Sin definir** — ver `docs/open-questions.md` (entrada 2026-06-22) | Planeado — NO implementar hasta definir bucket, visibilidad y RLS |

> **Datos de retención y base legal:** ver `docs/compliance/data-map.md §5` para cada superficie.

---

## 2. Contenido prohibido

El usuario no puede subir contenido que:

| Categoría | Descripción |
|---|---|
| Ilegal | Infringe legislación argentina vigente (Ley 25.326, Ley 11.723 de propiedad intelectual, Código Penal) |
| Infractor de copyright | Usa material protegido (música, imágenes, videos, texto) sin autorización del titular |
| Ofensivo / discriminatorio | Contenido de odio, discriminación por género, raza, religión u orientación sexual; acoso o amenazas |
| Material sensible sin consentimiento | Fotos, videos o datos de terceros identificables sin su consentimiento explícito |
| Material de menores | Cualquier contenido que identifique a menores de edad sin el consentimiento del adulto responsable |
| Engañoso / fraudulento | Certificaciones, constancias o facturas falsificadas |
| Explícito | Material sexual explícito o pornográfico |
| Spam / publicidad no autorizada | Publicidad de servicios externos sin acuerdo con Forzza |

---

## 3. Declaración de derechos del que sube

Al subir cualquier contenido, el usuario **declara y garantiza** (conforme `legal.terms §5`):

1. Es el titular de los derechos de propiedad intelectual sobre el contenido, **o** cuenta con autorización expresa del titular para usarlo y sublicenciarlo en el contexto del servicio.
2. El contenido no infringe derechos de autor, marcas registradas ni derechos de imagen de terceros.
3. Tiene los consentimientos necesarios de toda persona identificable en el contenido (por ejemplo: en videos de ejercicios donde aparezcan terceros, o en fotos de progreso donde aparezca el coach).
4. Otorga a Forzza una licencia no exclusiva, mundial y libre de regalías, por el tiempo necesario para operar el servicio. La licencia se extingue al eliminar el contenido o cerrar la cuenta, sujeto a los plazos de retención legales.
5. Forzza no reclama propiedad sobre el contenido del usuario.

La declaración es exigible desde el momento del upload; el incumplimiento habilita el takedown y, en caso de reincidencia, la suspensión de cuenta (ver §5).

---

## 4. Procedimiento de notice-and-takedown

### 4.1 Canal de reclamos

| Parámetro | Valor |
|---|---|
| Email de reclamos | `legal@forzza.app` **HUMAN_REQUIRED: confirmar que este buzón existe y tiene responsable asignado antes del go-live** |
| Asunto sugerido | `[TAKEDOWN] <descripción breve>` |
| Idioma aceptado | Español (principal); inglés aceptado |
| Formulario en producto | **Pendiente P1.5 — implementar botón "Reportar contenido" en: (a) perfil del coach, (b) videos de ejercicios, (c) chat** |

### 4.2 Datos requeridos en un reclamo

El reclamante debe incluir en el email:

1. **Identificación del contenido infractor:** URL exacta o descripción de ubicación dentro de la plataforma (ej.: "perfil del coach X, imagen de portada").
2. **Identificación de la obra original:** descripción de la obra presuntamente infringida y, si existe, URL o referencia pública.
3. **Relación del reclamante con la obra:** titular de derechos, licenciatario exclusivo, representante autorizado (especificar).
4. **Declaración de buena fe:** "Declaro de buena fe que el uso del material descripto no está autorizado por el titular de los derechos, su agente o la ley."
5. **Datos de contacto:** nombre completo, email, teléfono opcional.
6. **Firma:** firma electrónica o manuscrita escaneada para reclamos formales.

> Reclamos anónimos o sin datos suficientes podrán ser desestimados, pero se registrarán en `audit_log` igualmente.

### 4.3 Plazos de respuesta

| Acción | Plazo | HUMAN_REQUIRED |
|---|---|---|
| Acuse de recibo al reclamante | 2 días hábiles desde recepción | Confirmar plazo con equipo legal |
| Evaluación inicial (¿reclamo completo y prima facie válido?) | 5 días hábiles | Confirmar plazo con equipo legal |
| Retiro cautelar del contenido (si el reclamo es válido prima facie) | 48 hs desde decisión de retiro cautelar | — |
| Notificación al usuario cuyo contenido se retira | Simultánea al retiro | — |
| Resolución final (con o sin restitución) | 15 días hábiles desde acuse | **HUMAN_REQUIRED: plazo a acordar con abogado** |

> Todos los plazos se cuentan en días hábiles de Argentina (lunes a viernes, sin feriados nacionales).

### 4.4 Proceso interno de evaluación

```
Reclamo recibido en legal@forzza.app
        │
        ▼
audit_log: registrar reclamo (event: 'ugc_takedown_received', payload: { claim_id, surface, content_ref })
        │
        ▼
¿Reclamo completo? ── No → Solicitar datos faltantes al reclamante (dentro de 2 días hábiles)
        │ Sí
        ▼
Evaluación prima facie por responsable de compliance
        │
   ┌────┴────┐
Válido     No válido
   │           │
   ▼           ▼
Retiro      Notificar rechazo con fundamento al reclamante
cautelar    (registrar en audit_log: 'ugc_takedown_rejected')
   │
   ▼
Notificar al usuario afectado (ver §4.5)
   │
   ▼
Período de contranotificación (10 días hábiles)
   │
   ┌────────────┴────────────┐
Con contranotificación   Sin contranotificación
   │                         │
   ▼                         ▼
Evaluar + decidir        Retiro definitivo
(posible restitución)    audit_log: 'ugc_takedown_confirmed'
```

### 4.5 Notificación al usuario afectado

Al retirar contenido cautelarmente, Forzza notifica al usuario por email (Resend) con:

- Descripción del contenido retirado.
- Motivo del retiro (infracción de §X de los Términos / reclamo de tercero).
- Instrucciones para presentar una contranotificación (ver §4.6).
- Plazo para hacerlo.

### 4.6 Contranotificación

El usuario cuyo contenido fue retirado puede presentar contranotificación a `legal@forzza.app` con:

1. Identificación del contenido retirado.
2. Declaración de buena fe de que el retiro fue un error o malentendido (con fundamento).
3. Consentimiento a someterse a la jurisdicción de los tribunales ordinarios de Buenos Aires.
4. Datos de contacto completos.

**HUMAN_REQUIRED: definir plazo de contranotificación (sugerido: 10 días hábiles) y consecuencias de cada resultado (restitución / retiro definitivo) con el equipo legal.**

---

## 5. Política de infractores reincidentes

Forzza aplica una política de terminación progresiva para usuarios que infringen derechos de terceros de forma repetida.

| Instancia | Acción | Plazo desde confirmación del reclamo |
|---|---|---|
| 1.ª infracción confirmada | Retiro del contenido + advertencia por email | Inmediato |
| 2.ª infracción confirmada (mismo o distinto reclamo) | Retiro del contenido + suspensión temporal de la capacidad de subir contenido (upload deshabilitado) | Inmediato |
| 3.ª infracción confirmada | Suspensión de cuenta + revisión para baja definitiva | Inmediato; revisión en 5 días hábiles |
| Baja definitiva | Eliminación de cuenta + anonimización 30 d (Edge Fn `anonymize-accounts`) | Según decisión de revisión |

> "Infracción confirmada" = reclamo evaluado como válido y sin contranotificación exitosa del usuario, o contranotificación desestimada.

Registro: cada instancia se registra en `audit_log` (event: `ugc_infraction_N`, `account_suspended`, `account_terminated`) para trazabilidad append-only.

**HUMAN_REQUIRED: los umbrales (2.ª, 3.ª infracción) y plazos de suspensión son una propuesta operativa. Validar con equipo legal.**

---

## 6. Moderación y visibilidad del contenido

### 6.1 Quién puede ver qué

| Contenido | Visible para | Mecanismo de control |
|---|---|---|
| Avatar del coach | Todos (público, sin autenticación) | Bucket `coach-avatars` público; indexable por CDN |
| Videos de ejercicios | Alumnos con assignment activo hacia ese coach | RLS en bucket `videos` |
| Fotos de progreso | Alumno + coach PRO/elite con assignment activo | RLS en bucket `progress-photos` |
| Chat coach↔alumno | Solo las dos partes del assignment | RLS en `messages` por `assignment_id` |
| Constancias / facturas | Coach dueño + owner | RLS en `fiscal-docs` / `invoices` |

### 6.2 Cómo se reporta contenido inapropiado

**Estado actual:** el único canal es `legal@forzza.app`.

**Pendiente P1.5 (implementación en producto):**

| Superficie | Acción requerida |
|---|---|
| Perfil del coach (avatar) | Botón "Reportar perfil" en vista pública del coach |
| Videos de ejercicios | Botón "Reportar video" en el reproductor |
| Chat | Botón "Reportar mensaje" por mensaje individual |
| Imágenes adicionales del coach | Definir al implementar la superficie (ver §1) |

Los reportes en producto deben:
1. Capturar: `reporter_user_id`, `content_type`, `content_ref` (URL o ID), `reason` (categoría), `description` libre opcional.
2. Insertar en una tabla `content_reports` (a crear) + registrar en `audit_log`.
3. Enviar notificación interna al owner (Resend o push) para revisión.
4. Confirmar al usuario reportante que el reporte fue recibido.

### 6.3 Moderación proactiva

Forzza no aplica moderación automática de contenido en V1. Todo el contenido es moderado reactivamente (ante reclamos o reportes). Esta postura debe documentarse en los Términos como limitación de responsabilidad de Forzza respecto de contenido de terceros.

**HUMAN_REQUIRED: evaluar si Google Play requiere moderación proactiva adicional para el tipo de contenido que sube el coach (ver §7).**

---

## 7. Requisitos de Google Play para apps con UGC

Google Play exige que las apps con UGC implementen controles mínimos. Estado actual y pendientes:

| Requisito de Play | Estado | Acción |
|---|---|---|
| Sistema de reporte in-app accesible | **Pendiente P1.5** | Implementar botones "Reportar" en chat y videos (ver §6.2) |
| Bloqueo de usuarios | **Pendiente P1.5** | Mecanismo de bloqueo coach↔alumno en chat (tabla `user_blocks` a crear) |
| Moderación razonable y acción ante contenido objetable | Parcialmente cubierto vía canal email | Reforzar con sistema in-app de P1.5 |
| Política de UGC publicada y accesible en la app | Marco contractual en `legal.terms §5-6`; este doc como procedimiento operativo | Agregar enlace desde la app a `/legales/terminos` |
| Política de terminación de cuentas infractoras | Definida en §5 de este doc | Documentar URL pública del procedimiento **HUMAN_REQUIRED** |
| Advertencia de contenido de adultos (si aplica) | No aplica en V1 (no hay contenido explícito; Forzza no lo permite) | Re-evaluar si se habilitan imágenes adicionales del coach con visibilidad pública |

> Referencia: [Google Play User Generated Content policy](https://support.google.com/googleplay/android-developer/answer/9876821).

---

## 8. Track US / DMCA — Nota para P2 (activar al operar en EE. UU.)

> Esta sección NO aplica en V1 (Argentina). Se activa cuando Forzza opere con usuarios de EE. UU.

Para acceder al "safe harbor" de la DMCA (Digital Millennium Copyright Act, 17 U.S.C. §512) se requiere cumplir todas las condiciones:

| Condición DMCA safe harbor | Estado en V1 | Acción para P2.1 |
|---|---|---|
| Designar un agente DMCA registrado en copyright.gov | No aplica (V1 AR) | **HUMAN_REQUIRED (P2.1):** registrar agente en copyright.gov (~USD 6 / 3 años); publicar nombre, dirección y email del agente en sitio web |
| Respuesta expeditiva ante notificaciones válidas | Parcialmente cubierto (§4 de este doc) | Adaptar plazos a estándares DMCA; revisar con abogado de EE. UU. |
| Política de terminación de reincidentes implementada y aplicada | Definida en §5 | Verificar que esté operativa y documentada |
| Sin conocimiento previo del contenido infractor (no inducer) | No aplica proactivamente | Mantener postura reactiva; no modificar/curar contenido de coaches de forma que implique co-autoría |
| No recibir beneficio económico directamente atribuible a la infracción | Modelo marketplace (comisión sobre cobros, no sobre contenido) | Análisis legal específico al activar P2.1 |

**Referencia en el backlog:** P2.1 (`docs/compliance/backlog.md §P2`).
**HUMAN_REQUIRED:** el registro del agente DMCA y la operación del procedimiento formal DMCA deben estar a cargo de un abogado de EE. UU. No activar sin asesoramiento legal específico.

---

## Pendientes HUMAN_REQUIRED — Resumen

| ID | Pendiente | Bloqueante de |
|---|---|---|
| HR-UGC-1 | Confirmar que `legal@forzza.app` existe y tiene responsable con SLA | go-live |
| HR-UGC-2 | Validar plazos de respuesta (acuse 2 d, evaluación 5 d, resolución 15 d) con abogado | go-live |
| HR-UGC-3 | Definir plazo de contranotificación y consecuencias (restitución / retiro definitivo) con equipo legal | go-live |
| HR-UGC-4 | Validar umbrales de infractores reincidentes (2.ª / 3.ª infracción) con equipo legal | go-live |
| HR-UGC-5 | Definir URL pública del procedimiento de takedown (puede ser esta misma página u otra en `/legales/`) | Google Play submission |
| HR-UGC-6 | Evaluar si Google Play requiere moderación proactiva adicional para el tipo de UGC del coach | Google Play submission |
| HR-UGC-7 | Registro de agente DMCA en copyright.gov + publicar datos del agente en el sitio web | Solo al operar en EE. UU. (P2.1) |

---

## Próximos pasos de implementación (P1.5)

1. **Tabla `content_reports`:** columnas `id`, `reporter_id`, `content_type` (enum: `coach_avatar|video|message|coach_gallery`), `content_ref`, `reason` (enum: `copyright|illegal|offensive|spam|other`), `description`, `status` (enum: `pending|reviewed|actioned|dismissed`), `created_at`. RLS: INSERT para cualquier usuario autenticado; SELECT/UPDATE para owner.
2. **Botones "Reportar"** en perfil del coach, reproductor de video y chat.
3. **Tabla `user_blocks`** para bloqueo mutuo (Google Play requirement).
4. **Notificación interna** al owner al recibir un reporte (Resend o push).
5. **Enlace** desde footer de la app móvil a `/legales/terminos` (sección §5 y §6).
6. Registrar todos los eventos de takedown en `audit_log` con el schema descrito en §4.4.
