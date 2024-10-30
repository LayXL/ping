import { t } from "../trpc"

import * as game from "./game"
import { healthcheck } from "./healthcheck"
import * as leaderboard from "./leaderboard"

export const router = t.router({
  healthcheck,
  game,
  leaderboard,
})

export type Router = typeof router
