import { scrubPII, type TrackedEvent } from '@forzza/core'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.posthog.com'

export const CONSENT_KEY = 'forzza_analytics_consent'
export type ConsentValue = 'granted' | 'denied'

interface PostHogInstance {
  capture: (e: string, p?: Record<string, unknown>) => void
  identify: (id: string, t?: Record<string, unknown>) => void
  reset: () => void
  init: (key: string, opts: Record<string, unknown>) => void
  opt_out_capturing: () => void
  opt_in_capturing: () => void
  has_opted_out_capturing: () => boolean
}

let posthog: PostHogInstance | null = null
let initPromise: Promise<void> | null = null

/**
 * Read the stored consent decision (client-side only).
 * Returns null when there is no stored decision yet.
 */
export function getStoredConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null
  const val = localStorage.getItem(CONSENT_KEY)
  return val === 'granted' || val === 'denied' ? val : null
}

/**
 * Persist the consent decision and apply it to PostHog if already loaded.
 */
export function setConsent(value: ConsentValue): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CONSENT_KEY, value)

  if (value === 'granted') {
    // Load PostHog if not yet loaded, then opt in
    loadPostHog().then(() => {
      posthog?.opt_in_capturing()
    })
  } else {
    // Opt out immediately if PostHog is already loaded
    if (posthog) {
      posthog.opt_out_capturing()
    }
  }
}

/**
 * Dynamically load and initialise PostHog exactly once.
 * Resolves immediately if PostHog is already loaded or the key is missing.
 */
function loadPostHog(): Promise<void> {
  if (!POSTHOG_KEY || typeof window === 'undefined') return Promise.resolve()
  if (initPromise) return initPromise

  initPromise = (async () => {
    const moduleName = 'posthog-js'
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mod = await import(/* webpackIgnore: true */ moduleName as any)
      const ph = mod.default as PostHogInstance
      ph.init(POSTHOG_KEY, { api_host: POSTHOG_HOST, capture_pageview: false })
      posthog = ph
    } catch {
      // posthog-js not installed — analytics disabled
    }
  })()

  return initPromise
}

/**
 * Called once on app boot (client-side).
 * Only loads PostHog if consent has already been granted.
 */
export function initAnalytics(): void {
  if (typeof window === 'undefined') return
  const consent = getStoredConsent()
  if (consent === 'granted') {
    loadPostHog()
  }
  // 'denied' or null → do not load PostHog
}

export function track(event: TrackedEvent, properties?: Record<string, unknown>): void {
  if (!posthog) return
  posthog.capture(event, properties ? scrubPII(properties) : {})
}

export function identifyUser(userId: string, traits?: Record<string, unknown>): void {
  if (!posthog) return
  posthog.identify(userId, traits ? scrubPII(traits) : {})
}

export function resetAnalytics(): void {
  posthog?.reset()
}
