import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, ImageOff, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { EventWithPoster } from '@/lib/data/event-types'
import { formatEventDate, isPastDate } from '@/lib/dates'
import { CATEGORY_LABELS, isEventCategory } from '@/lib/validations/event'

export function EventCard({ event }: { event: EventWithPoster }) {
  const past = isPastDate(event.event_date)

  return (
    <article className="group hover:shadow-raised focus-within:shadow-raised relative flex h-full flex-col overflow-hidden rounded-xl border transition-[transform,box-shadow] duration-150 focus-within:-translate-y-1 hover:-translate-y-1">
      {event.posterUrl ? (
        <Image
          src={event.posterUrl}
          alt={`Poster for ${event.title}`}
          width={600}
          height={450}
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          unoptimized
          className="bg-muted aspect-[4/3] w-full object-contain"
        />
      ) : (
        <div className="bg-muted grid aspect-[4/3] w-full place-items-center">
          <ImageOff
            className="text-muted-foreground size-6"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            {isEventCategory(event.category)
              ? CATEGORY_LABELS[event.category]
              : event.category}
          </Badge>
          {past && <Badge variant="secondary">Past</Badge>}
        </div>
        <h2 className="font-heading line-clamp-2 text-xl leading-snug font-semibold break-words">
          <Link
            href={`/events/${event.id}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {event.title}
          </Link>
        </h2>
        <div className="text-muted-foreground mt-auto space-y-1 text-sm">
          <p className="flex items-center gap-2">
            <CalendarDays
              className="size-4 shrink-0"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            {formatEventDate(event.event_date)}
          </p>
          <p className="flex min-w-0 items-center gap-2">
            <MapPin
              className="size-4 shrink-0"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span className="truncate">{event.city}</span>
          </p>
        </div>
      </div>
    </article>
  )
}
