import { db } from "drizzle"
import { shopItems, userShopItems } from "drizzle/schema.ts"
import { privateProcedure } from "../../trpc.ts"

export const getItems = privateProcedure.query(async () => {
  const items = await db.select().from(shopItems)

  const userItems = await db.select().from(userShopItems)

  return items.map((item) => ({
    ...item,
    owned: userItems.some((userItem) => userItem.itemId === item.id),
  }))
})
