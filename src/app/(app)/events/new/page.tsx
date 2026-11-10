import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { EventForm } from '@/components/events/event-form'
import { requireUser } from '@/lib/auth'

export const metadata: Metadata = { title: 'New event' }

export default async function NewEventPage() {
  await requireUser()

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 md:px-8 lg:py-14">
      <Link
        href="/dashboard"
        className="text-brand-link inline-flex h-11 items-center gap-2 font-semibold underline-offset-4 hover:underline"
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
        My events
      </Link>
      <h1 className="font-heading mt-2 mb-8 text-3xl font-bold md:text-4xl">
        New event
      </h1>
      <EventForm mode="create" />
    </div>
  )
}
