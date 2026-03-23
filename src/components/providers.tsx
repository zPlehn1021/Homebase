"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#fdfcfa",
            border: "1px solid #e7e5e4",
            color: "#292524",
            fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
          },
        }}
        richColors
      />
    </SessionProvider>
  );
}
