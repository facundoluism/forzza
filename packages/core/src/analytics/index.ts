// Central analytics wrapper — scrubs PII before sending to PostHog
// Allowed properties: plan, role, country_code, coach_id (hashed), feature_flags
// NEVER: email, full_name, birthdate, amount_cents, payment_id

export const TRACKED_EVENTS = {
  // Auth
  SIGNUP_COMPLETED: 'signup_completed',
  LOGIN: 'login',
  // Onboarding
  ONBOARDING_STUDENT_COMPLETED: 'onboarding_student_completed',
  ONBOARDING_COACH_COMPLETED: 'onboarding_coach_completed',
  // Entrenos
  WORKOUT_STARTED: 'workout_started',
  WORKOUT_COMPLETED: 'workout_completed',
  WORKOUT_ABANDONED: 'workout_abandoned',
  // Tabata
  TABATA_ADVANCED_USED: 'tabata_advanced_used',
  TABATA_PLAN_SAVED: 'tabata_plan_saved',
  // Gating
  UPGRADE_MODAL_SHOWN: 'upgrade_modal_shown',
  UPGRADE_CTA_TAPPED: 'upgrade_cta_tapped',
  AUTOPROMO_SHOWN: 'autopromo_shown',
  AUTOPROMO_SKIPPED: 'autopromo_skipped',
  // Marketplace
  COACH_PROFILE_VIEWED: 'coach_profile_viewed',
  COACH_CHECKOUT_STARTED: 'coach_checkout_started',
  // PRO
  PRO_SUBSCRIPTION_STARTED: 'pro_subscription_started',
} as const

export type TrackedEvent = typeof TRACKED_EVENTS[keyof typeof TRACKED_EVENTS]

export interface EventProperties {
  plan?: 'free' | 'pro' | 'elite'
  role?: 'student' | 'coach' | 'owner'
  country_code?: string
  // NO email, full_name, birthdate, payment_id
}

// Scrub PII from any properties object
export function scrubPII(props: Record<string, unknown>): Record<string, unknown> {
  const BLOCKED_KEYS = [
    'email',
    'full_name',
    'name',
    'birthdate',
    'birth_date',
    'phone',
    'amount_cents',
    'payment_id',
    'provider_payment_id',
    'cbu',
    'alias_cbu',
    'constancia_url',
    'avatar_url',
    'invoice_url',
    'access_token',
    'refresh_token',
    'token',
    'session',
  ]
  return Object.fromEntries(
    Object.entries(props).filter(([key]) => !BLOCKED_KEYS.includes(key))
  )
}
