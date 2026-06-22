# Store Privacy Labels — Forzza

> **Documento vivo.** Generado 2026-06-22. Actualizar ante cada nueva categoría de dato o cambio de tercero.
>
> **HUMAN_REQUIRED — transcripción en consola:** Las tres secciones siguientes son mapeos listos para ser trasladados a App Store Connect y Google Play Console por un humano con acceso a las cuentas. Este documento no reemplaza la carga en consola; es el insumo exacto para hacerla sin ambiguedad.
>
> Fuentes de verdad: `docs/compliance/data-map.md` · `apps/mobile/app.config.ts` (`ios.privacyManifests`).

---

## 1. Apple App Store — Privacy Nutrition Label

> **Coherencia con el manifest:** Cada fila corresponde a un `NSPrivacyCollectedDataType` declarado en `apps/mobile/app.config.ts`. El orden de carga en App Store Connect (Certificados, Identificadores y Perfiles → tu app → Privacidad de la app) debe coincidir exactamente con esta tabla. Cualquier tipo aquí marcado "No" no debe aparecer en el manifest; si el manifest se actualiza, actualizar esta tabla.
>
> Tracking = false en todos los tipos (Forzza no hace cross-app tracking para publicidad). `NSPrivacyTracking: false` y `NSPrivacyTrackingDomains: []` ya están declarados.

| # | Tipo de dato (Apple) | Clave del manifest | ¿Se recolecta? | ¿Vinculado a identidad? | ¿Usado para tracking? | Propósitos | ¿Marcar como sensible? |
|---|---|---|---|---|---|---|---|
| 1 | Email Address | `NSPrivacyCollectedDataTypeEmailAddress` | Si | Si | No | Funcionalidad de la app (login, notificaciones transaccionales) | No |
| 2 | User ID | `NSPrivacyCollectedDataTypeUserID` | Si | Si | No | Funcionalidad de la app; Analytics (segmentacion anonima) | No |
| 3 | Health | `NSPrivacyCollectedDataTypeHealth` | Si | Si | No | Funcionalidad de la app (metricas corporales: peso, talla, % grasa, respuestas de bienestar) | **SI — marcar "sensitive"** |
| 4 | Fitness | `NSPrivacyCollectedDataTypeFitness` | Si | Si | No | Funcionalidad de la app (sesiones de entrenamiento, objetivos, nivel, planes Tabata) | **SI — marcar "sensitive"** |
| 5 | Photos or Videos | `NSPrivacyCollectedDataTypePhotosorVideos` | Si | Si | No | Funcionalidad de la app (fotos corporales de progreso del alumno; avatar del coach) | **SI — marcar "sensitive" (fotos corporales)** |
| 6 | Purchase History | `NSPrivacyCollectedDataTypePurchaseHistory` | Si | Si | No | Funcionalidad de la app (gating PRO/elite; historial de pagos y suscripciones) | No |
| 7 | Crash Data | `NSPrivacyCollectedDataTypeCrashData` | Si | No | No | Funcionalidad de la app (diagnostico de errores via Sentry; PII eliminada por `beforeSend()`) | No |
| 8 | Product Interaction | `NSPrivacyCollectedDataTypeProductInteraction` | Si | No | No | Analytics (eventos de uso via PostHog; PII eliminada por `scrubPII()`) | No |
| 9 | Performance Data | `NSPrivacyCollectedDataTypePerformanceData` | Si | No | No | Analytics (funnel de conversion, metricas de rendimiento via PostHog) | No |
| 10 | Other Diagnostic Data | `NSPrivacyCollectedDataTypeOtherDiagnosticData` | Si | No | No | Funcionalidad de la app (monitoreo de rendimiento via Sentry) | No |

### Notas de carga — App Store Connect

- La carga se realiza en: App Store Connect > tu app > Privacidad de la app > Tipos de datos.
- Los tipos 3 (Health), 4 (Fitness) y 5 (Photos or Videos) deben seleccionarse como **"Datos confidenciales"** cuando el sistema lo pregunte. Esta es la accion pendiente de P0.4 (`HUMAN_REQUIRED`).
- Para los tipos 7, 8, 9 y 10 (Crash Data, Product Interaction, Performance Data, Other Diagnostic Data): seleccionar "No vinculado a identidad" y confirmar que no se usan para tracking.
- Una vez completada la carga, Apple muestra una vista previa de la etiqueta de nutricion; verificar que coincida con esta tabla antes de enviar.

