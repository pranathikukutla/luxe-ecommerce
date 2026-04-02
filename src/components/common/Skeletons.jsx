export function SkeletonCard() {
  return (
    <div className="card p-4 space-y-3">
      <div className="skeleton h-48 w-full rounded-xl" />
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-4 w-1/2 rounded" />
      <div className="flex justify-between items-center">
        <div className="skeleton h-6 w-20 rounded" />
        <div className="skeleton h-9 w-24 rounded-lg" />
      </div>
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="skeleton h-12 w-12 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-1/3 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
      </div>
      <div className="skeleton h-8 w-16 rounded-lg" />
    </div>
  )
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`skeleton h-4 rounded ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  )
}

export function SkeletonPage() {
  return (
    <div className="page-wrapper py-10 space-y-6">
      <div className="skeleton h-10 w-64 rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  )
}
