import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-dvh place-items-center px-5 py-12">
      <div className="max-w-sm space-y-4 text-center">
        <h1 className="font-heading text-3xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">
          This link may be old, or the page may have moved.
        </p>
        <Link href="/" className={buttonVariants()}>
          Back to home
        </Link>
      </div>
    </main>
  )
}
