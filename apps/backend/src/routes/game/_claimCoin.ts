import { TRPCError } from "@trpc/server"
import { addSeconds } from "date-fns/addSeconds"
import { db } from "drizzle"
import { and, eq, isNull } from "drizzle-orm"
import { gameCoins, games } from "drizzle/schema.ts"
import { getRandomNumber } from "shared/getRandomNumber.ts"
import { returnFirst } from "shared/returnFirst.ts"
import { z } from "zod"
import { privateProcedure } from "../../trpc.ts"
import { addMoneyTransaction } from "../../utils/addMoney.ts"

export const claimCoin = privateProcedure
  .input(
    z.object({
      gameId: z.number(),
      uid: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const game = await db
      .select()
      .from(games)
      .where(and(eq(games.id, input.gameId), eq(games.userId, ctx.user.id)))
      .then(returnFirst)

    if (!game) throw new TRPCError({ code: "NOT_FOUND" })

    const nextSpawn = await db.transaction(async (tx) => {
      const coin = await tx
        .select()
        .from(gameCoins)
        .where(
          and(
            eq(gameCoins.uid, input.uid),
            eq(gameCoins.gameId, game.id),
            isNull(gameCoins.claimedAt)
          )
        )

      if (!coin) return tx.rollback()

      const nextSpawn = addSeconds(new Date(), getRandomNumber(5, 8))

      await tx
        .update(games)
        .set({
          nextCoinSpawnAt: nextSpawn,
        })
        .where(and(eq(games.id, input.gameId), eq(games.userId, ctx.user.id)))

      await tx
        .update(gameCoins)
        .set({
          claimedAt: new Date(),
        })
        .where(and(eq(gameCoins.uid, input.uid), eq(gameCoins.gameId, game.id)))

      await tx.transaction(
        addMoneyTransaction({ userId: ctx.user.id, money: 1 })
      )

      return nextSpawn
    })

    if (!nextSpawn) throw new TRPCError({ code: "BAD_REQUEST" })

    return {
      nextCoinSpawnAt: nextSpawn,
    }
  })
