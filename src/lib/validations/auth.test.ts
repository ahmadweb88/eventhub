import { describe, expect, it } from 'vitest'
import { signupSchema } from './auth'

const valid = {
  fullName: 'Ayesha Khan',
  email: 'Ayesha@Example.com',
  password: 'hunza2026',
  confirmPassword: 'hunza2026',
}

describe('signupSchema', () => {
  it('accepts valid input and normalises the email', () => {
    const result = signupSchema.parse(valid)
    expect(result.email).toBe('ayesha@example.com')
  })

  it('rejects a password without a number', () => {
    const result = signupSchema.safeParse({
      ...valid,
      password: 'onlyletters',
      confirmPassword: 'onlyletters',
    })
    expect(result.success).toBe(false)
  })

  it('reports mismatched passwords on confirmPassword', () => {
    const result = signupSchema.safeParse({
      ...valid,
      confirmPassword: 'different1',
    })
    expect(result.error?.issues[0].path).toEqual(['confirmPassword'])
  })
})
