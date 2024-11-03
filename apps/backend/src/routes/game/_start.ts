import { addSeconds } from "date-fns/addSeconds"
import { db } from "drizzle"
import { games } from "drizzle/schema.ts"
import { getRandomNumber } from "shared/getRandomNumber.ts"
import { returnFirst } from "shared/returnFirst.ts"
import { privateProcedure } from "../../trpc.ts"

export const start = privateProcedure.mutation(async ({ ctx }) => {
  return await db
    .insert(games)
    .values({
      userId: ctx.user.id,
      nextCoinSpawnAt: addSeconds(new Date(), getRandomNumber(5, 8)),
    })
    .returning()
    .then(returnFirst)
})
