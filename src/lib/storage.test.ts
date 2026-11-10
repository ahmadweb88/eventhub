import { describe, expect, it } from 'vitest'
import { isOwnPath } from './storage'

describe('isOwnPath', () => {
  it('accepts a file in the user folder', () => {
    expect(isOwnPath('user-1/photo.webp', 'user-1')).toBe(true)
  })

  it('rejects another user folder and traversal', () => {
    expect(isOwnPath('user-2/photo.webp', 'user-1')).toBe(false)
    expect(isOwnPath('user-1/../user-2/photo.webp', 'user-1')).toBe(false)
  })
})
