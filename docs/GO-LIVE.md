# GO-LIVE Checklist — Forzza V1

## Infra
- [ ] Supabase cloud project creado (prod)
- [x] `supabase db push` ejecutado contra cloud staging — **2026-06-22**: 26/26 migraciones
      sincronizadas (las 18 pendientes aplicadas sin error, todas aditivas). Pendiente: repetir
      contra el proyecto de PROD cuando exista, y subir el seed de videos (`pnpm videos:push-cloud`).
- [ ] Seeds ejecutados en cloud (country_config AR)
- [ ] Storage buckets creados en cloud (4 buckets privados: progress-photos, fiscal-docs, invoices, videos)
- [ ] Edge Functions deployed: `supabase functions deploy --all`
- [ ] pg_cron configurado: generate-settlements (1er día del mes), dunning-cron (diario), checkin-reminder (semanal)
- [ ] Vercel proyecto creado, dominio forzza.app asignado
- [ ] Variables de entorno cargadas en Vercel (todas las de .env.example sin MOCK_OK)
- [ ] `node scripts/validate-env.js --env production` → 0 errores

## Seguridad (pendientes pre-go-live)
- [ ] Endurecer dev-bypass de requireAdmin(): restringir mock a NODE_ENV==="development" y hacer throw
      si falta NEXT_PUBLIC_SUPABASE_URL en prod/staging (ver security-review.md §10.1 y open-questions.md)
- [ ] Rate limiting en /api/admin/*, /api/leads y /api/mp-preapproval (ver security-review.md §10.2)
- [ ] Configurar MP_WEBHOOK_SECRET en Supabase Secrets del proyecto cloud

## Pagos
- [ ] MP access token de PRODUCCIÓN cargado
- [ ] Webhook de MP apuntando a: https://forzza.app/api/mp-webhook (o Edge Function URL)
- [ ] Webhook signature validation: YA IMPLEMENTADA en mp-webhook (ver security-review.md §7 y docs/runbooks/pagos.md)
      Verificar que MP_WEBHOOK_SECRET este cargado en Supabase Secrets antes de procesar pagos reales.
- [ ] Test de pago real con tarjeta de prueba antes de lanzar

## Email
- [ ] Dominio forzza.app verificado en Resend
- [ ] DNS records SPF/DKIM/DMARC configurados
- [ ] Test email enviado y recibido

## Apps
- [ ] Assets reemplazados (icon, splash, adaptive-icon, favicon)
- [ ] `eas build --platform all --profile production` ejecutado
- [ ] TestFlight: build subido, 12 testers invitados, feedback recopilado
- [ ] Play Console: internal testing, 12 testers, feedback recopilado
- [ ] App Store Review: submission enviada (puede tardar 1-3 días)
- [ ] Play Store Review: submission enviada

## Monitoring
- [ ] Sentry: proyectos creados para web y mobile
- [ ] PostHog: proyecto EU, privacy mode habilitado
- [ ] Alertas de Sentry configuradas (error rate, p95 latency)
- [ ] Supabase: alertas de database size y queries lentas

## Legal
- [ ] Textos DRAFT de /legales/terminos reemplazados por versión legal aprobada
- [ ] Textos DRAFT de /legales/privacidad reemplazados por versión legal aprobada
- [ ] Política de privacidad publicada (requerida por App Store y Play Store)

## Smoke test
- [ ] `node scripts/smoke-test.js --url https://forzza.app` → ✅ todos los checks pasan
- [ ] Flujo completo: signup → onboarding → ver rutina → sesión → ver progreso
- [ ] Flujo coach: login → alumnos → crear rutina → asignar
- [ ] Flujo pago: checkout PRO → redirect MP → webhook → suscripción activa

## Rollback plan
Si algo falla post-lanzamiento:
1. Feature flags: desactivar funcionalidad específica vía country_config.is_active = false
2. Vercel: rollback instantáneo con `vercel rollback`
3. Mobile: no hay rollback inmediato en stores — por eso TestFlight/internal testing es crítico
