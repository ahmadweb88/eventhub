import { AxiosError, type AxiosResponse } from 'axios'
import { describe, expect, it } from 'vitest'
import { getApiErrorMessage } from './http'

function errorWithStatus(status: number) {
  return new AxiosError('failed', undefined, undefined, undefined, {
    status,
  } as AxiosResponse)
}

describe('getApiErrorMessage', () => {
  it('explains a timeout', () => {
    const error = new AxiosError('timeout', 'ECONNABORTED')
    expect(getApiErrorMessage(error)).toMatch(/too long/)
  })

  it('maps known status codes', () => {
    expect(getApiErrorMessage(errorWithStatus(401))).toBe('Invalid API key.')
    expect(getApiErrorMessage(errorWithStatus(500))).toContain('500')
  })

  it('handles non-axios errors', () => {
    expect(getApiErrorMessage(new Error('boom'))).toBe('Something went wrong.')
  })
})
