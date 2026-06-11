import { scrubPII, type TrackedEvent } from '@forzza/core'

interface PostHogInstance {
  capture: (event: string, props?: Record<string, unknown>) => void
  identify: (id: string, traits?: Record<string, unknown>) => void
  reset: () => void
}

// Lazy import PostHog to avoid crash when not configured
let posthog: PostHogInstance | null = null

const POSTHOG_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://eu.posthog.com'

if (POSTHOG_KEY) {
  // Dynamic import to avoid crashing without the package
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(import('posthog-react-native' as any) as Promise<any>).then((mod: any) => {
    const { PostHog } = mod as { PostHog: new (key: string, opts: Record<string, unknown>) => PostHogInstance }
    posthog = new PostHog(POSTHOG_KEY, { host: POSTHOG_HOST })
  }).catch(() => {
    // PostHog not installed — analytics silently disabled
  })
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
