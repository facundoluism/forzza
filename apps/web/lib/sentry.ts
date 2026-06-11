const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

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

export async function initSentry(): Promise<void> {
  if (typeof window === 'undefined' || !SENTRY_DSN) return
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Sentry = await (import('@sentry/nextjs' as any) as Promise<SentryModule>)
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: process.env.NEXT_PUBLIC_APP_ENV ?? 'development',
      tracesSampleRate: 0.1,
      beforeSend(event: SentryEvent) {
        if (event.user) {
          delete event.user.email
          delete event.user.username
        }
        return event
      },
    })
  } catch {
    // Not installed
  }
}

export function captureError(error: Error, context?: Record<string, unknown>): void {
  if (!SENTRY_DSN) return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(import('@sentry/nextjs' as any) as Promise<SentryModule>).then(Sentry => {
    Sentry.captureException(error, { extra: context ?? {} })
  }).catch(() => {})
}
