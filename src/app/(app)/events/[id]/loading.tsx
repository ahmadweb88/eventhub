import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div
      className="mx-auto w-full max-w-7xl px-5 py-10 md:px-8 lg:px-12 lg:py-14"
      aria-busy="true"
    >
      <Skeleton className="h-6 w-32" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[5fr_7fr]">
        <Skeleton className="aspect-[3/4] w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-11 w-40" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  )
}
