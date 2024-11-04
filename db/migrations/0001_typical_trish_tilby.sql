PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY DEFAULT 'cca4f896-ef59-47a2-bda2-6cee6e33d737' NOT NULL,
	`external_id` text NOT NULL,
	`external_system` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "external_id", "external_system") SELECT "id", "external_id", "external_system" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_external_id_unique` ON `users` (`external_id`);