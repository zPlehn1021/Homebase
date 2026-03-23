import { systems } from "@/lib/constants/home-profile";

export function StepHomeSystems({
  selectedFeatures,
  onToggle,
  onNext,
  onBack,
}: {
  selectedFeatures: string[];
  onToggle: (feature: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6 py-4">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-stone-900">
          What systems does your home have?
        </h2>
        <p className="text-sm text-stone-500">
          Select all that apply — we&apos;ll add relevant maintenance tasks.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {systems.map((sys) => {
          const isSelected = selectedFeatures.includes(sys.key);
          return (
            <button
              key={sys.key}
              onClick={() => onToggle(sys.key)}
              className={`
                flex items-center gap-2.5 p-3.5 rounded-xl border-2 transition-all text-left
                ${
                  isSelected
                    ? "border-sage-600 bg-sage-50"
                    : "border-stone-200 bg-cream hover:border-sage-300"
                }
              `}
            >
              <span className="text-xl shrink-0">{sys.icon}</span>
              <span
                className={`text-sm font-medium leading-tight ${
                  isSelected ? "text-sage-800" : "text-stone-600"
                }`}
              >
                {sys.label}
              </span>
              {isSelected && (
                <span className="ml-auto text-sage-600 shrink-0">✓</span>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-stone-400 text-center">
        {selectedFeatures.length === 0
          ? "No systems selected — you can always add them later in Settings."
          : `${selectedFeatures.length} system${selectedFeatures.length === 1 ? "" : "s"} selected`}
      </p>

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          className="px-5 py-2.5 text-sm font-medium text-stone-500 hover:text-stone-700 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-sage-600 text-white hover:bg-sage-700 transition-colors shadow-sm"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
