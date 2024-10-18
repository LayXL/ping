import { GameModeSelect } from "@/app/widgets/game-mode-select"
import { useNavigate } from "react-router-dom"

export const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="h-full pb-safe-area-bottom">
      <div className="h-full p-4 flex flex-col gap-4">
        <div className="flex-1">{/*  */}</div>

        <GameModeSelect onPlay={() => navigate("/game")} />
      </div>
    </div>
  )
}
