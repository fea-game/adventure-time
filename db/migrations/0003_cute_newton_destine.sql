PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_User` (
	`id` text PRIMARY KEY DEFAULT 'ba33a66c-01b4-4945-848f-f9c1784f7510' NOT NULL,
	`externalId` text NOT NULL,
	`externalSystem` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_User`("id", "externalId", "externalSystem") SELECT "id", "externalId", "externalSystem" FROM `User`;--> statement-breakpoint
DROP TABLE `User`;--> statement-breakpoint
ALTER TABLE `__new_User` RENAME TO `User`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `User_externalId_unique` ON `User` (`externalId`);