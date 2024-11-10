import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  vkId: integer("vkId").unique(),
  displayName: text("displayName"),
  firstName: text("firstName"),
  lastName: text("lastName"),
  avatarUrl: text("avatarUrl"),
  latestActivityAt: timestamp("latestActivity", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  score: integer("score").notNull().default(0),
  creditedScore: integer("creditedScore").notNull().default(0),
  selectedSkin: text("selectedSkin").notNull().default("default"),
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
  }),
})

export const gameCoins = pgTable(
  "gameCoins",
  {
    uid: text("uid"),
    gameId: integer("gameId")
      .references(() => games.id)
      .notNull(),
    spawnedAt: timestamp("spawnedAt", { withTimezone: true }).notNull(),
    claimedAt: timestamp("claimedAt", { withTimezone: true }),
  },
  (t) => ({
    pk: [t.gameId, t.uid],
  })
)

export const shopItems = pgTable("shopItems", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
})

export const userShopItems = pgTable(
  "userShopItems",
  {
    userId: integer("userId")
      .references(() => users.id)
      .notNull(),
    itemId: integer("itemId")
      .references(() => shopItems.id)
      .notNull(),
  },
  (t) => ({
    pk: [t.userId, t.itemId],
  })
)