**HUMAN_REQUIRED:** Cargar esta tabla en App Store Connect. Cuenta: facundoluism@gmail.com (o la cuenta de Apple Developer de Forzza). Ruta: appstoreconnect.apple.com > Apps > Forzza > Privacidad de la app.

---

## 2. Google Play — Data Safety

> Se carga en: Google Play Console > tu app > Configuracion de la tienda > Seguridad de los datos.
> Google pregunta primero si la app recopila o comparte datos, luego solicita el detalle tipo por tipo.
>
> Respuesta a "¿Tu app recopila o comparte datos de usuario?": **Si.**
> Respuesta a "¿Todos los datos del usuario se cifran en transito?": **Si** (HTTPS/TLS en todos los endpoints).
> Respuesta a "¿Los usuarios pueden solicitar la eliminacion de sus datos?": **Si** (borrado de cuenta en mobile; anonimizacion a los 30 dias via Edge Fn `delete-account` + `anonymize-accounts`). Proporcionar el enlace al flujo de borrado en la app o un email de contacto.

### 2.1 Tabla de datos recopilados y compartidos

| Tipo de dato (Google Play) | Categoria Play | ¿Recopilado? | ¿Compartido con terceros? | Terceros que lo reciben | Proposito | ¿Requerido u opcional? |
|---|---|---|---|---|---|---|
| Direccion de correo electronico | Informacion personal | Si | Si | Supabase (almacenamiento), Resend (envio transaccional) | Funcionalidad de la app (login, notificaciones) | Requerido |
| Identificadores de usuario (UUID interno) | Identificadores | Si | Si | Supabase, PostHog (hasheado) | Funcionalidad de la app; Analytics | Requerido |
| Nombre para mostrar | Informacion personal | Si | No | Supabase (almacenamiento) | Funcionalidad de la app (perfil publico del coach; perfil del alumno) | Opcional |
| Fecha de nacimiento | Informacion personal | Si | No | Supabase | Funcionalidad de la app (verificacion de edad; gate menores de 18) | Requerido (flujo de menores) |
| Peso y medidas corporales | Salud y fitness | Si | No | Supabase | Funcionalidad de la app (seguimiento de progreso corporal) | Opcional |
| % de grasa corporal | Salud y fitness | Si | No | Supabase | Funcionalidad de la app (seguimiento de composicion corporal) | Opcional |
| Sesiones de entrenamiento (ejercicios, series, repeticiones, pesos) | Salud y fitness | Si | No | Supabase | Funcionalidad de la app (registro de rutinas; historial de entrenamiento) | Requerido para funcionalidad core |
| Respuestas a formularios de bienestar del coach (dolor, sueno, fatiga, etc.) | Salud y fitness | Si | No | Supabase | Funcionalidad de la app (check-ins de bienestar del alumno) | Opcional |
| Objetivos y nivel de entrenamiento | Salud y fitness | Si | No | Supabase | Funcionalidad de la app (personalizacion de perfil) | Opcional |
| Fotos corporales de progreso | Fotos y videos | Si | No | Supabase Storage (bucket privado) | Funcionalidad de la app (seguimiento visual de progreso; compartir con coach asignado) | Opcional |
| Imagen de perfil del coach (avatar publico) | Fotos y videos | Si | No | Supabase Storage (bucket publico CDN) | Funcionalidad de la app (perfil publico del coach en marketplace) | Opcional |
| Historial de compras y suscripciones (plan, periodos, montos) | Informacion financiera | Si | Si | Supabase, Mercado Pago, RevenueCat | Funcionalidad de la app (gating PRO/elite; liquidaciones) | Requerido para funcionalidad PRO |
| Token de dispositivo para notificaciones push | Identificadores de dispositivo | Si | Si | Supabase, Expo (FCM/APNs) | Funcionalidad de la app (notificaciones push) | Opcional (el usuario puede rechazar el permiso) |
| Eventos de uso de la app (inicio de sesion, inicio/fin de rutina, vistas de coach, etc.) | Actividad en la app | Si | Si | PostHog EU (anonimizado via `scrubPII()`) | Analytics (mejora del producto; analisis de funnel) | No opcional tecnicamente (se envia en background), pero sin PII |
| Datos de crash y trazas de error | Rendimiento de la app | Si | Si | Sentry US (PII eliminada por `beforeSend()`) | Diagnostico de errores y estabilidad de la app | No opcional tecnicamente |
| Datos de rendimiento y diagnostico | Rendimiento de la app | Si | Si | Sentry US, PostHog EU | Diagnostico de rendimiento; analisis de funnel | No opcional tecnicamente |
| Contenido de mensajes de chat alumno-coach | Mensajes en la app | Si | No | Supabase (Realtime) | Funcionalidad de la app (comunicacion 1:1 alumno-coach por assignment) | Opcional (solo usuarios con coach asignado) |

