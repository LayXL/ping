import { useEffect, useState } from "react"
import { gameConfig } from "../config"
import { useInterval } from "./useInterval"

export const useBallPosition = ({
  board,
  controllerPosition,
  isDead,
}: {
  board: HTMLDivElement | null
  controllerPosition: number
  isDead: boolean
}) => {
  const [xVelocity, setXVelocity] = useState(gameConfig.ballSpeed as number)
  const [yVelocity, setYVelocity] = useState(gameConfig.ballSpeed as number)

  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  useEffect(() => {
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
        (board?.clientHeight ?? 0) -
        gameConfig.controllerHeight -
        gameConfig.controllerOffset,
      bottom: (board?.clientHeight ?? 0) - gameConfig.controllerOffset,
    }

    const isOverlapping =
      controllerRect.left < ballRect.right &&
      controllerRect.right > ballRect.left &&
      controllerRect.top < ballRect.bottom &&
      controllerRect.bottom > ballRect.top

    if (isOverlapping) {
      setYVelocity((yVelocity) => -yVelocity)
    }
  }, [x, y, controllerPosition, board?.clientHeight])

  useInterval(() => {
    if (isDead) return

    setY((prevY) => {
      const newVal = prevY + yVelocity

      if (
        newVal > (board?.clientHeight ?? 0) - gameConfig.ballSize ||
        newVal < 0
      ) {
        setYVelocity((yVelocity) => -yVelocity)
        return prevY
      }

      return newVal
    })

    setX((prevX) => {
      const newVal = prevX + xVelocity

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

  return { x, y }
}
