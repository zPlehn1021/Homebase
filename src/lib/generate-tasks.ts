import { eq, and } from "drizzle-orm";
import type { Database } from "@/db";
import { tasks, taskTemplates } from "@/db/schema";
import type { TaskCategory, TaskFrequency } from "@/lib/types";

export interface PreviewTask {
  title: string;
  description: string | null;
  category: TaskCategory;
  frequency: TaskFrequency;
  dueDate: string;
}

interface GenerateOptions {
  preview?: boolean;
  excludedTitles?: string[];
}

export async function generateTasksForUser(
  db: Database,
  userId: number,
  propertyType: string,
  homeFeatures?: string[],
  options?: GenerateOptions
): Promise<number | PreviewTask[]> {
  const preview = options?.preview ?? false;
  const excludedTitles = new Set(options?.excludedTitles ?? []);

  if (!preview) {
    // Delete existing auto-generated tasks (preserves custom tasks)
    // This enables re-onboarding with different settings
    await db
      .delete(tasks)
      .where(and(eq(tasks.userId, userId), eq(tasks.isCustom, false)));
  }

  // Fetch all templates
  const templates = await db.select().from(taskTemplates);

  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentYear = now.getFullYear();

  const tasksToInsert: (typeof tasks.$inferInsert)[] = [];
  const previewTasks: PreviewTask[] = [];

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

    // Filter by excluded titles (only for non-preview mode)
    if (!preview && excludedTitles.size > 0 && excludedTitles.has(template.title)) {
      continue;
    }

    const baseDueDay = 15;
    let dueYear = currentYear;
    let dueMonth = currentMonth;

    switch (template.frequency) {
      case "monthly": {
        dueYear = currentYear;
        dueMonth = currentMonth;
        break;
      }

      case "quarterly": {
        const quarters = [1, 4, 7, 10];
        const nextQ = quarters.find((q) => q + 2 >= currentMonth) || quarters[0];
        const computed = template.monthDue
          ? nextQ + ((template.monthDue - 1) % 3)
          : nextQ;
        dueMonth = Math.min(computed, 12);
        dueYear = dueMonth < currentMonth ? currentYear + 1 : currentYear;
        break;
      }

      case "semi-annually": {
        if (template.monthDue) {
          const months = [
            template.monthDue,
            ((template.monthDue - 1 + 6) % 12) + 1,
          ].sort((a, b) => a - b);
          dueMonth = months.find((m) => m >= currentMonth) || months[0];
          dueYear = dueMonth < currentMonth ? currentYear + 1 : currentYear;
        } else {
          dueMonth = currentMonth <= 6 ? 6 : 12;
          dueYear = currentYear;
        }
        break;
      }

      case "annually":
      case "one-time": {
        const m = template.monthDue || currentMonth + 3;
        dueMonth = Math.min(m, 12);
        dueYear = dueMonth < currentMonth ? currentYear + 1 : currentYear;
        break;
      }
    }

    const dueDate = `${dueYear}-${String(dueMonth).padStart(2, "0")}-${String(baseDueDay).padStart(2, "0")}`;

    if (preview) {
      previewTasks.push({
        title: template.title,
        description: template.description,
        category: template.category as TaskCategory,
        frequency: template.frequency as TaskFrequency,
        dueDate,
      });
    } else {
      tasksToInsert.push({
        userId,
        title: template.title,
        description: template.description,
        category: template.category,
        frequency: template.frequency,
        dueDate,
        isCustom: false,
        estimatedCost: null,
        notes: null,
      });
    }
  }

  if (preview) {
    return previewTasks;
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
