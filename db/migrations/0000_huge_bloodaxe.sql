CREATE TABLE `users` (
	`id` text PRIMARY KEY DEFAULT 'd0c90f9e-ee46-4b2f-8c6a-2affc6f433c6' NOT NULL,
	`external_id` text,
	`external_system` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_external_id_unique` ON `users` (`external_id`);