import { useRef, useState } from "react"
import { gameConfig } from "../config"
import { useBallPosition } from "../hooks/useBallPosition"
import { useControllerPosition } from "../hooks/useControllerPosition"
import { useDeath } from "../hooks/useIsDead"
import { Controller } from "./controller"

export const Game = () => {
  const boardRef = useRef<HTMLDivElement>(null)

  const [points, setPoints] = useState(0)
  const [isDead, setIsDead] = useState(false)

  const controllerPosition = useControllerPosition({
    board: boardRef.current,
    isDead,
  })

  const [ballPosition] = useBallPosition(
    {
      board: boardRef.current,
      controllerPosition,
      isDead,
    },
    () => {
      setPoints((points) => points + 1)
    }
  )

  useDeath({ board: boardRef.current, ballPosition }, (val) => {
    if (val !== isDead) setIsDead(val)
  })

  return (
    <div ref={boardRef} className="relative w-screen h-screen">
      <div className="absolute">{points}</div>

      <div className="absolute top-4">
        <p>
          ball: {ballPosition.x}, {ballPosition.y}
        </p>
        <p>platform: {controllerPosition}</p>
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
