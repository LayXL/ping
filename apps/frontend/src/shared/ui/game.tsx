import { gameConfig } from "@/config"
import { motion } from "framer-motion"
import { useMemo, useRef, useState } from "react"
import { useScrollLock } from "usehooks-ts"
import { useControllerPosition } from "../hooks/use-controller-position"
import { useHaptic } from "../hooks/use-haptic"
import { useInterval } from "../hooks/use-interval"
import { Controller } from "./controller"
import { Points } from "./points"

type GameProps = {
  mode: "classic" | "friend"
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
    : useControllerPosition({
        board: boardRef.current,
        mode: props.mode === "friend" ? "bottom" : "both",
      })

  const secondControllerPosition =
    props.mode === "friend" && props.isPreview
      ? Math.max(
          Math.min(
            ballPosition.x - gameConfig.controllerSize / 2,
            (boardRef.current?.clientWidth ?? 0) -
              gameConfig.controllerSize -
              16
          ),
          16
        )
      : useControllerPosition({ board: boardRef.current, mode: "top" })

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

      if (newY < topBoundary && props.mode === "classic") {
        setSpeedY(-speedY)

        if (!props.isPreview) haptic("selection")

        return { x: newX, y: topBoundary }
      }

      const checkIsCollidingController = (
        controllerPosition: number,
        position: "top" | "bottom"
      ) => {
        const isCollidingLeft =
          newX > controllerPosition - gameConfig.ballSize / 2

        const isCollidingRight =
          newX <
          controllerPosition +
            gameConfig.controllerSize +
            gameConfig.ballSize / 2

        const controllerBoundary =
          position === "bottom"
            ? boardHeight -
              gameConfig.controllerHeight -
              gameConfig.ballSize / 2
            : gameConfig.ballSize

        const cond =
          position === "bottom"
            ? newY > controllerBoundary
            : newY < controllerBoundary

        if (cond && isCollidingLeft && isCollidingRight) {
          setSpeedY(-speedY)
          if (!props.isPreview) setPoints((points) => points + 1)

          if (!props.isPreview) haptic("impactMedium")

          return {
            x: newX,
            y: controllerBoundary,
          }
        }
      }

      const bottomController = checkIsCollidingController(
        controllerPosition,
        "bottom"
      )

      if (bottomController) return bottomController

      if (props.mode === "friend") {
        const topController = checkIsCollidingController(
          secondControllerPosition,
          "top"
        )

        if (topController) return topController
      }

      if (
        newY > deadBoundary ||
        (newY < topBoundary && props.mode === "friend")
      ) {
        setIsDead(true)
        props.onDead?.(points)

        if (!props.isPreview) haptic("error")

        return { x: newX, y: newY }
      }

      return { x: newX, y: newY }
    })
  }, 1000 / 200)

  useScrollLock()

  return (
    <motion.div
      className="size-full"
      animate={{
        paddingTop: props.withOffset && props.mode === "friend" ? 96 : 16,
        paddingBottom: props.withOffset ? 96 : 16,
      }}
    >
      <motion.div ref={boardRef} className="relative size-full">
        {!props.isPreview && (
          <div className="absolute inset-0 p-4 flex items-center justify-center">
            <Points value={points} />
          </div>
        )}

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

        {props.mode === "friend" && (
          <div
            className="absolute"
            style={{
              top: gameConfig.controllerOffset,
              transform: `translateX(${secondControllerPosition}px)`,
              width: gameConfig.controllerSize,
              height: gameConfig.controllerHeight,
            }}
          >
            <Controller />
          </div>
        )}

        <motion.div
          className="absolute bg-white rounded-full"
          animate={{
            scale: isDead ? 0 : 1,
            opacity: isDead ? 0 : 1,
          }}
          style={{
            width: gameConfig.ballSize,
            height: gameConfig.ballSize,
            translateX: ballPosition.x - gameConfig.ballSize / 2,
            translateY: ballPosition.y - gameConfig.ballSize / 2,
          }}
        >
          {/* <motion.img
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
          /> */}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
