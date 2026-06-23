# Consulta para abogado y contador — Cobro de paquetes de coach

> **Estado:** borrador para validación externa (HUMAN_REQUIRED).
> **Fecha:** 2026-06-23.
> **Origen:** decisión de modelo de cobro del marketplace de coaches (ver `docs/open-questions.md`, entradas 2026-06-23).
> Este documento reúne **dos consultas independientes** que definen la arquitectura de cobro: (A) políticas de Apple App Store y Google Play; (B) estructura fiscal en Argentina.

---

## Contexto del producto

Forzza es un marketplace de fitness (app iOS+Android y web). Hay **dos productos de pago distintos**:

- **(a) Suscripción PRO de Forzza** — producto propio de Forzza. Se vende por **IAP** (Apple/Google) con RevenueCat en mobile y por Mercado Pago en web. **No es objeto de estas consultas.**
- **(b) Paquetes/planes de un coach** — un alumno contrata a un entrenador del marketplace (plan personalizado + seguimiento). Se quiere cobrar **solo por Mercado Pago vía web/browser**, nunca por IAP, para evitar la comisión del 30% de las stores. **Estas consultas son exclusivamente sobre (b).**

Modelo de facturación elegido (Modelo A, tipo Mercado Libre): cada parte factura **su porción al alumno** (consumidor final). El coach factura su neto; Forzza factura su comisión (20%). Objetivo declarado del dueño: dejar claro que **el coach NO es empleado de Forzza** (prestador independiente).

---

# Parte A — Consulta para abogado especializado en App Store / Google Play

## A.1 Lo que ya verificamos contra fuentes primarias (jun 2026)

Fuente: Apple App Store Review Guidelines §3.1 y Google Play Payments policy (textos vigentes a junio 2026).

**Regla dura 1 — Existe una exención de IAP para servicios persona-a-persona.**
Apple §3.1.3(d) (verbatim): *"If your app enables the purchase of real-time person-to-person services between two individuals (for example tutoring students, medical consultations, real estate tours, or **fitness training**), you may use purchase methods other than in-app purchase to collect those payments. One-to-few and one-to-many real-time services must use in-app purchase."*
Google Play (verbatim): exime el "1:1 online paid service" si *"the paid service is between two individuals"* AND *"the paid service is not available for replay afterwards"*, y nombra *"health coaching (such as personal trainer sessions)"*.

**Regla dura 2 — La exención del IAP y el anti-steering son reglas SEPARADAS.**
Apple §3.1.3 preámbulo (verbatim): *"Apps in this section cannot, within the app, encourage users to use a purchasing method other than in-app purchase, except for apps on the United States storefront... Developers can send communications **outside of the app** to their user base about purchasing methods other than in-app purchase."*
Apple §3.1.1(a) (verbatim): *"In all other storefronts, except for the United States storefront... apps and their metadata may not include buttons, external links, or other calls to action that direct customers to purchasing mechanisms other than in-app purchase."*
Google Play (verbatim): *"developers may not lead users to a payment method other than Google Play's billing system... This includes directly linking to a webpage that could lead to an alternate payment method or using language that encourages a user to purchase the digital item outside of the app."* (Excepción de menor alcance: apps **sin** compras digitales in-app pueden dar info *"without direct links"*.)

**Regla dura 3 — El alivio para "linkear afuera" es US-only o EU-only.**
- EE.UU.: tras Epic v. Apple (injunction abr/may 2025) se removió el anti-steering solo en el storefront de EE.UU. En dic-2025 el 9° Circuito permitió a Apple cobrar una comisión "razonable" sobre compras externas (pendiente de fijación de tasa). US-only.
- UE (DMA): External Purchase Link Entitlement permite links de compra externa, pero solo para apps distribuidas en la UE y con fees (Core Technology Commission ~5%). EU-only.
- **Ninguno aplica a Argentina** (mercado V1 de Forzza). Rige la regla dura conservadora.

## A.2 La zona gris central (lo que necesitamos que el abogado resuelva)

El paquete de Forzza, tal como está hoy, es un **plan + seguimiento asíncrono**, no una sesión en vivo 1:1. Las exenciones §3.1.3(d) (Apple) y "1:1 no replicable" (Google) están redactadas para servicios **en tiempo real entre dos personas**.

