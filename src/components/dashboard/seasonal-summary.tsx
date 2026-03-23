export function SeasonalSummary({
  season = "Spring",
  emoji = "🌱",
  total = 8,
  completed = 1,
}: {
  season?: string;
  emoji?: string;
  total?: number;
  completed?: number;
}) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="rounded-2xl border border-stone-200 bg-cream p-5">
      <h3 className="text-sm font-semibold text-stone-600 mb-4">
        Seasonal Progress
      </h3>
      <div className="flex items-center gap-5">
        {/* Progress ring */}
        <div className="relative shrink-0">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#e7e5e4"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#5e6c51"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 50 50)"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-stone-800">{pct}%</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xl">{emoji}</span>
            <span className="font-semibold text-stone-800">{season}</span>
          </div>
          <p className="text-sm text-stone-500">
            <span className="font-semibold text-sage-700">{completed}</span> of{" "}
            <span className="font-semibold text-stone-700">{total}</span> tasks
            done
          </p>
          <p className="text-xs text-stone-400">
            {total - completed} remaining this season
          </p>
        </div>
      </div>
    </div>
  );
}
