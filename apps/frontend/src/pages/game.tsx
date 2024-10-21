import { GameWrapper } from "@/shared/ui/game-wrapper"
import { useParams } from "react-router-dom"

export const Game = () => {
  const params = useParams()

  return (
    <div className="h-full pb-safe-area-bottom">
      <GameWrapper mode={(params.mode ?? "classic") as "friend" | "classic"} />
    </div>
  )
}
