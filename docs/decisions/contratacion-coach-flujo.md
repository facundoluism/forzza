# Decisión — Flujo de contratación de paquetes de coach (compliance stores)

> **Estado:** propuesto / parcialmente bloqueado por validación externa.
> **Fecha:** 2026-06-23.
> **Relacionado:** `docs/compliance/consulta-stores-y-fiscal.md`, `docs/open-questions.md` (entradas 2026-06-23), regla de negocio #3 y #8 (`CLAUDE.md`).

## Contexto

Los paquetes de coach se cobran solo por Mercado Pago web (nunca IAP) para esquivar la comisión del 30% de las stores. Releyendo las políticas primarias de Apple (§3.1.1, §3.1.3) y Google Play Payments, **la exención del IAP NO habilita el steering**: en iOS fuera de EE.UU./UE (es decir, en Argentina) está prohibido cualquier botón/link/CTA dentro de la app que dirija a un mecanismo de pago externo. Lo permitido es comunicar **fuera de la app**. Ver citas en `consulta-stores-y-fiscal.md` §A.1.

## Decisión

> Endurecida según dictamen preliminar de compliance (2026-06-23, ver `consulta-stores-y-fiscal.md` §A.3). iOS va **mucho más cerrado** que el planteo inicial; Android arranca igual de conservador.

- **iOS = Opción A (endurecida).** La app **no** comercializa coach de ninguna forma. **No mostrar:** precio del paquete (ni siquiera sin link), botón "contratar", link a Mercado Pago, link a la web, copy tipo "contratalo desde la web", botón "mandame el link por email", deep link a checkout, ni la ruta `/marketplace/checkout`. Catálogo de coaches solo en modo **informativo, sin lenguaje de compra**. Solo da acceso a "Mi coach" si el alumno **ya contrató**.
  - Fundamento: la guideline prohíbe "encourage", no solo el link → mostrar precio de algo no comprable in-app puede leerse como incentivo a compra externa.
