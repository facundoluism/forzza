Forzza — Relevamiento, rediseño, modelo de negocio y specs para desarrollo
Versión: 1.0 · 10 de junio de 2026 · Documento de trabajo interno
Nota de nomenclatura: el prototipo actual usa la marca "FORZA" en todo el código y documentación. El brief de este trabajo usa "Forzza". Decisión pendiente del dueño: unificar marca antes de registrar dominios, cuentas de App Store/Play y entidad legal. En este documento se usa FORZA al referir a lo observado en el prototipo y Forzza al referir a la plataforma futura.

0. Executive Summary
Qué es Forzza. Una plataforma fitness de tres caras: (1) app móvil para alumnos con registro de entrenos, rutinas, progreso y Tabata; (2) marketplace de coaches con paquetes de coaching online (Starter/Pro/Elite); (3) backoffices web para coach y para el dueño. Hoy existe como un prototipo de alta fidelidad en React de 7.634 líneas (forza-complete.jsx) con 26 pantallas mobile, 2 backoffices y una guía de estilo — todo con datos mock, sin backend, sin pagos reales y sin lógica de gating implementada.
Qué problema resuelve. Dos dolores reales y verificables: (a) el alumno de gimnasio sin coach entrena sin estructura ni registro (hoy usa papel, notas del celular o nada); (b) el coach online en LatAm gestiona alumnos con WhatsApp + Excel + transferencias manuales, sin herramienta de cobro, agenda ni seguimiento unificada. El problema (b) es el que sostiene el negocio; el (a) es el embudo de adquisición.
Modelo de negocio recomendado (V1). Híbrido ya esbozado en el prototipo, con correcciones:

B2C freemium: plan Free con publicidad y límites → PRO de pago (ARS 4.500 / CLP 4.990 equivalentes).
Marketplace coach–alumno: Forzza cobra al alumno el paquete completo y retiene comisión. Corrección crítica: la comisión del 15% definida en el prototipo deja un neto efectivo de ~7–9% en Argentina después de pasarela e IIBB. Recomiendo 20% de comisión (o 15% + fee de procesamiento trasladado), de lo contrario el marketplace no paga su propia operación.
Suscripción fija del coach (ARS 9.900) solo hasta el 3er alumno, luego pasa a comisión — regla ya definida en el plan de implementación, se mantiene.

Mercados priorizados. (1) Argentina ahora — mercado natural del dueño, Mercado Pago, pricing ya definido. (2) Chile a los 3–6 meses — mismo idioma, MP disponible, fricción baja. (3) España test vía promotor — único mercado europeo donde la app actual (100% en español) funciona sin localización. (4) UK / Alemania / Dinamarca: esperar a V2+ — requieren localización inglés/alemán/danés, entidad o Merchant of Record para IVA, y el prototipo ni siquiera los contempla (el código tiene GB y BR, pero no DK, DE ni ES — inconsistencia detectada entre brief y prototipo).
Qué construiría en V1 (MVP comercial, ~14–16 semanas). Auth real + onboarding alumno/coach, gating Free/PRO con publicidad, rutinas + registro de entreno + progreso, marketplace con checkout Mercado Pago (AR), flujo post-pago de asignación de coach, backoffice coach (alumnos, rutinas, calendario, cobros con facturación manual), backoffice dueño (validación fiscal, aprobación de facturas, finanzas), notificaciones push críticas, landing pública con pricing.
Qué eliminaría o postergaría de lo que existe en el prototipo. Postergar a V2+: Grupos/comunidad, Análisis corporal comentado, Sesiones en vivo, Plan nutricional, integración Apple Health/Google Fit, "Análisis IA semanal" (prometido en Elite sin spec alguna), escaneo de ficha con IA (existe en el prototipo pero es costoso de robustecer), módulo Feedback con votos. Eliminar: el plan Brasil del pricing (no está en los mercados objetivo declarados), la promesa "acceso a hasta 3 coaches especializados" del paquete Elite (rompe el modelo de asignación 1:1 y no tiene flujo diseñado).
Riesgos principales. (1) Margen del marketplace insuficiente al 15%. (2) Apple IAP: el plan PRO es contenido digital → Apple exige In-App Purchase (15–30% de comisión), lo que destruye el margen de PRO en iOS si no se diseña la estrategia de precios/canales desde el día 1. (3) Payout manual a coaches con factura no escala y tiene riesgo fiscal (Forzza actúa como agente de cobro). (4) Operar en EU/UK sin entidad: IVA digital (OSS/VAT) obligatorio desde la primera venta. (5) Esquema de promotores sin contrato puede reinterpretarse como relación laboral o crear establecimiento permanente — mitigable con contratos de referidos.
Próxima acción recomendada. Validar con 5–10 coaches reales argentinos el flujo de cobro (¿aceptan que Forzza cobre por ellos y les transfiera contra factura, al 20%?). Es la hipótesis más riesgosa del negocio y se valida con entrevistas en 2 semanas, antes de escribir una línea de backend.

1. Inventario de evidencia recibida
1.1 Material recibido
ElementoFuenteEstadoConfianzaQué falta validarPrototipo completo (26 pantallas mobile + 2 backoffices + styleguide)forza-complete.jsx (7.634 líneas, proyecto)ObservadoAltaQue sea la versión vigente y no haya ramas más nuevasVersiones anteriores del prototipoforza-app.jsx (1.330 l.), forza-rutina.jsx (906 l.), forza-complete_backup.jsx (2.828 l.)ObservadoAltaConfirmado por contenido: son iteraciones previas; no aportan funcionalidad adicionalPlan de implementación (31 funcionalidades, 6 sprints, 16 semanas)forza-plan-implementacion.docx (Marzo 2026)ObservadoAltaSi los sprints siguen vigentes y si hubo avances desde marzoPricing por país (AR, CL, GB, BR) y comisión 15%Constante PRICING en el códigoObservadoAltaSi esos precios fueron testeados con usuarios realesModelo coach: sub fija ARS 9.900 → comisión al 4° alumnoPlan de implementación + estado coachModelos en BackofficeOwnerObservadoAltaLógica exacta del cambio (¿retroactivo? ¿qué pasa si baja a 3?)Flujo de payout: factura del coach → aprobación dueño → transferenciaTab Cobros (BackofficeCoach) + tab Finanzas (BackofficeOwner)ObservadoAltaViabilidad fiscal real del esquema en cada paísMercados objetivo: AR, CL, DK, DE, ES, UKBrief de este trabajo (contexto del dueño)Observado (declarado)AltaContradicción con el código: el prototipo tiene BR y no tiene DK/DE/ESEsquema de promotores por comisión en DK/DE/ES/UKBrief de este trabajoObservado (declarado)MediaNo existe nada de promotores en el prototipo ni en el plan. Todo lo relativo a promotores en este documento es diseño nuevoComisiones Mercado Pago AR: 4,99% + IVA online (~6,04% efectivo)sodi.com.ar, consultado 10-jun-2026Observado (fuente externa)Media-altaConfirmar en panel propio de MP; varía por plazo de acreditaciónComisiones Mercado Pago CL: 2,89%–3,19% + IVA (links/checkout)comocobro.cl y mercadopago.cl, consultado 10-jun-2026Observado (fuente externa)MediaConfirmar tarifa de suscripciones específicamenteStripe UK: 1,5% + £0,20 doméstica; tarjetas EEA 2,5% + £0,20globalfeecalculator.com / wearefounders.uk, consultado 10-jun-2026Observado (fuente externa)Alta—Stripe EU (DE/ES, aplica a DK con DKK): 1,5% + €0,25globalfeecalculator.com, consultado 10-jun-2026Observado (fuente externa)AltaTarifa exacta en DKK para DinamarcaComisión Apple/Google IAP: 15% (Small Business <USD 1M) / 30% estándarConocimiento público estableSupuesto declaradoMediaCambios recientes por DMA (EU) y fallo Epic (US) habilitan links externos en algunos mercados — validar al momento de publicar
1.2 Material faltante (inventario de gaps)
FaltanteImpactoCómo se resolvió en este documentoCapturas/videos de una app productivaNo hay app productiva: el prototipo ES la plataformaSe relevó el prototipo línea por línea como fuente de verdadRepositorio backend / APIsNo existe backendSe diseña desde cero (Fases 7, 13, 14)Landing públicaNo existeSe diseña desde cero (Fase 9)Datos de usuarios reales, tracción, costos actualesNo hay métricas porque no hay producto lanzadoUnit economics construidos sobre supuestos declaradosInformación del esquema legal del dueño (entidad, residencia fiscal)Crítico para definir cómo cobrar en cada paísPendiente de validación — ver sección 20Lista de promotores y acuerdos existentesDefine el diseño del módulo promotoresSe diseña un esquema genérico de referidos con supuestosFigma / design filesEl prototipo codificado actúa como design sourceStyleGuide del propio código usado como base del design system
1.3 Método de relevamiento

Análisis estático del código fuente completo de forza-complete.jsx: extracción del árbol de pantallas desde el componente raíz App(), navegación (mobileScreens, BottomNav, sidebars de backoffices), constantes de negocio (PRICING, commission), estados y datos mock.
Lectura completa del plan de implementación (marzo 2026) y cruce contra el código para clasificar cada funcionalidad como implementada-visual / implementada-con-lógica / ausente.
Investigación de variables externas (pasarelas, impuestos) con fuentes citadas y fecha de consulta.
Separación estricta Observado / Inferido / Supuesto / Recomendado en cada ficha.


2. Relevamiento completo de plataforma actual
Contexto general observado: todo vive en un único artefacto React (showcase con tabs: App Móvil / Dueño / Entrenador / Guía de Estilo). Hay un selector de plan (Free/PRO/Coach) en el header del prototipo para simular gating. Nada persiste: no hay backend, ni auth real, ni pagos reales. El idioma de toda la UI es español rioplatense. Tipografías: Bebas Neue (títulos), DM Sans (texto), Space Mono (números). Paleta dark con acento lima #C8FF00.
Convención de las fichas: para no repetir, los campos "Estados de carga" y "Permisos" se omiten cuando el valor observado es "no existe" (que es el caso en casi todo el prototipo — los loading/error states reales son una tarea transversal de V1, ya identificada en el Sprint 6 del plan). Prioridad = prioridad de construir/corregir en el producto real.
2.1 App móvil (26 pantallas observadas)
Ficha 2.1.1 — Splash

Usuario: todos. Objetivo: entrada y bifurcación de registro.
Observado: logo FORZA, CTAs hacia login y onboardings (alumno/coach).
Problemas: la bifurcación "soy coach" en la app móvil contradice el modelo: el coach trabaja en backoffice web. Registrar coaches desde la app añade superficie de revisión de Apple/Google sin beneficio.
Recomendación: rediseñar — splash solo alumno; alta de coach se mueve a la landing web ("Quiero ser coach"). P1.

Ficha 2.1.2 — Login

Usuario: todos. Objetivo: acceso.
Observado: email + password, botón de ingreso. No existe recuperación de contraseña, ni social login, ni verificación de email.
Datos que consume/genera: ninguno (mock).
Problemas: sin "olvidé mi contraseña" la app será rechazada en revisión de soporte básico y generará tickets desde el día 1.
Recomendación: rediseñar — agregar recuperación por email, Sign in with Apple (obligatorio en iOS si hay otros social logins) y Google. P0.

Ficha 2.1.3 — Onboarding Alumno (3 pasos)

Observado: Paso 1 cuenta (email/password), Paso 2 personal (nombre, apellido, edad, sexo), Paso 3 fitness (objetivo: bajar/ganar/tono/salud/deporte; nivel: nuevo/básico/medio/avanzado). El form state incluye campos dni, telefono, direccion, pais que no se piden en ningún paso (inferido: previstos para el flujo fiscal al contratar coach, como indica el plan).
Lógica asociada (pendiente, observada en plan): consentimiento parental <18 (Sprint 2), datos fiscales al contratar coach (Sprint 2).
Problemas: pide edad pero no hay rama de menores; pedir DNI/dirección en onboarding sería un error de conversión — correcto diferirlos al checkout, hay que mantener esa decisión explícita.
Recomendación: mantener estructura de 3 pasos; agregar consentimiento <18 y verificación de email. P0 (el consentimiento parental es bloqueante legal).

Ficha 2.1.4 — Onboarding Coach (4 pasos)

