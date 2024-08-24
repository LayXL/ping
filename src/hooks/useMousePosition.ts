import { useEffect, useState } from "react"

type MousePosition = {
  x: number | null
  y: number | null
}

export const useMousePosition = (isStopUpdate = false) => {
  const [pos, setPos] = useState<MousePosition>({ x: null, y: null })

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      if (isStopUpdate) return

      setPos({ x: ev.clientX, y: ev.clientY })
    }

    if (!isStopUpdate) window.addEventListener("mousemove", updateMousePosition)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
    }
  }, [isStopUpdate])

  return pos
}
