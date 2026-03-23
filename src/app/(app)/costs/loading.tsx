export default function CostsLoading() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="h-7 w-24 rounded-lg animate-shimmer" />
        <div className="h-4 w-64 rounded animate-shimmer" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-stone-200 bg-cream p-4 space-y-2"
          >
            <div className="h-3 w-20 rounded animate-shimmer" />
            <div className="h-8 w-16 rounded animate-shimmer" />
          </div>
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="rounded-2xl border border-stone-200 bg-cream p-6">
        <div className="h-5 w-32 rounded animate-shimmer mb-4" />
        <div className="h-48 rounded-xl animate-shimmer" />
      </div>

      {/* Cost list */}
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-stone-200 bg-cream px-4 py-3.5"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg animate-shimmer shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 rounded animate-shimmer" />
                <div className="h-3 w-24 rounded animate-shimmer" />
              </div>
              <div className="h-5 w-14 rounded animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
