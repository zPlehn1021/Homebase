import { getDb } from "@/db";
import { users, tasks, sessions, featureRequests, announcements, bugReports } from "@/db/schema";
import { count, eq } from "drizzle-orm";

export default async function AdminPage() {
  const db = getDb();

  const [userCount, taskCount, sessionCount, pendingCount, announcementCount, openBugCount] = db
    ? await Promise.all([
        db.select({ count: count() }).from(users),
        db.select({ count: count() }).from(tasks),
        db.select({ count: count() }).from(sessions),
        db.select({ count: count() }).from(featureRequests).where(eq(featureRequests.status, "pending")),
        db.select({ count: count() }).from(announcements).where(eq(announcements.active, true)),
        db.select({ count: count() }).from(bugReports).where(eq(bugReports.status, "open")),
      ])
    : [[{ count: 0 }], [{ count: 0 }], [{ count: 0 }], [{ count: 0 }], [{ count: 0 }], [{ count: 0 }]];

  const stats = [
    { label: "Users", value: userCount[0].count },
    { label: "Tasks", value: taskCount[0].count },
    { label: "Active Sessions", value: sessionCount[0].count },
    { label: "Pending Requests", value: pendingCount[0].count, href: "/admin/feature-requests" },
    { label: "Active Announcements", value: announcementCount[0].count, href: "/admin/announcements" },
    { label: "Open Bugs", value: openBugCount[0].count, href: "/admin/bug-reports" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-stone-900">Dashboard</h2>
        <p className="text-sm text-stone-500 mt-1">System overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Card = (
            <div
              key={stat.label}
              className={`bg-white border border-stone-200 rounded-xl p-5 ${stat.href ? "hover:border-sage-300 transition-colors" : ""}`}
            >
              <p className="text-sm text-stone-500">{stat.label}</p>
              <p className="text-3xl font-bold text-stone-900 mt-1">
                {stat.value}
              </p>
            </div>
          );
          return stat.href ? (
            <a key={stat.label} href={stat.href}>
              {Card}
            </a>
          ) : (
            Card
          );
        })}
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-stone-700 mb-2">
          Recovery Access
        </h3>
        <p className="text-sm text-stone-500">
          If you lose Google OAuth access, visit{" "}
          <code className="bg-stone-100 px-1.5 py-0.5 rounded text-xs font-mono">
            /admin/recover
          </code>{" "}
          and use your{" "}
          <code className="bg-stone-100 px-1.5 py-0.5 rounded text-xs font-mono">
            ADMIN_RECOVERY_SECRET
          </code>{" "}
          to create a new session.
        </p>
      </div>
    </div>
  );
}
