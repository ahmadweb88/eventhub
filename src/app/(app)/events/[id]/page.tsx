import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  ImageOff,
  MapPin,
  Pencil,
} from 'lucide-react'
import { DeleteEventButton } from '@/components/events/delete-event-button'
import { EventInsights } from '@/components/events/event-insights'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { requireUser } from '@/lib/auth'
import { getEvent } from '@/lib/data/events'
import { formatEventDate, isPastDate, todayIso } from '@/lib/dates'
import { CATEGORY_LABELS, isEventCategory } from '@/lib/validations/event'

type Params = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const event = await getEvent((await params).id)
  return { title: event?.title ?? 'Event not found' }
}

export default async function EventPage({ params }: Params) {
  await requireUser()
  const event = await getEvent((await params).id)
  if (!event) notFound()

  const dateLabel = formatEventDate(event.event_date)
  const categoryLabel = isEventCategory(event.category)
    ? CATEGORY_LABELS[event.category]
    : event.category

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-5 py-10 md:px-8 lg:px-12 lg:py-14">
        <Link
          href="/dashboard"
          className="text-brand-link inline-flex h-11 items-center gap-2 font-semibold underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
          My events
        </Link>

        <div className="mt-4 grid gap-8 lg:grid-cols-[5fr_7fr]">
          <div className="order-2 min-w-0 lg:order-1">
            {event.posterUrl ? (
              <Image
                src={event.posterUrl}
                alt={`Poster for ${event.title}`}
                width={900}
                height={1200}
                priority
                sizes="(min-width:1024px) 40vw, 100vw"
                className="bg-muted aspect-[3/4] w-full rounded-xl object-contain"
              />
            ) : (
              <div className="bg-muted text-muted-foreground flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-xl lg:aspect-[3/4]">
                <ImageOff
                  className="size-6"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <p className="text-sm">No poster yet</p>
              </div>
            )}
          </div>

          <div className="order-1 min-w-0 lg:order-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{categoryLabel}</Badge>
              {isPastDate(event.event_date) && (
                <Badge variant="secondary">Past</Badge>
              )}
            </div>
            <h1 className="font-heading mt-3 text-3xl leading-tight font-bold break-words md:text-4xl lg:text-5xl">
              {event.title}
            </h1>

            <ul className="mt-5 space-y-2 text-lg">
              <li className="flex items-center gap-3">
                <CalendarDays
                  className="text-muted-foreground size-5 shrink-0"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                {dateLabel}
              </li>
              <li className="flex min-w-0 items-center gap-3">
                <MapPin
                  className="text-muted-foreground size-5 shrink-0"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span className="break-words">{event.city}</span>
              </li>
              {event.venue && (
                <li className="flex min-w-0 items-center gap-3">
                  <Building2
                    className="text-muted-foreground size-5 shrink-0"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <span className="break-words">{event.venue}</span>
                </li>
              )}
            </ul>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/events/${event.id}/edit`}
                className={buttonVariants({ className: 'w-full sm:w-auto' })}
              >
                <Pencil
                  className="size-4"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                Edit event
              </Link>
              <DeleteEventButton id={event.id} title={event.title} />
            </div>

            {event.description && (
              <p className="mt-8 max-w-prose leading-7 break-words whitespace-pre-line">
                {event.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <section className="bg-muted py-12 md:py-16">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-12">
          <EventInsights
            eventId={event.id}
            city={event.city}
            venue={event.venue}
            category={event.category}
            dateLabel={dateLabel}
            isToday={event.event_date === todayIso()}
          />
        </div>
      </section>
    </>
  )
}
