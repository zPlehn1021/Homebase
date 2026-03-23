import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { Providers } from "@/components/providers";
import { SWRegister } from "@/components/sw-register";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const siteDescription =
  "Your personalized home maintenance plan. Seasonal reminders, cost tracking, and smart scheduling — all for a one-time $19 payment.";

export const viewport: Viewport = {
  themeColor: "#5e6c51",
};

export const metadata: Metadata = {
  title: {
    default: "Homebase — Never Forget Home Maintenance Again",
    template: "%s | Homebase",
  },
  description: siteDescription,
  metadataBase: new URL("https://homebase.app"),
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Homebase",
  },
  icons: {
    icon: "/icon-192x192.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Homebase — Never Forget Home Maintenance Again",
    description: siteDescription,
    url: "https://homebase.app",
    siteName: "Homebase",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Homebase — Never Forget Home Maintenance Again",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="h-full">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-sage-600 focus:text-white focus:rounded-lg focus:m-2 focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
        <SWRegister />
      </body>
    </html>
  );
}
