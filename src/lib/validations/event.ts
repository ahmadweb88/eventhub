import { z } from 'zod'
import { todayIso } from '@/lib/dates'

export const EVENT_CATEGORIES = [
  'workshop',
  'meetup',
  'sports',
  'cultural',
  'charity',
] as const

export type EventCategory = (typeof EVENT_CATEGORIES)[number]

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  workshop: 'Workshop',
  meetup: 'Meetup',
  sports: 'Sports',
  cultural: 'Cultural',
  charity: 'Charity',
}

export function isEventCategory(value: unknown): value is EventCategory {
  return (EVENT_CATEGORIES as readonly unknown[]).includes(value)
}

/** Letters (any language), spaces, dots, apostrophes and hyphens. Shared with /api/weather. */
export const cityField = z
  .string()
  .trim()
  .min(2, 'Enter the city.')
  .max(80, 'City name is too long.')
  .regex(/^[\p{L}\s.'-]+$/u, 'Use letters only for the city name.')

export const eventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title needs at least 3 characters.')
    .max(100, 'Keep the title under 100 characters.'),
  description: z
    .string()
    .trim()
    .max(2000, 'Keep the description under 2000 characters.'),
  category: z.enum(EVENT_CATEGORIES, { message: 'Choose a category.' }),
  eventDate: z
    .string()
    .min(1, 'Choose the event date.')
    .refine(
      (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)),
      'Enter a valid date.',
    ),
  city: cityField,
  venue: z.string().trim().max(120, 'Keep the venue under 120 characters.'),
  posterPath: z.string().max(200).nullable(),
})

/** Create only: the date must be today or later (docs/req/decisions.md D-07). */
export const createEventSchema = eventSchema.refine(
  (v) => v.eventDate >= todayIso(),
  { message: "Event date can't be in the past.", path: ['eventDate'] },
)

export const eventIdSchema = z.uuid('Invalid event.')

export type EventInput = z.infer<typeof eventSchema>

/** Form values (camelCase) → database row (snake_case). */
export function toEventRow(v: EventInput) {
  return {
    title: v.title,
    description: v.description || null,
    category: v.category,
    event_date: v.eventDate,
    city: v.city,
    venue: v.venue || null,
    poster_path: v.posterPath,
  }
}