Observado: Paso 1 cuenta; Paso 2 fiscal con figura por país (AR: Monotributista/CUIT; CL: Boleta honorarios/RUT; GB: Self-employed/UTR; BR: MEI/CNPJ) con hints correctos; Paso 3 bancario (banco, alias, tipo de cuenta); Paso 4 perfil público (especialidad, bio, precio starter).
Problemas: (1) vive en la app móvil — debe vivir en web; (2) faltan DK/DE/ES y sobra BR respecto a los mercados declarados; (3) no hay carga de la constancia fiscal (PDF) que el dueño debe aprobar — el flujo de aprobación existe en el backoffice pero el de carga no existe en ningún lado; (4) datos bancarios solo con formato argentino (alias/CBU).
Recomendación: rediseñar y mover a web, con carga de constancia (paso 2b) y campos bancarios por país (CBU/CVU en AR, cuenta + RUT en CL, IBAN en EU/UK). P0.

Ficha 2.1.5 — Home (Inicio)

Observado: saludo, resumen del día, accesos rápidos (Tabata, registrar entreno, crear rutina), próxima rutina, racha. Pendiente según plan: badge de coach asignado + estado "pendiente de asignación" (Sprint 2).
Recomendación: mantener, sumando los estados de asignación de coach. P0.

Ficha 2.1.6 — Plan Semanal

Observado: vista semanal de rutinas asignadas por día con colores por tipo (fuerza/espalda/piernas/cardio/descanso/fullbody).
Lógica: en plan PRO el alumno arma su semana; con coach, la arma el coach (calendario del backoffice).
Recomendación: mantener. P1.

Ficha 2.1.7 — Crear Rutina (wizard 4 pasos + escáner IA)

Observado: config (nombre) → ejercicios (biblioteca EXERCISE_LIBRARY) → supersets/biseries → resumen → guardar. Incluye escaneo de ficha de gimnasio con IA: sube foto, loading "La IA está detectando los ejercicios", matching contra biblioteca, estados de error y éxito (una de las pocas pantallas con loading/error states reales).
Problemas: el escáner IA es una feature cara de robustecer (visión + parsing + matching) y no está en ningún sprint del plan — es scope fantasma.
Recomendación: mantener el wizard (es core de PRO); postergar el escáner IA a V2 como feature premium diferenciadora. P0 wizard / P3 escáner.

Ficha 2.1.8 — Rutina del Día / Workout activo

Observado: selector de rutina, vista previa de ejercicio (sheet con SVG anatómico), workout activo con bloques, sets, input de peso (kg/lb), RestTimer con nombre del siguiente ejercicio, confetti al finalizar, frases motivacionales (QUOTES). Ad gating parcialmente cableado: si userPlan==="free" muestra AdScreen de 10 s antes de iniciar (una de las 2 únicas reglas de gating implementadas).
Recomendación: mantener — es la pantalla de mayor calidad del prototipo y el corazón del uso diario. P0.

Ficha 2.1.9 — Registrar Entreno (post-workout)

Observado: registro manual de sesión ya realizada (para el caso "entrené sin la app"). Disponible en Free.
Recomendación: mantener — es el gancho del plan Free. P0.

Ficha 2.1.10 — Mi Progreso

Observado: gráficos de línea (peso, grasa, fuerza), stats (racha, sesiones), histórico. Regla pendiente: truncado a 10 días para Free (Sprint 1, no implementada).
Recomendación: mantener + implementar truncado Free. P0.

Ficha 2.1.11 — Fotos de Progreso

Observado: pantalla con variante bloqueada para Free (userPlan==="free" muestra lock — gating implementado); timeline frontal/lateral/dorsal y comparador split previstos.
Recomendación: mantener (PRO). P1.

Ficha 2.1.12 — Tabata

Observado: timer con configuración; ad de 10 s para Free antes de iniciar (gating implementado). Pendiente: tiempos adaptativos por grupo muscular (empuje/tirón 90 s, piernas 120 s, HIIT 30 s — Sprint 3).
Recomendación: mantener. P1.

DESVIO APROBADO POR EL DUENO (2026-06-18): el Tabata SÍ persiste datos en V1. Contrario a lo que
esta ficha describía originalmente (prototipo sin backend), por decision explicita del dueno se
implemento la tabla `tabata_plans` (migración 20260618000001_tabata_plans.sql) con RLS ownership
(student_id = auth.uid()). El modo avanzado requiere isPro() — enforcement en DB via funcion
public.is_pro(uuid) SECURITY DEFINER (migración 20260618000002_tabata_advanced_pro_enforcement.sql).
Ver docs/open-questions.md entradas 2026-06-18 para detalle completo.

Ficha 2.1.13 — Chat (Coach)

Observado: conversación con coach, mock. Pendiente: adjuntar video/foto con visor inline (Sprint 3).
Lógica: solo disponible con paquete coach activo.
Recomendación: mantener; definir si V1 usa chat propio (Supabase Realtime) o se difiere video-adjuntos a V1.5. P0 (el chat es la promesa central del paquete Starter).

Ficha 2.1.14 — Coach Marketplace

Observado: listado de coaches con rating, tags, precio, resultados de clientes (antes/después). Free puede mirar sin contratar (correcto, definido en features del plan Free).
Problemas: ratings y "resultados verificados" son mock — mostrar ratings sin sistema de reviews real es un riesgo de confianza y de rechazo en revisión (testimonios no verificables).
Recomendación: rediseñar levemente: en V1 sin ratings (mostrar "Nuevo en Forzza"), con bio + certificaciones validadas por el dueño. Ratings reales en V2. P0.

Ficha 2.1.15 — Checkout Coach (contratación de paquete)

Observado: pantalla de checkout con paquete (ej. Pro $39.900/mes, coach Miguel Ramírez) y PaymentCheckout genérico (form de tarjeta). Al confirmar no sucede nada (confirmado por el plan: "Hoy el checkout existe pero al confirmar no sucede nada").
Lógica pendiente (Sprint 2, el corazón del negocio): post-pago → alumno "pendiente de asignación" → notificación al coach → coach acepta → home actualizado + chat habilitado. También: datos fiscales del alumno y consentimiento parental.
Recomendación: rediseñar por completo con pasarela real (MP Suscripciones en AR/CL; ver Fase 7 para estrategia iOS). P0 absoluto.

Ficha 2.1.16 — Mi Plan (upgrade)

Observado: comparativa Free/PRO/PRO+COACH con features por plan, selector de país con precios localizados (AR/CL/GB/BR), UpgradeModal reutilizable. Pendiente: gating real con isPro() global (Sprint 1) y badge "Sin publicidad".
Problemas: el paquete Elite promete "Acceso a hasta 3 coaches especializados" y "Análisis IA semanal" — ninguna de las dos tiene flujo, pantalla ni spec en ninguna parte.
Recomendación: mantener la pantalla; eliminar esas 2 promesas de Elite hasta que existan (riesgo legal de publicidad engañosa y de refunds). P0.

Ficha 2.1.17 — Pagos (historial del alumno)

Observado: historial de cobros del alumno. Recomendación: mantener, alimentado por la pasarela real, con descarga de comprobante. P1.

Ficha 2.1.18 — Videos

Observado: videos de técnica guardados (PRO). Pendiente: guardado real y envío al coach (Sprint 3). Recomendación: mantener (PRO), almacenamiento con límite de cuota (regla nueva necesaria: máx. p. ej. 20 videos/2 GB por usuario para controlar costo). P2.

Ficha 2.1.19 — Notificaciones (centro)

Observado: lista de notificaciones in-app mock. Recomendación: mantener, respaldado por tabla notifications real (Fase 6). P1.

Ficha 2.1.20 — Perfil / Configuración

Observado: perfil con datos del alumno; configuración con toggles (unidades kg/lb observadas en WeightInput). Faltan: gestión de suscripción (cancelar/cambiar plan — obligatorio para App Store), preferencias de notificaciones, eliminar cuenta (obligatorio Apple/Google desde 2022), idioma.
Recomendación: rediseñar — agregar cancelación de suscripción, borrado de cuenta y preferencias de notificación. P0 (bloqueantes de publicación).

Ficha 2.1.21 — Feedback

Observado: envío de sugerencias con rating; en el backoffice del dueño hay tabla con votos y estados. Recomendación: postergar a V2 — en V1 un simple formulario que cree ticket de soporte; el sistema de votos es nice-to-have. P3.

Ficha 2.1.22 — Soporte

Observado: creación de tickets con categoría (Técnico/Pago/Cuenta) y prioridad; vista en backoffice dueño. Recomendación: mantener simplificado (email-based en V1 con tabla de tickets). P1.

Ficha 2.1.23 — Grupos

Observado: pantalla con variante bloqueada Free (gating implementado); feed del coach, challenges previstos (Sprint 4). Recomendación: postergar a V2 — comunidad sin masa crítica es un pueblo fantasma que daña la percepción del producto. P3.

Ficha 2.1.24 — Análisis Corporal

Observado: carga de medidas + fotos con comentarios del coach previstos (Sprint 4). Recomendación: postergar a V1.5/V2; en V1 las medidas viven en Progreso y las fotos en Fotos de Progreso (fusionar). P2 (fusionar).

Ficha 2.1.25 — Sesiones en Vivo

Observado: agenda y unión a sesión con link externo (Zoom/Meet) — Sprint 5. Recomendación: postergar a V2 — Elite puede lanzarse sin sesiones en vivo o directamente lanzar V1 solo con Starter y Pro. P3.

Ficha 2.1.26 — Nutrición

Observado: plan nutricional de lectura (Elite) — Sprint 5. Recomendación: postergar a V2. Riesgo adicional: prescripción nutricional está regulada en varios países (en España, p. ej., la elaboración de dietas es competencia de dietistas-nutricionistas colegiados). Si se lanza, debe ser "guía orientativa" con disclaimers y T&C que trasladen responsabilidad al coach. P3.

2.2 Vista dueño/admin (BackofficeOwner — 7 secciones observadas)
SecciónObservadoPendiente (plan)RecomendaciónPrioridadDashboardKPIs resumen marzo 2026 (mock)—Mantener; definir KPIs reales: MRR, usuarios por plan, coaches activos, GMV marketplace, churnP0UsuariosTabla con detalle por usuarioFiltro por plan (Sprint 2); vista datos fiscales para disputas (Sprint 3)MantenerP0EntrenadoresEstados de validación por coach (aprobado/en revisión/pendiente/rechazado), modales de aprobar/rechazar con motivo, modelo de cobro por coach (comisión/sub_fija/sin_alumnos)Preview de constancia PDF; detalle coach con alumnos/ingresos/comisión (Sprint 3)Mantener — es el corazón operativoP0FinanzasEstados de facturas (en_revisión/aprobado), modales aprobar/rechazar con motivoExport CSV/PDF por mes y país (Sprint 4); proyección por país (Sprint 4)Mantener; export a V1.5P0FeedbackTabla con 7 items mock, filtros, votos, estados—Postergar a V2P3SoporteTabla de tickets con prioridad/estado—Mantener simplificadoP1ConfiguraciónStubGestión de países, precios piso, % comisión, textos legalesRediseñar: aquí debe vivir la administración de PRICING (hoy hardcodeada)P0
Problema estructural detectado: no existe sección de Promotores ni de gestión de códigos de referido — requerida por el modelo declarado en el brief. Es módulo nuevo (Fase 6).
2.3 Vista entrenador (BackofficeCoach — 8 secciones observadas)
SecciónObservadoPendiente (plan)RecomendaciónPrioridadDashboardResumen de alumnos/ingresos (mock)—MantenerP1Mi PerfilPerfil público editable: nombre, especialidad, bio, tags, resultados de clientes—Mantener; resultados de clientes requieren consentimiento del alumno (checkbox + regla)P1Mis AlumnosLista con métricas por alumno (peso/grasa histórica, sesiones, racha, notas)Visor video/fotos (S3), check-ins: plantilla + respuestas (S3), análisis corporal (S4), nutrición (S5)Mantener núcleo; check-ins en V1 (es la promesa de Starter), resto V1.5+P0CalendarioCalendario mensual con asignación de rutinas por alumno y día (funcional en mock)Sesiones en vivo (S5)MantenerP0RutinasBuilder de rutinas del coach—Mantener (compartir biblioteca con la app)P0CobrosFlujo completo mock: pagos por alumno con estados (pendiente_factura → facturado → transferido), carga de factura con número, datos bancarios, cálculo bruto/comisión 15%/neto. Config de precios por país con validación de piso (error inline si < piso)Preview neto (S2), proyección (S3), validación n° factura vs constancia (S3), notificación de transferencia (S3), export (S4)Mantener el flujo — es el diferencial del producto; corregir comisión a 20% (ver Fase 4)P0MensajesChat con alumnosAdjuntos video (S3)MantenerP0GruposStubCrear grupos, feed, challenges (S4)Postergar V2P3
2.4 Landing
No existe. Se diseña completa en la Fase 9. P0 (es el canal de alta de coaches y de promotores, y el requisito de App Store para soporte/privacidad).
2.5 Otros sistemas

