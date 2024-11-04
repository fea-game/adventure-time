PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_User` (
	`id` text PRIMARY KEY DEFAULT '15a7dba9-1a5b-4110-8e0d-55b096d10580' NOT NULL,
	`role` text NOT NULL,
	`externalId` text NOT NULL,
	`externalSystem` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_User`("id", "role", "externalId", "externalSystem") SELECT "id", "role", "externalId", "externalSystem" FROM `User`;--> statement-breakpoint
DROP TABLE `User`;--> statement-breakpoint
ALTER TABLE `__new_User` RENAME TO `User`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `User_externalId_unique` ON `User` (`externalId`);