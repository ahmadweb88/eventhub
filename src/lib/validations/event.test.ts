import { addDays, format } from 'date-fns'
import { describe, expect, it } from 'vitest'
import { createEventSchema, eventSchema, toEventRow } from './event'

const day = (offset: number) =>
  format(addDays(new Date(), offset), 'yyyy-MM-dd')

const valid = {
  title: 'Saturday Futsal League',
  description: '',
  category: 'sports' as const,
  eventDate: day(7),
  city: 'Lahore',
  venue: '',
  posterPath: null,
}

describe('createEventSchema', () => {
  it('accepts a future event', () => {
    expect(createEventSchema.safeParse(valid).success).toBe(true)
  })

  it('accepts today', () => {
    expect(
      createEventSchema.safeParse({ ...valid, eventDate: day(0) }).success,
    ).toBe(true)
  })

  it('rejects a past date with a message on eventDate', () => {
    const result = createEventSchema.safeParse({ ...valid, eventDate: day(-1) })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toEqual(['eventDate'])
  })

  it('rejects missing required fields', () => {
    const result = createEventSchema.safeParse({
      ...valid,
      title: ' ',
      city: '',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a city with digits or symbols', () => {
    expect(
      eventSchema.safeParse({ ...valid, city: 'Lahore<script>' }).success,
    ).toBe(false)
    expect(
      eventSchema.safeParse({ ...valid, city: "St. John's" }).success,
    ).toBe(true)
  })
})

describe('eventSchema (edit)', () => {
  it('allows a past date when editing', () => {
    expect(
      eventSchema.safeParse({ ...valid, eventDate: day(-30) }).success,
    ).toBe(true)
  })
})

describe('toEventRow', () => {
  it('maps empty optional text to null', () => {
    const row = toEventRow(valid)
    expect(row.description).toBeNull()
    expect(row.venue).toBeNull()
    expect(row.event_date).toBe(valid.eventDate)
  })
})
