# Mapa de Datos — Forzza (RoPA / Data Inventory)

> **Documento vivo.** Refleja el esquema real al 2026-06-22 (26 migraciones aplicadas).  
> Actualizar ante cada migración que agregue columnas o buckets con datos personales.  
> **HUMAN_REQUIRED — validación legal:** Las bases legales y períodos de retención aquí indicados son una aproximación técnica para dar contexto al backlog. Deben ser revisados y formalizados por un abogado matriculado antes del go-live público. Este documento NO es consejo legal.

---

## 1. Identificación / cuenta

| Categoría | Dato (tabla.columna o bucket) | Finalidad | Base legal (Ley 25.326 AR) | Retención | Tercero que lo procesa | Sensible |
|---|---|---|---|---|---|---|
| Identificación | `auth.users.email` (Supabase Auth) | Login, notificaciones transaccionales (pagos, contraseñas) | Ejecución de contrato (art. 5 inc. a) | Hasta borrado de cuenta + 30 d anonimización | Supabase, Resend | No |
| Identificación | `users.id` | PK interna, joins entre tablas | Ejecución de contrato | Vida del registro + 30 d | Supabase | No |
| Identificación | `users.role` | Control de acceso (student/coach/owner) | Ejecución de contrato | Vida del registro + 30 d | Supabase | No |
| Identificación | `users.country` | Lógica de precios, compliance por país | Ejecución de contrato | Vida del registro | Supabase | No |
| Identificación | `users.deleted_at` | Soft-delete; dispara cola de anonimización | Obligación legal / legítimo interés (auditabilidad) | 30 d post-borrado, luego anonimizado | Supabase | No |
| Identificación | `student_profiles.display_name` | Mostrar nombre del alumno en la app | Ejecución de contrato | Vida del registro + 30 d | Supabase | No |
| Identificación | `coach_profiles.display_name` | Marketplace público de coaches | Ejecución de contrato | Hasta borrado + 30 d | Supabase | No |
| Identificación | `leads.email` | Captura de interés en la landing; envío de noticias pre-lanzamiento | Consentimiento (art. 5 inc. a) | Hasta baja explícita del lead | Resend, Supabase | No |
| Identificación | `coach_ratings.comment` | Reseña pública de alumno a coach | Consentimiento / ejecución de contrato | Hasta borrado por owner (moderación) | Supabase | No |
| Identificación | `tickets.subject`, `tickets.body` | Soporte al usuario | Ejecución de contrato / interés legítimo | 2 años post-cierre del ticket | Supabase | No |

---

## 2. Menores / consentimiento parental

| Categoría | Dato | Finalidad | Base legal (Ley 25.326 AR) | Retención | Tercero | Sensible |
|---|---|---|---|---|---|---|
| Menores | `student_profiles.birth_date` | Calcular si el alumno es menor de 18; gate parental consent antes del checkout de coach y PRO | Obligación legal (protección menores) | Vida del registro + 30 d | Supabase | No* |
| Menores | `student_profiles.parental_email` | Enviar solicitud de consentimiento al responsable adulto | Obligación legal / consentimiento parental | Vida del registro + 30 d | Resend, Supabase | No |
| Menores | `student_profiles.parental_consent_at` | Timestamp de aprobación parental; desbloquea checkout para menores | Obligación legal / consentimiento | Permanente (evidencia de compliance) | Supabase | No |

> *`birth_date` no está clasificada como dato sensible bajo Ley 25.326 (la lista del art. 2 refiere a origen racial, salud, vida sexual, creencias, convicciones políticas/religiosas, datos sindicales). Sin embargo, deriva información de edad de un menor — tratar con las mismas precauciones.

---

## 3. Fitness / salud — SENSIBLE

> Todos los datos de esta sección son **datos de salud** en los términos del art. 2 de la Ley 25.326 y requieren **consentimiento expreso e informado** del titular (P1.4 del backlog — pendiente).

