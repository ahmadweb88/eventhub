import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  CalendarDays,
  CloudSun,
  Droplets,
  ImagePlus,
  MapPin,
  Wind,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { getUser } from '@/lib/auth'

const STEPS = [
  {
    icon: CalendarDays,
    title: 'Create your event',
    text: 'Add the title, category, date, city and venue. We check the date and every field before saving.',
  },
  {
    icon: CloudSun,
    title: 'Check the weather',
    text: 'Each event shows the current temperature, humidity and wind for its city, a tip for attendees and a map pin.',
  },
  {
    icon: ImagePlus,
    title: 'Add the poster',
    text: 'Upload a JPG, PNG or WebP poster up to 5 MB. It appears on the event card and the event page.',
  },
]

const CATEGORIES = [
  { name: 'Workshop', example: 'Intro to photography, coding for beginners' },
  { name: 'Meetup', example: 'JavaScript meetup, book club evening' },
  { name: 'Sports', example: 'Saturday futsal league, park run' },
  { name: 'Cultural', example: 'Kite festival, qawwali night' },
  { name: 'Charity', example: 'River clean-up drive, food bank shift' },
]

export default async function HomePage() {
  if (await getUser()) redirect('/dashboard')

  return (
    <>
      <section className="py-12 md:py-16 lg:py-24">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[7fr_5fr] lg:px-12">
          <div className="min-w-0">
            <h1 className="font-heading text-brand-dark text-4xl leading-tight font-bold md:text-5xl lg:text-[3.5rem]">
              Plan local events, with the weather already checked.
            </h1>
            <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed md:text-xl">
              EventHub keeps your community workshops, meetups, matches,
              festivals and charity drives in one place, with a poster for each
              event and the weather for its city.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/signup" className={buttonVariants({ size: 'lg' })}>
                Sign up, it&apos;s free
              </Link>
              <Link
                href="/login"
                className={buttonVariants({ variant: 'outline', size: 'lg' })}
              >
                Log in
              </Link>
            </div>
          </div>

          {/* Example of the event page, built from the app's own styles (not real data) */}
          <div
            aria-hidden="true"
            className="bg-background min-w-0 rounded-xl border p-6"
          >
            <Badge variant="outline">Sports</Badge>
            <p className="font-heading mt-3 text-xl font-semibold">
              Saturday Futsal League
            </p>
            <div className="text-muted-foreground mt-2 space-y-1 text-sm">
              <p className="flex items-center gap-2">
                <CalendarDays className="size-4" strokeWidth={1.75} />
                Sat 14 Nov 2026
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="size-4" strokeWidth={1.75} />
                Model Town Ground, Lahore
              </p>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <CloudSun
                className="text-brand-link size-10"
                strokeWidth={1.75}
              />
              <p className="font-heading text-3xl font-bold tabular-nums">
                24°C
              </p>
            </div>
            <p className="bg-muted mt-4 rounded-md px-3 py-2 font-semibold">
              Good conditions for an outdoor event.
            </p>
            <div className="text-muted-foreground mt-4 flex gap-6 text-sm">
              <span className="flex items-center gap-1">
                <Droplets className="size-4" strokeWidth={1.75} /> 48%
              </span>
              <span className="flex items-center gap-1">
                <Wind className="size-4" strokeWidth={1.75} /> 9 km/h
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-12 md:py-16 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-12">
          <h2 className="font-heading text-3xl leading-tight font-bold md:text-4xl">
            How it works
          </h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className="bg-secondary text-secondary-foreground font-heading grid size-10 place-items-center rounded-full font-bold">
                    {i + 1}
                  </span>
                  <step.icon
                    className="text-brand-link size-6"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="font-heading mt-4 text-xl font-semibold md:text-2xl">
                  {step.title}
                </h3>
                <p className="text-muted-foreground mt-2 leading-7">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 md:px-8 lg:grid-cols-[5fr_7fr] lg:px-12">
          <h2 className="font-heading text-3xl leading-tight font-bold md:text-4xl">
            Five kinds of events, one dashboard
          </h2>
          <ul className="divide-y border-y">
            {CATEGORIES.map((c) => (
              <li
                key={c.name}
                className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-6"
              >
                <span className="font-semibold sm:w-28">{c.name}</span>
                <span className="text-muted-foreground">{c.example}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-muted py-12 md:py-16">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-6 px-5 md:flex-row md:items-center md:justify-between md:px-8 lg:px-12">
          <h2 className="font-heading text-2xl font-bold md:text-3xl">
            Your first event takes two minutes.
          </h2>
          <Link
            href="/signup"
            className={buttonVariants({ variant: 'secondary', size: 'lg' })}
          >
            Create account
          </Link>
        </div>
      </section>
    </>
  )
}
