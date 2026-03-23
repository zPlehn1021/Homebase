"use client";

import { useState } from "react";
import Link from "next/link";

const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL || "/#pricing";

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-warm-white/80 backdrop-blur-lg border-b border-stone-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🏡</span>
            <span className="text-lg font-bold text-stone-900 tracking-tight">
              Homebase
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm text-stone-500 hover:text-stone-800 transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm text-stone-500 hover:text-stone-800 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="text-sm text-stone-500 hover:text-stone-800 transition-colors"
            >
              FAQ
            </a>
            <Link
              href="/login"
              className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              Log In
            </Link>
            <a
              href={CHECKOUT_URL}
              className="px-4 py-2 rounded-xl bg-sage-600 text-white text-sm font-semibold hover:bg-sage-700 transition-colors shadow-sm"
            >
              Get Started
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden p-2 rounded-lg hover:bg-stone-100 text-stone-600"
            aria-label="Toggle menu"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              {mobileOpen ? (
                <>
                  <path d="M5 5l12 12" />
                  <path d="M17 5L5 17" />
                </>
              ) : (
                <>
                  <path d="M3 6h16" />
                  <path d="M3 11h16" />
                  <path d="M3 16h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-stone-200/60 bg-warm-white px-4 pb-4 pt-2 space-y-1">
          <a
            href="#features"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm text-stone-600 hover:text-stone-900"
          >
            Features
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm text-stone-600 hover:text-stone-900"
          >
            Pricing
          </a>
          <a
            href="#faq"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm text-stone-600 hover:text-stone-900"
          >
            FAQ
          </a>
          <Link
            href="/login"
            className="block py-2 text-sm font-medium text-stone-600 hover:text-stone-900"
          >
            Log In
          </Link>
          <a
            href={CHECKOUT_URL}
            className="block mt-2 text-center px-4 py-2.5 rounded-xl bg-sage-600 text-white text-sm font-semibold hover:bg-sage-700 transition-colors"
          >
            Get Started
          </a>
        </div>
      )}
    </nav>
  );
}