### 2.2 Detalle de terceros y proposito del compartido

| Tercero | Datos compartidos | Proposito del compartido | Transferencia internacional |
|---|---|---|---|
| **Supabase** (AWS us-east-1) | Todos los datos de la app (DB + Storage + Auth) | Almacenamiento e infraestructura; el procesador no accede ni usa los datos para sus propios fines | Si — US |
| **PostHog** (host EU) | Eventos de uso anonimizados: `plan`, `role`, `country_code`, `coach_id` (hasheado). Sin PII (16 keys bloqueadas por `scrubPII()`) | Analytics de producto | Si — UE |
| **Sentry** (host US) | Stack traces y contexto de errores sin PII (`beforeSend()` elimina email, username, etc.; IP anonimizada) | Diagnostico de errores en produccion | Si — US |
| **Mercado Pago** (AR/CL) | `gateway_payment_id`, montos, datos de pago procesados en su propia interfaz | Procesamiento de pagos (Forzza no almacena datos de tarjeta) | No (operador local AR/CL) |
| **RevenueCat** (US) | `gateway_subscription_id`, plan, plataforma (iOS/Android), `user_id` hasheado | Gestion de IAP (iOS/Android PRO); V1 sin trafico real aun (`APPLE_PAYMENTS/GOOGLE_PAYMENTS: false`) | Si — US |
| **Resend** (US) | `email` del usuario (solo el estrictamente necesario para cada envio transaccional) | Envio de emails transaccionales (contrasenas, pagos, notificaciones) | Si — US |
| **Expo / FCM / APNs** | `push_token` del dispositivo; payload de notificacion (titulo + body sin PII) | Entrega de notificaciones push | Si — US |

### 2.3 Politica de eliminacion de datos (pregunta especifica de Data Safety)

Google pregunta: "¿Proporcionas una forma para que los usuarios soliciten que se eliminen sus datos?"

Respuesta: **Si.**

Mecanismo disponible:
- **En la app mobile:** Perfil > Eliminar cuenta → llama a la Edge Fn `delete-account` → soft-delete inmediato + cola de anonimizacion a los 30 dias via `anonymize-accounts`.
- **Por email:** soporte@forzza.com (o el email de soporte que se configure antes del launch).
- La anonimizacion cubre: email → `deleted_TIMESTAMP@deleted.forzza.com`, `display_name` → `[eliminado]`, `birth_date` → null, `parental_email` → null, `push_token` → null; los datos de salud se anonomizan via `user_id` ya desvinculado del email.
- Los datos con obligacion legal de retencion (pagos, facturas, audit_log) se conservan segun los plazos indicados en `data-map.md` (entre 2 y 10 anos).

**HUMAN_REQUIRED:** Cargar la tabla de datos en Google Play Console y proporcionar la URL del flujo de eliminacion de cuenta (o email de soporte). Ruta: play.google.com/console > tu app > Politicas > Seguridad de los datos.

---

## 3. Google Play — Declaracion de Health App

