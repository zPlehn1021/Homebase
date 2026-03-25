"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import type { HomebaseSession } from "@/lib/auth.d";
import { SubmitBugModal } from "@/components/bug-reports/submit-bug-modal";
import { useBugReports } from "@/lib/hooks/use-bug-reports";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5L10 4l7 6.5" />
        <path d="M5 9.5V16a1 1 0 001 1h3v-4h2v4h3a1 1 0 001-1V9.5" />
      </svg>
    ),
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="14" height="14" rx="2" />
        <path d="M7 10l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="14" height="14" rx="2" />
        <path d="M3 8h14M8 8v9" />
      </svg>
    ),
  },
  {
    label: "Schedule",
    href: "/schedule",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="14" height="13" rx="2" />
        <path d="M3 8h14M7 2v4M13 2v4" />
      </svg>
    ),
  },
  {
    label: "Costs",
    href: "/costs",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="7" />
        <path d="M10 6v8M8 8.5a2 2 0 012-1.5h1a1.5 1.5 0 010 3H9a1.5 1.5 0 000 3h1a2 2 0 002-1.5" />
      </svg>
    ),
  },
  {
    label: "Feature Requests",
    href: "/feature-requests",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 3a4 4 0 014 4c0 1.5-.8 2.7-2 3.4V12a1 1 0 01-1 1H9a1 1 0 01-1-1v-1.6A4 4 0 0110 3z" />
        <path d="M8 15h4M9 17h2" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/settings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="2.5" />
        <path d="M10 3v2M10 15v2M17 10h-2M5 10H3M14.95 5.05l-1.41 1.41M6.46 13.54l-1.41 1.41M14.95 14.95l-1.41-1.41M6.46 6.46L5.05 5.05" />
      </svg>
    ),
  },
];

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { data: rawSession } = useSession();
  const session = rawSession as HomebaseSession | null;
  const [bugModalOpen, setBugModalOpen] = useState(false);
  const { submitReport } = useBugReports();

  const userName = session?.user?.name || "Homeowner";
  const userPropertyType = session?.user?.propertyType || "home";
  const userSquareFootage = session?.user?.squareFootage;

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-out
        lg:static lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}
        flex flex-col bg-cream border-r border-stone-200
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🏡</span>
          <span className="text-xl font-bold text-bark tracking-tight">
            Homebase
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 hover:bg-stone-100 lg:hidden transition-colors"
          aria-label="Close menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M4 4l10 10M14 4L4 14" />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={isActive ? "page" : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${
                  isActive
                    ? "bg-sage-100 text-sage-800 shadow-sm"
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-700"
                }
              `}
            >
              <span className={isActive ? "text-sage-600" : "text-stone-400"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bug Report */}
      <div className="px-3 py-2">
        <button
          onClick={() => setBugModalOpen(true)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition-all duration-150"
        >
          <span className="text-stone-400">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="7" />
              <path d="M10 7v3M10 13h.01" />
            </svg>
          </span>
          Report a Bug
        </button>
      </div>

      {bugModalOpen && (
        <SubmitBugModal
          onSubmit={submitReport}
          onClose={() => setBugModalOpen(false)}
        />
      )}

      {/* User section */}
      <div className="p-3 mt-auto space-y-2">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-stone-100/60">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-sage-200 text-sage-700 font-semibold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-stone-700 truncate">
              {userName}
            </p>
            <p className="text-xs text-stone-400 truncate">
              {userPropertyType}
              {userSquareFootage ? ` · ${userSquareFootage.toLocaleString()} sqft` : ""}
            </p>
          </div>
        </div>

        {session && (
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6" />
            </svg>
            Sign out
          </button>
        )}
      </div>
    </aside>
  );
}
