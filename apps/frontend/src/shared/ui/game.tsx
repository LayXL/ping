import { useEffect, useMemo, useRef, useState } from "react"
import { useScrollLock } from "usehooks-ts"
import { gameConfig } from "../../config"
import { useBallPosition } from "../hooks/useBallPosition"
import { useControllerPosition } from "../hooks/useControllerPosition"
import { useDeath } from "../hooks/useIsDead"
import { cn } from "../utils/cn"
import { Controller } from "./controller"
import { Points } from "./points"

type GameProps = {
  onDead?: () => void
}

export const Game = (props: GameProps) => {
  const boardRef = useRef<HTMLDivElement>(null)

  const [points, setPoints] = useState(0)
  const [isDead, setIsDead] = useState(false)

  const controllerPosition = useControllerPosition({
    board: boardRef.current,
    isDead,
  })

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
    }
  )

  useDeath({ board: boardRef.current, ballPosition }, (val) => {
    if (val !== isDead) setIsDead(val)
  })

  useEffect(() => {
    if (isDead) props.onDead?.()
  }, [isDead, props.onDead])

  useScrollLock()

  return (
    <div ref={boardRef} className="relative size-full">
      <div className="absolute inset-0 p-4 flex items-center justify-center">
        <Points value={points} />
      </div>

      <div
        className="absolute"
        style={{
          bottom: gameConfig.controllerOffset,
          transform: `translateX(min(max(16px, ${controllerPosition}px), calc(100vw - 16px - ${gameConfig.controllerSize}px)))`,
          width: gameConfig.controllerSize,
          height: gameConfig.controllerHeight,
        }}
      >
        <Controller />
      </div>

      <div
        className={cn(
          "absolute rounded-full bg-white transition-[width,height]"
        )}
        style={{
          width: isDead ? 0 : gameConfig.ballSize,
          height: isDead ? 0 : gameConfig.ballSize,
          transform: `translateX(${ballPosition.x}px) translateY(${ballPosition.y}px)`,
        }}
      />
    </div>
  )
}