**Pregunta 1 (la decisiva):** ¿App Review acepta, en la práctica 2025-2026, un "plan de entrenamiento personalizado + seguimiento asíncrono del coach" como **servicio person-to-person exento de IAP** bajo §3.1.3(d), o lo clasifica como **contenido/servicio digital** obligado a IAP? De esto depende toda la viabilidad de cobrar (b) por fuera del IAP.

**Pregunta 2:** Si para asegurar la exención conviene posicionar el coaching como servicio 1:1 con seguimiento personal real del entrenador (no "programa digital descargable"), ¿qué características mínimas debe tener el servicio para calificar con seguridad (frecuencia de interacción del coach, personalización, no replicabilidad)?

**Pregunta 3:** En iOS Argentina, ¿mostrar el **precio** del paquete del coach dentro de la app (sin botón ni link de compra) constituye "encourage a purchasing method other than IAP", o solo lo es el botón/link? La guideline prohíbe alentar, pero no define si exhibir precio sin link ya es violación.

**Pregunta 4:** El plan de diseño (ver `docs/decisions/contratacion-coach-flujo.md`) propone que la contratación se **inicie fuera de la app** (email a la base, link propio del coach, web/SEO) y que la app solo dé **acceso a lo ya contratado**. ¿Este patrón (equivalente al de Netflix/Spotify/Kindle en iOS) es conforme? ¿Hay algún riesgo en que la app muestre el catálogo de coaches **sin precio y sin CTA de compra** (descubrimiento)?

**Pregunta 5:** ¿Riesgo concreto de rechazo/suspensión y cómo lo resuelven comparables (ClassPass, Mindbody, Trainerize, Fiverr) en LatAm? (En nuestra investigación, la práctica de estos comparables **no se pudo verificar con fuente primaria** — tratar como pregunta abierta.)

## A.3 Dictamen preliminar interno (2026-06-23)

> Postura conservadora pre-submission, **no dictamen firmado**. A validar por abogado especializado en stores.

- **iOS Argentina = Opción A endurecida.** No comercializar coach en la app: ni precio (aunque no haya link), ni botón, ni link a MP/web, ni copy de compra, ni "mandame el link por email", ni ruta de checkout. Catálogo solo informativo. Fundamento: la guideline prohíbe "encourage", no solo el link.
- **Android = conservador, igual que iOS al inicio.** Perfil/descubrimiento sí; checkout/MP/links directos no. Máximo copy neutro "se gestiona fuera de la app". No abrir más hasta validación firmante.
- **Riesgo principal = naturaleza del servicio, no Mercado Pago.** Si el paquete es servicio humano 1:1 real (en vivo/seguimiento individual/no replicable) hay buen argumento de exención person-to-person; si es plan digital/rutina prearmada/contenido desbloqueado, Apple/Google pueden exigir IAP. **Recomendación: reformular el paquete como servicio personal de entrenamiento 1:1.**
- **¿Precio en iOS sin link?** No, por prudencia (puede leerse como incentivo a compra externa).
- **¿Catálogo sin precio en iOS?** Sí, bajo riesgo si es informativo y sin lenguaje de compra.
- **¿Emails con link a la web?** Sí (comunicación fuera de la app, permitida por Apple y Google).

---

# Parte B — Consulta para contador (Argentina)

## B.1 Modelo elegido y lo que necesitamos confirmar

Modelo A: el **coach** factura su neto al **alumno**; **Forzza** factura su comisión (20%) **al alumno** (no al coach). Coach-neto + comisión-Forzza = total que paga el alumno (sin doble imposición). Datos fiscales del alumno se captan en el checkout (`billing_profiles`).

**Pregunta 1 — Comprobantes:** ¿Tipo exacto de comprobante (C/B/A) que emite cada parte según su categoría (monotributo/responsable inscripto/exento) y la del alumno (consumidor final)? ¿CUIT/domicilio del alumno son obligatorios siempre o dependen del monto?

**Pregunta 2 — IVA de la comisión:** ¿La comisión del 20% de Forzza al alumno es con IVA incluido o + IVA? ¿Cómo se documenta?

