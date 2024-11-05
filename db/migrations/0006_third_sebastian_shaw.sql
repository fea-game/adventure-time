PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_User` (
	`id` text PRIMARY KEY DEFAULT '5c231624-1cd1-4fe9-bd7e-1241f9576240' NOT NULL,
	`role` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_User`("id", "role") SELECT "id", "role" FROM `User`;--> statement-breakpoint
DROP TABLE `User`;--> statement-breakpoint
ALTER TABLE `__new_User` RENAME TO `User`;--> statement-breakpoint
PRAGMA foreign_keys=ON;