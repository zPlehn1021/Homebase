import { eq, and } from "drizzle-orm";
import type { Database } from "@/db";
import { tasks, taskTemplates } from "@/db/schema";

export async function generateTasksForUser(
  db: Database,
  userId: number,
  propertyType: string,
  homeFeatures?: string[]
): Promise<number> {
  // Delete existing auto-generated tasks (preserves custom tasks)
  // This enables re-onboarding with different settings
  await db
    .delete(tasks)
    .where(and(eq(tasks.userId, userId), eq(tasks.isCustom, false)));

  // Fetch all templates
  const templates = await db.select().from(taskTemplates);

  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentYear = now.getFullYear();

  const tasksToInsert: (typeof tasks.$inferInsert)[] = [];

  for (const template of templates) {
    // Filter by property type
    const appliesTo = template.appliesTo as string[] | null;
    if (appliesTo && !appliesTo.includes(propertyType)) continue;

    // Filter by required feature
    if (template.requiresFeature) {
      if (!homeFeatures || !homeFeatures.includes(template.requiresFeature)) {
        continue;
      }
    }

    const baseDueDay = 15;

    switch (template.frequency) {
      case "monthly": {
        // Create one task per remaining month
        for (let m = currentMonth; m <= 12; m++) {
          tasksToInsert.push(
            makeTask(template, userId, currentYear, m, baseDueDay)
          );
        }
        break;
      }

      case "quarterly": {
        // Quarter start months: 1, 4, 7, 10
        const quarters = [1, 4, 7, 10];
        for (const q of quarters) {
          if (q + 2 >= currentMonth) {
            const dueMonth = template.monthDue
              ? q + ((template.monthDue - 1) % 3)
              : q;
            const m = Math.min(dueMonth, 12);
            const year = m < currentMonth ? currentYear + 1 : currentYear;
            tasksToInsert.push(
              makeTask(template, userId, year, m, baseDueDay)
            );
          }
        }
        break;
      }

      case "semi-annually": {
        if (template.monthDue) {
          // Create for monthDue and 6 months later
          const months = [
            template.monthDue,
            ((template.monthDue - 1 + 6) % 12) + 1,
          ];
          for (const m of months) {
            const year = m < currentMonth ? currentYear + 1 : currentYear;
            tasksToInsert.push(
              makeTask(template, userId, year, m, baseDueDay)
            );
          }
        } else {
          tasksToInsert.push(
            makeTask(template, userId, currentYear, 6, baseDueDay)
          );
          tasksToInsert.push(
            makeTask(template, userId, currentYear, 12, baseDueDay)
          );
        }
        break;
      }

      case "annually":
      case "one-time": {
        const m = template.monthDue || currentMonth + 3;
        const dueMonth = Math.min(m, 12);
        const year =
          dueMonth < currentMonth ? currentYear + 1 : currentYear;
        tasksToInsert.push(
          makeTask(template, userId, year, dueMonth, baseDueDay)
        );
        break;
      }
    }
  }

  if (tasksToInsert.length > 0) {
    // Insert in batches of 20
    for (let i = 0; i < tasksToInsert.length; i += 20) {
      const batch = tasksToInsert.slice(i, i + 20);
      await db.insert(tasks).values(batch);
    }
  }

  return tasksToInsert.length;
}

function makeTask(
  template: typeof taskTemplates.$inferSelect,
  userId: number,
  year: number,
  month: number,
  day: number
): typeof tasks.$inferInsert {
  const dueDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return {
    userId,
    title: template.title,
    description: template.description,
    category: template.category,
    frequency: template.frequency,
    dueDate,
    isCustom: false,
    estimatedCost: null,
    notes: null,
  };
}
