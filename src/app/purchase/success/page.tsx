import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purchase Successful",
};

export default async function PurchaseSuccessPage() {
  // Check if the user is already logged in
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const s = session as any;
  const isVerified = s?.user?.purchaseVerified === true;

  // If already logged in and verified, redirect to dashboard
  if (isLoggedIn && isVerified) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-full bg-warm-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Success icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            stroke="#16a34a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="16" cy="16" r="12" />
            <path d="M11 16l3.5 3.5L21 13" />
          </svg>
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Thank you for your purchase!
          </h1>
          <p className="mt-2 text-stone-500">
            You now have lifetime access to Homebase.
          </p>
        </div>

        {/* Status card */}
        <div className="bg-cream rounded-2xl border border-stone-200 p-6 space-y-4 text-left">
          <div className="flex items-start gap-3">
            <span className="text-lg">📧</span>
            <div>
              <p className="text-sm font-semibold text-stone-800">
                Check your email
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                LemonSqueezy has sent you a receipt. Your purchase is being
                verified automatically.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-lg">🔑</span>
            <div>
              <p className="text-sm font-semibold text-stone-800">
                Sign in with the same email
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Use the email address from your purchase to sign in. Your
                account will be activated automatically.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        {isLoggedIn ? (
          <div className="space-y-3">
            <p className="text-sm text-stone-500">
              Your purchase is being verified. This usually takes just a moment.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-sage-600 text-white font-semibold hover:bg-sage-700 transition-colors"
            >
              Go to Dashboard
            </Link>
            <button
              onClick={undefined}
              className="text-sm text-sage-600 hover:text-sage-700 font-medium"
            >
              <Link href="/purchase/success">Refresh to check status</Link>
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-sage-600 text-white font-semibold hover:bg-sage-700 transition-colors"
          >
            Sign In to Access Your Planner
          </Link>
        )}

        {/* Return home */}
        <Link
          href="/"
          className="inline-block text-xs text-stone-400 hover:text-stone-600 transition-colors"
        >
          &larr; Back to Homebase
        </Link>
      </div>
    </div>
  );
}
