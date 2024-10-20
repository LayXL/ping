import { useEffect, useState } from "react"
import { gameConfig } from "../../config"
import { useHaptic } from "./use-haptic"
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
  onBounceHandler: () => void
) => {
  const haptic = useHaptic()

  const [xVelocity, setXVelocity] = useState(gameConfig.ballSpeed as number)
  const [yVelocity, setYVelocity] = useState(gameConfig.ballSpeed as number)

  const [x, setX] = useState(document.body.clientWidth / 2)
  const [y, setY] = useState(128)

  const [isOverlapping, setIsOverlapping] = useState(false)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isOverlapping) onBounceHandler()
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
        ballRect.left + gameConfig.ballSize / 2 > controllerRect.left &&
        ballRect.right - gameConfig.ballSize / 2 < controllerRect.right &&
        ballRect.bottom > controllerRect.top

      return isOverlapping
    }

    setY((prevY) => {
      const newVal = prevY + yVelocity * multiplier

      const isOverlapping = checkIsOverlapping()

      setIsOverlapping(isOverlapping)

      if (isOverlapping) {
        setYVelocity((yVelocity) => -Math.abs(yVelocity))
        haptic("impactLight")
        return newVal
      }

      if (newVal < 0) {
        setYVelocity((yVelocity) => -yVelocity)
        haptic("selection")
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
        haptic("selection")
        return prevX
      }

      return newVal
    })
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
