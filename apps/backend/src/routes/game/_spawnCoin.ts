import { z } from "zod"
import { privateProcedure } from "../../trpc.ts"

export const spawnCoin = privateProcedure
  .input(
    z.object({
      gameId: z.number(),
    })
  )
  .mutation(() => {})
