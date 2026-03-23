"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { HomebaseSession } from "@/lib/auth.d";

export function PurchaseBanner() {
  const { data: rawSession } = useSession();
  const session = rawSession as HomebaseSession | null;
  const [dismissed, setDismissed] = useState(false);

  // Don't show if no session, already purchased, or dismissed
  if (!session || !session.user || session.user.purchaseVerified || dismissed) {
    return null;
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
      <div className="flex items-center justify-between gap-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-lg shrink-0">✨</span>
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Free preview</span> — Purchase
            Homebase to unlock all features and keep your data.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/pricing"
            className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors"
          >
            Upgrade
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg hover:bg-amber-100 text-amber-400 transition-colors"
            aria-label="Dismiss"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M4 4l8 8M12 4L4 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
