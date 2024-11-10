import { TRPCError } from "@trpc/server"
import { db } from "drizzle"
import { and, eq } from "drizzle-orm"
import { shopItems, users } from "drizzle/schema.ts"
import { returnFirst } from "shared/returnFirst.ts"
import { z } from "zod"
import { privateProcedure } from "../../trpc.ts"

export const selectSkin = privateProcedure
  .input(
    z.object({
      itemId: z.number().nullable(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const item = input.itemId
      ? await db
          .select()
          .from(shopItems)
          .where(eq(shopItems.id, input.itemId))
          .then(returnFirst)
      : null

    if (item) {
      const userItem = await db.query.userShopItems.findFirst({
        where: (t) => and(eq(t.itemId, item.id), eq(t.userId, ctx.user.id)),
      })

      if (!userItem) throw new TRPCError({ code: "NOT_FOUND" })
    }

    await db
      .update(users)
      .set({ selectedSkin: item?.name ?? "default" })
      .where(eq(users.id, ctx.user.id))
  })
