import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-5 py-12 md:px-8 lg:px-12">
      <Skeleton className="h-10 w-64 max-w-full" />
      <Skeleton className="h-5 w-full max-w-2xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  )
}
