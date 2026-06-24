# Progress — Cobro de coach: Split Payments + compliance stores/fiscal

> Sesión 2026-06-23/24. Estado para retomar. Detalle en `docs/decisions/contratacion-coach-flujo.md`, `docs/compliance/consulta-stores-y-fiscal.md`, `docs/open-questions.md` (entradas 2026-06-23) y la memoria `forzza-coach-pagos-split`.

## Decisiones tomadas (dueño, asume el riesgo — avanzar sin abogado/contador por ahora)
- **Anti-steering stores**: la app NO comercializa coach. iOS Opción A endurecida (sin precio/botón/CTA/checkout); Android conservador. Contratación SOLO web. Captación por canales fuera de la app (email/web/link del coach).
- **Factura por alumno**: cada parte factura su porción AL ALUMNO (coach su neto; Forzza su comisión). El coach NO es empleado.
- **Split Payments de MP** como arquitectura de cobro: la parte del coach va directa a su cuenta; la comisión queda en Forzza. Desaparece la transferencia Forzza→coach.
- **Fee de MP** partida 50/50 coach/Forzza, leída de `country_config.mp_fee_pct` (bps), NO hardcodeada.

## Hecho y commiteado esta sesión (PASS)
| Criterio | Evidencia | Commit |
|---|---|---|
| App sin comercializar coach (iOS/Android) | typecheck verde + diff revisado por Opus | `4b0c59e` |
| Onboarding OAuth coach↔MP (Fase A) | typecheck verde; RLS de columna **probada** (coach no lee tokens, service-role sí) | `bfa8e7b` |
| Checkout con Split (Fase B) | 19 tests core/billing verdes; migración `mp_fee_pct`; math de reparto | `757f181` |
| Arrepentimiento (10 días) + ARCA en checkout | typecheck verde; revoke route con auth/ownership/ventana/audit_log; bug de copy "$10M" corregido | `15c34e1` |
| Docs compliance + decisiones | — | `2999541` |
| Videos: 188/234 (tanda parcial) | seed aplicado a local | `512661c` |

## Pendiente para retomar
**🔴 HUMAN_REQUIRED (Facu):**
1. Crear app **Marketplace en Mercado Pago** + cargar `MP_OAUTH_CLIENT_ID`/`MP_OAUTH_CLIENT_SECRET` (ver `.env.example`).
2. Confirmar con ejecutivo comercial de MP: tarifa real, cómo descuenta la fee el split, IVA → cierra la math del 3/3 y el valor de `mp_fee_pct` (hoy placeholder 629 bps).

**⚠️ TO-CONFIRM técnico con MP:** el checkout del coach es por suscripción (`preapproval_plan`); **split + recurrencia juntos no están confirmados** — puede requerir ajuste de endpoint. Marcado en `coach-checkout` y `country_config` migración.

**🔵 Próximas fases (cuando haya credenciales):**
- Prueba end-to-end OAuth + checkout split contra MP sandbox.
- **Fase C**: rediseño de `/coach/cobros` → factura por alumno + vista admin (más simple: sin transferencia). `settlements` se simplifica.
- Conectar el **refund real** de MP en el arrepentimiento (hoy `refundAdapter` es stub `pending_phase_b`).

**📋 Dudas registradas (operar igual, documentadas):**
- Excepción de arrepentimiento por servicio iniciado (Ley 24.240) → abogado.
- Base del umbral ARCA $10M: ¿sobre el total o el neto del coach? → contador.

**🎬 Videos:** 46 ejercicios sin video. Retomar tanda desde `single-arm-cable-pulldown` cuando resetee la cuota YouTube. Re-pushear seed al cloud (`pnpm videos:push-cloud --confirm`).

## Nota de entorno
Sesión concurrente de **motion/animaciones** activa (cambios sin commitear en `packages/ui/**`, `tokens.ts`, `CLAUDE.md`, `.claude/skills/`). NO commiteado por esta sesión — se respetó con paths explícitos.