| Categoría | Dato | Finalidad | Base legal (Ley 25.326 AR) | Retención | Tercero | Sensible |
|---|---|---|---|---|---|---|
| Salud | `body_metrics.weight_g` | Seguimiento de peso (gramos, sin flotante) | Consentimiento expreso (art. 5 inc. b) | Vida del registro; historial visible 10 d en free (query truncada, datos no borrados) | Supabase | **SÍ** |
| Salud | `body_metrics.height_mm` | Seguimiento de altura | Consentimiento expreso | Vida del registro | Supabase | **SÍ** |
| Salud | `body_metrics.body_fat_pct` | Seguimiento de composición corporal (décimas de %) | Consentimiento expreso | Vida del registro | Supabase | **SÍ** |
| Salud | `body_metrics.notes` | Notas libres del alumno sobre sus métricas | Consentimiento expreso | Vida del registro | Supabase | **SÍ** |
| Salud | `progress_photos.storage_path` (bucket `progress-photos`) | Fotos corporales del alumno; compartibles con coach PRO/elite activo | Consentimiento expreso | Hasta borrado por el alumno + 30 d anonimización | Supabase Storage | **SÍ** |
| Salud | `student_profiles.goals` | Objetivos fitness (texto libre) | Consentimiento / ejecución de contrato | Vida del registro + 30 d | Supabase | **SÍ** |
| Salud | `student_profiles.level` | Nivel de entrenamiento (principiante/intermedio/avanzado) | Consentimiento / ejecución de contrato | Vida del registro + 30 d | Supabase | **SÍ** |
| Salud | `workout_sessions.sets_data` | JSON con ejercicios, series, repeticiones y pesos de cada entrenamiento | Consentimiento / ejecución de contrato | Vida del registro; historial visible 10 d en free | Supabase | **SÍ** |
| Salud | `checkin_responses.answers` | Respuestas del alumno a formularios del coach (preguntas de bienestar, dolor, sueño, etc.) | Consentimiento expreso | Vida del registro | Supabase | **SÍ** |
| Salud | `tabata_plans.config` | Configuración de planes Tabata del alumno (tiempos de trabajo/descanso) | Consentimiento / ejecución de contrato | Vida del registro | Supabase | No* |

> *`tabata_plans.config` contiene tiempos de entrenamiento, no métricas corporales; clasificado como datos de uso, no de salud propiamente. Incluido por cercanía al contexto fitness.

---

## 4. Datos fiscales del coach — SENSIBLE

> Los datos de identificación fiscal y bancaria son datos sensibles desde el punto de vista patrimonial/financiero. Si bien Ley 25.326 no los lista explícitamente como "sensibles" (la lista es del art. 2), el CUIT + CBU permiten suplantación de identidad y transferencias fraudulentas. Tratar como datos de alto riesgo.

| Categoría | Dato | Finalidad | Base legal (Ley 25.326 AR) | Retención | Tercero | Sensible |
|---|---|---|---|---|---|---|
| Fiscal | `coach_profiles.fiscal_id` | CUIT (AR) o RUT (CL) del coach; identidad fiscal para pagos y facturas | Obligación legal (obligación tributaria) | Vida del registro + 5 años post-cierre (prescripción impositiva) | Supabase | **SÍ** |
| Fiscal | `coach_profiles.bank_account` | CBU/alias (AR) o cuenta bancaria; destino de liquidaciones | Obligación legal / ejecución de contrato | Vida del registro + 5 años | Supabase | **SÍ** |
| Fiscal | `coach_profiles.cbu` | CBU alternativo (columna añadida en migración de columnas faltantes) | Ejecución de contrato | Vida del registro + 5 años | Supabase | **SÍ** |
| Fiscal | `coach_profiles.alias_cbu` | Alias bancario alternativo | Ejecución de contrato | Vida del registro + 5 años | Supabase | **SÍ** |
| Fiscal | `coach_profiles.legal_entity_type` | Tipo de entidad fiscal (monotributo/RI/empresa/otro) | Obligación legal | Vida del registro + 5 años | Supabase | **SÍ** |
| Fiscal | `coach_profiles.constancia_path` (bucket `fiscal-docs`) | Constancia de inscripción AFIP/SII; verificación de identidad fiscal antes de aprobar coach | Obligación legal / legítimo interés | Hasta desactivación del coach + 5 años | Supabase Storage | **SÍ** |
| Fiscal | `settlements.invoice_number` | Número de factura emitida por el coach a Forzza | Obligación legal (10 años, plazo Ley 19.550 / AFIP) | 10 años | Supabase | **SÍ** |
| Fiscal | `settlements.invoice_path` (bucket `invoices`) | PDF/imagen de la factura; requisito previo a la transferencia | Obligación legal | 10 años | Supabase Storage | **SÍ** |
| Fiscal | `settlements.invoice_rejection_reason` | Motivo de rechazo de factura por el owner | Obligación legal / legítimo interés | 10 años | Supabase | No |

---

## 5. Contenido subido por el usuario (UGC)

