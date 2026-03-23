import {
  propertyTypes,
  homeAgeOptions,
  sqftOptions,
} from "@/lib/constants/home-profile";

export function StepHomeProfile({
  propertyType,
  homeAge,
  squareFootage,
  onPropertyType,
  onHomeAge,
  onSquareFootage,
  onNext,
  onBack,
}: {
  propertyType: string | null;
  homeAge: number | null;
  squareFootage: number | null;
  onPropertyType: (v: string) => void;
  onHomeAge: (v: number) => void;
  onSquareFootage: (v: number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const canContinue = propertyType && homeAge !== null && squareFootage !== null;

  return (
    <div className="space-y-8 py-4">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-stone-900">
          Tell us about your home
        </h2>
        <p className="text-sm text-stone-500">
          We&apos;ll use this to recommend the right maintenance tasks.
        </p>
      </div>

      {/* Property Type */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-stone-700">
          What type of property?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {propertyTypes.map((pt) => (
            <button
              key={pt.key}
              onClick={() => onPropertyType(pt.key)}
              className={`
                flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all
                ${
                  propertyType === pt.key
                    ? "border-sage-600 bg-sage-50 shadow-sm"
                    : "border-stone-200 bg-cream hover:border-sage-300"
                }
              `}
            >
              <span className="text-3xl">{pt.icon}</span>
              <span
                className={`text-sm font-medium ${
                  propertyType === pt.key ? "text-sage-800" : "text-stone-600"
                }`}
              >
                {pt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Home Age */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-stone-700">
          How old is your home?
        </label>
        <div className="flex flex-wrap gap-2">
          {homeAgeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onHomeAge(opt.value)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${
                  homeAge === opt.value
                    ? "bg-sage-600 text-white shadow-sm"
                    : "bg-cream border border-stone-200 text-stone-600 hover:border-sage-300"
                }
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Square Footage */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-stone-700">
          Approximate square footage?
        </label>
        <div className="flex flex-wrap gap-2">
          {sqftOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSquareFootage(opt.value)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${
                  squareFootage === opt.value
                    ? "bg-sage-600 text-white shadow-sm"
                    : "bg-cream border border-stone-200 text-stone-600 hover:border-sage-300"
                }
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-5 py-2.5 text-sm font-medium text-stone-500 hover:text-stone-700 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className={`
            px-6 py-2.5 rounded-xl text-sm font-semibold transition-all
            ${
              canContinue
                ? "bg-sage-600 text-white hover:bg-sage-700 shadow-sm"
                : "bg-stone-100 text-stone-300 cursor-not-allowed"
            }
          `}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
