import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

// [PLACEHOLDER] Replace this page with the project's landing content.
export default function HomePage() {
  return (
    <section className="py-12 md:py-16 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-12">
        <h1 className="font-heading text-brand-dark text-4xl leading-tight font-bold md:text-5xl lg:text-[3.5rem]">
          {siteConfig.name}
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed md:text-xl">
          {siteConfig.description}
        </p>
        <Link
          href="/dashboard"
          className={buttonVariants({
            variant: 'secondary',
            className: 'mt-8',
          })}
        >
          Open dashboard
        </Link>
      </div>
    </section>
  )
}
