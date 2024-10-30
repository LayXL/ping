import { db } from "drizzle"
import { games } from "drizzle/schema.ts"
import { returnFirst } from "shared/returnFirst.ts"
import { privateProcedure } from "../../../trpc.ts"

export const start = privateProcedure.mutation(async ({ ctx }) => {
  return await db
    .insert(games)
    .values({
      userId: ctx.user.id,
    })
    .returning()
    .then(returnFirst)
})
