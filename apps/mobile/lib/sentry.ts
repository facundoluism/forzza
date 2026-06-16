// Sentry wrapper — scrubs PII before sending
const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN

interface SentryEvent {
  user?: {
    email?: string
    username?: string
    ip_address?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

interface SentryModule {
  init: (opts: Record<string, unknown>) => void
  captureException: (error: Error, ctx?: Record<string, unknown>) => void
}

let sentryInitialized = false

export async function initSentry(): Promise<void> {
  if (!SENTRY_DSN || sentryInitialized) return
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Sentry = await (import('@sentry/react-native' as any) as Promise<SentryModule>)
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
      tracesSampleRate: 0.1,
      beforeSend(event: SentryEvent) {
        // Strip PII from breadcrumbs and user context
        if (event.user) {
          delete event.user.email
          delete event.user.username
          event.user.ip_address = '{{auto}}'
        }
        return event
      },
    })
    sentryInitialized = true
  } catch {
    // Sentry not installed — silently skip
  }
}

export async function captureError(error: Error, context?: Record<string, unknown>): Promise<void> {
  if (!SENTRY_DSN) return
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Sentry = await (import('@sentry/react-native' as any) as Promise<SentryModule>)
    Sentry.captureException(error, { extra: context ? scrubForSentry(context) : {} })
  } catch {
    console.error('[Sentry]', error)
  }
}

function scrubForSentry(obj: Record<string, unknown>): Record<string, unknown> {
  const BLOCKED = ['email', 'password', 'full_name', 'birthdate', 'cbu', 'payment_id', 'access_token', 'refresh_token', 'token', 'session']
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !BLOCKED.includes(k)))
}