StyleGuide observado en el propio prototipo: paleta, tipografías, componentes (Pill, NumInput, TipCard, QuoteCard, SvgIcon, Confetti, LineChart). Base directa del design system (Fase 10/11).
No existen: backend, base de datos, auth, emails, push reales, analítica, CI/CD, repositorio estructurado.


3. Diagnóstico de producto
3.1 Problema real

Coach online (problema que paga): gestiona 5–40 alumnos con WhatsApp, planillas y cobros manuales por transferencia. Pierde tiempo (cobranza, recordatorios, armado de rutinas repetidas), pierde plata (morosidad, no puede subir precios sin "parecer caro" porque no entrega experiencia profesional) y no escala más allá de su agenda.
Alumno autodidacta (problema que da volumen): entrena sin registro ni progresión. Apps existentes (Strong, Hevy, Fitia) resuelven el registro pero ninguna lo conecta con un coach hispanohablante con cobro local (Mercado Pago) — las plataformas de coaching (Trainerize, Everfit, Harder) están en inglés, cobran en USD al coach y no resuelven el cobro al alumno en ARS/CLP.

La cuña competitiva real de Forzza es: cobro local + español + marketplace integrado. No es "otra app de fitness".
3.2 Usuarios y matriz de roles
PreguntaRespuesta¿Quién paga?El alumno (PRO o paquete de coach). El coach paga sub fija solo hasta su 3er alumno; después Forzza cobra vía comisión.¿Quién usa?Alumno (diario), coach (diario/semanal), dueño (semanal).¿Quién recomienda?El coach (trae a sus alumnos actuales — el canal de adquisición más barato) y el promotor (nuevo, por comisión).¿Quién administra?El dueño (validación fiscal, facturas, payouts, soporte).
3.3 Perfiles (JTBD)
PerfilJob to be doneDolor principalFrecuenciaDisposición a pagarObjeción principalFunciones críticasMétrica de éxitoAlumno Free"Registrar mi entreno para no estancarme"Desorden, falta de progresión3–5×/semBaja (0)"Ya uso notas del celu"Registrar entreno, Tabata, 3 rutinasD7 retention >25%Alumno PRO"Armar mi propio plan y ver progreso"Límites del Free + ads3–5×/semARS 4.500/mes (≈ snack semanal)"¿Vale más que Hevy gratis?"Rutinas ilimitadas, gráficos, fotosConversión Free→PRO >4%; churn <8%/mesAlumno con coach"Que alguien me lleve de la mano"No sabe si lo que hace funcionaDiaria + check-in semanalARS 22.000–65.000/mes"Puedo arreglar con el coach por fuera" (leakage)Chat, rutinas del coach, check-inRetención a 3 meses >60%Coach"Cobrar a tiempo y gestionar más alumnos sin morir"Cobranza + administraciónDiaria15–20% de su facturación (si le ahorra >20% del tiempo)"¿Por qué pagar comisión si ya cobro por transferencia?"Cobros, calendario, check-ins, chat≥4 alumnos cobrando por la plataformaPromotor"Ganar comisión recurrente recomendando"Ninguno (oportunidad)EsporádicaN/A — cobra"¿Me pagan en serio? ¿Cómo tributo?"Link/código, dashboard de referidos, payout≥5 conversiones/trimestreDueño"Operar el negocio sin que se caiga"Carga operativa de validaciones y payoutsSemanalN/A—Validación fiscal, aprobación facturas, finanzas<2 h/semana de operación por cada 10 coachesVisitante landing"Entender si esto es para mí en 30 segundos"Confusión de a quién le hablaUna vez—"Otra app más"Propuesta clara dual (alumno/coach), pricingConversión visita→registro >3%
3.4 Core vs. secundario vs. eliminar

Core (sostiene el negocio): registro de entreno + rutinas; marketplace + checkout + asignación de coach; cobros del coach con payout; gating Free/PRO; backoffice dueño (validación + finanzas).
Secundario (retención, V1.5–V2): fotos de progreso, check-ins, videos de técnica, Tabata inteligente, Apple Health/Google Fit, export de reportes.
Nice-to-have que NO sostiene el negocio (postergar): grupos/comunidad, challenges, sesiones en vivo, nutrición, feedback con votos, escáner IA de fichas.
Eliminar: "3 coaches especializados" y "Análisis IA semanal" de Elite (promesas vacías); país Brasil del pricing (fuera de los mercados declarados; si el dueño quiere mantener BR debe decirlo explícitamente — pendiente de validación).


4. Modelo de negocio recomendado
4.1 Modelos evaluados
ModeloCómo funcionaQuién pagaVentajasRiesgosComplejidad op./téc.Margen estimadoVeredictoB2C suscripción (PRO)Alumno paga mensual por featuresAlumnoIngreso predecible, ya diseñadoCAC alto vs. apps gratis (Hevy); IAP de Apple se lleva 15–30% en iOSBaja / Media70–85% bruto (web), 55–70% (iOS IAP)Adoptar V1Freemium con adsFree con publicidad de videoAnunciante (marginal)Embudo de adquisiciónCon <50k usuarios el ingreso por ads es despreciable (eCPM video LatAm ~USD 2–6, supuesto); puede dañar UXBaja / BajaIrrelevante como ingresoAdoptar como embudo, no como ingreso. El ad de 10 s puede ser autopromoción de PRO en V1 (costo cero, sin SDK de ads, menos fricción en review)Marketplace comisión por transacciónForzza cobra al alumno y retiene % del paquete de coachAlumno (el coach cede %)Alinea incentivos; escala con GMV; ya diseñadoAl 15% el neto es ~7–9% en AR (ver 4.3); leakage (coach arregla por fuera); Forzza es agente de cobro (carga fiscal)Alta / Alta7–9% neto al 15%; 12–14% al 20%Adoptar V1 con comisión 20%SaaS para coach (sub fija)Coach paga mensual por las herramientasCoachSimple, sin tocar el dinero del alumnoEl coach chico no paga sin alumnos; no captura upsideBaja / Baja~85% brutoAdoptar como puente: sub fija ARS 9.900 hasta 3 alumnos (ya definido), luego comisiónB2B gimnasiosLicencia a gimnasios para sus coachesGimnasioTickets grandesCiclo de venta largo, producto distinto (multi-coach, kiosko)Alta / Alta—No priorizar (V3 si hay tracción)Promotores por comisiónTerceros refieren coaches/alumnos por % recurrenteForzza pagaCAC variable, entrada a EU sin invertirFiscal/laboral por país; fraude de referidos; complejidad de payout internacionalMedia / MediaReduce margen del referido en 20–30% del netoAdoptar V1.5 con contrato de referido y pago como servicio facturadoHíbrido (todo lo anterior)CombinaciónMixtoDiversificaciónComplejidad de comunicarAlta / Alta—Es la recomendación: B2C + marketplace + puente SaaS + promotores
4.2 Recomendación por versión

V1 (AR): Free (con autopromo en vez de ads de terceros) → PRO ARS 4.500 → Marketplace con comisión 20% + sub puente del coach ARS 9.900 (hasta 3 alumnos). Cobro vía Mercado Pago Suscripciones. En iOS, PRO vía IAP; paquetes de coach vía web/MP (ver justificación 8.1).
V2 (CL + ES + promotores): mismo modelo; Chile con MP; España con Stripe; módulo promotores activo (códigos de referido, 20% del revenue neto de Forzza por referido durante 12 meses — recomendado, ver 5).
V3 (UK/DE/DK, marketplace avanzado): localización EN/DE, Stripe Connect para payouts automáticos (reemplaza el flujo manual de facturas), ratings reales, grupos, sesiones en vivo, nutrición.

4.3 Unit economics (escenario base, Argentina, junio 2026)
Supuestos declarados: MP suscripciones ≈ tarifa online 4,99% + IVA ≈ 6,04% efectivo (fuente: sodi.com.ar, consultado 10-jun-2026; pendiente de validación en panel propio — la tarifa de suscripciones puede diferir); IIBB sobre cobros ≈ 2% (varía por jurisdicción, supuesto); infra ≈ USD 0,05/usuario activo/mes a escala de miles (supuesto, ver Fase 8 costos).
PRO (ARS 4.500/mes, vía web/Android):

Pasarela: −272 (6,04%) → neto pasarela ≈ 4.228
IIBB ≈ −90 → neto ≈ ARS 4.138 (~92% del precio, antes de IVA débito fiscal e impuestos a las ganancias)
En iOS vía IAP (15% Small Business): neto ≈ ARS 3.825 (85%) sin costo de pasarela. Conclusión: IAP al 15% es tolerable para PRO; al 30% no.

Paquete coach Pro (alumno paga ARS 39.900; comisión Forzza 15% como está en el código):

Comisión Forzza: 5.985
Pasarela sobre el total (Forzza es merchant of record): −2.410 (6,04%)
IIBB sobre el total cobrado ≈ −798 (2%, supuesto; según jurisdicción puede aplicar solo sobre la comisión si se estructura como agente de cobro — pendiente de validación con contador)
Neto Forzza ≈ 2.777 = 7,0% efectivo. Con eso hay que pagar infra, soporte, CAC y el promotor si lo hubiera. No cierra.
Con comisión 20%: neto ≈ 7.980 − 2.410 − 798 = 4.772 = 12,0% efectivo. Cierra con margen para promotores.

Decisión recomendada (firme): comisión del marketplace = 20%, y el piso de precios por país se recalcula para que el neto del coach no baje respecto al diseño actual (subir pisos ~6%).
LTV/CAC (escenario base, supuestos declarados): alumno con coach: ticket promedio ARS 39.900, retención media 4 meses → GMV por alumno ≈ 160k → ingreso Forzza ≈ 19k (12%). CAC objetivo < ARS 6.000 por alumno con coach (orgánico vía el propio coach ≈ 0). PRO: LTV ≈ 4.138 × 8 meses ≈ 33k; CAC pago tolerable < 8k.
4.4 Riesgos del modelo

Leakage: coach y alumno arreglan por fuera tras conocerse en la plataforma. Mitigación: el valor del coach (calendario, check-ins, chat, cobro automático) debe ser mayor que el 20%; cláusula contractual de no-elusión 12 meses; detección (alumno cancela pero sigue chateando).
Forzza como agente de cobro: retenciones de IIBB/Ganancias sobre el flujo total, no solo la comisión. Mitigación: estructura contable de mandato/gestión de cobro — pendiente de validación con contador argentino antes de V1.
Dependencia del flujo manual de facturas: con 50 coaches × 2 facturas/mes el dueño revisa 100 facturas mensuales. Mitigación V1: lote quincenal con reglas de auto-aprobación si n° de factura y monto matchean; V3: Stripe Connect / MP marketplace split payments.


