import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  vkId: integer("vkId").unique(),
  displayName: text("displayName"),
  latestActivityAt: timestamp("latestActivity", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  score: integer("score").notNull().default(0),
  creditedScore: integer("creditedScore").notNull().default(0),
})

export const userCoins = pgTable("userCoins", {
  userId: integer("userId")
    .references(() => users.id)
    .notNull()
    .primaryKey(),
  value: integer("value").notNull().default(0),
})

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  userId: integer("userId")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  terminatedAt: timestamp("terminatedAt", { withTimezone: true }),
  score: integer("score").notNull().default(0),
  creditedScore: integer("creditedScore").notNull().default(0),
  nextCoinSpawnAt: timestamp("nextCoinSpawnAt", {
    withTimezone: true,
  }).notNull(),
})

export const gameCoins = pgTable("gameCoins", {
  uid: text("uid").primaryKey(),
  gameId: integer("gameId")
    .references(() => games.id)
    .notNull()
    .primaryKey(),
  spawnedAt: timestamp("spawnedAt", { withTimezone: true }).notNull(),
  claimedAt: timestamp("claimedAt", { withTimezone: true }),
})
