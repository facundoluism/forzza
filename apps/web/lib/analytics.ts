import { scrubPII, type TrackedEvent } from '@forzza/core'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.posthog.com'

interface PostHogInstance {
  capture: (e: string, p?: Record<string, unknown>) => void
  identify: (id: string, t?: Record<string, unknown>) => void
  reset: () => void
  init: (key: string, opts: Record<string, unknown>) => void
}

let posthog: PostHogInstance | null = null

// Dynamically load posthog-js only when the key is configured.
// The module name is computed at runtime so bundlers skip static analysis.
if (typeof window !== 'undefined' && POSTHOG_KEY) {
  const moduleName = 'posthog-js'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  import(/* webpackIgnore: true */ moduleName as any).then((mod: any) => {
    const ph = mod.default as PostHogInstance
    ph.init(POSTHOG_KEY, { api_host: POSTHOG_HOST, capture_pageview: false })
    posthog = ph
  }).catch(() => {
    // posthog-js not installed — analytics disabled
  })
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
