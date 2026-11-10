import type { Database } from '@/types/database'

/** Client-safe row type (named EventRow so it doesn't clash with the DOM Event). */
export type EventRow = Database['public']['Tables']['events']['Row']

export type EventWithPoster = EventRow & { posterUrl: string | null }
