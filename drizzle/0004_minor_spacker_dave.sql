CREATE TABLE `task_completions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`task_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`completed_at` text NOT NULL,
	`actual_cost` integer,
	`category` text NOT NULL,
	`title` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `purchases` ADD `type` text DEFAULT 'purchase' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `has_donated` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `last_donation_prompt_at` text;