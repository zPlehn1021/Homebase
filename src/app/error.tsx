"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-full bg-warm-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            stroke="#e11d48"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="16" cy="16" r="12" />
            <path d="M16 11v6M16 21h.01" />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Something went wrong
          </h1>
          <p className="mt-2 text-stone-500 text-sm">
            We hit an unexpected issue. Try refreshing the page or head back to
            your dashboard.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => unstable_retry()}
            className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-sage-600 text-white font-semibold hover:bg-sage-700 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-block text-sm text-sage-600 hover:text-sage-700 font-medium"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