**Pregunta 3 — Comisión de Mercado Pago:** MP retiene su comisión de procesamiento (~6,29% + IVA en AR, variable por plazo de acreditación). Decisión del dueño: partirla 50/50 coach/Forzza. ¿Cómo se refleja contablemente esa retención y su IVA en las facturas de cada parte?

## B.2 La tensión crítica: independencia del coach vs flujo de fondos

El dueño quiere dejar claro que **el coach es un prestador independiente, no empleado**. Pero el modelo de cobro actual implica que **Forzza recibe el total por Mercado Pago, retiene su comisión y luego transfiere el neto al coach** quincenalmente (tabla `settlements`).

**Pregunta 4 (la decisiva):** ¿Ese flujo (Forzza administra el dinero del coach y se lo paga) **debilita** la independencia del coach frente a AFIP, dado que AFIP mira el flujo real del dinero y no solo los comprobantes? ¿Conviene **split payment** en el cobro (Mercado Pago Marketplace / split de dinero): la parte del coach va **directo a su cuenta MP** y solo la comisión cae en Forzza, sin que Forzza toque los fondos del coach?

**Pregunta 5:** Si se adopta split payment, ¿desaparece la figura de "transferencia Forzza→coach" y con ella la complejidad de las liquidaciones? ¿Hay impedimento fiscal/operativo en AR para el split?

**Pregunta 6:** ¿La comisión al 4° alumno activo (regla de negocio del coach) y el modelo de "sub fija → comisión" altera algo de lo anterior?

---

## B.3 Dictamen preliminar interno — fiscal/legal AR (2026-06-23)

> Postura preliminar, **no dictamen firmado**. A validar por contador y abogado.

- **Split payment recomendado.** Mercado Pago documenta Split Payments para marketplaces (el pago se divide automáticamente entre vendedor y marketplace; la comisión de MP se descuenta de los fondos del vendedor y luego la del marketplace sobre el saldo). Es **más limpio** que "Forzza cobra el 100% → retiene → liquida al coach cada 15 días", que empeora la foto fiscal/probatoria (Forzza parece administrar fondos del coach). Para defender independencia: el dinero del coach va **directo a su cuenta**; Forzza no "paga sueldo/liquidación/honorarios".
- **Independencia del coach (riesgo laboral — LCT).** El contrato debe evitar señales de subordinación: sin exclusividad; coach define disponibilidad y puede tener clientes propios; Forzza no controla horarios ni da órdenes técnicas de entrenamiento, no paga salario fijo, no impone vacaciones/sanciones/régimen disciplinario. Forzza solo fija reglas de calidad, seguridad, uso de plataforma y compliance. La LCT mira la **realidad** de la prestación; el contrato escrito no blinda por sí solo.
- **Facturación (ARCA).** Monotributistas emiten comprobante **C** a consumidor final; leyenda **"A CONSUMIDOR FINAL"**; en operaciones **≥ $10.000.000** identificar CUIT/CUIL/CDI o DNI. El checkout debe capturar datos fiscales **según monto y condición**, sin pedir de más.
- **Defensa del consumidor.** Venta por web/app exige **botón de arrepentimiento** visible y derecho de arrepentimiento **10 días**. Revisar excepción por servicio personalizado ya iniciado sin asumirla.
- **Datos de salud (Ley 25.326).** Forzza trata datos de fitness/progreso/cuerpo (sensibles/cercanos a salud). Mínimo: política de privacidad pública, consentimiento informado para datos de salud, finalidad y base legal claras, eliminación/exportación de datos, contrato de tratamiento con proveedores, cuidado especial con menores. (Parte ya cubierta en `docs/compliance/backlog.md`.)

## Decisiones que dependen de estas respuestas

- Si **(b) obliga a IAP** en iOS → cambia todo el modelo de cobro del coach (no se puede esquivar el 30% en iOS).
- Si conviene **split payment** (recomendado) → se rediseña `settlements` (deja de haber transferencia Forzza→coach).
- Hasta validación firmante, **no se rediseña la pantalla de cobros** más allá del ajuste defensivo de stores (ver `docs/decisions/contratacion-coach-flujo.md`). El **botón de arrepentimiento** y el ajuste de iOS sí son accionables ya (no dependen de la validación).
