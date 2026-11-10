import Link from 'next/link'
import { cn } from '@/lib/utils'

/** From docs/req/03-design.md: events calendar mark, Ink & Coral. */
export const BRAND = {
  name: 'EventHub',
  tagline: 'Community events',
}

/** light = for light backgrounds (dark text) · dark = for dark backgrounds (white text) */
type Tone = 'light' | 'dark'

export function LogoMark({
  tone = 'light',
  className,
}: {
  tone?: Tone
  className?: string
}) {
  const ink = tone === 'dark' ? 'fill-white' : 'fill-brand-dark'
  const accent = 'fill-primary'

  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      className={cn('size-8 shrink-0', className)}
    >
      <rect x="5" y="9" width="30" height="26" rx="7" className={ink} />
      <rect x="11" y="4" width="4" height="9" rx="2" className={accent} />
      <rect x="25" y="4" width="4" height="9" rx="2" className={accent} />
      <circle cx="26" cy="27" r="4" className={accent} />
    </svg>
  )
}

export function Logo({
  variant = 'full',
  tone = 'light',
  href = '/',
  className,
}: {
  variant?: 'full' | 'mark'
  tone?: Tone
  href?: string | null
  className?: string
}) {
  const content = (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark tone={tone} />
      {variant === 'full' && (
        <span className="flex flex-col leading-none max-[359px]:hidden">
          <span
            className={cn(
              'font-heading text-[1.375rem] font-bold tracking-tight',
              tone === 'dark' ? 'text-white' : 'text-brand-dark',
            )}
          >
            {BRAND.name}
          </span>
          <span
            className={cn(
              'mt-1 hidden text-[0.625rem] font-semibold tracking-[0.28em] uppercase sm:block',
              tone === 'dark' ? 'text-white/75' : 'text-muted-foreground',
            )}
          >
            {BRAND.tagline}
          </span>
        </span>
      )}
    </span>
  )

  if (!href) return content
  return (
    <Link
      href={href}
      aria-label={`${BRAND.name} home`}
      className="focus-visible:outline-ring rounded-md focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      {content}
    </Link>
  )
}
