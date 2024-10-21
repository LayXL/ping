import { useEffect, useState } from "react"
import { isMobile } from "react-device-detect"

type MousePosition = {
  x: number | null
  y: number | null
}

const isTouchInAllowedZone = (mode: "top" | "bottom" | "both", y: number) => {
  const screenHeight = window.innerHeight

  if (mode === "top") {
    return y <= screenHeight / 2
  }

  if (mode === "bottom") {
    return y > screenHeight / 2
  }

  return true
}

export const useMousePosition = (mode: "both" | "bottom" | "top" = "both") => {
  const [pos, setPos] = useState<MousePosition>({
    x: document.body.clientWidth / 2,
    y: 0,
  })

  const [initialPos, setInitialPos] = useState<MousePosition>({
    x: null,
    y: null,
  })
  const [startPos, setStartPos] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setPos({ x: ev.clientX, y: ev.clientY })
    }

    const updateStartPosition = (ev: PointerEvent) => {
      if (!isTouchInAllowedZone(mode, ev.clientY)) return

      setStartPos({ x: ev.clientX, y: ev.clientY })
      setInitialPos(pos)
    }

    const updateTouchPosition = (ev: PointerEvent) => {
      if (
        initialPos.x === null ||
        startPos.x === null ||
        initialPos.y === null ||
        startPos.y === null
      )
        return

      if (!isTouchInAllowedZone(mode, ev.clientY)) return

      const deltaX = ev.clientX - startPos.x
      const deltaY = ev.clientY - startPos.y

      const x = initialPos.x + deltaX
      const y = initialPos.y + deltaY

      setPos({ x, y })
    }

    if (!isMobile) {
      window.addEventListener("mousemove", updateMousePosition)
    } else {
      window.addEventListener("pointerdown", updateStartPosition)
      window.addEventListener("pointermove", updateTouchPosition)
    }

    return () => {
      if (!isMobile) {
        window.removeEventListener("mousemove", updateMousePosition)
      } else {
        window.removeEventListener("pointerdown", updateStartPosition)
        window.removeEventListener("pointermove", updateTouchPosition)
      }
    }
  }, [initialPos.x, initialPos.y, pos, startPos.x, startPos.y, mode])

  return pos
}
