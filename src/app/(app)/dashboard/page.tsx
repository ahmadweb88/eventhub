import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { Plus } from 'lucide-react'
import { EmptyState } from '@/components/events/empty-state'
import { EventCard } from '@/components/events/event-card'
import { EventsToolbar } from '@/components/events/events-toolbar'
import { buttonVariants } from '@/components/ui/button'
import { requireUser } from '@/lib/auth'
import { listEvents } from '@/lib/data/events'
import { CATEGORY_LABELS, isEventCategory } from '@/lib/validations/event'

export const metadata: Metadata = { title: 'My events' }

type Search = { q?: string; category?: string; page?: string }

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Search>
}) {
  const { user, supabase } = await requireUser()
  const sp = await searchParams
  const [{ data: profile }, { events, total, page, pageCount }] =
    await Promise.all([
      supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle(),
      listEvents({
        q: sp.q,
        category: sp.category,
        page: Number(sp.page ?? 1),
      }),
    ])

  const firstName = (profile?.full_name ?? user.user_metadata.full_name)?.split(
    ' ',
  )[0]
  const category = isEventCategory(sp.category)
    ? CATEGORY_LABELS[sp.category]
    : null
  const isFiltered = Boolean(sp.q || category)
  const hasNoEvents = total === 0 && !isFiltered

  const pageHref = (n: number) => {
    const next = new URLSearchParams()
    if (sp.q) next.set('q', sp.q)
    if (category) next.set('category', sp.category!)
    if (n > 1) next.set('page', String(n))
    const qs = next.toString()
    return qs ? `/dashboard?${qs}` : '/dashboard'
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-10 md:px-8 lg:px-12 lg:py-14">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {firstName && <p className="text-muted-foreground">Hi {firstName}</p>}
          <h1 className="font-heading text-3xl font-bold md:text-4xl">
            My events
          </h1>
          <p className="text-muted-foreground mt-1 tabular-nums">
            {total} {total === 1 ? 'event' : 'events'}
            {isFiltered && ' found'}
          </p>
        </div>
        {!hasNoEvents && (
          <Link
            href="/events/new"
            className={buttonVariants({ className: 'w-full sm:w-auto' })}
          >
            <Plus className="size-5" strokeWidth={1.75} aria-hidden="true" />
            New event
          </Link>
        )}
      </div>

      {hasNoEvents ? (
        <EmptyState kind="no-events" />
      ) : (
        <>
          <Suspense fallback={null}>
            <EventsToolbar />
          </Suspense>

          {events.length === 0 ? (
            <EmptyState
              kind="no-results"
              description={`No events match${sp.q ? ` “${sp.q}”` : ''}${category ? ` in ${category}` : ''}.`}
            />
          ) : (
            <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <li key={event.id} className="min-w-0">
                  <EventCard event={event} />
                </li>
              ))}
            </ul>
          )}

          {pageCount > 1 && (
            <nav
              aria-label="Pagination"
              className="mt-8 flex items-center justify-center gap-3"
            >
              {page > 1 && (
                <Link
                  href={pageHref(page - 1)}
                  className={buttonVariants({ variant: 'outline' })}
                >
                  Previous
                </Link>
              )}
              <span className="text-muted-foreground tabular-nums">
                Page {page} of {pageCount}
              </span>
              {page < pageCount && (
                <Link
                  href={pageHref(page + 1)}
                  className={buttonVariants({ variant: 'outline' })}
                >
                  Next
                </Link>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  )
}
