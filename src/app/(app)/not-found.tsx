import Link from "next/link";

export default function AppNotFound() {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-5">
        <p className="text-6xl font-bold text-stone-200 tracking-tighter">
          404
        </p>

        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Page not found
          </h2>
          <p className="mt-1.5 text-sm text-stone-500">
            This page doesn&apos;t exist. It may have been moved or removed.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-sage-600 text-white text-sm font-semibold hover:bg-sage-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
