import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default function EventNotFound() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-8 lg:px-12">
      <h1 className="font-heading text-3xl font-bold">Event not found</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        This event doesn&apos;t exist or was deleted.
      </p>
      <Link href="/dashboard" className={buttonVariants({ className: 'mt-8' })}>
        Back to my events
      </Link>
    </div>
  )
}