> **Decision del dueno (2026-06-22):** Forzza SE DECLARA como health app en Google Play. La app recopila peso, medidas corporales y fotos de progreso, lo que la clasifica como aplicacion de salud y fitness segun los requisitos de Google Play.

### 3.1 Categoria aplicable

| Campo | Valor |
|---|---|
| Categoria de salud | Fitness y bienestar (no es app medica / no diagnostica ni trata enfermedades) |
| Usa Health Connect (Google Fit API) | **No** — la app NO integra Health Connect ni Google Fit. Los datos de salud se recopilan mediante formularios de usuario y se almacenan en la base de datos propia de Forzza (Supabase). |
| Usa datos de salud para publicidad | **No** |
| Vende datos de salud a terceros o data brokers | **No** |
| Comparte datos de salud con data brokers | **No** |

### 3.2 Compromisos que Google exige para health apps

Google Play requiere que las apps de salud cumplan con su politica de salud personal o de uso sensitivo de datos de usuario. Los siguientes compromisos aplican a Forzza:

| Requisito Google | Estado en Forzza | Referencia tecnica |
|---|---|---|
| Los datos de salud solo se usan para la finalidad declarada al usuario | Cumplido: peso, medidas y fotos se usan unicamente para el seguimiento de progreso del alumno y se comparten con el coach asignado (con consentimiento del alumno) | `data-map.md` seccion 3; `progress-photos` bucket con RLS |
| Los datos de salud NO se usan para publicidad personalizada | Cumplido: `NSPrivacyTracking: false`; PostHog recibe solo eventos anonimizados sin datos de salud (scrubPII elimina health-related keys) | `app.config.ts` `NSPrivacyTracking: false`; `packages/core/src/analytics/index.ts` |
| Los datos de salud NO se venden ni comparten con data brokers | Cumplido: ningun tercero recibe datos de salud (Supabase es procesador de infraestructura, no analista de datos de salud) | `data-map.md` tabla de terceros |
| El usuario puede eliminar sus datos de salud | Cumplido: borrado de cuenta + anonimizacion 30 d via Edge Fns | `supabase/functions/delete-account`, `anonymize-accounts` |
| Consentimiento previo a recopilar datos de salud | **PENDIENTE (P1.4):** Hoy no existe una pantalla de consentimiento dedicada antes de ingresar metricas corporales o subir fotos. Se usa el consentimiento general de los Terminos y Privacidad (P0.6). Requiere implementacion antes del go-live | `docs/compliance/backlog.md` P1.4 |
| Privacidad prominente en la ficha de store | **HUMAN_REQUIRED:** Incluir en la descripcion de la app en Play Console una referencia clara a la Politica de Privacidad y a como se tratan los datos de salud | Seccion 4.2 de este documento |

### 3.3 Formulario de Google Play — Health Apps declaration

Cuando Google Play solicite la declaracion de health app (puede aparecer como alerta de politica en Play Console o como parte del proceso de review), los campos a completar son:

| Campo del formulario Google | Respuesta |
|---|---|
| ¿Tu app es una app de salud o fitness? | Si |
| ¿Tu app usa Health Connect? | No |
| ¿Para que usa la app datos de salud y fitness? | Seguimiento personal de progreso corporal del usuario (peso, medidas, fotos, sesiones de entrenamiento). Los datos son accesibles al coach asignado si el alumno tiene un plan de coaching activo. |
| ¿Los datos de salud se comparten con terceros? | No (Supabase es el procesador de infraestructura; no recibe datos de salud para fines propios) |
| ¿Los datos de salud se usan para publicidad? | No |
| URL de la politica de privacidad | `https://forzza.com/legales/privacidad` (o el dominio productivo) |
| Mecanismo de eliminacion de datos | Flujo en la app: Perfil > Eliminar cuenta; email: soporte@forzza.com |

**HUMAN_REQUIRED:** Completar el formulario de declaracion de health app en Google Play Console si Google lo solicita durante el proceso de submission o revision. Si no aparece el formulario, verificar en: Play Console > tu app > Politicas > Aplicaciones de salud.

---

## 4. Checklist de pasos manuales pre-submission

### 4.1 App Store Connect

