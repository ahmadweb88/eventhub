import Link from 'next/link'
import { CalendarPlus, SearchX } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

type Props = { kind: 'no-events' } | { kind: 'no-results'; description: string }

export function EmptyState(props: Props) {
  const Icon = props.kind === 'no-events' ? CalendarPlus : SearchX

  return (
    <div className="flex flex-col items-center px-5 py-16 text-center">
      <Icon
        className="text-muted-foreground size-12"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      {props.kind === 'no-events' ? (
        <>
          <h2 className="font-heading mt-4 text-xl font-semibold md:text-2xl">
            No events yet
          </h2>
          <p className="text-muted-foreground mt-2 max-w-md">
            Create your first workshop, meetup or match. Add a poster and
            we&apos;ll show the weather for its city.
          </p>
          <Link
            href="/events/new"
            className={buttonVariants({ className: 'mt-6' })}
          >
            Create your first event
          </Link>
        </>
      ) : (
        <>
          <h2 className="font-heading mt-4 text-xl font-semibold md:text-2xl">
            No events match
          </h2>
          <p className="text-muted-foreground mt-2 max-w-md">
            {props.description}
          </p>
          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: 'outline',
              className: 'mt-6',
            })}
          >
            Clear filters
          </Link>
        </>
      )}
    </div>
  )
}
