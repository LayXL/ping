import { motion } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"
import { useScrollLock } from "usehooks-ts"
import { gameConfig } from "../../config"
import { useBallPosition } from "../hooks/use-ball-position"
import { useControllerPosition } from "../hooks/use-controller-position"
import { cn } from "../utils/cn"
import { Controller } from "./controller"
import { Points } from "./points"

type GameProps = {
  onDead?: () => void
  withOffset?: boolean
}

export const Game = (props: GameProps) => {
  const boardRef = useRef<HTMLDivElement>(null)

  const [points, setPoints] = useState(0)
  const [isDead, setIsDead] = useState(false)

  const controllerPosition = useControllerPosition({ board: boardRef.current })

  const multiplier = useMemo(() => {
    if (points >= 50) return 2
    if (points >= 25) return 1.75
    if (points >= 10) return 1.5
    if (points >= 5) return 1.25

    return 1
  }, [points])

  const [ballPosition] = useBallPosition(
    {
      board: boardRef.current,
      controllerPosition,
      isDead,
      multiplier,
    },
    () => {
      setPoints((points) => points + 1)
    },
    () => {
      setIsDead(true)
    }
  )

  // useDeath({ board: boardRef.current, ballPosition }, (val) => {
  //   if (val !== isDead) setIsDead(val)
  // })

  useEffect(() => {
    if (isDead) props.onDead?.()
  }, [isDead, props.onDead])

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

      <motion.img
        src="/skins/hamster.webp"
        alt=""
        className={cn("absolute transition-[width,height]")}
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 10 }}
        style={{
          width: isDead ? 0 : gameConfig.ballSize,
          height: isDead ? 0 : gameConfig.ballSize,

          translateX: ballPosition.x,
          translateY: ballPosition.y,

          // transform: `translateX(${ballPosition.x}px) translateY(${ballPosition.y}px)`,
        }}
      />
    </motion.div>
  )
}
