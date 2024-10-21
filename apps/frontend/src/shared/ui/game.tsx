import { motion } from "framer-motion"
import { useMemo, useRef, useState } from "react"
import { useScrollLock } from "usehooks-ts"
import { gameConfig } from "../../config"
import { useControllerPosition } from "../hooks/use-controller-position"
import { useHaptic } from "../hooks/use-haptic"
import { useInterval } from "../hooks/use-interval"
import { cn } from "../utils/cn"
import { Controller } from "./controller"
import { Points } from "./points"

type GameProps = {
  onDead?: (score: number) => void
  withOffset?: boolean
  isPreview?: boolean
  points?: number
}

export const Game = (props: GameProps) => {
  const haptic = useHaptic()
  const boardRef = useRef<HTMLDivElement>(null)

  const [points, setPoints] = useState(props.points ?? 0)
  const [isDead, setIsDead] = useState(false)

  const multiplier = useMemo(() => {
    if (points >= 50) return 2
    if (points >= 25) return 1.75
    if (points >= 10) return 1.5
    if (points >= 5) return 1.25
    return 1
  }, [points])

  const [ballPosition, setBallPosition] = useState({ x: 100, y: 100 })
  const [speedX, setSpeedX] = useState(gameConfig.ballSpeed as number)
  const [speedY, setSpeedY] = useState(gameConfig.ballSpeed as number)

  const controllerPosition = props.isPreview
    ? Math.max(
        Math.min(
          ballPosition.x - gameConfig.controllerSize / 2,
          (boardRef.current?.clientWidth ?? 0) - gameConfig.controllerSize - 16
        ),
        16
      )
    : useControllerPosition({ board: boardRef.current })

  useInterval(() => {
    if (isDead) return

    setBallPosition((prev) => {
      const newX = prev.x + speedX * (props.isPreview ? 1 : multiplier)
      const newY = prev.y + speedY * (props.isPreview ? 1 : multiplier)

      const boardWidth =
        boardRef.current?.clientWidth ?? Number.POSITIVE_INFINITY

      const boardHeight =
        boardRef.current?.clientHeight ?? Number.POSITIVE_INFINITY

      const topBoundary = gameConfig.ballSize / 2

      const rightBoundary = boardWidth - gameConfig.ballSize / 2

      const leftBoundary = gameConfig.ballSize / 2

      const deadBoundary =
        boardHeight - gameConfig.controllerHeight - gameConfig.ballSize / 2

      if (newX > rightBoundary) {
        setSpeedX(-speedX)

        if (!props.isPreview) haptic("selection")

        return { x: rightBoundary, y: newY }
      }

      if (newX < leftBoundary) {
        setSpeedX(-speedX)

        if (!props.isPreview) haptic("selection")

        return { x: leftBoundary, y: newY }
      }

      if (newY < topBoundary) {
        setSpeedY(-speedY)

        if (!props.isPreview) haptic("selection")

        return { x: newX, y: topBoundary }
      }

      const isCollidingLeft =
        newX > controllerPosition - gameConfig.ballSize / 2

      const isCollidingRight =
        newX <
        controllerPosition + gameConfig.controllerSize + gameConfig.ballSize / 2

      const controllerTopBoundary =
        boardHeight - gameConfig.controllerHeight - gameConfig.ballSize / 2

      if (newY > controllerTopBoundary && isCollidingLeft && isCollidingRight) {
        setSpeedY(-speedY)
        if (!props.isPreview) setPoints((points) => points + 1)

        if (!props.isPreview) haptic("impactMedium")

        return {
          x: newX,
          y: controllerTopBoundary,
        }
      }

      if (newY > deadBoundary) {
        setIsDead(true)
        props.onDead?.(points)

        if (!props.isPreview) haptic("error")

        return { x: newX, y: deadBoundary }
      }

      return { x: newX, y: newY }
    })
  }, 1000 / 200)

  useScrollLock()

  return (
    <motion.div
      ref={boardRef}
      className="relative size-full"
      animate={{
        marginBottom: props.withOffset ? 0 : 96,
      }}
    >
      <div className="absolute inset-0 p-4 flex items-center justify-center">
        <Points value={points} />
      </div>

      <div
        className="absolute"
        style={{
          bottom: gameConfig.controllerOffset,
          transform: `translateX(${controllerPosition}px)`,
          width: gameConfig.controllerSize,
          height: gameConfig.controllerHeight,
        }}
      >
        <Controller />
      </div>

      <motion.div
        className="absolute bg-white"
        style={{
          translateX: ballPosition.x - gameConfig.ballSize / 2,
          translateY: ballPosition.y - gameConfig.ballSize / 2,
        }}
      >
        <motion.img
          src="/skins/hamster.webp"
          alt=""
          className={cn("transition-[width,height]")}
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 10 }}
          style={{
            width: isDead ? 0 : gameConfig.ballSize,
            height: isDead ? 0 : gameConfig.ballSize,
          }}
        />
      </motion.div>
    </motion.div>
  )
}
