import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div
      className="mx-auto w-full max-w-7xl px-5 py-10 md:px-8 lg:px-12 lg:py-14"
      aria-busy="true"
    >
      <Skeleton className="h-10 w-48" />
      <Skeleton className="mt-2 h-5 w-24" />
      <Skeleton className="mt-8 h-11 w-full" />
      <div className="mt-4 flex gap-2">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-11 w-24 shrink-0 rounded-full" />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border">
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
