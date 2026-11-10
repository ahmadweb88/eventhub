'use client'

import { useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { CATEGORY_LABELS, EVENT_CATEGORIES } from '@/lib/validations/event'

const FILTERS = [
  { value: '', label: 'All' },
  ...EVENT_CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] })),
]

export function EventsToolbar() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [q, setQ] = useState(params.get('q') ?? '')
  const active = params.get('category') ?? ''

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    const qs = next.toString()
    startTransition(() =>
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }),
    )
  }

  // Debounce search by 350 ms
  useEffect(() => {
    if (q.trim() === (params.get('q') ?? '')) return
    const t = setTimeout(() => setParam('q', q.trim()), 350)
    return () => clearTimeout(t)
  }, [q]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-4">
      <div role="search" className="relative">
        <Search
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title"
          aria-label="Search events by title"
          maxLength={100}
          className="pl-9"
        />
        {isPending && (
          <Loader2
            className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin"
            aria-hidden="true"
          />
        )}
      </div>

      <div
        role="group"
        aria-label="Filter by category"
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0"
      >
        {FILTERS.map((f) => {
          const isActive = active === f.value
          return (
            <button
              key={f.value || 'all'}
              type="button"
              onClick={() => setParam('category', f.value)}
              aria-pressed={isActive}
              className={cn(
                'h-11 shrink-0 rounded-full border px-4 text-[0.9375rem] font-semibold transition-colors',
                isActive
                  ? 'bg-secondary text-secondary-foreground border-secondary'
                  : 'hover:bg-muted',
              )}
            >
              {f.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
