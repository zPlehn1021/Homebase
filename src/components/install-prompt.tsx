"use client";

import { useState, useEffect, useRef } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "pwa-install-dismissed";
const DISMISS_DAYS = 30;

function wasDismissedRecently(): boolean {
  try {
    const ts = localStorage.getItem(DISMISS_KEY);
    if (!ts) return false;
    const dismissedAt = parseInt(ts, 10);
    const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
    return daysSince < DISMISS_DAYS;
  } catch {
    return false;
  }
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function getIsIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
}

export function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone() || wasDismissedRecently()) return;

    const ios = getIsIOS();
    setIsIOS(ios);

    // On iOS, show manual instructions (Safari doesn't fire beforeinstallprompt)
    if (ios) {
      setShow(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt.current) return;
    await deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    if (outcome === "accepted") {
      setShow(false);
    }
    deferredPrompt.current = null;
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 lg:hidden">
      <div className="bg-white border border-stone-200 rounded-2xl shadow-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">🏡</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-stone-800">
              Install Homebase
            </p>
            {isIOS ? (
              <p className="text-xs text-stone-500 mt-0.5">
                Tap{" "}
                <svg
                  className="inline w-4 h-4 -mt-0.5 text-stone-600"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="6" width="12" height="11" rx="2" />
                  <path d="M10 2v9M7 5l3-3 3 3" />
                </svg>{" "}
                then &quot;Add to Home Screen&quot;
              </p>
            ) : (
              <p className="text-xs text-stone-500 mt-0.5">
                Add to your home screen for quick access
              </p>
            )}
          </div>
          {!isIOS && (
            <button
              onClick={handleInstall}
              className="px-3 py-1.5 rounded-lg bg-sage-600 text-white text-xs font-medium hover:bg-sage-700 transition-colors shrink-0"
            >
              Install
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 shrink-0"
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
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
