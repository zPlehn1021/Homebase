import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  purchaseVerified: integer("purchase_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  propertyType: text("property_type", {
    enum: ["house", "condo", "townhouse", "apartment"],
  }),
  homeAgeYears: integer("home_age_years"),
  squareFootage: integer("square_footage"),
  homeFeatures: text("home_features", { mode: "json" }).$type<string[]>(),
  onboardingCompleted: integer("onboarding_completed", { mode: "boolean" })
    .notNull()
    .default(false),
  emailReminders: integer("email_reminders", { mode: "boolean" })
    .notNull()
    .default(true),
  reminderFrequency: text("reminder_frequency", { mode: "json" }).$type<
    string[]
  >(),
  weeklyDigest: integer("weekly_digest", { mode: "boolean" })
    .notNull()
    .default(false),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
});

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category", {
    enum: [
      "plumbing",
      "electrical",
      "hvac",
      "exterior",
      "interior",
      "yard",
      "seasonal",
      "appliances",
      "safety",
    ],
  }).notNull(),
  frequency: text("frequency", {
    enum: ["monthly", "quarterly", "semi-annually", "annually", "one-time"],
  }).notNull(),
  dueDate: text("due_date"),
  completedAt: text("completed_at"),
  isCustom: integer("is_custom", { mode: "boolean" }).notNull().default(false),
  estimatedCost: integer("estimated_cost"),
  actualCost: integer("actual_cost"),
  notes: text("notes"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const notificationsSent = sqliteTable("notifications_sent", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  taskId: integer("task_id").references(() => tasks.id, { onDelete: "cascade" }),
  type: text("type", { enum: ["reminder", "digest"] }).notNull(),
  sentAt: text("sent_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  sentDate: text("sent_date").notNull(), // "YYYY-MM-DD" for dedup
});

export const purchases = sqliteTable("purchases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  lemonSqueezyOrderId: text("lemonsqueezy_order_id").notNull().unique(),
  amount: integer("amount"), // cents
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const taskTemplates = sqliteTable("task_templates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category", {
    enum: [
      "plumbing",
      "electrical",
      "hvac",
      "exterior",
      "interior",
      "yard",
      "seasonal",
      "appliances",
      "safety",
    ],
  }).notNull(),
  frequency: text("frequency", {
    enum: ["monthly", "quarterly", "semi-annually", "annually", "one-time"],
  }).notNull(),
  monthDue: integer("month_due"),
  appliesTo: text("applies_to", { mode: "json" }).$type<string[]>(),
  priority: text("priority", {
    enum: ["low", "medium", "high"],
  })
    .notNull()
    .default("medium"),
  requiresFeature: text("requires_feature"),
});

// ── Inventory tables ────────────────────────────────────────────

export const inventoryItems = sqliteTable("inventory_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  parentId: integer("parent_id"),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category", {
    enum: [
      "plumbing",
      "electrical",
      "hvac",
      "exterior",
      "interior",
      "appliances",
      "safety",
      "other",
    ],
  }).notNull(),
  location: text("location"),
  manufacturer: text("manufacturer"),
  modelNumber: text("model_number"),
  serialNumber: text("serial_number"),
  partNumber: text("part_number"),
  purchaseDate: text("purchase_date"),
  purchaseCost: integer("purchase_cost"), // cents
  estimatedCost: integer("estimated_cost"), // cents, replacement value
  warrantyExpiration: text("warranty_expiration"),
  condition: text("condition", {
    enum: ["new", "good", "fair", "poor", "needs-replacement"],
  }),
  installDate: text("install_date"),
  notes: text("notes"),
  customFields: text("custom_fields", { mode: "json" }).$type<
    { label: string; value: string }[]
  >(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const inventoryDocuments = sqliteTable("inventory_documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  inventoryItemId: integer("inventory_item_id")
    .notNull()
    .references(() => inventoryItems.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type", {
    enum: ["warranty", "manual", "receipt", "photo", "other"],
  }).notNull(),
  url: text("url").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  uploadedAt: text("uploaded_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const taskInventoryLinks = sqliteTable(
  "task_inventory_links",
  {
    taskId: integer("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    inventoryItemId: integer("inventory_item_id")
      .notNull()
      .references(() => inventoryItems.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.taskId, table.inventoryItemId] })]
);

// ── Auth.js tables ──────────────────────────────────────────────

export const accounts = sqliteTable("accounts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const sessions = sqliteTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  sessionToken: text("sessionToken").notNull().unique(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })]
);
