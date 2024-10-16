import { useMemo, useRef, useState } from "react"
import { useScrollLock } from "usehooks-ts"
import { gameConfig } from "../../config"
import { useBallPosition } from "../hooks/useBallPosition"
import { useControllerPosition } from "../hooks/useControllerPosition"
import { useDeath } from "../hooks/useIsDead"
import { Controller } from "./controller"
import { Points } from "./points"

export const Game = () => {
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
    if (points >= 5) return 1.1

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

  useScrollLock()

  return (
    <div ref={boardRef} className="relative w-screen h-[100svh]">
      <div className="absolute inset-0 p-4">
        <div className="flex items-center justify-center">
          <Points value={points} />
        </div>
      </div>

      <div
        className="absolute"
        style={{
          bottom: gameConfig.controllerOffset,
          transform: `translateX(${controllerPosition}px)`,
        }}
      >
        <Controller />
      </div>

      <div
        className="absolute size-4 rounded-full bg-white"
        style={{
          transform: `translateX(${ballPosition.x}px) translateY(${ballPosition.y}px)`,
        }}
      ></div>
    </div>
  )
}
