import { TRPCError } from "@trpc/server"
import { db } from "drizzle"
import { and, eq } from "drizzle-orm"
import { gameCoins, games } from "drizzle/schema.ts"
import { returnFirst } from "shared/returnFirst.ts"
import { z } from "zod"
import { privateProcedure } from "../../trpc.ts"

export const spawnCoin = privateProcedure
  .input(
    z.object({
      gameId: z.number(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const game = await db
      .select()
      .from(games)
      .where(and(eq(games.id, input.gameId), eq(games.userId, ctx.user.id)))
      .then(returnFirst)

    if (!game) throw new TRPCError({ code: "NOT_FOUND" })

    if (game.nextCoinSpawnAt > new Date())
      throw new TRPCError({ code: "BAD_REQUEST" })

    return await db
      .insert(gameCoins)
      .values({
        uid: crypto.randomUUID(),
        gameId: input.gameId,
        spawnedAt: new Date(),
      })
      .then(returnFirst)
  })
