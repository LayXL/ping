import { t } from "../trpc"

import * as game from "./game"
import { healthcheck } from "./healthcheck"

export const router = t.router({
  healthcheck,
  game,
})

export type Router = typeof router