5. Análisis país por país
Aviso metodológico: precios PRO y paquetes de AR/CL/GB salen del código (observado). DK/DE/ES no existen en el prototipo: sus precios son recomendados por paridad de poder adquisitivo contra el ancla UK £8,99. Tipos de cambio de referencia jun-2026 (supuesto — validar al momento de pricing real). IVA: AR 21%, CL 19%, ES 21%, DE 19%, DK 25%, UK 20% (tasas estándar, conocimiento estable; confirmar tratamiento de servicios digitales en cada caso).
Variable🇦🇷 Argentina🇨🇱 Chile🇪🇸 España🇬🇧 Reino Unido🇩🇪 Alemania🇩🇰 DinamarcaMonedaARSCLPEURGBPEURDKKPRO recomendado$4.500 (obs.)$4.990 (obs.)€7,99 (rec.)£8,99 (obs.)€8,99 (rec.)DKK 69 (rec.)PRO ≈ USD/EUR~USD 3,5–4 (supuesto FX)~USD 5€7,99~€10,5€8,99~€9,2Paquete coach Pro (piso)$29.900 (obs.)$39.990 (obs.)€55 (rec.)£60 (obs.)€60 (rec.)DKK 450 (rec.)Pasarela recomendadaMercado PagoMercado PagoStripeStripeStripeStripeFee pasarela4,99%+IVA ≈ 6,04% (sodi.com.ar, 10-jun-2026)2,89–3,19%+IVA ≈ 3,4–3,8% (comocobro.cl, 10-jun-2026)1,5%+€0,25 (globalfeecalculator, 10-jun-2026)1,5%+£0,20 dom.; 2,5% tarjetas EEA (wearefounders.uk, 10-jun-2026)1,5%+€0,251,5%+€0,25 equiv. (confirmar DKK)Impuestos claveIVA 21%; IIBB s/cobros; GananciasIVA 19%; boletas SII del coachIVA 21%; OSS si vende desde fuera de ESVAT 20%; registro VAT UK para servicios digitales B2C desde la primera ventaIVA 19%; OSSIVA 25% (el más alto → pricing debe absorberlo)Complejidad para cobrarMedia (MP nativo)MediaBaja con Stripe + entidad EU o MoRMedia (VAT desde £0 para no residentes)Baja con OSSBaja con OSSComplejidad payout a coachesMedia (transferencia local contra factura)MediaBaja (SEPA)Media (FX si la cuenta no es GBP)Baja (SEPA)Baja (SEPA)Pago a promotoresN/A V1N/AFactura de autónomo, SEPAInvoice self-employedFactura freelancer (Rechnung)Factura CVR/B-incomeRiesgo cambiarioAlto (revisión trimestral de precios ya prevista en el código: "Se revisa cada 90 días")MedioBajoBajoBajoBajoRiesgo legalMedio (agente de cobro, IIBB multijurisdicción)MedioMedio (IVA, consumo; nutrición regulada)Medio (VAT no residente)Medio-alto (Impressum, GDPR enforcement estricto, AGB)Medio (GDPR, 25% IVA)CompetenciaMedia (apps EN, pocos con MP)MediaAlta (Harder, Fitia, Volt)Alta (Hevy es británica; PT marketplaces maduros)Alta (Freeletics es alemana)Media-altaSensibilidad al precioAltaMedia-altaMediaMedia-bajaMedia-bajaBajaRecomendaciónLanzar ahoraTestear (mes 3–6)Testear vía promotor (V2)Esperar (V2/V3)No priorizar hasta localizar DENo priorizar
5.1 Margen por país (paquete coach Pro, comisión 20%, escenario base)
PaísPrecioComisión Forzza (20%)Fee pasarela s/totalNeto ForzzaNeto %SupuestosAR$39.900$7.980−$2.410~$4.770 (− IIBB ≈ $3.970)10–12%IIBB 2% s/totalCL$52.990$10.598−$1.960 (3,7%)~$8.64016,3%Fee links MP CLES€80€16−€1,45~€14,5518,2%Stripe dom.; IVA aparteUK£80£16−£1,40~£14,6018,2%Tarjeta UK doméstica
Lectura: Argentina es el peor margen y el mejor mercado de entrada (red del dueño). Europa subsidia margen pero exige cumplimiento IVA/GDPR. El orden AR→CL→ES es correcto también financieramente porque cada paso mejora el margen.
5.2 Comisión del promotor (recomendado)

Esquema: 20% del revenue neto de Forzza generado por sus referidos (coaches o alumnos PRO) durante los primeros 12 meses de cada referido, con mínimo de payout (€50/£50) y pago trimestral contra factura del promotor como prestador independiente.
Ejemplo ES: promotor refiere un coach que factura €1.600/mes en paquetes → Forzza neto ≈ €290/mes → promotor ≈ €58/mes por ese coach. Diez coaches referidos ≈ €580/mes. Es atractivo sin destruir margen (Forzza retiene ~14,5% neto post-promotor).
Alternativa simple para V1.5: bounty fijo por conversión (€40 por coach activado con ≥2 alumnos pagos; €5 por PRO activo 2 meses) — más fácil de auditar y de explicar.
Riesgos: fraude de auto-referidos (mitigar: payout recién al 2° mes de vida del referido); requisito de contrato de referidos que excluya exclusividad, horario y subordinación (para no configurar relación laboral); el promotor factura como independiente en su país — Forzza no retiene impuestos locales (pendiente de validación legal por país antes de activar).

5.3 Escenarios a 12 meses (solo AR+CL, V1; supuestos declarados)
EscenarioAlumnos PROAlumnos con coachCoaches activosMRR Forzza aprox.ComentarioConservador3008015ARS 1,55 M (PRO ~1,24 M + mktpl ~0,32 M, neto) ≈ USD 1,3kNo cubre costos de desarrollo; cubre infraBase1.00030045≈ ARS 5,3 M ≈ USD 4,4kCubre infra + dueño part-timeAgresivo3.000900120≈ ARS 16 M ≈ USD 13kRequiere soporte dedicado y automatizar payouts
(MRR = PRO neto 4.138 × PRO + 12% × ticket medio 40k × alumnos con coach; FX supuesto 1 USD ≈ 1.200 ARS — actualizar al armar el modelo financiero real.)

6. Rediseño funcional completo
Formato por módulo: existir / eliminar / fusionar / postergar / pantallas / entidades / reglas / casos borde / métricas.
6.1 Auth y roles

Debe existir: email+password con verificación, recuperación de contraseña, Sign in with Apple y Google, sesiones JWT con refresh, roles student | coach | owner | promoter.
Eliminar: alta de coach desde la app móvil.
Reglas: un email = una cuenta = un rol primario (un coach puede tener vista de alumno con la misma cuenta — flag is_coach); bloqueo tras 5 intentos; menores: fecha de nacimiento obligatoria, <18 dispara consentimiento parental (email del adulto + aceptación) antes de poder contratar coach; eliminar cuenta self-service (soft-delete 30 días, anonimización posterior).
Casos borde: email del coach rechazado fiscalmente que se re-registra; cambio de país de residencia; menor que cumple 18.
Métricas: signup_completed, verification_rate, login_failure_rate.

6.2 Onboarding

Alumno: 3 pasos actuales + verificación email + consentimiento <18. Coach (web): cuenta → fiscal (figura por país + upload de constancia PDF/imagen) → bancario por país → perfil público → estado "pendiente de aprobación" (visible, con explicación de plazos: 48 h hábiles).
Caso borde: coach rechazado puede recargar constancia (máx. 3 intentos, luego contacto a soporte).
Métricas: funnel por paso, tiempo a aprobación de coach.

6.3 Perfil de usuario / 6.4 Perfil de coach

Usuario: datos personales, objetivos, unidades (kg/lb), idioma, gestión de suscripción (cancelar dentro de la app es obligatorio en iOS si se vendió por IAP; linkear a gestión de MP si se vendió web), eliminar cuenta, preferencias de notificaciones.
Coach: perfil público (bio, tags, certificaciones con archivo adjunto, precios por paquete ≥ piso), visibilidad en marketplace condicionada a fiscal_status=approved. Resultados de clientes solo con consentimiento registrado del alumno (tabla testimonial_consent).

6.5 Planes y gating

isPro(user) y hasCoach(user) como única fuente de verdad (server-side, cacheada en el cliente). Free: 3 rutinas predefinidas, historial 10 días, autopromo 10 s pre-rutina/Tabata, marketplace solo lectura. PRO: todo salvo coach. PRO+COACH por paquete (Starter/Pro/Elite).
Caso borde crítico: downgrade PRO→Free con 12 rutinas creadas → las rutinas quedan en solo-lectura (no se borran); historial se trunca en vista, no en datos. Pago de paquete falla en renovación → gracia de 5 días con avisos, luego paquete suspendido (chat en solo lectura, coach notificado).
Métricas: upgrade_modal_shown→upgrade_started→payment_succeeded; churn por plan.

DESVIO APROBADO POR EL DUENO (2026-06-18): el Tabata SÍ persiste planes en V1 (tabla tabata_plans).
El modo avanzado del Tabata requiere isPro() — gating enforcement en DB (RLS + funcion SECURITY DEFINER).
Ver Ficha 2.1.12 y docs/open-questions.md entradas 2026-06-18.

DESVIO APROBADO POR EL DUENO (2026-06-16): menores de 18 sin parental_consent_at tampoco pueden
comprar PRO (extensión de §7). Implementado server-side en /api/mp-preapproval y en la Edge Function
mp-create-preapproval. Ver docs/open-questions.md entrada 2026-06-16.

6.6 Entrenamientos / rutinas

Builder 4 pasos (existente), biblioteca de ejercicios (existente — conectar con la base de 234 ejercicios bilingüe ya compilada por el dueño en Excel, observado en contexto del proyecto), workout activo con timer, registro post-workout.
Regla: rutina asignada por coach no es editable por el alumno (sí puede ajustar pesos en ejecución). Caso borde: coach edita rutina mientras el alumno la está ejecutando → la ejecución usa snapshot.

6.7 Agenda / asignaciones

Calendario del coach (existente en mock): asignar rutina por alumno/día, vista del alumno en Plan Semanal. Regla: cambios con <12 h de antelación notifican push al alumno.

6.8 Pagos

AR/CL: Mercado Pago Suscripciones (PRO) y Suscripciones/preapproval por paquete (coach). EU/UK (V2): Stripe Billing. iOS: PRO por IAP; paquetes de coach por web (justificación 8.1).
Estados de suscripción: trialing? (no hay trial en V1 — decisión recomendada: sin trial, el Free es el trial), active, past_due (5 días de gracia), canceled, refunded.
Casos borde: reintento de cobro (dunning 3 intentos: día 0, 2, 5); cambio de paquete a mitad de mes (prorrateo: recomendado no prorratear en V1, cambio aplica al próximo ciclo); contracargo (suspende paquete y abre ticket).

6.9 Comisiones y payouts a coaches

Ciclo quincenal: el sistema genera la liquidación por coach (suma de cobros del período − comisión 20%), el coach carga factura por el neto, el dueño aprueba (auto-aprobación si n° factura único y monto exacto), transferencia manual V1, marca "transferido" + push al coach.
Reglas: sin factura validada no hay transferencia (ya definida en el plan, se mantiene); coach con constancia vencida → liquidaciones bloqueadas; modelo sub_fija → comisión automático al registrar el 4° alumno activo (notificación + recálculo desde el ciclo siguiente; si baja a ≤3 NO vuelve a sub fija — regla nueva recomendada para evitar gaming).
Métricas: días promedio liquidación→transferencia (objetivo <7), % facturas auto-aprobadas.

6.10 Promotores (módulo nuevo)

Pantallas: registro de promotor (invitación del dueño, no self-service en V1.5), dashboard (link/código, referidos, estado, comisiones acumuladas, historial de payouts), sección en backoffice dueño (alta de promotores, % por promotor, aprobación de payouts trimestrales contra factura).
Entidades: promoter, referral (referrer_id, referred_user_id, type, attributed_at), promoter_payout.
Reglas: atribución por código en registro o por link (UTM + cookie 30 días, last-click); comisión 20% del revenue neto del referido por 12 meses; payout trimestral, mínimo €50; auto-referido prohibido (mismo device/IP/medio de pago → flag de revisión).
Casos borde: referido que ya existía (no atribuye); promotor dado de baja (comisiones devengadas se pagan, no se devengan nuevas); dos códigos en conflicto (gana el primero persistido).

6.11 Notificaciones → Fase 7 (matriz completa).
6.12 Reportes

Dueño: MRR, GMV, usuarios por plan/país, coaches por estado, liquidaciones, export CSV (V1.5). Coach: ingresos, proyección, adherencia de alumnos (% sesiones completadas).

6.13 Panel dueño / 6.14 Panel coach

Según secciones 2.2/2.3 con las altas: Configuración global real (países activos, precios piso, % comisión, % promotores, textos legales versionados) y tab Promotores. El panel coach pierde Grupos en V1.

6.15 Landing → Fase 9. 6.16 Soporte: formulario → tabla tickets + email; SLA interno 48 h. 6.17 Legales: T&C, Privacidad (GDPR-ready desde V1 aunque se lance en AR — costo marginal, evita rehacer para ES), consentimiento de datos de salud (peso, fotos corporales = dato sensible: requiere consentimiento explícito y cifrado en reposo), consentimiento parental, contrato coach-plataforma, contrato de referidos.

6.18 Analítica de producto → Fase 17.