| Categoría | Dato / Bucket | Finalidad | Base legal (Ley 25.326 AR) | Retención | Tercero | Sensible |
|---|---|---|---|---|---|---|
| UGC | bucket `fiscal-docs` (privado) | Constancias AFIP/SII del coach; validación por owner | Obligación legal | Hasta desactivación + 5 años | Supabase Storage | **SÍ** |
| UGC | bucket `invoices` (privado) | Facturas emitidas por el coach a Forzza | Obligación legal | 10 años | Supabase Storage | **SÍ** |
| UGC | bucket `coach-avatars` (PÚBLICO) | Imagen de perfil del coach visible en marketplace | Consentimiento / ejecución de contrato | Hasta que el coach la reemplace o borre su cuenta + 30 d | Supabase Storage (CDN público — indexable por terceros) | No |
| UGC | bucket `videos` (privado) | Videos de ejercicios subidos por coaches; librería de ejercicios | Consentimiento / ejecución de contrato | Vida del contenido activo; política de takedown pendiente (P1.5) | Supabase Storage | No |
| UGC | bucket `progress-photos` (privado) | Fotos corporales del alumno | Consentimiento expreso | Hasta borrado por alumno + 30 d | Supabase Storage | **SÍ** |
| UGC | `messages.content` | Texto del chat 1:1 alumno↔coach por assignment | Ejecución de contrato | Vida del assignment; política de retención post-cierre a definir | Supabase (Realtime) | No* |
| UGC | **Imágenes adicionales del coach** ("más imágenes") | Galería extra del coach en su perfil | — | — | — | **PLANEADA — sin bucket ni RLS definidos aún.** Ver `docs/open-questions.md` (entrada 2026-06-22 "más imágenes"). Decisión de producto pendiente: bucket nuevo, público vs privado, RLS, límites de tipo/tamaño, moderación UGC. No implementar hasta que esté definida. |

> *`messages.content` puede contener texto sensible de salud según lo que compartan alumno y coach. No tiene procesamiento automático de PII; depende del consentimiento general de la plataforma.

---

## 6. Pagos / suscripciones

| Categoría | Dato | Finalidad | Base legal (Ley 25.326 AR) | Retención | Tercero | Sensible |
|---|---|---|---|---|---|---|
| Pagos | `payments.amount` | Monto del pago (enteros, unidad mínima de moneda) | Obligación legal / ejecución de contrato | 10 años (prescripción tributaria) | Supabase, Mercado Pago | No |
| Pagos | `payments.currency` | Moneda del pago | Obligación legal | 10 años | Supabase, Mercado Pago | No |
| Pagos | `payments.status` | Estado del pago (pending/approved/rejected/refunded/in_process) | Ejecución de contrato | 10 años | Supabase, Mercado Pago | No |
| Pagos | `payments.gateway` | Gateway usado (mercadopago) | Auditoría / ejecución de contrato | 10 años | Supabase | No |
| Pagos | `payments.gateway_payment_id` | ID externo del pago en el gateway; clave de idempotencia | Obligación legal / auditoría | 10 años | Supabase, Mercado Pago | No |
| Pagos | `payments.metadata` | JSON con datos adicionales del pago (package_id, etc.) — SIN PII según política de `scrubPII()` | Auditoría | 10 años | Supabase | No |
| Suscripciones | `subscriptions.gateway_subscription_id` | ID de suscripción en RevenueCat o Mercado Pago | Ejecución de contrato | Vida de la suscripción + 10 años | Supabase, RevenueCat, Mercado Pago | No |
| Suscripciones | `subscriptions.plan` | Plan activo del usuario (free/pro/elite) | Ejecución de contrato / gating | Vida del registro | Supabase | No |
| Suscripciones | `subscriptions.current_period_start/end` | Período de facturación activo | Ejecución de contrato | Vida + 10 años | Supabase | No |
| Liquidaciones | `settlements.gross_amount`, `net_amount`, `commission` | Montos de liquidación quincenal del coach | Obligación legal (10 años AFIP) | 10 años | Supabase | No |
| Liquidaciones | `settlements.transferred_at` | Timestamp de transferencia a la cuenta del coach | Obligación legal | 10 años | Supabase | No |
| Procesados | `processed_events.event_id` | Idempotencia de webhooks de gateway | Auditoría / integridad | 2 años | Supabase | No |
| Auditoría | `audit_log.payload` | JSON de cada acción financiera o de validación (append-only) | Obligación legal / legítimo interés | Permanente (tabla append-only; no se borra) | Supabase | No* |

