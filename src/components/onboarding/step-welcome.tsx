export function StepWelcome({
  onNext,
  onSkip,
}: {
  onNext: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="text-center space-y-8 py-8">
      <div className="space-y-2">
        <span className="text-6xl">🏡</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mt-4">
          Welcome to Homebase!
        </h1>
        <p className="text-lg text-stone-500 max-w-md mx-auto mt-3">
          Let&apos;s set up your home profile so we can create a personalized
          maintenance schedule just for you.
        </p>
      </div>

      <div className="bg-cream rounded-2xl border border-stone-200 p-6 max-w-sm mx-auto space-y-3">
        <p className="text-sm font-medium text-stone-700">
          This takes about 2 minutes:
        </p>
        <ul className="text-sm text-stone-500 space-y-2 text-left">
          <li className="flex items-center gap-2">
            <span className="text-sage-600">①</span> Tell us about your home
          </li>
          <li className="flex items-center gap-2">
            <span className="text-sage-600">②</span> Select your home systems
          </li>
          <li className="flex items-center gap-2">
            <span className="text-sage-600">③</span> Get your personalized plan
          </li>
        </ul>
      </div>

      <div className="space-y-3">
        <button
          onClick={onNext}
          className="px-8 py-3 bg-sage-600 text-white font-semibold rounded-xl hover:bg-sage-700 transition-colors text-base shadow-sm"
        >
          Get Started
        </button>
        <div>
          <button
            onClick={onSkip}
            className="text-sm text-stone-400 hover:text-stone-600 transition-colors underline underline-offset-2"
          >
            Skip — use default settings
          </button>
        </div>
      </div>
    </div>
  );
}