7. Notificaciones push, pull, in-app y email
Principios: (1) todo evento crítico de dinero o de relación coach-alumno va por push + in-app + email (nunca solo push — el push puede estar desactivado); (2) máximo 1 notificación motivacional/recordatorio por día por usuario; (3) opt-out granular por categoría (transaccional no opt-out-able salvo canal); (4) quiet hours 22:00–08:00 hora local para todo lo no crítico; (5) en DE/DK/ES los emails comerciales requieren opt-in explícito (double opt-in recomendado para DE).
7.1 Matriz (V1 salvo indicación)
#Evento disparadorReceptorCanalPrioridadMomentoTexto sugerido (ES)Deep linkNo enviar siMétricaVersiónN1Registro completadoAlumnoEmailAltaInmediato"Bienvenido a Forzza ⚡ Verificá tu email"verify—verification_rateV1N2Pago de paquete confirmadoAlumnoPush+In-app+EmailCríticaInmediato"¡Listo! Tu coach te aceptará en menos de 24 h"home——V1N3Nueva solicitud de alumnoCoachPush+Email+In-appCríticaInmediato"Nuevo alumno: {nombre} contrató {paquete}"bo/alumnos—t. de aceptaciónV1N4Coach aceptóAlumnoPush+In-appCríticaInmediato"{coach} es tu nuevo coach 🏆 Escribile"chat—activación chat D1V1N5Coach no acepta en 24 hDueñoIn-app+EmailAlta+24 h"Asignación pendiente hace 24 h: {alumno}→{coach}"bo/usuariosya aceptada—V1N6Mensaje de chatAlumno/CoachPushAltaInmediato, agrupado 5 min"{nombre}: {preview}"chat/{id}receptor en el chatrespuesta <4 hV1N7Rutina del día asignadaAlumnoPushMedia08:00 local"Hoy: {rutina} 💪"rutinasdía de descansoaperturaV1N8Check-in semanalAlumnoPush+In-appAltaDía/hora config. del coach"Tu check-in semanal te espera (2 min)"checkinya respondidotasa respuestaV1N9Check-in respondidoCoachIn-app+Email digestMediaInmediato/digest diario"{alumno} respondió su check-in"bo/alumnos/{id}—t. de revisiónV1N10Pago falla (dunning)AlumnoPush+EmailCríticaDía 0/2/5"No pudimos cobrar tu plan. Actualizá tu medio de pago"pagos—recovery rateV1N11Liquidación disponibleCoachPush+Email+In-appCríticaCierre quincenal"Tenés ${neto} para facturar"bo/cobrossin cobrosdías a facturaV1N12Factura aprobada/transferidaCoachPush+EmailCríticaInmediato"Transferimos ${neto} a tu cuenta ✅"bo/cobros—NPS coachV1N13Factura rechazadaCoachEmail+In-appCríticaInmediato"Tu factura fue rechazada: {motivo}"bo/cobros—reintentoV1N14Constancia aprobada/rechazadaCoachEmail+In-appCríticaInmediato"Tu perfil fue aprobado, ya estás en el marketplace 🎉"bo/perfil—t. a 1er alumnoV1N15Constancia pendiente >48 hDueñoEmailAlta+48 h"{coach} espera validación hace 2 días"bo/entrenadores—SLAV1N16Racha en riesgoAlumnoPushBaja19:00 local"Tu racha de {n} días está en juego 🔥"homeentrenó hoy; >2/semanasesiones salvadasV1.5N17Inactivo 7 díasAlumnoPushBajaDía 7, 1 vez"Te extrañamos. Tu próxima rutina te espera"homechurn voluntarioresurrecciónV1.5N18Cambio sub→comisión (4° alumno)CoachEmail+In-appAltaInmediato"¡4 alumnos! Tu modelo pasa a comisión, ya no pagás suscripción"bo/cobros——V1N19Nuevo referido convertidoPromotorEmailMediaInmediato"Tu referido {nombre} activó su plan. Comisión en camino"prom/dash——V1.5N20Payout trimestral promotorPromotorEmailCríticaCierre trimestre"Tu liquidación: €{monto}. Cargá tu factura"prom/payout< mínimo €50—V1.5N21Sesión en vivo en 1 hAlumno+CoachPushAlta−60 min"Tu sesión con {nombre} empieza en 1 hora"sesionescanceladaasistenciaV2N22Contracargo recibidoDueñoEmailCríticaInmediato"Contracargo de {alumno}: ${monto}"bo/finanzas—tasa CB <0,5%V1N23Publicación del coach en grupoAlumnos del grupoPushBajaInmediato, máx 1/día"{coach} publicó en {grupo}"grupos——V2
7.2 Infraestructura de notificaciones

Centro de notificaciones in-app (existe pantalla, conectar a tabla notifications con read_at).
Preferencias: por categoría (entrenamiento, coach, pagos, novedades) × canal (push, email). Transaccionales de dinero: solo se puede apagar push, nunca email.
WhatsApp: no en V1 — costo y fricción de aprobación de plantillas; reevaluar para dunning en AR en V2 (alta efectividad local).
Reglas anti-spam: cap global 3 push/día; supresión si app abierta; colapso por clave (collapse_key por conversación).
Eventos que nunca dependen solo de push: N2, N3, N10–N15, N20, N22.


8. Arquitectura técnica recomendada
8.1 Decisiones principales
CapaRecomendaciónAlternativas evaluadasPor quéPor qué no la alternativaRiesgosApp móvilReact Native + Expo (EAS)Flutter; Swift/Kotlin nativo; PWA puraEl prototipo entero es React: se reutilizan componentes, estilos y el conocimiento del dueño; Expo resuelve builds, OTA updates y push; un solo codebase iOS+AndroidFlutter = reescribir todo en Dart sin ventaja material; nativo duplica costo; PWA pura no entra a App Store ni tiene push iOS confiableMódulos nativos exóticos (no se prevén); tamaño de bundleBackoffices + Landing + PWANext.js (App Router) en VercelSPA React + Express; RemixSSR para SEO de landing y marketplace público; un repo web para landing + owner + coach; instalable como PWA desktopSPA sin SSR pierde SEO; Remix sin ventaja diferencial aquíCostos Vercel a escala (mitigable migrando a contenedor)BackendSupabase (Postgres + Auth + Storage + Realtime + Edge Functions)Firebase; NestJS+Postgres propio; serverless AWSPostgres relacional encaja con el dominio (pagos, liquidaciones = transaccional); RLS para multi-rol; Auth con Apple/Google listo; Storage para fotos/videos/constancias; Realtime para chat; el dueño no es backend dev — Supabase minimiza opsFirebase/Firestore complica reporting financiero (NoSQL, joins); NestJS propio = +6 semanas y mantenimiento de infraLock-in moderado (mitigado: es Postgres estándar); lógica compleja de liquidaciones en Edge Functions exige disciplina — extraer a un servicio NestJS en V2/V3 si crecePagos AR/CLMercado Pago (Suscripciones/preapproval + Webhooks)Stripe (no opera cobro local AR), dLocalÚnico con adopción masiva y cobro local AR/CLdLocal orientado a enterprise, pricing peor a este volumenWebhooks MP requieren idempotencia rigurosa; cambios de tarifas frecuentes en ARPagos EU/UK (V2)Stripe Billing (+ Stripe Connect en V3 para payouts)Adyen, Paddle (MoR)Estándar, barato en EU (1,5%+€0,25)Paddle como Merchant of Record es la alternativa seria si el dueño no constituye entidad EU: Paddle liquida IVA por Forzza a cambio de ~5% — decisión pendiente de la estructura legalVAT/OSS propio exige contabilidad EUIAPPRO por IAP en iOS (RevenueCat para unificar); paquetes de coach solo por webTodo IAP; todo webGuideline 3.1.3(e) de Apple: servicios persona-a-persona 1:1 (coaching personal) pueden cobrarse fuera de IAP; PRO es contenido digital → IAP obligatorio en iOS. RevenueCat unifica IAP+Stripe+MP en una sola fuente de entitlementsTodo IAP regala 15–30% del marketplace a Apple; todo web en iOS = rechazo seguro para PRORevisión de Apple puede discutir el límite "1:1" — preparar argumentación y, plan B, checkout de paquetes solo informativo en iOS (sin link de compra)PushExpo Notifications (FCM+APNs)OneSignalIntegrado al stack, gratisOneSignal suma valor en journeys/segmentación → adoptar en V2 si marketing lo pide—AnalíticaPostHog CloudAmplitude, GA4Eventos + funnels + session replay + feature flags en uno; tier gratis amplio; GDPR-friendly (EU hosting)Amplitude caro; GA4 débil para producto—Errores/observabilidadSentry (app+web+functions) + logs Supabase—Estándar——EmailsResend (transaccional)SendGrid, SESDX simple, dominio propio——CMSSin CMS en V1 (contenido en código/MDX)Sanity, StrapiNo hay caso de uso de contenido editorial aún——
8.2 Diagrama textual
[App RN/Expo iOS·Android]      [Next.js: Landing + PWA + BO Dueño + BO Coach + Dash Promotor]
        │  HTTPS / supabase-js                    │
        ▼                                         ▼
[Supabase: Auth (JWT+RLS) · Postgres · Storage (fotos/videos/constancias/facturas)
           · Realtime (chat) · Edge Functions (webhooks MP/Stripe, liquidaciones,
             notificaciones, gating server-side)]
        │                    │                     │
   [Mercado Pago]       [Stripe (V2)]        [RevenueCat ← App Store / Play Billing]
        │                    │                     │
        └────────── webhooks → Edge Functions → tabla payments/subscriptions ──────────┘
[Expo Push → FCM/APNs]   [Resend emails]   [PostHog]   [Sentry]
8.3 Seguridad, i18n, escala y costos

Seguridad: RLS por rol en todas las tablas; fotos corporales y constancias en buckets privados con URLs firmadas (TTL 1 h); datos de salud cifrados en reposo (Supabase lo provee) y nunca en analytics; rate limiting en Edge Functions; secretos en variables de entorno; backups diarios + PITR.
i18n: es-AR como base, arquitectura de strings (i18next) desde V1 aunque solo haya español — el costo de retrofit es alto. Multi-moneda: tabla country_config (moneda, precios, pisos, impuestos display, pasarela) administrable desde el BO del dueño (reemplaza la constante PRICING hardcodeada).
Escalabilidad: Postgres aguanta sin esfuerzo hasta decenas de miles de usuarios; los puntos de presión serán Storage/CDN de video (cuotas por usuario) y el chat (Realtime → migrar a servicio dedicado solo si >10k conexiones concurrentes).
Costos mensuales estimados (escenario base, supuestos): Supabase Pro USD 25 + Storage ~25; Vercel Pro 20; Expo EAS 0–99; RevenueCat 0 (gratis < USD 2,5k MTR); PostHog 0; Sentry 0–26; Resend 0–20; Apple Dev 99/año; Google Play 25 única vez. Total ≈ USD 100–220/mes — compatible con el escenario conservador.


9. App Store, Play Store y PWA
9.1 App Store (iOS) — checklist

Cuenta Apple Developer (USD 99/año) a nombre de la entidad legal (definir entidad antes — bloqueante).
PRO por IAP (auto-renewable subscription) con grupo de suscripción, precios por territorio, y gestión/cancelación accesible (pantalla Mi Plan → "Gestionar suscripción" → openURL settings).
Paquetes de coach por web: en iOS la pantalla de marketplace puede mostrar precios pero el flujo de pago 1:1 debe sustentarse en 3.1.3(e); preparar nota al revisor explicando que es coaching personal uno-a-uno.
Privacidad: Privacy Policy URL (landing), App Privacy labels (recolecta: salud y fitness, fotos, identificadores, datos de pago — declarar todo), ATT no requerido si no hay tracking de terceros (sin SDK de ads en V1 = más simple).
Eliminar cuenta in-app (obligatorio). Login de demo para revisión (cuenta alumno PRO + cuenta con coach asignado, datos de prueba poblados).
Consentimiento parental / age gate: rating 4+ probable salvo contenido de fotos corporales → declarar "Infrequent/Mild Medical/Treatment Information"; edad recomendada 12+ (recomendado por mensajería con adultos).
Riesgos de rechazo principales: 2.1 (app incompleta — estados vacíos sin datos), 3.1.1 (cobrar PRO fuera de IAP), 5.1.1 (pedir DNI sin justificar — justificar en el flujo: facturación), falta de recuperación de contraseña.
Assets: screenshots 6.7"/6.5"/5.5" + iPad si se soporta (recomendado: solo iPhone en V1), ícono 1024, descripción ES + EN, keywords, categoría Salud y forma física.

9.2 Google Play — checklist

Cuenta (USD 25), verificación de identidad de la organización; requisito de 12 testers durante 14 días en closed testing para cuentas personales nuevas — planificar 3 semanas de testing antes del lanzamiento.
PRO por Google Play Billing (mismo razonamiento que iOS; Google permite también facturación alternativa en algunos países con fee reducido — evaluar para AR, pendiente de validación).
Data Safety form completo (salud, fotos, datos financieros, compartición: no), Families: no dirigida a niños; rating IARC.
Permisos: cámara (fotos progreso, escaneo), notificaciones (Android 13+ runtime), sin ubicación.
Testing track interno → cerrado → producción; checklist de release con versionCode/semver.

