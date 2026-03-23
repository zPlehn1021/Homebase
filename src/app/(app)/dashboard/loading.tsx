export default function DashboardLoading() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="h-7 w-48 rounded-lg animate-shimmer" />
        <div className="h-4 w-72 rounded animate-shimmer" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-stone-200 bg-cream p-4 space-y-2"
          >
            <div className="h-3 w-16 rounded animate-shimmer" />
            <div className="h-8 w-12 rounded animate-shimmer" />
          </div>
        ))}
      </div>

      {/* Task cards */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-stone-200 bg-cream border-l-4 border-l-stone-200 px-4 py-3.5"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg animate-shimmer shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 rounded animate-shimmer" />
                <div className="h-3 w-24 rounded animate-shimmer" />
              </div>
              <div className="h-4 w-16 rounded animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