- [ ] **HUMAN_REQUIRED:** Ingresar a appstoreconnect.apple.com > Apps > Forzza > Privacidad de la app.
- [ ] Agregar cada tipo de dato de la tabla de la Seccion 1 (10 tipos).
- [ ] Para tipos 3, 4 y 5 (Health, Fitness, Photos or Videos): seleccionar **"Datos confidenciales / Sensitive"** cuando el asistente lo pregunte. (Pendiente de P0.4.)
- [ ] Para tipos 7, 8, 9, 10: confirmar "No vinculado a identidad" y "No se usa para tracking".
- [ ] Verificar la vista previa de la etiqueta de nutricion antes de enviar — debe coincidir con la tabla de Seccion 1.
- [ ] **HUMAN_REQUIRED (P0.4 pendiente):** Tras el primer build EAS, abrir Xcode > Target > Privacy Manifest y verificar que no aparezcan warnings de "missing reason" para los pods de RevenueCat (`PurchasesHybridCommon`, `Purchases`). Si aparecen, agregar la razon `35F9.1` en el bloque `NSPrivacyAccessedAPICategorySystemBootTime` de `app.config.ts`.

### 4.2 Google Play Console — Data Safety

- [ ] **HUMAN_REQUIRED:** Ingresar a play.google.com/console > tu app > Configuracion de la tienda > Seguridad de los datos.
- [ ] Responder "Si" a la pregunta de recopilacion/compartido de datos.
- [ ] Cargar cada fila de la tabla 2.1 con sus categorias, propositos y si es requerido u opcional.
- [ ] Confirmar: cifrado en transito = Si; eliminacion de datos posible = Si.
- [ ] Agregar URL del mecanismo de eliminacion (flujo in-app o email de soporte).
- [ ] Publicar la seccion de Seguridad de datos (requiere accion explicita; no se publica sola).

### 4.3 Google Play Console — Health Apps declaration

- [ ] **HUMAN_REQUIRED:** Verificar en Play Console > Politicas > Aplicaciones de salud si hay un formulario pendiente.
- [ ] Si aparece, completar con los valores de la tabla 3.3.
- [ ] Confirmar: la app NO usa Health Connect, NO comparte con data brokers, NO usa datos de salud para publicidad.
- [ ] Proporcionar URL de Politica de Privacidad: `https://forzza.com/legales/privacidad`.

### 4.4 Items HUMAN_REQUIRED heredados de P0.4

| Item | Accion | Prioridad |
|---|---|---|
| Marcar Health como "sensitive" en App Store Connect | Ver Seccion 1, tipo 3 | P0.5 — pre-submission |
| Marcar Fitness como "sensitive" en App Store Connect | Ver Seccion 1, tipo 4 | P0.5 — pre-submission |
| Marcar Photos or Videos como "sensitive" en App Store Connect | Ver Seccion 1, tipo 5 | P0.5 — pre-submission |
| Verificar pods RevenueCat en Privacy Manifest tras 1er build EAS | Ver nota 4.1 | P0.4 — primer build |
| Consentimiento dedicado para datos de salud (P1.4) | Implementar pantalla de consentimiento antes de `body_metrics` y `progress-photos` | P1.4 — pre-lanzamiento general |
| Banner de consentimiento analytics PostHog (P1.1) | Montar sobre `scrubPII()`; no cargar PostHog hasta opt-in | P1.1 — pre-lanzamiento general |

---

> **Nota al revisor de Apple (para incluir en las notas de review de App Store Connect):**
> Los paquetes de coaching de Forzza son servicios persona-a-persona prestados por coaches independientes a sus alumnos (clases/planes de entrenamiento 1:1). No son bienes digitales ni suscripciones en la definicion del App Store. Se contratan exclusivamente a traves de la web (Mercado Pago), nunca via IAP, de acuerdo con la guideline 3.1.3(e) de Apple (servicios persona-a-persona). La app movil es exclusivamente para alumnos; el alta y gestion de coaches se realiza en la plataforma web.
>
> **HUMAN_REQUIRED:** Copiar esta nota en el campo "Notas para el revisor" al enviar la app a revision en App Store Connect.
