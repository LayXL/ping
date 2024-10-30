ALTER TABLE "games" ALTER COLUMN "terminatedAt" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "score" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "creditedScore" SET DEFAULT 0;