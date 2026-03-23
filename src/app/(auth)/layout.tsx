import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Homebase account to manage your home maintenance plan.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-warm-white relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-sage-50 opacity-60" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-sage-50 opacity-40" />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-amber-50 opacity-30" />
      <div className="relative flex items-center justify-center min-h-full p-4">
        {children}
      </div>
    </div>
  );
}