9.3 PWA desktop — checklist

Manifest (name, icons 192/512, display standalone, theme #C8FF00/#080810), service worker con estrategia network-first para datos y cache-first para assets, instalabilidad (beforeinstallprompt), web push (solo desktop/Android; iOS Safari limitado), responsive ≥1024 px para backoffices, SEO solo para landing y perfiles públicos de coach (SSR), analytics PostHog snippet, Lighthouse PWA ≥ 90.


10. Landing y pricing page
10.1 Estructura y copy V1 (español)

Hero (alumno por defecto, switch "Soy coach"):

H1: "Entrená con método. Progresá con datos."
Sub: "Forzza es la app de entrenamiento que te acompaña en el gym — y si querés ir más rápido, te conecta con un coach real que arma tu plan, te sigue semana a semana y responde tus dudas."
CTA principal: "Descargar gratis" (App Store / Google Play). CTA secundaria: "Conocé los planes".


Problema: "¿Te suena? Entrenás hace meses y no sabés si estás progresando. Anotás los pesos en el celular… cuando te acordás. Y el plan que te dieron en enero sigue igual en junio."
Solución (3 bloques): Registrá cada entreno en segundos · Mirá tu progreso en gráficos reales · Sumá un coach cuando quieras dar el salto.
Cómo funciona (alumno): 1) Descargá la app y creá tu cuenta. 2) Elegí una rutina o armá la tuya. 3) Registrá tus entrenos y mirá tu progreso. 4) ¿Querés más? Elegí tu coach en el marketplace.
Sección coaches: H2: "Coacheá más alumnos. Administrá menos." Copy: "Cobros automáticos con factura y transferencia quincenal. Calendario, rutinas, check-ins y chat en un solo lugar. Vos entrenás gente; Forzza hace el resto. Comisión simple del 20% — sin alumnos no pagás nada de más: suscripción fija de $9.900/mes hasta tu 3er alumno, después solo comisión." CTA: "Quiero ser coach" → onboarding web.
Planes y precios (selector de país AR/CL):

GRATIS $0 — Registrá entrenos, Tabata, 3 rutinas, historial 10 días. CTA "Empezar gratis".
PRO $4.500/mes — Rutinas ilimitadas, plan semanal, gráficos completos, fotos de progreso, sin publicidad. CTA "Hacerme PRO". Badge "Más elegido".
PRO + COACH desde $22.000/mes — Todo PRO + tu coach personal: rutinas a medida, chat directo, check-in semanal. "El precio lo define cada coach." CTA "Ver coaches".


Prueba social: placeholder honesto V1: "Coaches fundadores" con 3–5 perfiles reales aprobados (foto, especialidad) — no inventar testimonios.
Sección promotores (V1.5, oculta en V1): "Recomendá Forzza y ganá el 20% de lo que generen tus referidos durante 12 meses."
FAQ (8): ¿La app es gratis? · ¿Cómo elijo coach? · ¿Puedo cancelar cuando quiera? (sí, desde la app, sin permanencia) · ¿Cómo cobran los coaches? · ¿Qué pasa con mis datos y fotos? (privadas, cifradas, las podés borrar) · ¿Hay app para iPhone y Android? · ¿Menores de 18? (con consentimiento parental) · ¿En qué países está disponible?
Footer: T&C, Privacidad, soporte@forzza.app, redes.
Captura de leads: email "Avisame cuando llegue a mi país" (selector de país — alimenta priorización de mercados).

10.2 Eventos de analytics de landing
landing_view {variant}, cta_download_click {store}, cta_coach_click, pricing_view {country}, plan_card_click {plan}, faq_open {q}, lead_submitted {country}. Conversión objetivo: visita→click store >8%; visita→lead coach >1,5%.

11. Design specs mobile
11.1 Design system (base: StyleGuide observado en el prototipo — se conserva)
Principios: dark-first (contexto gym, poca luz), una sola acción primaria por pantalla, números grandes y legibles a 1 m (en banco de gym), feedback inmediato (confetti al finalizar, pulso en timers), cero texto superfluo durante el workout.
Tokens (observados en el código, ratificados):

Colores: accent #C8FF00, accentD #8FB800, bg #080810, superficies s0 #0E0E18 / s1 #141420 / s2 #1C1C2C / s3 #242436, gray #6868A0, grayL #9898C0, white #F0F0FF, red #FF4466, blue #4488FF, orange #FF8840 (identidad coach). Colores por tipo de rutina: fuerza lima, espalda azul, piernas naranja, cardio rojo, descanso gris, fullbody violeta #A78BFA.
Tipografías: Bebas Neue (display/CTAs), DM Sans 300–700 (UI), Space Mono (métricas/números).
Espaciado: escala 4 px (4/8/12/16/20/24); radios 7–18 px (cards 12–14, sheets 18, pills 100); sombras mínimas, jerarquía por superficie; estados: disabled = s2 + gray, error = red border inline, success = accent.
Iconografía: set SVG propio (SvgIcon) stroke 1.8 — mantener, no mezclar librerías.

Componentes (existentes a portar a RN + faltantes): Button (primary/secondary/ghost/danger), Input + NumInput + WeightInput (kg/lb), Pill, Card, Sheet modal, Toast (nuevo), Tabs, EmptyState (nuevo, ilustración + CTA — criterio Sprint 6 del plan), ErrorState (nuevo), Skeleton loading (nuevo), PaymentSummary, NotificationRow, CalendarMonth, LineChart, RestTimer, Confetti, UpgradeModal, AdScreen (autopromo).
11.2 Specs

