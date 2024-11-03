import { GameWrapper } from "@/shared/ui/game-wrapper"
import { useLocation } from "react-router-dom"

export const Game = () => {
  const location = useLocation()

  return (
    <div className="h-full pb-safe-area-bottom">
      <GameWrapper
        mode={(location.state.mode ?? "classic") as "friend" | "classic"}
        id={Number(location.state.id)}
        coinSpawnAt={new Date(location.state.coinSpawnAt)}
      />
    </div>
  )
}
