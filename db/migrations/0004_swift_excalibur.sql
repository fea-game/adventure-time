PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_User` (
	`id` text PRIMARY KEY DEFAULT '619cb0aa-a80c-41ad-86a4-4ea6d426698a' NOT NULL,
	`externalId` text NOT NULL,
	`externalSystem` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_User`("id", "externalId", "externalSystem") SELECT "id", "externalId", "externalSystem" FROM `User`;--> statement-breakpoint
DROP TABLE `User`;--> statement-breakpoint
ALTER TABLE `__new_User` RENAME TO `User`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `User_externalId_unique` ON `User` (`externalId`);