Breakpoints: diseño base 390×844; mínimo soportado 360×640; safe areas iOS.
Navegación: bottom nav 5 tabs — Inicio · Rutinas · Progreso · Chat · Perfil (observado; Grupos NO entra como 6° tab en V1). Stack modals para checkout/wizard.
Accesibilidad: contraste AA (lima sobre #080810 cumple para texto grande; para texto <18 px usar white), targets ≥44 px, dynamic type en textos no críticos, labels de accesibilidad en iconos.

11.3 Flujos críticos con criterios de aceptación (extracto de los 12; el resto sigue el mismo formato en el backlog §15)
Flujo Compra de paquete coach (P0): Marketplace → Perfil coach → Elegir paquete → (si falta) Datos fiscales → (si <18) bloqueo con explicación → Checkout MP → Confirmación → Home "Pendiente de asignación" → push N4 al aceptar.

AC1: usuario Free puede navegar marketplace pero el CTA "Contratar" abre el flujo de pago solo si está logueado y verificado.
AC2: tras pago aprobado (webhook MP payment.approved), el alumno ve estado "Pendiente de asignación" en ≤5 s y el coach recibe N3.
AC3: si el coach no acepta en 24 h, el dueño recibe N5; a las 72 h sin aceptación se ofrece reasignación o refund automático.
AC4: doble webhook del mismo pago no duplica la suscripción (idempotencia por payment_id).
AC5: pago rechazado muestra error con motivo de MP y CTA reintentar; no se crea asignación.

Flujo Upgrade PRO (P0): trigger desde UpgradeModal (4ª rutina, día 11 de historial, foto de progreso, quitar autopromo) → Mi Plan → checkout (IAP en iOS / MP en Android-web) → entitlement vía RevenueCat.

AC1: isPro se actualiza en ≤10 s tras compra en todas las plataformas; AC2: restore purchases funciona en reinstalación; AC3: cancelación deja PRO activo hasta fin de ciclo; AC4: downgrade no borra datos (rutinas en solo lectura, historial truncado solo en vista).

Flujo Workout (P0): Home → Rutina del día → (Free: autopromo 10 s con Saltar deshabilitado 10 s — observado en spec del plan) → ejecución por bloques → RestTimer → finalizar → resumen + confetti → datos a Progreso.

AC1: el workout sobrevive a kill de la app (estado persistido localmente, se ofrece retomar); AC2: funciona offline y sincroniza al volver (cola local); AC3: cambio kg/lb consistente en toda la sesión.

Flujo Check-in (P0): push N8 → formulario (preguntas de la plantilla del coach, observadas: sesiones completadas, energía, sueño, campo libre) → enviar → visible para coach con historial semana a semana.

AC: respuesta parcial se guarda como borrador; coach ve tabla por alumno con tendencia; recordatorio único +24 h si no respondió.

Flujo Cancelación (P0): Perfil → Mi Plan → Cancelar → encuesta 1 pregunta (opcional) → confirmación con fecha de fin → email. AC: nunca más de 3 taps hasta "Confirmar cancelación"; sin retención oscura (cumple políticas de stores y normativa de consumo ES/UK).

12. Design specs desktop (backoffices + dashboard promotor)

Layout: sidebar 240 px (observado, se mantiene) + contenido fluido; breakpoints 1024/1280/1536; en <1024 los backoffices muestran aviso "Usá Forzza desde una pantalla más grande" (V1 no responsive móvil para BO — decisión de alcance).
Tablas: ordenamiento por columna, filtros persistentes en URL, paginación 25/50, estados vacíos con CTA, export CSV (V1.5), columnas monetarias en Space Mono alineadas a la derecha.
Formularios: validación inline (patrón observado: borde rojo + mínimo permitido en precios), guardado explícito con toast, dirty-state warning al salir.
Dashboard dueño — criterios de aceptación: AC1: KPIs (MRR, usuarios por plan, coaches por estado, GMV, liquidaciones pendientes) con datos reales y rango temporal; AC2: badge de pendientes (constancias >48 h, facturas >72 h) visible desde cualquier sección; AC3: aprobar/rechazar constancia con preview del PDF inline y motivo obligatorio al rechazar (observado en mock, se ratifica); AC4: toda acción de dinero queda en un audit log inmutable (tabla audit_log — nuevo, P0).
BO coach — criterios: AC1: configurar precio < piso bloquea guardado con error inline (observado, ratificado); AC2: la liquidación muestra desglose bruto/comisión/neto por alumno (existe el cálculo en mock con 15% — actualizar a 20%); AC3: subir factura acepta PDF/JPG ≤10 MB, número de factura validado contra duplicados; AC4: calendario asigna rutina por alumno/día en ≤2 clics (patrón observado calPick, se mantiene).
Dashboard promotor (V1.5): página única: código/link con copy-to-clipboard, tabla de referidos (fecha, tipo, estado, revenue atribuible), comisiones devengadas/pagadas, botón "Cargar factura" en cierre trimestral.


13. Modelo de datos
Entidades principales (PostgreSQL; PK uuid; timestamps created_at/updated_at en todas; RLS por rol):
EntidadCampos claveReglas/Estadosusersemail único, password_hash (Supabase Auth), name, last_name, birth_date, sex, country, role (student/coach/owner/promoter), plan (free/pro/coach), locale, units (kg/lb), parental_consent_at, deleted_at<18 sin parental_consent_at no puede contratar coach; soft deletestudent_profilesuser_id FK, goal, level, height, fiscal_doc (dni), phone, addressfiscal_* requeridos solo al primer checkout de coachcoach_profilesuser_id FK, bio, specialty, tags[], certifications[], fiscal_status (pending/in_review/approved/rejected), fiscal_doc_type (CUIT/RUT/UTR/NIF…), fiscal_doc_number, fiscal_file_url, bank_data jsonb (por país), billing_model (sub_fija/comision), marketplace_visible boolmarketplace_visible = fiscal_status='approved' AND precios≥piso; billing_model cambia a 'comision' al 4° alumno activo y no reviertecountry_configcode, currency, pro_price, coach_floor jsonb {starter,pro,elite}, coach_sub_price, commission_rate (default 0.20), gateway (mp/stripe), active boolAdministrable solo por owner; reemplaza constante PRICINGcoach_packagescoach_id, tier (starter/pro/elite), price, countryprice ≥ floor del país (constraint + validación)subscriptionsuser_id, type (pro/coach_package/coach_sub), package_id?, coach_id?, status (active/past_due/canceled), gateway, gateway_sub_id, current_period_end, cancel_atdunning días 0/2/5; past_due >5 días → canceledpaymentssubscription_id, amount, currency, gateway_payment_id único (idempotencia), status (approved/rejected/refunded/chargeback), fee_gateway, paid_atinmutable; chargeback dispara N22 + suspensióncoach_assignmentsstudent_id, coach_id, package_tier, status (pending/accepted/rejected/active/ended), requested_at, accepted_atpending >72 h → reasignación/refund; chat habilitado solo en accepted/activesettlementscoach_id, period_start/end, gross, commission, net, status (open/invoice_pending/invoice_uploaded/approved/rejected/transferred), invoice_number, invoice_file_url, rejection_reasontransferred requiere approved; invoice_number único por coachroutinesowner_id (student o coach), assigned_student_id?, name, type, exercises jsonb (snapshot por ejecución), is_templaterutina de coach no editable por alumnoexercise_libraryname_es, name_en, muscle_group, equipment, svg_id, sourceseed: base de 234 ejercicios existenteworkout_sessionsstudent_id, routine_snapshot jsonb, started_at, finished_at, sets jsonb (peso/reps por set), source (live/manual)Free: vista truncada a 10 días (regla en query, no se borra dato)body_metrics / progress_photosstudent_id, weight, fat_pct, measures jsonb / photo_url, angle (front/side/back), taken_atdato sensible: bucket privado, URL firmada, visible a coach solo con assignment activocheckin_templates / checkin_responsescoach_id, questions jsonb, schedule_dow / assignment_id, answers jsonb, week1 respuesta por semana por assignmentmessagesassignment_id, sender_id, body, attachment_url?, read_atsolo entre partes del assignment activo; retención post-fin: solo lectura 90 díasnotificationsuser_id, type, payload jsonb, channels[], read_at, sent_atcap 3 push/día por usuariopromoters / referrals / promoter_payoutsuser_id, code único, rate (default 0.20) / promoter_id, referred_user_id único, attributed_at, channel / promoter_id, period, amount, status, invoice_urlreferral único por usuario referido; payout ≥ €50; devengo desde mes 2tickets / audit_loguser_id, category, subject, body, status, priority / actor_id, action, entity, entity_id, before/after jsonbaudit_log append-only para toda acción de dinero/validación
Permisos (RLS resumen): student lee/escribe solo lo propio; coach lee datos de alumnos solo con assignment activo (y fotos solo en paquetes Pro/Elite — regla observada en el plan); owner todo; promoter solo sus referrals agregados (sin PII del referido: nombre enmascarado).
14. API specification (Edge Functions / RPC sobre Supabase; REST-like)
EndpointMétodoRolInputOutputReglasErrores/auth/*—público——Delegado a Supabase Auth (signup, login, recovery, OAuth Apple/Google)400/401/429/meGETauth—user+profile+entitlementsisPro/hasCoach calculado server-side401/mePATCHauthcampos editablesuserno permite cambiar role/plan400, 403/me/deletePOSTauthpasswordoksoft delete + cancelación de subs + cola de anonimización 30 d401/routinesGET/POSTstudent/coachfiltros / routinelista / routineFree: POST bloqueado si ≥3 (403 UPGRADE_REQUIRED)403/routines/:idPATCH/DELETEowner de la rutina——asignada por coach → alumno 403403, 404/workoutsPOSTstudentsession (sets, snapshot)sessionidempotente por client_uuid (offline sync)409/progressGETstudent; coach con assignmentrangemétricas+sesionesFree: range máx. 10 días (truncado server-side)403/photosPOST/GETstudent; coach lectura (Pro/Elite)multipart / —url firmadabucket privado; límite 100 fotos403, 413/marketplace/coachesGETpúblicocountry, tagscoaches visiblessolo fiscal_status=approved—/checkout/coachPOSTstudent verificadocoach_id, tier, fiscal_data?init_point MP / client_secret Stripe<18 sin consentimiento → 403; crea preapproval402, 403/webhooks/mp · /webhooks/stripe · /webhooks/revenuecatPOSTfirma del proveedorevento200idempotencia por event_id; actualiza payments/subscriptions; dispara N2/N3/N10401 firma inválida/assignments/:id/accept · /rejectPOSTcoachmotivo?assignmentsolo pending; accept habilita chat + N4403, 409/checkins/templates · /checkins/respondPOSTcoach / studentquestions / answers—1 respuesta/semana409/messagesGET/POST (Realtime)partes del assignmentbody, attachment?messageassignment activo; adjuntos ≤50 MB video403, 413/coach/pricesPUTcoach{tier:price} por paíspricesprice ≥ floor (422 con mínimo)422/coach/settlements · /:id/invoiceGET / POSTcoach— / pdf+numbersettlements / settlementnúmero único; estado→invoice_uploaded + N hacia owner409 duplicado/admin/coaches/:id/fiscalPOSTownerapprove/reject+reasoncoachaudit_log; N14403/admin/settlements/:idPOSTownerapprove/reject/transfersettlementtransfer solo si approved; audit_log; N12/N13409/admin/country-configGET/PUTownerconfigconfigcambio de comisión aplica a ciclos futuros403/promoter/dashboard · /admin/promotersGET / CRUDpromoter / owner—referidos+comisionesdatos agregados sin PII403/eventsPOSTauthbatch analytics202proxy a PostHog con scrub de PII—

15. Backlog priorizado
Esfuerzo: S ≤2 días · M ≤1 semana · L ≤2 semanas. AC completos por historia se derivan de §11–14; aquí el criterio principal.
IDÉpicaHistoriaPrioridadEsfuerzoDependenciasAcceptance criteria (principal)F-001FundacionesMonorepo (app Expo + web Next + supabase/) con CI, lint, envsP0M—pnpm dev levanta los 3 targets; deploy preview por PRF-002FundacionesEsquema DB + RLS + seeds (países, ejercicios, planes)P0LF-001Tests de RLS por rol pasan; seed de 234 ejercicios cargadoA-010AuthSignup/login/recovery + OAuth Apple/Google + verificación emailP0LF-002Flujos completos en app y web; bloqueo 5 intentosA-011AuthConsentimiento parental <18P0MA-010<18 no puede llegar a checkout sin consentimiento registradoA-012AuthEliminar cuenta self-serviceP0SA-010Soft delete + cancelación subs + email de confirmaciónC-020Core entrenoPort de pantallas: Home, Rutina del día, Workout activo, Registrar entrenoP0LF-002Paridad visual con prototipo; offline-first del workoutC-021Core entrenoCrear Rutina (wizard 4 pasos, sin escáner IA) + Plan semanalP0LC-020Free bloquea 4ª rutina con UpgradeModalC-022Core entrenoProgreso (gráficos, métricas) + truncado Free 10 díasP0MC-020Truncado server-side verificadoG-030GatingisPro/hasCoach server-side + UpgradeModal + autopromo 10 sP0MF-002Criterios Sprint 1 del plan se cumplen tal cualP-040PagosRevenueCat + IAP PRO (iOS) + Play Billing + MP suscripción PRO (web/Android)P0LA-010Entitlement consistente multi-plataforma; restore OKP-041PagosCheckout paquete coach con MP preapproval + webhooks idempotentesP0LF-002AC1–AC5 del flujo de compra (§11.3)P-042PagosDunning días 0/2/5 + estados past_due/canceledP0MP-041Recovery medido; suspensión a los 5 díasM-050MarketplaceListado + perfil de coach (sin ratings) + datos fiscales del alumno en checkoutP0MP-041Solo coaches approved visiblesM-051MarketplaceFlujo post-pago: assignment pending→accept→chat habilitado + N2/N3/N4/N5P0LP-041Criterios Sprint 2 del planBC-060BO CoachDashboard, Mi Perfil, Mis Alumnos (núcleo), Rutinas, CalendarioP0LF-002Asignación rutina/día en ≤2 clicsBC-061BO CoachCobros: precios con piso, liquidaciones, carga de factura, datos bancariosP0LP-041Comisión 20%; error inline bajo pisoBC-062BO CoachCheck-ins: plantilla + respuestas + push N8/N9P0MM-051Criterios Sprint 3 del plan (check-in)BO-070BO DueñoUsuarios (filtro plan), Entrenadores (validación constancia con preview), audit logP0LF-002Aprobar/rechazar con motivo; audit append-onlyBO-071BO DueñoFinanzas: aprobar/rechazar facturas, marcar transferido, N11–N13P0MBC-061Sin factura aprobada no hay transferidoBO-072BO DueñoConfiguración global (country_config editable) + cambio sub→comisión 4° alumnoP0MF-002Cambio automático notifica N18 y no revierteN-080NotifsInfra push/email + centro + preferencias + matriz V1 (N1–N15, N18, N22)P0LM-051Eventos críticos llegan por ≥2 canalesL-090LandingLanding + pricing + lead capture + legales + SEOP0MF-001Copy §10; Lighthouse ≥90S-100StoresPublicación TestFlight + closed testing Play (14 días/12 testers) + assetsP0LP-040Checklists §9 completos; demo accountsQ-110CalidadEstados vacíos/error/loading transversales + Sentry + PostHogP0MC-020Sin pantalla sin empty/error stateV15-1V1.5Fotos de progreso + visor coachP1MM-051Bucket privado, URLs firmadasV15-2V1.5Chat con adjuntos de video + visor inlineP1LM-051≤50 MB, transcodificación diferidaV15-3V1.5Tabata inteligente por grupo muscularP1SC-02090/120/30 s según grupo (spec del plan)V15-4V1.5Promotores: códigos, atribución, dashboard, payout trimestralP1LP-041Anti-auto-referido activoV15-5V1.5Export CSV finanzas + proyeccionesP1MBO-071Por mes y paísV15-6V1.5Soporte (tickets) + Pagos del alumnoP1MF-002SLA visibleV2-1V2Chile end-to-end (MP CL) + España (Stripe + OSS o Paddle)P1LV15-4Decisión MoR tomadaV2-2V2Análisis corporal comentado; Sesiones en vivo; Nutrición (Elite)P2LV15-2Disclaimers legales nutriciónV2-3V2Grupos + challenges; ratings reales; Apple Health/Google Fit; escáner IAP2/P3LV2-1—
16. Plan de releases

V0 (hecho): prototipo navegable — existe (forza-complete.jsx). Falta solo la validación con coaches reales (acción inmediata, semanas 0–2, en paralelo).
V1 MVP comercial (semanas 1–16, AR): F-001→S-100 + Q-110. Hito de salida: el flujo Free→PRO→contratar coach→check-in→liquidación→transferencia corre end-to-end sin intervención manual salvo aprobar constancia/factura y transferir (criterio Sprint 6 del plan, ratificado).
V1.5 (semanas 17–24): V15-1…V15-6. Hito: promotores activos con primer payout trimestral ejecutado.
V2 expansión (meses 7–12): Chile + España, V2-2 parcial. Hito: primer coach no-argentino cobrando.
V3 marketplace avanzado (año 2): UK/DE/DK con localización EN/DE, Stripe Connect para payout automático (elimina facturación manual), ratings, grupos, B2B gimnasios exploración.

17. Analytics plan (PostHog; sin PII; user properties: plan, country, role)
EventoUsuarioCuándoPropiedadesObjetivoMétricasignup_completedalumno/coachfin onboardingrole, country, age_bracketactivaciónfunnel signupworkout_started / workout_completedalumnoinicio/fin sesiónroutine_type, duration, sourceengagementsesiones/sem; D7/D30routine_createdalumno/coachguardar rutinan_exercises, has_supersetadopción builderrutinas/usuarioupgrade_modal_shown / upgrade_started / purchase_succeededalumnogating/checkouttrigger, plan, gateway, pricemonetizaciónconversión Free→PROad_autopromo_shown / ad_skippedFreepre-rutinaplacementpresión a upgradeskip ratemarketplace_viewed / coach_profile_viewed / package_checkout_started / package_purchasedalumnonavegación/compracoach_id, tier, countryGMVfunnel marketplaceassignment_acceptedcoachaceptarhours_to_acceptSLA coachmediana <12 hcheckin_sent / checkin_answeredsistema/alumnosemanalweek_nretención coacheetasa respuesta >70%message_sentamboschathas_attachmentrelaciónmensajes/assignment/semsettlement_invoice_uploaded / settlement_transferredcoach/ownerliquidaciónamount_bucket, days_opensalud payoutdías a transferencia <7subscription_canceledalumnocancelarreason, months_activechurnchurn mensual por planreferral_attributed / referral_convertedsistemaregistro/pagopromoter_id, typecanal promotorconversiones/promotor
18. QA y testing plan

Unit: lógica de gating (isPro, truncado 10 días, límite 3 rutinas), cálculo de liquidaciones (bruto/comisión/neto, redondeos por moneda), pisos de precios, cambio sub→comisión, atribución de referidos. Cobertura objetivo 80% en core/billing.
Integración: webhooks MP/Stripe/RevenueCat con replays e idempotencia (mismo evento ×3 → 1 efecto); RLS por rol (suite que intenta accesos cruzados y espera 403); dunning con relojes simulados.
E2E (Maestro para app, Playwright para web): los 5 flujos de §11.3 + validación de constancia + liquidación completa. Corren en CI contra entorno staging con MP sandbox.
Mobile: matriz iPhone SE/14/15 Pro Max, Android 10–15 gama baja y alta; offline (modo avión durante workout); deep links de push; permisos cámara/notificaciones denegados.
PWA: instalabilidad, SW update flow, Lighthouse ≥90.
Pagos: tarjetas de prueba MP (aprobada, rechazada por fondos, contracargo), reembolso, cancelación a mitad de ciclo, IAP sandbox + restore.
Notificaciones: quiet hours, cap diario, agrupación de chat, fallback email cuando push desactivado.
Pre-review stores: checklist §9 + cuenta demo poblada + video de los flujos para el revisor; ensayo de rechazo 3.1.1 con respuesta preparada.

19. Riesgos críticos y mitigaciones
RiesgoSeveridadProbabilidadImpactoMitigaciónOwnerMargen marketplace insuficiente al 15%AltaCerteza (calculado)Negocio no autosostenibleComisión 20% + pisos recalculados (decisión firme §4.3)DueñoApple rechaza cobro web de paquetes (3.1.1)AltaMediaBloquea iOS o regala 30%Argumentación 3.1.3(e) preparada; plan B: iOS solo informativo para paquetesTech leadEstructura fiscal de agente de cobro en AR (IIBB/Ganancias sobre flujo total)AltaMediaMargen AR cae a <5%Dictamen contable antes de V1; contrato de mandato de cobroDueño + contadorLeakage coach-alumnoMediaAltaPérdida de GMV recurrenteValor operativo > comisión; cláusula no-elusión; señales de detecciónProductoPayout manual no escala (>50 coaches)MediaAlta a 12 mesesCuello operativo del dueñoAuto-aprobación con matching; V3 Stripe Connect/MP splitTech leadVenta a EU sin registro IVA (ES test)AltaMediaMultas, bloqueoOSS o Paddle MoR antes de la primera venta EU; no activar ES hasta decidirDueñoPromotores reclasificados (laboral/fiscal)MediaBaja-mediaContingencia por paísContrato de referidos sin exclusividad/subordinación; pago contra facturaDueño + legalDatos sensibles (fotos corporales) filtradosAltaBajaDaño reputacional/GDPRBuckets privados, URLs firmadas, cifrado, acceso solo con assignmentTech leadChurn alto de PRO frente a Hevy/Strong gratisMediaMediaLTV bajoDiferenciación por coach + contenido ES + precio local bajoProductoDependencia de una sola persona (dueño) para validacionesMediaAltaSLA de aprobaciones se degradaAuto-aprobaciones + alertas N5/N15 + delegación futuraDueño
20. Información faltante
Dato faltantePor qué importaCómo validarloPrioridadEntidad legal y residencia fiscal del dueñoDefine pasarelas, cuentas de stores, IVA EU, contratosReunión con contador AR + asesor para EU (¿SAS argentina? ¿LLC/SL futura?)P0Tratamiento fiscal del agente de cobro (IIBB)Determina si el 20% alcanzaDictamen contable con el flujo de §6.9P0Tarifa exacta de MP Suscripciones AR/CL para la cuenta propiaEl 6,04% es tarifa online genéricaCrear cuenta MP vendedor y simular en panelP0Disposición real de coaches a pagar 20%Hipótesis central10 entrevistas + 5 cartas de intenciónP0¿Brasil queda o se elimina?Está en el código, no en el briefDecisión del dueñoP1Identidad de marca FORZA vs Forzza + disponibilidad de dominio/marcaRegistro de stores y legalBúsqueda INPI/EUIPO + dominiosP1Acuerdos actuales con promotores (si existen)Diseño del contrato de referidosPedir al dueño términos conversadosP1Política de Google sobre facturación alternativa en ARPodría ahorrar fee de PlayRevisar Play Console al publicarP2Costos de video (storage/streaming) a escalaCuotas por usuarioPoC con 50 videos realesP2
21. Decisiones finales
Firmes (con justificación en el documento):

Comisión del marketplace 20% (no 15%) con pisos recalculados (§4.3).
V1 solo Argentina; orden de expansión AR→CL→ES→(UK/DE/DK).
Stack: Expo/React Native + Next.js + Supabase + MP/Stripe + RevenueCat + PostHog + Sentry (§8).
PRO por IAP en iOS; paquetes de coach por web/MP (§8.1).
Alta de coach se muda a web; la app móvil es solo del alumno.
Postergar: grupos, sesiones en vivo, nutrición, análisis corporal comentado, escáner IA, feedback con votos, Health/Fit.
Eliminar de Elite: "3 coaches especializados" y "Análisis IA semanal".
Free usa autopromo de PRO en lugar de SDK de publicidad de terceros en V1.
Regla sub→comisión al 4° alumno se mantiene y no revierte.
i18n y GDPR-readiness desde V1 aunque se lance solo en AR.

Tentativas (requieren confirmación del dueño):

Sin trial de PRO (el Free actúa de trial). — Alternativa: 7 días de PRO al registrarse.
Sin prorrateo en cambios de paquete (aplica al ciclo siguiente).
Promotores al 20% del neto por 12 meses vs. bounty fijo (decidir en V1.5 con datos).
Solo iPhone (sin iPad) en V1.
Liquidaciones quincenales (vs. mensuales).

Requieren validación externa antes de ejecutar:

Estructura de agente de cobro y dictamen IIBB (contador).
OSS vs. Paddle MoR para España (asesor fiscal EU).
Contrato de referidos por país (abogado).
Marca y dominio definitivos.


22. Prompt para Claude Code
Copiar y pegar tal cual (ajustar rutas si cambia el nombre del repo):
Sos el equipo de desarrollo de Forzza, una plataforma fitness de 3 caras (app móvil de alumnos,
backoffice web de coaches, backoffice web del dueño + landing). Vas a construir el MVP comercial (V1)
siguiendo estrictamente el documento `docs/forzza-master-doc.md` de este repositorio, que contiene
modelo de datos (§13), API spec (§14), backlog priorizado (§15), criterios de aceptación (§11–12),
matriz de notificaciones (§7) y decisiones de stack (§8). El prototipo visual de referencia es
`reference/forza-complete.jsx`: replicá su diseño (tokens en §11.1) pero NO copies su arquitectura
(es un single-file showcase con datos mock).

STACK (decisión firme, no proponer alternativas):
- Monorepo pnpm + Turborepo: apps/mobile (Expo SDK más reciente, React Native, TypeScript estricto),
  apps/web (Next.js App Router: landing + /admin + /coach), packages/ui (tokens y componentes
  compartidos), packages/core (tipos, zod schemas, lógica de billing pura y testeable),
  supabase/ (migraciones SQL, políticas RLS, edge functions en Deno).
- Supabase: Auth (email+password con verificación, OAuth Apple y Google), Postgres con RLS,
  Storage (buckets privados: progress-photos, fiscal-docs, invoices, videos), Realtime para chat.
- Pagos: Mercado Pago preapproval/suscripciones con webhooks idempotentes; RevenueCat para IAP de
  PRO en iOS/Android. NO implementes Stripe todavía (V2).
- PostHog (eventos de §17), Sentry, Resend para emails.

C�MO INICIAR:
1. Scaffolding del monorepo + CI (lint, typecheck, tests) + .env.example documentado.
2. Migración inicial: TODAS las tablas de §13 con constraints y RLS; tests de RLS que verifiquen
   accesos cruzados prohibidos (alumno no lee a otro alumno; coach solo lee alumnos con
   assignment activo; promoter no lee PII).
3. Seeds: country_config (AR y CL con commission_rate 0.20, precios de §5), exercise_library
   (importar desde el Excel de 234 ejercicios si está en /reference, si no crear 30 ejercicios base
   y dejar TODO), cuentas demo (owner, 2 coaches, 5 alumnos en distintos planes).

ORDEN DE CONSTRUCCIÓN (respetá las dependencias del backlog §15):
F-001 → F-002 → A-010..A-012 → C-020..C-022 → G-030 → P-040..P-042 → M-050..M-051 →
BC-060..BC-062 → BO-070..BO-072 → N-080 → L-090 → Q-110 → S-100.
Un PR por historia del backlog. Cada PR: descripción con el ID de historia, tests que cubren sus
acceptance criteria, y captura/video si toca UI. Commits convencionales (feat:, fix:, test:).

REGLAS DE NEGOCIO INNEGOCIABLES (validá contra §6 y §13):
- isPro()/hasCoach() SOLO server-side; el cliente solo cachea.
- Free: máx 3 rutinas, historial visible 10 días (truncado en query, nunca borrar datos),
  autopromo de 10 s antes de rutina/Tabata.
- Comisión marketplace 20% leída de country_config (jamás hardcodeada).
- Precio de coach >= piso del país (constraint en DB + validación con error inline).
- Sin factura aprobada no existe estado "transferido". Toda acción de dinero escribe en audit_log.
- billing_model del coach pasa a "comision" al 4° alumno activo y nunca revierte.
- Webhooks idempotentes por gateway_payment_id/event_id (test: mismo evento 3 veces = 1 efecto).
- Fotos corporales y constancias: buckets privados + URLs firmadas TTL 1h. Nada de esto va a logs
  ni a PostHog.
- Menor de 18 sin parental_consent_at no llega al checkout de coach.

QUÉ NO DEBES HACER:
- No implementar: grupos, sesiones en vivo, nutrición, escáner IA de fichas, ratings, Stripe,
  módulo promotores (son V1.5/V2; dejá las tablas de promotores creadas pero sin UI).
- No usar Firebase, no usar Redux (estado con React Query + Zustand), no CSS frameworks externos
  en mobile (StyleSheet + tokens de packages/ui).
- No inventar copy: usá los textos de §10 y §7; lo que falte, marcalo con TODO_COPY.
- No mergear sin tests verdes ni con criterios de aceptación incumplidos.

C�MO TESTEAR: Vitest en packages/core (cobertura 80% en billing), tests de RLS en supabase/tests,
Playwright para /admin y /coach (flujos: validar constancia, aprobar factura, configurar precios),
Maestro para mobile (signup, workout offline, upgrade PRO, checkout coach en sandbox MP).

VALIDACIÓN CONTRA SPECS: antes de cerrar cada épica, generá un reporte en docs/progress/<epica>.md
listando cada acceptance criterion con PASS/FAIL y evidencia. Si una spec es ambigua, NO asumas:
abrí una entrada en docs/open-questions.md y seguí con lo no bloqueado.

23. Checklist final de preparación para desarrollo
Negocio/legal (bloqueantes):

 Decisión de marca FORZA/Forzza + dominio + búsqueda de marca registrable
 Entidad legal definida; cuenta bancaria operativa
 Dictamen contable: esquema de agente de cobro, IIBB, facturación de la comisión
 Contratos redactados: T&C alumno, contrato coach-plataforma (con no-elusión), privacidad (GDPR-ready), consentimiento parental, contrato de referidos (cajón hasta V1.5)
 10 entrevistas con coaches + 5 cartas de intención al 20%
 Confirmación: Brasil fuera (o dentro) del alcance

Cuentas y servicios:

 Apple Developer (entidad) + Google Play Console (+12 testers reclutados)
 Mercado Pago vendedor AR (tarifa de suscripciones confirmada en panel)
 Supabase, Vercel, Expo/EAS, RevenueCat, PostHog, Sentry, Resend con dominio verificado

Producto:

 Este documento aprobado por el dueño (en especial decisiones firmes §21)
 Pisos de precios recalculados con comisión 20% y cargados a country_config
 Copy de landing y de notificaciones revisado (§7, §10)
 Excel de 234 ejercicios exportado a seed (name_es/name_en, grupo muscular, equipamiento)
 Assets de stores: ícono 1024, screenshots por tamaño, textos ES/EN

Técnico:

 Monorepo inicial con CI verde
 Migración + RLS + seeds aplicados en staging
 Sandbox MP funcionando end-to-end con webhooks
 Cuentas demo para revisores de stores
 Plan de QA (§18) cargado como suites en CI

Verificación crítica final (Fase 12, ejecutada sobre este documento): (1) la contradicción países del código (BR, sin DK/DE/ES) vs. brief quedó explicitada y resuelta por decisión (§21/§20); (2) el único margen que no cerraba (15%) fue detectado por cálculo y corregido a 20% con números (§4.3); (3) el stack cubre App Store + Play + PWA + landing con un solo lenguaje (§8); (4) cada módulo tiene reglas y casos borde (§6) y cada decisión técnica tiene alternativa evaluada (§8.1); (5) lo que no se pudo validar quedó en §20 con método de validación — nada quedó afirmado sin fuente, cálculo o supuesto declarado.