import { useEffect, useState } from "react"
import { gameConfig } from "../config"
import { useInterval } from "./useInterval"

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
  onBounceHandler: () => void
) => {
  const [xVelocity, setXVelocity] = useState(gameConfig.ballSpeed as number)
  const [yVelocity, setYVelocity] = useState(gameConfig.ballSpeed as number)

  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  const [isOverlapping, setIsOverlapping] = useState(false)

  useEffect(() => {
    if (isOverlapping) onBounceHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOverlapping])

  useInterval(() => {
    if (isDead) return

    const checkIsOverlapping = () => {
      if (!board?.clientHeight) return false

      const ballRect = {
        left: x,
        right: x + gameConfig.ballSize,
        top: y,
        bottom: y + gameConfig.ballSize,
      }

      const controllerRect = {
        left: controllerPosition,
        right: controllerPosition + gameConfig.controllerSize,
        top:
          board.clientHeight -
          gameConfig.controllerHeight -
          gameConfig.controllerOffset,
        bottom: (board?.clientHeight ?? 0) - gameConfig.controllerOffset,
      }

      const isOverlapping =
        ballRect.right > controllerRect.left &&
        ballRect.left < controllerRect.right &&
        ballRect.bottom > controllerRect.top

      return isOverlapping
    }

    setY((prevY) => {
      const newVal = prevY + yVelocity * multiplier

      const isOverlapping = checkIsOverlapping()

      setIsOverlapping(isOverlapping)

      if (isOverlapping) {
        setYVelocity((yVelocity) => -Math.abs(yVelocity))
        return newVal
      } else if (newVal < 0) {
        setYVelocity((yVelocity) => -yVelocity)
        return prevY
      }

      return newVal
    })

    setX((prevX) => {
      const newVal = prevX + xVelocity * multiplier

      if (
        newVal > (board?.clientWidth ?? 0) - gameConfig.ballSize ||
        newVal < 0
      ) {
        setXVelocity((xVelocity) => -xVelocity)
        return prevX
      }

      return newVal
    })
  }, 1000 / 60)

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
