export function EmptyState({
  icon = "📋",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <span className="text-4xl mb-3">{icon}</span>
      <h3 className="text-lg font-semibold text-stone-700 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-stone-400 max-w-sm mb-4">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 rounded-xl bg-sage-600 text-white text-sm font-medium hover:bg-sage-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
