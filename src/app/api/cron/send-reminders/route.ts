import { eq, and, isNull, isNotNull } from "drizzle-orm";
import { getDb } from "@/db";
import { users, tasks, notificationsSent } from "@/db/schema";
import { verifyCronSecret } from "@/lib/cron-auth";
import { getResend } from "@/lib/resend";
import { formatDate } from "@/lib/utils";
import { TaskReminder } from "@/emails/task-reminder";

export const dynamic = "force-dynamic";

const APP_URL = process.env.AUTH_URL || "https://homebase.app";

function getDaysUntil(dueDate: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + "T00:00:00");
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function shouldRemind(daysUntil: number, frequency: string[]): boolean {
  if (frequency.includes("day_of") && daysUntil === 0) return true;
  if (frequency.includes("3_days") && daysUntil === 3) return true;
  if (frequency.includes("1_week") && daysUntil === 7) return true;
  return false;
}

async function handleReminders(request: Request) {
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

  const todayStr = new Date().toISOString().split("T")[0];
  let sent = 0;
  let errors = 0;

  try {
    // Get all users with email reminders enabled
    const eligibleUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        reminderFrequency: users.reminderFrequency,
      })
      .from(users)
      .where(eq(users.emailReminders, true));

    for (const user of eligibleUsers) {
      const frequency = (user.reminderFrequency as string[] | null) || [
        "day_of",
      ];
      if (frequency.length === 0) continue;

      // Get incomplete tasks with due dates
      const userTasks = await db
        .select({
          id: tasks.id,
          title: tasks.title,
          description: tasks.description,
          dueDate: tasks.dueDate,
        })
        .from(tasks)
        .where(
          and(
            eq(tasks.userId, user.id),
            isNull(tasks.completedAt),
            isNotNull(tasks.dueDate)
          )
        );

      for (const task of userTasks) {
        if (!task.dueDate) continue;

        const daysUntil = getDaysUntil(task.dueDate);
        if (!shouldRemind(daysUntil, frequency)) continue;

        // Dedup check
        const existing = await db
          .select({ id: notificationsSent.id })
          .from(notificationsSent)
          .where(
            and(
              eq(notificationsSent.userId, user.id),
              eq(notificationsSent.taskId, task.id),
              eq(notificationsSent.type, "reminder"),
              eq(notificationsSent.sentDate, todayStr)
            )
          )
          .limit(1);

        if (existing.length > 0) continue;

        // Send email
        try {
          await resend.emails.send({
            from: "Homebase <noreply@homebase.app>",
            to: user.email,
            subject: `Reminder: ${task.title}`,
            react: TaskReminder({
              userName: user.name || "there",
              taskTitle: task.title,
              taskDescription: task.description,
              dueDate: formatDate(task.dueDate),
              daysUntilDue: daysUntil,
              appUrl: APP_URL,
            }),
          });

          // Log sent notification
          await db.insert(notificationsSent).values({
            userId: user.id,
            taskId: task.id,
            type: "reminder",
            sentDate: todayStr,
          });

          sent++;
        } catch (err) {
          console.error(
            `Failed to send reminder to ${user.email} for task ${task.id}:`,
            err
          );
          errors++;
        }
      }
    }

    return Response.json({ sent, errors });
  } catch (error) {
    console.error("send-reminders cron error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return handleReminders(request);
}

export async function POST(request: Request) {
  return handleReminders(request);
}
