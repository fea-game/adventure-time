ALTER TABLE `users` RENAME TO `User`;--> statement-breakpoint
ALTER TABLE `User` RENAME COLUMN "external_id" TO "externalId";--> statement-breakpoint
ALTER TABLE `User` RENAME COLUMN "external_system" TO "externalSystem";--> statement-breakpoint
DROP INDEX IF EXISTS `users_external_id_unique`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_User` (
	`id` text PRIMARY KEY DEFAULT 'cd3c63ec-20d4-4e17-a685-1344f385e32a' NOT NULL,
	`externalId` text NOT NULL,
	`externalSystem` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_User`("id", "externalId", "externalSystem") SELECT "id", "externalId", "externalSystem" FROM `User`;--> statement-breakpoint
DROP TABLE `User`;--> statement-breakpoint
ALTER TABLE `__new_User` RENAME TO `User`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `User_externalId_unique` ON `User` (`externalId`);