- **Android = conservador (igual que iOS al inicio).** Puede mostrar perfil de coach y descubrimiento, pero **sin checkout in-app, sin abrir Mercado Pago, sin links directos**. Como máximo copy neutro: *"La contratación de coaches se gestiona fuera de la app."* No abrir más hasta validar con abogado firmante.
- **El marketplace de contratación es un producto WEB.** La app es del alumno para **usar** el plan (coherente con CLAUDE.md #8).
- **Reformular el paquete como servicio humano 1:1 real** (no "compra de plan digital"). Ver §"Reformulación del servicio" abajo.

### Copy por plataforma
**iOS — permitido:** *"Cuando tengas un coach asignado, vas a ver tu plan y seguimiento desde esta sección."*
**iOS — prohibido:** *"Contratá desde la web."* · *"Visitá forzza.com para pagar."* · *"Este coach cuesta $X."* · *"No disponible para compra en la app."* · *"Mandame el link por email."*
**Android — tolerable (a validar):** *"La contratación de coaches se gestiona fuera de la app."*
**Android — evitar:** *"Entrá a la web para contratar."* · *"Pagá con Mercado Pago."* · *"Contratá más barato en la web."*

## Reformulación del servicio (producto)

El mayor riesgo de stores **no es Mercado Pago, es la naturaleza del servicio**: ¿es un servicio humano 1:1 real o un producto digital consumido en la app? Para defender la exención person-to-person, el paquete debe presentarse y funcionar como **entrenamiento personal 1:1** (coach que arma plan personalizado, ajusta, da feedback individual, hace seguimiento real, sesiones livianas por link externo), **no** como "plan digital / rutina prearmada / contenido desbloqueado / biblioteca de ejercicios".

> Nota: "1:1" **no** obliga a video en vivo. Forzza ya tiene componentes person-to-person (feedback personalizado en métricas/fotos, check-ins, `live_sessions` livianas con link externo), lo que **ayuda** al argumento. El trabajo es de **posicionamiento + asegurar interacción humana real**, no necesariamente reconstruir el producto. Verificar que no choque con el scope "no sesiones en vivo V1" (ya hay desvío aprobado para `live_sessions` livianas).

## Flujo end-to-end (conforme)

Una sola cuenta Forzza (web y app comparten Supabase Auth).

1. **Descubrimiento (fuera de la app):** web pública/SEO, **link propio del coach** (`forzza.com/coaches/{slug}`) compartido por sus redes/WhatsApp, **email** de Forzza a su base, push opt-in (zona gris).
2. **Contratación (web):** el alumno entra al perfil del coach en la web. Para pagar, **login/registro obligatorio antes del checkout** (gate de auth).
3. **Pago (web):** Mercado Pago. El backend asocia **usuario** (sesión autenticada) ↔ **coach** (slug/coach_id de la página) ↔ paquete. El assignment se crea al aprobarse el pago (webhook MP, idempotente — ya existe).
4. **Uso (app):** el alumno abre la app con la misma cuenta → ve "Mi coach" y el plan.

### Identidad usuario ↔ coach
- **Usuario:** lo da la **sesión autenticada** en la web. NO se usa token de usuario en la URL (inseguro e innecesario).
- **Coach:** identificado por el slug/coach_id de la URL del perfil (`/coaches/{slug}`).
- **Atribución (opcional):** `?ref={coach_code}` para marketing, pero el binding real es server-side post-login.

### Casos borde
| Caso | Resolución |
|---|---|
| Usuario con cuenta navega la web logueado | Directo; sesión = identidad. |
| Usuario sin app/sin cuenta llega por link del coach | Web exige registro/login antes del checkout; crea cuenta en web; luego baja la app con la misma cuenta. |
| Tiene la app pero llega a la web sin sesión | Web pide login con su cuenta Forzza antes de habilitar el checkout. |
| ¿Login antes de pagar? | **Obligatorio.** Sin usuario autenticado no se asocia la contratación ni se aplica la regla #7 (menor sin consentimiento → 403 pre-checkout). |

## Mecanismos de captación permitidos (cómo "enviarlos a la web" sin infringir)

✅ **Permitido (comunicación fuera de la app):**
- **Email a la base de usuarios** (canal principal; Apple lo permite expresamente). Forzza ya usa Resend.
- **Link propio del coach** compartido por afuera (redes/WhatsApp).
- **Web pública / SEO.**
- **WhatsApp/SMS** a la base.

❌ **Prohibido en iOS:** botón "ir a contratar", link tappable al checkout, frases que alienten el pago externo, deep link app→checkout.

⚠️ **NO disponible para Forzza:** pedir el email **dentro de la app** con un botón "mandame el link para contratar" — ese privilegio es solo de las **music streaming apps con entitlement** (§3.1.1(a)), no es regla general. El email debe salir por iniciativa de marketing, no como respuesta a un botón de compra in-app.

⚠️ **Zona gris:** push notification opt-in que abra el navegador (no la app) hacia la web.

**Precedente de mercado:** es el patrón de Netflix/Spotify/Kindle en iOS (registro gratis en la app; conversión a pago por email/web).

## Impacto en el código (plan de ajuste)

> No ejecutar hasta confirmar con abogado la zona gris; el ajuste defensivo de iOS (quitar CTA de compra) se puede priorizar igual porque reduce riesgo sin costar nada conforme.

**Mobile (`apps/mobile`):**
- `app/marketplace/[coachId].tsx` — hoy (≈línea 808) muestra paquetes con **precio** + botón **"contratar"** → navega a `/marketplace/checkout` → MP web. **Acción:** gatear por plataforma. En **iOS**: ocultar precio, botón de contratar y todo CTA/copy de compra; dejar el perfil del coach como info/acceso a "Mi coach". En **Android**: descubrimiento sin checkout, sin links directos, copy neutro máximo.
- `app/marketplace/checkout` — **no debe ser accesible desde iOS** (constituiría flujo de compra in-app). Gatear/remover de la navegación iOS y Android.
- Mantener intacto el flujo **PRO por IAP** (RevenueCat) — no se toca.

**Web (`apps/web`):**
- El flujo de contratación (perfil de coach → login gate → checkout MP) ya existe; verificar que el **gate de login antes del checkout** sea estricto y que la asociación usuario↔coach sea server-side.
- Asegurar que el perfil público del coach (`/coaches/{slug}`) sea la landing de contratación compartible.
- **Botón de arrepentimiento** (requisito legal AR, Defensa del Consumidor): la web debe incluir botón visible para revocar la compra; derecho de arrepentimiento 10 días. Revisar excepción por servicio personalizado ya iniciado, sin asumirla. **Falta implementar.**
- Captura de datos fiscales en checkout: ajustar a requisitos ARCA (comprobante C monotributo, leyenda "A CONSUMIDOR FINAL", identificar CUIT/CUIL/DNI en operaciones ≥ $10.000.000), sin pedir más datos de los necesarios.

**Backend:**
- El webhook de MP que crea el assignment ya es idempotente; verificar que tome usuario autenticado + coach_id correctamente sin depender de token en URL.

## Pendiente (bloqueante antes de submission a stores)
1. Validación del abogado: zona gris person-to-person + precio sin link (ver `consulta-stores-y-fiscal.md` §A.2).
2. Validación del contador: split payment vs liquidación (ver §B.2). Define si `settlements` se rediseña.
3. Con ambas: rediseño final de `/coach/cobros` (factura por alumno) y de la vista admin.
