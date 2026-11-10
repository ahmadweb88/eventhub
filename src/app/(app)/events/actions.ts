'use server'

import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/lib/action-result'
import { requireUser } from '@/lib/auth'
import { isOwnPath, removeFiles } from '@/lib/storage'
import {
  createEventSchema,
  eventIdSchema,
  eventSchema,
  toEventRow,
  type EventInput,
} from '@/lib/validations/event'

const INVALID = 'Please fix the highlighted fields.'
const GONE = 'This event no longer exists.'

export async function createEvent(
  input: EventInput,
): Promise<ActionResult<{ id: string }>> {
  const parsed = createEventSchema.safeParse(input)
  if (!parsed.success)
    return {
      ok: false,
      error: INVALID,
      fieldErrors: parsed.error.flatten().fieldErrors,
    }

  const { user, supabase } = await requireUser()
  const posterPath = parsed.data.posterPath
  if (posterPath && !isOwnPath(posterPath, user.id))
    return { ok: false, error: 'Invalid poster.' }

  const { data, error } = await supabase
    .from('events')
    .insert(toEventRow(parsed.data))
    .select('id')
    .single()
  if (error) {
    await removeFiles(supabase, [posterPath]) // don't leave an orphan file
    return { ok: false, error: 'Could not save the event. Please try again.' }
  }

  revalidatePath('/dashboard')
  return { ok: true, data: { id: data.id }, message: 'Event created.' }
}

export async function updateEvent(
  id: string,
  input: EventInput,
): Promise<ActionResult> {
  const idCheck = eventIdSchema.safeParse(id)
  if (!idCheck.success) return { ok: false, error: GONE }

  const parsed = eventSchema.safeParse(input)
  if (!parsed.success)
    return {
      ok: false,
      error: INVALID,
      fieldErrors: parsed.error.flatten().fieldErrors,
    }

  const { user, supabase } = await requireUser()
  const newPath = parsed.data.posterPath
  if (newPath && !isOwnPath(newPath, user.id))
    return { ok: false, error: 'Invalid poster.' }

  const { data: current } = await supabase
    .from('events')
    .select('poster_path')
    .eq('id', idCheck.data)
    .maybeSingle()
  if (!current) return { ok: false, error: GONE }

  const { error } = await supabase
    .from('events')
    .update(toEventRow(parsed.data))
    .eq('id', idCheck.data)
  if (error) {
    if (newPath !== current.poster_path) await removeFiles(supabase, [newPath])
    return { ok: false, error: 'Could not update the event. Please try again.' }
  }
  if (current.poster_path && current.poster_path !== newPath)
    await removeFiles(supabase, [current.poster_path])

  revalidatePath('/dashboard')
  revalidatePath(`/events/${idCheck.data}`)
  return { ok: true, message: 'Changes saved.' }
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  const idCheck = eventIdSchema.safeParse(id)
  if (!idCheck.success) return { ok: false, error: GONE }

  const { supabase } = await requireUser()
  const { data, error } = await supabase
    .from('events')
    .delete()
    .eq('id', idCheck.data)
    .select('id, poster_path')
  if (error)
    return { ok: false, error: 'Could not delete the event. Please try again.' }
  if (!data?.length) return { ok: false, error: GONE }

  await removeFiles(supabase, [data[0].poster_path])

  revalidatePath('/dashboard')
  return { ok: true, message: 'Event deleted.' }
}
