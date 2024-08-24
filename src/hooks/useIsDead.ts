import { useEffect, useState } from "react"
import { gameConfig } from "../config"

export const useDeath = (
  {
    board,
    ballPosition,
  }: {
    board: HTMLDivElement | null
    ballPosition: { x: number; y: number }
  },
  updater: (val: boolean) => void
) => {
  const [isDead, setIsDead] = useState(false)

  const safeZone = board?.clientHeight
    ? board.clientHeight -
      gameConfig.controllerHeight -
      gameConfig.controllerOffset
    : Number.MAX_SAFE_INTEGER

  useEffect(() => {
    if (ballPosition.y > safeZone) setIsDead(true)
  }, [ballPosition.y, safeZone])

  updater(isDead)
}
