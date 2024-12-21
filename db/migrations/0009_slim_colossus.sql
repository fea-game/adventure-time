PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Llm` (
	`id` text PRIMARY KEY DEFAULT 'b7ee6138-c9ea-40e8-9184-08d7dad400ef' NOT NULL,
	`userId` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`provider` text DEFAULT 'OpenAI' NOT NULL,
	`apiKey` text NOT NULL,
	`model` text,
	`temperature` real,
	`topP` real,
	`maxTokens` real,
	`frequencyPenalty` real,
	`presencePenalty` real,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_Llm`("id", "userId", "name", "description", "provider", "apiKey", "model", "temperature", "topP", "maxTokens", "frequencyPenalty", "presencePenalty") SELECT "id", "userId", "name", "description", "provider", "apiKey", "model", "temperature", "topP", "maxTokens", "frequencyPenalty", "presencePenalty" FROM `Llm`;--> statement-breakpoint
DROP TABLE `Llm`;--> statement-breakpoint
ALTER TABLE `__new_Llm` RENAME TO `Llm`;--> statement-breakpoint
PRAGMA foreign_keys=ON;