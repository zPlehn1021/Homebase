const stepLabels = ["Welcome", "Your Home", "Systems", "All Set"];

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {stepLabels.map((label, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={step} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className={`w-8 h-0.5 ${
                  isCompleted ? "bg-sage-400" : "bg-stone-200"
                }`}
              />
            )}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
                  ${
                    isActive
                      ? "bg-sage-600 text-white"
                      : isCompleted
                        ? "bg-sage-100 text-sage-700"
                        : "bg-stone-100 text-stone-400"
                  }
                `}
              >
                {isCompleted ? "✓" : step}
              </div>
              <span
                className={`text-xs hidden sm:block ${
                  isActive
                    ? "text-sage-700 font-medium"
                    : "text-stone-400"
                }`}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
