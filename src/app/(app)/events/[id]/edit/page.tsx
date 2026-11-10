import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { EventForm } from '@/components/events/event-form'
import { requireUser } from '@/lib/auth'
import { getEvent } from '@/lib/data/events'

export const metadata: Metadata = { title: 'Edit event' }

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireUser()
  const { id } = await params
  const event = await getEvent(id)
  if (!event) notFound()

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 md:px-8 lg:py-14">
      <Link
        href={`/events/${event.id}`}
        className="text-brand-link inline-flex h-11 items-center gap-2 font-semibold underline-offset-4 hover:underline"
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
        Back to event
      </Link>
      <h1 className="font-heading mt-2 mb-8 text-3xl font-bold break-words md:text-4xl">
        Edit event
      </h1>
      <EventForm mode="edit" event={event} />
    </div>
  )
}
