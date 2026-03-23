export default function TasksLoading() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-7 w-32 rounded-lg animate-shimmer" />
          <div className="h-4 w-56 rounded animate-shimmer" />
        </div>
        <div className="h-10 w-28 rounded-xl animate-shimmer" />
      </div>

      {/* Tab bar */}
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-9 w-20 rounded-xl animate-shimmer" />
        ))}
      </div>

      {/* Task cards */}
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-stone-200 bg-cream border-l-4 border-l-stone-200 px-4 py-3.5"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg animate-shimmer shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-44 rounded animate-shimmer" />
                <div className="h-3 w-28 rounded animate-shimmer" />
              </div>
              <div className="text-right space-y-1">
                <div className="h-3 w-16 rounded animate-shimmer" />
                <div className="h-3 w-12 rounded animate-shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
