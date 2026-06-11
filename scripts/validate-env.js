#!/usr/bin/env node
// scripts/validate-env.js
// Run: node scripts/validate-env.js --env production

const args = process.argv.slice(2)
const env = args.includes('--env') ? args[args.indexOf('--env') + 1] : 'development'

const REQUIRED_FOR_PRODUCTION = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'MP_ACCESS_TOKEN',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
  'NEXT_PUBLIC_POSTHOG_KEY',
  'NEXT_PUBLIC_SENTRY_DSN',
  'APP_URL',
]

const MOCK_OK_PATTERN = /MOCK_OK/i

let hasErrors = false

for (const key of REQUIRED_FOR_PRODUCTION) {
  const value = process.env[key]
  if (!value) {
    console.error(`❌ MISSING: ${key}`)
    hasErrors = true
  } else if (env === 'production' && MOCK_OK_PATTERN.test(value)) {
    console.error(`❌ MOCK_OK in production: ${key}`)
    hasErrors = true
  } else {
    console.log(`✅ ${key}`)
  }
}

if (hasErrors) {
  console.error('\n🚫 Validation failed. Fix the above before deploying to production.')
  process.exit(1)
} else {
  console.log(`\n✅ All required env vars present for ${env}.`)
}
