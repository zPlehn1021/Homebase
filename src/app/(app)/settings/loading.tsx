export default function SettingsLoading() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="h-7 w-28 rounded-lg animate-shimmer" />
        <div className="h-4 w-72 rounded animate-shimmer" />
      </div>

      {/* Settings sections */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-stone-200 bg-cream p-5 space-y-4"
        >
          <div className="h-5 w-36 rounded animate-shimmer" />
          <div className="space-y-3">
            <div className="h-10 w-full rounded-xl animate-shimmer" />
            <div className="h-10 w-full rounded-xl animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
