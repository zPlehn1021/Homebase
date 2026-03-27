"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { HomebaseSession } from "@/lib/auth.d";

const DISMISS_KEY = "homebase_donation_banner_dismissed_at";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const DONATION_URL =
  process.env.NEXT_PUBLIC_LEMONSQUEEZY_DONATION_URL || "/#pricing";

export function DonationBanner() {
  const { data: rawSession } = useSession();
  const session = rawSession as HomebaseSession | null;
  const [dismissed, setDismissed] = useState(true); // start hidden, show after check

  useEffect(() => {
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const elapsed = Date.now() - Number(dismissedAt);
      if (elapsed < THIRTY_DAYS_MS) return; // still within 30-day dismiss window
    }
    setDismissed(false);
  }, []);

  // Don't show if no session, already donated, or dismissed
  if (!session || !session.user || session.user.hasDonated || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setDismissed(true);
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
      <div className="flex items-center justify-between gap-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-lg shrink-0">&#9825;</span>
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Enjoying Homebase?</span> If
            it&apos;s been helpful, consider supporting the project with a
            donation.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={DONATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors"
          >
            Donate
          </a>
          <button
            onClick={handleDismiss}
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
