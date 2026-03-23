"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AppShell } from "@/components/app-shell";
import type { HomebaseSession } from "@/lib/auth.d";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: rawSession, status } = useSession();
  const session = rawSession as HomebaseSession | null;
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    // If authenticated, check onboarding status from session
    if (status === "authenticated" && session?.user) {
      if (!session.user.onboardingCompleted) {
        router.replace("/onboarding");
      } else {
        setChecked(true);
      }
      return;
    }

    // Unauthenticated or no session — fall back to API check (mock data mode)
    fetch("/api/user")
      .then((res) => {
        if (!res.ok) {
          setChecked(true);
          return null;
        }
        return res.json();
      })
      .then((user) => {
        if (user && !user.onboardingCompleted) {
          router.replace("/onboarding");
        } else {
          setChecked(true);
        }
      })
      .catch(() => {
        setChecked(true);
      });
  }, [router, rawSession, status]);

  if (!checked) {
    return (
      <div className="flex h-full items-center justify-center bg-warm-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-sage-200 border-t-sage-600" />
          <p className="text-sm text-stone-400">Loading...</p>
        </div>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
