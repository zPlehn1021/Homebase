import { eq, and, isNull, isNotNull, lt, gte, lte } from "drizzle-orm";
import { getDb } from "@/db";
import { users, tasks, notificationsSent } from "@/db/schema";
import { verifyCronSecret } from "@/lib/cron-auth";
import { getResend } from "@/lib/resend";
import { formatDate } from "@/lib/utils";
import { WeeklyDigest } from "@/emails/weekly-digest";

export const dynamic = "force-dynamic";

const APP_URL = process.env.AUTH_URL || "https://homebase.app";

async function handleDigest(request: Request) {
  if (!verifyCronSecret(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const resend = getResend();
  if (!db || !resend) {
    return Response.json(
      { error: "Service not configured" },
      { status: 503 }
    );
  }

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const yearStart = `${now.getFullYear()}-01-01`;

  // Date 7 days from now
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split("T")[0];

  let sent = 0;
  let errors = 0;

  try {
    // Get all users with weekly digest enabled
    const eligibleUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
      })
      .from(users)
      .where(eq(users.weeklyDigest, true));

    for (const user of eligibleUsers) {
      // Dedup check
      const existing = await db
        .select({ id: notificationsSent.id })
        .from(notificationsSent)
        .where(
          and(
            eq(notificationsSent.userId, user.id),
            isNull(notificationsSent.taskId),
            eq(notificationsSent.type, "digest"),
            eq(notificationsSent.sentDate, todayStr)
          )
        )
        .limit(1);

      if (existing.length > 0) continue;

      // Upcoming tasks this week (due between today and today+7)
      const upcomingTasks = await db
        .select({
          title: tasks.title,
          category: tasks.category,
          dueDate: tasks.dueDate,
        })
        .from(tasks)
        .where(
          and(
            eq(tasks.userId, user.id),
            isNull(tasks.completedAt),
            isNotNull(tasks.dueDate),
            gte(tasks.dueDate, todayStr),
            lte(tasks.dueDate, nextWeekStr)
          )
        )
        .orderBy(tasks.dueDate);

      // Overdue count
      const overdueRows = await db
        .select({ id: tasks.id })
        .from(tasks)
        .where(
          and(
            eq(tasks.userId, user.id),
            isNull(tasks.completedAt),
            isNotNull(tasks.dueDate),
            lt(tasks.dueDate, todayStr)
          )
        );
      const overdueCount = overdueRows.length;

      // Completed this year
      const completedRows = await db
        .select({ id: tasks.id })
        .from(tasks)
        .where(
          and(
            eq(tasks.userId, user.id),
            isNotNull(tasks.completedAt),
            gte(tasks.completedAt, yearStart)
          )
        );
      const completedThisYear = completedRows.length;

      // Format tasks for the template
      const formattedTasks = upcomingTasks.map((t) => ({
        title: t.title,
        category: t.category
          ? t.category.charAt(0).toUpperCase() + t.category.slice(1)
          : "",
        dueDate: t.dueDate ? formatDate(t.dueDate) : "",
      }));

      // Send email
      try {
        await resend.emails.send({
          from: "Homebase <noreply@homebase.app>",
          to: user.email,
          subject: "Your Weekly Homebase Digest",
          react: WeeklyDigest({
            userName: user.name || "there",
            upcomingTasks: formattedTasks,
            overdueCount,
            completedThisYear,
            appUrl: APP_URL,
          }),
        });

        // Log sent notification
        await db.insert(notificationsSent).values({
          userId: user.id,
          taskId: null,
          type: "digest",
          sentDate: todayStr,
        });

        sent++;
      } catch (err) {
        console.error(
          `Failed to send weekly digest to ${user.email}:`,
          err
        );
        errors++;
      }
    }

    return Response.json({ sent, errors });
  } catch (error) {
    console.error("weekly-digest cron error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return handleDigest(request);
}
