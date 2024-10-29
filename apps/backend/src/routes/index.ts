import { t } from "../trpc"

import { healthcheck } from "./healthcheck"
import * as user from "./user"

export const router = t.router({
  healthcheck,
  user,
})

export type Router = typeof router
