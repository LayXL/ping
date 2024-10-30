import { db } from "drizzle"
import { desc } from "drizzle-orm"
import { users } from "drizzle/schema.ts"
import { privateProcedure } from "../../trpc.ts"

export const getLeaderboard = privateProcedure.query(async () => {
  return await db
    .select()
    .from(users)
    .orderBy(desc(users.creditedScore))
    .limit(100)
    .then((users) =>
      users.map((user) => ({
        id: user.id,
        displayName: user.displayName,
        creditedScore: user.creditedScore,
      }))
    )
})
