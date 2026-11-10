import { redirect } from 'next/navigation'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { createClient } from '@/lib/supabase/server'

/** The current user, or null. Verified with Supabase (safe for authorization). */
export async function getUser() {
  if (!isSupabaseConfigured) return null

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/** For protected pages, server actions and route handlers. Redirects if logged out. */
export async function requireUser() {
  if (!isSupabaseConfigured) redirect('/login')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { user, supabase }
}
