'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { createClient } from '@/lib/supabase/server'
import {
  loginSchema,
  signupSchema,
  type LoginInput,
  type SignupInput,
} from '@/lib/validations/auth'

export type AuthResult = { error?: string; message?: string } | undefined

const NOT_CONFIGURED = {
  error: 'Supabase is not connected yet. Add its URL and key to .env.local.',
}

function friendlyError(message: string) {
  if (/invalid login credentials/i.test(message))
    return 'Email or password is incorrect.'
  if (/already registered|already exists/i.test(message))
    return 'An account with this email already exists. Try logging in.'
  if (/email not confirmed/i.test(message))
    return 'Please confirm your email first, then log in.'
  if (/rate limit|too many/i.test(message))
    return 'Too many attempts. Please wait a minute and try again.'
  if (/password/i.test(message))
    return 'This password is not accepted. Try a stronger one.'
  return 'Something went wrong. Please try again.'
}

function safeNext(next?: string) {
  return next && next.startsWith('/') && !next.startsWith('//')
    ? next
    : '/dashboard'
}

export async function signIn(
  input: LoginInput,
  next?: string,
): Promise<AuthResult> {
  const parsed = loginSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  if (!isSupabaseConfigured) return NOT_CONFIGURED

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) return { error: friendlyError(error.message) }

  revalidatePath('/', 'layout')
  redirect(safeNext(next))
}

export async function signUp(input: SignupInput): Promise<AuthResult> {
  const parsed = signupSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  if (!isSupabaseConfigured) return NOT_CONFIGURED

  const { fullName, email, password } = parsed.data
  const origin = (await headers()).get('origin') ?? ''

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })
  if (error) return { error: friendlyError(error.message) }

  // Confirm email is on: no session yet.
  if (!data.session)
    return { message: 'Check your email to confirm your account, then log in.' }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
