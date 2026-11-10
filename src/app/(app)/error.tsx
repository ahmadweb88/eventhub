'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-12 md:px-8 lg:px-12">
      <h1 className="font-heading text-3xl font-bold">This page didn’t load</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        Something went wrong on our side. Try again, and if it keeps happening,
        come back in a few minutes.
      </p>
      <Button className="mt-8" onClick={() => retry()}>
        Try again
      </Button>
    </div>
  )
}
