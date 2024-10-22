import { useEffect, useState } from "react"

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
    const updateMousePosition = (ev: MouseEvent | TouchEvent) => {
      let clientX: number
      let clientY: number

      if (ev instanceof MouseEvent) {
        clientX = ev.clientX
        clientY = ev.clientY
      } else if (ev instanceof TouchEvent && ev.touches.length > 0) {
        clientX = ev.touches[0].clientX
        clientY = ev.touches[0].clientY
      } else {
        return // Нет доступных данных касания
      }

      if (!isTouchInAllowedZone(mode, clientY)) return

      if (ev instanceof MouseEvent) {
        // Обработка для мыши
        setPos({ x: clientX, y: clientY })
      } else if (ev instanceof TouchEvent) {
        // Обработка для касаний
        if (
          initialPos.x === null ||
          startPos.x === null ||
          initialPos.y === null ||
          startPos.y === null
        )
          return

        const deltaX = clientX - startPos.x
        const deltaY = clientY - startPos.y

        const x = initialPos.x + deltaX
        const y = initialPos.y + deltaY

        setPos({ x, y })
      }
    }

    const updateStartPosition = (ev: PointerEvent) => {
      if (!isTouchInAllowedZone(mode, ev.clientY)) return

      setStartPos({ x: ev.clientX, y: ev.clientY })
      setInitialPos(pos)
    }

    window.addEventListener("pointerdown", updateStartPosition)
    window.addEventListener("touchmove", updateMousePosition)
    window.addEventListener("mousemove", updateMousePosition)

    document.body.style.touchAction = "none"

    return () => {
      window.removeEventListener("pointerdown", updateStartPosition)
      window.removeEventListener("touchmove", updateMousePosition)
      window.removeEventListener("mousemove", updateMousePosition)

      document.body.style.touchAction = ""
    }
  }, [initialPos.x, initialPos.y, pos, startPos.x, startPos.y, mode])

  return pos
}
