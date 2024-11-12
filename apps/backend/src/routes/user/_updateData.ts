import { TRPCError } from "@trpc/server"
import { db } from "drizzle"
import { eq } from "drizzle-orm"
import { users } from "drizzle/schema.ts"
import { returnFirst } from "shared/returnFirst.ts"
import { privateProcedure } from "../../trpc.ts"
import { vkApi } from "../../vkApi.ts"

export const updateData = privateProcedure.query(async ({ ctx }) => {
  const user = await vkApi.api.users
    .get({
      user_ids: [ctx.user.vkId],
      fields: ["photo_max_orig"],
    })
    .then(returnFirst)

  if (!user)
    throw new TRPCError({ code: "NOT_FOUND", message: "User not found" })

  await db
    .update(users)
    .set({
      displayName: `${user.first_name} ${user.last_name}`,
      firstName: user.first_name,
      lastName: user.last_name,
      avatarUrl: user.photo_max_orig,
    })
    .where(eq(users.id, ctx.user.id))

  return true
})