> *`audit_log.payload` puede contener IDs y montos; no debe contener datos de salud ni datos bancarios completos. Verificar en cada acción que el payload insertado no incluya `fiscal_id` ni `bank_account`.

---

## 7. Uso / dispositivo / analytics

| Categoría | Dato | Finalidad | Base legal (Ley 25.326 AR) | Retención | Tercero | Sensible |
|---|---|---|---|---|---|---|
| Analytics | Eventos PostHog: `signup_completed`, `login`, `workout_started/completed/abandoned`, `tabata_*`, `upgrade_modal_shown/cta_tapped`, `autopromo_shown/skipped`, `coach_profile_viewed`, `coach_checkout_started`, `pro_subscription_started`, `onboarding_student/coach_completed` | Análisis de uso, funnel de conversión, mejora del producto | Consentimiento (P1.1 pendiente — hoy sin banner opt-in) | Según retención configurada en PostHog EU | **PostHog (host EU — transferencia internacional)** | No |
| Analytics | Propiedades enviadas a PostHog: `plan`, `role`, `country_code`, `coach_id` (hashed) | Segmentación de usuarios | Consentimiento | — | PostHog EU | No |
| Analytics | PII bloqueada por `scrubPII()`: `email`, `full_name`, `name`, `birthdate`, `birth_date`, `phone`, `amount_cents`, `payment_id`, `provider_payment_id`, `cbu`, `alias_cbu`, `constancia_url`, `avatar_url`, `invoice_url`, `access_token`, `refresh_token`, `token`, `session` | NO enviada a PostHog | — | — | — | — |
| Dispositivo | `notification_preferences.push_token` | Token del dispositivo para Expo Notifications (push) | Consentimiento (opt-in implícito en iOS/Android prompt) | Vida del registro; se actualiza cuando el OS rota el token | Supabase, Expo (FCM/APNs) | No |
| Errores | Eventos de error en Sentry: stack traces, nombre del error, contexto de la acción | Diagnóstico de bugs en producción | Legítimo interés | Según retención de Sentry (configurable) | **Sentry (host US — transferencia internacional)** | No |
| Errores | PII purgada por `beforeSend()` en Sentry: `email`, `username`, `password`, `full_name`, `birthdate`, `cbu`, `payment_id`, `access_token`, `refresh_token`, `token`, `session` | NO enviada a Sentry | — | — | — | — |
| Errores | `ip_address` en mobile Sentry: anonimizado a `{{auto}}` por `beforeSend()` | Geolocalización aproximada para filtrar spam; no se usa individualmente | Legítimo interés | Según retención Sentry | Sentry | No |
| Dispositivo | `student_profiles.avatar_url` | Foto de perfil del alumno (URL en Storage o externa) | Consentimiento / ejecución de contrato | Vida del registro + 30 d | Supabase Storage | No |

---

## 8. IA (futura)

| Categoría | Dato | Finalidad | Base legal | Retención | Tercero | Sensible |
|---|---|---|---|---|---|---|
| IA | — | **Ningún procesamiento de IA en producción.** Flag `AI_BODY_SCAN: false` en `packages/config/src/index.ts`. | — | — | — | — |
| IA | *Placeholder* | Cuando se active `AI_BODY_SCAN`: análisis de fotos corporales para métricas automáticas → requerirá base legal específica (consentimiento expreso + nueva sección en Política de Privacidad + evaluación de impacto). | HUMAN_REQUIRED previo a activar | — | Por definir | **SÍ (salud)** |

---

## Resumen de buckets de Storage

| Bucket | Público / Privado | Contenido | Política RLS |
|---|---|---|---|
| `progress-photos` | Privado | Fotos corporales del alumno | Alumno: INSERT/SELECT propios. Coach con assignment activo PRO/elite: SELECT del alumno. |
| `fiscal-docs` | Privado | Constancias fiscales del coach (PDF/imagen) | Coach: INSERT propios. Owner: SELECT todos. |
| `invoices` | Privado | Facturas emitidas por el coach (PDF/imagen) | Coach: INSERT + UPDATE propios. Owner: SELECT todos. |
| `videos` | Privado | Videos de ejercicios de la librería | Coach: INSERT. Cualquier usuario autenticado: SELECT. |
| `coach-avatars` | **PÚBLICO** | Imagen de perfil del coach | Lectura pública sin auth. Write/UPDATE/DELETE: solo el dueño del archivo (scoping por `auth.uid()`). Indexable por CDN y motores de búsqueda. |
| `[coach-gallery]` | **SIN DEFINIR** | Imágenes adicionales del coach ("más imágenes") | **PLANEADO — sin bucket ni RLS.** Ver open-questions. |

