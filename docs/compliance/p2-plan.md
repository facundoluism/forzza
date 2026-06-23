# P2 — Plan de ejecución (US/EU prep)

> **Estado: DIFERIDO.** Gatillado por una decisión explícita de lanzar en EE. UU. y/o UE.
> Mientras V1 sea solo Argentina, P2 no se ejecuta. Este doc lo deja listo para arrancar.
> Casi todo P2 es trabajo legal/ops (abogado, DPAs, registros), con una capa delgada de código.

## Qué ya quedó cubierto por P0/P1 (reduce P2)

Mucha de la *mecánica* de GDPR/CCPA ya está implementada y no hay que rehacerla:

| Capacidad | Dónde | Sirve para |
|---|---|---|
| Export de datos (JSON) | Edge Fn `export-user-data` + UI (P1.3) | CCPA "right to know", GDPR acceso/portabilidad |
| Borrado + anonimización 30d | `delete-account`/`anonymize-accounts` + UI web/mobile (P1.2) | CCPA "right to delete", GDPR borrado |
| Rectificación | edición de perfil | GDPR rectificación |
| Consent banner analytics + opt-out | P1.1 (opt-in, no carga hasta aceptar) | GDPR consentimiento, base de "objeción" |
| Scrubbing de PII a terceros | `scrubPII()` + `beforeSend()` | minimización |
| Derechos ARCO + ganchos CCPA/GDPR redactados | Privacidad §8 (P0.2) | disclosures |
| Consentimiento de datos sensibles | RPC `record_sensitive_consent` (P1.4) | datos especiales (salud) |
| Audit log append-only | `audit_log` | accountability |

**Conclusión:** lo que resta de P2 es delgado en código y mayormente trámite legal.

## Workstreams

### P2.1 — DMCA safe harbor (gatillo: operar/targetear EE. UU.)
| Tarea | Tipo | Detalle |
|---|---|---|
| Registrar agente designado en copyright.gov | HUMAN (legal) | DMCA Designated Agent Directory, ~USD 6, renovar cada 3 años |
| Publicar datos del agente en la app/web | CODE (chico) | Página/sección `/legales/dmca` con la info del agente (reusa maqueta legal de P0.2) |
| Enforcement de reincidentes | CODE (medio) | Hoy `submit-content-report` es canal mínimo (audit_log + aviso owner). Para safe harbor falta el flujo de strikes: tabla `content_strikes`, conteo por infractor, suspensión automática según política de `ugc-takedown.md §5` |
| SLA de notice-and-takedown | PROCESO | Acuse/evaluación/retiro según plazos de `ugc-takedown.md §4` (HUMAN: validar plazos con abogado) |

**Aceptación:** agente registrado + info publicada + takedown operativo + política de reincidentes ejecutada en código.

### P2.2 — Arbitraje / resolución de disputas (gatillo: launch US + abogado)
| Tarea | Tipo | Detalle |
|---|---|---|
| Redactar cláusula de arbitraje + class-action waiver para consumidores US | HUMAN (abogado US) | NO copiar genérica; en AR es conflictiva (Ley 24.240). Reemplaza el `[PENDIENTE]` en Términos §9 |
| Cargar el texto aprobado | CODE (chico) | Namespace `legal.terms` en `messages/{es,en}` |
| Mecanismo de opt-out de arbitraje (si la cláusula lo exige) | CODE (chico) | Algunas jurisdicciones requieren ventana de opt-out de ~30 días |

**Aceptación:** cláusula revisada por counsel US, en Términos, con opt-out si corresponde.

### P2.3 — CCPA/CPRA (gatillo: usuarios de California)
| Tarea | Tipo | Detalle |
|---|---|---|
| "Notice at Collection" + link "Do Not Sell or Share My Personal Information" | CODE (chico) | Forzza NO vende datos → es principalmente aviso. Link en footer |
| Honrar Global Privacy Control (GPC) | CODE (chico) | Si el browser envía señal GPC, default `denied` en el consent de analytics (P1.1) |
| Finalizar disclosures CCPA en Privacidad | HUMAN (legal) | Hooks ya redactados (P0.2): categorías, finalidades, no-venta |
| Verificar request flow (right to know/delete) | CODE (mayormente hecho) | Export (P1.3) + borrado (P1.2) cubren; agregar intake si se requiere verificación de identidad formal |

**Aceptación:** notice + DNS link + GPC honrado + flujo de solicitud verificable.

### P2.4 — GDPR / UK GDPR (gatillo: usuarios de UE/UK)
| Tarea | Tipo | Detalle |
|---|---|---|
| Firmar DPAs con cada procesador | HUMAN (legal/ops) | Supabase, PostHog, Sentry, Resend, Mercado Pago, RevenueCat, Expo |
| RoPA formal (Art. 30) | HUMAN (legal) | Extender `data-map.md` a registro formal; base legal por finalidad (ya iniciada en Privacidad §4) |
| Mecanismo de transferencia internacional (SCCs) | HUMAN (legal) | Para procesadores en US; resuelve el `[PENDIENTE]` de Privacidad §6 |
| Residencia de datos | CODE/INFRA (grande) | PostHog ya EU; Supabase hoy `us-east-1` (ver data-map) → evaluar región EU para usuarios UE (decisión de infra) |
| Cookie/consent estricto | CODE (chico) | P1.1 ya es opt-in para analytics; verificar que nada no-esencial cargue pre-consent; categorías granulares si hace falta |
| Verificar DSAR completo | CODE (hecho) | acceso/borrado/rectificación/portabilidad/objeción ya cubiertos por P1 — solo verificar |
| Representante UE (Art. 27) / evaluación DPO | HUMAN (legal) | Si no hay establecimiento en UE |

**Aceptación:** DPAs firmados + RoPA completo + SCCs + consent compliant + DSAR verificado + transferencia documentada.

## Secuencia si se activa P2

1. **Decisión go/no-go** de lanzar en US y/o UE (gatillo de todo P2).
2. **Legal primero** (lead time más largo): DPAs, RoPA, SCCs, cláusula de arbitraje, registro DMCA.
3. **Código después** (rápido): DNS link + GPC (P2.3), página DMCA + flujo de strikes (P2.1), carga de cláusula (P2.2), cookie estricto (P2.4).
4. **Infra al final**: decisión de región EU de Supabase (P2.4) — la más pesada, solo si UE es target real.

## Estimación gruesa de código (si se activa)
- Chico (≤1 día c/u): DNS link + GPC, página DMCA, carga de textos legales, cookie estricto.
- Medio (varios días): flujo de strikes/reincidentes (`content_strikes` + suspensión).
- Grande (decisión de infra): región EU de Supabase.
- El resto es trámite legal/ops, no código.
