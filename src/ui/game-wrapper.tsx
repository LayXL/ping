import { useState } from "react"
import { Game } from "./game"

export const GameWrapper = () => {
  const [key, setKey] = useState(0)

  const onReset = () => {
    setKey((key) => key + 1)
  }

  return (
    <div className="relative">
      <div className="absolute right-0" onClick={onReset}>
        Reset
      </div>
      <Game key={key} />
    </div>
  )
}
