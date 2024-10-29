import { privateProcedure } from "../../../trpc.ts"

export const start = privateProcedure.mutation(async () => {
  return {}
})
