import { privateProcedure } from "../../trpc.ts"

export const getSelectedSkin = privateProcedure.query(({ ctx }) => {
  return ctx.user.selectedSkin
})
