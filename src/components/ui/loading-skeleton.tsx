export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-stone-200 bg-cream p-4 animate-pulse"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-stone-200 rounded w-3/4" />
              <div className="h-3 bg-stone-100 rounded w-1/2" />
            </div>
            <div className="h-5 w-16 bg-stone-100 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-stone-200 bg-cream p-4 animate-pulse"
        >
          <div className="w-8 h-8 rounded bg-stone-200 mb-2" />
          <div className="h-7 bg-stone-200 rounded w-1/2 mb-1" />
          <div className="h-3 bg-stone-100 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}
