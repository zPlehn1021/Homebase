export default function ScheduleLoading() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="h-7 w-32 rounded-lg animate-shimmer" />
        <div className="h-4 w-64 rounded animate-shimmer" />
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-8 rounded-lg animate-shimmer" />
        <div className="h-6 w-36 rounded animate-shimmer" />
        <div className="h-8 w-8 rounded-lg animate-shimmer" />
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-4 rounded animate-shimmer" />
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {[...Array(35)].map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl border border-stone-100 bg-cream p-2"
          >
            <div className="h-3 w-4 rounded animate-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
