import { useState } from "react"
import { gameConfig } from "../../config"
import { useInterval } from "./use-interval"

export const useBallPosition = (
  {
    board,
    controllerPosition,
    isDead,
    multiplier,
  }: {
    board: HTMLDivElement | null
    controllerPosition: number
    isDead: boolean
    multiplier: number
  },
  onBounceHandler: () => void,
  onDead: () => void
) => {
  const [xVelocity, setXVelocity] = useState(gameConfig.ballSpeed as number)
  const [yVelocity, setYVelocity] = useState(gameConfig.ballSpeed as number)

  const [x, setX] = useState(document.body.clientWidth / 2)
  const [y, setY] = useState(128)

  const boardWidth = board ? board.clientWidth : document.body.clientWidth
  const boardHeight = board ? board.clientHeight : window.innerHeight
  const platformHeight = gameConfig.controllerHeight
  const platformWidth = gameConfig.controllerSize

  useInterval(() => {
    if (isDead) return

    let newX = x + xVelocity
    let newY = y + yVelocity

    if (newX <= 0) {
      setXVelocity(-xVelocity)
      newX = 0
    }

    if (newX + gameConfig.ballSize >= boardWidth) {
      setXVelocity(-xVelocity)
      newX = boardWidth - gameConfig.ballSize
    }

    if (newY <= 0) {
      setYVelocity(-yVelocity)
      newY = 0
    }

    const platformTop = boardHeight - platformHeight
    const platformLeft = controllerPosition - platformWidth / 2
    const platformRight = controllerPosition + platformWidth / 2

    const ballCenterX = newX + gameConfig.ballSize / 2
    const ballHalfWidth = gameConfig.ballSize / 2

    if (
      newY + gameConfig.ballSize >= platformTop &&
      ballCenterX + ballHalfWidth >= platformLeft &&
      ballCenterX - ballHalfWidth <= platformRight &&
      yVelocity > 0
    ) {
      setYVelocity(-yVelocity)
      onBounceHandler()
      newY = platformTop - gameConfig.ballSize
    }

    if (newY + gameConfig.ballSize >= boardHeight) {
      onDead()
      return
    }

    setX(newX)
    setY(newY)
  }, 1000 / 200)

  return [
    { x, y },
    (x: number, y: number, xVelocity?: number, yVelocity?: number) => {
      setX(x)
      setY(y)
      if (xVelocity) setXVelocity(xVelocity)
      if (yVelocity) setYVelocity(yVelocity)
    },
  ] as const
}
