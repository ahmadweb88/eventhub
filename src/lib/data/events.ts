import { requireUser } from '@/lib/auth'
import { getSignedUrl, getSignedUrlMap } from '@/lib/storage'
import { eventIdSchema, isEventCategory } from '@/lib/validations/event'
import type { EventWithPoster } from './event-types'

export const PAGE_SIZE = 9

type ListParams = { q?: string; category?: string; page?: number }

export async function listEvents({ q, category, page = 1 }: ListParams) {
  const { user, supabase } = await requireUser()

  let query = supabase
    .from('events')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id) // RLS already enforces this; the filter also uses the index

  const search = q?.trim().slice(0, 100)
  if (search)
    query = query.ilike('title', `%${search.replace(/[%_\\]/g, '\\$&')}%`)

  if (isEventCategory(category)) query = query.eq('category', category)

  const safePage = Math.max(1, Math.floor(page) || 1)
  const from = (safePage - 1) * PAGE_SIZE
  const { data, error, count } = await query
    .order('event_date', { ascending: true })
    .order('created_at', { ascending: false })
    .range(from, from + PAGE_SIZE - 1)

  if (error) throw new Error('Could not load your events.')

  const rows = data ?? []
  const urls = await getSignedUrlMap(
    supabase,
    rows.map((e) => e.poster_path),
  )
  const events: EventWithPoster[] = rows.map((e) => ({
    ...e,
    posterUrl: e.poster_path ? (urls[e.poster_path] ?? null) : null,
  }))

  const total = count ?? 0
  return {
    events,
    total,
    page: safePage,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  }
}

/** The user's event, or null when it doesn't exist, isn't theirs, or the id is invalid. */
export async function getEvent(id: string): Promise<EventWithPoster | null> {
  const parsed = eventIdSchema.safeParse(id)
  if (!parsed.success) return null

  const { supabase } = await requireUser()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', parsed.data)
    .maybeSingle()

  if (error) throw new Error('Could not load this event.')
  if (!data) return null
  return { ...data, posterUrl: await getSignedUrl(supabase, data.poster_path) }
}
