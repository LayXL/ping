import { startOfDay } from "date-fns/startOfDay"
import { db } from "drizzle"
import { and, eq, gte } from "drizzle-orm"
import { games } from "drizzle/schema.ts"
import { privateProcedure } from "../../trpc.ts"

export const getRemainingScore = privateProcedure.query(async ({ ctx }) => {
  const todayCreditedScore = await db
    .select()
    .from(games)
    .where(
      and(
        eq(games.userId, ctx.user.id),
        gte(games.createdAt, startOfDay(new Date()))
      )
    )
    .then((games) => games.reduce((acc, game) => acc + game.creditedScore, 0))

  const creditedScore = Math.max(100 - todayCreditedScore, 0)

  return {
    creditedScore,
    remainingScore: 100 - creditedScore,
  }
})
