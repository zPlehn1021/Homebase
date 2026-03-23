import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-full bg-warm-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <p className="text-7xl font-bold text-stone-200 tracking-tighter">
          404
        </p>

        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Page not found
          </h1>
          <p className="mt-2 text-stone-500 text-sm">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-sage-600 text-white font-semibold hover:bg-sage-700 transition-colors"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/"
            className="inline-block text-sm text-sage-600 hover:text-sage-700 font-medium"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
