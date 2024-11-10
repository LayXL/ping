CREATE TABLE IF NOT EXISTS "shopItems" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userShopItems" (
	"userId" integer NOT NULL,
	"itemId" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "selectedSkin" text DEFAULT 'default' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userShopItems" ADD CONSTRAINT "userShopItems_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userShopItems" ADD CONSTRAINT "userShopItems_itemId_shopItems_id_fk" FOREIGN KEY ("itemId") REFERENCES "public"."shopItems"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
