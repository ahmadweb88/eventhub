import type { Metadata } from 'next'
import { requireUser } from '@/lib/auth'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const { user, supabase } = await requireUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .maybeSingle()

  const fullName: string | undefined =
    profile?.full_name ?? user.user_metadata.full_name

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-12 md:px-8 lg:px-12">
      <h1 className="font-heading text-3xl font-bold">
        Hi {fullName?.split(' ')[0] ?? 'there'}
      </h1>
      {/* [PLACEHOLDER] Feature content goes here. */}
    </div>
  )
}
