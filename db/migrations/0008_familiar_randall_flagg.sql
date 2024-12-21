CREATE TABLE `Llm` (
	`id` text PRIMARY KEY DEFAULT 'd497b9f8-4305-4e84-8754-62e63bbde05f' NOT NULL,
	`userId` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`apiKey` text NOT NULL,
	`model` text,
	`temperature` real,
	`topP` real,
	`maxTokens` real,
	`frequencyPenalty` real,
	`presencePenalty` real,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE no action
);
