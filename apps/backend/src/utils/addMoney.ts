import { sql } from "drizzle-orm"
import { userCoins } from "drizzle/schema.ts"
import type { DBTransaction } from "./TransactionFunction.ts"

export const addMoneyTransaction =
  (opts: { userId: number; money: number }) => async (tx: DBTransaction) => {
    await tx.transaction(async (tx) => {
      await tx
        .insert(userCoins)
        .values({
          userId: opts.userId,
          value: 1,
        })
        .onConflictDoUpdate({
          set: { value: sql`${userCoins.value} + 1` },
          target: userCoins.userId,
        })
    })
  }
