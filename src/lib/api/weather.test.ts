import { AxiosError } from 'axios'
import { describe, expect, it } from 'vitest'
import { ApiError, toApiError } from '@/lib/http'
import { adviceFor } from './weather-types'

describe('adviceFor', () => {
  it('suggests an indoor backup for outdoor events in rain', () => {
    expect(
      adviceFor({ condition: 'rain', tempC: 20, windKmh: 5 }, 'sports'),
    ).toMatch(/indoor backup/i)
  })
  it('mentions umbrellas for indoor events in rain', () => {
    expect(
      adviceFor({ condition: 'drizzle', tempC: 20, windKmh: 5 }, 'workshop'),
    ).toMatch(/umbrellas/i)
  })
  it('warns about heat with breaks for sports', () => {
    expect(
      adviceFor({ condition: 'clear', tempC: 38, windKmh: 5 }, 'sports'),
    ).toMatch(/breaks/i)
  })
  it('warns about strong wind', () => {
    expect(adviceFor({ condition: 'clouds', tempC: 20, windKmh: 45 })).toMatch(
      /wind/i,
    )
  })
})

describe('weather condition mapping', async () => {
  const { owmCondition, wmoCondition } = await import('./weather')
  it('maps provider codes', () => {
    expect(owmCondition('Thunderstorm')).toBe('thunder')
    expect(owmCondition('Haze')).toBe('fog')
    expect(wmoCondition(0)[0]).toBe('clear')
    expect(wmoCondition(63)[0]).toBe('rain')
  })
})

describe('toApiError', () => {
  it('maps timeouts to 504', () => {
    expect(toApiError(new AxiosError('timeout', 'ECONNABORTED')).status).toBe(
      504,
    )
  })
  it('keeps our own ApiError (city not found)', () => {
    expect(toApiError(new ApiError(404, 'not found')).status).toBe(404)
  })
  it('maps unknown errors to 500 with a safe message', () => {
    const e = toApiError(new Error('secret details'))
    expect(e.status).toBe(500)
    expect(e.message).not.toContain('secret')
  })
})
