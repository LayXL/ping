import { db } from "drizzle"
import { eq } from "drizzle-orm"
import { privateProcedure } from "../../trpc.ts"

export const getStats = privateProcedure.query(async ({ ctx }) => {
  const coins = await db.query.userCoins.findFirst({
    where: (table) => eq(table.userId, ctx.user.id),
  })

  const points = await db.query.users.findFirst({
    where: (table) => eq(table.id, ctx.user.id),
  })

  return {
    coins: coins?.value,
    score: points?.creditedScore,
  }
})
