import { auth } from "@/lib/auth";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const db = getDb();
  if (!db) {
    redirect("/dashboard");
  }

  const dbUser = await db
    .select({ isAdmin: users.isAdmin })
    .from(users)
    .where(eq(users.id, Number(session.user.id)))
    .limit(1);

  if (!dbUser[0]?.isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-stone-900">Admin Panel</h1>
              <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                Admin
              </span>
            </div>
            <a
              href="/dashboard"
              className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
            >
              &larr; Back to App
            </a>
          </div>
          <nav className="flex gap-6 -mb-px">
            {[
              { label: "Dashboard", href: "/admin" },
              { label: "Feature Requests", href: "/admin/feature-requests" },
              { label: "Bug Reports", href: "/admin/bug-reports" },
              { label: "Announcements", href: "/admin/announcements" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="pb-3 text-sm font-medium text-stone-500 hover:text-stone-800 border-b-2 border-transparent hover:border-stone-300 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
