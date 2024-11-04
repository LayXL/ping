import { t } from "../trpc"

import * as game from "./game"
import { healthcheck } from "./healthcheck"
import * as leaderboard from "./leaderboard"
import * as user from "./user"

export const router = t.router({
  healthcheck,
  game,
  leaderboard,
  user,
})

export type Router = typeof router
