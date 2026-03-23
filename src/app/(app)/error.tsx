"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AppError({
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
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            stroke="#e11d48"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="14" cy="14" r="10" />
            <path d="M14 9.5v5M14 18h.01" />
          </svg>
        </div>

        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Something went wrong
          </h2>
          <p className="mt-1.5 text-sm text-stone-500">
            We ran into an issue loading this page. Try again or head back to
            your dashboard.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => unstable_retry()}
            className="px-5 py-2.5 rounded-xl bg-sage-600 text-white text-sm font-semibold hover:bg-sage-700 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm font-semibold hover:bg-stone-50 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
