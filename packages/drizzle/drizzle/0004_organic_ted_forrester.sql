ALTER TABLE "claimedCoins" RENAME TO "gameCoins";--> statement-breakpoint
ALTER TABLE "userCoins" RENAME COLUMN "coin" TO "value";--> statement-breakpoint
ALTER TABLE "gameCoins" DROP CONSTRAINT "claimedCoins_gameId_games_id_fk";
--> statement-breakpoint
ALTER TABLE "gameCoins" ALTER COLUMN "claimedAt" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "userCoins" ADD PRIMARY KEY ("userId");--> statement-breakpoint
ALTER TABLE "gameCoins" ADD COLUMN "uid" text;--> statement-breakpoint
ALTER TABLE "gameCoins" ADD COLUMN "spawnedAt" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "nextCoinSpawnAt" timestamp with time zone;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "gameCoins" ADD CONSTRAINT "gameCoins_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
