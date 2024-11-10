import { db } from "drizzle"
import { and, desc, gte, lte } from "drizzle-orm"
import { users } from "drizzle/schema.ts"
import { z } from "zod"
import { privateProcedure } from "../../trpc.ts"

const leagues = {
  newbie: [10, 99],
  amateur: [100, 299],
  speedElite: [300, 599],
  gold: [600, 999],
  platinum: [1000, 1499],
  diamond: [1500, 1999],
  legend: [2000, 2999],
  infinity: [3000, Number.MAX_SAFE_INTEGER],
} as const

export const getLeaderboard = privateProcedure
  .input(
    z.object({
      league: z
        .enum(Object.keys(leagues) as [keyof typeof leagues])
        .default("newbie"),
    })
  )
  .query(async ({ input }) => {
    return await db
      .select()
      .from(users)
      .where(
        and(
          gte(users.creditedScore, leagues[input.league][0]),
          lte(users.creditedScore, leagues[input.league][1])
        )
      )
      .orderBy(desc(users.creditedScore))
      .limit(100)
      .then((users) =>
        users.map((user) => ({
          id: user.id,
          displayName: user.firstName,
          score: user.creditedScore,
          avatarUrl: user.avatarUrl,
        }))
      )
  })
