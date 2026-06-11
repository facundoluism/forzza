import { describe, it, expect } from 'vitest'
import { scrubPII } from '../index'

describe('scrubPII', () => {
  it('removes PII fields', () => {
    const result = scrubPII({ email: 'test@test.com', plan: 'pro', full_name: 'Juan' })
    expect(result).not.toHaveProperty('email')
    expect(result).not.toHaveProperty('full_name')
    expect(result.plan).toBe('pro')
  })

  it('removes payment fields', () => {
    const result = scrubPII({ amount_cents: 999900, payment_id: 'abc', plan: 'free' })
    expect(result).not.toHaveProperty('amount_cents')
    expect(result).not.toHaveProperty('payment_id')
  })

  it('allows safe fields', () => {
    const result = scrubPII({ plan: 'pro', country_code: 'AR', role: 'student' })
    expect(result).toEqual({ plan: 'pro', country_code: 'AR', role: 'student' })
  })
})
