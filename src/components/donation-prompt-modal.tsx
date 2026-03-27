"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FocusTrap } from "@/components/ui/focus-trap";
import type { HomebaseSession } from "@/lib/auth.d";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const DONATION_URL =
  process.env.NEXT_PUBLIC_LEMONSQUEEZY_DONATION_URL || "/#pricing";

export function DonationPromptModal() {
  const { data: rawSession } = useSession();
  const session = rawSession as HomebaseSession | null;
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!session?.user || session.user.hasDonated) return;

    // Check if it's time to show the prompt
    fetch("/api/donation-prompt")
      .then((res) => res.json())
      .then((data) => {
        if (data.hasDonated) return;
        if (data.lastDonationPromptAt) {
          const elapsed =
            Date.now() - new Date(data.lastDonationPromptAt).getTime();
          if (elapsed < THIRTY_DAYS_MS) return;
        }
        setShow(true);
      })
      .catch(() => {
        // silently fail — don't block the user
      });
  }, [session]);

  const dismiss = () => {
    setShow(false);
    fetch("/api/donation-prompt", { method: "POST" }).catch(() => {});
  };

  const handleDonate = () => {
    window.open(DONATION_URL, "_blank", "noopener,noreferrer");
    dismiss();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Modal */}
      <FocusTrap onEscape={dismiss}>
        <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 sm:p-8">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-sage-50 border border-sage-200 flex items-center justify-center">
              <span className="text-2xl">🏡</span>
            </div>

            <h2 className="text-lg font-bold text-stone-900 mb-2">
              Enjoying Homebase?
            </h2>
            <p className="text-sm text-stone-500 leading-relaxed mb-6">
              You&apos;ve been using Homebase for a while! If it&apos;s been
              helpful in keeping your home maintained, consider supporting the
              project with a small donation. Every bit helps us keep it free for
              everyone.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleDonate}
                className="w-full px-6 py-3 rounded-2xl bg-sage-600 text-white font-semibold text-sm hover:bg-sage-700 transition-colors shadow-md shadow-sage-600/20"
              >
                Support Homebase
              </button>
              <button
                onClick={dismiss}
                className="w-full px-6 py-3 rounded-2xl border border-stone-200 text-stone-600 font-medium text-sm hover:bg-stone-50 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </FocusTrap>
    </div>
  );
}
