import { startOfDay } from "date-fns/startOfDay"
import { db } from "drizzle"
import { and, eq, gte, sql } from "drizzle-orm"
import { games, users } from "drizzle/schema.ts"
import { returnFirst } from "shared/returnFirst.ts"
import { z } from "zod"
import { privateProcedure } from "../../../trpc.ts"

const maxScoreToCredit = 100

export const end = privateProcedure
  .input(
    z.object({
      gameId: z.number(),
      score: z.number().min(0).max(1000),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const game = await db.transaction(async (tx) => {
      const game = await tx
        .select()
        .from(games)
        .where(and(eq(games.id, input.gameId), eq(games.userId, ctx.user.id)))
        .then(returnFirst)

      if (!game) return tx.rollback()

      const todayCreditedScore = await tx
        .select()
        .from(games)
        .where(
          and(
            eq(games.userId, ctx.user.id),
            gte(games.createdAt, startOfDay(new Date()))
          )
        )
        .then((games) =>
          games.reduce((acc, game) => acc + game.creditedScore, 0)
        )

      const creditedScore = Math.max(
        Math.min(maxScoreToCredit - todayCreditedScore, input.score),
        0
      )

      await tx
        .update(users)
        .set({
          score: sql`${users.score} + ${input.score}`,
          creditedScore: sql`${users.creditedScore} + ${creditedScore}`,
        })
        .where(eq(users.id, ctx.user.id))
        .returning()
        .then(returnFirst)

      return await tx
        .update(games)
        .set({
          score: input.score,
          creditedScore,
        })
        .where(and(eq(games.id, input.gameId), eq(games.userId, ctx.user.id)))
        .returning()
        .then(returnFirst)
    })

    if (!game) throw new Error("Game not found")

    return game
  })