---

## Terceros / procesadores de datos

| Procesador | Qué dato recibe | ¿Transferencia internacional? | Scrubbing / mitigación |
|---|---|---|---|
| **Supabase** (host AWS us-east-1) | Todos los datos de la DB y Storage; auth.users | Sí — US | Datos en reposo encriptados; RLS habilitado en todas las tablas. HUMAN_REQUIRED: verificar DPA con Supabase antes del go-live EU/GDPR. |
| **PostHog** (host EU — `eu.posthog.com`) | Eventos de uso anonimizados: `plan`, `role`, `country_code`, `coach_id` (hashed) | Sí — UE (adecuado para GDPR; para Ley 25.326 AR: declarar en Política de Privacidad) | `scrubPII()` bloquea 16 keys con PII antes del envío. Hoy sin banner de consentimiento (P1.1 pendiente). |
| **Sentry** (host US) | Stack traces, contexto de errores sin PII | Sí — US | `beforeSend()` elimina `email`, `username`, `ip_address` anonimizado en mobile; `scrubForSentry()` bloquea 10 keys. |
| **Mercado Pago** (AR/CL) | `gateway_payment_id`, montos, datos de pago del usuario (procesados en su propia interfaz) | No (operador local AR/CL) | Webhooks validados por firma; idempotencia por `processed_events.event_id`. Forzza no almacena datos de tarjeta. |
| **RevenueCat** | `gateway_subscription_id`, plan, plataforma (iOS/Android), `user_id` hashed | Sí — US | Solo para IAP mobile (V1: `APPLE_PAYMENTS/GOOGLE_PAYMENTS: false`; sin tráfico real hoy). |
| **Resend** | `auth.users.email` (transaccional: contraseñas, pagos), `leads.email` (marketing) | Sí — US | Solo el email estrictamente necesario para cada envío. Sin cuerpos que contengan datos de salud o fiscales. |
| **Expo / FCM / APNs** | `push_token` del dispositivo, payload de notificación (título + body sin PII según §7 del master doc) | Sí — US (Expo/Google/Apple) | Payload de notificación: solo IDs internos y texto UI, no texto de métricas ni montos. |

---

## Notas de implementación y discrepancias detectadas

1. **`coach_ratings.comment`** existe en el schema (migración `20260617200001_coach_ratings.sql`) pero no estaba listada en el backlog como dato a mapear. Se incluye: es texto libre de un usuario y puede contener información personal indirecta.

2. **`messages.content`** puede contener texto sensible compartido voluntariamente por el usuario en el chat. El backlog solo menciona "chat" de forma general. Se incluye como UGC porque el Realtime subscription lo expone en el cliente web/mobile.

3. **`coach_feedback.feedback_text`** (tabla `coach_feedback`, migración `20260617200002_coach_feedback.sql`) no estaba en el listado de categorías del backlog pero contiene texto del coach sobre métricas/fotos del alumno — dato que puede referirse indirectamente a salud. Se omitió del mapa principal para no superar 2 páginas por sección; agregar en una próxima revisión.

4. **`tabata_plans.config`** no estaba en el listado del backlog. Se incluyó porque contiene configuración de entrenamiento (datos de fitness del alumno).

5. **Bucket `coach-avatars`** fue creado en migración tardía (`20260622120003_coach_avatars_bucket.sql`), posterior al schema inicial. El backlog ya lo listaba correctamente como existente; confirmado.

6. **`audit_log.ip_address`** (columna `INET`): la IP es dato personal bajo Ley 25.326. Se registra en el log para auditoría de acciones financieras. HUMAN_REQUIRED: validar si la retención permanente de IPs es necesaria y proporcional, o si conviene anonimizarlas después de N días.

7. **PostHog sin banner de consentimiento (P1.1)**: hoy los eventos de analytics se envían sin opt-in explícito. Esto es un gap bloqueante para compliance estricto de Ley 25.326 (art. 5). Ver backlog P1.1.

8. **`student_profiles.avatar_url`** almacena una URL (puede apuntar a Storage privado o URL externa). No existe un bucket `student-avatars` en las migraciones; el campo es un texto libre. Confirmar si se pretende hostear los avatares de alumno en Storage o si la URL puede ser de terceros — impacta la retención y la política de borrado.
