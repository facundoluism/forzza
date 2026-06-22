/**
 * Capa de analytics — PostHog con consentimiento explícito.
 *
 * PostHog NO se inicializa hasta que el usuario ACEPTE el banner de analytics
 * (AnalyticsConsentBanner). Esto cumple con GDPR/LGPD § consent-first.
 *
 * Flujo:
 *   1. Al arrancar la app: si el usuario ya aceptó (decided + analyticsEnabled),
 *      se llama a initAnalyticsIfAllowed() y PostHog se inicializa.
 *   2. Si no hay decisión todavía: AnalyticsConsentBanner se muestra. Cuando
 *      acepta, llama a initAnalyticsIfAllowed(). Si rechaza, PostHog nunca inicia.
 *   3. Opt-out desde perfil: setAnalyticsEnabled(false) en el store + optOutAndReset().
 *      Opt-in de vuelta: setAnalyticsEnabled(true) + initAnalyticsIfAllowed().
 */

import { scrubPII, type TrackedEvent } from '@forzza/core'
import { getConsent } from '@/stores/analyticsConsentStore'

interface PostHogInstance {
  capture: (event: string, props?: Record<string, unknown>) => void
  identify: (id: string, traits?: Record<string, unknown>) => void
  reset: () => void
  optOut?: () => void
}

// Lazy import PostHog to avoid crash when not configured
let posthog: PostHogInstance | null = null
let initAttempted = false

const POSTHOG_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://eu.posthog.com'

/**
 * Inicializa PostHog solo si el usuario dio consentimiento.
 * Idempotente: no hace nada si ya se inició o si no hay consentimiento.
 */
export function initAnalyticsIfAllowed(): void {
  if (posthog) return         // Ya inicializado
  if (initAttempted) return   // Ya intentamos (y posthog === null significa sin clave)
  if (!POSTHOG_KEY) return    // Sin clave → silently disabled

  const { decided, analyticsEnabled } = getConsent()
  if (!decided || !analyticsEnabled) return

  initAttempted = true

  // Dynamic import to avoid crashing without the package
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(import('posthog-react-native' as any) as Promise<any>).then((mod: any) => {
    const { PostHog } = mod as { PostHog: new (key: string, opts: Record<string, unknown>) => PostHogInstance }
    posthog = new PostHog(POSTHOG_KEY, { host: POSTHOG_HOST })
  }).catch(() => {
    // PostHog not installed — analytics silently disabled
    initAttempted = false  // Allow retry after install
  })
}

/**
 * Opt-out: hace reset de la sesión y destruye la instancia.
 * Llamar cuando el usuario desactiva analytics en ajustes.
 */
export function optOutAndReset(): void {
  if (!posthog) return
  try {
    posthog.reset()
    if (posthog.optOut) posthog.optOut()
  } catch {
    // Silently ignore
  }
  posthog = null
  initAttempted = false  // Permitir reiniciar si el usuario opt-in de nuevo
}

export function track(event: TrackedEvent, properties?: Record<string, unknown>): void {
  if (!posthog) return
  const safeProps = properties ? scrubPII(properties) : {}
  posthog.capture(event, safeProps)
}

export function identifyUser(userId: string, traits?: Record<string, unknown>): void {
  if (!posthog) return
  const safeTraits = traits ? scrubPII(traits) : {}
  posthog.identify(userId, safeTraits)
}

export function resetAnalytics(): void {
  if (!posthog) return
  posthog.reset()
}
