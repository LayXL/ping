import { useMemo } from "react"
import { gameConfig } from "../../config"
import { useMousePosition } from "./use-mouse-position"

export const useControllerPosition = ({
  board,
}: { board: HTMLDivElement | null }) => {
  const pos = useMousePosition().x

  const controllerTranslation = useMemo(() => {
    return pos && board?.clientWidth ? pos / board.clientWidth : 0
  }, [board?.clientWidth, pos])

  const boardWidth = board?.clientWidth ?? 0

  const controllerPosition = useMemo(() => {
    const val =
      controllerTranslation * boardWidth - gameConfig.controllerSize / 2

    return Math.min(Math.max(val, 0), boardWidth - gameConfig.controllerSize)
  }, [controllerTranslation, boardWidth])

  return controllerPosition
}
