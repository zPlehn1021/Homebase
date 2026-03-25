"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { PurchaseBanner } from "./purchase-banner";
import { InstallPrompt } from "./install-prompt";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-full w-full">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="flex items-center gap-3 px-4 py-3 lg:hidden border-b border-stone-200 bg-cream">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 hover:bg-stone-100 transition-colors"
            aria-label="Open menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M3 5h14M3 10h14M3 15h14" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">🏡</span>
            <span className="font-semibold text-bark text-lg tracking-tight">
              Homebase
            </span>
          </div>
        </header>

        <PurchaseBanner />
        <main id="main-content" className="flex-1 overflow-y-auto">{children}</main>
      </div>

      <InstallPrompt />
    </div>
  );
}
