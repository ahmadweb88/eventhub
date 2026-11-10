'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  Droplets,
  MapPinOff,
  RefreshCw,
  Snowflake,
  Sun,
  Thermometer,
  Wind,
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  adviceFor,
  type WeatherCondition,
  type WeatherSummary,
} from '@/lib/api/weather-types'

const EventMap = dynamic(() => import('./event-map'), {
  ssr: false,
  loading: () => <Skeleton className="h-72 w-full rounded-xl md:h-96" />,
})

const ICONS: Record<WeatherCondition, typeof Sun> = {
  clear: Sun,
  clouds: Cloud,
  rain: CloudRain,
  drizzle: CloudDrizzle,
  thunder: CloudLightning,
  snow: Snowflake,
  fog: CloudFog,
}

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string; notFound: boolean }
  | { status: 'success'; data: WeatherSummary }

type Props = {
  eventId: string
  city: string
  venue: string | null
  category: string
  dateLabel: string
  isToday: boolean
}

/** One /api/weather request feeds both the weather card and the map (D-04). */
export function EventInsights({
  eventId,
  city,
  venue,
  category,
  dateLabel,
  isToday,
}: Props) {
  const [state, setState] = useState<State>({ status: 'loading' })

  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    fetch(`/api/weather?city=${encodeURIComponent(city)}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}))
        if (!res.ok)
          return setState({
            status: 'error',
            message: json.error ?? 'Could not load the weather.',
            notFound: res.status === 404 || res.status === 400,
          })
        setState({ status: 'success', data: json.data })
      })
      .catch((e: Error) => {
        if (e.name !== 'AbortError')
          setState({
            status: 'error',
            message: 'Could not reach the server. Check your connection.',
            notFound: false,
          })
      })

    return () => controller.abort()
  }, [city, attempt])

  // Retry and refresh show the skeleton again; the first load starts in 'loading'
  function reload() {
    setState({ status: 'loading' })
    setAttempt((n) => n + 1)
  }

  const retry = (
    <Button variant="outline" onClick={reload}>
      <RefreshCw className="size-4" strokeWidth={1.75} aria-hidden="true" />
      Try again
    </Button>
  )

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section
        aria-label={`Weather in ${city}`}
        aria-live="polite"
        className="bg-background min-w-0 rounded-xl border p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-heading text-xl font-semibold break-words">
            Weather in {city}
          </h2>
          {state.status === 'success' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={reload}
              aria-label="Refresh weather"
            >
              <RefreshCw
                className="size-4"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </Button>
          )}
        </div>

        {state.status === 'loading' && (
          <div className="mt-4 space-y-3" aria-busy="true">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          </div>
        )}

        {state.status === 'error' && (
          <div className="mt-4 space-y-4">
            <p role="alert" className="text-destructive">
              {state.message}
            </p>
            <div className="flex flex-wrap gap-3">
              {retry}
              {state.notFound && (
                <Link
                  href={`/events/${eventId}/edit`}
                  className={buttonVariants({ variant: 'ghost' })}
                >
                  Edit event
                </Link>
              )}
            </div>
          </div>
        )}

        {state.status === 'success' && (
          <WeatherDetails
            data={state.data}
            category={category}
            dateLabel={dateLabel}
            isToday={isToday}
          />
        )}
      </section>

      <section aria-label="Map" className="min-w-0">
        {state.status === 'loading' && (
          <Skeleton className="h-72 w-full rounded-xl md:h-96" />
        )}
        {state.status === 'error' && (
          <div className="bg-background flex h-72 flex-col items-center justify-center gap-2 rounded-xl border px-6 text-center md:h-96">
            <MapPinOff
              className="text-muted-foreground size-6"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <p className="text-muted-foreground">
              {state.notFound
                ? 'Map unavailable until the city is found.'
                : 'Map unavailable right now.'}
            </p>
          </div>
        )}
        {state.status === 'success' && (
          <EventMap
            lat={state.data.lat}
            lon={state.data.lon}
            label={venue ? `${venue}, ${state.data.city}` : state.data.city}
          />
        )}
      </section>
    </div>
  )
}

function WeatherDetails({
  data,
  category,
  dateLabel,
  isToday,
}: {
  data: WeatherSummary
  category: string
  dateLabel: string
  isToday: boolean
}) {
  const Icon = ICONS[data.condition]
  const stats = [
    { icon: Thermometer, label: 'Feels like', value: `${data.feelsLikeC}°C` },
    { icon: Droplets, label: 'Humidity', value: `${data.humidity}%` },
    { icon: Wind, label: 'Wind', value: `${data.windKmh} km/h` },
  ]

  return (
    <div className="mt-4">
      <div className="flex items-center gap-4">
        <Icon
          className="text-brand-link size-12 shrink-0"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <div>
          <p className="font-heading text-4xl font-bold tabular-nums">
            {data.tempC}°C
          </p>
          <p className="text-muted-foreground capitalize">{data.description}</p>
        </div>
      </div>

      <p className="bg-muted mt-4 rounded-md px-3 py-2 font-semibold">
        <span className="sr-only">Tip for attendees: </span>
        {adviceFor(data, category)}
      </p>

      <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
        {stats.map((s) => (
          <div key={s.label} className="min-w-0 rounded-md border p-3">
            <dt className="text-muted-foreground flex items-center gap-1">
              <s.icon
                className="size-4 shrink-0"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span className="truncate">{s.label}</span>
            </dt>
            <dd className="mt-1 font-semibold tabular-nums">{s.value}</dd>
          </div>
        ))}
      </dl>

      <p className="text-muted-foreground mt-3 text-sm">
        {isToday
          ? 'Current weather on the day of the event.'
          : `Current weather. The forecast for ${dateLabel} may differ.`}{' '}
        Data: {data.source}
      </p>
    </div>
  )
}
