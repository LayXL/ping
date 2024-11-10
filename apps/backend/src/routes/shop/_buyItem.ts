import { TRPCError } from "@trpc/server"
import { db } from "drizzle"
import { and, eq, sql } from "drizzle-orm"
import { userCoins, userShopItems } from "drizzle/schema.ts"
import { returnFirst } from "shared/returnFirst.ts"
import { z } from "zod"
import { privateProcedure } from "../../trpc.ts"

export const buyItem = privateProcedure
  .input(
    z.object({
      itemId: z.number(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const item = await db.query.shopItems.findFirst({
      where: (t) => eq(t.id, input.itemId),
    })

    if (!item) throw new TRPCError({ code: "NOT_FOUND" })

    const tx = await db.transaction(async (tx) => {
      const newBalance = await tx
        .update(userCoins)
        .set({
          value: sql`${userCoins.value} - ${item.price}`,
        })
        .where(eq(userCoins.userId, ctx.user.id))
        .returning()
        .then(returnFirst)

      if ((newBalance?.value ?? 0) < 0) {
        tx.rollback()
        return "NOT_ENOUGH_COINS" as const
      }

      const userItem = await tx
        .select()
        .from(userShopItems)
        .where(
          and(
            eq(userShopItems.userId, ctx.user.id),
            eq(userShopItems.itemId, item.id)
          )
        )
        .then(returnFirst)

      if (userItem) {
        tx.rollback()
        return "ALREADY_OWNED" as const
      }

      return tx
        .insert(userShopItems)
        .values({
          userId: ctx.user.id,
          itemId: item.id,
        })
        .returning()
        .then(returnFirst)
    })

    if (tx === "NOT_ENOUGH_COINS") throw new TRPCError({ code: "BAD_REQUEST" })
    if (tx === "ALREADY_OWNED") throw new TRPCError({ code: "BAD_REQUEST" })

    return tx
  })
