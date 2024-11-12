import { useEffect, useState } from "react"

type TouchPoint = {
  id: number
  x: number
  y: number
}

type MousePosition = {
  x: number | null
  y: number | null
  touches: TouchPoint[]
}

type TouchStartPosition = {
  id: number
  startX: number
  startY: number
  initialX: number
  initialY: number
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

export const useMousePosition = (
  mode: "both" | "bottom" | "top" = "both",
  disabled = false
) => {
  const [pos, setPos] = useState<MousePosition>({
    x: document.body.clientWidth / 2,
    y: 0,
    touches: [],
  })
  const [touchStartPositions, setTouchStartPositions] = useState<
    TouchStartPosition[]
  >([])

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      if (!isTouchInAllowedZone(mode, ev.clientY)) return
      setPos((prev) => ({
        ...prev,
        x: ev.clientX,
        y: ev.clientY,
      }))
    }

    const handleTouchMove = (ev: TouchEvent) => {
      ev.preventDefault()
      const newTouches: TouchPoint[] = []

      for (let i = 0; i < ev.touches.length; i++) {
        const touch = ev.touches[i]
        if (!isTouchInAllowedZone(mode, touch.clientY)) continue

        const startPosition = touchStartPositions.find(
          (start) => start.id === touch.identifier
        )

        if (startPosition) {
          const deltaX = touch.clientX - startPosition.startX
          const deltaY = touch.clientY - startPosition.startY
          const x = startPosition.initialX + deltaX
          const y = startPosition.initialY + deltaY

          newTouches.push({
            id: touch.identifier,
            x,
            y,
          })
        }
      }

      setPos((prev) => ({
        ...prev,
        touches: newTouches,
        // Update primary position to the first touch point if available
        ...(newTouches.length > 0 && {
          x: newTouches[0].x,
          y: newTouches[0].y,
        }),
      }))
    }

    const handleTouchStart = (ev: TouchEvent) => {
      ev.preventDefault()
      const newStartPositions: TouchStartPosition[] = []

      for (let i = 0; i < ev.touches.length; i++) {
        const touch = ev.touches[i]
        if (!isTouchInAllowedZone(mode, touch.clientY)) continue

        newStartPositions.push({
          id: touch.identifier,
          startX: touch.clientX,
          startY: touch.clientY,
          initialX: pos.x ?? touch.clientX,
          initialY: pos.y ?? touch.clientY,
        })
      }

      setTouchStartPositions(newStartPositions)
    }

    const handleTouchEnd = (ev: TouchEvent) => {
      ev.preventDefault()
      // Remove ended touch points from tracking
      const remainingIds = Array.from(ev.touches).map(
        (touch) => touch.identifier
      )
      setTouchStartPositions((prev) =>
        prev.filter((pos) => remainingIds.includes(pos.id))
      )
      setPos((prev) => ({
        ...prev,
        touches: prev.touches.filter((touch) =>
          remainingIds.includes(touch.id)
        ),
      }))
    }

    if (!disabled) {
      window.addEventListener("touchstart", handleTouchStart)
      window.addEventListener("touchmove", handleTouchMove)
      window.addEventListener("touchend", handleTouchEnd)
      window.addEventListener("touchcancel", handleTouchEnd)
      window.addEventListener("mousemove", updateMousePosition)
      document.body.style.touchAction = "none"
    }

    return () => {
      if (!disabled) {
        window.removeEventListener("touchstart", handleTouchStart)
        window.removeEventListener("touchmove", handleTouchMove)
        window.removeEventListener("touchend", handleTouchEnd)
        window.removeEventListener("touchcancel", handleTouchEnd)
        window.removeEventListener("mousemove", updateMousePosition)
        document.body.style.touchAction = ""
      }
    }
  }, [mode, pos.x, pos.y, touchStartPositions, disabled])

  return pos
}
